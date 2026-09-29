import { EventItem } from '../types/database';

export function generateGoogleCalendarUrl(event: EventItem): string {
  // Format dates: YYYYMMDDTHHmmssZ
  const dateStr = event.event_date.replace(/-/g, '');
  const startStr = event.start_time.replace(/:/g, '').slice(0, 4) + '00';
  const endStr = event.end_time.replace(/:/g, '').slice(0, 4) + '00';

  const startIso = `${dateStr}T${startStr}`;
  const endIso = `${dateStr}T${endStr}`;

  const title = encodeURIComponent(`COLORIDO 2K26: ${event.event_name}`);
  const details = encodeURIComponent(
    `${event.description}\n\nVenue: ${event.venue}\nCategory: ${event.category.toUpperCase()}\nCoordinator: ${event.coordinator_name} (${event.coordinator_contact})\n\nOfficial Festival: COLORIDO 2K26 — Where Talent Meets the Spotlight`
  );
  const location = encodeURIComponent(`${event.venue}, Campus Enclave`);

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startIso}/${endIso}&details=${details}&location=${location}`;
}

export function downloadIcsCalendar(event: EventItem): void {
  const dateClean = event.event_date.replace(/-/g, '');
  const startClean = event.start_time.replace(/:/g, '').slice(0, 4) + '00';
  const endClean = event.end_time.replace(/:/g, '').slice(0, 4) + '00';

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//COLORIDO 2K26//Festival Management//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:colorido-${event.event_id}-${Date.now()}@colorido2k26.edu`,
    `DTSTAMP:${dateClean}T000000Z`,
    `DTSTART:${dateClean}T${startClean}`,
    `DTEND:${dateClean}T${endClean}`,
    `SUMMARY:COLORIDO 2K26: ${event.event_name}`,
    `DESCRIPTION:${event.description.replace(/\n/g, '\\n')}`,
    `LOCATION:${event.venue}`,
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${event.event_id}_colorido2k26.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
