'use client';

import * as React from 'react';
import QRCode from 'qrcode';
import { 
  QrCode, Smartphone, CheckCircle2, AlertCircle, Copy, 
  Check, ExternalLink, RefreshCw, Clock, ShieldCheck, 
  MessageSquare, Loader2, ArrowRight, X, Send, Lock
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatInr } from '@/utils/cartUtils';
import { useToast } from '@/context/ToastContext';
import { 
  requestPhoneOtpApi, 
  verifyPhoneOtpApi, 
  initiateSelfHostedUpiCheckoutApi, 
  getSelfHostedUpiStatusApi, 
  submitSelfHostedUtrApi,
  cancelSelfHostedUpiApi
} from '@/api/payments';
import { UpiCheckoutResponseDto, UpiCheckoutStatusDto } from '@/api/types';

interface SelfHostedUpiModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: number;
  amount: number;
  initialPhone?: string;
  onPaymentSuccess: (orderId: number) => void;
}

export function SelfHostedUpiModal({
  isOpen,
  onClose,
  orderId,
  amount,
  initialPhone = '+91 98765 43210',
  onPaymentSuccess,
}: SelfHostedUpiModalProps) {
  const { showToast } = useToast();

  // Phase: 'PHONE_OTP' | 'QR_PAYMENT' | 'SETTLED'
  const [phase, setPhase] = React.useState<'PHONE_OTP' | 'QR_PAYMENT' | 'SETTLED'>('PHONE_OTP');

  // Phone OTP State
  const [phoneNumber, setPhoneNumber] = React.useState(initialPhone);
  const [otpCode, setOtpCode] = React.useState('');
  const [isOtpSent, setIsOtpSent] = React.useState(false);
  const [otpCooldown, setOtpCooldown] = React.useState(0);
  const [isSendingOtp, setIsSendingOtp] = React.useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = React.useState(false);
  const [phoneProofToken, setPhoneProofToken] = React.useState<string | null>(null);

  // UPI Session State
  const [upiData, setUpiData] = React.useState<UpiCheckoutResponseDto | null>(null);
  const [qrCodeUrl, setQrCodeUrl] = React.useState<string>('');
  const [remainingSeconds, setRemainingSeconds] = React.useState<number>(600);
  const [isExpired, setIsExpired] = React.useState(false);
  const [copiedField, setCopiedField] = React.useState<string | null>(null);

  // UTR Fallback State
  const [showUtrInput, setShowUtrInput] = React.useState(false);
  const [manualUtr, setManualUtr] = React.useState('');
  const [isSubmittingUtr, setIsSubmittingUtr] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState('');

  // 1. Cooldown Timer Countdown
  React.useEffect(() => {
    if (otpCooldown <= 0) return;
    const interval = setInterval(() => {
      setOtpCooldown((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [otpCooldown]);

  // 2. Lease Expiration Countdown
  React.useEffect(() => {
    if (phase !== 'QR_PAYMENT' || isExpired) return;
    const interval = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          setIsExpired(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [phase, isExpired]);

  // 3. Generate QR Code image when UPI URI arrives
  React.useEffect(() => {
    if (!upiData?.upiUri) return;
    QRCode.toDataURL(upiData.upiUri, {
      width: 280,
      margin: 2,
      color: {
        dark: '#0f172a',
        light: '#ffffff',
      },
    })
      .then((url) => setQrCodeUrl(url))
      .catch((err) => console.error('Failed to generate UPI QR:', err));
  }, [upiData]);

  // 4. Live Settlement Polling (Every 3 seconds)
  React.useEffect(() => {
    if (phase !== 'QR_PAYMENT' || !upiData?.paymentId || isExpired) return;

    let isSubscribed = true;
    const pollInterval = setInterval(async () => {
      try {
        const res = await getSelfHostedUpiStatusApi(upiData.paymentId);
        if (!isSubscribed) return;

        if (res.success && res.data) {
          if (res.data.isPaid) {
            setPhase('SETTLED');
            showToast('Bank payment confirmed! Entitlements provisioned.', 'success');
            setTimeout(() => {
              onPaymentSuccess(orderId);
            }, 1500);
          } else if (res.data.isExpired) {
            setIsExpired(true);
          }
        }
      } catch (err: any) {
        console.warn('UPI status poll note:', err.message);
      }
    }, 3000);

    return () => {
      isSubscribed = false;
      clearInterval(pollInterval);
    };
  }, [phase, upiData, isExpired, orderId, onPaymentSuccess, showToast]);

  // Handle Request Phone OTP
  const handleRequestOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!phoneNumber || phoneNumber.trim().length < 10) {
      setErrorMessage('Please enter a valid 10-digit mobile phone number.');
      return;
    }

    setIsSendingOtp(true);
    setErrorMessage('');
    try {
      const res = await requestPhoneOtpApi(phoneNumber.trim());
      if (!res.success) {
        throw new Error(res.message || 'Failed to dispatch phone verification OTP.');
      }
      setIsOtpSent(true);
      setOtpCooldown(60);
      showToast('Verification code dispatched to your phone.', 'success');
    } catch (err: any) {
      setErrorMessage(err.message || 'Could not send verification code.');
      showToast(err.message || 'OTP request failed', 'error');
    } finally {
      setIsSendingOtp(false);
    }
  };

  // Handle Verify Phone OTP
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode || otpCode.trim().length !== 6) {
      setErrorMessage('Please enter the 6-digit code received on your phone.');
      return;
    }

    setIsVerifyingOtp(true);
    setErrorMessage('');
    try {
      const res = await verifyPhoneOtpApi(phoneNumber.trim(), otpCode.trim());
      if (!res.success || !res.data?.proofToken) {
        throw new Error(res.message || 'Verification failed. Please check your code.');
      }

      setPhoneProofToken(res.data.proofToken);
      showToast('Phone verified successfully! Initializing settlement session...', 'success');

      // Now initiate self-hosted UPI session with proof token
      await startUpiSession(res.data.proofToken);
    } catch (err: any) {
      setErrorMessage(err.message || 'Invalid verification code.');
      showToast(err.message || 'Verification failed', 'error');
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  // Start Self-Hosted UPI Session
  const startUpiSession = async (proofToken?: string) => {
    try {
      const res = await initiateSelfHostedUpiCheckoutApi(orderId, proofToken || undefined);
      if (!res.success || !res.data) {
        throw new Error(res.message || 'Failed to initialize UPI session.');
      }

      setUpiData(res.data);
      setRemainingSeconds(res.data.expiresInSeconds || 600);
      setIsExpired(false);
      setPhase('QR_PAYMENT');
    } catch (err: any) {
      setErrorMessage(err.message || 'Could not start UPI checkout session.');
      showToast(err.message || 'UPI session initiation failed', 'error');
    }
  };

  // Handle Manual UTR Submission
  const handleSubmitUtr = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!upiData?.paymentId) return;

    const trimmed = manualUtr.trim();
    if (!trimmed || trimmed.length < 6) {
      setErrorMessage('Please enter a valid 12-digit UTR / banking reference.');
      return;
    }

    setIsSubmittingUtr(true);
    setErrorMessage('');
    try {
      const res = await submitSelfHostedUtrApi({
        paymentId: upiData.paymentId,
        utr: trimmed,
      });

      if (!res.success || !res.data) {
        throw new Error(res.message || 'Failed to submit UTR reference.');
      }

      if (res.data.isPaid) {
        setPhase('SETTLED');
        showToast('Payment verified instantly! Entitlements provisioned.', 'success');
        setTimeout(() => {
          onPaymentSuccess(orderId);
        }, 1200);
      } else {
        showToast('Reference submitted! Awaiting bank ledger match...', 'info');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'UTR submission failed.');
      showToast(err.message || 'Submission failed', 'error');
    } finally {
      setIsSubmittingUtr(false);
    }
  };

  const handleCopy = (text: string, label: string) => {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(text);
      setCopiedField(label);
      showToast(`Copied ${label} to clipboard`, 'info');
      setTimeout(() => setCopiedField(null), 2000);
    }
  };

  if (!isOpen) return null;

  // Format MM:SS
  const mins = Math.floor(remainingSeconds / 60);
  const secs = remainingSeconds % 60;
  const timeFormatted = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/65 backdrop-blur-md animate-in fade-in duration-200 motion-reduce:animate-none">
      <div className="relative w-full max-w-lg max-h-[min(92dvh,900px)] overflow-y-auto bg-white rounded-[24px] shadow-[0_24px_80px_rgba(15,23,42,0.24)] border border-slate-200/80 ring-1 ring-white/70">
        {/* Header */}
        <div className="sticky top-0 z-10 p-5 border-b border-slate-200/70 flex items-center justify-between bg-white/95 backdrop-blur-md">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#FF6B4A] to-[#FF8E53] text-white flex items-center justify-center font-black shadow-[0_8px_20px_rgba(255,107,74,0.25)]">
              <QrCode className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900 tracking-tight">Direct Self-Hosted UPI</h3>
              <p className="text-[11px] text-slate-500 font-medium">NPCI Instant Settlement &bull; Zero Gateway Fee</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {errorMessage && (
          <div className="mx-6 mt-4 p-3.5 rounded-xl bg-rose-50 border border-rose-200 flex items-center gap-2.5 text-xs text-rose-700 font-semibold">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <div className="p-6">
          {/* ========================================================= */}
          {/* PHASE 1: PHONE OTP VERIFICATION                           */}
          {/* ========================================================= */}
          {phase === 'PHONE_OTP' && (
            <div className="space-y-5">
              <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div className="text-xs text-emerald-900 leading-relaxed">
                  <p className="font-bold">Two-Factor Mobile Protection</p>
                  <p className="text-emerald-700 mt-0.5">
                    We deliver a secure 6-digit verification code to your WhatsApp / Mobile number before reserving your dedicated bank settlement slot.
                  </p>
                </div>
              </div>

              {!isOtpSent ? (
                <form onSubmit={handleRequestOtp} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Customer Mobile Number
                    </label>
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/60 text-sm font-semibold transition-[border-color,box-shadow] focus:outline-none focus:bg-white focus:ring-4 focus:ring-orange-500/10 focus:border-orange-400"
                      required
                    />
                    <p className="text-[11px] text-slate-400 mt-1">Accepts 10-digit Indian numbers or international with country code.</p>
                  </div>

                  <button
                    type="submit"
                    disabled={isSendingOtp}
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#FF6B4A] to-[#FF8E53] hover:from-[#F45B3D] hover:to-[#F98247] text-white font-bold text-xs uppercase tracking-wider shadow-[0_8px_22px_rgba(255,107,74,0.22)] transition-[transform,box-shadow,filter] duration-200 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-orange-500/25 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed motion-reduce:transition-none"
                  >
                    {isSendingOtp ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
                        <span>Dispatching Code...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 text-emerald-400" />
                        <span>Send 6-Digit Verification Code</span>
                      </>
                    )}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOtp} className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                        Enter 6-Digit Code
                      </label>
                      <button
                        type="button"
                        onClick={() => setIsOtpSent(false)}
                        className="text-[11px] text-emerald-600 hover:underline font-semibold"
                      >
                        Change Phone
                      </button>
                    </div>

                    <input
                      type="text"
                      maxLength={6}
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value.replace(/[^0-9]/g, ''))}
                      placeholder="e.g. 123456"
                      className="w-full px-4 py-3 text-center tracking-[8px] font-mono font-black text-xl rounded-xl border border-slate-200 bg-slate-50/60 focus:outline-none focus:bg-white focus:ring-4 focus:ring-orange-500/10 focus:border-orange-400 transition-[border-color,box-shadow]"
                      required
                      autoFocus
                    />
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>Didn&apos;t receive code?</span>
                    {otpCooldown > 0 ? (
                      <span className="font-semibold text-slate-400">Resend in {otpCooldown}s</span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleRequestOtp()}
                        className="font-bold text-emerald-600 hover:underline"
                      >
                        Resend Code
                      </button>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isVerifyingOtp}
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#FF6B4A] to-[#FF8E53] hover:from-[#F45B3D] hover:to-[#F98247] text-white font-bold text-xs uppercase tracking-wider transition-[transform,box-shadow] duration-200 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-orange-500/25 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_8px_22px_rgba(255,107,74,0.22)] motion-reduce:transition-none"
                  >
                    {isVerifyingOtp ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Verifying...</span>
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Verify &amp; Open UPI QR</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          )}

          {/* ========================================================= */}
          {/* PHASE 2: DYNAMIC UPI QR & INTENT TRIGGER                  */}
          {/* ========================================================= */}
          {phase === 'QR_PAYMENT' && upiData && (
            <div className="space-y-5">
              {/* Slot & Timer Ribbon */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-100 border border-slate-200">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  <span className="text-xs font-bold text-slate-800">
                    Slot #{upiData.slotNumber || 1} Reserved
                  </span>
                </div>

                <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-slate-700">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span className={cn(remainingSeconds < 60 && "text-rose-600 font-black")}>
                    {timeFormatted}
                  </span>
                </div>
              </div>

              {isExpired ? (
                <div className="p-6 text-center bg-rose-50 border border-rose-200 rounded-2xl space-y-3">
                  <AlertCircle className="w-10 h-10 text-rose-500 mx-auto" />
                  <h4 className="text-sm font-bold text-rose-900">Settlement Slot Expired</h4>
                  <p className="text-xs text-rose-700">
                    Your 10-minute reserved VPA slot has timed out. Please refresh to acquire an active slot.
                  </p>
                  <button
                    type="button"
                    onClick={() => startUpiSession(phoneProofToken || undefined)}
                    className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs"
                  >
                    Acquire New Slot
                  </button>
                </div>
              ) : (
                <>
                  {/* Dynamic QR & Payable details */}
                  <div className="flex flex-col sm:flex-row items-center gap-5 p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-[#fff8f5] via-white to-[#f8f9fe] border border-orange-100/90 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]">
                    <div className="w-44 h-44 bg-white p-2 rounded-2xl border border-slate-200/80 flex items-center justify-center shrink-0 shadow-[0_8px_24px_rgba(15,23,42,0.06)] ring-4 ring-orange-50">
                      {qrCodeUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={qrCodeUrl} alt="UPI QR Code" className="w-full h-full object-contain" />
                      ) : (
                        <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
                      )}
                    </div>

                    <div className="space-y-2.5 flex-1 w-full text-xs">
                      <div>
                        <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block">Exact Amount</span>
                        <span className="text-2xl font-black text-slate-900 font-mono">
                          {formatInr(upiData.amount)}
                        </span>
                      </div>

                      <div>
                        <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block">Verified Merchant VPA</span>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <code className="bg-white px-2 py-0.5 rounded border border-slate-200 font-mono text-[11px] font-bold text-slate-800 select-all truncate max-w-[170px]">
                            {upiData.merchantVpa}
                          </code>
                          <button
                            type="button"
                            onClick={() => handleCopy(upiData.merchantVpa, 'VPA')}
                            className="p-1 rounded hover:bg-slate-200 text-slate-600 transition"
                          >
                            {copiedField === 'VPA' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>

                      <div>
                        <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block">Transaction Ref</span>
                        <span className="font-mono text-[11px] text-slate-600 font-semibold">{upiData.transactionRef}</span>
                      </div>
                    </div>
                  </div>

                  {/* Mobile Quick Pay Intent Links */}
                  {upiData.intentLinks && (
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                        Mobile 1-Tap Quick Pay:
                      </span>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {upiData.intentLinks.gpay && (
                          <a
                            href={upiData.intentLinks.gpay}
                            className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 font-bold text-xs text-slate-700 flex items-center justify-center gap-1.5 transition shadow-2xs"
                          >
                            <Smartphone className="w-3.5 h-3.5 text-blue-500" />
                            GPay
                          </a>
                        )}
                        {upiData.intentLinks.phonepe && (
                          <a
                            href={upiData.intentLinks.phonepe}
                            className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 font-bold text-xs text-slate-700 flex items-center justify-center gap-1.5 transition shadow-2xs"
                          >
                            <Smartphone className="w-3.5 h-3.5 text-purple-600" />
                            PhonePe
                          </a>
                        )}
                        {upiData.intentLinks.paytm && (
                          <a
                            href={upiData.intentLinks.paytm}
                            className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 font-bold text-xs text-slate-700 flex items-center justify-center gap-1.5 transition shadow-2xs"
                          >
                            <Smartphone className="w-3.5 h-3.5 text-sky-500" />
                            Paytm
                          </a>
                        )}
                        {upiData.intentLinks.bhim && (
                          <a
                            href={upiData.intentLinks.bhim}
                            className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 font-bold text-xs text-slate-700 flex items-center justify-center gap-1.5 transition shadow-2xs"
                          >
                            <Smartphone className="w-3.5 h-3.5 text-emerald-600" />
                            BHIM
                          </a>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Manual UTR Toggle & Input */}
                  <div className="pt-2 border-t border-slate-100">
                    {!showUtrInput ? (
                      <button
                        type="button"
                        onClick={() => setShowUtrInput(true)}
                        className="text-xs text-slate-500 hover:text-slate-800 font-semibold flex items-center gap-1.5"
                      >
                        <span>Paid from desktop or other app? Submit UTR directly</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    ) : (
                      <form onSubmit={handleSubmitUtr} className="space-y-2 pt-1">
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                          12-Digit Banking Reference / UTR
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="e.g. 429381920192"
                            value={manualUtr}
                            onChange={(e) => setManualUtr(e.target.value)}
                            className="flex-1 px-3 py-2 rounded-xl border border-slate-300 text-xs font-mono font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                            required
                          />
                          <button
                            type="submit"
                            disabled={isSubmittingUtr}
                            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs"
                          >
                            {isSubmittingUtr ? 'Matching...' : 'Match UTR'}
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                </>
              )}
            </div>
          )}

          {/* ========================================================= */}
          {/* PHASE 3: SETTLED CONFIRMATION                             */}
          {/* ========================================================= */}
          {phase === 'SETTLED' && (
            <div className="py-8 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-10 h-10 animate-bounce" />
              </div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight">Payment Settled Successfully!</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Bank transaction verified &amp; matched. Your software license and download access have been activated.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
