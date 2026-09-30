import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  ExternalLink, 
  ShieldCheck, 
  HeartHandshake, 
  X, 
  Mail, 
  Phone, 
  Building, 
  User, 
  Send, 
  CheckCircle2, 
  Award, 
  FileText,
  DollarSign,
  ChevronRight
} from 'lucide-react';
import { store } from '../lib/store';
import { Sponsor } from '../types/database';
import { useToast } from '../context/ToastContext';

export const SponsorsPage: React.FC = () => {
  const { showToast } = useToast();
  const [sponsors, setSponsors] = useState<Sponsor[]>(() => store.getSponsors());
  const [prospectusModalOpen, setProspectusModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'tiers' | 'form'>('tiers');

  // Form states
  const [companyName, setCompanyName] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [tier, setTier] = useState('Title Partner (₹5,00,000)');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const update = () => {
      setSponsors(store.getSponsors());
    };
    update();
    const unsub = store.subscribe(update);
    return () => unsub();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setProspectusModalOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const tiers: ('TITLE SPONSOR' | 'GOLD SPONSOR' | 'SILVER SPONSOR' | 'EVENT PARTNER' | 'MEDIA PARTNER')[] = [
    'TITLE SPONSOR',
    'GOLD SPONSOR',
    'SILVER SPONSOR',
    'EVENT PARTNER',
    'MEDIA PARTNER'
  ];

  const handleSubmitInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName.trim() || !email.trim() || !contactPerson.trim()) {
      showToast('Please provide your brand name, contact name, and official email.', 'error');
      return;
    }

    store.addContactMessage({
      id: `msg_${Date.now()}`,
      name: `${contactPerson} (${companyName})`,
      email,
      category: 'sponsorship',
      subject: `[SPONSORSHIP INQUIRY] ${tier} - ${companyName}`,
      message: `Brand: ${companyName}\nPhone: ${phone}\nSelected Tier: ${tier}\n\n${message}`,
      status: 'unread',
      created_at: new Date().toISOString()
    });

    setSubmitted(true);
    showToast('Sponsorship prospectus inquiry submitted! Our Secretariat will reach out within 24 hours.', 'success');
  };

  const prospectusTiers = [
    {
      title: 'Title Sponsor',
      amount: '₹5,00,000 / $6,000',
      badge: 'MAIN FESTIVAL BRANDING',
      color: 'border-amber-500/60 bg-gradient-to-br from-amber-950/40 via-[#12172F] to-[#12172F]',
      badgeColor: 'bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950',
      benefits: [
        'Exclusive festival title rights: "COLORIDO 2K26 powered by [Your Brand]"',
        'Prime logo positioning on all 1,000+ Digital Passes & Verification Certificates',
        '20x20 ft Premium Exhibition Booth at Central Festival Plaza',
        'Main Stage LED Backdrop logo integration during all evening cultural shows',
        '10 VIP All-Access Hospitality Passes & Executive Lounge Entry'
      ]
    },
    {
      title: 'Gold Sponsor',
      amount: '₹2,50,000 / $3,000',
      badge: 'ARENA & ARENA BANNER',
      color: 'border-yellow-500/40 bg-[#12172F]',
      badgeColor: 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/40',
      benefits: [
        'Naming rights for major arena (e.g. Sports Complex / Cultural Auditorium)',
        '10x10 ft Dedicated Exhibition Space in high-footfall zone',
        'Logo featured on official festival website, app header & social media handles',
        'Logo printed on all participant ID lanyards & event schedule booklets',
        '5 VIP Festival Passes'
      ]
    },
    {
      title: 'Silver / Category Sponsor',
      amount: '₹1,00,000 / $1,200',
      badge: 'DISCIPLINE BRANDING',
      color: 'border-indigo-500/40 bg-[#12172F]',
      badgeColor: 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40',
      benefits: [
        'Category sponsorship (e.g. Hackathon, Battle of Bands, Cricket Tournament)',
        'Co-branding on Category Winner Trophies & Merit Certificates',
        'Banner placement at specific venue gate turnstiles & arenas',
        'Mention in press releases & official secretariat announcements',
        '2 VIP Festival Passes'
      ]
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#20B2AA]/15 border border-[#20B2AA]/30 text-[#006D8F] text-xs font-bold">
          <HeartHandshake className="w-3.5 h-3.5" />
          <span>Festival Corporate &amp; Ecosystem Partners</span>
        </div>
        <h1 className="font-display font-extrabold text-3xl sm:text-5xl text-[#064E52] tracking-tight">
          Sponsors &amp; Strategic Partners
        </h1>
        <p className="text-xs sm:text-sm text-[#006D8F] max-w-xl mx-auto">
          We gratefully acknowledge our visionary industry patrons powering youth innovation, athletic championships, and creative arts across COLORIDO 2K26.
        </p>
      </div>

      {/* Tiered Sponsor Sections */}
      <div className="space-y-12">
        {tiers.map(tier => {
          const tierSponsors = sponsors.filter(s => s.category === tier);
          if (tierSponsors.length === 0) return null;

          const isTitle = tier === 'TITLE SPONSOR';

          return (
            <div key={tier} className="space-y-6">
              <div className="flex items-center space-x-3 border-b border-white/10 pb-3">
                <span className={`text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full ${
                  isTitle
                    ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-black shadow-lg shadow-amber-500/20'
                    : tier.includes('GOLD')
                    ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/40'
                    : 'bg-white/10 text-slate-300'
                }`}>
                  {tier}
                </span>
                <div className="h-px bg-white/10 flex-1" />
              </div>

              <div className={`grid gap-6 ${isTitle ? 'grid-cols-1 max-w-2xl mx-auto' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'}`}>
                {tierSponsors.map(sponsor => (
                  <div
                    key={sponsor.id}
                    className={`bg-[#12172F] border rounded-3xl p-6 shadow-xl transition-all hover:scale-[1.02] flex flex-col justify-between space-y-4 ${
                      isTitle ? 'border-amber-500/50 shadow-amber-500/10' : 'border-white/10 hover:border-fuchsia-500/40'
                    }`}
                  >
                    <div className="space-y-4">
                      <div className="flex items-center space-x-4">
                        <img
                          src={sponsor.logo_url}
                          alt={sponsor.name}
                          onError={(e) => {
                            e.currentTarget.src = 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&w=300&q=80';
                          }}
                          className="w-16 h-16 rounded-2xl object-cover border border-white/10 shadow-md bg-slate-800"
                        />
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-fuchsia-400">
                            {sponsor.category}
                          </span>
                          <h3 className="font-bold text-base sm:text-lg text-white">{sponsor.name}</h3>
                        </div>
                      </div>

                      <p className="text-xs text-slate-300 leading-relaxed">
                        {sponsor.description}
                      </p>
                    </div>

                    {sponsor.website_url && (
                      <div className="pt-3 border-t border-white/5">
                        <a
                          href={sponsor.website_url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center space-x-1.5 text-xs font-semibold text-sky-400 hover:text-sky-300 transition-colors"
                        >
                          <span>Visit Partner Website</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Become a Sponsor CTA */}
      <div className="bg-[#12172F] border border-[#20B2AA]/30 rounded-3xl p-8 sm:p-12 text-center max-w-3xl mx-auto space-y-4 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#20B2AA]/10 rounded-full blur-2xl pointer-events-none" />
        <Sparkles className="w-8 h-8 text-[#20B2AA] mx-auto" />
        <h3 className="font-display font-bold text-xl sm:text-2xl text-[#064E52]">Interested in Partnering with COLORIDO 2K26?</h3>
        <p className="text-xs text-[#006D8F] max-w-md mx-auto leading-relaxed">
          Connect your brand with 5,000+ collegiate leaders and nationwide youth talent. View our official sponsorship prospectus and partnership tiers.
        </p>
        <div className="pt-2">
          <button
            onClick={() => {
              setSubmitted(false);
              setActiveTab('tiers');
              setProspectusModalOpen(true);
            }}
            className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-fuchsia-600 via-indigo-600 to-amber-500 hover:from-fuchsia-500 hover:to-amber-400 text-white font-extrabold text-xs sm:text-sm shadow-xl hover:scale-105 transition-all flex items-center space-x-2 mx-auto cursor-pointer"
          >
            <FileText className="w-4 h-4" />
            <span>Inquire for Sponsorship Prospectus</span>
          </button>
        </div>
      </div>

      {/* ── SPONSORSHIP PROSPECTUS & INQUIRY MODAL ── */}
      {prospectusModalOpen && (
        <div
          onClick={() => setProspectusModalOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 overflow-y-auto animate-in fade-in duration-200"
        >
          <div
            onClick={e => e.stopPropagation()}
            className="max-w-4xl w-full bg-[#12172F] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl relative space-y-6 my-auto max-h-[90vh] overflow-y-auto custom-scrollbar"
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-white/10 pb-4 pr-8">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <Award className="w-5 h-5 text-[#20B2AA]" />
                  <h2 className="font-display font-bold text-xl text-[#064E52]">Corporate Sponsorship Prospectus</h2>
                </div>
                <p className="text-xs text-[#006D8F]">
                  COLORIDO 2K26 Secretariat • Partner Desk Telemetry &amp; Package Details
                </p>
              </div>

              <button
                onClick={() => setProspectusModalOpen(false)}
                className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-white/10 transition-colors"
                title="Close (Esc)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Tabs */}
            <div className="flex space-x-4 border-b border-white/10 pb-2">
              <button
                onClick={() => setActiveTab('tiers')}
                className={`pb-2 px-3 text-xs font-bold border-b-2 transition-all ${
                  activeTab === 'tiers'
                    ? 'border-amber-400 text-amber-400'
                    : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                1. Partnership Tiers & Benefits
              </button>
              <button
                onClick={() => setActiveTab('form')}
                className={`pb-2 px-3 text-xs font-bold border-b-2 transition-all ${
                  activeTab === 'form'
                    ? 'border-fuchsia-400 text-fuchsia-400'
                    : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                2. Submit Official Inquiry
              </button>
            </div>

            {/* TAB 1: TIERS & BENEFITS */}
            {activeTab === 'tiers' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {prospectusTiers.map((p, idx) => (
                    <div
                      key={idx}
                      className={`p-5 rounded-2xl border ${p.color} space-y-4 flex flex-col justify-between shadow-lg`}
                    >
                      <div className="space-y-3">
                        <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full inline-block ${p.badgeColor}`}>
                          {p.badge}
                        </span>
                        <div>
                          <h3 className="font-bold text-base text-white">{p.title}</h3>
                          <p className="font-mono text-xs font-bold text-amber-400">{p.amount}</p>
                        </div>
                        <ul className="space-y-2 pt-2 border-t border-white/10 text-xs text-slate-300">
                          {p.benefits.map((b, bIdx) => (
                            <li key={bIdx} className="flex items-start space-x-2">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                              <span>{b}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <button
                        onClick={() => {
                          setTier(`${p.title} (${p.amount})`);
                          setActiveTab('form');
                        }}
                        className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-amber-500 hover:text-slate-950 font-bold text-xs text-white transition-all flex items-center justify-center space-x-1"
                      >
                        <span>Select {p.title}</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Direct Telemetry Overview */}
                <div className="p-4 rounded-2xl bg-[#1A2142] border border-white/5 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Target Footfall</span>
                    <p className="font-bold text-base text-white">5,000+ Students</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Institutions</span>
                    <p className="font-bold text-base text-fuchsia-400">40+ Universities</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Digital Pass Impressions</span>
                    <p className="font-bold text-base text-indigo-400">25,000+ Views</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Festival Days</span>
                    <p className="font-bold text-base text-emerald-400">3 Grand Days</p>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={() => setActiveTab('form')}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-fuchsia-600 to-indigo-600 text-white font-bold text-xs shadow-lg hover:scale-105 transition-all"
                  >
                    Proceed to Inquiry Form &rarr;
                  </button>
                </div>
              </div>
            )}

            {/* TAB 2: INQUIRY FORM */}
            {activeTab === 'form' && (
              <div>
                {submitted ? (
                  <div className="p-8 text-center space-y-4 bg-emerald-950/40 border border-emerald-500/30 rounded-2xl">
                    <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
                    <h3 className="font-bold text-xl text-white">Inquiry Received!</h3>
                    <p className="text-xs text-slate-300 max-w-md mx-auto">
                      Thank you for your interest in partnering with COLORIDO 2K26. Our Corporate Secretariat has received your details and will get in touch with your team shortly.
                    </p>
                    <button
                      onClick={() => setProspectusModalOpen(false)}
                      className="px-6 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-500 transition-colors"
                    >
                      Done
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmitInquiry} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-300">Company / Brand Name *</label>
                        <div className="relative">
                          <input
                            type="text"
                            required
                            value={companyName}
                            onChange={e => setCompanyName(e.target.value)}
                            placeholder="e.g. TechCorp India Pvt Ltd"
                            className="w-full bg-[#1A2142] border border-white/10 rounded-xl py-2.5 px-3 pl-9 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-fuchsia-500"
                          />
                          <Building className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-300">Contact Person Name *</label>
                        <div className="relative">
                          <input
                            type="text"
                            required
                            value={contactPerson}
                            onChange={e => setContactPerson(e.target.value)}
                            placeholder="e.g. Vikramaditya Singh"
                            className="w-full bg-[#1A2142] border border-white/10 rounded-xl py-2.5 px-3 pl-9 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-fuchsia-500"
                          />
                          <User className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-300">Official Work Email *</label>
                        <div className="relative">
                          <input
                            type="email"
                            required
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            placeholder="e.g. partner@techcorp.com"
                            className="w-full bg-[#1A2142] border border-white/10 rounded-xl py-2.5 px-3 pl-9 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-fuchsia-500"
                          />
                          <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-300">Phone Number</label>
                        <div className="relative">
                          <input
                            type="tel"
                            maxLength={10}
                            value={phone}
                            onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                            placeholder="10-digit Phone Number"
                            className="w-full bg-[#1A2142] border border-white/10 rounded-xl py-2.5 px-3 pl-9 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-fuchsia-500"
                          />
                          <Phone className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-300">Target Sponsorship Tier</label>
                      <select
                        value={tier}
                        onChange={e => setTier(e.target.value)}
                        className="w-full bg-[#1A2142] border border-white/10 rounded-xl py-2.5 px-3 text-xs text-white focus:outline-none focus:border-fuchsia-500"
                      >
                        <option value="Title Partner (₹5,00,000)">Title Partner (₹5,00,000 / $6,000)</option>
                        <option value="Gold Partner (₹2,50,000)">Gold Partner (₹2,50,000 / $3,000)</option>
                        <option value="Silver Partner (₹1,00,000)">Silver / Category Partner (₹1,00,000 / $1,200)</option>
                        <option value="Custom / In-Kind Partner">Custom / Arena Booth / In-Kind Media Partner</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-300">Message / Sponsorship Requirements</label>
                      <textarea
                        rows={3}
                        value={message}
                        onChange={e => setMessage(e.target.value)}
                        placeholder="Specify booth requirements, marketing objectives, or custom requests..."
                        className="w-full bg-[#1A2142] border border-white/10 rounded-xl p-3 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-fuchsia-500"
                      />
                    </div>

                    <div className="pt-2 flex justify-between items-center">
                      <button
                        type="button"
                        onClick={() => setActiveTab('tiers')}
                        className="text-xs text-slate-400 hover:text-white font-semibold"
                      >
                        &larr; Back to Prospectus Tiers
                      </button>
                      <button
                        type="submit"
                        className="px-8 py-3 rounded-xl bg-gradient-to-r from-fuchsia-600 to-indigo-600 hover:from-fuchsia-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg transition-all flex items-center space-x-2"
                      >
                        <Send className="w-4 h-4" />
                        <span>Submit Official Inquiry</span>
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}

            {/* Modal Footer Desk Info */}
            <div className="pt-4 border-t border-white/10 flex flex-wrap justify-between items-center text-[10px] font-mono text-slate-400 gap-2">
              <span>Secretariat Desk: Administrative Block 302</span>
              <span>Direct Phone: +91 98765 43210</span>
              <span>Email: sponsorships@colorido2k26.edu</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
