import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Plus, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  X, 
  MapPin, 
  Users, 
  Clock, 
  Search,
  Eye,
  EyeOff
} from 'lucide-react';
import { store } from '../../lib/store';
import { EventItem, Venue } from '../../types/database';
import { useToast } from '../../context/ToastContext';

export const AdminEventsPage: React.FC = () => {
  const { showToast } = useToast();
  const [events, setEvents] = useState<EventItem[]>(() => store.getEvents());
  const [venues, setVenues] = useState<Venue[]>(() => store.getVenues());
  const [searchQuery, setSearchQuery] = useState('');

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingEventId, setEditingEventId] = useState<string | null>(null);

  // Form Fields
  const [eventName, setEventName] = useState('');
  const [category, setCategory] = useState<'cultural' | 'sports'>('cultural');
  const [subCategory, setSubCategory] = useState('solo');
  const [description, setDescription] = useState('');
  const [rulesText, setRulesText] = useState('');
  const [eligibility, setEligibility] = useState('Open to all enrolled university students');
  const [participationType, setParticipationType] = useState<'individual' | 'team'>('individual');
  const [teamSizeMin, setTeamSizeMin] = useState(1);
  const [teamSizeMax, setTeamSizeMax] = useState(1);
  const [fee, setFee] = useState(0);
  const [venueId, setVenueId] = useState(venues[0]?.id || 'v_auditorium');
  const [eventDate, setEventDate] = useState('2026-10-15');
  const [startTime, setStartTime] = useState('10:00');
  const [endTime, setEndTime] = useState('13:00');
  const [deadline, setDeadline] = useState('2026-10-13T23:59:59Z');
  const [maxParticipants, setMaxParticipants] = useState(30);
  const [coordinatorName, setCoordinatorName] = useState('');
  const [coordinatorContact, setCoordinatorContact] = useState('');
  const [coordinatorEmail, setCoordinatorEmail] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    const update = () => {
      setEvents(store.getEvents());
      setVenues(store.getVenues());
    };
    update();
    const unsub = store.subscribe(update);
    return () => unsub();
  }, []);

  const openCreateModal = () => {
    setEditingEventId(null);
    setEventName('');
    setCategory('cultural');
    setSubCategory('solo');
    setDescription('');
    setRulesText('Rule 1: Adhere to standard event duration\nRule 2: Valid university ID card mandatory\nRule 3: Respect judge decisions');
    setEligibility('Open to all enrolled college students with valid ID');
    setParticipationType('individual');
    setTeamSizeMin(1);
    setTeamSizeMax(1);
    setFee(200);
    setVenueId(venues[0]?.id || 'v_auditorium');
    setEventDate('2026-10-15');
    setStartTime('10:00');
    setEndTime('13:00');
    setDeadline('2026-10-13T23:59:59Z');
    setMaxParticipants(30);
    setCoordinatorName('Faculty Coordinator');
    setCoordinatorContact('+91 98450 00000');
    setCoordinatorEmail('coordinator@colorido2k26.edu');
    setImageUrl('https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1000&q=80');
    setModalOpen(true);
  };

  const openEditModal = (evt: EventItem) => {
    setEditingEventId(evt.event_id);
    setEventName(evt.event_name);
    setCategory(evt.category);
    setSubCategory(evt.sub_category);
    setDescription(evt.description);
    setRulesText(evt.rules.join('\n'));
    setEligibility(evt.eligibility);
    setParticipationType(evt.participation_type);
    setTeamSizeMin(evt.team_size_min);
    setTeamSizeMax(evt.team_size_max);
    setFee(evt.registration_fee);
    setVenueId(evt.venue_id);
    setEventDate(evt.event_date);
    setStartTime(evt.start_time.slice(0, 5));
    setEndTime(evt.end_time.slice(0, 5));
    setDeadline(evt.registration_deadline);
    setMaxParticipants(evt.maximum_participants);
    setCoordinatorName(evt.coordinator_name);
    setCoordinatorContact(evt.coordinator_contact);
    setCoordinatorEmail(evt.coordinator_email || '');
    setImageUrl(evt.event_image);
    setModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const selVenue = venues.find(v => v.id === venueId);
    const parsedRules = rulesText.split('\n').filter(r => r.trim().length > 0);

    if (editingEventId) {
      store.updateEvent(editingEventId, {
        event_name: eventName,
        category,
        sub_category: subCategory,
        description,
        rules: parsedRules,
        eligibility,
        participation_type: participationType,
        team_size_min: Number(teamSizeMin),
        team_size_max: Number(teamSizeMax),
        registration_fee: Number(fee),
        venue_id: venueId,
        venue: selVenue?.name || 'Campus Venue',
        event_date: eventDate,
        start_time: startTime,
        end_time: endTime,
        registration_deadline: deadline,
        maximum_participants: Number(maxParticipants),
        coordinator_name: coordinatorName,
        coordinator_contact: coordinatorContact,
        coordinator_email: coordinatorEmail,
        event_image: imageUrl
      });
      showToast(`Event "${eventName}" updated successfully.`, 'success');
    } else {
      const newId = `evt_custom_${Date.now()}`;
      const newEvt: EventItem = {
        event_id: newId,
        event_name: eventName,
        category,
        sub_category: subCategory,
        description,
        rules: parsedRules,
        eligibility,
        participation_type: participationType,
        team_size_min: Number(teamSizeMin),
        team_size_max: Number(teamSizeMax),
        registration_fee: Number(fee),
        venue_id: venueId,
        venue: selVenue?.name || 'Campus Venue',
        event_date: eventDate,
        start_time: startTime,
        end_time: endTime,
        registration_deadline: deadline,
        maximum_participants: Number(maxParticipants),
        current_participants: 0,
        status: 'open',
        event_image: imageUrl,
        coordinator_name: coordinatorName,
        coordinator_contact: coordinatorContact,
        coordinator_email: coordinatorEmail,
        created_at: new Date().toISOString()
      };
      store.addEvent(newEvt);
      showToast(`New Event "${eventName}" published to festival catalog!`, 'success');
    }
    setModalOpen(false);
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete event "${name}"?`)) {
      store.deleteEvent(id);
      showToast(`Event "${name}" deleted.`, 'info');
    }
  };

  const toggleStatus = (evt: EventItem) => {
    const nextStatus = evt.status === 'open' ? 'closed' : 'open';
    store.updateEvent(evt.event_id, { status: nextStatus });
    showToast(`Event "${evt.event_name}" registration marked as ${nextStatus.toUpperCase()}`, 'info');
  };

  const filteredEvents = events.filter(e => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return e.event_name.toLowerCase().includes(q) || e.venue.toLowerCase().includes(q) || e.category.includes(q);
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <h1 className="font-display font-bold text-2xl text-white">Event Management</h1>
          <p className="text-xs text-slate-400">Manage competition rules, coordinators, venues, and registration status</p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs flex items-center space-x-2 shadow-lg transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Event</span>
        </button>
      </div>

      {/* Search Input */}
      <div className="relative max-w-sm">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Filter events..."
          className="w-full bg-[#12172F] border border-white/10 rounded-xl py-2 pl-9 pr-3 text-xs text-white focus:outline-none"
        />
      </div>

      {/* Events Table */}
      <div className="bg-[#12172F] border border-white/10 rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#1A2142] text-slate-400 uppercase font-mono text-[10px] border-b border-white/10">
              <tr>
                <th className="py-4 px-5">Event</th>
                <th className="py-4 px-4">Category</th>
                <th className="py-4 px-4">Venue & Time</th>
                <th className="py-4 px-4">Coordinator</th>
                <th className="py-4 px-4">Filled / Max</th>
                <th className="py-4 px-4 text-center">Status</th>
                <th className="py-4 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredEvents.map(evt => (
                <tr key={evt.event_id} className="hover:bg-white/5 transition-colors">
                  <td className="py-3 px-5">
                    <div className="flex items-center space-x-3">
                      <img
                        src={evt.event_image}
                        alt={evt.event_name}
                        className="w-10 h-10 rounded-lg object-cover"
                      />
                      <div>
                        <p className="font-bold text-white text-xs">{evt.event_name}</p>
                        <span className="text-[10px] text-slate-400 font-mono">{evt.event_id}</span>
                      </div>
                    </div>
                  </td>

                  <td className="py-3 px-4">
                    <span className="capitalize font-bold text-fuchsia-400">{evt.category}</span>
                    <p className="text-[10px] text-slate-400 uppercase">{evt.sub_category}</p>
                  </td>

                  <td className="py-3 px-4">
                    <p className="text-white truncate max-w-[160px]">{evt.venue}</p>
                    <p className="text-[10px] text-slate-400">{evt.event_date} ({evt.start_time.slice(0, 5)})</p>
                  </td>

                  <td className="py-3 px-4">
                    <p className="text-white font-medium">{evt.coordinator_name}</p>
                    <p className="text-[10px] text-slate-400">{evt.coordinator_contact}</p>
                  </td>

                  <td className="py-3 px-4 font-mono">
                    <span className="text-emerald-400 font-bold">{evt.current_participants}</span> / {evt.maximum_participants}
                  </td>

                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => toggleStatus(evt)}
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase transition-all ${
                        evt.status === 'open'
                          ? 'bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30'
                          : 'bg-rose-500/20 text-rose-300 hover:bg-rose-500/30'
                      }`}
                    >
                      {evt.status}
                    </button>
                  </td>

                  <td className="py-3 px-5 text-right space-x-2">
                    <button
                      onClick={() => openEditModal(evt)}
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white"
                      title="Edit Event"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(evt.event_id, evt.event_name)}
                      className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400"
                      title="Delete Event"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE / EDIT MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 overflow-y-auto">
          <div className="bg-[#12172F] border border-white/10 rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white p-2 rounded-lg hover:bg-white/5"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="font-bold text-lg text-white">
              {editingEventId ? 'Edit Event Details' : 'Create New Competition Event'}
            </h2>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Event Name *</label>
                  <input
                    type="text"
                    required
                    value={eventName}
                    onChange={e => setEventName(e.target.value)}
                    className="w-full bg-[#1A2142] border border-white/10 rounded-xl p-2.5 text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Category *</label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value as any)}
                    className="w-full bg-[#1A2142] border border-white/10 rounded-xl p-2.5 text-white focus:outline-none"
                  >
                    <option value="cultural">Cultural</option>
                    <option value="sports">Sports</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Description *</label>
                <textarea
                  rows={3}
                  required
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="w-full bg-[#1A2142] border border-white/10 rounded-xl p-2.5 text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Tournament Rules (One per line) *</label>
                <textarea
                  rows={3}
                  required
                  value={rulesText}
                  onChange={e => setRulesText(e.target.value)}
                  className="w-full bg-[#1A2142] border border-white/10 rounded-xl p-2.5 text-white focus:outline-none font-mono"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Venue *</label>
                  <select
                    value={venueId}
                    onChange={e => setVenueId(e.target.value)}
                    className="w-full bg-[#1A2142] border border-white/10 rounded-xl p-2.5 text-white focus:outline-none"
                  >
                    {venues.map(v => (
                      <option key={v.id} value={v.id}>
                        {v.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Date *</label>
                  <input
                    type="date"
                    required
                    value={eventDate}
                    onChange={e => setEventDate(e.target.value)}
                    className="w-full bg-[#1A2142] border border-white/10 rounded-xl p-2.5 text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Registration Fee (₹)</label>
                  <input
                    type="number"
                    value={fee}
                    onChange={e => setFee(Number(e.target.value))}
                    className="w-full bg-[#1A2142] border border-white/10 rounded-xl p-2.5 text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Coordinator Name *</label>
                  <input
                    type="text"
                    required
                    value={coordinatorName}
                    onChange={e => setCoordinatorName(e.target.value)}
                    className="w-full bg-[#1A2142] border border-white/10 rounded-xl p-2.5 text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Coordinator Contact *</label>
                  <input
                    type="text"
                    required
                    value={coordinatorContact}
                    onChange={e => setCoordinatorContact(e.target.value)}
                    className="w-full bg-[#1A2142] border border-white/10 rounded-xl p-2.5 text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Max Capacity</label>
                  <input
                    type="number"
                    value={maxParticipants}
                    onChange={e => setMaxParticipants(Number(e.target.value))}
                    className="w-full bg-[#1A2142] border border-white/10 rounded-xl p-2.5 text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Image URL</label>
                <input
                  type="text"
                  value={imageUrl}
                  onChange={e => setImageUrl(e.target.value)}
                  className="w-full bg-[#1A2142] border border-white/10 rounded-xl p-2.5 text-white focus:outline-none"
                />
              </div>

              <div className="pt-4 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold shadow-lg"
                >
                  Save Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
