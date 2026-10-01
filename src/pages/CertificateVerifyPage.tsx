import React, { useState, useEffect } from "react";
import { Shield, Search, CheckCircle2, XCircle, Award, Trophy, Clock, ArrowLeft } from "lucide-react";
import { store } from "../lib/store";

interface VerifyResult {
  valid: boolean;
  status?: string;
  participant_name?: string;
  event_name?: string;
  certificate_type?: string;
  winner_position?: string;
  issue_date?: string;
  certificate_id?: string;
  message?: string;
}

interface Props {
  initialCertId?: string;
  onNavigate?: (path: string) => void;
}

export const CertificateVerifyPage: React.FC<Props> = ({ initialCertId = "", onNavigate }) => {
  const [certId, setCertId] = useState(initialCertId);
  const [result, setResult] = useState<VerifyResult | null>(null);
  const [loading, setLoading] = useState(false);

  const doVerify = (id: string) => {
    if (!id.trim()) return;
    setLoading(true);
    setTimeout(() => {
      const r = store.verifyCertificate(id.trim().toUpperCase());
      setResult(r);
      setLoading(false);
    }, 400);
  };

  useEffect(() => {
    if (initialCertId && initialCertId.trim()) {
      setCertId(initialCertId.trim());
      doVerify(initialCertId.trim());
    }
  }, [initialCertId]);

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    doVerify(certId);
  };

  const posIcon = (pos?: string) =>
    pos === "1st Place" ? "🥇" : pos === "2nd Place" ? "🥈" : pos === "3rd Place" ? "🥉" : "🏅";

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 py-16">
      {/* Back */}
      {onNavigate && (
        <button onClick={() => onNavigate("/")}
          className="self-start mb-8 flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </button>
      )}

      {/* Header */}
      <div className="text-center mb-10 space-y-3">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 shadow-lg shadow-indigo-500/25 mb-3">
          <Shield className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white">Certificate Verification</h1>
        <p className="text-slate-400 max-w-md mx-auto text-sm leading-relaxed">
          Enter a COLORIDO 2K26 certificate ID to verify its authenticity and current validity status.
        </p>
      </div>

      {/* Search Form */}
      <form onSubmit={handleVerify} className="w-full max-w-lg mb-8">
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              value={certId}
              onChange={e => setCertId(e.target.value)}
              placeholder="e.g. CERT-COL26-W001 or CERT-COL26-P003"
              className="w-full bg-white/5 border border-white/15 text-white placeholder-slate-500 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>
          <button type="submit" disabled={loading || !certId.trim()}
            className="px-5 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-sm shadow disabled:opacity-50 disabled:cursor-not-allowed transition-all">
            {loading ? (
              <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /></span>
            ) : "Verify"}
          </button>
        </div>
      </form>

      {/* Result */}
      {result && (
        <div className={`w-full max-w-lg rounded-2xl border p-6 space-y-5 transition-all ${
          result.valid
            ? "bg-emerald-500/5 border-emerald-500/30"
            : "bg-rose-500/5 border-rose-500/30"
        }`}>
          {/* Status banner */}
          <div className={`flex items-center gap-3 rounded-xl px-4 py-3 ${
            result.valid ? "bg-emerald-500/20" : "bg-rose-500/20"
          }`}>
            {result.valid
              ? <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
              : <XCircle className="w-5 h-5 text-rose-400 flex-shrink-0" />
            }
            <div>
              <p className={`font-bold text-sm ${result.valid ? "text-emerald-300" : "text-rose-300"}`}>
                {result.valid ? "✅ Certificate is VALID" : "❌ Certificate is INVALID"}
              </p>
              <p className="text-xs text-slate-400 mt-0.5">{result.message}</p>
            </div>
          </div>

          {/* Certificate details (do NOT expose private data) */}
          {(result.participant_name || result.event_name) && (
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Certificate Details</h3>
              <div className="space-y-2">
                {result.certificate_id && (
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Certificate ID</span>
                    <span className="font-mono font-bold text-white">{result.certificate_id}</span>
                  </div>
                )}
                {result.participant_name && (
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Participant</span>
                    <span className="font-semibold text-white">{result.participant_name}</span>
                  </div>
                )}
                {result.event_name && (
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Event</span>
                    <span className="font-semibold text-white text-right max-w-[60%]">{result.event_name}</span>
                  </div>
                )}
                {result.certificate_type && (
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Type</span>
                    <span className="font-semibold text-white">{result.certificate_type}</span>
                  </div>
                )}
                {result.winner_position && (
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Achievement</span>
                    <span className={`font-bold text-white`}>{posIcon(result.winner_position)} {result.winner_position}</span>
                  </div>
                )}
                {result.issue_date && (
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Issue Date</span>
                    <span className="font-semibold text-white">{result.issue_date}</span>
                  </div>
                )}
                {result.status && (
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Status</span>
                    <span className={`font-bold uppercase ${result.valid ? "text-emerald-400" : "text-rose-400"}`}>{result.status}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Issued by */}
          <div className="pt-3 border-t border-white/10 text-xs text-slate-500 text-center">
            Issued by COLORIDO 2K26 Academic Secretariat • colorido2k26.edu
          </div>
        </div>
      )}

      {/* Instructions */}
      {!result && (
        <div className="w-full max-w-lg mt-4 grid grid-cols-3 gap-3">
          {[
            { icon: Shield, label: "Tamper-Proof IDs", desc: "Each certificate has a unique, non-guessable ID" },
            { icon: CheckCircle2, label: "Live Verification", desc: "Validity checked against official issued records" },
            { icon: Award, label: "Revocation Aware", desc: "Shows current status including if a cert was revoked" },
          ].map(item => (
            <div key={item.label} className="bg-white/5 border border-white/10 rounded-xl p-4 text-center space-y-2">
              <item.icon className="w-5 h-5 text-indigo-400 mx-auto" />
              <p className="text-xs font-bold text-white">{item.label}</p>
              <p className="text-[10px] text-slate-400 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
