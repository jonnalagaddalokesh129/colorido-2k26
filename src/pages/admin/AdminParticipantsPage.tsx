import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  Download, 
  CheckCircle2, 
  X, 
  QrCode, 
  Mail, 
  Phone, 
  Building,
  ShieldCheck,
  Edit3
} from 'lucide-react';
import { store } from '../../lib/store';
import { Registration, EventItem } from '../../types/database';
import { exportRegistrationsToCSV } from '../../lib/exportCsv';
import { useToast } from '../../context/ToastContext';
import { DigitalPassModal } from '../../components/dashboard/DigitalPassModal';

export const AdminParticipantsPage: React.FC = () => {
  const { showToast } = useToast();
  const [registrations, setRegistrations] = useState<Registration[]>(() => store.getRegistrations());
  const [events, setEvents] = useState<EventItem[]>(() => store.getEvents());

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEventFilter, setSelectedEventFilter] = useState('ALL');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('ALL');

  // Selected for pass preview
  const [selectedReg, setSelectedReg] = useState<Registration | null>(null);

  useEffect(() => {
    const update = () => {
      setRegistrations(store.getRegistrations());
      setEvents(store.getEvents());
    };
    update();
    const unsub = store.subscribe(update);
    return () => unsub();
  }, []);

  const handleExportCSV = () => {
    exportRegistrationsToCSV(filteredRegistrations);
    showToast(`Exported ${filteredRegistrations.length} registrations to CSV.`, 'success');
  };

  const handleManualCheckin = (regId: string) => {
    const res = store.checkInParticipant(regId, 'Admin Portal Desk');
    if (res.success) {
      showToast(res.message, 'success');
    } else {
      showToast(res.message, 'warning');
    }
  };

  const toggleVerify = (reg: Registration) => {
    const next = reg.status === 'confirmed' ? 'checked_in' : 'confirmed';
    store.updateRegistration(reg.registration_id, { status: next as any });
    showToast(`Registration ${reg.registration_id} marked as ${next.toUpperCase()}`, 'info');
  };

  const filteredRegistrations = registrations.filter(r => {
    if (selectedEventFilter !== 'ALL' && r.event_id !== selectedEventFilter) return false;
    if (selectedStatusFilter !== 'ALL' && r.status !== selectedStatusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = r.participant_name.toLowerCase().includes(q);
      const matchCollege = r.participant_college.toLowerCase().includes(q);
      const matchId = r.registration_id.toLowerCase().includes(q);
      const matchTeam = (r.team_name || '').toLowerCase().includes(q);
      if (!matchName && !matchCollege && !matchId && !matchTeam) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <h1 className="font-display font-bold text-2xl text-white">Participant & Registration Registry</h1>
          <p className="text-xs text-slate-400">Search, verify attendance, inspect credentials, and export reports</p>
        </div>

        <button
          onClick={handleExportCSV}
          className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center space-x-2 shadow-lg transition-all self-start sm:self-auto"
        >
          <Download className="w-4 h-4" />
          <span>Export CSV Report</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#12172F] border border-white/10 rounded-2xl p-4 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by participant, ID, college..."
              className="w-full bg-[#1A2142] border border-white/10 rounded-xl py-2 pl-9 pr-3 text-xs text-white focus:outline-none"
            />
          </div>

          {/* Event Filter */}
          <div>
            <select
              value={selectedEventFilter}
              onChange={e => setSelectedEventFilter(e.target.value)}
              className="w-full bg-[#1A2142] border border-white/10 rounded-xl py-2 px-3 text-xs text-slate-200 focus:outline-none"
            >
              <option value="ALL">All Events ({events.length})</option>
              {events.map(e => (
                <option key={e.event_id} value={e.event_id}>
                  {e.event_name}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={selectedStatusFilter}
              onChange={e => setSelectedStatusFilter(e.target.value)}
              className="w-full bg-[#1A2142] border border-white/10 rounded-xl py-2 px-3 text-xs text-slate-200 focus:outline-none"
            >
              <option value="ALL">All Statuses</option>
              <option value="confirmed">Confirmed</option>
              <option value="checked_in">Checked In</option>
              <option value="waitlisted">Waitlisted</option>
            </select>
          </div>
        </div>

        <div className="text-[11px] text-slate-400 pt-1 flex justify-between">
          <span>Displaying {filteredRegistrations.length} of {registrations.length} total registrations</span>
          {(searchQuery || selectedEventFilter !== 'ALL' || selectedStatusFilter !== 'ALL') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedEventFilter('ALL');
                setSelectedStatusFilter('ALL');
              }}
              className="text-fuchsia-400 hover:text-fuchsia-300 font-semibold"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Registrations Table */}
      <div className="bg-[#12172F] border border-white/10 rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#1A2142] text-slate-400 uppercase font-mono text-[10px] border-b border-white/10">
              <tr>
                <th className="py-4 px-5">Reg ID</th>
                <th className="py-4 px-4">Participant / Team</th>
                <th className="py-4 px-4">College</th>
                <th className="py-4 px-4">Event</th>
                <th className="py-4 px-4">Size</th>
                <th className="py-4 px-4 text-center">Status</th>
                <th className="py-4 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredRegistrations.map(reg => {
                const evt = events.find(e => e.event_id === reg.event_id);
                const isCheckedIn = reg.status === 'checked_in';

                return (
                  <tr key={reg.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-3 px-5 font-mono font-bold text-fuchsia-400">
                      {reg.registration_id}
                    </td>

                    <td className="py-3 px-4">
                      <p className="font-bold text-white text-xs">{reg.participant_name}</p>
                      {reg.team_name && (
                        <p className="text-[10px] text-sky-400 font-semibold">Team: {reg.team_name}</p>
                      )}
                      <p className="text-[10px] text-slate-400">{reg.participant_email}</p>
                    </td>

                    <td className="py-3 px-4 text-slate-300 truncate max-w-[180px]">
                      {reg.participant_college}
                    </td>

                    <td className="py-3 px-4 text-white font-medium truncate max-w-[160px]">
                      {evt?.event_name || reg.event_id}
                    </td>

                    <td className="py-3 px-4 font-mono text-slate-300">
                      {reg.team_size || 1}
                    </td>

                    <td className="py-3 px-4 text-center">
                      <div className="flex flex-col items-center space-y-1">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          isCheckedIn
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                        }`}>
                          {reg.status.replace('_', ' ')}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                          reg.payment_status === 'free'
                            ? 'bg-sky-500/10 text-sky-400'
                            : 'bg-emerald-500/10 text-emerald-400'
                        }`}>
                          {reg.payment_status === 'free' ? 'FREE ENTRY' : `PAID ₹${reg.payment_amount ?? (evt?.registration_fee || 0)}`}
                        </span>
                      </div>
                    </td>

                    <td className="py-3 px-5 text-right space-x-2">
                      <button
                        onClick={() => setSelectedReg(reg)}
                        className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-200 text-xs font-semibold"
                        title="View Digital Pass"
                      >
                        Pass
                      </button>

                      {!isCheckedIn ? (
                        <button
                          onClick={() => handleManualCheckin(reg.registration_id)}
                          className="px-2.5 py-1 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 text-xs font-semibold border border-emerald-500/30"
                          title="Verify Check-in"
                        >
                          Check In
                        </button>
                      ) : (
                        <span className="text-[11px] text-emerald-400 font-medium">Verified ✅</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Digital Pass Modal Preview */}
      {selectedReg && (
        <DigitalPassModal
          registration={selectedReg}
          isOpen={!!selectedReg}
          onClose={() => setSelectedReg(null)}
        />
      )}
    </div>
  );
};
