import React, { useState, useEffect, useMemo } from 'react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Search, 
  Filter, 
  AlertTriangle, 
  Bookmark, 
  BookmarkCheck, 
  CalendarPlus, 
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { store } from '../lib/store';
import { ScheduleItem, EventItem, Venue } from '../types/database';
import { useFavorites } from '../context/FavoritesContext';
import { useToast } from '../context/ToastContext';
import { generateGoogleCalendarUrl, downloadIcsCalendar } from '../lib/calendar';

interface Props {
  onViewEvent: (eventId: string) => void;
  onRegisterEvent: (eventId: string) => void;
}

export const SchedulePage: React.FC<Props> = ({ onViewEvent, onRegisterEvent }) => {
  const { showToast } = useToast();
  const { isFavorite, toggleFavorite } = useFavorites();

  const [schedules, setSchedules] = useState<ScheduleItem[]>(() => store.getSchedules());
  const [events, setEvents] = useState<EventItem[]>(() => store.getEvents());
  const [venues, setVenues] = useState<Venue[]>(() => store.getVenues());

  // Views: 'day' | 'week' | 'category'
  const [activeView, setActiveView] = useState<'day' | 'week' | 'category'>('day');
  const [selectedDay, setSelectedDay] = useState<number>(1);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedVenue, setSelectedVenue] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const update = () => {
      setSchedules(store.getSchedules());
      setEvents(store.getEvents());
      setVenues(store.getVenues());
    };
    update();
    const unsub = store.subscribe(update);
    return () => unsub();
  }, []);

  // Compute parallel concurrent event overlaps to highlight conflicts
  const overlappingEventIds = useMemo(() => {
    const conflicts = new Set<string>();
    for (let i = 0; i < schedules.length; i++) {
      for (let j = i + 1; j < schedules.length; j++) {
        const a = schedules[i];
        const b = schedules[j];
        if (a.schedule_date === b.schedule_date) {
          const [aStartH, aStartM] = a.start_time.split(':').map(Number);
          const [aEndH, aEndM] = a.end_time.split(':').map(Number);
          const [bStartH, bStartM] = b.start_time.split(':').map(Number);
          const [bEndH, bEndM] = b.end_time.split(':').map(Number);

          const aStart = aStartH * 60 + aStartM;
          const aEnd = aEndH * 60 + aEndM;
          const bStart = bStartH * 60 + bStartM;
          const bEnd = bEndH * 60 + bEndM;

          if (aStart < bEnd && aEnd > bStart) {
            conflicts.add(a.id);
            conflicts.add(b.id);
          }
        }
      }
    }
    return conflicts;
  }, [schedules]);

  // Filtered schedules
  const filteredSchedules = useMemo(() => {
    return schedules.filter(sch => {
      const evt = events.find(e => e.event_id === sch.event_id);

      // Day View
      if (activeView === 'day' && sch.day_number !== selectedDay) return false;

      // Category filter
      if (selectedCategory !== 'ALL' && evt?.category !== selectedCategory) return false;

      // Venue filter
      if (selectedVenue !== 'ALL' && sch.venue_id !== selectedVenue) return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const name = (evt?.event_name || '').toLowerCase();
        const round = sch.round_name.toLowerCase();
        const venue = sch.venue_name.toLowerCase();
        if (!name.includes(q) && !round.includes(q) && !venue.includes(q)) return false;
      }

      return true;
    }).sort((a, b) => a.start_time.localeCompare(b.start_time));
  }, [schedules, events, activeView, selectedDay, selectedCategory, selectedVenue, searchQuery]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#20B2AA]/15 border border-[#20B2AA]/30 text-[#006D8F] text-xs font-bold">
          <Calendar className="w-3.5 h-3.5" />
          <span>Interactive Festival Timetable</span>
        </div>
        <h1 className="font-display font-extrabold text-3xl sm:text-5xl text-[#064E52] tracking-tight">
          Smart Event Schedule
        </h1>
        <p className="text-xs sm:text-sm text-[#006D8F] max-w-xl mx-auto">
          Explore the chronological timetable across all 3 festival days. Concurrent parallel events are visually highlighted to help you plan your itinerary without clash.
        </p>
      </div>

      {/* Control Bar: View Switcher (DAY / WEEK / CATEGORY) & Filters */}
      <div className="bg-[#12172F] border border-white/10 rounded-3xl p-5 sm:p-6 shadow-xl space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
          {/* Main View Selector */}
          <div className="flex bg-[#1A2142] p-1 rounded-2xl border border-white/5">
            <button
              onClick={() => setActiveView('day')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeView === 'day'
                  ? 'bg-gradient-to-r from-fuchsia-600 to-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Day View
            </button>
            <button
              onClick={() => setActiveView('week')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeView === 'week'
                  ? 'bg-gradient-to-r from-fuchsia-600 to-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Full Timeline View
            </button>
            <button
              onClick={() => setActiveView('category')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeView === 'category'
                  ? 'bg-gradient-to-r from-fuchsia-600 to-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Category View
            </button>
          </div>

          {/* Conflict Alert Legend */}
          <div className="flex items-center space-x-2 text-xs text-amber-300 bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-xl">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <span className="font-medium">Parallel slots highlighted with warning badges</span>
          </div>
        </div>

        {/* Day Selector (If Day View active) */}
        {activeView === 'day' && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { day: 1, date: 'Oct 15, 2026', label: 'Day 1 — Inaugural & Solo Prelims' },
              { day: 2, date: 'Oct 16, 2026', label: 'Day 2 — Mega Bands & Spikers' },
              { day: 3, date: 'Oct 17, 2026', label: 'Day 3 — Choreoday & Grand Gala' },
            ].map(d => (
              <button
                key={d.day}
                onClick={() => setSelectedDay(d.day)}
                className={`p-3.5 rounded-2xl border text-left transition-all ${
                  selectedDay === d.day
                    ? 'bg-gradient-to-r from-fuchsia-700/80 to-indigo-700/80 border-fuchsia-400 shadow-lg shadow-fuchsia-500/20'
                    : 'bg-white/10 border-white/20 hover:bg-white/15 hover:border-white/40'
                }`}
              >
                <span className={`text-[10px] font-bold uppercase tracking-wider block mb-0.5 ${
                  selectedDay === d.day ? 'text-fuchsia-200' : 'text-fuchsia-300'
                }`}>
                  Day 0{d.day} • {d.date}
                </span>
                <span className="font-bold text-xs sm:text-sm text-white block">{d.label}</span>
              </button>
            ))}
          </div>
        )}

        {/* Search & Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search schedule heats, venues..."
              className="w-full bg-[#1A2142] border border-white/10 rounded-xl py-2.5 pl-9 pr-3 text-xs text-white focus:outline-none"
            />
          </div>

          <div>
            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              className="w-full bg-[#1A2142] border border-white/10 rounded-xl py-2.5 px-3 text-xs text-slate-300 focus:outline-none"
            >
              <option value="ALL">All Categories</option>
              <option value="cultural">Cultural Disciplines</option>
              <option value="sports">Sports Championships</option>
            </select>
          </div>

          <div>
            <select
              value={selectedVenue}
              onChange={e => setSelectedVenue(e.target.value)}
              className="w-full bg-[#1A2142] border border-white/10 rounded-xl py-2.5 px-3 text-xs text-slate-300 focus:outline-none"
            >
              <option value="ALL">All Campus Venues</option>
              {venues.map(v => (
                <option key={v.id} value={v.id}>
                  {v.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Timetable Items */}
      <div className="space-y-4">
        {filteredSchedules.length === 0 ? (
          <div className="bg-[#12172F] border border-white/10 rounded-3xl p-12 text-center text-[#006D8F] text-xs">
            No schedule entries match your query for this view.
          </div>
        ) : (
          filteredSchedules.map(sch => {
            const evt = events.find(e => e.event_id === sch.event_id);
            const isClash = overlappingEventIds.has(sch.id);
            const saved = evt ? isFavorite(evt.event_id) : false;

            return (
              <div
                key={sch.id}
                className={`bg-[#12172F] border rounded-2xl p-5 transition-all shadow-lg hover:shadow-xl ${
                  isClash
                    ? 'border-amber-500/40 hover:border-amber-500'
                    : 'border-white/10 hover:border-fuchsia-500/40'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  {/* Left: Time & Day Badge */}
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-[#1A2142] rounded-xl border border-white/5 text-center min-w-[90px]">
                      <span className="font-mono font-bold text-xs text-white block">
                        {sch.start_time.slice(0, 5)}
                      </span>
                      <span className="text-[10px] text-slate-400 block">
                        to {sch.end_time.slice(0, 5)}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-fuchsia-600/30 text-fuchsia-300">
                          Day {sch.day_number}
                        </span>
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-white/5 text-slate-300">
                          {evt?.category || 'Festival'}
                        </span>
                        {isClash && (
                          <span className="flex items-center space-x-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                            <AlertTriangle className="w-3 h-3 text-amber-400" />
                            <span>Concurrent Parallel Slot</span>
                          </span>
                        )}
                      </div>

                      <h3
                        onClick={() => evt && onViewEvent(evt.event_id)}
                        className="font-bold text-base sm:text-lg text-white hover:text-fuchsia-400 cursor-pointer transition-colors"
                      >
                        {evt?.event_name || sch.event_id}
                      </h3>
                      <p className="text-xs text-fuchsia-400 font-medium">{sch.round_name}</p>
                    </div>
                  </div>

                  {/* Middle / Right: Venue and Actions */}
                  <div className="flex flex-wrap items-center justify-between md:justify-end gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-white/5">
                    <div className="flex items-center space-x-1.5 text-xs text-slate-300">
                      <MapPin className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <span className="truncate max-w-[200px]">{sch.venue_name}</span>
                    </div>

                    <div className="flex items-center space-x-2">
                      {/* Add to My Schedule (Favorite) */}
                      {evt && (
                        <button
                          onClick={() => toggleFavorite(evt.event_id, evt.event_name)}
                          className={`px-3 py-2 rounded-xl text-xs font-semibold border flex items-center space-x-1.5 transition-colors ${
                            saved
                              ? 'bg-rose-500/20 border-rose-500 text-rose-300'
                              : 'bg-white/5 border-white/10 text-slate-300 hover:text-white'
                          }`}
                        >
                          {saved ? <BookmarkCheck className="w-3.5 h-3.5 text-rose-400" /> : <Bookmark className="w-3.5 h-3.5" />}
                          <span className="hidden sm:inline">{saved ? 'In Schedule' : 'Add to Schedule'}</span>
                        </button>
                      )}

                      {/* Google / Outlook Calendar link */}
                      {evt && (
                        <a
                          href={generateGoogleCalendarUrl(evt)}
                          target="_blank"
                          rel="noreferrer"
                          className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-colors"
                          title="Sync to Google Calendar"
                        >
                          <CalendarPlus className="w-4 h-4 text-fuchsia-400" />
                        </a>
                      )}

                      {/* Register */}
                      {evt && (
                        <button
                          onClick={() => onRegisterEvent(evt.event_id)}
                          className="px-4 py-2 rounded-xl bg-gradient-to-r from-fuchsia-600 to-indigo-600 hover:from-fuchsia-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md transition-all"
                        >
                          Register
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
