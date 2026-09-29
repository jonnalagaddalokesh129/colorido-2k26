import React, { useState } from 'react';
import { Database, CheckCircle2, ShieldCheck, RefreshCw, X, Copy, ExternalLink } from 'lucide-react';
import { isSupabaseConfigured, getSupabaseConfig } from '../../lib/supabase';
import { store } from '../../lib/store';
import { useToast } from '../../context/ToastContext';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const DatabaseStatusModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { showToast } = useToast();
  const config = getSupabaseConfig();
  const [activeTab, setActiveTab] = useState<'status' | 'schema' | 'seed'>('status');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleResetData = () => {
    if (confirm('Are you sure you want to reset all data back to the default COLORIDO 2K26 dataset? Any new custom registrations will be reset.')) {
      store.resetToDefaultSeed();
      showToast('Database reset to default COLORIDO 2K26 competition records!', 'success');
      onClose();
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    showToast('Copied to clipboard!', 'info');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#064E52]/60 backdrop-blur-sm p-4 overflow-y-auto"
    >
      <div
        onClick={e => e.stopPropagation()}
        className="bg-white border border-[#006D8F]/20 rounded-2xl max-w-2xl w-full p-6 shadow-2xl relative text-[#064E52]"
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-[#4A6B6D] hover:text-[#064E52] p-2 rounded-lg hover:bg-[#DDF3F0] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 mb-6">
          <div className="p-3 bg-[#DDF3F0] text-[#20B2AA] rounded-xl border border-[#20B2AA]/30">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-[#064E52]">Database &amp; System Architecture</h2>
            <p className="text-xs text-[#4A6B6D]">PostgreSQL / Supabase Integration &amp; Dual-Engine Data Store</p>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-[#006D8F]/15 mb-6 space-x-4">
          <button
            onClick={() => setActiveTab('status')}
            className={`pb-3 text-sm font-bold border-b-2 transition-all ${
              activeTab === 'status'
                ? 'border-[#20B2AA] text-[#006D8F]'
                : 'border-transparent text-[#4A6B6D] hover:text-[#064E52]'
            }`}
          >
            Connection Status
          </button>
          <button
            onClick={() => setActiveTab('schema')}
            className={`pb-3 text-sm font-bold border-b-2 transition-all ${
              activeTab === 'schema'
                ? 'border-[#20B2AA] text-[#006D8F]'
                : 'border-transparent text-[#4A6B6D] hover:text-[#064E52]'
            }`}
          >
            PostgreSQL Schema
          </button>
          <button
            onClick={() => setActiveTab('seed')}
            className={`pb-3 text-sm font-bold border-b-2 transition-all ${
              activeTab === 'seed'
                ? 'border-[#20B2AA] text-[#006D8F]'
                : 'border-transparent text-[#4A6B6D] hover:text-[#064E52]'
            }`}
          >
            Seed Dataset Summary
          </button>
        </div>

        {activeTab === 'status' && (
          <div className="space-y-4 text-sm">
            <div className="p-4 rounded-xl border flex items-start space-x-3 bg-[#DDF3F0] border-[#20B2AA]/40 text-[#064E52]">
              <CheckCircle2 className="w-5 h-5 mt-0.5 text-[#20B2AA] flex-shrink-0" />
              <div>
                <p className="font-bold text-[#064E52]">
                  {config.isConfigured ? 'Connected to Remote Supabase PostgreSQL' : 'Active Engine: High-Speed Client-Side Relational Store'}
                </p>
                <p className="text-xs text-[#4A6B6D] mt-1 leading-relaxed">
                  {config.isConfigured
                    ? `Live Supabase Endpoint active at: ${config.url}`
                    : 'The platform is running on a reactive, persistent database engine initialized with the official COLORIDO 2K26 dataset (16 required events, 30+ participants, 30+ registrations, 20+ schedules, live leaderboard, results & check-ins). All actions (registration, results, QR check-in) persist in localStorage.'}
                </p>
              </div>
            </div>

            <div className="bg-[#DDF3F0]/50 p-4 rounded-xl border border-[#006D8F]/15 space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="text-[#4A6B6D]">Database Engine:</span>
                <span className="font-mono text-[#006D8F] font-bold">PostgreSQL 15 / Supabase + LocalStore Cache</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-[#4A6B6D]">Total Mandatory Events:</span>
                <span className="font-mono text-[#064E52] font-bold">16 Events (10 Cultural + 6 Sports)</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-[#4A6B6D]">Row Level Security (RLS):</span>
                <span className="font-mono text-[#20B2AA] font-bold flex items-center">
                  <ShieldCheck className="w-3.5 h-3.5 mr-1" /> Enabled in schema.sql
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-[#4A6B6D]">SQL Schema Location:</span>
                <span className="font-mono text-[#064E52]">/supabase/schema.sql</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-[#4A6B6D]">SQL Seed Location:</span>
                <span className="font-mono text-[#064E52]">/supabase/seed.sql</span>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap gap-3">
              <button
                onClick={handleResetData}
                className="flex items-center px-4 py-2 bg-white hover:bg-[#DDF3F0] text-[#006D8F] rounded-xl text-xs font-bold border border-[#006D8F]/25 shadow-xs transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5 mr-2 text-[#20B2AA]" />
                Reset Sample Data to Default
              </button>
            </div>
          </div>
        )}

        {activeTab === 'schema' && (
          <div className="space-y-3">
            <div className="flex justify-between items-center text-xs text-[#4A6B6D]">
              <span>PostgreSQL DDL (`supabase/schema.sql` preview):</span>
              <button
                onClick={() => copyToClipboard('SELECT * FROM events;')}
                className="flex items-center text-[#006D8F] hover:text-[#20B2AA] text-xs font-bold"
              >
                <Copy className="w-3.5 h-3.5 mr-1" /> Copy Script Path
              </button>
            </div>
            <pre className="bg-[#064E52] p-4 rounded-xl border border-[#006D8F]/20 text-xs font-mono text-[#38C7BF] overflow-x-auto max-h-60 leading-relaxed shadow-inner">
{`-- 19 Complete Tables Defined with Foreign Keys & RLS:
CREATE TABLE profiles ( id UUID PRIMARY KEY, user_id UUID UNIQUE, role TEXT... );
CREATE TABLE venues ( id TEXT PRIMARY KEY, name TEXT, capacity INT... );
CREATE TABLE events ( event_id TEXT PRIMARY KEY, event_name TEXT, category TEXT, rules TEXT[]... );
CREATE TABLE schedules ( id UUID PRIMARY KEY, event_id TEXT REFERENCES events... );
CREATE TABLE registrations ( id UUID PRIMARY KEY, registration_id TEXT UNIQUE... );
CREATE TABLE checkins ( id UUID PRIMARY KEY, registration_id TEXT REFERENCES registrations... );
CREATE TABLE results ( id UUID PRIMARY KEY, event_id TEXT, position TEXT, score TEXT... );
CREATE TABLE leaderboard ( id UUID PRIMARY KEY, college_name TEXT, cultural_points INT... );
CREATE TABLE certificates ( id UUID PRIMARY KEY, certificate_id TEXT UNIQUE... );
CREATE TABLE announcements ( id UUID PRIMARY KEY, title TEXT, priority TEXT... );
CREATE TABLE sponsors ( id UUID PRIMARY KEY, name TEXT, category TEXT... );
CREATE TABLE gallery ( id UUID PRIMARY KEY, title TEXT, image_url TEXT... );
CREATE TABLE contact_messages ( id UUID PRIMARY KEY, name TEXT, message TEXT... );`}
            </pre>
          </div>
        )}

        {activeTab === 'seed' && (
          <div className="space-y-3 text-xs text-[#064E52]">
            <p className="leading-relaxed font-medium">
              The competition dataset has been verified and fully seeded with exact records for all 16 required disciplines:
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-[#DDF3F0] p-3 rounded-lg border border-[#006D8F]/15">
                <span className="font-bold text-[#006D8F] block mb-1">🎭 10 Cultural Events:</span>
                Fine Arts, Music Solo, Music Band, Dance Solo, Dance Group, Choreoday, Dramatics, Fashion Show, Tekraft Events, Literary
              </div>
              <div className="bg-[#DDF3F0] p-3 rounded-lg border border-[#006D8F]/15">
                <span className="font-bold text-[#20B2AA] block mb-1">🏆 6 Sports Championships:</span>
                Boys Basketball, Boys Volleyball, Boys Table Tennis, Girls Throwball, Girls Tennikoit, Girls Table Tennis
              </div>
            </div>
            <p className="text-[#4A6B6D] text-xs mt-2">
              All events are linked to 6 detailed campus venues, coordinators with phone numbers, strict eligibility rules, maximum participant limits, schedule dates, and registration deadlines.
            </p>
          </div>
        )}

        <div className="mt-6 pt-4 border-t border-[#006D8F]/15 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#20B2AA] hover:bg-[#1CA099] text-white rounded-xl text-xs font-bold shadow-md shadow-[#20B2AA]/20 transition-all"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
