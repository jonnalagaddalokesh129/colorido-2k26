import React, { useState } from 'react';
import { MapPin, Users, CheckCircle2, Navigation, Compass, ExternalLink, Sparkles } from 'lucide-react';
import { store } from '../lib/store';
import { Venue, EventItem } from '../types/database';
import { useToast } from '../context/ToastContext';

interface Props {
  initialVenueId?: string;
  onViewEvent: (eventId: string) => void;
}

export const VenuesPage: React.FC<Props> = ({ initialVenueId, onViewEvent }) => {
  const { showToast } = useToast();
  const venues: Venue[] = store.getVenues();
  const events: EventItem[] = store.getEvents();
  const [selectedVenueId, setSelectedVenueId] = useState<string>(() => {
    if (initialVenueId && venues.some(v => v.id === initialVenueId)) {
      return initialVenueId;
    }
    return venues[0]?.id || '';
  });
  const [directionsActive, setDirectionsActive] = useState<string | null>(null);
  const [mapExpanded, setMapExpanded] = useState(false);

  React.useEffect(() => {
    if (initialVenueId && venues.some(v => v.id === initialVenueId)) {
      setSelectedVenueId(initialVenueId);
    }
  }, [initialVenueId, venues]);

  const selectedVenue = venues.find(v => v.id === selectedVenueId) || venues[0];
  const hostedEvents = events.filter(e => e.venue_id === selectedVenue?.id);

  const handleGetDirections = (venue: Venue) => {
    setDirectionsActive(venue.id);
    // Open Google Maps directions to this venue
    const dest = `${venue.latitude},${venue.longitude}`;
    const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${dest}&travelmode=walking`;
    window.open(mapsUrl, '_blank');
    showToast(`Opening Google Maps directions to ${venue.name}!`, 'success');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#20B2AA]/15 border border-[#20B2AA]/30 text-[#006D8F] text-xs font-bold">
          <MapPin className="w-3.5 h-3.5" />
          <span>Interactive Campus Geography</span>
        </div>
        <h1 className="font-display font-extrabold text-3xl sm:text-5xl text-[#064E52] tracking-tight">
          Festival Venues &amp; Campus Map
        </h1>
        <p className="text-xs sm:text-sm text-[#006D8F] max-w-xl mx-auto">
          Explore all 6 world-class indoor arenas, open-air amphitheatres, and specialized studios hosting COLORIDO 2K26 championships.
        </p>
      </div>

      {/* Main Interactive Map & Venue Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Venue Selection Cards */}
        <div className="lg:col-span-5 space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#006D8F]">Official Festival Venues ({venues.length})</h2>

          <div className="space-y-3">
            {venues.map(venue => {
              const isSelected = venue.id === selectedVenue.id;
              const count = events.filter(e => e.venue_id === venue.id).length;

              return (
                <div
                  key={venue.id}
                  onClick={() => setSelectedVenueId(venue.id)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-[#1A2142] border-fuchsia-500 shadow-xl shadow-fuchsia-500/10'
                      : 'bg-[#12172F] border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-black/40 text-fuchsia-300">
                      {venue.short_code}
                    </span>
                    <span className="text-xs text-slate-400 flex items-center space-x-1">
                      <Users className="w-3.5 h-3.5 text-sky-400" />
                      <span>{venue.capacity} Capacity</span>
                    </span>
                  </div>

                  <h3 className="font-bold text-sm text-white">{venue.name}</h3>
                  <p className="text-xs text-slate-400 flex items-center space-x-1 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                    <span>{venue.location}</span>
                  </p>

                  <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between text-xs">
                  <span className="text-[#20B2AA] font-semibold">{count} Championships</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleGetDirections(venue);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-[11px] text-white font-medium flex items-center space-x-1 transition-colors"
                    >
                      <Navigation className="w-3 h-3 text-emerald-400" />
                      <span>Get Directions</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Selected Venue Details & Interactive Map Blueprint */}
        <div className="lg:col-span-7 space-y-6">
          {/* Active Blueprint & Photo */}
          <div className="bg-[#12172F] border border-white/10 rounded-3xl overflow-hidden shadow-2xl space-y-6">
            <div className="relative h-64 sm:h-80 w-full bg-slate-900">
              <img
                src={selectedVenue.image_url}
                alt={selectedVenue.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#12172F] via-[#12172F]/40 to-transparent" />

              <div className="absolute bottom-6 left-6 right-6">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded bg-fuchsia-600 text-white">
                  {selectedVenue.short_code}
                </span>
                <h3 className="text-xl sm:text-2xl font-extrabold text-white mt-1">{selectedVenue.name}</h3>
                <p className="text-xs text-slate-300 mt-1 flex items-center space-x-1">
                  <MapPin className="w-4 h-4 text-emerald-400" />
                  <span>{selectedVenue.location}</span>
                </p>
              </div>
            </div>

            {/* Content Details */}
            <div className="p-6 pt-0 space-y-6">
              {/* Facilities Grid */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#006D8F] mb-3">
                  Campus Facilities &amp; Stage Rig
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {selectedVenue.facilities.map((fac, idx) => (
                    <div
                      key={idx}
                      className="flex items-center space-x-2 p-2.5 rounded-xl bg-[#1A2142] border border-white/5 text-xs text-slate-200"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <span>{fac}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Events hosted at this venue */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#006D8F] mb-3">
                  Hosted Competitions &amp; Heats ({hostedEvents.length})
                </h4>
                <div className="space-y-2">
                  {hostedEvents.map(evt => (
                    <div
                      key={evt.event_id}
                      onClick={() => onViewEvent(evt.event_id)}
                      className="p-3 rounded-xl bg-[#1A2142] border border-white/5 hover:border-fuchsia-500/40 cursor-pointer transition-colors flex items-center justify-between text-xs"
                    >
                      <div>
                        <p className="font-bold text-white">{evt.event_name}</p>
                        <p className="text-[11px] text-slate-400">
                          {evt.event_date} • {evt.start_time.slice(0, 5)} - {evt.end_time.slice(0, 5)}
                        </p>
                      </div>
                      <span className="font-bold text-[#20B2AA] text-[11px]">View Event &rarr;</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Google Maps Embed */}
              <div className="rounded-2xl overflow-hidden border border-white/10 shadow-xl">
                <iframe
                  title={`Map: ${selectedVenue.name}`}
                  width="100%"
                  height="220"
                  frameBorder="0"
                  style={{ border: 0 }}
                  src={`https://maps.google.com/maps?q=${selectedVenue.latitude},${selectedVenue.longitude}&z=17&output=embed`}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  onClick={() => handleGetDirections(selectedVenue)}
                  className="flex-1 py-3 px-4 rounded-xl bg-[#20B2AA] hover:bg-[#1CA099] text-white font-bold text-xs shadow-lg transition-all flex items-center justify-center space-x-2"
                >
                  <Navigation className="w-4 h-4" />
                  <span>GET DIRECTIONS TO VENUE</span>
                </button>
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${selectedVenue.latitude},${selectedVenue.longitude}&travelmode=walking`}
                  target="_blank"
                  rel="noreferrer"
                  className="py-3 px-4 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs flex items-center space-x-1.5 transition-colors"
                >
                  <Compass className="w-4 h-4" />
                  <span>Open in Google Maps</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
