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
    <div className="group bg-[#10051D]/90 border border-[rgba(216,180,254,0.16)] hover:border-[#FF1493]/60 rounded-2xl overflow-hidden shadow-[0_10px_30px_rgba(91,33,245,0.15)] hover:shadow-[0_15px_40px_rgba(255,20,147,0.25)] transition-all duration-300 flex flex-col h-full transform hover:-translate-y-1.5 backdrop-blur-xl">
      {/* Cover Image & Badges */}
      <div className="relative h-48 w-full overflow-hidden bg-[#080514]">
        <img
          src={event.event_image}
          alt={event.event_name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#10051D] via-[#10051D]/40 to-transparent" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider shadow-sm ${
              event.category === 'cultural'
                ? 'bg-[#7C3AED] text-white border border-white/20'
                : 'bg-[#FF1493] text-white border border-white/20'
            }`}>
              {event.category}
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#080514]/90 text-[#D8B4FE] border border-[rgba(216,180,254,0.3)] backdrop-blur-md">
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
                ? 'bg-[#FF1493] text-white shadow-[#FF1493]/40 scale-110'
                : 'bg-[#080514]/80 text-[#D8B4FE] hover:text-[#FF2B9A] border border-[rgba(216,180,254,0.2)]'
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
              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
              : event.current_participants >= event.maximum_participants * 0.8
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
              : 'bg-[#FF1493]/20 text-[#FF2B9A] border border-[#FF1493]/40'
          }`}>
            {isClosed ? 'Registration Closed' : event.current_participants >= event.maximum_participants * 0.8 ? 'Filling Fast' : 'Registration Open'}
          </span>
        </div>

        {/* Fee Pill */}
        <div className="absolute bottom-3 right-3 bg-[#080514]/90 backdrop-blur-md border border-[rgba(216,180,254,0.25)] px-2.5 py-0.5 rounded-full text-xs font-mono font-bold text-[#D8B4FE] shadow-sm">
          {event.registration_fee === 0 ? 'Free Entry' : `₹${event.registration_fee}`}
        </div>
      </div>

      {/* Body Details */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <h3 
            onClick={() => onViewDetails(event.event_id)}
            className="font-bold text-base sm:text-lg text-[#F5F0FF] group-hover:text-[#FF2B9A] transition-colors cursor-pointer line-clamp-1"
          >
            {event.event_name}
          </h3>
          <p className="text-xs text-[#B9A9D6] line-clamp-2 mt-1.5 leading-relaxed">
            {event.description}
          </p>
        </div>

        {/* Meta Info */}
        <div className="space-y-2 text-xs text-[#F5F0FF] pt-2 border-t border-[rgba(216,180,254,0.12)]">
          <div className="flex items-center space-x-2">
            <Calendar className="w-3.5 h-3.5 text-[#FF1493] flex-shrink-0" />
            <span className="truncate font-medium text-[#B9A9D6]">{formattedDate}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="w-3.5 h-3.5 text-[#7C3AED] flex-shrink-0" />
            <span className="font-medium text-[#B9A9D6]">{event.start_time.slice(0, 5)} - {event.end_time.slice(0, 5)}</span>
          </div>
          <div className="flex items-center space-x-2">
            <MapPin className="w-3.5 h-3.5 text-[#D8B4FE] flex-shrink-0" />
            <span className="truncate font-medium text-[#B9A9D6]">{event.venue}</span>
          </div>
          <div className="flex items-center justify-between text-[11px] text-[#7A6A9A] pt-1">
            <div className="flex items-center space-x-1.5">
              <Users className="w-3.5 h-3.5 text-[#FF1493]" />
              <span className="text-[#B9A9D6]">
                {event.participation_type === 'team'
                  ? `Team (${event.team_size_min}-${event.team_size_max})`
                  : 'Solo Entry'}
              </span>
            </div>
            <span className="font-semibold text-[#D8B4FE]">
              {event.current_participants} / {event.maximum_participants} Registered
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2 pt-2">
          <button
            onClick={() => onViewDetails(event.event_id)}
            className="w-full py-2.5 px-3 rounded-xl bg-[#5B21F5]/15 hover:bg-[#5B21F5]/25 border border-[rgba(216,180,254,0.25)] text-xs font-bold text-[#D8B4FE] hover:text-white transition-colors text-center"
          >
            Details
          </button>
          <button
            onClick={() => onRegister(event.event_id)}
            disabled={isClosed}
            className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold text-center transition-all ${
              isClosed
                ? 'bg-white/5 text-slate-500 cursor-not-allowed border border-white/10'
                : 'btn-primary-neon text-white shadow-md'
            }`}
          >
            {isClosed ? 'Closed' : 'Register Now'}
          </button>
        </div>
      </div>
    </div>
  );
};
