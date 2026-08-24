'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { User, Mail, Phone, Lock, Save, ShieldCheck, CheckCircle2, KeyRound, AlertCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { updateProfileApi, changePasswordApi } from '@/api/users';

export default function ProfilePage() {
  const router = useRouter();
  const { user, isLoading, refreshUser } = useAuth();
  const { showToast } = useToast();

  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [phone, setPhone] = React.useState('');

  const [currentPassword, setCurrentPassword] = React.useState('');
  const [newPassword, setNewPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');

  const [isSavingProfile, setIsSavingProfile] = React.useState(false);
  const [isChangingPassword, setIsChangingPassword] = React.useState(false);
  
  const [profileMsg, setProfileMsg] = React.useState('');
  const [passwordMsg, setPasswordMsg] = React.useState('');
  const [passwordError, setPasswordError] = React.useState('');

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

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProfile(true);
    setProfileMsg('');

    try {
      const res = await updateProfileApi({ name, phone });

      if (!res.success) {
        throw new Error(res.message || 'Failed to update profile details.');
      }

      setProfileMsg('Profile details updated successfully!');
      showToast('Profile updated successfully!', 'success');
      await refreshUser();
    } catch (err: any) {
      showToast(err.message || 'Update failed', 'error');
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMsg('');
    setPasswordError('');

    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match!');
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters long!');
      return;
    }

    setIsChangingPassword(true);

    try {
      const res = await changePasswordApi({
        currentPassword,
        newPassword,
      });

      if (!res.success) {
        throw new Error(res.message || 'Failed to change password.');
      }

      setPasswordMsg('Password changed successfully!');
      showToast('Password changed successfully!', 'success');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setPasswordError(err.message || 'Failed to change password.');
      showToast(err.message || 'Password change failed', 'error');
    } finally {
      setIsChangingPassword(false);
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
      <main className="max-w-2xl w-full mx-auto space-y-8" id="profile-main">
        
        {/* Profile Card */}
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
                View and edit your account profile information.
              </p>
            </div>

            {/* Privilege Badge */}
            <div className="px-3.5 py-1.5 rounded-2xl bg-[#0d0d0e] text-white font-mono text-xs font-bold text-center self-start sm:self-auto">
              ROLE: {user.role || 'ROLE_CUSTOMER'}
            </div>
          </div>

          {profileMsg && (
            <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-mono flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{profileMsg}</span>
            </div>
          )}

          <form onSubmit={handleUpdateProfile} className="space-y-6 font-mono text-xs">
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

            <button
              type="submit"
              disabled={isSavingProfile}
              className="w-full py-4 rounded-full bg-[#0d0d0e] hover:bg-sky-600 text-white font-extrabold text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-4"
            >
              <Save className="w-4 h-4" />
              <span>{isSavingProfile ? 'Saving Changes...' : 'Save Profile Details'}</span>
            </button>
          </form>

        </div>

        {/* Change Password Card */}
        <div className="bg-white border-2 border-slate-300 rounded-[32px] sm:rounded-[44px] p-8 sm:p-12 shadow-sm">
          
          <div className="flex items-center gap-3 pb-6 mb-6 border-b border-slate-200">
            <div className="p-2.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-[#0d0d0e]">
                Security &amp; Password Update
              </h2>
              <p className="text-xs text-slate-500 font-mono">
                Verify your current password to set a new password.
              </p>
            </div>
          </div>

          {passwordMsg && (
            <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-mono flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{passwordMsg}</span>
            </div>
          )}

          {passwordError && (
            <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-mono flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{passwordError}</span>
            </div>
          )}

          <form onSubmit={handleChangePassword} className="space-y-5 font-mono text-xs">
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-2">Current Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                  placeholder="Enter current password"
                  className="w-full px-4 py-3.5 pl-11 rounded-2xl bg-[#fafafa] border-2 border-slate-200 font-bold text-[#0d0d0e] focus:outline-none focus:border-sky-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-2">New Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  minLength={6}
                  placeholder="Enter new password (min 6 characters)"
                  className="w-full px-4 py-3.5 pl-11 rounded-2xl bg-[#fafafa] border-2 border-slate-200 font-bold text-[#0d0d0e] focus:outline-none focus:border-sky-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-2">Confirm New Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  placeholder="Re-enter new password"
                  className="w-full px-4 py-3.5 pl-11 rounded-2xl bg-[#fafafa] border-2 border-slate-200 font-bold text-[#0d0d0e] focus:outline-none focus:border-sky-500 transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isChangingPassword}
              className="w-full py-4 rounded-full bg-slate-900 hover:bg-sky-600 text-white font-extrabold text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-4"
            >
              <KeyRound className="w-4 h-4" />
              <span>{isChangingPassword ? 'Verifying & Updating...' : 'Update Password'}</span>
            </button>
          </form>

        </div>

      </main>
    </div>
  );
}
