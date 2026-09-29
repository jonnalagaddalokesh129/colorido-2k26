import React, { useState, useEffect } from 'react';
import { ShieldCheck, Check, X, Search, Clock } from 'lucide-react';
import { UserProfile } from '../../types/database';
import { useToast } from '../../context/ToastContext';
import { 
  getPendingCoordinators, 
  approveCoordinator, 
  rejectCoordinator 
} from '../../lib/coordinatorStore';

// Seed demo requests that are always present unless explicitly cleared
const DEMO_REQUESTS: UserProfile[] = [
  {
    id: 'usr_coord_demo_1',
    full_name: 'Vikram Singh',
    email: 'vikram.s@college.edu',
    college: 'Engineering College',
    role: 'coordinator',
    coordinator_status: 'pending',
    created_at: new Date().toISOString()
  },
  {
    id: 'usr_coord_demo_2',
    full_name: 'Priya Patel',
    email: 'priya.patel@university.edu',
    college: 'Science College',
    role: 'coordinator',
    coordinator_status: 'pending',
    created_at: new Date().toISOString()
  }
];

export const AdminCoordinatorsPage: React.FC = () => {
  const [requests, setRequests] = useState<UserProfile[]>([]);
  const [search, setSearch] = useState('');
  const { showToast } = useToast();

  const loadRequests = () => {
    const real = getPendingCoordinators();
    // Merge: put real registrations first, then demo ones (avoid id duplicates)
    const realIds = new Set(real.map(r => r.id));
    const merged = [
      ...real,
      ...DEMO_REQUESTS.filter(d => !realIds.has(d.id))
    ];
    setRequests(merged);
  };

  // Load on mount & sync when store updates
  useEffect(() => {
    loadRequests();
    const handleAuthChange = () => loadRequests();
    window.addEventListener('colorido_auth_changed', handleAuthChange);
    return () => window.removeEventListener('colorido_auth_changed', handleAuthChange);
  }, []);

  const handleAction = (req: UserProfile, action: 'approved' | 'rejected') => {
    if (action === 'approved') {
      approveCoordinator(req);
    } else {
      rejectCoordinator(req.id);
    }
    
    // Remove from local display state
    setRequests(prev => prev.filter(r => r.id !== req.id));
    showToast(
      `Coordinator request for ${req.full_name} was ${action === 'approved' ? 'approved ✅ (Access granted)' : 'rejected'}.`,
      action === 'approved' ? 'success' : 'info'
    );
  };

  const filteredRequests = requests.filter(r =>
    r.full_name.toLowerCase().includes(search.toLowerCase()) ||
    r.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-white">Coordinator Approvals</h1>
          <p className="text-sm text-slate-400 mt-1">
            Manage and verify pending access requests
            {requests.length > 0 && (
              <span className="ml-2 px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-xs font-bold border border-amber-500/30">
                {requests.length} pending
              </span>
            )}
          </p>
        </div>
      </div>

      <div className="bg-[#12172F] border border-white/10 rounded-2xl p-5 shadow-lg">
        <div className="flex items-center space-x-2 bg-[#1A2142] border border-white/10 rounded-xl px-3 py-2">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search pending requests by name or email..."
            className="bg-transparent border-none focus:outline-none text-xs text-white w-full placeholder:text-slate-500"
          />
        </div>
      </div>

      <div className="space-y-4">
        {filteredRequests.length > 0 ? (
          filteredRequests.map(req => (
            <div
              key={req.id}
              className="bg-[#12172F] border border-white/10 rounded-2xl p-5 flex flex-col md:flex-row items-center justify-between gap-4 hover:border-amber-500/30 transition-colors"
            >
              <div className="flex items-center space-x-4 w-full md:w-auto">
                <div className="w-12 h-12 bg-amber-500/20 text-amber-400 rounded-full flex items-center justify-center font-bold text-lg">
                  {req.full_name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">{req.full_name}</h3>
                  <div className="text-xs text-slate-400 space-y-0.5">
                    <p>{req.email}</p>
                    <p>{req.college || '—'}</p>
                    {req.phone && <p>📞 {req.phone}</p>}
                  </div>
                  <span className="inline-flex items-center gap-1 mt-1 text-[10px] font-semibold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full">
                    <Clock className="w-3 h-3" /> Pending Review
                  </span>
                </div>
              </div>
              <div className="flex w-full md:w-auto items-center justify-end space-x-3">
                <button
                  onClick={() => handleAction(req, 'rejected')}
                  className="px-4 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-xs font-bold transition-colors flex items-center space-x-2"
                >
                  <X className="w-4 h-4" />
                  <span>Reject</span>
                </button>
                <button
                  onClick={() => handleAction(req, 'approved')}
                  className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white shadow-lg shadow-emerald-500/20 text-xs font-bold transition-colors flex items-center space-x-2"
                >
                  <Check className="w-4 h-4" />
                  <span>Approve Access</span>
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-[#12172F] border border-white/10 rounded-2xl p-12 text-center">
            <ShieldCheck className="w-12 h-12 text-emerald-500/60 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-white mb-2">No Pending Requests</h3>
            <p className="text-sm text-slate-400 max-w-sm mx-auto">
              All coordinator access requests have been reviewed and processed.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
