import React, { useState, useEffect, useMemo } from 'react';
import { 
  Trophy, 
  Medal, 
  Sparkles, 
  Filter, 
  Search, 
  Building, 
  Calendar, 
  Award,
  Crown
} from 'lucide-react';
import { store } from '../lib/store';
import { ResultItem, EventItem } from '../types/database';

interface Props {
  onViewEvent: (eventId: string) => void;
}

export const ResultsPage: React.FC<Props> = ({ onViewEvent }) => {
  const [results, setResults] = useState<ResultItem[]>(() => store.getResults());
  const [events, setEvents] = useState<EventItem[]>(() => store.getEvents());

  // Filters
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedEventId, setSelectedEventId] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const update = () => {
      setResults(store.getResults());
      setEvents(store.getEvents());
    };
    update();
    const unsub = store.subscribe(update);
    return () => unsub();
  }, []);

  // Filtered published results
  const filteredResults = useMemo(() => {
    return results.filter(res => {
      if (!res.is_published) return false;

      const evt = events.find(e => e.event_id === res.event_id);

      // Category filter
      if (selectedCategory !== 'ALL' && evt?.category !== selectedCategory) return false;

      // Event filter
      if (selectedEventId !== 'ALL' && res.event_id !== selectedEventId) return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = res.participant_name.toLowerCase().includes(q);
        const matchesTeam = (res.team_name || '').toLowerCase().includes(q);
        const matchesCollege = res.college.toLowerCase().includes(q);
        const matchesEvent = (res.event_name || evt?.event_name || '').toLowerCase().includes(q);
        if (!matchesName && !matchesTeam && !matchesCollege && !matchesEvent) return false;
      }

      return true;
    });
  }, [results, events, selectedCategory, selectedEventId, searchQuery]);

  // Group results by event for podium presentation
  const groupedByEvent = useMemo(() => {
    const map = new Map<string, ResultItem[]>();
    filteredResults.forEach(res => {
      const current = map.get(res.event_id) || [];
      current.push(res);
      map.set(res.event_id, current);
    });
    return map;
  }, [filteredResults]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#20B2AA]/15 border border-[#20B2AA]/30 text-[#006D8F] text-xs font-bold">
          <Trophy className="w-3.5 h-3.5" />
          <span>Verified Adjudicator Declarations</span>
        </div>
        <h1 className="font-display font-extrabold text-3xl sm:text-5xl text-[#064E52] tracking-tight">
          Tournament Results &amp; Winners
        </h1>
        <p className="text-xs sm:text-sm text-[#006D8F] max-w-xl mx-auto">
          Official championship results and medal rankings across all 16 disciplines. Published live following adjudicator verification.
        </p>
      </div>

      {/* Filter Section */}
      <div className="bg-[#12172F] border border-white/10 rounded-3xl p-5 sm:p-6 shadow-xl space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search winner name, college..."
              className="w-full bg-[#1A2142] border border-white/10 rounded-xl py-2.5 pl-9 pr-3 text-xs text-white focus:outline-none"
            />
          </div>

          {/* Category */}
          <div>
            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              className="w-full bg-[#1A2142] border border-white/10 rounded-xl py-2.5 px-3 text-xs text-slate-200 focus:outline-none"
            >
              <option value="ALL">All Categories</option>
              <option value="cultural">Cultural Arts & Music</option>
              <option value="sports">Sports Championships</option>
            </select>
          </div>

          {/* Specific Event */}
          <div>
            <select
              value={selectedEventId}
              onChange={e => setSelectedEventId(e.target.value)}
              className="w-full bg-[#1A2142] border border-white/10 rounded-xl py-2.5 px-3 text-xs text-slate-200 focus:outline-none"
            >
              <option value="ALL">All Disciplines</option>
              {events.map(evt => (
                <option key={evt.event_id} value={evt.event_id}>
                  {evt.event_name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Results Groups */}
      {groupedByEvent.size === 0 ? (
        <div className="bg-[#12172F] border border-white/10 rounded-3xl p-12 text-center text-[#006D8F] text-xs">
          No published results found matching your search. Results are posted as soon as certified adjudicator scores are finalized.
        </div>
      ) : (
        <div className="space-y-8">
          {Array.from(groupedByEvent.entries()).map(([eventId, eventResults]) => {
            const evt = events.find(e => e.event_id === eventId);
            return (
              <div
                key={eventId}
                className="bg-[#12172F] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl"
              >
                {/* Event Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-fuchsia-600/20 text-fuchsia-300">
                      {evt?.category || 'Championship'}
                    </span>
                    <h3 className="font-extrabold text-xl text-[#064E52] mt-1">
                      {evt?.event_name || eventId}
                    </h3>
                  </div>

                  {evt && (
                    <button
                      onClick={() => onViewEvent(evt.event_id)}
                      className="text-xs font-semibold text-fuchsia-400 hover:text-fuchsia-300 self-start sm:self-auto"
                    >
                      View Event Profile &rarr;
                    </button>
                  )}
                </div>

                {/* Podium Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {eventResults.map(res => {
                    const isFirst = res.position.includes('1st');
                    const isSecond = res.position.includes('2nd');
                    const isThird = res.position.includes('3rd');

                    return (
                      <div
                        key={res.id}
                        className={`p-5 rounded-2xl border transition-all ${
                          isFirst
                            ? 'bg-gradient-to-b from-yellow-950/40 via-[#1A2142] to-[#1A2142] border-yellow-500/50 shadow-lg'
                            : isSecond
                            ? 'bg-[#1A2142] border-slate-400/30'
                            : isThird
                            ? 'bg-[#1A2142] border-amber-700/30'
                            : 'bg-[#1A2142] border-white/5'
                        }`}
                      >
                        <div className="flex justify-between items-start mb-3">
                          <span className={`text-xl ${isFirst ? 'scale-125' : ''}`}>
                            {isFirst ? '🥇' : isSecond ? '🥈' : isThird ? '🥉' : '⭐'}
                          </span>
                          <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                            isFirst
                              ? 'bg-yellow-500/20 text-yellow-300'
                              : isSecond
                              ? 'bg-slate-400/20 text-slate-200'
                              : 'bg-amber-600/20 text-amber-300'
                          }`}>
                            {res.position}
                          </span>
                        </div>

                        <h4 className="font-bold text-sm text-white">{res.participant_name}</h4>
                        {res.team_name && (
                          <p className="text-xs text-indigo-300 font-medium">Team: {res.team_name}</p>
                        )}
                        <p className="text-xs text-slate-400 mt-1">{res.college}</p>

                        <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs">
                          <span className="text-slate-400">Score: <strong className="text-white">{res.score}</strong></span>
                          <span className="font-bold text-yellow-400">+{res.points_awarded} pts</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
