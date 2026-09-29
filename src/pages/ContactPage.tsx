import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, MessageSquare, Clock, ShieldCheck } from 'lucide-react';
import { store } from '../lib/store';
import { ContactMessage } from '../types/database';
import { useToast } from '../context/ToastContext';

export const ContactPage: React.FC = () => {
  const { showToast } = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState('General Inquiry');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !subject.trim() || !message.trim()) {
      showToast('Please fill in all required fields.', 'error');
      return;
    }

    const newMessage: ContactMessage = {
      id: `msg_${Date.now()}`,
      name,
      email,
      phone,
      subject,
      category,
      message,
      status: 'unread',
      created_at: new Date().toISOString()
    };

    store.addContactMessage(newMessage);
    setSubmitted(true);
    showToast('Your message has been received! Our Secretariat team will respond within 24 hours.', 'success');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#20B2AA]/15 border border-[#20B2AA]/30 text-[#006D8F] text-xs font-bold">
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Festival Secretariat Help Desk</span>
        </div>
        <h1 className="font-display font-extrabold text-3xl sm:text-5xl text-[#064E52] tracking-tight">
          Get In Touch With Us
        </h1>
        <p className="text-xs sm:text-sm text-[#006D8F] max-w-xl mx-auto">
          Need assistance with team contingent accommodation, event rules clarification, or registration credentials? Reach out to our 24/7 central desk.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Office Details & Helplines */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#12172F] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
            <h2 className="font-bold text-base text-white">Central Operations Office</h2>

            <div className="space-y-4 text-xs text-slate-300">
              <div className="flex items-start space-x-3 p-3.5 rounded-2xl bg-[#1A2142] border border-white/5">
                <MapPin className="w-5 h-5 text-fuchsia-400 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block font-semibold mb-0.5">Festival Headquarters</strong>
                  <span>COLORIDO 2K26 Secretariat, Student Affairs Building, Central Quadrangle, University Enclave.</span>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-3.5 rounded-2xl bg-[#1A2142] border border-white/5">
                <Mail className="w-5 h-5 text-sky-400 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block font-semibold mb-0.5">Direct Correspondence</strong>
                  <span>secretariat@colorido2k26.edu</span>
                  <p className="text-[11px] text-slate-400 mt-0.5">helpdesk@colorido2k26.edu</p>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-3.5 rounded-2xl bg-[#1A2142] border border-white/5">
                <Phone className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block font-semibold mb-0.5">Emergency Control Room & Helplines</strong>
                  <span>General Queries: +91 80 2345 6789</span>
                  <p className="text-[11px] text-emerald-400 mt-0.5">Emergency Mobile: +91 98860 00001 (24/7)</p>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-3.5 rounded-2xl bg-[#1A2142] border border-white/5">
                <Clock className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block font-semibold mb-0.5">Reporting Hours</strong>
                  <span>Desk Open: 07:30 AM to 10:30 PM (All 3 Festival Days)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Contact Form */}
        <div className="lg:col-span-7">
          <div className="bg-[#12172F] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
            <div className="border-b border-white/10 pb-4">
              <h2 className="font-bold text-base text-white">Send Us An Inquiry</h2>
              <p className="text-xs text-slate-400">All submissions are archived directly into the administrator dashboard inbox.</p>
            </div>

            {submitted ? (
              <div className="text-center py-12 space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/40">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-lg text-white">Message Dispatched Successfully</h3>
                <p className="text-xs text-slate-300 max-w-sm mx-auto">
                  Thank you for reaching out. A festival coordinator will reply to your registered email address shortly.
                </p>
                <button
                  onClick={() => {
                    setName('');
                    setEmail('');
                    setPhone('');
                    setSubject('');
                    setMessage('');
                    setSubmitted(false);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-colors"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="e.g. Prof. R. Sharma"
                      className="w-full bg-[#1A2142] border border-white/10 rounded-xl py-2.5 px-3.5 text-xs text-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="your.email@university.edu"
                      className="w-full bg-[#1A2142] border border-white/10 rounded-xl py-2.5 px-3.5 text-xs text-white focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      maxLength={10}
                      value={phone}
                      onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      placeholder="10-digit Mobile Number"
                      className="w-full bg-[#1A2142] border border-white/10 rounded-xl py-2.5 px-3.5 text-xs text-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                      Category
                    </label>
                    <select
                      value={category}
                      onChange={e => setCategory(e.target.value)}
                      className="w-full bg-[#1A2142] border border-white/10 rounded-xl py-2.5 px-3.5 text-xs text-white focus:outline-none cursor-pointer"
                    >
                      <option value="General Inquiry">General Inquiry</option>
                      <option value="Event Rules & Judging">Event Rules & Judging</option>
                      <option value="Accommodation & Transit">Accommodation & Transit</option>
                      <option value="Sponsorship & Media">Sponsorship & Media</option>
                      <option value="Emergency & Medical">Emergency & Medical</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                    Subject Line *
                  </label>
                  <input
                    type="text"
                    required
                    value={subject}
                    onChange={e => setSubject(e.target.value)}
                    placeholder="e.g. Query regarding Basketball contingent reporting time"
                    className="w-full bg-[#1A2142] border border-white/10 rounded-xl py-2.5 px-3.5 text-xs text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                    Your Message *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    placeholder="Provide details about your query or contingent request..."
                    className="w-full bg-[#1A2142] border border-white/10 rounded-xl p-3.5 text-xs text-white focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-fuchsia-600 to-indigo-600 hover:from-fuchsia-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg transition-all flex items-center justify-center space-x-2"
                >
                  <Send className="w-4 h-4" />
                  <span>TRANSMIT MESSAGE TO SECRETARIAT</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
