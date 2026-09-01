'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowRight, KeyRound, Mail, Lock, Eye, EyeOff, AlertCircle, CheckCircle2, ShieldCheck } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { sendOtpApi } from '@/api/auth';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, loginOtp } = useAuth();
  const { showToast } = useToast();
  
  const [loginMethod, setLoginMethod] = useState<'password' | 'email-otp'>('password');
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [emailTarget, setEmailTarget] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [unverifiedEmail, setUnverifiedEmail] = useState<string | null>(null);

  useEffect(() => {
    if (searchParams?.get('verified') === 'true') {
      setSuccessMsg('Email verified successfully! You can now sign in to your account.');
    }
  }, [searchParams]);

  const redirectAfterLogin = (userRole?: string) => {
    if (userRole === 'ROLE_ADMIN' || userRole === 'ADMIN') {
      router.push('/admin');
    } else if (userRole === 'ROLE_DEVELOPER' || userRole === 'DEVELOPER') {
      router.push('/developer');
    } else {
      router.push('/products');
    }
  };

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

  const inputClass = 'w-full px-4 py-3.5 rounded-2xl bg-[#fafafa] border-2 border-slate-200 text-xs font-medium text-[#0d0d0e] placeholder:text-slate-400 focus:outline-none focus:border-sky-500 transition-colors';
  const labelClass = 'block text-xs font-mono font-bold text-slate-700 uppercase tracking-wider mb-2';

  return (
    <div className="bg-[#f7f7f5] text-[#0d0d0e] min-h-screen pb-16 pt-28 sm:pt-36 px-3 sm:px-6 lg:px-8 selection:bg-[#0d0d0e] selection:text-white">
      <main className="max-w-md w-full mx-auto" id="login-main">
        
        <div className="bg-white border-2 border-slate-300 rounded-[32px] sm:rounded-[44px] p-8 sm:p-10 shadow-sm relative overflow-hidden">
          
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-sky-700 font-mono text-[11px] font-bold uppercase tracking-wider mb-3">
              <ShieldCheck className="w-3.5 h-3.5 text-sky-600" />
              UNIFIED PORTAL AUTHENTICATION
            </div>
            
            <h1 className="text-2xl sm:text-3xl font-black text-[#0d0d0e] tracking-tight mb-2">
              Account Login
            </h1>
            
            <p className="text-xs text-slate-500 font-mono">
              Sign in with your registered account (Client, Admin, or Developer)
            </p>
          </div>

          {/* Toggle Login Method */}
          <div className="grid grid-cols-2 gap-1.5 p-1.5 bg-[#fafafa] border border-slate-200 rounded-2xl mb-6 text-[11px] font-mono font-bold">
            <button
              type="button"
              onClick={() => { setLoginMethod('password'); setOtpSent(false); setOtp(''); setErrorMsg(''); setSuccessMsg(''); setUnverifiedEmail(null); }}
              className={`py-2 px-1 rounded-xl transition-all cursor-pointer text-center ${
                loginMethod === 'password' ? 'bg-[#0d0d0e] text-white shadow-sm' : 'text-slate-600 hover:text-black'
              }`}
            >
              Password Login
            </button>

            <button
              type="button"
              onClick={() => { setLoginMethod('email-otp'); setOtpSent(false); setOtp(''); setErrorMsg(''); setSuccessMsg(''); setUnverifiedEmail(null); }}
              className={`py-2 px-1 rounded-xl transition-all cursor-pointer text-center ${
                loginMethod === 'email-otp' ? 'bg-[#0d0d0e] text-white shadow-sm' : 'text-slate-600 hover:text-black'
              }`}
            >
              Email OTP Login
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

          {/* Option A: Password Login Form */}
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
                disabled={isLoading}
                className="w-full py-4 rounded-full bg-[#0d0d0e] hover:bg-sky-600 text-white font-extrabold text-xs uppercase tracking-wider transition-all duration-200 shadow-md flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                <span>{isLoading ? 'Signing In...' : 'Sign In To Account'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* Option B: Email OTP Login Form */}
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
                      className="text-xs font-mono text-slate-500 hover:text-black underline"
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
