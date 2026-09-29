import React, { useState, useEffect, useMemo } from 'react';
import { 
  Trophy, 
  Medal, 
  Award, 
  Sparkles, 
  Filter, 
  Building, 
  Flame, 
  Crown,
  Search,
  CheckCircle2
} from 'lucide-react';
import { store } from '../lib/store';
import { LeaderboardEntry } from '../types/database';

interface Props {
  onNavigate: (path: string) => void;
}

export const LeaderboardPage: React.FC<Props> = ({ onNavigate }) => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>(() => store.getLeaderboard());
  const [filterType, setFilterType] = useState<'overall' | 'cultural' | 'sports'>('overall');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const update = () => {
      setLeaderboard(store.getLeaderboard());
    };
    update();
    const unsub = store.subscribe(update);
    return () => unsub();
  }, []);

  // Filter & Rank
  const sortedEntries = useMemo(() => {
    let list = [...leaderboard];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(e => e.college_name.toLowerCase().includes(q));
    }

    if (filterType === 'cultural') {
      list.sort((a, b) => b.cultural_points - a.cultural_points || b.gold_count - a.gold_count);
    } else if (filterType === 'sports') {
      list.sort((a, b) => b.sports_points - a.sports_points || b.gold_count - a.gold_count);
    } else {
      list.sort((a, b) => b.total_points - a.total_points || b.gold_count - a.gold_count);
    }

    return list.map((entry, index) => ({
      ...entry,
      computedRank: index + 1
    }));
  }, [leaderboard, filterType, searchQuery]);

  const top1 = sortedEntries[0];
  const top2 = sortedEntries[1];
  const top3 = sortedEntries[2];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#20B2AA]/15 border border-[#20B2AA]/30 text-[#006D8F] text-xs font-bold">
          <Trophy className="w-3.5 h-3.5" />
          <span>Official Festival Rolling Championship</span>
        </div>
        <h1 className="font-display font-extrabold text-3xl sm:text-5xl text-[#064E52] tracking-tight">
          Live Championship Leaderboard
        </h1>
        <p className="text-xs sm:text-sm text-[#006D8F] max-w-xl mx-auto">
          Tracking institutional standings across all 16 cultural and sports competitions. Scored dynamically upon certified adjudicator result publications (1st Place = 10 pts, 2nd Place = 7 pts, 3rd Place = 5 pts).
        </p>
      </div>

      {/* PODIUM VISUAL FOR TOP 3 INSTITUTIONS */}
      {sortedEntries.length >= 3 && (
        <div className="max-w-3xl mx-auto pt-6 pb-2">
          <div className="grid grid-cols-3 gap-3 sm:gap-6 items-end">
            {/* 2nd Place (Silver) */}
            <div className="bg-[#12172F] border border-slate-400/30 rounded-2xl sm:rounded-3xl p-4 sm:p-6 text-center space-y-2 shadow-xl transform hover:-translate-y-1 transition-transform">
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-slate-300/20 text-slate-200 border-2 border-slate-300 flex items-center justify-center mx-auto text-xl font-bold shadow-md">
                🥈
              </div>
              <span className="text-[10px] sm:text-xs font-mono font-bold uppercase tracking-wider text-slate-400 block">
                Rank #2 • Runner Up
              </span>
              <h3 className="font-bold text-xs sm:text-sm text-white line-clamp-2">{top2.college_name}</h3>
              <p className="font-display font-black text-xl sm:text-3xl text-slate-200">
                {filterType === 'cultural' ? top2.cultural_points : filterType === 'sports' ? top2.sports_points : top2.total_points}
                <span className="text-[11px] font-sans font-normal text-slate-400 ml-1">pts</span>
              </p>
            </div>

            {/* 1st Place (Gold Champion) */}
            <div className="bg-gradient-to-b from-amber-950/50 via-[#1A2142] to-[#12172F] border-2 border-yellow-500 rounded-2xl sm:rounded-3xl p-5 sm:p-8 text-center space-y-2 shadow-2xl relative transform -translate-y-4 hover:-translate-y-5 transition-transform">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-yellow-500 text-slate-950 text-[10px] font-black uppercase tracking-wider px-3 py-0.5 rounded-full flex items-center space-x-1 shadow-lg">
                <Crown className="w-3 h-3" />
                <span>CHAMPIONS</span>
              </div>
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-yellow-500/20 text-yellow-300 border-2 border-yellow-400 flex items-center justify-center mx-auto text-2xl sm:text-3xl font-bold shadow-lg">
                🥇
              </div>
              <span className="text-[10px] sm:text-xs font-mono font-bold uppercase tracking-wider text-yellow-400 block">
                Rank #1 • Trophy Leader
              </span>
              <h3 className="font-bold text-sm sm:text-base text-white line-clamp-2">{top1.college_name}</h3>
              <p className="font-display font-black text-2xl sm:text-4xl text-yellow-400">
                {filterType === 'cultural' ? top1.cultural_points : filterType === 'sports' ? top1.sports_points : top1.total_points}
                <span className="text-xs font-sans font-normal text-yellow-200/60 ml-1">pts</span>
              </p>
            </div>

            {/* 3rd Place (Bronze) */}
            <div className="bg-[#12172F] border border-amber-700/30 rounded-2xl sm:rounded-3xl p-4 sm:p-6 text-center space-y-2 shadow-xl transform hover:-translate-y-1 transition-transform">
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-amber-700/20 text-amber-500 border-2 border-amber-600 flex items-center justify-center mx-auto text-xl font-bold shadow-md">
                🥉
              </div>
              <span className="text-[10px] sm:text-xs font-mono font-bold uppercase tracking-wider text-amber-500 block">
                Rank #3 • 2nd Runner Up
              </span>
              <h3 className="font-bold text-xs sm:text-sm text-white line-clamp-2">{top3.college_name}</h3>
              <p className="font-display font-black text-xl sm:text-3xl text-amber-400">
                {filterType === 'cultural' ? top3.cultural_points : filterType === 'sports' ? top3.sports_points : top3.total_points}
                <span className="text-[11px] font-sans font-normal text-slate-400 ml-1">pts</span>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Standings Filter Bar */}
      <div className="bg-[#12172F] border border-white/10 rounded-3xl p-5 sm:p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          {/* Trophy Pillar Filters */}
          <div className="flex bg-[#1A2142] p-1 rounded-2xl border border-white/5 w-full sm:w-auto">
            <button
              onClick={() => setFilterType('overall')}
              className={`flex-1 sm:flex-initial px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                filterType === 'overall'
                  ? 'bg-gradient-to-r from-fuchsia-600 to-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Overall Championship
            </button>
            <button
              onClick={() => setFilterType('cultural')}
              className={`flex-1 sm:flex-initial px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                filterType === 'cultural'
                  ? 'bg-gradient-to-r from-fuchsia-600 to-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Cultural Trophy
            </button>
            <button
              onClick={() => setFilterType('sports')}
              className={`flex-1 sm:flex-initial px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                filterType === 'sports'
                  ? 'bg-gradient-to-r from-fuchsia-600 to-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Sports Trophy
            </button>
          </div>

          {/* Search by College */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search college name..."
              className="w-full bg-[#1A2142] border border-white/10 rounded-xl py-2.5 pl-10 pr-3 text-xs text-white focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Standings Table */}
      <div className="bg-[#12172F] border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#1A2142] text-slate-300 border-b border-white/10 uppercase font-mono text-[11px]">
              <tr>
                <th className="py-4 px-6 text-center w-16">Rank</th>
                <th className="py-4 px-6">College / Institution Name</th>
                <th className="py-4 px-6 text-center">Gold 🥇</th>
                <th className="py-4 px-6 text-center">Silver 🥈</th>
                <th className="py-4 px-6 text-center">Bronze 🥉</th>
                <th className="py-4 px-6 text-center">Cultural Pts</th>
                <th className="py-4 px-6 text-center">Sports Pts</th>
                <th className="py-4 px-6 text-right font-bold text-white">Total Points</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {sortedEntries.map(entry => (
                <tr
                  key={entry.id}
                  className="hover:bg-white/5 transition-colors group"
                >
                  <td className="py-4 px-6 text-center font-mono font-bold">
                    <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs ${
                      entry.computedRank === 1
                        ? 'bg-yellow-500/20 text-yellow-300 font-extrabold border border-yellow-500/40'
                        : entry.computedRank === 2
                        ? 'bg-slate-400/20 text-slate-200 border border-slate-400/40'
                        : entry.computedRank === 3
                        ? 'bg-amber-600/20 text-amber-400 border border-amber-600/40'
                        : 'text-slate-400'
                    }`}>
                      {entry.computedRank}
                    </span>
                  </td>

                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-3">
                      <Building className="w-4 h-4 text-fuchsia-400 flex-shrink-0" />
                      <span className="font-bold text-white text-xs sm:text-sm group-hover:text-fuchsia-400 transition-colors">
                        {entry.college_name}
                      </span>
                    </div>
                  </td>

                  <td className="py-4 px-6 text-center font-mono font-semibold text-slate-300">
                    {entry.gold_count}
                  </td>
                  <td className="py-4 px-6 text-center font-mono font-semibold text-slate-300">
                    {entry.silver_count}
                  </td>
                  <td className="py-4 px-6 text-center font-mono font-semibold text-slate-300">
                    {entry.bronze_count}
                  </td>

                  <td className="py-4 px-6 text-center font-mono text-fuchsia-300">
                    {entry.cultural_points}
                  </td>
                  <td className="py-4 px-6 text-center font-mono text-sky-300">
                    {entry.sports_points}
                  </td>

                  <td className="py-4 px-6 text-right font-mono font-black text-sm text-yellow-400">
                    {entry.total_points} pts
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
