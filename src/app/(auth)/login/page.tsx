'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, KeyRound, Mail, Phone, Lock, AlertCircle, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';
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
      const authRes = await login({ username, password });
      setSuccessMsg('Login successful! Redirecting...');
      showToast('Welcome back to OHO TECH!', 'success');
      
      setTimeout(() => {
        const userRole = authRes.user?.role;
        if (userRole === 'ROLE_ADMIN' || userRole === 'ADMIN') {
          router.push('/admin');
        } else if (userRole === 'ROLE_DEVELOPER' || userRole === 'DEVELOPER') {
          router.push('/developer');
        } else {
          router.push('/products');
        }
      }, 700);
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
          <div className="grid grid-cols-2 gap-2 p-1.5 bg-[#fafafa] border border-slate-200 rounded-2xl mb-6 text-xs font-mono font-bold">
            <button
              type="button"
              onClick={() => { setLoginMethod('password'); setErrorMsg(''); setSuccessMsg(''); }}
              className={`py-2 rounded-xl transition-all cursor-pointer ${
                loginMethod === 'password' ? 'bg-[#0d0d0e] text-white shadow-sm' : 'text-slate-600 hover:text-black'
              }`}
            >
              Password Login
            </button>

            <button
              type="button"
              onClick={() => { setLoginMethod('otp'); setErrorMsg(''); setSuccessMsg(''); }}
              className={`py-2 rounded-xl transition-all cursor-pointer ${
                loginMethod === 'otp' ? 'bg-[#0d0d0e] text-white shadow-sm' : 'text-slate-600 hover:text-black'
              }`}
            >
              OTP Mobile Login
            </button>
          </div>

          {/* Feedback Banners */}
          {errorMsg && (
            <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-mono flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-mono flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Password Login Form */}
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
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className={`${inputClass} pl-11`}
                  />
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

          {/* OTP Login Form */}
          {loginMethod === 'otp' && (
            <form onSubmit={handleVerifyOtp} className="space-y-5">
              <div>
                <label className={labelClass}>Mobile Phone Number</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    disabled={otpSent}
                    required
                    className={`${inputClass} pl-11`}
                  />
                </div>
              </div>

              {!otpSent ? (
                <button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={isLoading}
                  className="w-full py-3.5 rounded-full bg-slate-900 hover:bg-sky-600 text-white font-extrabold text-xs uppercase tracking-wider transition-all shadow-md cursor-pointer disabled:opacity-50"
                >
                  {isLoading ? 'Sending OTP...' : 'Send Verification OTP'}
                </button>
              ) : (
                <>
                  <div>
                    <label className={labelClass}>6-Digit OTP</label>
                    <div className="relative">
                      <KeyRound className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        placeholder="123456"
                        maxLength={6}
                        required
                        className={`${inputClass} pl-11 tracking-widest font-mono text-center text-sm`}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-4 rounded-full bg-[#0d0d0e] hover:bg-sky-600 text-white font-extrabold text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                  >
                    <span>{isLoading ? 'Verifying...' : 'Verify OTP &amp; Login'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </>
              )}
            </form>
          )}

          {/* Register Callout Footer */}
          <div className="mt-8 pt-6 border-t border-slate-200 text-center font-mono text-xs text-slate-500">
            Don't have an account yet?{' '}
            <Link href="/register" className="font-bold text-sky-600 hover:text-sky-700 underline">
              Create New Account
            </Link>
          </div>

        </div>

      </main>
    </div>
  );
}
