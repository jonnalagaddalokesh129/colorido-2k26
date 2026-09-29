import React from 'react';
import { Calendar, Clock, MapPin, Users, Heart, ArrowRight, Sparkles } from 'lucide-react';
import { EventItem } from '../../types/database';
import { useFavorites } from '../../context/FavoritesContext';

interface Props {
  event: EventItem;
  onViewDetails: (eventId: string) => void;
  onRegister: (eventId: string) => void;
}

export const EventCard: React.FC<Props> = ({ event, onViewDetails, onRegister }) => {
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorited = isFavorite(event.event_id);

  const formattedDate = new Date(event.event_date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  const isFull = event.current_participants >= event.maximum_participants;
  const isClosed = event.status === 'closed' || isFull;

  return (
    <div className="group bg-white border border-[#006D8F]/15 hover:border-[#20B2AA] rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full transform hover:-translate-y-1">
      {/* Cover Image & Badges */}
      <div className="relative h-48 w-full overflow-hidden bg-[#DDF3F0]">
        <img
          src={event.event_image}
          alt={event.event_name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#064E52]/80 via-[#064E52]/20 to-transparent" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider shadow-sm ${
              event.category === 'cultural'
                ? 'bg-[#006D8F] text-white border border-white/20'
                : 'bg-[#20B2AA] text-white border border-white/20'
            }`}>
              {event.category}
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/90 text-[#064E52] border border-[#006D8F]/20 backdrop-blur-md">
              {event.sub_category}
            </span>
          </div>

          {/* Heart / Favorite Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleFavorite(event.event_id, event.event_name);
            }}
            className={`p-2 rounded-full backdrop-blur-md transition-all shadow-sm ${
              favorited
                ? 'bg-rose-500 text-white shadow-rose-500/40 scale-110'
                : 'bg-white/90 text-[#064E52] hover:bg-white'
            }`}
            aria-label={favorited ? 'Remove from favorites' : 'Save to favorites'}
          >
            <Heart className={`w-4 h-4 ${favorited ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Registration status badge */}
        <div className="absolute bottom-3 left-3">
          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider backdrop-blur-md ${
            isClosed
              ? 'bg-rose-100 text-rose-800 border border-rose-300'
              : event.current_participants >= event.maximum_participants * 0.8
              ? 'bg-amber-100 text-amber-800 border border-amber-300'
              : 'bg-[#DDF3F0] text-[#064E52] border border-[#20B2AA]/50'
          }`}>
            {isClosed ? 'Registration Closed' : event.current_participants >= event.maximum_participants * 0.8 ? 'Filling Fast' : 'Open'}
          </span>
        </div>

        {/* Fee Pill */}
        <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-md border border-[#006D8F]/20 px-2.5 py-0.5 rounded-full text-xs font-mono font-bold text-[#006D8F] shadow-sm">
          {event.registration_fee === 0 ? 'Free Entry' : `₹${event.registration_fee}`}
        </div>
      </div>

      {/* Body Details */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <h3 
            onClick={() => onViewDetails(event.event_id)}
            className="font-bold text-base sm:text-lg text-[#064E52] group-hover:text-[#20B2AA] transition-colors cursor-pointer line-clamp-1"
          >
            {event.event_name}
          </h3>
          <p className="text-xs text-[#4A6B6D] line-clamp-2 mt-1.5 leading-relaxed">
            {event.description}
          </p>
        </div>

        {/* Meta Info */}
        <div className="space-y-2 text-xs text-[#064E52] pt-2 border-t border-[#006D8F]/15">
          <div className="flex items-center space-x-2">
            <Calendar className="w-3.5 h-3.5 text-[#006D8F] flex-shrink-0" />
            <span className="truncate font-medium">{formattedDate}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="w-3.5 h-3.5 text-[#20B2AA] flex-shrink-0" />
            <span className="font-medium">{event.start_time.slice(0, 5)} - {event.end_time.slice(0, 5)}</span>
          </div>
          <div className="flex items-center space-x-2">
            <MapPin className="w-3.5 h-3.5 text-[#006D8F] flex-shrink-0" />
            <span className="truncate font-medium">{event.venue}</span>
          </div>
          <div className="flex items-center justify-between text-[11px] text-[#4A6B6D] pt-1">
            <div className="flex items-center space-x-1.5">
              <Users className="w-3.5 h-3.5 text-[#20B2AA]" />
              <span>
                {event.participation_type === 'team'
                  ? `Team (${event.team_size_min}-${event.team_size_max})`
                  : 'Solo'}
              </span>
            </div>
            <span className="font-medium text-[#064E52]">
              {event.current_participants} / {event.maximum_participants} Registered
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2 pt-2">
          <button
            onClick={() => onViewDetails(event.event_id)}
            className="w-full py-2.5 px-3 rounded-xl bg-[#DDF3F0] hover:bg-[#DDF3F0]/70 border border-[#006D8F]/20 text-xs font-bold text-[#006D8F] transition-colors text-center"
          >
            View Details
          </button>
          <button
            onClick={() => onRegister(event.event_id)}
            disabled={isClosed}
            className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold text-center transition-all ${
              isClosed
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                : 'bg-[#20B2AA] hover:bg-[#1CA099] text-white shadow-md shadow-[#20B2AA]/20'
            }`}
          >
            {isClosed ? 'Closed' : 'Register Now'}
          </button>
        </div>
      </div>
    </div>
  );
};
