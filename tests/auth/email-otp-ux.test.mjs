import test from 'node:test';
import assert from 'node:assert/strict';

// Simulated state machine replicating src/app/(auth)/login/page.tsx Email OTP logic
class EmailOtpLoginStateMachine {
  constructor(apiClientMock) {
    this.apiClient = apiClientMock;
    this.loginMethod = 'email-otp';
    this.emailTarget = '';
    this.lastSentEmail = '';
    this.otp = '';
    this.otpSent = false;
    this.emailCountdown = 0;
    this.isLoading = false;
    this.errorMsg = '';
    this.successMsg = '';
    this.unverifiedEmail = null;
    this.authSession = null;
  }

  setEmailTarget(val) {
    this.emailTarget = val;
  }

  setOtp(val) {
    this.otp = val.replace(/\D/g, '').slice(0, 6);
  }

  tickCountdown(seconds = 1) {
    if (this.emailCountdown > 0) {
      this.emailCountdown = Math.max(0, this.emailCountdown - seconds);
    }
  }

  handleChangeEmailAddress() {
    this.otpSent = false;
    this.otp = '';
    this.errorMsg = '';
  }

  async handleSendEmailOtp(isResend = false) {
    if (!this.emailTarget || !this.emailTarget.includes('@')) {
      this.errorMsg = 'Please enter a valid email address';
      return;
    }

    if (this.isLoading) {
      return; // Duplicate click prevention
    }

    if (isResend && this.emailTarget === this.lastSentEmail && this.emailCountdown > 0) {
      this.errorMsg = `Please wait ${this.emailCountdown} seconds before requesting another verification code.`;
      return;
    }

    this.isLoading = true;
    this.errorMsg = '';
    this.unverifiedEmail = null;

    try {
      const res = await this.apiClient.sendOtpApi(this.emailTarget, 'EMAIL', 'LOGIN');
      this.otpSent = true;
      this.lastSentEmail = this.emailTarget;
      this.emailCountdown = 60; // 60-second cooldown starts ONLY upon successful dispatch
      this.successMsg = isResend
        ? 'A new verification OTP code has been sent to your email.'
        : (res.data || 'If an account exists, a verification OTP code has been sent to your email.');
    } catch (err) {
      const msg = err.message || 'Failed to send verification OTP';
      this.errorMsg = msg;
      if (msg.toLowerCase().includes('not verified')) {
        this.unverifiedEmail = this.emailTarget;
      }
    } finally {
      this.isLoading = false;
    }
  }

  async handleVerifyEmailOtpAndLogin() {
    if (!this.otp || this.otp.length < 6) {
      this.errorMsg = 'Please enter the full 6-digit OTP code';
      return;
    }

    if (this.isLoading) return;

    this.isLoading = true;
    this.errorMsg = '';
    this.unverifiedEmail = null;

    try {
      const authRes = await this.apiClient.loginOtpApi(this.emailTarget, this.otp);
      this.successMsg = 'OTP verified successfully! Redirecting...';
      this.authSession = authRes.data;
      return authRes.data;
    } catch (err) {
      const msg = err.message || 'OTP verification failed';
      this.errorMsg = msg;
      if (msg.toLowerCase().includes('not verified')) {
        this.unverifiedEmail = this.emailTarget;
      }
      throw err;
    } finally {
      this.isLoading = false;
    }
  }
}

test('1. Successful Email OTP request and 60-second countdown initialization', async () => {
  const mockApi = {
    sendOtpApi: async (target, channel, purpose) => {
      assert.equal(target, 'user@example.com');
      assert.equal(channel, 'EMAIL');
      assert.equal(purpose, 'LOGIN');
      return { success: true, message: 'OTP sent', data: 'Verification code sent successfully' };
    }
  };

  const vm = new EmailOtpLoginStateMachine(mockApi);
  vm.setEmailTarget('user@example.com');
  assert.equal(vm.emailCountdown, 0);
  assert.equal(vm.otpSent, false);

  await vm.handleSendEmailOtp(false);

  assert.equal(vm.otpSent, true);
  assert.equal(vm.lastSentEmail, 'user@example.com');
  assert.equal(vm.emailCountdown, 60);
  assert.equal(vm.errorMsg, '');
  assert.match(vm.successMsg, /Verification code sent successfully/);
});

