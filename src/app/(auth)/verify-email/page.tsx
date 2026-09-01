'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowRight, KeyRound, Mail, AlertCircle, CheckCircle2, ShieldCheck, ArrowLeft, RefreshCw } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { sendOtpApi, verifyEmailOtpApi } from '@/api/auth';

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, refreshUser } = useAuth();
  const { showToast } = useToast();

  const queryEmail = searchParams?.get('email') || '';
  const [email, setEmail] = useState(queryEmail || user?.email || '');
  const [otpCode, setOtpCode] = useState('');
  const [otpSent, setOtpSent] = useState(!!queryEmail || !!user?.email);

  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [cooldownSeconds, setCooldownSeconds] = useState(60);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState(
    queryEmail ? `A 6-digit verification code has been sent to ${queryEmail}.` : ''
  );

  // 60-second Countdown Timer for Resend OTP
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (cooldownSeconds > 0) {
      timer = setInterval(() => {
        setCooldownSeconds((prev) => prev - 1);
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [cooldownSeconds]);

  const handleSendOtp = async () => {
    if (!email || !email.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    setIsResending(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const res = await sendOtpApi(email, 'EMAIL', 'EMAIL_VERIFICATION');
      setOtpSent(true);
      setCooldownSeconds(60);
      setSuccessMsg(res.data || `A new verification code has been sent to ${email}.`);
      showToast('Verification OTP sent to your email!', 'info');
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to send verification code.');
      showToast(err.message || 'Failed to send OTP', 'error');
    } finally {
      setIsResending(false);
    }
  };

  const handleVerifyEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode || otpCode.length < 6) {
      setErrorMsg('Please enter the full 6-digit OTP code.');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const res = await verifyEmailOtpApi(email, otpCode);
      if (res.success) {
        setSuccessMsg('Your email address has been verified successfully! Redirecting to login...');
        showToast('Email verified successfully! You can now log in.', 'success');
        if (refreshUser) {
          await refreshUser();
        }
        setTimeout(() => {
          router.push('/login?verified=true');
        }, 1500);
      } else {
        throw new Error(res.message || 'Verification failed.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Verification failed. Please check the code and try again.');
      showToast(err.message || 'Verification failed', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass = 'w-full px-4 py-3.5 rounded-2xl bg-[#fafafa] border-2 border-slate-200 text-xs font-medium text-[#0d0d0e] placeholder:text-slate-400 focus:outline-none focus:border-sky-500 transition-colors';
  const labelClass = 'block text-xs font-mono font-bold text-slate-700 uppercase tracking-wider mb-2';

  return (
    <div className="bg-[#f7f7f5] text-[#0d0d0e] min-h-screen pb-16 pt-28 sm:pt-36 px-3 sm:px-6 lg:px-8 selection:bg-[#0d0d0e] selection:text-white">
      <main className="max-w-md w-full mx-auto" id="verify-email-main">
        
        <div className="bg-white border-2 border-slate-300 rounded-[32px] sm:rounded-[44px] p-8 sm:p-10 shadow-sm relative overflow-hidden">
          
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-sky-700 font-mono text-[11px] font-bold uppercase tracking-wider mb-3">
              <ShieldCheck className="w-3.5 h-3.5 text-sky-600" />
              EMAIL VERIFICATION PORTAL
            </div>
            
            <h1 className="text-2xl sm:text-3xl font-black text-[#0d0d0e] tracking-tight mb-2">
              Verify Email Address
            </h1>
            
            <p className="text-xs text-slate-500 font-mono">
              Enter the 6-digit OTP code sent to your registered email address.
            </p>
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

          <form onSubmit={handleVerifyEmail} className="space-y-5">
            <div>
              <label className={labelClass}>Registered Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                onClick={handleSendOtp}
                disabled={isResending}
                className="w-full py-3.5 rounded-full bg-slate-900 hover:bg-sky-600 text-white font-extrabold text-xs uppercase tracking-wider transition-all shadow-md cursor-pointer disabled:opacity-50"
              >
                {isResending ? 'Sending OTP...' : 'Send Verification OTP'}
              </button>
            ) : (
              <>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className={labelClass}>6-Digit OTP Code</label>
                    <span className="text-[11px] font-mono text-slate-500">10 Min Expiry</span>
                  </div>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                      onPaste={(e) => {
                        e.preventDefault();
                        const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
                        if (pasted) setOtpCode(pasted);
                      }}
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
                  <span>{isLoading ? 'Verifying OTP...' : 'Verify Email Address'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <div className="pt-2 text-center">
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    disabled={cooldownSeconds > 0 || isResending}
                    className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-sky-600 hover:text-sky-700 disabled:text-slate-400 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isResending ? 'animate-spin' : ''}`} />
                    <span>
                      {cooldownSeconds > 0
                        ? `Resend OTP in ${cooldownSeconds}s`
                        : isResending
                        ? 'Resending...'
                        : 'Resend Verification OTP'}
                    </span>
                  </button>
                </div>
              </>
            )}
          </form>

          <div className="mt-8 pt-6 border-t border-slate-200 text-center font-mono text-xs text-slate-500 flex items-center justify-center gap-2">
            <ArrowLeft className="w-3.5 h-3.5 text-slate-400" />
            <Link href="/login" className="font-bold text-sky-600 hover:text-sky-700 underline">
              Return to Sign In
            </Link>
          </div>

        </div>

      </main>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#f7f7f5]" />}>
      <VerifyEmailContent />
    </Suspense>
  );
}
