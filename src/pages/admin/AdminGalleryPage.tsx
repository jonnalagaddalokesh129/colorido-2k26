import React, { useState, useEffect } from 'react';
import { Image, Plus, Trash2, X, Sparkles, Tag, ExternalLink } from 'lucide-react';
import { store } from '../../lib/store';
import { GalleryItem } from '../../types/database';
import { useToast } from '../../context/ToastContext';

export const AdminGalleryPage: React.FC = () => {
  const { showToast } = useToast();
  const [gallery, setGallery] = useState<GalleryItem[]>(() => store.getGallery());
  const [modalOpen, setModalOpen] = useState(false);

  // Form
  const [title, setTitle] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [category, setCategory] = useState<'CULTURAL' | 'SPORTS' | 'PERFORMANCES' | 'CAMPUS' | 'PARTICIPANTS' | 'HIGHLIGHTS'>('CULTURAL');
  const [caption, setCaption] = useState('');
  const [tagsStr, setTagsStr] = useState('Festival, Stage, Spotlight');
  const [featured, setFeatured] = useState(false);

  useEffect(() => {
    const update = () => {
      setGallery(store.getGallery());
    };
    update();
    const unsub = store.subscribe(update);
    return () => unsub();
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !imageUrl.trim()) {
      showToast('Title and Image URL are required', 'error');
      return;
    }

    const tags = tagsStr.split(',').map(t => t.trim()).filter(Boolean);
    const newItem: GalleryItem = {
      id: `gal_${Date.now()}`,
      title,
      image_url: imageUrl,
      category,
      caption,
      tags,
      featured
    };

    store.addGalleryItem(newItem);
    showToast('Photo uploaded and published to gallery!', 'success');
    setModalOpen(false);
  };

  const handleDelete = (id: string, t: string) => {
    if (confirm(`Delete photo "${t}"?`)) {
      store.deleteGalleryItem(id);
      showToast('Photo removed from gallery.', 'info');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <h1 className="font-display font-bold text-2xl text-white">Gallery Media Management</h1>
          <p className="text-xs text-slate-400">Curate festival photos, assign categories, and tag moments</p>
        </div>

        <button
          onClick={() => {
            setTitle('');
            setImageUrl('https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80');
            setCaption('');
            setModalOpen(true);
          }}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-fuchsia-600 to-indigo-600 hover:from-fuchsia-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center space-x-2 shadow-lg transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Upload Media Item</span>
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {gallery.map(item => (
          <div
            key={item.id}
            className="bg-[#12172F] border border-white/10 rounded-2xl overflow-hidden shadow-xl flex flex-col justify-between"
          >
            <div>
              <div className="h-44 w-full relative bg-slate-900">
                <img
                  src={item.image_url}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-3 left-3 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-black/60 text-white border border-white/10 backdrop-blur-md">
                  {item.category}
                </span>
                <button
                  onClick={() => handleDelete(item.id, item.title)}
                  className="absolute top-3 right-3 p-1.5 rounded-full bg-rose-600/80 hover:bg-rose-600 text-white transition-colors"
                  title="Delete Image"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="p-4 space-y-2">
                <h4 className="font-bold text-sm text-white">{item.title}</h4>
                <p className="text-xs text-slate-400 line-clamp-2">{item.caption}</p>
              </div>
            </div>

            <div className="p-4 pt-0 border-t border-white/5 flex flex-wrap gap-1">
              {item.tags.map(t => (
                <span key={t} className="text-[10px] text-fuchsia-300 font-mono">
                  #{t}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Upload Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
          <div className="bg-[#12172F] border border-white/10 rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl relative">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white p-2 rounded-lg hover:bg-white/5"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="font-bold text-lg text-white">Upload New Festival Media</h2>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Image Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="e.g. Electric Guitar Solo on Main Stage"
                  className="w-full bg-[#1A2142] border border-white/10 rounded-xl p-2.5 text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Image URL (or Supabase Storage URI) *</label>
                <input
                  type="text"
                  required
                  value={imageUrl}
                  onChange={e => setImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
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
                  <option value="CULTURAL">CULTURAL</option>
                  <option value="SPORTS">SPORTS</option>
                  <option value="PERFORMANCES">PERFORMANCES</option>
                  <option value="CAMPUS">CAMPUS</option>
                  <option value="PARTICIPANTS">PARTICIPANTS</option>
                  <option value="HIGHLIGHTS">HIGHLIGHTS</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Tags (Comma-separated)</label>
                <input
                  type="text"
                  value={tagsStr}
                  onChange={e => setTagsStr(e.target.value)}
                  placeholder="Bands, Amphitheatre, Lights"
                  className="w-full bg-[#1A2142] border border-white/10 rounded-xl p-2.5 text-white focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Caption / Description</label>
                <textarea
                  rows={2}
                  value={caption}
                  onChange={e => setCaption(e.target.value)}
                  placeholder="Optional brief description of the moment..."
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
                  className="px-6 py-2 rounded-xl bg-gradient-to-r from-fuchsia-600 to-indigo-600 text-white font-bold shadow-lg"
                >
                  Save Photo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
