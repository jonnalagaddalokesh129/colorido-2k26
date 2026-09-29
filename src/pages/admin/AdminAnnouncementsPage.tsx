import React, { useState, useEffect } from 'react';
import { Bell, Plus, Edit3, Trash2, Eye, EyeOff, X, Sparkles } from 'lucide-react';
import { store } from '../../lib/store';
import { Announcement } from '../../types/database';
import { useToast } from '../../context/ToastContext';

export const AdminAnnouncementsPage: React.FC = () => {
  const { showToast } = useToast();
  const [announcements, setAnnouncements] = useState<Announcement[]>(() => store.getAnnouncements());

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<'IMPORTANT' | 'GENERAL' | 'CULTURAL' | 'SPORTS' | 'SCHEDULE' | 'RESULTS'>('IMPORTANT');
  const [priority, setPriority] = useState<'Normal' | 'Important' | 'Urgent'>('Important');
  const [pinned, setPinned] = useState(false);

  useEffect(() => {
    const update = () => {
      setAnnouncements(store.getAnnouncements());
    };
    update();
    const unsub = store.subscribe(update);
    return () => unsub();
  }, []);

  const openCreateModal = () => {
    setEditingId(null);
    setTitle('');
    setDescription('');
    setCategory('IMPORTANT');
    setPriority('Important');
    setPinned(false);
    setModalOpen(true);
  };

  const openEditModal = (item: Announcement) => {
    setEditingId(item.id);
    setTitle(item.title);
    setDescription(item.description);
    setCategory(item.category);
    setPriority(item.priority);
    setPinned(item.pinned);
    setModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      store.updateAnnouncement(editingId, {
        title,
        description,
        category,
        priority,
        pinned
      });
      showToast('Announcement updated.', 'success');
    } else {
      const newAnn: Announcement = {
        id: `ann_${Date.now()}`,
        title,
        description,
        category,
        priority,
        is_published: true,
        published_at: new Date().toISOString(),
        author: 'Festival Secretariat',
        pinned
      };
      store.addAnnouncement(newAnn);
      showToast('Announcement published and notification broadcast sent to participants!', 'success');
    }
    setModalOpen(false);
  };

  const handleDelete = (id: string, t: string) => {
    if (confirm(`Delete announcement "${t}"?`)) {
      store.deleteAnnouncement(id);
      showToast('Announcement deleted.', 'info');
    }
  };

  const togglePublish = (item: Announcement) => {
    store.updateAnnouncement(item.id, { is_published: !item.is_published });
    showToast(`Announcement status changed to ${!item.is_published ? 'PUBLISHED' : 'DRAFT'}`, 'info');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <h1 className="font-display font-bold text-2xl text-white">Announcements Manager</h1>
          <p className="text-xs text-slate-400">Broadcast official alerts, schedule updates, and tournament guidelines</p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold text-xs flex items-center space-x-2 shadow-lg transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>New Announcement</span>
        </button>
      </div>

      <div className="bg-[#12172F] border border-white/10 rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#1A2142] text-slate-400 uppercase font-mono text-[10px] border-b border-white/10">
              <tr>
                <th className="py-4 px-5">Title</th>
                <th className="py-4 px-4">Category</th>
                <th className="py-4 px-4 text-center">Priority</th>
                <th className="py-4 px-4">Date</th>
                <th className="py-4 px-4 text-center">Status</th>
                <th className="py-4 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {announcements.map(item => (
                <tr key={item.id} className="hover:bg-white/5 transition-colors">
                  <td className="py-3 px-5">
                    <p className="font-bold text-white text-xs">{item.title}</p>
                    <p className="text-[11px] text-slate-400 line-clamp-1">{item.description}</p>
                  </td>

                  <td className="py-3 px-4">
                    <span className="font-mono text-fuchsia-400 font-bold">{item.category}</span>
                  </td>

                  <td className="py-3 px-4 text-center">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      item.priority === 'Urgent'
                        ? 'bg-rose-500/20 text-rose-300'
                        : item.priority === 'Important'
                        ? 'bg-amber-500/20 text-amber-300'
                        : 'bg-white/10 text-slate-300'
                    }`}>
                      {item.priority}
                    </span>
                  </td>

                  <td className="py-3 px-4 text-slate-400 font-mono">
                    {new Date(item.published_at).toLocaleDateString()}
                  </td>

                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => togglePublish(item)}
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase transition-colors ${
                        item.is_published
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : 'bg-slate-700 text-slate-400'
                      }`}
                    >
                      {item.is_published ? 'Published' : 'Draft'}
                    </button>
                  </td>

                  <td className="py-3 px-5 text-right space-x-2">
                    <button
                      onClick={() => openEditModal(item)}
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white"
                      title="Edit"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id, item.title)}
                      className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400"
                      title="Delete"
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

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
          <div className="bg-[#12172F] border border-white/10 rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl relative">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white p-2 rounded-lg hover:bg-white/5"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="font-bold text-lg text-white">
              {editingId ? 'Edit Announcement' : 'Broadcast Announcement'}
            </h2>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="e.g. 🚨 Official Reporting Schedule Update"
                  className="w-full bg-[#1A2142] border border-white/10 rounded-xl p-2.5 text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Category</label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value as any)}
                  className="w-full bg-[#1A2142] border border-white/10 rounded-xl p-2.5 text-white focus:outline-none"
                >
                  <option value="IMPORTANT">IMPORTANT</option>
                  <option value="GENERAL">GENERAL</option>
                  <option value="CULTURAL">CULTURAL</option>
                  <option value="SPORTS">SPORTS</option>
                  <option value="SCHEDULE">SCHEDULE</option>
                  <option value="RESULTS">RESULTS</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Priority</label>
                <select
                  value={priority}
                  onChange={e => setPriority(e.target.value as any)}
                  className="w-full bg-[#1A2142] border border-white/10 rounded-xl p-2.5 text-white focus:outline-none"
                >
                  <option value="Normal">Normal</option>
                  <option value="Important">Important</option>
                  <option value="Urgent">Urgent</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Detailed Description *</label>
                <textarea
                  rows={4}
                  required
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Enter full notice or bulletin..."
                  className="w-full bg-[#1A2142] border border-white/10 rounded-xl p-2.5 text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={pinned}
                    onChange={e => setPinned(e.target.checked)}
                    className="w-4 h-4 rounded text-fuchsia-600"
                  />
                  <span className="text-slate-300 font-medium">Pin announcement to top banner & homepage</span>
                </label>
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
                  className="px-6 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 text-white font-bold shadow-lg"
                >
                  Publish Announcement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
