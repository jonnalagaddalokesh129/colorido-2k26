import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Calendar, 
  Trophy, 
  Mail, 
  Flame, 
  TrendingUp, 
  Sparkles, 
  CheckCircle2,
  Building,
  BarChart2,
  PieChart
} from 'lucide-react';
import { store } from '../../lib/store';
import { Registration, EventItem, ResultItem, ContactMessage } from '../../types/database';

interface Props {
  onSelectTab?: (tab: string) => void;
}

export const AdminDashboardPage: React.FC<Props> = ({ onSelectTab }) => {
  const [registrations, setRegistrations] = useState<Registration[]>(() => store.getRegistrations());
  const [events, setEvents] = useState<EventItem[]>(() => store.getEvents());
  const [results, setResults] = useState<ResultItem[]>(() => store.getResults());
  const [messages, setMessages] = useState<ContactMessage[]>(() => store.getContactMessages());

  useEffect(() => {
    const update = () => {
      setRegistrations(store.getRegistrations());
      setEvents(store.getEvents());
      setResults(store.getResults());
      setMessages(store.getContactMessages());
    };
    update();
    const unsub = store.subscribe(update);
    return () => unsub();
  }, []);

  // Compute metrics from actual database
  const totalRegistrations = registrations.length;
  const totalParticipants = registrations.reduce((acc, r) => acc + (r.team_size || 1), 0);
  
  const culturalEventIds = new Set(events.filter(e => e.category === 'cultural').map(e => e.event_id));
  const culturalRegistrations = registrations.filter(r => culturalEventIds.has(r.event_id)).length;
  const sportsRegistrations = registrations.length - culturalRegistrations;

  const totalEvents = events.length;
  const publishedResults = results.filter(r => r.is_published).length;
  const unreadMessages = messages.filter(m => m.status === 'unread').length;
  const checkinsCount = store.getCheckins().length;

  // College participation breakdown
  const collegeCounts: Record<string, number> = {};
  registrations.forEach(r => {
    collegeCounts[r.participant_college] = (collegeCounts[r.participant_college] || 0) + (r.team_size || 1);
  });
  const topColleges = Object.entries(collegeCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  // Event popularity breakdown
  const eventCounts: Record<string, number> = {};
  registrations.forEach(r => {
    eventCounts[r.event_id] = (eventCounts[r.event_id] || 0) + 1;
  });
  const topEvents = events
    .map(e => ({
      name: e.event_name,
      count: eventCounts[e.event_id] || 0,
      category: e.category
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-white">
            Executive Analytics & Operations
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time telemetry aggregated across tournament registrations, check-in gates, and scores
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-3 py-1.5 rounded-xl">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Real Data Stream Active</span>
        </div>
      </div>

      {/* KPI METRIC CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Total Participants -> Participant Registry */}
        <div
          onClick={() => onSelectTab?.('participants')}
          className="p-5 rounded-2xl bg-[#12172F] border border-white/10 space-y-2 shadow-lg cursor-pointer hover:border-fuchsia-500/40 hover:bg-[#1A2142] hover:scale-[1.02] transition-all group"
          title="Click to view Participant Registry"
        >
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 group-hover:text-fuchsia-300 transition-colors">Total Participants</span>
            <Users className="w-4 h-4 text-fuchsia-400 group-hover:scale-110 transition-transform" />
          </div>
          <p className="font-display font-black text-2xl sm:text-3xl text-white">{totalParticipants}</p>
          <span className="text-[10px] text-fuchsia-400 font-medium">Contingent Athletes & Artists &rarr;</span>
        </div>

        {/* Total Registrations -> Participant Registry */}
        <div
          onClick={() => onSelectTab?.('participants')}
          className="p-5 rounded-2xl bg-[#12172F] border border-white/10 space-y-2 shadow-lg cursor-pointer hover:border-indigo-500/40 hover:bg-[#1A2142] hover:scale-[1.02] transition-all group"
          title="Click to view All Registrations"
        >
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 group-hover:text-indigo-300 transition-colors">Total Registrations</span>
            <Calendar className="w-4 h-4 text-indigo-400 group-hover:scale-110 transition-transform" />
          </div>
          <p className="font-display font-black text-2xl sm:text-3xl text-indigo-400">{totalRegistrations}</p>
          <span className="text-[10px] text-slate-400 group-hover:text-indigo-300 font-medium">Solo & Team Entries &rarr;</span>
        </div>

        {/* Cultural vs Sports -> Event Management */}
        <div
          onClick={() => onSelectTab?.('events')}
          className="p-5 rounded-2xl bg-[#12172F] border border-white/10 space-y-2 shadow-lg cursor-pointer hover:border-sky-500/40 hover:bg-[#1A2142] hover:scale-[1.02] transition-all group"
          title="Click to view Event Management"
        >
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 group-hover:text-sky-300 transition-colors">Cultural / Sports</span>
            <Trophy className="w-4 h-4 text-sky-400 group-hover:scale-110 transition-transform" />
          </div>
          <p className="font-display font-black text-2xl sm:text-3xl text-white">
            {culturalRegistrations} <span className="text-slate-500 text-lg">/</span> {sportsRegistrations}
          </p>
          <span className="text-[10px] text-sky-400 font-medium">Entries by Arena &rarr;</span>
        </div>

        {/* Total Events -> Event Management */}
        <div
          onClick={() => onSelectTab?.('events')}
          className="p-5 rounded-2xl bg-[#12172F] border border-white/10 space-y-2 shadow-lg cursor-pointer hover:border-amber-500/40 hover:bg-[#1A2142] hover:scale-[1.02] transition-all group"
          title="Click to view Competition Events"
        >
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 group-hover:text-amber-300 transition-colors">Competition Events</span>
            <Sparkles className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
          </div>
          <p className="font-display font-black text-2xl sm:text-3xl text-amber-400">{totalEvents}</p>
          <span className="text-[10px] text-amber-300 font-medium">16 Disciplines Ready &rarr;</span>
        </div>

        {/* Published Results -> Results & Scoring */}
        <div
          onClick={() => onSelectTab?.('results')}
          className="p-5 rounded-2xl bg-[#12172F] border border-white/10 space-y-2 shadow-lg cursor-pointer hover:border-yellow-500/40 hover:bg-[#1A2142] hover:scale-[1.02] transition-all group"
          title="Click to view Results & Scoring"
        >
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 group-hover:text-yellow-300 transition-colors">Published Results</span>
            <Trophy className="w-4 h-4 text-yellow-400 group-hover:scale-110 transition-transform" />
          </div>
          <p className="font-display font-black text-2xl sm:text-3xl text-yellow-400">{publishedResults}</p>
          <span className="text-[10px] text-slate-400 group-hover:text-yellow-300 font-medium">Scores Locked &rarr;</span>
        </div>

        {/* Gate Check-Ins -> QR Gate Check-In */}
        <div
          onClick={() => onSelectTab?.('checkin')}
          className="p-5 rounded-2xl bg-[#12172F] border border-white/10 space-y-2 shadow-lg cursor-pointer hover:border-emerald-500/40 hover:bg-[#1A2142] hover:scale-[1.02] transition-all group"
          title="Click to view Gate Check-Ins"
        >
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 group-hover:text-emerald-300 transition-colors">Gate Check-Ins</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
          </div>
          <p className="font-display font-black text-2xl sm:text-3xl text-emerald-400">{checkinsCount}</p>
          <span className="text-[10px] text-slate-400 group-hover:text-emerald-300 font-medium">Verified Turnstiles &rarr;</span>
        </div>

        {/* Unread Inquiries -> Secretariat Messages */}
        <div
          onClick={() => onSelectTab?.('messages')}
          className="p-5 rounded-2xl bg-[#12172F] border border-white/10 space-y-2 shadow-lg cursor-pointer hover:border-rose-500/40 hover:bg-[#1A2142] hover:scale-[1.02] transition-all group"
          title="Click to view Secretariat Inbox"
        >
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 group-hover:text-rose-300 transition-colors">Unread Inquiries</span>
            <Mail className="w-4 h-4 text-rose-400 group-hover:scale-110 transition-transform" />
          </div>
          <p className="font-display font-black text-2xl sm:text-3xl text-rose-400">{unreadMessages}</p>
          <span className="text-[10px] text-slate-400 group-hover:text-rose-300 font-medium">Secretariat Inbox &rarr;</span>
        </div>

        {/* Colleges Represented -> Participant Registry */}
        <div
          onClick={() => onSelectTab?.('participants')}
          className="p-5 rounded-2xl bg-[#12172F] border border-white/10 space-y-2 shadow-lg cursor-pointer hover:border-teal-500/40 hover:bg-[#1A2142] hover:scale-[1.02] transition-all group"
          title="Click to view Colleges in Participant Registry"
        >
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 group-hover:text-teal-300 transition-colors">Colleges Represented</span>
            <Building className="w-4 h-4 text-teal-400 group-hover:scale-110 transition-transform" />
          </div>
          <p className="font-display font-black text-2xl sm:text-3xl text-teal-400">{topColleges.length}+</p>
          <span className="text-[10px] text-slate-400 group-hover:text-teal-300 font-medium">Universities Participating &rarr;</span>
        </div>
      </div>

      {/* CHARTS & VISUALIZATIONS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Chart 1: Event Popularity Bar Chart */}
        <div className="p-6 rounded-3xl bg-[#12172F] border border-white/10 space-y-6 shadow-xl">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <h3 className="font-bold text-sm text-white">Event Registration Popularity</h3>
              <p className="text-xs text-slate-400">Top disciplines by registered contingents</p>
            </div>
            <BarChart2 className="w-4 h-4 text-fuchsia-400" />
          </div>

          <div className="space-y-4">
            {topEvents.map(evt => {
              const maxCount = Math.max(...topEvents.map(e => e.count), 1);
              const percentage = Math.round((evt.count / maxCount) * 100);

              return (
                <div key={evt.name} className="space-y-1 text-xs">
                  <div className="flex justify-between text-slate-300">
                    <span className="font-semibold truncate max-w-[240px]">{evt.name}</span>
                    <span className="font-mono text-fuchsia-400 font-bold">{evt.count} entries</span>
                  </div>
                  <div className="w-full bg-[#1A2142] rounded-full h-3 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${
                        evt.category === 'cultural'
                          ? 'bg-gradient-to-r from-fuchsia-500 to-purple-500'
                          : 'bg-gradient-to-r from-sky-500 to-indigo-500'
                      }`}
                      style={{ width: `${Math.max(10, percentage)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Chart 2: College Participation Standings */}
        <div className="p-6 rounded-3xl bg-[#12172F] border border-white/10 space-y-6 shadow-xl">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <h3 className="font-bold text-sm text-white">Top University Contingents</h3>
              <p className="text-xs text-slate-400">Leaderboard by total participant delegations</p>
            </div>
            <Building className="w-4 h-4 text-sky-400" />
          </div>

          <div className="space-y-4">
            {topColleges.map(([collegeName, count], idx) => {
              const maxCollege = Math.max(...topColleges.map(c => c[1]), 1);
              const pct = Math.round((count / maxCollege) * 100);

              return (
                <div key={collegeName} className="space-y-1 text-xs">
                  <div className="flex justify-between text-slate-300">
                    <span className="font-semibold truncate max-w-[240px]">
                      #{idx + 1} {collegeName}
                    </span>
                    <span className="font-mono text-sky-400 font-bold">{count} participants</span>
                  </div>
                  <div className="w-full bg-[#1A2142] rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-indigo-500 to-cyan-500 h-full rounded-full transition-all duration-700"
                      style={{ width: `${Math.max(10, pct)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
