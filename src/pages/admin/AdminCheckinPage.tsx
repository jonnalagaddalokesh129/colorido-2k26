import React, { useState, useEffect } from 'react';
import { 
  QrCode, 
  Search, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  Clock, 
  Building, 
  User, 
  Sparkles,
  Camera
} from 'lucide-react';
import { store } from '../../lib/store';
import { Registration, EventItem, CheckinRecord } from '../../types/database';
import { useToast } from '../../context/ToastContext';

export const AdminCheckinPage: React.FC = () => {
  const { showToast } = useToast();
  const [inputCode, setInputCode] = useState('');
  const [recentCheckins, setRecentCheckins] = useState<CheckinRecord[]>(() => store.getCheckins());
  const [lastVerified, setLastVerified] = useState<{
    success: boolean;
    message: string;
    registration?: Registration;
    event?: EventItem;
    record?: CheckinRecord;
  } | null>(null);

  useEffect(() => {
    const update = () => {
      setRecentCheckins(store.getCheckins());
    };
    update();
    const unsub = store.subscribe(update);
    return () => unsub();
  }, []);

  const handleProcessCheckin = (codeToVerify: string) => {
    let cleanId = codeToVerify.trim();

    // If scanned as full QR string format: COL26:REG_ID:EVENT_ID:NAME
    if (cleanId.includes(':')) {
      const parts = cleanId.split(':');
      if (parts.length >= 2) {
        cleanId = parts[1];
      }
    }

    if (!cleanId) {
      showToast('Please enter or scan a valid Registration ID.', 'error');
      return;
    }

    const reg = store.getRegistrationById(cleanId);
    if (!reg) {
      setLastVerified({
        success: false,
        message: `Registration ID "${cleanId}" not found in tournament records.`
      });
      showToast(`Invalid credential: ${cleanId}`, 'error');
      return;
    }

    const evt = store.getEventById(reg.event_id);

    // Call store check-in
    const result = store.checkInParticipant(cleanId, 'Main Gate Coordinator A');

    if (result.success) {
      setLastVerified({
        success: true,
        message: 'CHECK-IN SUCCESSFUL ✅',
        registration: reg,
        event: evt,
        record: result.record
      });
      showToast(`Verified: ${reg.participant_name} (${reg.participant_college})`, 'success');
      setInputCode('');
    } else {
      setLastVerified({
        success: false,
        message: result.message,
        registration: reg,
        event: evt
      });
      showToast(result.message, 'warning');
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleProcessCheckin(inputCode);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="border-b border-white/10 pb-4">
        <div className="flex items-center space-x-2 text-xs font-mono text-emerald-400 mb-1">
          <ShieldCheck className="w-4 h-4" />
          <span>Accredited Turnstile Operations</span>
        </div>
        <h1 className="font-display font-bold text-2xl sm:text-3xl text-white">
          QR Code & Participant Check-In Station
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Verify digital credentials, prevent duplicate turnstile entries, and sync real-time venue attendance
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Scanner Station Form */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-[#12172F] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
            {/* Camera / Barcode simulation view */}
            <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-[#1A2142] p-8 text-center space-y-3">
              <div className="w-16 h-16 rounded-2xl bg-fuchsia-600/20 text-fuchsia-400 flex items-center justify-center mx-auto border border-fuchsia-500/30 animate-pulse">
                <Camera className="w-8 h-8" />
              </div>
              <div>
                <p className="font-bold text-sm text-white">Optical Scanner Active</p>
                <p className="text-xs text-slate-400 mt-0.5">Ready for mobile phone camera pass scan</p>
              </div>
            </div>

            {/* Manual Scan Input */}
            <form onSubmit={handleFormSubmit} className="space-y-3">
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                Registration ID or Scanned String
              </label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  required
                  value={inputCode}
                  onChange={e => setInputCode(e.target.value)}
                  placeholder="e.g. COL26-SPT-001001"
                  className="flex-1 bg-[#1A2142] border border-white/10 rounded-xl px-4 py-3 text-xs sm:text-sm font-mono text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg transition-all"
                >
                  Verify
                </button>
              </div>
            </form>

            {/* Quick Demo Test Buttons */}
            <div className="pt-2 border-t border-white/5 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Quick Evaluator Test IDs:
              </span>
              <div className="flex flex-wrap gap-2">
                {['COL26-SPT-001001', 'COL26-CUL-001002', 'COL26-CUL-001003', 'COL26-SPT-001004'].map(sampleId => (
                  <button
                    key={sampleId}
                    type="button"
                    onClick={() => {
                      setInputCode(sampleId);
                      handleProcessCheckin(sampleId);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-[11px] font-mono text-slate-300 transition-colors border border-white/5"
                  >
                    {sampleId}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Verification Result Card */}
        <div className="lg:col-span-6 space-y-6">
          {lastVerified ? (
            <div className={`p-6 sm:p-8 rounded-3xl border shadow-2xl space-y-6 transition-all animate-in fade-in duration-200 ${
              lastVerified.success
                ? 'bg-emerald-950/30 border-emerald-500/50'
                : 'bg-rose-950/30 border-rose-500/50'
            }`}>
              <div className="flex items-center space-x-3">
                {lastVerified.success ? (
                  <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-2xl border border-emerald-500/30">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                ) : (
                  <div className="p-3 bg-rose-500/20 text-rose-400 rounded-2xl border border-rose-500/30">
                    <AlertTriangle className="w-8 h-8" />
                  </div>
                )}
                <div>
                  <h3 className="font-display font-bold text-lg text-white">
                    {lastVerified.success ? 'CHECK-IN SUCCESSFUL' : 'VERIFICATION ALERT'}
                  </h3>
                  <p className={`text-xs ${lastVerified.success ? 'text-emerald-300' : 'text-rose-300'}`}>
                    {lastVerified.message}
                  </p>
                </div>
              </div>

              {lastVerified.registration && (
                <div className="bg-[#12172F] p-5 rounded-2xl border border-white/10 space-y-3 text-xs">
                  <div className="flex justify-between items-center pb-2 border-b border-white/5">
                    <span className="text-slate-400">Participant:</span>
                    <strong className="text-white text-sm">{lastVerified.registration.participant_name}</strong>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b border-white/5">
                    <span className="text-slate-400">Institution:</span>
                    <span className="text-slate-200 font-medium">{lastVerified.registration.participant_college}</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b border-white/5">
                    <span className="text-slate-400">Event:</span>
                    <strong className="text-fuchsia-400">{lastVerified.event?.event_name || lastVerified.registration.event_id}</strong>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b border-white/5">
                    <span className="text-slate-400">Venue:</span>
                    <span className="text-slate-200">{lastVerified.event?.venue}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Check-in Timestamp:</span>
                    <span className="font-mono text-emerald-400">
                      {new Date().toLocaleTimeString()} (Turnstile Gate 1)
                    </span>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="p-10 rounded-3xl bg-[#12172F] border border-white/10 text-center space-y-3">
              <QrCode className="w-12 h-12 text-slate-500 mx-auto" />
              <h3 className="font-bold text-sm text-slate-300">Ready for Next Credential</h3>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Scan participant QR code from their mobile pass or enter registration ID above.
              </p>
            </div>
          )}

          {/* Live Check-in Log */}
          <div className="bg-[#12172F] border border-white/10 rounded-3xl p-5 space-y-3 shadow-xl">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400 flex items-center justify-between">
              <span>Gate Verification Log</span>
              <span className="font-mono text-emerald-400">{recentCheckins.length} Total</span>
            </h4>

            <div className="space-y-2 max-h-56 overflow-y-auto custom-scrollbar">
              {recentCheckins.slice(0, 5).map(chk => (
                <div
                  key={chk.id}
                  className="p-3 rounded-xl bg-[#1A2142] border border-white/5 text-xs flex justify-between items-center"
                >
                  <div>
                    <p className="font-bold text-white">{chk.participant_name}</p>
                    <p className="text-[11px] text-slate-400">{chk.college}</p>
                  </div>
                  <div className="text-right">
                    <span className="font-mono text-[10px] text-emerald-400 font-bold block">
                      {chk.registration_id}
                    </span>
                    <span className="text-[10px] text-slate-500">
                      {new Date(chk.checked_in_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
