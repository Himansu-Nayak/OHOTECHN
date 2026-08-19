'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, KeyRound, Mail, Phone, Lock, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { sendOtpApi, verifyOtpApi } from '@/api/auth';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const { showToast } = useToast();
  
  const [loginMethod, setLoginMethod] = useState<'password' | 'otp'>('password');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      await login({ username, password });
      setSuccessMsg('Login successful! Redirecting...');
      showToast('Welcome back to OHO TECH!', 'success');
      setTimeout(() => {
        router.push('/products');
      }, 800);
    } catch (err: any) {
      setErrorMsg(err.message || 'An error occurred during login');
      showToast(err.message || 'Login failed', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendOtp = async () => {
    if (!phone) {
      setErrorMsg('Please enter your phone number');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');

    try {
      const res = await sendOtpApi(phone, 'PHONE');
      if (!res.success) {
        throw new Error(res.message || 'Failed to send OTP.');
      }

      setOtpSent(true);
      setSuccessMsg('OTP sent successfully to your phone!');
      showToast('OTP sent to your phone!', 'info');
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to send OTP');
      showToast(err.message || 'Failed to send OTP', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');

    try {
      const res = await verifyOtpApi(phone, otp);
      if (!res.success || !res.data) {
        throw new Error(res.message || 'Invalid or expired OTP.');
      }

      setSuccessMsg('OTP verified successfully!');
      showToast('OTP Verified!', 'success');
    } catch (err: any) {
      setErrorMsg(err.message || 'OTP verification failed');
      showToast(err.message || 'OTP Verification failed', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass = 'w-full px-4 py-3 rounded-2xl bg-[#fafafa] border-2 border-slate-200 text-xs font-medium text-[#0d0d0e] placeholder:text-slate-400 focus:outline-none focus:border-sky-500 transition-colors';
  const labelClass = 'block text-xs font-mono font-bold text-slate-700 uppercase tracking-wider mb-2';

  return (
    <div className="bg-[#f7f7f5] text-[#0d0d0e] min-h-screen pb-16 pt-28 sm:pt-36 px-3 sm:px-6 lg:px-8">
      <main className="max-w-md w-full mx-auto" id="login-main">
        <div className="bg-white border-2 border-slate-300 rounded-[32px] p-8 shadow-sm">
          <div className="text-center mb-8">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#0d0d0e] mb-2">
              Sign In to <span className="text-sky-600">OHO TECHN</span>
            </h1>
            <p className="text-xs font-medium text-slate-600">
              Access your cloud services, project portal, and subscriptions.
            </p>
          </div>

          {/* Toggle Tabs */}
          <div className="flex bg-slate-100 p-1 rounded-2xl mb-6">
            <button
              type="button"
              onClick={() => { setLoginMethod('password'); setErrorMsg(''); setSuccessMsg(''); }}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                loginMethod === 'password'
                  ? 'bg-white text-[#0d0d0e] shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Password Login
            </button>
            <button
              type="button"
              onClick={() => { setLoginMethod('otp'); setErrorMsg(''); setSuccessMsg(''); }}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                loginMethod === 'otp'
                  ? 'bg-white text-[#0d0d0e] shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Phone OTP
            </button>
          </div>

          {errorMsg && (
            <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-medium flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
          )}

          {loginMethod === 'password' ? (
            <form onSubmit={handlePasswordLogin} className="space-y-4">
              <div>
                <label className={labelClass}>Email or Phone Number</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className={inputClass}
                  placeholder="admin@ohotech.com or +919876543210"
                  required
                />
              </div>

              <div>
                <label className={labelClass}>Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={inputClass}
                  placeholder="••••••••••••"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 px-6 rounded-2xl bg-[#0d0d0e] hover:bg-sky-600 text-white font-extrabold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isLoading ? 'Signing In...' : 'Sign In'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div>
                <label className={labelClass}>Phone Number</label>
                <div className="flex gap-2">
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className={inputClass}
                    placeholder="+91 98765 43210"
                    required
                  />
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    disabled={isLoading || !phone}
                    className="px-4 py-3 bg-slate-800 hover:bg-black text-white rounded-2xl text-xs font-bold whitespace-nowrap disabled:opacity-50"
                  >
                    Send OTP
                  </button>
                </div>
              </div>

              {otpSent && (
                <div>
                  <label className={labelClass}>6-Digit OTP</label>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className={inputClass}
                    placeholder="Enter 6-digit code"
                    maxLength={6}
                    required
                  />
                </div>
              )}

              {otpSent && (
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 px-6 rounded-2xl bg-[#0d0d0e] hover:bg-sky-600 text-white font-extrabold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isLoading ? 'Verifying...' : 'Verify OTP & Login'}
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </form>
          )}

          <div className="mt-8 pt-6 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-600">
              Don't have an account yet?{' '}
              <Link href="/register" className="font-bold text-sky-600 hover:underline">
                Create Account
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
