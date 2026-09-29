import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Calendar, MapPin, Trophy, Bell, ArrowRight, Sparkles } from 'lucide-react';
import { store } from '../../lib/store';
import { EventItem, Announcement, ResultItem, Venue } from '../../types/database';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (path: string) => void;
}

export const GlobalSearchModal: React.FC<Props> = ({ isOpen, onClose, onNavigate }) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          // Open handled by parent or toggle
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const q = query.toLowerCase().trim();

  const allEvents = store.getEvents();
  const allAnnouncements = store.getAnnouncements();
  const allResults = store.getResults();
  const allVenues = store.getVenues();

  const matchingEvents = q
    ? allEvents.filter(
        e =>
          e.event_name.toLowerCase().includes(q) ||
          e.category.toLowerCase().includes(q) ||
          e.sub_category.toLowerCase().includes(q) ||
          e.venue.toLowerCase().includes(q) ||
          e.description.toLowerCase().includes(q)
      ).slice(0, 5)
    : [];

  const matchingAnnouncements = q
    ? allAnnouncements.filter(
        a =>
          a.title.toLowerCase().includes(q) ||
          a.description.toLowerCase().includes(q) ||
          a.category.toLowerCase().includes(q)
      ).slice(0, 3)
    : [];

  const matchingResults = q
    ? allResults.filter(
        r =>
          (r.event_name && r.event_name.toLowerCase().includes(q)) ||
          r.participant_name.toLowerCase().includes(q) ||
          r.college.toLowerCase().includes(q)
      ).slice(0, 3)
    : [];

  const matchingVenues = q
    ? allVenues.filter(
        v =>
          v.name.toLowerCase().includes(q) ||
          v.location.toLowerCase().includes(q) ||
          v.short_code.toLowerCase().includes(q)
      ).slice(0, 2)
    : [];

  const hasResults =
    matchingEvents.length > 0 ||
    matchingAnnouncements.length > 0 ||
    matchingResults.length > 0 ||
    matchingVenues.length > 0;

  const handleSelect = (path: string) => {
    onNavigate(path);
    onClose();
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-start justify-center bg-[#064E52]/60 backdrop-blur-sm p-4 pt-16 sm:pt-24 animate-in fade-in duration-200"
    >
      <div
        onClick={e => e.stopPropagation()}
        className="bg-white border border-[#006D8F]/20 rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[80vh] text-[#064E52]"
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-[#006D8F]/15 bg-[#DDF3F0]">
          <Search className="w-5 h-5 text-[#20B2AA] mr-3 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search events, sports, cultural acts, announcements, results, venues... (Ctrl + K)"
            className="w-full bg-transparent text-sm sm:text-base text-[#064E52] placeholder-[#4A6B6D] focus:outline-none font-medium"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-[#4A6B6D] hover:text-[#064E52] p-1 rounded-md"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-block ml-2 px-2 py-0.5 text-[10px] font-mono bg-white text-[#006D8F] rounded border border-[#006D8F]/20 shadow-2xs">
            ESC
          </kbd>
        </div>

        {/* Search Results Area */}
        <div className="overflow-y-auto p-4 space-y-6 flex-1 custom-scrollbar">
          {!q && (
            <div className="text-center py-10">
              <div className="w-12 h-12 rounded-full bg-[#20B2AA]/15 text-[#20B2AA] flex items-center justify-center mx-auto mb-3">
                <Sparkles className="w-6 h-6" />
              </div>
              <p className="text-sm font-bold text-[#064E52]">Quick Global Search</p>
              <p className="text-xs text-[#4A6B6D] mt-1 max-w-sm mx-auto">
                Type anything to search across all 16 competition disciplines, schedules, podium results, announcements, and campus venues.
              </p>
              <div className="mt-4 flex flex-wrap gap-2 justify-center">
                {['Basketball', 'Choreoday', 'Battle of the Bands', 'Fashion Show', 'Fine Arts', 'Auditorium'].map(tag => (
                  <button
                    key={tag}
                    onClick={() => setQuery(tag)}
                    className="text-xs px-3 py-1 bg-[#DDF3F0] hover:bg-[#DDF3F0]/70 rounded-full text-[#006D8F] border border-[#006D8F]/20 font-medium transition-colors"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          )}

          {q && !hasResults && (
            <div className="text-center py-12">
              <p className="text-base font-bold text-[#064E52]">No matching festival records found</p>
              <p className="text-xs text-[#4A6B6D] mt-1">
                Try searching by discipline name, participant name, venue, or category.
              </p>
            </div>
          )}

          {/* Events matching */}
          {matchingEvents.length > 0 && (
            <div>
              <p className="text-xs font-bold text-[#4A6B6D] uppercase tracking-wider mb-2 flex items-center">
                <Calendar className="w-3.5 h-3.5 mr-1.5 text-[#006D8F]" /> Events &amp; Competitions ({matchingEvents.length})
              </p>
              <div className="space-y-2">
                {matchingEvents.map(evt => (
                  <div
                    key={evt.event_id}
                    onClick={() => handleSelect(`/events/${evt.event_id}`)}
                    className="flex items-center justify-between p-3 rounded-xl bg-[#DDF3F0]/40 hover:bg-[#DDF3F0] border border-[#006D8F]/15 hover:border-[#20B2AA] cursor-pointer transition-all group"
                  >
                    <div className="flex items-center space-x-3">
                      <img
                        src={evt.event_image}
                        alt={evt.event_name}
                        className="w-10 h-10 rounded-lg object-cover"
                      />
                      <div>
                        <p className="text-sm font-bold text-[#064E52] group-hover:text-[#20B2AA] transition-colors">
                          {evt.event_name}
                        </p>
                        <p className="text-xs text-[#4A6B6D] flex items-center space-x-2">
                          <span className="capitalize">{evt.category}</span>
                          <span>•</span>
                          <span>{evt.venue}</span>
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#006D8F] group-hover:translate-x-1 transition-all" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Announcements matching */}
          {matchingAnnouncements.length > 0 && (
            <div>
              <p className="text-xs font-bold text-[#4A6B6D] uppercase tracking-wider mb-2 flex items-center">
                <Bell className="w-3.5 h-3.5 mr-1.5 text-[#20B2AA]" /> Announcements ({matchingAnnouncements.length})
              </p>
              <div className="space-y-2">
                {matchingAnnouncements.map(ann => (
                  <div
                    key={ann.id}
                    onClick={() => handleSelect('/announcements')}
                    className="p-3 rounded-xl bg-[#DDF3F0]/40 hover:bg-[#DDF3F0] border border-[#006D8F]/15 hover:border-[#20B2AA] cursor-pointer transition-all group"
                  >
                    <div className="flex justify-between items-start">
                      <p className="text-sm font-bold text-[#064E52] group-hover:text-[#20B2AA] transition-colors">
                        {ann.title}
                      </p>
                      <span className="text-[10px] px-2 py-0.5 rounded font-bold uppercase bg-[#20B2AA]/20 text-[#064E52] border border-[#20B2AA]/30">
                        {ann.priority}
                      </span>
                    </div>
                    <p className="text-xs text-[#4A6B6D] line-clamp-1 mt-1">{ann.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Results matching */}
          {matchingResults.length > 0 && (
            <div>
              <p className="text-xs font-bold text-[#4A6B6D] uppercase tracking-wider mb-2 flex items-center">
                <Trophy className="w-3.5 h-3.5 mr-1.5 text-[#20B2AA]" /> Results &amp; Winners ({matchingResults.length})
              </p>
              <div className="space-y-2">
                {matchingResults.map(res => (
                  <div
                    key={res.id}
                    onClick={() => handleSelect('/results')}
                    className="flex items-center justify-between p-3 rounded-xl bg-[#DDF3F0]/40 hover:bg-[#DDF3F0] border border-[#006D8F]/15 hover:border-[#20B2AA] cursor-pointer transition-all group"
                  >
                    <div>
                      <p className="text-sm font-bold text-[#064E52] group-hover:text-[#20B2AA] transition-colors">
                        {res.position}: {res.participant_name} {res.team_name ? `(${res.team_name})` : ''}
                      </p>
                      <p className="text-xs text-[#4A6B6D]">
                        {res.event_name} • {res.college} • Score: {res.score}
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#006D8F] group-hover:translate-x-1 transition-all" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Venues matching */}
          {matchingVenues.length > 0 && (
            <div>
              <p className="text-xs font-bold text-[#4A6B6D] uppercase tracking-wider mb-2 flex items-center">
                <MapPin className="w-3.5 h-3.5 mr-1.5 text-[#006D8F]" /> Venues ({matchingVenues.length})
              </p>
              <div className="space-y-2">
                {matchingVenues.map(ven => (
                  <div
                    key={ven.id}
                    onClick={() => handleSelect('/venues')}
                    className="flex items-center justify-between p-3 rounded-xl bg-[#DDF3F0]/40 hover:bg-[#DDF3F0] border border-[#006D8F]/15 hover:border-[#20B2AA] cursor-pointer transition-all group"
                  >
                    <div>
                      <p className="text-sm font-bold text-[#064E52] group-hover:text-[#20B2AA] transition-colors">
                        {ven.name} ({ven.short_code})
                      </p>
                      <p className="text-xs text-[#4A6B6D]">
                        {ven.location} • Capacity: {ven.capacity}
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#006D8F] group-hover:translate-x-1 transition-all" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="p-3 bg-[#DDF3F0] border-t border-[#006D8F]/15 flex justify-between items-center text-[11px] text-[#4A6B6D]">
          <span>Search dynamically across the COLORIDO 2K26 database</span>
          <span>Press ESC to exit</span>
        </div>
      </div>
    </div>
  );
};
