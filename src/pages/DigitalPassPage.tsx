import React, { useState, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { ArrowLeft, Printer, Download, Sparkles, MapPin, Calendar, Clock, ShieldCheck, Search } from 'lucide-react';
import { store } from '../lib/store';
import { Registration, EventItem } from '../types/database';
import { useToast } from '../context/ToastContext';

interface Props {
  initialRegId?: string;
  onBack: () => void;
}

export const DigitalPassPage: React.FC<Props> = ({ initialRegId, onBack }) => {
  const { showToast } = useToast();
  const printRef = useRef<HTMLDivElement>(null);
  const [queryId, setQueryId] = useState(initialRegId || 'COL26-SPT-001001');
  const [searchedReg, setSearchedReg] = useState<Registration | undefined>(() => store.getRegistrationById(queryId));

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const found = store.getRegistrationById(queryId.trim());
    if (found) {
      setSearchedReg(found);
      showToast(`Pass retrieved for ${found.participant_name}`, 'success');
    } else {
      showToast(`Registration ID "${queryId}" not found.`, 'error');
    }
  };

  const handleBackNavigation = () => {
    if (window.history.length > 1 && document.referrer) {
      window.history.back();
    } else {
      onBack();
    }
  };

  const event: EventItem | undefined = searchedReg ? store.getEventById(searchedReg.event_id) : undefined;

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    if (!searchedReg) return;
    const svgEl = printRef.current?.querySelector('svg');
    if (!svgEl) {
      showToast('Printing digital pass...', 'info');
      window.print();
      return;
    }

    try {
      const svgData = new XMLSerializer().serializeToString(svgEl);
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        canvas.width = 440;
        canvas.height = 620;
        if (ctx) {
          ctx.fillStyle = '#0F2317';
          ctx.fillRect(0, 0, canvas.width, canvas.height);

          ctx.fillStyle = '#065F46';
          ctx.fillRect(0, 0, canvas.width, 100);

          ctx.fillStyle = '#FFF8E7';
          ctx.font = 'bold 24px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('COLORIDO 2K26', canvas.width / 2, 45);

          ctx.fillStyle = '#EDD97A';
          ctx.font = 'bold 12px sans-serif';
          ctx.fillText(`PASS ID: ${searchedReg.registration_id}`, canvas.width / 2, 75);

          ctx.fillStyle = '#FFFFFF';
          ctx.font = 'bold 20px sans-serif';
          ctx.fillText(searchedReg.participant_name, canvas.width / 2, 140);

          ctx.fillStyle = '#34D399';
          ctx.font = '13px sans-serif';
          ctx.fillText(searchedReg.participant_college, canvas.width / 2, 165);

          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(120, 190, 200, 200);

          ctx.drawImage(img, 140, 200, 160, 160);

          ctx.fillStyle = '#050E08';
          ctx.font = 'bold 10px monospace';
          ctx.fillText('AUTHORIZED GATE SCAN', canvas.width / 2, 376);

          ctx.fillStyle = '#0A1A0E';
          ctx.fillRect(35, 410, 370, 160);

          ctx.fillStyle = '#FFF8E7';
          ctx.font = 'bold 14px sans-serif';
          ctx.textAlign = 'left';
          ctx.fillText(`Discipline: ${event?.event_name || searchedReg.event_id}`, 50, 436);

          ctx.fillStyle = '#34D399';
          ctx.font = '12px sans-serif';
          ctx.fillText(`Venue: ${event?.venue || 'Campus Enclave'}`, 50, 462);

          ctx.fillStyle = '#EDD97A';
          ctx.fillText(`Date: ${event ? new Date(event.event_date).toLocaleDateString() : 'Festival Day'}`, 50, 488);

          ctx.fillStyle = '#10B981';
          ctx.font = 'bold 12px sans-serif';
          const payText = searchedReg.payment_status === 'free' ? 'PAYMENT: FREE ENTRY' : `PAYMENT: PAID (₹${searchedReg.payment_amount ?? (event?.registration_fee || 0)})`;
          ctx.fillText(payText, 50, 514);

          ctx.fillStyle = '#94A3B8';
          ctx.font = '11px sans-serif';
          ctx.fillText(`Status: ${searchedReg.status.toUpperCase()} | Pass ID: ${searchedReg.registration_id}`, 50, 540);
        }

        canvas.toBlob((blob) => {
          if (!blob) {
            window.print();
            return;
          }
          const blobUrl = URL.createObjectURL(blob);
          const downloadLink = document.createElement('a');
          downloadLink.href = blobUrl;
          downloadLink.download = `COLORIDO_2K26_PASS_${searchedReg.registration_id}.png`;
          document.body.appendChild(downloadLink);
          downloadLink.click();
          document.body.removeChild(downloadLink);
          URL.revokeObjectURL(blobUrl);
          URL.revokeObjectURL(svgUrl);
          showToast(`Pass image downloaded: COLORIDO_2K26_PASS_${searchedReg.registration_id}.png`, 'success');
        }, 'image/png');
      };

      const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
      const svgUrl = URL.createObjectURL(svgBlob);
      img.src = svgUrl;
    } catch (err) {
      showToast('Opening print dialog...', 'info');
      window.print();
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={handleBackNavigation}
          className="inline-flex items-center space-x-2 text-xs font-bold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        {/* Pass ID lookup */}
        <form onSubmit={handleSearch} className="flex items-center space-x-2">
          <input
            type="text"
            value={queryId}
            onChange={e => setQueryId(e.target.value)}
            placeholder="Enter Registration ID..."
            className="bg-[#0A1A0E] border border-festival-border rounded-xl px-3 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-festival-gold"
          />
          <button
            type="submit"
            className="px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-semibold text-white transition-colors"
          >
            Lookup
          </button>
        </form>
      </div>

      {searchedReg ? (
        <div
          ref={printRef}
          className="max-w-md mx-auto bg-gradient-to-b from-[#0F2317] to-[#0A1A0E] border-2 border-festival-emerald/40 rounded-3xl overflow-hidden shadow-2xl text-white relative print:border-black print:bg-white print:text-black"
        >
          {/* Festival Top Header */}
          <div className="bg-gradient-to-r from-festival-emerald-deep via-festival-emerald to-festival-teal p-6 text-center relative overflow-hidden">
            <div className="flex items-center justify-center space-x-2 mb-1">
              <Sparkles className="w-5 h-5 text-festival-gold" />
              <h2 className="font-display font-black text-2xl tracking-wider text-white">COLORIDO 2K26</h2>
            </div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-festival-cream">
              Official Festival Participant Credential
            </p>
            <div className="mt-2 inline-block px-3 py-0.5 rounded-full bg-black/30 backdrop-blur-md text-xs font-mono font-bold text-festival-gold border border-festival-border">
              PASS ID: {searchedReg.registration_id}
            </div>
          </div>

          {/* Pass Body */}
          <div className="p-6 space-y-6">
            <div className="text-center space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Participant Name</span>
              <h3 className="text-xl font-bold text-white tracking-wide">{searchedReg.participant_name}</h3>
              <p className="text-xs text-festival-emerald-light font-medium">{searchedReg.participant_college}</p>
              {searchedReg.team_name && (
                <div className="inline-block mt-1 px-2.5 py-0.5 rounded-md bg-white/5 border border-festival-border text-xs text-festival-champagne font-semibold">
                  Team: {searchedReg.team_name} ({searchedReg.team_size} members)
                </div>
              )}
            </div>

            {/* QR Code Presentation */}
            <div className="flex flex-col items-center justify-center bg-white p-4 rounded-2xl shadow-inner mx-auto w-52">
              <QRCodeSVG
                value={`COL26:${searchedReg.registration_id}:${searchedReg.event_id}:${searchedReg.participant_name}`}
                size={160}
                level="H"
                includeMargin={false}
              />
              <span className="text-[9px] font-mono text-slate-800 font-bold mt-2 uppercase tracking-widest">
                Authorized Gate Scan
              </span>
            </div>

            {/* Event Specific Info */}
            <div className="bg-[#050E08] rounded-2xl p-4 border border-festival-border space-y-2 text-xs">
              <div className="flex justify-between items-center pb-2 border-b border-festival-border">
                <span className="text-slate-400">Discipline:</span>
                <span className="font-bold text-festival-cream text-right">{event?.event_name || searchedReg.event_id}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-festival-border">
                <span className="text-slate-400">Category:</span>
                <span className="font-bold uppercase text-festival-gold">{event?.category || 'Competition'}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-festival-border">
                <span className="text-slate-400">Date:</span>
                <span className="font-bold text-slate-200">
                  {event ? new Date(event.event_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Festival Day'}
                </span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-festival-border">
                <span className="text-slate-400">Time:</span>
                <span className="font-bold text-slate-200">
                  {event ? `${event.start_time.slice(0, 5)} - ${event.end_time.slice(0, 5)}` : '09:00 - 17:00'}
                </span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-festival-border">
                <span className="text-slate-400">Venue:</span>
                <span className="font-bold text-festival-emerald-light text-right">{event?.venue || 'Campus Enclave'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Payment Clearance:</span>
                <span className={`font-bold px-2 py-0.5 rounded text-[10px] ${
                  searchedReg.payment_status === 'free'
                    ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30'
                    : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                }`}>
                  {searchedReg.payment_status === 'free' ? 'FREE ENTRY' : `PAID (₹${searchedReg.payment_amount ?? (event?.registration_fee || 0)})`}
                </span>
              </div>
              {searchedReg.payment_transaction_id && (
                <div className="flex justify-between items-center pt-1 border-t border-festival-border/50">
                  <span className="text-slate-400">UTR Ref:</span>
                  <span className="font-mono text-[10px] text-festival-gold font-bold">{searchedReg.payment_transaction_id}</span>
                </div>
              )}
            </div>

            {/* Verification Status */}
            <div className="flex items-center justify-between text-xs px-2 text-slate-400">
              <div className="flex items-center space-x-1.5">
                <ShieldCheck className="w-4 h-4 text-festival-emerald" />
                <span>Status: <strong className="text-festival-emerald capitalize">{searchedReg.status.replace('_', ' ')}</strong></span>
              </div>
              <span className="text-[10px]">Non-Transferable</span>
            </div>
          </div>

          {/* Action Footer */}
          <div className="p-4 bg-[#050E08] border-t border-festival-border grid grid-cols-2 gap-3 print:hidden">
            <button
              onClick={handlePrint}
              className="flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold transition-colors"
            >
              <Printer className="w-4 h-4 text-festival-gold" />
              <span>Print Pass</span>
            </button>
            <button
              onClick={handleDownload}
              className="btn-emerald flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl text-xs font-bold shadow-lg transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Save Pass</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center py-16 text-slate-400 text-xs">
          Registration not found. Enter a valid Registration ID like `COL26-SPT-001001` or `COL26-CUL-001002`.
        </div>
      )}
    </div>
  );
};
