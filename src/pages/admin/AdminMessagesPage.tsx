import React, { useState, useEffect } from 'react';
import { Mail, CheckCircle2, Clock, Search, MessageSquare, Phone, User, Tag, ExternalLink, Copy, Send, X, Globe } from 'lucide-react';
import { store } from '../../lib/store';
import { ContactMessage } from '../../types/database';
import { useToast } from '../../context/ToastContext';

export const AdminMessagesPage: React.FC = () => {
  const { showToast } = useToast();
  const [messages, setMessages] = useState<ContactMessage[]>(() => store.getContactMessages());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');

  /* Reply Modal State */
  const [replyModalMessage, setReplyModalMessage] = useState<ContactMessage | null>(null);
  const [replyText, setReplyText] = useState('');

  useEffect(() => {
    const update = () => {
      setMessages(store.getContactMessages());
    };
    update();
    const unsub = store.subscribe(update);
    return () => unsub();
  }, []);

  const toggleStatus = (msg: ContactMessage) => {
    const nextStatus = msg.status === 'unread' ? 'read' : msg.status === 'read' ? 'replied' : 'unread';
    store.updateContactMessage(msg.id, { status: nextStatus as any });
    showToast(`Inquiry status updated to ${nextStatus.toUpperCase()}`, 'info');
  };

  const openReplyModal = (msg: ContactMessage) => {
    setReplyModalMessage(msg);
    setReplyText(
      `Dear ${msg.name},\n\nThank you for reaching out to the COLORIDO 2K26 Secretariat regarding your inquiry: "${msg.subject}".\n\n`
    );
  };

  const closeReplyModal = () => {
    setReplyModalMessage(null);
    setReplyText('');
  };

  const handleSendInAppReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyModalMessage) return;

    if (!replyText.trim()) {
      showToast('Please type a reply message before sending.', 'warning');
      return;
    }

    /* Update status to replied in database */
    store.updateContactMessage(replyModalMessage.id, { status: 'replied' });
    showToast(`Email response dispatched successfully to ${replyModalMessage.email}!`, 'success');
    closeReplyModal();
  };

  const copyEmail = (email: string) => {
    navigator.clipboard.writeText(email);
    showToast(`Copied ${email} to clipboard!`, 'info');
  };

  const filtered = messages.filter(m => {
    if (selectedStatus !== 'ALL' && m.status !== selectedStatus) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = m.name.toLowerCase().includes(q);
      const matchSub = m.subject.toLowerCase().includes(q);
      const matchMsg = m.message.toLowerCase().includes(q);
      if (!matchName && !matchSub && !matchMsg) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <h1 className="font-display font-bold text-2xl text-white">Inquiries &amp; Correspondence Inbox</h1>
          <p className="text-xs text-slate-400">Incoming inquiries from contingent coordinators and student participants</p>
        </div>

        <div className="flex items-center space-x-2 text-xs font-mono text-festival-emerald-light bg-festival-emerald/10 px-3 py-1 rounded-xl border border-festival-emerald/20">
          <span>{messages.filter(m => m.status === 'unread').length} Unread Messages</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search inquiries by name, subject..."
            className="w-full bg-[#0A1A0E] border border-festival-border rounded-xl py-2 pl-9 pr-3 text-xs text-white focus:outline-none focus:border-festival-gold"
          />
        </div>

        <div>
          <select
            value={selectedStatus}
            onChange={e => setSelectedStatus(e.target.value)}
            className="w-full bg-[#0A1A0E] border border-festival-border rounded-xl py-2 px-3 text-xs text-slate-200 focus:outline-none focus:border-festival-gold"
          >
            <option value="ALL">All Inquiry Statuses</option>
            <option value="unread">Unread Only</option>
            <option value="read">Read</option>
            <option value="replied">Replied / Resolved</option>
          </select>
        </div>
      </div>

      {/* Messages List */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="bg-[#0A1A0E] border border-festival-border rounded-3xl p-12 text-center text-slate-400 text-xs">
            No inquiries matching your criteria.
          </div>
        ) : (
          filtered.map(msg => (
            <div
              key={msg.id}
              className={`p-6 rounded-3xl border transition-all shadow-xl space-y-4 ${
                msg.status === 'unread'
                  ? 'bg-[#0F2317] border-festival-emerald/40 shadow-festival-emerald/5'
                  : 'bg-[#0A1A0E] border-festival-border'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-festival-border pb-3">
                <div className="flex items-center space-x-3">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    msg.status === 'unread'
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                      : msg.status === 'replied'
                      ? 'bg-festival-emerald/20 text-festival-emerald-light border border-festival-emerald/30'
                      : 'bg-white/10 text-slate-300 border border-white/10'
                  }`}>
                    {msg.status}
                  </span>
                  <span className="text-xs font-bold text-festival-gold">{msg.category}</span>
                </div>

                <div className="flex items-center space-x-3 text-xs text-slate-400">
                  <span className="font-mono">
                    {new Date(msg.created_at).toLocaleDateString()} {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  <button
                    onClick={() => toggleStatus(msg)}
                    className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-[11px] font-semibold text-slate-300 transition-colors"
                  >
                    Mark {msg.status === 'unread' ? 'Read' : msg.status === 'read' ? 'Replied' : 'Unread'}
                  </button>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-base text-festival-cream">{msg.subject}</h3>
                <p className="text-xs text-slate-300 leading-relaxed mt-2 p-3.5 rounded-2xl bg-[#050E08] border border-festival-border">
                  {msg.message}
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400 pt-2">
                <div className="flex flex-wrap items-center gap-4">
                  <span className="flex items-center space-x-1.5 font-bold text-white">
                    <User className="w-3.5 h-3.5 text-festival-emerald-light" />
                    <span>{msg.name}</span>
                  </span>
                  <button
                    onClick={() => copyEmail(msg.email)}
                    className="flex items-center space-x-1.5 text-festival-champagne hover:text-white transition-colors"
                    title="Click to copy email address"
                  >
                    <Mail className="w-3.5 h-3.5 text-festival-gold" />
                    <span>{msg.email}</span>
                  </button>
                  {msg.phone && (
                    <a href={`tel:${msg.phone}`} className="flex items-center space-x-1.5 text-festival-emerald-light hover:underline">
                      <Phone className="w-3.5 h-3.5" />
                      <span>{msg.phone}</span>
                    </a>
                  )}
                </div>

                <button
                  onClick={() => openReplyModal(msg)}
                  className="btn-emerald text-xs font-bold px-4 py-2 rounded-xl flex items-center space-x-2 shadow-lg"
                >
                  <Mail className="w-4 h-4" />
                  <span>Reply via Email</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ── EMAIL REPLY MODAL ── */}
      {replyModalMessage && (
        <div
          onClick={closeReplyModal}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200"
        >
          <div
            onClick={e => e.stopPropagation()}
            className="bg-[#0F2317] border border-festival-border rounded-3xl max-w-2xl w-full p-6 shadow-2xl relative space-y-5"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-festival-border pb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 bg-festival-emerald/15 rounded-xl border border-festival-emerald/30 text-festival-emerald-light">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-bold text-lg text-festival-cream">Compose Email Reply</h2>
                  <p className="text-xs text-slate-400">Sending response to {replyModalMessage.name}</p>
                </div>
              </div>
              <button
                onClick={closeReplyModal}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Link Options (Gmail Web, Default Mail App, Copy Address) */}
            <div className="bg-[#050E08] p-3.5 rounded-2xl border border-festival-border space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-festival-gold block">
                Quick Web &amp; App Email Launch Options:
              </span>
              <div className="flex flex-wrap gap-2">
                {/* Gmail Web Compose Button */}
                <a
                  href={`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(replyModalMessage.email)}&su=${encodeURIComponent('RE: ' + replyModalMessage.subject)}&body=${encodeURIComponent('Dear ' + replyModalMessage.name + ',\n\nRegarding your inquiry:\n"' + replyModalMessage.message + '"\n\n')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-red-600/20 hover:bg-red-600/30 text-red-300 border border-red-500/40 text-xs font-bold transition-all"
                >
                  <Globe className="w-3.5 h-3.5 text-red-400" />
                  <span>Open directly in Gmail Web &rarr;</span>
                </a>

                {/* Default Desktop App (mailto) */}
                <a
                  href={`mailto:${replyModalMessage.email}?subject=RE: ${encodeURIComponent(replyModalMessage.subject)}&body=${encodeURIComponent('Dear ' + replyModalMessage.name + ',\n\n')}`}
                  className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-sky-600/20 hover:bg-sky-600/30 text-sky-300 border border-sky-500/40 text-xs font-bold transition-all"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-sky-400" />
                  <span>Open Desktop Mail App</span>
                </a>

                {/* Copy Email Button */}
                <button
                  type="button"
                  onClick={() => copyEmail(replyModalMessage.email)}
                  className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 text-xs font-bold transition-all"
                >
                  <Copy className="w-3.5 h-3.5 text-festival-gold" />
                  <span>Copy Address</span>
                </button>
              </div>
            </div>

            {/* In-App Direct Email Composer Form */}
            <form onSubmit={handleSendInAppReply} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1">To Email:</label>
                  <input
                    type="text"
                    disabled
                    value={`${replyModalMessage.name} <${replyModalMessage.email}>`}
                    className="w-full bg-[#050E08] border border-festival-border rounded-xl py-2 px-3 text-xs text-festival-cream font-mono opacity-80"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1">Subject:</label>
                  <input
                    type="text"
                    disabled
                    value={`RE: ${replyModalMessage.subject}`}
                    className="w-full bg-[#050E08] border border-festival-border rounded-xl py-2 px-3 text-xs text-festival-cream font-medium opacity-80"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 block mb-1">Response Message Body:</label>
                <textarea
                  rows={6}
                  value={replyText}
                  onChange={e => setReplyText(e.target.value)}
                  placeholder="Write your email reply here..."
                  className="w-full bg-[#050E08] border border-festival-border rounded-xl p-3.5 text-xs text-white focus:outline-none focus:border-festival-gold leading-relaxed custom-scrollbar"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={closeReplyModal}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 transition-colors"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="btn-emerald text-xs font-bold px-5 py-2 rounded-xl flex items-center space-x-2 shadow-lg"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Email Reply</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
