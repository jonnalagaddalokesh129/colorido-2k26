import { Registration } from '../types/database';

export function exportRegistrationsToCSV(registrations: Registration[], filename = 'colorido_2k26_registrations.csv'): void {
  if (!registrations || registrations.length === 0) {
    alert('No registrations available to export.');
    return;
  }

  const headers = [
    'Registration ID',
    'Event ID',
    'Participant Name',
    'Email',
    'Phone',
    'College',
    'Participation Type',
    'Team Name',
    'Team Size',
    'Emergency Contact Name',
    'Emergency Contact Phone',
    'Status',
    'Registration Date'
  ];

  const escapeCSV = (field: any) => {
    if (field === null || field === undefined) return '""';
    const str = String(field).replace(/"/g, '""');
    return `"${str}"`;
  };

  const rows = registrations.map(r => [
    escapeCSV(r.registration_id),
    escapeCSV(r.event_id),
    escapeCSV(r.participant_name),
    escapeCSV(r.participant_email),
    escapeCSV(r.participant_phone),
    escapeCSV(r.participant_college),
    escapeCSV(r.participation_type),
    escapeCSV(r.team_name || 'N/A'),
    escapeCSV(r.team_size || 1),
    escapeCSV(r.emergency_contact_name || 'N/A'),
    escapeCSV(r.emergency_contact_phone || 'N/A'),
    escapeCSV(r.status),
    escapeCSV(new Date(r.created_at).toLocaleDateString())
  ]);

  const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
