'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { User, Mail, Phone, Lock, Save, ShieldCheck, AlertCircle, CheckCircle2, KeyRound } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';

export default function ProfilePage() {
  const router = useRouter();
  const { user, isLoading, refreshUser } = useAuth();
  const { showToast } = useToast();

  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [newPassword, setNewPassword] = React.useState('');
  
  const [isSaving, setIsSaving] = React.useState(false);
  const [statusMsg, setStatusMsg] = React.useState('');

  React.useEffect(() => {
    if (!isLoading) {
      if (!user) {
        showToast('Please log in to manage your profile.', 'info');
        router.push('/login');
      } else {
        setName(user.name || '');
        setEmail(user.email || '');
        setPhone(user.phone || '');
      }
    }
  }, [user, isLoading, router, showToast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setStatusMsg('');

    try {
      const payload: any = {
        currentEmail: user?.email,
        name,
        phone,
      };
      if (newPassword.trim()) {
        payload.password = newPassword.trim();
      }

      const res = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Id': user?.id ? String(user.id) : '',
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to update profile details.');
      }

      setStatusMsg('Profile details updated successfully!');
      showToast('Profile updated successfully!', 'success');
      setNewPassword('');
      await refreshUser();
    } catch (err: any) {
      setStatusMsg(err.message || 'An error occurred while saving profile.');
      showToast(err.message || 'Update failed', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-[#f7f7f5] flex items-center justify-center font-mono text-xs text-slate-500">
        Loading Account Profile...
      </div>
    );
  }

  return (
    <div className="bg-[#f7f7f5] text-[#0d0d0e] min-h-screen pb-16 pt-28 sm:pt-36 px-3 sm:px-6 lg:px-8 selection:bg-[#0d0d0e] selection:text-white">
      <main className="max-w-2xl w-full mx-auto" id="profile-main">
        
        <div className="bg-white border-2 border-slate-300 rounded-[32px] sm:rounded-[44px] p-8 sm:p-12 shadow-sm">
          
          {/* Header Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-8 mb-8 border-b border-slate-200">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-sky-700 font-mono text-[11px] font-bold uppercase tracking-wider mb-2">
                <ShieldCheck className="w-3.5 h-3.5" />
                ACCOUNT &amp; PROFILE SETTINGS
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-[#0d0d0e] tracking-tight">
                Personal Profile Management
              </h1>
              <p className="text-xs text-slate-500 font-mono mt-1">
                Edit your personal credentials and account details.
              </p>
            </div>

            {/* Privilege Badge */}
            <div className="px-3.5 py-1.5 rounded-2xl bg-[#0d0d0e] text-white font-mono text-xs font-bold text-center self-start sm:self-auto">
              ROLE: {user.role || 'ROLE_CUSTOMER'}
            </div>
          </div>

          {statusMsg && (
            <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-mono flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{statusMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6 font-mono text-xs">
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-2">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full px-4 py-3.5 pl-11 rounded-2xl bg-[#fafafa] border-2 border-slate-200 font-bold text-[#0d0d0e] focus:outline-none focus:border-sky-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-2">Email Address (Read-only)</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  disabled
                  className="w-full px-4 py-3.5 pl-11 rounded-2xl bg-slate-100 border-2 border-slate-200 font-bold text-slate-500 cursor-not-allowed"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-2">Mobile Phone Number</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full px-4 py-3.5 pl-11 rounded-2xl bg-[#fafafa] border-2 border-slate-200 font-bold text-[#0d0d0e] focus:outline-none focus:border-sky-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-2">New Password (Optional)</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Leave blank to keep existing password"
                  className="w-full px-4 py-3.5 pl-11 rounded-2xl bg-[#fafafa] border-2 border-slate-200 font-bold text-[#0d0d0e] focus:outline-none focus:border-sky-500 transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSaving}
              className="w-full py-4 rounded-full bg-[#0d0d0e] hover:bg-sky-600 text-white font-extrabold text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-4"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'Saving Changes...' : 'Save Profile Details'}</span>
            </button>
          </form>

        </div>

      </main>
    </div>
  );
}
