import React from 'react';
import { AlertTriangle, Clock, MapPin, X, ArrowRight, ShieldAlert } from 'lucide-react';
import { EventItem } from '../../types/database';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  targetEvent: EventItem;
  conflictingEvent: EventItem;
  onProceedAnyway?: () => void;
  onViewSchedule: () => void;
}

export const ClashWarningModal: React.FC<Props> = ({
  isOpen,
  onClose,
  targetEvent,
  conflictingEvent,
  onProceedAnyway,
  onViewSchedule
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-[#12172F] border border-amber-500/40 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative text-slate-100">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-2 rounded-lg hover:bg-white/5 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 mb-5">
          <div className="p-3 bg-amber-500/20 text-amber-400 rounded-xl border border-amber-500/30">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Schedule Conflict Detected</h3>
            <p className="text-xs text-amber-300">Smart Clash Engine Warning</p>
          </div>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed mb-5">
          You are attempting to register for an event that overlaps in date and time with another event you have already registered for:
        </p>

        {/* Comparison Cards */}
        <div className="space-y-3 mb-6">
          {/* Target Event */}
          <div className="p-4 rounded-xl bg-fuchsia-950/30 border border-fuchsia-500/30">
            <span className="text-[10px] font-bold uppercase text-fuchsia-400 tracking-wider block mb-1">
              Event You Wish to Register:
            </span>
            <p className="font-bold text-sm text-white">{targetEvent.event_name}</p>
            <div className="mt-2 flex flex-wrap gap-3 text-xs text-slate-300">
              <span className="flex items-center">
                <Clock className="w-3.5 h-3.5 text-fuchsia-400 mr-1" />
                {targetEvent.start_time.slice(0, 5)} - {targetEvent.end_time.slice(0, 5)}
              </span>
              <span className="flex items-center">
                <MapPin className="w-3.5 h-3.5 text-fuchsia-400 mr-1" />
                {targetEvent.venue}
              </span>
            </div>
          </div>

          {/* Conflicting Event */}
          <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-500/30">
            <span className="text-[10px] font-bold uppercase text-amber-400 tracking-wider block mb-1">
              Your Existing Registered Event:
            </span>
            <p className="font-bold text-sm text-white">{conflictingEvent.event_name}</p>
            <div className="mt-2 flex flex-wrap gap-3 text-xs text-slate-300">
              <span className="flex items-center">
                <Clock className="w-3.5 h-3.5 text-amber-400 mr-1" />
                {conflictingEvent.start_time.slice(0, 5)} - {conflictingEvent.end_time.slice(0, 5)}
              </span>
              <span className="flex items-center">
                <MapPin className="w-3.5 h-3.5 text-amber-400 mr-1" />
                {conflictingEvent.venue}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white/5 p-3 rounded-xl border border-white/5 text-xs text-slate-300 mb-6 flex items-start space-x-2">
          <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
          <span>
            University tournament regulations penalize non-reporting or late arrivals. We strongly recommend choosing an alternative event slot.
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => {
              onClose();
              onViewSchedule();
            }}
            className="flex-1 py-3 px-4 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold transition-colors text-center"
          >
            Review Smart Schedule
          </button>

          {onProceedAnyway && (
            <button
              onClick={() => {
                onClose();
                onProceedAnyway();
              }}
              className="flex-1 py-3 px-4 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold shadow-lg transition-all text-center"
            >
              Acknowledge & Proceed
            </button>
          )}

          <button
            onClick={onClose}
            className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
