import React, { useState, useEffect, useMemo } from "react";
import {
  Award, Trophy, Search, XCircle, Eye,
  Plus, AlertTriangle, ChevronRight,
  RefreshCw, Check
} from "lucide-react";
import { store } from "../../lib/store";
import { CertificateItem, EventItem, Registration, WinnerAssignment, WinnerPosition } from "../../types/database";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { CertificateModal } from "../../components/dashboard/CertificateModal";

const StatusBadge: React.FC<{ status?: string }> = ({ status }) => {
  const s = status || "issued";
  const cfg: Record<string, { label: string; cls: string }> = {
    issued:  { label: "Issued",   cls: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30" },
    revoked: { label: "Revoked",  cls: "bg-rose-500/20 text-rose-300 border-rose-500/30" },
    pending: { label: "Pending",  cls: "bg-amber-500/20 text-amber-300 border-amber-500/30" },
  };
  const c = cfg[s] || cfg["issued"];
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border ${c.cls}`}>
      {c.label}
    </span>
  );
};

const POSITIONS: WinnerPosition[] = ["1st Place", "2nd Place", "3rd Place"];
const posLabel = (p: WinnerPosition) =>
  p === "1st Place" ? "🥇 1st Place — Gold" :
  p === "2nd Place" ? "🥈 2nd Place — Silver" :
  "🥉 3rd Place — Bronze";
const posColor = (p?: string) =>
  p === "1st Place" ? "text-amber-400" :
  p === "2nd Place" ? "text-slate-300" :
  "text-amber-700";

export const AdminCertificatesPage: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [events, setEvents] = useState<EventItem[]>([]);
  const [allCerts, setAllCerts] = useState<CertificateItem[]>([]);
  const [allRegs, setAllRegs] = useState<Registration[]>([]);
  const [winnerAssignments, setWinnerAssignments] = useState<WinnerAssignment[]>([]);

  const [activeTab, setActiveTab] = useState<"overview" | "participation" | "winners" | "issued">("overview");
  const [selectedEventId, setSelectedEventId] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | "Participation Certificate" | "Winner Certificate" | "Runner-up Certificate">("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "issued" | "revoked">("all");
  const [previewCert, setPreviewCert] = useState<CertificateItem | null>(null);
  const [revokeModal, setRevokeModal] = useState<{ cert: CertificateItem; reason: string } | null>(null);
  const [confirmWinnersModal, setConfirmWinnersModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const adminId = user?.id || "admin";

  useEffect(() => {
    const update = () => {
      const evts = store.getEvents();
      setEvents(evts);
      setAllCerts(store.getCertificates());
      setAllRegs(store.getRegistrations());
      setWinnerAssignments(store.getWinnerAssignments());
      if (!selectedEventId && evts.length > 0) setSelectedEventId(evts[0].event_id);
    };
    update();
    const unsub = store.subscribe(update);
    return () => unsub();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const selectedEvent = events.find(e => e.event_id === selectedEventId);
  const eventRegs = allRegs.filter(r => r.event_id === selectedEventId);
  const eligibleRegs = eventRegs.filter(r => ["confirmed", "checked_in"].includes(r.status));
  const eventCerts = allCerts.filter(c => c.event_id === selectedEventId);
  const eventWinnerAssignments = winnerAssignments.filter(a => a.event_id === selectedEventId);
  const pendingAssignments = eventWinnerAssignments.filter(a => !a.confirmed);

  const filteredCerts = useMemo(() => {
    return allCerts.filter(c => {
      if (typeFilter !== "all" && c.certificate_type !== typeFilter) return false;
      if (statusFilter !== "all" && (c.status || "issued") !== statusFilter) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return c.participant_name.toLowerCase().includes(q) ||
               c.event_name.toLowerCase().includes(q) ||
               c.certificate_id.toLowerCase().includes(q) ||
               c.college.toLowerCase().includes(q);
      }
      return true;
    });
  }, [allCerts, typeFilter, statusFilter, searchQuery]);

  const totalIssued = allCerts.filter(c => (c.status || "issued") === "issued").length;
  const totalRevoked = allCerts.filter(c => c.status === "revoked").length;
  const totalParticipation = allCerts.filter(c => c.certificate_type === "Participation Certificate" && c.status !== "revoked").length;
  const totalWinner = allCerts.filter(c => c.certificate_type !== "Participation Certificate" && c.status !== "revoked").length;

  const handleBulkIssueParticipation = () => {
    if (!selectedEventId) return;
    setLoading(true);
    setTimeout(() => {
      const result = store.bulkIssueParticipationCertificates(selectedEventId, adminId);
      showToast(`Issued ${result.issued} certs. ${result.skipped} already existed.`, "success");
      setLoading(false);
    }, 400);
  };

  const handleToggleCertAvailability = (available: boolean) => {
    if (!selectedEventId) return;
    store.setEventCertAvailability(selectedEventId, available);
    showToast(
      available ? "Certificates published — participants can download." : "Certificate download disabled.",
      available ? "success" : "info"
    );
  };

  const getAssignmentForPosition = (pos: WinnerPosition) =>
    eventWinnerAssignments.find(a => a.position === pos);

  const handleAssignWinner = (reg: Registration, pos: WinnerPosition) => {
    const existing = eventWinnerAssignments.find(a => a.registration_id === reg.registration_id && a.position !== pos);
    if (existing && !existing.confirmed) store.removeWinnerAssignment(existing.id);
    const positionTaken = eventWinnerAssignments.find(a => a.position === pos && a.registration_id !== reg.registration_id);
    if (positionTaken && !positionTaken.confirmed) store.removeWinnerAssignment(positionTaken.id);

    const assignment: WinnerAssignment = {
      id: `wa_${reg.registration_id}_${pos.replace(/\s/g, "")}`,
      event_id: selectedEventId,
      event_name: selectedEvent?.event_name || "",
      registration_id: reg.registration_id,
      user_id: reg.user_id,
      participant_name: reg.participant_name,
      college: reg.participant_college,
      position: pos,
      assigned_by: adminId,
      assigned_at: new Date().toISOString(),
      confirmed: false,
    };
    store.saveWinnerAssignment(assignment);
    showToast(`${posLabel(pos)} → ${reg.participant_name}`, "success");
  };

  const handleConfirmWinners = () => {
    setLoading(true);
    setTimeout(() => {
      const result = store.confirmWinnerAssignments(selectedEventId, adminId);
      showToast(result.message, result.success ? "success" : "error");
      setConfirmWinnersModal(false);
      setLoading(false);
    }, 500);
  };

  const handleRevoke = () => {
    if (!revokeModal || !revokeModal.reason.trim()) {
      showToast("Please provide a revocation reason.", "error");
      return;
    }
    const result = store.revokeCertificate(revokeModal.cert.certificate_id, adminId, revokeModal.reason);
    showToast(result.message, result.success ? "success" : "error");
    setRevokeModal(null);
  };

  const TABS = [
    { id: "overview",      label: "Overview"         },
    { id: "participation", label: "Participation"     },
    { id: "winners",       label: "Winners"           },
    { id: "issued",        label: "All Certificates"  },
  ] as const;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-white flex items-center gap-2">
          <Award className="w-7 h-7 text-amber-400" /> Certificate Management
        </h1>
        <p className="text-sm text-slate-400 mt-1">Issue, manage, and revoke participation and winner certificates</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Total Issued",  value: totalIssued,        color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20" },
          { label: "Participation", value: totalParticipation, color: "text-blue-400",    bg: "bg-blue-500/10 border-blue-500/20" },
          { label: "Winner/Award",  value: totalWinner,        color: "text-amber-400",   bg: "bg-amber-500/10 border-amber-500/20" },
          { label: "Revoked",       value: totalRevoked,       color: "text-rose-400",    bg: "bg-rose-500/10 border-rose-500/20" },
        ].map(s => (
          <div key={s.label} className={`rounded-2xl p-4 border ${s.bg}`}>
            <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
            <p className="text-xs text-slate-400 font-semibold mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Tab bar */}
      <div className="flex gap-1 bg-white/5 p-1 rounded-xl overflow-x-auto">
        {TABS.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`flex-1 min-w-[90px] px-3 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow"
                : "text-slate-400 hover:text-white hover:bg-white/5"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── OVERVIEW ── */}
      {activeTab === "overview" && (
        <div className="space-y-3">
          <h2 className="text-sm font-bold text-slate-300 uppercase tracking-wider">Events &amp; Certificate Status</h2>
          {events.map(evt => {
            const evtCerts = allCerts.filter(c => c.event_id === evt.event_id && c.status !== "revoked");
            const partCount = evtCerts.filter(c => c.certificate_type === "Participation Certificate").length;
            const winCount  = evtCerts.filter(c => c.certificate_type !== "Participation Certificate").length;
            const eligCount = allRegs.filter(r => r.event_id === evt.event_id && ["confirmed","checked_in"].includes(r.status)).length;
            return (
              <div key={evt.event_id} className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-bold text-white text-sm truncate">{evt.event_name}</p>
                  <p className="text-xs text-slate-400">{evt.category.toUpperCase()} • {eligCount} eligible</p>
                </div>
                <div className="flex flex-wrap gap-2 items-center">
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">{partCount} Part.</span>
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">{winCount} Winner</span>
                  {evt.cert_available
                    ? <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">Published</span>
                    : <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-500/20 text-slate-400 border border-slate-500/30">Not Published</span>
                  }
                  <button onClick={() => { setSelectedEventId(evt.event_id); setActiveTab("participation"); }}
                    className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
                    Manage <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── PARTICIPATION ── */}
      {activeTab === "participation" && (
        <div className="space-y-5">
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
            <label className="text-xs text-slate-400 font-semibold whitespace-nowrap">Select Event:</label>
            <select value={selectedEventId} onChange={e => setSelectedEventId(e.target.value)}
              className="flex-1 bg-white/5 border border-white/15 text-white rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-indigo-500">
              {events.map(e => <option key={e.event_id} value={e.event_id} className="bg-slate-900">{e.event_name}</option>)}
            </select>
          </div>

          {selectedEvent && (
            <>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="font-bold text-white">{selectedEvent.event_name}</h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {eligibleRegs.length} eligible •{" "}
                      {eventCerts.filter(c => c.certificate_type === "Participation Certificate" && c.status !== "revoked").length} issued
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button onClick={() => handleToggleCertAvailability(!selectedEvent.cert_available)}
                      className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all ${
                        selectedEvent.cert_available
                          ? "bg-rose-500/20 border-rose-500/30 text-rose-300 hover:bg-rose-500/30"
                          : "bg-emerald-500/20 border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/30"
                      }`}>
                      {selectedEvent.cert_available ? "🔒 Disable Download" : "🔓 Enable Download"}
                    </button>
                    <button onClick={handleBulkIssueParticipation} disabled={loading || eligibleRegs.length === 0}
                      className="px-3 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow disabled:opacity-50 flex items-center gap-1.5">
                      {loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
                      Issue All Participation Certs
                    </button>
                  </div>
                </div>
                <div className={`rounded-xl p-3 text-xs font-medium border ${
                  selectedEvent.cert_available
                    ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-300"
                    : "bg-amber-500/10 border-amber-500/20 text-amber-300"
                }`}>
                  {selectedEvent.cert_available
                    ? "✅ Published — participants can download from their dashboard."
                    : "⚠️ Not published. Enable Download to make certificates accessible to participants."}
                </div>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                <div className="p-4 border-b border-white/10">
                  <h3 className="font-bold text-sm text-white">Participants ({eligibleRegs.length})</h3>
                </div>
                {eligibleRegs.length === 0
                  ? <div className="p-8 text-center text-slate-400 text-sm">No confirmed registrations for this event.</div>
                  : <div className="divide-y divide-white/5">
                      {eligibleRegs.map(reg => {
                        const cert = eventCerts.find(c =>
                          c.registration_id === reg.registration_id &&
                          c.certificate_type === "Participation Certificate" &&
                          c.status !== "revoked"
                        );
                        return (
                          <div key={reg.id} className="px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div className="min-w-0">
                              <p className="font-semibold text-white text-sm truncate">{reg.participant_name}</p>
                              <p className="text-[11px] text-slate-400 truncate">{reg.participant_college} • {reg.registration_id}</p>
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0">
                              {cert ? (
                                <>
                                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">Issued</span>
                                  <button onClick={() => setPreviewCert(cert)} className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white" title="Preview"><Eye className="w-3.5 h-3.5" /></button>
                                </>
                              ) : (
                                <>
                                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-500/20 text-slate-400 border border-slate-500/30">Eligible</span>
                                  <button onClick={() => { const r = store.issueParticipationCertificate(reg, adminId); showToast(r.message, r.success ? "success" : "error"); }}
                                    className="text-xs font-bold px-2.5 py-1 rounded-lg bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 border border-indigo-500/30">
                                    Issue
                                  </button>
                                </>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                }
              </div>
            </>
          )}
        </div>
      )}

      {/* ── WINNERS ── */}
      {activeTab === "winners" && (
        <div className="space-y-5">
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
            <label className="text-xs text-slate-400 font-semibold whitespace-nowrap">Select Event:</label>
            <select value={selectedEventId} onChange={e => setSelectedEventId(e.target.value)}
              className="flex-1 bg-white/5 border border-white/15 text-white rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-indigo-500">
              {events.map(e => <option key={e.event_id} value={e.event_id} className="bg-slate-900">{e.event_name}</option>)}
            </select>
          </div>

          {selectedEvent && (
            <>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-white flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-amber-400" /> Podium Assignments — {selectedEvent.event_name}
                  </h3>
                  {pendingAssignments.length > 0 && (
                    <button onClick={() => setConfirmWinnersModal(true)}
                      className="px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white shadow flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5" /> Confirm &amp; Issue ({pendingAssignments.length})
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {POSITIONS.map(pos => {
                    const assignment = getAssignmentForPosition(pos);
                    const issuedCert = allCerts.find(c => c.event_id === selectedEventId && c.winner_position === pos && c.status !== "revoked");
                    return (
                      <div key={pos} className={`rounded-xl border p-4 space-y-3 ${
                        pos === "1st Place" ? "border-amber-500/30 bg-amber-500/5" :
                        pos === "2nd Place" ? "border-slate-400/30 bg-slate-400/5" :
                        "border-amber-700/30 bg-amber-700/5"
                      }`}>
                        <div className="flex items-center justify-between">
                          <span className={`text-sm font-black ${posColor(pos)}`}>{posLabel(pos)}</span>
                          {issuedCert && <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">Issued</span>}
                        </div>
                        {issuedCert ? (
                          <div className="space-y-1">
                            <p className="font-semibold text-white text-sm">{issuedCert.participant_name}</p>
                            <p className="text-[11px] text-slate-400">{issuedCert.college}</p>
                            <p className="text-[10px] font-mono text-slate-500">{issuedCert.certificate_id}</p>
                            <button onClick={() => setPreviewCert(issuedCert)} className="text-xs text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-1">
                              <Eye className="w-3 h-3" /> Preview
                            </button>
                          </div>
                        ) : assignment ? (
                          <div className="space-y-2">
                            <p className="font-semibold text-white text-sm">{assignment.participant_name}</p>
                            <p className="text-[11px] text-slate-400">{assignment.college}</p>
                            <div className="flex gap-1">
                              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">Pending</span>
                              <button onClick={() => store.removeWinnerAssignment(assignment.id)}
                                className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 hover:bg-rose-500/30">
                                Remove
                              </button>
                            </div>
                          </div>
                        ) : (
                          <p className="text-xs text-slate-500 italic">Not assigned</p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                <div className="p-4 border-b border-white/10">
                  <h3 className="font-bold text-sm text-white">Assign Positions from Participants</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Click a position button to assign. Save drafts, then Confirm to issue certificates.</p>
                </div>
                {eligibleRegs.length === 0
                  ? <div className="p-8 text-center text-slate-400 text-sm">No confirmed registrations for this event.</div>
                  : <div className="divide-y divide-white/5">
                      {eligibleRegs.map(reg => {
                        const currentAssignment = eventWinnerAssignments.find(a => a.registration_id === reg.registration_id);
                        const issuedForReg = allCerts.find(c =>
                          c.registration_id === reg.registration_id &&
                          c.event_id === selectedEventId &&
                          c.certificate_type !== "Participation Certificate" &&
                          c.status !== "revoked"
                        );
                        return (
                          <div key={reg.id} className="px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div className="min-w-0">
                              <p className="font-semibold text-white text-sm truncate">{reg.participant_name}</p>
                              <p className="text-[11px] text-slate-400 truncate">{reg.participant_college}</p>
                              {currentAssignment && !currentAssignment.confirmed && (
                                <span className={`text-[10px] font-bold ${posColor(currentAssignment.position)}`}>
                                  → {posLabel(currentAssignment.position)}
                                </span>
                              )}
                              {issuedForReg && (
                                <span className="text-[10px] font-bold text-emerald-400">✓ {issuedForReg.achievement}</span>
                              )}
                            </div>
                            {!issuedForReg && (
                              <div className="flex flex-wrap gap-1 flex-shrink-0">
                                {POSITIONS.map(pos => {
                                  const posIssued = allCerts.find(c => c.event_id === selectedEventId && c.winner_position === pos && c.status !== "revoked");
                                  const isCurrentForPos = currentAssignment?.position === pos;
                                  return (
                                    <button key={pos} disabled={!!posIssued}
                                      onClick={() => isCurrentForPos
                                        ? store.removeWinnerAssignment(currentAssignment!.id)
                                        : handleAssignWinner(reg, pos)
                                      }
                                      className={`text-[10px] font-bold px-2 py-1 rounded-lg border transition-all disabled:opacity-40 disabled:cursor-not-allowed ${
                                        isCurrentForPos
                                          ? "bg-amber-500/30 border-amber-500/50 text-amber-200"
                                          : "bg-white/5 border-white/15 text-slate-400 hover:text-white hover:border-white/30"
                                      }`}>
                                      {pos === "1st Place" ? "🥇" : pos === "2nd Place" ? "🥈" : "🥉"} {pos}
                                    </button>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                }
              </div>
            </>
          )}
        </div>
      )}

      {/* ── ALL CERTIFICATES ── */}
      {activeTab === "issued" && (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-3">
            <div className="flex-1 min-w-[200px] relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input type="text" placeholder="Search by name, event, cert ID…" value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-white/5 border border-white/15 text-white placeholder-slate-500 rounded-xl pl-9 pr-3 py-2 text-sm focus:outline-none focus:border-indigo-500" />
            </div>
            <select value={typeFilter} onChange={e => setTypeFilter(e.target.value as typeof typeFilter)}
              className="bg-white/5 border border-white/15 text-white rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-indigo-500">
              <option value="all" className="bg-slate-900">All Types</option>
              <option value="Participation Certificate" className="bg-slate-900">Participation</option>
              <option value="Winner Certificate" className="bg-slate-900">Winner</option>
              <option value="Runner-up Certificate" className="bg-slate-900">Runner-up</option>
            </select>
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value as typeof statusFilter)}
              className="bg-white/5 border border-white/15 text-white rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-indigo-500">
              <option value="all" className="bg-slate-900">All Status</option>
              <option value="issued" className="bg-slate-900">Issued</option>
              <option value="revoked" className="bg-slate-900">Revoked</option>
            </select>
          </div>
          <p className="text-xs text-slate-500">{filteredCerts.length} certificate(s)</p>
          <div className="space-y-2">
            {filteredCerts.map(cert => (
              <div key={cert.id} className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="min-w-0 space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-[10px] font-bold text-slate-400">{cert.certificate_id}</span>
                    <StatusBadge status={cert.status} />
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-white/10 text-slate-300 border border-white/10">{cert.certificate_type}</span>
                    {cert.winner_position && (
                      <span className={`text-[10px] font-bold ${posColor(cert.winner_position)}`}>{posLabel(cert.winner_position as WinnerPosition)}</span>
                    )}
                  </div>
                  <p className="font-semibold text-white text-sm truncate">{cert.participant_name}</p>
                  <p className="text-[11px] text-slate-400 truncate">{cert.event_name} • {cert.college}</p>
                  <p className="text-[10px] text-slate-500">Issued: {cert.issue_date}</p>
                  {cert.status === "revoked" && cert.revoke_reason && (
                    <p className="text-[10px] text-rose-400">Revoked: {cert.revoke_reason}</p>
                  )}
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button onClick={() => setPreviewCert(cert)} className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white" title="Preview">
                    <Eye className="w-4 h-4" />
                  </button>
                  {cert.status !== "revoked" && (
                    <button onClick={() => setRevokeModal({ cert, reason: "" })} className="p-1.5 rounded-lg hover:bg-rose-500/20 text-slate-400 hover:text-rose-300" title="Revoke">
                      <XCircle className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
            {filteredCerts.length === 0 && (
              <div className="py-16 text-center text-slate-400">
                <Award className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p className="text-sm font-semibold">No certificates found</p>
                <p className="text-xs mt-1 opacity-70">Adjust filters or issue some certificates first.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Confirm Winners Modal */}
      {confirmWinnersModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#0B0D1B] border border-white/15 rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
              <h3 className="font-bold text-white">Confirm Winner Assignments</h3>
            </div>
            <p className="text-sm text-slate-400">
              The following winner certificates will be issued. This action requires individual revocation to undo.
            </p>
            <div className="space-y-2">
              {pendingAssignments.map(a => (
                <div key={a.id} className="flex items-center justify-between bg-white/5 rounded-xl px-3 py-2 text-sm">
                  <span className="font-semibold text-white">{a.participant_name}</span>
                  <span className={`font-bold text-xs ${posColor(a.position)}`}>{posLabel(a.position)}</span>
                </div>
              ))}
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={() => setConfirmWinnersModal(false)}
                className="flex-1 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-sm font-bold border border-white/10">
                Cancel
              </button>
              <button onClick={handleConfirmWinners} disabled={loading}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white text-sm font-bold shadow disabled:opacity-50 flex items-center justify-center gap-2">
                {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Trophy className="w-4 h-4" />}
                Issue Certificates
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Revoke Modal */}
      {revokeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#0B0D1B] border border-rose-500/30 rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center gap-2">
              <XCircle className="w-5 h-5 text-rose-400" />
              <h3 className="font-bold text-white">Revoke Certificate</h3>
            </div>
            <p className="text-sm text-slate-400">
              Revoking <strong className="text-white">{revokeModal.cert.certificate_id}</strong> for{" "}
              <strong className="text-white">{revokeModal.cert.participant_name}</strong>.
            </p>
            <div>
              <label className="text-xs text-slate-400 font-semibold block mb-1">Revocation Reason (required)</label>
              <textarea value={revokeModal.reason} onChange={e => setRevokeModal({ ...revokeModal, reason: e.target.value })}
                rows={3} placeholder="e.g. Data entry error — wrong participant assigned."
                className="w-full bg-white/5 border border-white/15 text-white placeholder-slate-500 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-rose-500 resize-none" />
            </div>
            <div className="flex gap-3">
              <button onClick={() => setRevokeModal(null)}
                className="flex-1 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-sm font-bold border border-white/10">
                Cancel
              </button>
              <button onClick={handleRevoke}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-sm font-bold shadow flex items-center justify-center gap-2">
                <XCircle className="w-4 h-4" /> Revoke
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Certificate Preview */}
      {previewCert && (
        <CertificateModal certificate={previewCert} isOpen={!!previewCert} onClose={() => setPreviewCert(null)} />
      )}
    </div>
  );
};
