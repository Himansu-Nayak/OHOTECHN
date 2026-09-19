'use client';

import * as React from 'react';
import { 
  Calendar as CalendarIcon, Clock, Video, User, Plus, CheckCircle2, 
  ExternalLink, Copy, Check, ChevronLeft, ChevronRight, X, Phone, 
  Mail, MapPin, Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';

export interface AppointmentItem {
  id: number;
  title: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  product: string;
  dateStr: string;
  timeStr: string;
  durationMins: number;
  meetUrl: string;
  status: 'UPCOMING' | 'COMPLETED' | 'CANCELLED' | 'RESCHEDULED';
}

export function AdminAppointmentsView() {
  const [copiedLink, setCopiedLink] = React.useState(false);
  const [selectedDate, setSelectedDate] = React.useState<number>(18);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = React.useState(false);

  const [appointments, setAppointments] = React.useState<AppointmentItem[]>([
    {
      id: 1,
      title: 'Hospital Management Software (HMS) Executive Demo',
      clientName: 'Dr. Rajesh Mohapatra',
      clientEmail: 'dr.rajesh@apollocare.org',
      clientPhone: '+91 98610 12345',
      product: 'HMS Enterprise Suite',
      dateStr: '2026-09-18',
      timeStr: '03:30 PM - 04:15 PM',
      durationMins: 45,
      meetUrl: 'https://meet.google.com/oho-tech-hms',
      status: 'UPCOMING',
    },
    {
      id: 2,
      title: 'School ERP Architecture & Student Portal Review',
      clientName: 'Priyanka Dash',
      clientEmail: 'principal@doonglobal.edu.in',
      clientPhone: '+91 94370 54321',
      product: 'School Management Software',
      dateStr: '2026-09-18',
      timeStr: '05:00 PM - 05:30 PM',
      durationMins: 30,
      meetUrl: 'https://meet.google.com/oho-tech-edu',
      status: 'UPCOMING',
    },
    {
      id: 3,
      title: 'Retail POS Barcode Multi-Outlet Deployment Planning',
      clientName: 'Manish Agarwal',
      clientEmail: 'manish@agarwalretail.com',
      clientPhone: '+91 98200 98765',
      product: 'Retail POS & Billing',
      dateStr: '2026-09-19',
      timeStr: '11:00 AM - 12:00 PM',
      durationMins: 60,
      meetUrl: 'https://meet.google.com/oho-tech-pos',
      status: 'UPCOMING',
    },
    {
      id: 4,
      title: 'IVF Embryo Lab Cycle Tracking Onboarding',
      clientName: 'Dr. Sunita Rao',
      clientEmail: 'dr.sunita@bloomivf.in',
      clientPhone: '+91 98840 33221',
      product: 'IVF Clinic Software',
      dateStr: '2026-09-17',
      timeStr: '02:00 PM - 02:45 PM',
      durationMins: 45,
      meetUrl: 'https://meet.google.com/oho-tech-ivf',
      status: 'COMPLETED',
    },
  ]);

  const [newApptForm, setNewApptForm] = React.useState({
    title: '',
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    product: 'Hospital Management Software (HMS)',
    timeStr: '04:00 PM - 04:45 PM',
  });

  const handleCopyLink = () => {
    navigator.clipboard.writeText('https://ohotech.com/book/enterprise-demo');
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleScheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newApptForm.clientName || !newApptForm.clientEmail) return;

    const created: AppointmentItem = {
      id: Date.now(),
      title: newApptForm.title || `${newApptForm.product} Consultation`,
      clientName: newApptForm.clientName,
      clientEmail: newApptForm.clientEmail,
      clientPhone: newApptForm.clientPhone || '+91 00000 00000',
      product: newApptForm.product,
      dateStr: `2026-09-${selectedDate}`,
      timeStr: newApptForm.timeStr,
      durationMins: 45,
      meetUrl: `https://meet.google.com/oho-${Math.random().toString(36).substring(7)}`,
      status: 'UPCOMING',
    };

    setAppointments([created, ...appointments]);
    setIsScheduleModalOpen(false);
  };

  // KPI counters
  const todayCount = appointments.filter((a) => a.dateStr === '2026-09-18').length;
  const upcomingCount = appointments.filter((a) => a.status === 'UPCOMING').length;
  const completedCount = appointments.filter((a) => a.status === 'COMPLETED').length;

  const daysInMonth = Array.from({ length: 30 }, (_, i) => i + 1);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="p-5 rounded-2xl bg-[#141416] border border-white/10 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              MEETINGS &amp; DEMOS
            </span>
            <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              Google Meet API Connected
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Client Appointments &amp; Product Demos
          </h2>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Coordinate virtual demonstrations with prospective clients, generate Google Meet rooms, and send reminder invites.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={handleCopyLink}
            className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-slate-300 hover:text-white transition-all flex items-center gap-1.5 cursor-pointer"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedLink ? 'Link Copied!' : 'Copy Booking Link'}</span>
          </button>

          <button
            onClick={() => setIsScheduleModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold font-mono text-xs transition-all shadow-lg shadow-cyan-950/30 flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Schedule Demo</span>
          </button>
        </div>
      </div>

      {/* KPI Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-[#141416] border border-white/10">
          <p className="text-[11px] font-mono text-slate-400">Today&apos;s Appointments</p>
          <p className="text-2xl font-black text-white mt-1">{todayCount}</p>
          <p className="text-[10px] font-mono text-cyan-400 mt-0.5">Active schedule</p>
        </div>
        <div className="p-4 rounded-2xl bg-[#141416] border border-white/10">
          <p className="text-[11px] font-mono text-slate-400">Total Upcoming</p>
          <p className="text-2xl font-black text-white mt-1">{upcomingCount}</p>
          <p className="text-[10px] font-mono text-indigo-400 mt-0.5">Next 7 days</p>
        </div>
        <div className="p-4 rounded-2xl bg-[#141416] border border-white/10">
          <p className="text-[11px] font-mono text-slate-400">Completed Sessions</p>
          <p className="text-2xl font-black text-white mt-1">{completedCount}</p>
          <p className="text-[10px] font-mono text-emerald-400 mt-0.5">100% attendance</p>
        </div>
        <div className="p-4 rounded-2xl bg-[#141416] border border-white/10">
          <p className="text-[11px] font-mono text-slate-400">Google Meet Latency</p>
          <p className="text-2xl font-black text-emerald-400 mt-1">12ms</p>
          <p className="text-[10px] font-mono text-slate-400 mt-0.5">Regional edge pool</p>
        </div>
      </div>

      {/* Main Grid: Calendar Strip + Appointments List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar Picker Panel */}
        <div className="p-5 rounded-2xl bg-[#141416] border border-white/10 shadow-lg space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <span className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <CalendarIcon className="w-3.5 h-3.5 text-cyan-400" /> September 2026
            </span>
            <span className="text-[10px] font-mono text-slate-400">IST (UTC+5:30)</span>
          </div>

          {/* Month grid */}
          <div className="grid grid-cols-7 gap-1.5 text-center font-mono text-xs">
            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => (
              <div key={d} className="text-[10px] text-slate-400 font-bold py-1">
                {d}
              </div>
            ))}
            {/* Blank leading days for offset */}
            <div /><div />
            {daysInMonth.map((day) => {
              const isSelected = selectedDate === day;
              const isToday = day === 18;
              return (
                <button
                  key={day}
                  onClick={() => setSelectedDate(day)}
                  className={cn(
                    "h-8 rounded-lg flex items-center justify-center font-mono text-xs transition-all relative cursor-pointer",
                    isSelected
                      ? "bg-cyan-500 text-black font-bold shadow-md shadow-cyan-500/30"
                      : isToday
                      ? "bg-white/10 text-white font-bold border border-cyan-500/40"
                      : "text-slate-300 hover:bg-white/5 hover:text-white"
                  )}
                >
                  {day}
                  {(day === 18 || day === 19) && (
                    <span className="absolute bottom-1 w-1 h-1 rounded-full bg-cyan-400" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Integration Status Box */}
          <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1.5">
            <div className="flex items-center justify-between text-[11px] font-mono">
              <span className="text-slate-300 flex items-center gap-1.5">
                <Video className="w-3.5 h-3.5 text-emerald-400" /> Google Workspace Sync
              </span>
              <span className="text-emerald-400 font-bold">ONLINE</span>
            </div>
            <p className="text-[10px] font-mono text-slate-400 leading-tight">
              Calendar auto-generates secure Google Meet conference links with automatic SMS &amp; email confirmations.
            </p>
          </div>
        </div>

        {/* Selected Day Agenda */}
        <div className="lg:col-span-2 p-5 rounded-2xl bg-[#141416] border border-white/10 shadow-lg space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <div>
              <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                Scheduled Consultations — September {selectedDate}, 2026
              </span>
              <p className="text-[11px] font-mono text-slate-400">
                {appointments.filter((a) => a.dateStr === `2026-09-${selectedDate}`).length} meetings scheduled
              </p>
            </div>
            <button
              onClick={() => setIsScheduleModalOpen(true)}
              className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-mono text-white flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" /> Add Slot
            </button>
          </div>

          <div className="space-y-3">
            {appointments.map((appt) => (
              <div
                key={appt.id}
                className="p-4 rounded-xl bg-[#19191d] border border-white/10 hover:border-cyan-500/40 transition-all flex flex-col md:flex-row md:items-center justify-between gap-3 font-mono text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">{appt.title}</span>
                    <span className={cn(
                      "px-2 py-0.2 rounded text-[10px] font-bold",
                      appt.status === 'UPCOMING' ? "bg-cyan-500/20 text-cyan-300" : "bg-emerald-500/20 text-emerald-300"
                    )}>
                      {appt.status}
                    </span>
                  </div>

                  <p className="text-slate-400 flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{appt.timeStr}</span>
                    <span>•</span>
                    <span className="text-purple-400">{appt.product}</span>
                  </p>

                  <p className="text-[11px] text-slate-300 flex items-center gap-2">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span>{appt.clientName} ({appt.clientPhone})</span>
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <a
                    href={appt.meetUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3.5 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/30 font-bold flex items-center gap-1.5 transition-colors"
                  >
                    <Video className="w-3.5 h-3.5" />
                    <span>Join Google Meet</span>
                    <ExternalLink className="w-3 h-3 ml-0.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Schedule Demo Modal */}
      {isScheduleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
          <form
            onSubmit={handleScheduleSubmit}
            className="bg-[#141416] border border-white/20 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 font-mono text-xs"
          >
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <h3 className="text-base font-bold text-white">Book Client Video Demo</h3>
              <button
                type="button"
                onClick={() => setIsScheduleModalOpen(false)}
                className="p-1 rounded-lg bg-white/10 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-slate-300 text-[11px] mb-1">Session Title</label>
                <input
                  type="text"
                  placeholder="e.g. ERP Architecture Walkthrough"
                  value={newApptForm.title}
                  onChange={(e) => setNewApptForm({ ...newApptForm, title: e.target.value })}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 text-[11px] mb-1">Client Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Rajesh Mohapatra"
                  value={newApptForm.clientName}
                  onChange={(e) => setNewApptForm({ ...newApptForm, clientName: e.target.value })}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-300 text-[11px] mb-1">Client Email *</label>
                  <input
                    type="email"
                    required
                    placeholder="client@enterprise.com"
                    value={newApptForm.clientEmail}
                    onChange={(e) => setNewApptForm({ ...newApptForm, clientEmail: e.target.value })}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 text-[11px] mb-1">Phone</label>
                  <input
                    type="text"
                    placeholder="+91 98765 43210"
                    value={newApptForm.clientPhone}
                    onChange={(e) => setNewApptForm({ ...newApptForm, clientPhone: e.target.value })}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 text-[11px] mb-1">Solution Under Review</label>
                <select
                  value={newApptForm.product}
                  onChange={(e) => setNewApptForm({ ...newApptForm, product: e.target.value })}
                  className="w-full px-3 py-2 bg-[#19191d] border border-white/10 rounded-xl text-white focus:outline-none"
                >
                  <option value="Hospital Management Software (HMS)">Hospital Management Software (HMS)</option>
                  <option value="School Management Software">School Management Software</option>
                  <option value="Retail POS & Billing">Retail POS & Billing</option>
                  <option value="IVF & Fertility Clinic Software">IVF Clinic Software</option>
                  <option value="Enterprise HRMS & Payroll">Enterprise HRMS & Payroll</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 text-[11px] mb-1">Time Slot (IST)</label>
                <input
                  type="text"
                  value={newApptForm.timeStr}
                  onChange={(e) => setNewApptForm({ ...newApptForm, timeStr: e.target.value })}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-white/10 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsScheduleModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold"
              >
                Generate Google Meet &amp; Save
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
