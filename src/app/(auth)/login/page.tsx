'use client';

import React, { useState, useEffect, useRef, Suspense, useCallback } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowRight, KeyRound, Mail, Lock, Eye, EyeOff, AlertCircle, CheckCircle2, ShieldCheck, Phone } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { sendOtpApi } from '@/api/auth';
import { auth, googleProvider } from '@/lib/firebase';
import {
  signInWithPopup,
  signInWithPhoneNumber,
  RecaptchaVerifier,
  ConfirmationResult,
} from 'firebase/auth';

// Isolated, memoized reCAPTCHA component unaffected by parent typing state
const RecaptchaWidget = React.memo(function RecaptchaWidget({
  onSolved,
  onExpired,
  onReady,
}: {
  onSolved: () => void;
  onExpired: () => void;
  onReady: (verifier: RecaptchaVerifier) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || typeof window === 'undefined') return;

    let verifier: RecaptchaVerifier | null = null;
    let isMounted = true;

    try {
      containerRef.current.innerHTML = '';

      verifier = new RecaptchaVerifier(auth, containerRef.current, {
        size: 'normal',
        callback: () => {
          if (isMounted) onSolved();
        },
        'expired-callback': () => {
          if (isMounted) onExpired();
        },
      });

      verifier.render().then(() => {
        if (isMounted && verifier) {
          onReady(verifier);
        }
      }).catch((err) => {
        console.error('reCAPTCHA render error:', err);
      });
    } catch (err) {
      console.error('reCAPTCHA initialization error:', err);
    }

    return () => {
      isMounted = false;
      if (verifier) {
        try {
          verifier.clear();
        } catch {
          // ignore
        }
      }
    };
  }, [onSolved, onExpired, onReady]);

  return (
    <div
      ref={containerRef}
      className="flex justify-center items-center min-h-[78px]"
    />
  );
});

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, loginOtp, loginWithFirebase } = useAuth();
  const { showToast } = useToast();
  
  const [loginMethod, setLoginMethod] = useState<'password' | 'email-otp' | 'phone-otp'>('password');
  const [showPassword, setShowPassword] = useState(false);
  
  // Password Login State
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  // Email OTP State
  const [emailTarget, setEmailTarget] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  
  // Phone OTP State
  const [phoneNumber, setPhoneNumber] = useState('');
  const [phoneOtp, setPhoneOtp] = useState('');
  const [phoneOtpSent, setPhoneOtpSent] = useState(false);
  const [phoneCountdown, setPhoneCountdown] = useState(0);
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [isRecaptchaSolved, setIsRecaptchaSolved] = useState(false);
  const recaptchaVerifierRef = useRef<RecaptchaVerifier | null>(null);
  
  // Global & Provider Loading States
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isPhoneLoading, setIsPhoneLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [unverifiedEmail, setUnverifiedEmail] = useState<string | null>(null);

  useEffect(() => {
    if (searchParams?.get('verified') === 'true') {
      setSuccessMsg('Email verified successfully! You can now sign in to your account.');
    }
  }, [searchParams]);

  // Phone OTP Countdown Timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (phoneCountdown > 0) {
      timer = setTimeout(() => setPhoneCountdown((prev) => prev - 1), 1000);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [phoneCountdown]);

  // Cleanup recaptcha verifier when switching methods or unmounting
  useEffect(() => {
    return () => {
      setIsRecaptchaSolved(false);
      if (recaptchaVerifierRef.current) {
        try {
          recaptchaVerifierRef.current.clear();
        } catch {
          // ignore cleanup errors
        }
        recaptchaVerifierRef.current = null;
      }
    };
  }, [loginMethod]);

  const redirectAfterLogin = (userRole?: string) => {
    if (userRole === 'ROLE_ADMIN' || userRole === 'ADMIN') {
      router.push('/admin');
    } else if (userRole === 'ROLE_DEVELOPER' || userRole === 'DEVELOPER') {
      router.push('/developer');
    } else {
      router.push('/products');
    }
  };

  const mapFirebaseError = (error: any): string => {
    const code = error?.code || '';
    if (code === 'auth/popup-closed-by-user' || code === 'auth/cancelled-popup-request') {
      return 'Google sign-in was cancelled.';
    }
    if (code === 'auth/popup-blocked') {
      return 'Google sign-in popup was blocked by your browser. Please allow popups for this site.';
    }
    if (code === 'auth/invalid-phone-number') {
      return 'Please enter a valid 10-digit Indian phone number.';
    }
    if (code === 'auth/too-many-requests') {
      return 'Too many SMS requests. Please try again later or use Password login.';
    }
    if (code === 'auth/invalid-verification-code') {
      return 'Incorrect 6-digit OTP code. Please check and try again.';
    }
    if (code === 'auth/code-expired') {
      return 'The OTP verification code has expired. Please request a new code.';
    }
    if (code === 'auth/quota-exceeded') {
      return 'SMS quota exceeded for today. Please try another login method.';
    }
    if (code === 'auth/captcha-check-failed') {
      return 'reCAPTCHA verification failed. Please refresh the page and try again.';
    }
    if (code === 'auth/api-key-not-valid' || (error?.message && error.message.includes('api-key-not-valid'))) {
      return 'Firebase configuration updated. Please refresh your browser tab (Ctrl + F5).';
    }
    if (code === 'auth/network-request-failed' || (error?.message && error.message.includes('network-request-failed'))) {
      return 'Network connection blocked. This is almost always caused by an Ad Blocker (uBlock Origin, AdGuard, Brave Shields) blocking Google reCAPTCHA scripts on localhost. Please disable ad-blockers for localhost or open in an Incognito / Private window.';
    }
    if (code === 'auth/operation-not-allowed' || (error?.message && error.message.includes('operation-not-allowed'))) {
      return 'SMS is not enabled for India (+91) in Firebase Console. Please add India (+91) in Firebase Console > Authentication > Settings > SMS Region Policy, or add test phone numbers.';
    }
    if (code === 'auth/billing-not-enabled' || (error?.message && error.message.includes('billing-not-enabled'))) {
      return 'Real SMS delivery requires a Firebase Blaze plan (billing enabled). For testing, add your phone number under Firebase Console > Authentication > Sign-in method > Phone > "Phone numbers for testing" with code 123456.';
    }
    if (code === 'auth/invalid-app-credential' || (error?.message && error.message.includes('invalid-app-credential'))) {
      return 'Phone verification credential rejected by Firebase. Please verify that "localhost" is in Firebase Console > Authentication > Settings > Authorized Domains, and App Check is not blocking Phone Auth.';
    }
    return error?.message || 'Authentication failed. Please try again.';
  };

  // Google Sign In Handler
  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    setErrorMsg('');
    setSuccessMsg('');
    setUnverifiedEmail(null);

    try {
      const result = await signInWithPopup(auth, googleProvider);
      const idToken = await result.user.getIdToken();
      
      setSuccessMsg('Google verified. Establishing secure session...');
      const authRes = await loginWithFirebase(idToken);
      
      setSuccessMsg('Login successful! Redirecting...');
      showToast('Welcome back to OHO TECH!', 'success');
      setTimeout(() => {
        redirectAfterLogin(authRes.user?.role);
      }, 700);
    } catch (err: any) {
      const msg = mapFirebaseError(err);
      setErrorMsg(msg);
      showToast(msg, 'error');
    } finally {
      setIsGoogleLoading(false);
    }
  };

  // Password Login Handler
  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');
    setSuccessMsg('');
    setUnverifiedEmail(null);

    try {
      const authRes = await login({ username, password });
      setSuccessMsg('Login successful! Redirecting...');
      showToast('Welcome back to OHO TECH!', 'success');
      
      setTimeout(() => {
        redirectAfterLogin(authRes.user?.role);
      }, 700);
    } catch (err: any) {
      const msg = err.message || 'An error occurred during login';
      setErrorMsg(msg);
      showToast(msg, 'error');

      if (msg.toLowerCase().includes('not verified')) {
        setUnverifiedEmail(username.includes('@') ? username : null);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Email OTP Handlers
  const handleSendEmailOtp = async () => {
    if (!emailTarget || !emailTarget.includes('@')) {
      setErrorMsg('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');
    setUnverifiedEmail(null);

    try {
      const res = await sendOtpApi(emailTarget, 'EMAIL', 'LOGIN');
      setOtpSent(true);
      setSuccessMsg(res.data || 'If an account exists, a verification OTP code has been sent to your email.');
      showToast('Verification OTP sent to email', 'info');
    } catch (err: any) {
      const msg = err.message || 'Failed to send verification OTP';
      setErrorMsg(msg);
      showToast(msg, 'error');
      if (msg.toLowerCase().includes('not verified')) {
        setUnverifiedEmail(emailTarget);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyEmailOtpAndLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp || otp.length < 6) {
      setErrorMsg('Please enter the full 6-digit OTP code');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');
    setUnverifiedEmail(null);

    try {
      const authRes = await loginOtp(emailTarget, otp);
      setSuccessMsg('OTP verified successfully! Redirecting...');
      showToast('Welcome back to OHO TECH!', 'success');
      
      setTimeout(() => {
        redirectAfterLogin(authRes.user?.role);
      }, 700);
    } catch (err: any) {
      const msg = err.message || 'OTP verification failed';
      setErrorMsg(msg);
      showToast(msg, 'error');
      if (msg.toLowerCase().includes('not verified')) {
        setUnverifiedEmail(emailTarget);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Memoized reCAPTCHA callbacks to keep RecaptchaWidget isolated
  const handleRecaptchaSolved = useCallback(() => {
    setIsRecaptchaSolved(true);
    setErrorMsg('');
  }, []);

  const handleRecaptchaExpired = useCallback(() => {
    setIsRecaptchaSolved(false);
    setErrorMsg('reCAPTCHA verification expired. Please tick the checkbox again.');
  }, []);

  const handleRecaptchaReady = useCallback((verifier: RecaptchaVerifier) => {
    recaptchaVerifierRef.current = verifier;
  }, []);

  const handleSendPhoneOtp = async () => {
    const rawNumber = phoneNumber.replace(/\D/g, '');
    if (rawNumber.length !== 10) {
      setErrorMsg('Please enter a valid 10-digit mobile number.');
      return;
    }

    const verifier = recaptchaVerifierRef.current;
    if (!verifier || !isRecaptchaSolved) {
      setErrorMsg('Please tick the "I\'m not a robot" checkbox first.');
      return;
    }

    const formattedNumber = `+91${rawNumber}`;
    setIsPhoneLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const confirmation = await signInWithPhoneNumber(auth, formattedNumber, verifier);
      setConfirmationResult(confirmation);
      setPhoneOtpSent(true);
      setPhoneCountdown(60);
      setSuccessMsg(`OTP sent successfully to ${formattedNumber}`);
      showToast('SMS OTP sent to mobile number', 'info');
    } catch (err: any) {
      console.error('Phone OTP send error:', err);
      const msg = mapFirebaseError(err);
      setErrorMsg(msg);
      showToast(msg, 'error');
      setIsRecaptchaSolved(false);
    } finally {
      setIsPhoneLoading(false);
    }
  };

  const handleVerifyPhoneOtpAndLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneOtp || phoneOtp.length < 6) {
      setErrorMsg('Please enter the full 6-digit SMS OTP code.');
      return;
    }

    if (!confirmationResult) {
      setErrorMsg('Session expired. Please request a new OTP.');
      return;
    }

    setIsPhoneLoading(true);
    setErrorMsg('');

    try {
      const userCredential = await confirmationResult.confirm(phoneOtp);
      const idToken = await userCredential.user.getIdToken();
      
      setSuccessMsg('Phone verified. Authenticating with server...');
      const authRes = await loginWithFirebase(idToken);
      
      setSuccessMsg('Login successful! Redirecting...');
      showToast('Welcome back to OHO TECH!', 'success');
      
      setTimeout(() => {
        redirectAfterLogin(authRes.user?.role);
      }, 700);
    } catch (err: any) {
      console.error('Phone OTP verification error:', err);
      const msg = mapFirebaseError(err);
      setErrorMsg(msg);
      showToast(msg, 'error');
    } finally {
      setIsPhoneLoading(false);
    }
  };

  const inputClass = 'w-full px-4 py-3.5 rounded-2xl bg-[#fafafa] border-2 border-slate-200 text-xs font-medium text-[#0d0d0e] placeholder:text-slate-400 focus:outline-none focus:border-sky-500 transition-colors';
  const labelClass = 'block text-xs font-mono font-bold text-slate-700 uppercase tracking-wider mb-2';

  return (
    <div className="bg-[#f7f7f5] text-[#0d0d0e] min-h-screen pb-16 pt-28 sm:pt-36 px-3 sm:px-6 lg:px-8 selection:bg-[#0d0d0e] selection:text-white">
      <main className="max-w-md w-full mx-auto" id="login-main">
        
        {/* Invisible container for Firebase reCAPTCHA */}
        <div id="recaptcha-container"></div>

        <div className="bg-white border-2 border-slate-300 rounded-[32px] sm:rounded-[44px] p-8 sm:p-10 shadow-sm relative overflow-hidden">
          
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-sky-700 font-mono text-[11px] font-bold uppercase tracking-wider mb-3">
              <ShieldCheck className="w-3.5 h-3.5 text-sky-600" />
              UNIFIED PORTAL AUTHENTICATION
            </div>
            
            <h1 className="text-2xl sm:text-3xl font-black text-[#0d0d0e] tracking-tight mb-2">
              Account Login
            </h1>
            
            <p className="text-xs text-slate-500 font-mono">
              Sign in with Google, Phone OTP, or your registered credentials
            </p>
          </div>

          {/* Social Login: Continue with Google */}
          <div className="mb-5">
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isLoading || isGoogleLoading || isPhoneLoading}
              className="w-full py-3.5 px-4 rounded-2xl border-2 border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-[#0d0d0e] font-extrabold text-xs tracking-tight transition-all flex items-center justify-center gap-3 cursor-pointer disabled:opacity-50 shadow-xs active:scale-[0.99]"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
                <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"/>
                <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
              </svg>
              <span>{isGoogleLoading ? 'Signing In with Google...' : 'Continue with Google'}</span>
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-slate-200" />
            <span className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider">Or continue with</span>
            <div className="flex-1 h-px bg-slate-200" />
          </div>

          {/* Toggle Login Method: 3 Tabs */}
          <div className="grid grid-cols-3 gap-1 p-1.5 bg-[#fafafa] border border-slate-200 rounded-2xl mb-6 text-[11px] font-mono font-bold">
            <button
              type="button"
              onClick={() => {
                setLoginMethod('password');
                setErrorMsg('');
                setSuccessMsg('');
                setUnverifiedEmail(null);
              }}
              className={`py-2 px-1 rounded-xl transition-all cursor-pointer text-center ${
                loginMethod === 'password' ? 'bg-[#0d0d0e] text-white shadow-sm' : 'text-slate-600 hover:text-black'
              }`}
            >
              Password
            </button>

            <button
              type="button"
              onClick={() => {
                setLoginMethod('phone-otp');
                setErrorMsg('');
                setSuccessMsg('');
                setUnverifiedEmail(null);
              }}
              className={`py-2 px-1 rounded-xl transition-all cursor-pointer text-center ${
                loginMethod === 'phone-otp' ? 'bg-[#0d0d0e] text-white shadow-sm' : 'text-slate-600 hover:text-black'
              }`}
            >
              Phone OTP
            </button>

            <button
              type="button"
              onClick={() => {
                setLoginMethod('email-otp');
                setErrorMsg('');
                setSuccessMsg('');
                setUnverifiedEmail(null);
              }}
              className={`py-2 px-1 rounded-xl transition-all cursor-pointer text-center ${
                loginMethod === 'email-otp' ? 'bg-[#0d0d0e] text-white shadow-sm' : 'text-slate-600 hover:text-black'
              }`}
            >
              Email OTP
            </button>
          </div>

          {/* Feedback Banners */}
          {errorMsg && (
            <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-mono flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{errorMsg}</span>
              </div>
              {unverifiedEmail && (
                <div className="mt-2 pt-2 border-t border-rose-200">
                  <Link
                    href={`/verify-email?email=${encodeURIComponent(unverifiedEmail)}`}
                    className="inline-flex items-center gap-1 text-sky-700 font-bold underline hover:text-sky-800"
                  >
                    <span>Click here to verify your email now</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              )}
            </div>
          )}

          {successMsg && (
            <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-mono flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Option 1: Password Login Form */}
          {loginMethod === 'password' && (
            <form onSubmit={handlePasswordLogin} className="space-y-5">
              <div>
                <label className={labelClass}>Email or Phone Number</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="name@company.com or phone"
                    required
                    className={`${inputClass} pl-11`}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className={labelClass}>Password</label>
                  <Link href="/forgot-password" className="text-[11px] font-mono font-bold text-sky-600 hover:text-sky-700 hover:underline">
                    Forgot Password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className={`${inputClass} pl-11 pr-11`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading || isGoogleLoading || isPhoneLoading}
                className="w-full py-4 rounded-full bg-[#0d0d0e] hover:bg-sky-600 text-white font-extrabold text-xs uppercase tracking-wider transition-all duration-200 shadow-md flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                <span>{isLoading ? 'Signing In...' : 'Sign In To Account'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* Option 2: Firebase Phone OTP Form */}
          {loginMethod === 'phone-otp' && (
            <div className="space-y-5">
              {!phoneOtpSent ? (
                <div>
                  <label className={labelClass}>Mobile Number (India)</label>
                  <div className="relative flex items-center">
                    <div className="absolute left-4 z-10 flex items-center gap-1.5 text-slate-700 font-mono font-bold text-xs pointer-events-none">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <span>+91</span>
                      <span className="text-slate-300">|</span>
                    </div>
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      placeholder="9876543210"
                      maxLength={10}
                      required
                      className={`${inputClass} pl-20 font-mono tracking-wider text-sm font-semibold`}
                    />
                  </div>
                  <p className="text-[11px] font-mono text-slate-400 mt-2">
                    Standard SMS rates may apply. Protected by Google reCAPTCHA.
                  </p>

                  {/* Visible Google reCAPTCHA Box */}
                  <div className="my-4 flex flex-col items-center justify-center min-h-[82px] overflow-hidden rounded-xl border border-slate-200 bg-slate-50/50 p-2">
                    <RecaptchaWidget
                      onSolved={handleRecaptchaSolved}
                      onExpired={handleRecaptchaExpired}
                      onReady={handleRecaptchaReady}
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handleSendPhoneOtp}
                    disabled={isPhoneLoading || phoneNumber.length < 10 || !isRecaptchaSolved}
                    className="w-full mt-2 py-4 rounded-full bg-[#0d0d0e] hover:bg-sky-600 text-white font-extrabold text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                  >
                    <span>
                      {isPhoneLoading
                        ? 'Sending SMS...'
                        : !isRecaptchaSolved
                        ? 'Verify "I\'m not a robot" above'
                        : 'Send Phone OTP'}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <form onSubmit={handleVerifyPhoneOtpAndLogin} className="space-y-5">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className={labelClass}>6-Digit Mobile OTP</label>
                      <span className="text-[11px] font-mono text-slate-500 font-bold">
                        +91 {phoneNumber}
                      </span>
                    </div>
                    <div className="relative">
                      <KeyRound className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={phoneOtp}
                        onChange={(e) => setPhoneOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                        placeholder="123456"
                        maxLength={6}
                        autoFocus
                        required
                        className={`${inputClass} pl-11 tracking-widest font-mono text-center text-sm font-bold`}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isPhoneLoading || phoneOtp.length < 6}
                    className="w-full py-4 rounded-full bg-[#0d0d0e] hover:bg-sky-600 text-white font-extrabold text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                  >
                    <span>{isPhoneLoading ? 'Verifying OTP...' : 'Verify OTP & Sign In'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <div className="flex items-center justify-between pt-2 text-xs font-mono">
                    <button
                      type="button"
                      onClick={() => {
                        setPhoneOtpSent(false);
                        setPhoneOtp('');
                        setErrorMsg('');
                      }}
                      className="text-slate-500 hover:text-black underline cursor-pointer"
                    >
                      Change Number
                    </button>

                    {phoneCountdown > 0 ? (
                      <span className="text-slate-400">Resend in {phoneCountdown}s</span>
                    ) : (
                      <button
                        type="button"
                        onClick={handleSendPhoneOtp}
                        disabled={isPhoneLoading}
                        className="text-sky-600 hover:text-sky-700 font-bold underline cursor-pointer"
                      >
                        Resend OTP
                      </button>
                    )}
                  </div>
                </form>
              )}
            </div>
          )}

          {/* Option 3: Email OTP Login Form */}
          {loginMethod === 'email-otp' && (
            <form onSubmit={handleVerifyEmailOtpAndLogin} className="space-y-5">
              <div>
                <label className={labelClass}>Registered Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={emailTarget}
                    onChange={(e) => setEmailTarget(e.target.value)}
                    placeholder="name@company.com"
                    disabled={otpSent}
                    required
                    className={`${inputClass} pl-11`}
                  />
                </div>
              </div>

              {!otpSent ? (
                <button
                  type="button"
                  onClick={handleSendEmailOtp}
                  disabled={isLoading}
                  className="w-full py-3.5 rounded-full bg-slate-900 hover:bg-sky-600 text-white font-extrabold text-xs uppercase tracking-wider transition-all shadow-md cursor-pointer disabled:opacity-50"
                >
                  {isLoading ? 'Sending OTP...' : 'Send Email OTP Code'}
                </button>
              ) : (
                <>
                  <div>
                    <label className={labelClass}>6-Digit Email OTP Code</label>
                    <div className="relative">
                      <KeyRound className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                        placeholder="123456"
                        maxLength={6}
                        required
                        className={`${inputClass} pl-11 tracking-widest font-mono text-center text-sm font-bold`}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-4 rounded-full bg-[#0d0d0e] hover:bg-sky-600 text-white font-extrabold text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                  >
                    <span>{isLoading ? 'Verifying...' : 'Verify OTP & Login'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <div className="text-center pt-2">
                    <button
                      type="button"
                      onClick={() => setOtpSent(false)}
                      className="text-xs font-mono text-slate-500 hover:text-black underline cursor-pointer"
                    >
                      Change Email Address
                    </button>
                  </div>
                </>
              )}
            </form>
          )}

          {/* Register Callout Footer */}
          <div className="mt-8 pt-6 border-t border-slate-200 text-center font-mono text-xs text-slate-500 flex items-center justify-between">
            <span>Don't have an account?</span>
            <Link href="/register" className="font-bold text-sky-600 hover:text-sky-700 underline">
              Create New Account
            </Link>
          </div>

        </div>

      </main>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#f7f7f5]" />}>
      <LoginContent />
    </Suspense>
  );
}