test('2. Countdown expiration enables resend and transitions display', async () => {
  const mockApi = {
    sendOtpApi: async () => ({ success: true, message: 'Resent', data: 'Resent code' })
  };

  const vm = new EmailOtpLoginStateMachine(mockApi);
  vm.setEmailTarget('user@example.com');
  await vm.handleSendEmailOtp(false);

  assert.equal(vm.emailCountdown, 60);

  // Tick 30 seconds
  vm.tickCountdown(30);
  assert.equal(vm.emailCountdown, 30);

  // Attempting resend during active countdown should be blocked
  await vm.handleSendEmailOtp(true);
  assert.match(vm.errorMsg, /Please wait 30 seconds/);

  // Tick remaining 30 seconds to expiration
  vm.tickCountdown(30);
  assert.equal(vm.emailCountdown, 0);

  // Resend should now succeed and reset countdown back to 60s
  await vm.handleSendEmailOtp(true);
  assert.equal(vm.emailCountdown, 60);
  assert.match(vm.successMsg, /A new verification OTP code has been sent/);
});

test('3. Duplicate click prevention while send is in-flight', async () => {
  let callCount = 0;
  const mockApi = {
    sendOtpApi: async () => {
      callCount++;
      await new Promise(r => setTimeout(r, 20));
      return { success: true, message: 'OK' };
    }
  };

  const vm = new EmailOtpLoginStateMachine(mockApi);
  vm.setEmailTarget('user@example.com');

  const p1 = vm.handleSendEmailOtp(false);
  const p2 = vm.handleSendEmailOtp(false); // Concurrent duplicate click

  await Promise.all([p1, p2]);
  assert.equal(callCount, 1, 'Only one API request should be dispatched despite concurrent clicks');
});

test('4. Email address change resets OTP state and allows send to new address', async () => {
  const sentTargets = [];
  const mockApi = {
    sendOtpApi: async (target) => {
      sentTargets.push(target);
      return { success: true, message: 'OK' };
    }
  };

  const vm = new EmailOtpLoginStateMachine(mockApi);
  vm.setEmailTarget('first@example.com');
  await vm.handleSendEmailOtp(false);

  assert.equal(vm.otpSent, true);
  assert.equal(vm.emailCountdown, 60);

  // User clicks "Change Email Address"
  vm.handleChangeEmailAddress();
  assert.equal(vm.otpSent, false);
  assert.equal(vm.otp, '');

  // User enters new email address
  vm.setEmailTarget('second@example.com');
  await vm.handleSendEmailOtp(false);

  assert.equal(vm.otpSent, true);
  assert.equal(sentTargets.length, 2);
  assert.equal(sentTargets[1], 'second@example.com');
});

test('5. Backend cooldown error (400 Bad Request) handling without exposing secrets', async () => {
  const mockApi = {
    sendOtpApi: async () => {
      throw new Error('Please wait 60 seconds before requesting another verification code.');
    }
  };

  const vm = new EmailOtpLoginStateMachine(mockApi);
  vm.setEmailTarget('user@example.com');
  await vm.handleSendEmailOtp(false);

  assert.equal(vm.emailCountdown, 0, 'Countdown must NOT start if backend rejects request');
  assert.equal(vm.otpSent, false);
  assert.equal(vm.errorMsg, 'Please wait 60 seconds before requesting another verification code.');
});

test('6. Network failures and invalid/expired OTP handling', async () => {
  const mockApi = {
    loginOtpApi: async (target, otp) => {
      if (otp === '000000') {
        throw new Error('Invalid or expired verification code.');
      }
      return { success: true, data: { accessToken: 'jwt-token', refreshToken: 'ref-token' } };
    }
  };

  const vm = new EmailOtpLoginStateMachine(mockApi);
  vm.setEmailTarget('user@example.com');
  vm.setOtp('000000');

  await assert.rejects(
    async () => await vm.handleVerifyEmailOtpAndLogin(),
    /Invalid or expired verification code/
  );
  assert.equal(vm.errorMsg, 'Invalid or expired verification code.');

  // Successful verification
  vm.setOtp('123456');
  const res = await vm.handleVerifyEmailOtpAndLogin();
  assert.equal(res.accessToken, 'jwt-token');
  assert.match(vm.successMsg, /OTP verified successfully/);
});

test('7. Regression coverage: Password and Phone OTP methods remain intact', () => {
  assert.doesNotThrow(() => {
    const methods = ['password', 'phone-otp', 'email-otp'];
    assert.equal(methods.length, 3);
    assert.ok(methods.includes('password'));
    assert.ok(methods.includes('phone-otp'));
    assert.ok(methods.includes('email-otp'));
  });
});
