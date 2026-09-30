import React, { useState, useEffect } from 'react';
import { HeartHandshake, Plus, Edit3, Trash2, X, ExternalLink } from 'lucide-react';
import { store } from '../../lib/store';
import { Sponsor } from '../../types/database';
import { useToast } from '../../context/ToastContext';

export const AdminSponsorsPage: React.FC = () => {
  const { showToast } = useToast();
  const [sponsors, setSponsors] = useState<Sponsor[]>(() => store.getSponsors());
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form
  const [name, setName] = useState('');
  const [category, setCategory] = useState<'TITLE SPONSOR' | 'GOLD SPONSOR' | 'SILVER SPONSOR' | 'EVENT PARTNER' | 'MEDIA PARTNER'>('GOLD SPONSOR');
  const [logoUrl, setLogoUrl] = useState('');
  const [description, setDescription] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');

  useEffect(() => {
    const update = () => {
      setSponsors(store.getSponsors());
    };
    update();
    const unsub = store.subscribe(update);
    return () => unsub();
  }, []);

  const openCreateModal = () => {
    setEditingId(null);
    setName('');
    setCategory('GOLD SPONSOR');
    setLogoUrl('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=300&q=80');
    setDescription('');
    setWebsiteUrl('https://example.com');
    setModalOpen(true);
  };

  const openEditModal = (sp: Sponsor) => {
    setEditingId(sp.id);
    setName(sp.name);
    setCategory(sp.category);
    setLogoUrl(sp.logo_url);
    setDescription(sp.description);
    setWebsiteUrl(sp.website_url);
    setModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast('Sponsor name is required', 'error');
      return;
    }

    if (editingId) {
      store.updateSponsor(editingId, {
        name,
        category,
        logo_url: logoUrl,
        description,
        website_url: websiteUrl
      });
      showToast('Sponsor updated.', 'success');
    } else {
      const newSp: Sponsor = {
        id: `sp_${Date.now()}`,
        name,
        category,
        logo_url: logoUrl,
        description,
        website_url: websiteUrl,
        display_order: sponsors.length + 1
      };
      store.addSponsor(newSp);
      showToast('New sponsor added to directory!', 'success');
    }
    setModalOpen(false);
  };

  const handleDelete = (id: string, n: string) => {
    if (confirm(`Remove sponsor "${n}"?`)) {
      store.deleteSponsor(id);
      showToast('Sponsor deleted.', 'info');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <h1 className="font-display font-bold text-2xl text-white">Sponsor & Partner Management</h1>
          <p className="text-xs text-slate-400">Configure corporate partners, tier allocations, and logos</p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 text-white font-bold text-xs flex items-center space-x-2 shadow-lg transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Sponsor</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sponsors.map(sp => (
          <div
            key={sp.id}
            className="bg-[#12172F] border border-white/10 rounded-2xl p-5 shadow-xl space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-fuchsia-500/20 text-fuchsia-300">
                  {sp.category}
                </span>
                <div className="space-x-1">
                  <button
                    onClick={() => openEditModal(sp)}
                    className="p-1 rounded bg-white/5 hover:bg-white/10 text-slate-300"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(sp.id, sp.name)}
                    className="p-1 rounded bg-rose-500/10 hover:bg-rose-500/20 text-rose-400"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <img
                  src={sp.logo_url}
                  alt={sp.name}
                  onError={(e) => {
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&w=300&q=80';
                  }}
                  className="w-12 h-12 rounded-xl object-cover border border-white/10 bg-slate-800"
                />
                <div>
                  <h4 className="font-bold text-sm text-white">{sp.name}</h4>
                  <a
                    href={sp.website_url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[10px] text-sky-400 hover:underline flex items-center space-x-1"
                  >
                    <span>{sp.website_url}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">{sp.description}</p>
            </div>
          </div>
        ))}
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
              {editingId ? 'Edit Sponsor Profile' : 'Add Corporate Sponsor'}
            </h2>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Company / Sponsor Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full bg-[#1A2142] border border-white/10 rounded-xl p-2.5 text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Tier / Category</label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value as any)}
                  className="w-full bg-[#1A2142] border border-white/10 rounded-xl p-2.5 text-white focus:outline-none"
                >
                  <option value="TITLE SPONSOR">TITLE SPONSOR</option>
                  <option value="GOLD SPONSOR">GOLD SPONSOR</option>
                  <option value="SILVER SPONSOR">SILVER SPONSOR</option>
                  <option value="EVENT PARTNER">EVENT PARTNER</option>
                  <option value="MEDIA PARTNER">MEDIA PARTNER</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Logo URL *</label>
                <input
                  type="text"
                  required
                  value={logoUrl}
                  onChange={e => setLogoUrl(e.target.value)}
                  className="w-full bg-[#1A2142] border border-white/10 rounded-xl p-2.5 text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Website URL</label>
                <input
                  type="text"
                  value={websiteUrl}
                  onChange={e => setWebsiteUrl(e.target.value)}
                  className="w-full bg-[#1A2142] border border-white/10 rounded-xl p-2.5 text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
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
                  className="px-6 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-yellow-600 text-white font-bold shadow-lg"
                >
                  Save Sponsor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
