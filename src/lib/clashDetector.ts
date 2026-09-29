import { EventItem, Registration } from '../types/database';
import { store } from './store';

export interface ClashResult {
  hasClash: boolean;
  conflictingEvent?: EventItem;
  message?: string;
}

/**
 * Checks whether an event overlaps with any of the user's currently registered events.
 * If user has registered for Event A on 2026-10-15 from 10:00 to 13:00,
 * and tries to register for Event B on 2026-10-15 from 12:00 to 15:00,
 * a schedule conflict is flagged!
 */
export function checkEventClash(
  targetEventId: string, 
  userRegistrations: Registration[]
): ClashResult {
  const targetEvent = store.getEventById(targetEventId);
  if (!targetEvent) return { hasClash: false };

  // Parse target start and end minutes
  const [targetStartH, targetStartM] = targetEvent.start_time.split(':').map(Number);
  const [targetEndH, targetEndM] = targetEvent.end_time.split(':').map(Number);
  const targetStart = targetStartH * 60 + targetStartM;
  const targetEnd = targetEndH * 60 + targetEndM;

  for (const reg of userRegistrations) {
    if (reg.status === 'cancelled') continue;
    if (reg.event_id === targetEventId) {
      return {
        hasClash: true,
        conflictingEvent: targetEvent,
        message: `You are already registered for this event (${targetEvent.event_name})!`
      };
    }

    const regEvent = store.getEventById(reg.event_id);
    if (!regEvent) continue;

    // Check if on same date
    if (regEvent.event_date === targetEvent.event_date) {
      const [regStartH, regStartM] = regEvent.start_time.split(':').map(Number);
      const [regEndH, regEndM] = regEvent.end_time.split(':').map(Number);
      const regStart = regStartH * 60 + regStartM;
      const regEnd = regEndH * 60 + regEndM;

      // Overlap condition: startA < endB and endA > startB
      const overlaps = targetStart < regEnd && targetEnd > regStart;
      if (overlaps) {
        return {
          hasClash: true,
          conflictingEvent: regEvent,
          message: `Schedule Conflict Detected: "${targetEvent.event_name}" (${targetEvent.start_time.slice(0, 5)} - ${targetEvent.end_time.slice(0, 5)} at ${targetEvent.venue}) directly overlaps with your registered event "${regEvent.event_name}" (${regEvent.start_time.slice(0, 5)} - ${regEvent.end_time.slice(0, 5)} at ${regEvent.venue}).`
        };
      }
    }
  }

  return { hasClash: false };
}
