import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  X, 
  Sparkles, 
  Calendar, 
  MapPin, 
  Users, 
  CheckCircle2, 
  SlidersHorizontal,
  Flame,
  Heart
} from 'lucide-react';
import { store } from '../lib/store';
import { EventItem, Venue } from '../types/database';
import { EventCard } from '../components/events/EventCard';
import { useFavorites } from '../context/FavoritesContext';

interface Props {
  initialCategory?: string;
  onViewEvent: (eventId: string) => void;
  onRegisterEvent: (eventId: string) => void;
}

export const EventsPage: React.FC<Props> = ({ 
  initialCategory = 'ALL', 
  onViewEvent, 
  onRegisterEvent 
}) => {
  const { favorites } = useFavorites();
  const [events, setEvents] = useState<EventItem[]>(() => store.getEvents());
  const [venues, setVenues] = useState<Venue[]>(() => store.getVenues());

  // Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<string>(initialCategory.toUpperCase());
  const [selectedDate, setSelectedDate] = useState<string>('ALL');
  const [selectedVenue, setSelectedVenue] = useState<string>('ALL');
  const [selectedParticipationType, setSelectedParticipationType] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [showMyEventsOnly, setShowMyEventsOnly] = useState(false);

  useEffect(() => {
    const update = () => {
      setEvents(store.getEvents());
      setVenues(store.getVenues());
    };
    update();
    const unsub = store.subscribe(update);
    return () => unsub();
  }, []);

  const tabs = [
    { label: 'ALL', count: events.length },
    { label: 'CULTURAL', count: events.filter(e => e.category === 'cultural').length },
    { label: 'SPORTS', count: events.filter(e => e.category === 'sports').length },
    { label: 'BOYS', count: events.filter(e => e.sub_category === 'boys').length },
    { label: 'GIRLS', count: events.filter(e => e.sub_category === 'girls').length },
  ];

  // Distinct dates
  const availableDates = Array.from(new Set(events.map(e => e.event_date))).sort();

  // Multi-filter evaluation
  const filteredEvents = useMemo(() => {
    return events.filter(event => {
      // Tab filter
      if (activeTab === 'CULTURAL' && event.category !== 'cultural') return false;
      if (activeTab === 'SPORTS' && event.category !== 'sports') return false;
      if (activeTab === 'BOYS' && event.sub_category !== 'boys') return false;
      if (activeTab === 'GIRLS' && event.sub_category !== 'girls') return false;

      // My events filter
      if (showMyEventsOnly && !favorites.includes(event.event_id)) return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = event.event_name.toLowerCase().includes(q);
        const matchesVenue = event.venue.toLowerCase().includes(q);
        const matchesSubCat = event.sub_category.toLowerCase().includes(q);
        const matchesDesc = event.description.toLowerCase().includes(q);
        if (!matchesName && !matchesVenue && !matchesSubCat && !matchesDesc) return false;
      }

      // Date filter
      if (selectedDate !== 'ALL' && event.event_date !== selectedDate) return false;

      // Venue filter
      if (selectedVenue !== 'ALL' && event.venue_id !== selectedVenue) return false;

      // Participation type
      if (selectedParticipationType !== 'ALL' && event.participation_type !== selectedParticipationType) return false;

      // Registration status
      if (selectedStatus !== 'ALL') {
        if (selectedStatus === 'open' && event.status !== 'open') return false;
        if (selectedStatus === 'closed' && event.status !== 'closed') return false;
      }

      return true;
    });
  }, [
    events,
    activeTab,
    showMyEventsOnly,
    favorites,
    searchQuery,
    selectedDate,
    selectedVenue,
    selectedParticipationType,
    selectedStatus
  ]);

  const resetFilters = () => {
    setActiveTab('ALL');
    setSearchQuery('');
    setSelectedDate('ALL');
    setSelectedVenue('ALL');
    setSelectedParticipationType('ALL');
    setSelectedStatus('ALL');
    setShowMyEventsOnly(false);
  };

  const hasActiveFilters =
    activeTab !== 'ALL' ||
    searchQuery !== '' ||
    selectedDate !== 'ALL' ||
    selectedVenue !== 'ALL' ||
    selectedParticipationType !== 'ALL' ||
    selectedStatus !== 'ALL' ||
    showMyEventsOnly;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#20B2AA]/15 border border-[#20B2AA]/30 text-[#006D8F] text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>COLORIDO 2K26 Competition Directory</span>
        </div>
        <h1 className="font-display font-extrabold text-3xl sm:text-5xl text-[#064E52] tracking-tight">
          Explore Festival Events
        </h1>
        <p className="text-xs sm:text-sm text-[#006D8F] max-w-xl mx-auto leading-relaxed">
          Filter and discover across all 16 official cultural and sports disciplines. Bookmark your favorites and register before deadlines close.
        </p>
      </div>

      {/* Main Filter Section */}
      <div className="bg-[#12172F] border border-white/10 rounded-3xl p-5 sm:p-6 shadow-xl space-y-5">
        {/* Navigation Tabs (ALL, CULTURAL, SPORTS, BOYS, GIRLS) */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
          <div className="flex flex-wrap gap-2">
            {tabs.map(tab => (
              <button
                key={tab.label}
                onClick={() => {
                  setActiveTab(tab.label);
                  setShowMyEventsOnly(false);
                }}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
                  activeTab === tab.label && !showMyEventsOnly
                    ? 'bg-gradient-to-r from-fuchsia-600 to-indigo-600 text-white shadow-lg shadow-fuchsia-500/20'
                    : 'bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white'
                }`}
              >
                <span>{tab.label}</span>
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-black/30 font-mono">
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* "My Events" Favorites Toggle */}
          <button
            onClick={() => setShowMyEventsOnly(!showMyEventsOnly)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 border ${
              showMyEventsOnly
                ? 'bg-rose-600 text-white border-rose-500 shadow-md shadow-rose-500/20'
                : 'bg-white/5 border-white/10 text-slate-300 hover:text-white'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${showMyEventsOnly ? 'fill-current' : 'text-rose-400'}`} />
            <span>MY EVENTS</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-black/30 font-mono">
              {favorites.length}
            </span>
          </button>
        </div>

        {/* Search Bar & Secondary Dropdowns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Search Input */}
          <div className="lg:col-span-2 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by event name, rules, venue..."
              className="w-full bg-[#1A2142] border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-fuchsia-500/50"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-3 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Date Filter */}
          <div>
            <select
              value={selectedDate}
              onChange={e => setSelectedDate(e.target.value)}
              className="w-full bg-[#1A2142] border border-white/10 rounded-xl py-2.5 px-3 text-xs text-slate-200 focus:outline-none focus:border-fuchsia-500/50 cursor-pointer"
            >
              <option value="ALL">All Event Dates</option>
              {availableDates.map(d => (
                <option key={d} value={d}>
                  {new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </option>
              ))}
            </select>
          </div>

          {/* Venue Filter */}
          <div>
            <select
              value={selectedVenue}
              onChange={e => setSelectedVenue(e.target.value)}
              className="w-full bg-[#1A2142] border border-white/10 rounded-xl py-2.5 px-3 text-xs text-slate-200 focus:outline-none focus:border-fuchsia-500/50 cursor-pointer"
            >
              <option value="ALL">All Venues</option>
              {venues.map(v => (
                <option key={v.id} value={v.id}>
                  {v.name}
                </option>
              ))}
            </select>
          </div>

          {/* Participation Type Filter */}
          <div>
            <select
              value={selectedParticipationType}
              onChange={e => setSelectedParticipationType(e.target.value)}
              className="w-full bg-[#1A2142] border border-white/10 rounded-xl py-2.5 px-3 text-xs text-slate-200 focus:outline-none focus:border-fuchsia-500/50 cursor-pointer"
            >
              <option value="ALL">Solo & Team Events</option>
              <option value="individual">Solo / Individual Only</option>
              <option value="team">Team / Group Only</option>
            </select>
          </div>
        </div>

        {/* Clear Filters Indicator */}
        {hasActiveFilters && (
          <div className="flex items-center justify-between pt-2 text-xs">
            <span className="text-slate-400">
              Showing <strong className="text-white">{filteredEvents.length}</strong> of {events.length} events
            </span>
            <button
              onClick={resetFilters}
              className="text-fuchsia-400 hover:text-fuchsia-300 font-semibold flex items-center space-x-1"
            >
              <X className="w-3.5 h-3.5" />
              <span>Reset All Filters</span>
            </button>
          </div>
        )}
      </div>

      {/* Events Grid */}
      {filteredEvents.length === 0 ? (
        <div className="bg-[#12172F] border border-white/10 rounded-3xl p-12 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-white/5 text-slate-400 flex items-center justify-center mx-auto">
            <Filter className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-[#064E52]">No events match your selected filters</h3>
          <p className="text-xs text-[#006D8F] max-w-sm mx-auto">
            Try adjusting your search query, selecting "All Dates", or clearing the category filter to explore all 16 competition disciplines.
          </p>
          <button
            onClick={resetFilters}
            className="px-5 py-2.5 rounded-xl bg-[#20B2AA] hover:bg-[#1CA099] text-white font-bold text-xs"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map(event => (
            <EventCard
              key={event.event_id}
              event={event}
              onViewDetails={onViewEvent}
              onRegister={onRegisterEvent}
            />
          ))}
        </div>
      )}
    </div>
  );
};
