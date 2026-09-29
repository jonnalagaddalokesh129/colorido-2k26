import React, { useState, useEffect, useMemo } from 'react';
import { Bell, Search, Filter, AlertCircle, AlertTriangle, Info, Calendar, Sparkles } from 'lucide-react';
import { store } from '../lib/store';
import { Announcement } from '../types/database';

export const AnnouncementsPage: React.FC = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>(() => store.getAnnouncements());
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const update = () => {
      setAnnouncements(store.getAnnouncements());
    };
    update();
    const unsub = store.subscribe(update);
    return () => unsub();
  }, []);

  const categories = ['ALL', 'IMPORTANT', 'GENERAL', 'CULTURAL', 'SPORTS', 'SCHEDULE', 'RESULTS'];

  const filtered = useMemo(() => {
    return announcements.filter(a => {
      if (!a.is_published) return false;
      if (selectedCategory !== 'ALL' && a.category !== selectedCategory) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        if (!a.title.toLowerCase().includes(q) && !a.description.toLowerCase().includes(q)) return false;
      }
      return true;
    }).sort((a, b) => {
      // Pinned and Urgent first
      if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
      if (a.priority === 'Urgent' && b.priority !== 'Urgent') return -1;
      if (b.priority === 'Urgent' && a.priority !== 'Urgent') return 1;
      return new Date(b.published_at).getTime() - new Date(a.published_at).getTime();
    });
  }, [announcements, selectedCategory, searchQuery]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#20B2AA]/15 border border-[#20B2AA]/30 text-[#006D8F] text-xs font-bold">
          <Bell className="w-3.5 h-3.5" />
          <span>Official Festival Communications</span>
        </div>
        <h1 className="font-display font-extrabold text-3xl sm:text-5xl text-[#064E52] tracking-tight">
          Notices &amp; Announcements
        </h1>
        <p className="text-xs sm:text-sm text-[#006D8F] max-w-xl mx-auto">
          Stay up to date with match scheduling amendments, stage reporting protocols, venue guidelines, and key festival updates.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#12172F] border border-white/10 rounded-3xl p-5 sm:p-6 shadow-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  selectedCategory === cat
                    ? 'bg-gradient-to-r from-fuchsia-600 to-indigo-600 text-white shadow-md'
                    : 'bg-white/5 hover:bg-white/10 text-slate-300'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search announcements..."
              className="w-full bg-[#1A2142] border border-white/10 rounded-xl py-2 pl-10 pr-3 text-xs text-white focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Announcements List */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="bg-[#12172F] border border-white/10 rounded-3xl p-12 text-center text-slate-400 text-xs">
            No announcements match your filter.
          </div>
        ) : (
          filtered.map(item => {
            const isUrgent = item.priority === 'Urgent';
            const isImportant = item.priority === 'Important';

            return (
              <div
                key={item.id}
                className={`p-6 rounded-3xl border transition-all shadow-xl ${
                  isUrgent
                    ? 'bg-[#181126] border-rose-500/40 hover:border-rose-500'
                    : isImportant
                    ? 'bg-[#141834] border-amber-500/40 hover:border-amber-500'
                    : 'bg-[#12172F] border-white/10 hover:border-fuchsia-500/30'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                      isUrgent
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                        : isImportant
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        : 'bg-white/10 text-slate-300'
                    }`}>
                      {item.priority} Priority
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-white/5 text-fuchsia-400">
                      {item.category}
                    </span>
                    {item.pinned && (
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-yellow-500/20 text-yellow-300">
                        📌 Pinned Notice
                      </span>
                    )}
                  </div>

                  <span className="text-xs text-slate-400 font-mono">
                    {new Date(item.published_at).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </span>
                </div>

                <h3 className="font-bold text-base sm:text-lg text-white mb-2">{item.title}</h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{item.description}</p>

                <div className="mt-4 pt-3 border-t border-white/5 flex justify-between items-center text-[11px] text-slate-400">
                  <span>Authorized by: <strong className="text-slate-300">{item.author}</strong></span>
                  <span className="font-mono">COLORIDO 2K26 Secretariat</span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
