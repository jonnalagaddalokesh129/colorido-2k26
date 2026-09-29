import React, { useState, useEffect } from 'react';
import { 
  Trophy, 
  Plus, 
  Trash2, 
  Edit3, 
  Eye, 
  EyeOff, 
  Sparkles, 
  X, 
  Sliders, 
  CheckCircle2,
  Building
} from 'lucide-react';
import { store, ScoringConfig } from '../../lib/store';
import { ResultItem, EventItem } from '../../types/database';
import { useToast } from '../../context/ToastContext';

export const AdminResultsPage: React.FC = () => {
  const { showToast } = useToast();
  const [results, setResults] = useState<ResultItem[]>(() => store.getResults());
  const [events, setEvents] = useState<EventItem[]>(() => store.getEvents());
  const [scoringConfig, setScoringConfig] = useState<ScoringConfig>(() => store.getScoringConfig());

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [configModalOpen, setConfigModalOpen] = useState(false);
  const [editingResultId, setEditingResultId] = useState<string | null>(null);

  // Form Fields
  const [eventId, setEventId] = useState(events[0]?.event_id || '');
  const [position, setPosition] = useState<'1st Place' | '2nd Place' | '3rd Place' | 'Special Mention'>('1st Place');
  const [participantName, setParticipantName] = useState('');
  const [teamName, setTeamName] = useState('');
  const [college, setCollege] = useState('');
  const [score, setScore] = useState('');

  // Config State
  const [scoreFirst, setScoreFirst] = useState(scoringConfig.first);
  const [scoreSecond, setScoreSecond] = useState(scoringConfig.second);
  const [scoreThird, setScoreThird] = useState(scoringConfig.third);
  const [scoreSpecial, setScoreSpecial] = useState(scoringConfig.special);

  useEffect(() => {
    const update = () => {
      setResults(store.getResults());
      setEvents(store.getEvents());
      setScoringConfig(store.getScoringConfig());
    };
    update();
    const unsub = store.subscribe(update);
    return () => unsub();
  }, []);

  const openCreateModal = () => {
    setEditingResultId(null);
    setEventId(events[0]?.event_id || '');
    setPosition('1st Place');
    setParticipantName('');
    setTeamName('');
    setCollege('');
    setScore('95.0 / 100');
    setModalOpen(true);
  };

  const openEditModal = (res: ResultItem) => {
    setEditingResultId(res.id);
    setEventId(res.event_id);
    setPosition(res.position);
    setParticipantName(res.participant_name);
    setTeamName(res.team_name || '');
    setCollege(res.college);
    setScore(res.score);
    setModalOpen(true);
  };

  const handleSaveResult = (e: React.FormEvent) => {
    e.preventDefault();
    const evt = events.find(e => e.event_id === eventId);
    let pts = scoringConfig.first;
    if (position === '2nd Place') pts = scoringConfig.second;
    else if (position === '3rd Place') pts = scoringConfig.third;
    else if (position === 'Special Mention') pts = scoringConfig.special;

    const winnerType = position === '1st Place' ? 'Winner' : position === '2nd Place' ? 'Runner-up' : position === '3rd Place' ? 'Second Runner-up' : 'Special Mention';

    if (editingResultId) {
      store.updateResult(editingResultId, {
        event_id: eventId,
        event_name: evt?.event_name,
        position,
        winner_type: winnerType,
        participant_name: participantName,
        team_name: teamName || undefined,
        college,
        score,
        points_awarded: pts
      });
      showToast(`Result updated for ${evt?.event_name}. Leaderboard points recalculated!`, 'success');
    } else {
      const newResult: ResultItem = {
        id: `res_${Date.now()}`,
        event_id: eventId,
        event_name: evt?.event_name,
        position,
        winner_type: winnerType,
        participant_name: participantName,
        team_name: teamName || undefined,
        college,
        score,
        points_awarded: pts,
        is_published: true,
        published_at: new Date().toISOString()
      };
      store.addResult(newResult);
      showToast(`Result published! Live Leaderboard updated & certificate generated for ${participantName}! 🏆`, 'success');
    }
    setModalOpen(false);
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Delete result for ${name}? Leaderboard points will be dynamically recalculated.`)) {
      store.deleteResult(id);
      showToast('Result deleted and leaderboard updated.', 'info');
    }
  };

  const togglePublish = (res: ResultItem) => {
    store.updateResult(res.id, { is_published: !res.is_published });
    showToast(`Result publication toggled to ${!res.is_published ? 'LIVE' : 'DRAFT'}`, 'info');
  };

  const handleSaveScoringConfig = (e: React.FormEvent) => {
    e.preventDefault();
    store.updateScoringConfig({
      first: Number(scoreFirst),
      second: Number(scoreSecond),
      third: Number(scoreThird),
      special: Number(scoreSpecial)
    });
    setConfigModalOpen(false);
    showToast('Championship scoring points configuration updated and recalculated across all colleges!', 'success');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <h1 className="font-display font-bold text-2xl text-white">Results & Championship Scoring</h1>
          <p className="text-xs text-slate-400">
            Publish official adjudicator scores. Automatically updates college points, participant medals, and certificate eligibility.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setConfigModalOpen(true)}
            className="px-3.5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 text-xs font-bold flex items-center space-x-2 border border-white/10"
          >
            <Sliders className="w-4 h-4 text-yellow-400" />
            <span>Configure Scoring Weights</span>
          </button>
          <button
            onClick={openCreateModal}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-500 hover:to-amber-500 text-white font-bold text-xs flex items-center space-x-2 shadow-lg transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Publish New Result</span>
          </button>
        </div>
      </div>

      {/* Current Scoring Weights Pill */}
      <div className="bg-[#12172F] border border-white/10 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 text-xs">
        <span className="text-slate-400 font-medium">Active Festival Scoring Rules:</span>
        <div className="flex flex-wrap gap-3 font-mono">
          <span className="px-2.5 py-0.5 rounded bg-yellow-500/20 text-yellow-300 font-bold">
            1st Place = {scoringConfig.first} pts
          </span>
          <span className="px-2.5 py-0.5 rounded bg-slate-400/20 text-slate-300 font-bold">
            2nd Place = {scoringConfig.second} pts
          </span>
          <span className="px-2.5 py-0.5 rounded bg-amber-700/20 text-amber-400 font-bold">
            3rd Place = {scoringConfig.third} pts
          </span>
          <span className="px-2.5 py-0.5 rounded bg-white/5 text-slate-300">
            Special Mention = {scoringConfig.special} pts
          </span>
        </div>
      </div>

      {/* Results Table */}
      <div className="bg-[#12172F] border border-white/10 rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#1A2142] text-slate-400 uppercase font-mono text-[10px] border-b border-white/10">
              <tr>
                <th className="py-4 px-5">Position</th>
                <th className="py-4 px-4">Event</th>
                <th className="py-4 px-4">Winner / Team</th>
                <th className="py-4 px-4">College</th>
                <th className="py-4 px-4">Score</th>
                <th className="py-4 px-4 text-center">Points</th>
                <th className="py-4 px-4 text-center">Visibility</th>
                <th className="py-4 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {results.map(res => (
                <tr key={res.id} className="hover:bg-white/5 transition-colors">
                  <td className="py-3 px-5 font-bold">
                    <span className="mr-2">
                      {res.position.includes('1st') ? '🥇' : res.position.includes('2nd') ? '🥈' : res.position.includes('3rd') ? '🥉' : '⭐'}
                    </span>
                    <span className="text-white">{res.position}</span>
                  </td>

                  <td className="py-3 px-4 font-bold text-fuchsia-400 truncate max-w-[180px]">
                    {res.event_name}
                  </td>

                  <td className="py-3 px-4">
                    <p className="font-bold text-white">{res.participant_name}</p>
                    {res.team_name && <p className="text-[10px] text-sky-400 font-semibold">{res.team_name}</p>}
                  </td>

                  <td className="py-3 px-4 text-slate-300 truncate max-w-[180px]">
                    {res.college}
                  </td>

                  <td className="py-3 px-4 font-mono font-bold text-slate-200">
                    {res.score}
                  </td>

                  <td className="py-3 px-4 text-center font-mono font-bold text-yellow-400">
                    +{res.points_awarded}
                  </td>

                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => togglePublish(res)}
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase transition-colors ${
                        res.is_published
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : 'bg-slate-700 text-slate-400'
                      }`}
                    >
                      {res.is_published ? 'Published' : 'Draft'}
                    </button>
                  </td>

                  <td className="py-3 px-5 text-right space-x-2">
                    <button
                      onClick={() => openEditModal(res)}
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white"
                      title="Edit Result"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(res.id, res.participant_name)}
                      className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400"
                      title="Delete Result"
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

      {/* CREATE / EDIT RESULT MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 overflow-y-auto">
          <div className="bg-[#12172F] border border-white/10 rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl relative">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white p-2 rounded-lg hover:bg-white/5"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="font-bold text-lg text-white">
              {editingResultId ? 'Edit Adjudicator Result' : 'Publish New Tournament Result'}
            </h2>

            <form onSubmit={handleSaveResult} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Competition Event *</label>
                <select
                  value={eventId}
                  onChange={e => setEventId(e.target.value)}
                  className="w-full bg-[#1A2142] border border-white/10 rounded-xl p-2.5 text-white focus:outline-none"
                >
                  {events.map(evt => (
                    <option key={evt.event_id} value={evt.event_id}>
                      {evt.event_name} ({evt.category.toUpperCase()})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Position / Medal *</label>
                <select
                  value={position}
                  onChange={e => setPosition(e.target.value as any)}
                  className="w-full bg-[#1A2142] border border-white/10 rounded-xl p-2.5 text-white focus:outline-none"
                >
                  <option value="1st Place">1st Place (Winner — Gold)</option>
                  <option value="2nd Place">2nd Place (Runner-up — Silver)</option>
                  <option value="3rd Place">3rd Place (Second Runner-up — Bronze)</option>
                  <option value="Special Mention">Special Recognition / Mention</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Participant / Captain Name *</label>
                <input
                  type="text"
                  required
                  value={participantName}
                  onChange={e => setParticipantName(e.target.value)}
                  placeholder="e.g. Aryan Nair"
                  className="w-full bg-[#1A2142] border border-white/10 rounded-xl p-2.5 text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Team Name (if group)</label>
                <input
                  type="text"
                  value={teamName}
                  onChange={e => setTeamName(e.target.value)}
                  placeholder="e.g. St. Xavier Ballers"
                  className="w-full bg-[#1A2142] border border-white/10 rounded-xl p-2.5 text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">College / University Name *</label>
                <input
                  type="text"
                  required
                  value={college}
                  onChange={e => setCollege(e.target.value)}
                  placeholder="e.g. St. Xavier's College, Mumbai"
                  className="w-full bg-[#1A2142] border border-white/10 rounded-xl p-2.5 text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Certified Score / Points *</label>
                <input
                  type="text"
                  required
                  value={score}
                  onChange={e => setScore(e.target.value)}
                  placeholder="e.g. 84 - 78 or 98.5 / 100"
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
                  className="px-6 py-2 rounded-xl bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-500 hover:to-amber-500 text-white font-bold shadow-lg"
                >
                  Save & Publish Result
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONFIGURE SCORING WEIGHTS MODAL */}
      {configModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
          <div className="bg-[#12172F] border border-white/10 rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl relative">
            <button
              onClick={() => setConfigModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white p-2 rounded-lg hover:bg-white/5"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="font-bold text-lg text-white">Championship Scoring Rules</h2>
            <p className="text-xs text-slate-400">
              Configure point values awarded to colleges for each podium position. The live leaderboard will automatically re-score all university standings.
            </p>

            <form onSubmit={handleSaveScoringConfig} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">1st Place Points</label>
                <input
                  type="number"
                  required
                  value={scoreFirst}
                  onChange={e => setScoreFirst(Number(e.target.value))}
                  className="w-full bg-[#1A2142] border border-white/10 rounded-xl p-2.5 text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">2nd Place Points</label>
                <input
                  type="number"
                  required
                  value={scoreSecond}
                  onChange={e => setScoreSecond(Number(e.target.value))}
                  className="w-full bg-[#1A2142] border border-white/10 rounded-xl p-2.5 text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">3rd Place Points</label>
                <input
                  type="number"
                  required
                  value={scoreThird}
                  onChange={e => setScoreThird(Number(e.target.value))}
                  className="w-full bg-[#1A2142] border border-white/10 rounded-xl p-2.5 text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Special Mention Points</label>
                <input
                  type="number"
                  required
                  value={scoreSpecial}
                  onChange={e => setScoreSpecial(Number(e.target.value))}
                  className="w-full bg-[#1A2142] border border-white/10 rounded-xl p-2.5 text-white focus:outline-none"
                />
              </div>

              <div className="pt-4 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setConfigModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-gradient-to-r from-yellow-600 to-amber-600 text-white font-bold shadow-lg"
                >
                  Apply & Recalculate Standings
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
