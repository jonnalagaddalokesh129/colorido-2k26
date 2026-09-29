import React, { useRef, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { X, Printer, Download, Award, Sparkles, CheckCircle2 } from 'lucide-react';
import { CertificateItem } from '../../types/database';
import { useToast } from '../../context/ToastContext';

interface Props {
  certificate: CertificateItem;
  isOpen: boolean;
  onClose: () => void;
}

export const CertificateModal: React.FC<Props> = ({ certificate, isOpen, onClose }) => {
  const { showToast } = useToast();
  const certRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    try {
      const canvas = document.createElement('canvas');
      canvas.width = 1200;
      canvas.height = 850;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        window.print();
        return;
      }

      // Background
      ctx.fillStyle = '#FCFCFA';
      ctx.fillRect(0, 0, 1200, 850);

      // Gold Outer Border
      ctx.strokeStyle = '#D97706';
      ctx.lineWidth = 16;
      ctx.strokeRect(20, 20, 1160, 810);

      // Gold Inner Border
      ctx.strokeStyle = '#B45309';
      ctx.lineWidth = 4;
      ctx.strokeRect(40, 40, 1120, 770);

      // Header Text
      ctx.textAlign = 'center';
      ctx.fillStyle = '#0F172A';
      ctx.font = 'bold 38px sans-serif';
      ctx.fillText('COLORIDO 2K26', 600, 110);

      ctx.fillStyle = '#92400E';
      ctx.font = 'bold 15px sans-serif';
      ctx.fillText('NATIONAL LEVEL CULTURAL & SPORTS FESTIVAL', 600, 145);

      // Divider Line
      ctx.strokeStyle = '#D97706';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(400, 175);
      ctx.lineTo(800, 175);
      ctx.stroke();

      // Certificate Type
      ctx.fillStyle = '#78350F';
      ctx.font = 'italic bold 32px serif';
      ctx.fillText(certificate.certificate_type, 600, 230);

      ctx.fillStyle = '#64748B';
      ctx.font = 'bold 14px sans-serif';
      ctx.fillText('THIS IS TO PROUDLY CERTIFY THAT', 600, 280);

      // Participant Name
      ctx.fillStyle = '#0F172A';
      ctx.font = 'bold 44px serif';
      ctx.fillText(certificate.participant_name, 600, 350);

      // College
      ctx.fillStyle = '#475569';
      ctx.font = 'bold 20px sans-serif';
      ctx.fillText(`of ${certificate.college}`, 600, 400);

      // Description / Achievement
      ctx.fillStyle = '#334155';
      ctx.font = '18px sans-serif';
      ctx.fillText('has exhibited exceptional skill, dedication, and sportsmanship in', 600, 460);
      ctx.fillText(`the discipline of ${certificate.event_name}, achieving ${certificate.achievement}`, 600, 495);
      ctx.fillText('during COLORIDO 2K26 held at the University Campus.', 600, 530);

      // Footer divider
      ctx.strokeStyle = '#CBD5E1';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(100, 620);
      ctx.lineTo(1100, 620);
      ctx.stroke();

      // Signatures & Details
      ctx.textAlign = 'left';
      ctx.fillStyle = '#1E1B4B';
      ctx.font = 'bold italic 22px serif';
      ctx.fillText('Dr. Arvind Sharma', 120, 680);
      ctx.fillStyle = '#64748B';
      ctx.font = '14px sans-serif';
      ctx.fillText('Festival Convener', 120, 710);

      ctx.textAlign = 'right';
      ctx.fillStyle = '#1E1B4B';
      ctx.font = 'bold italic 22px serif';
      ctx.fillText('Prof. Sunita Rao', 1080, 680);
      ctx.fillStyle = '#64748B';
      ctx.font = '14px sans-serif';
      ctx.fillText('Dean of Student Affairs', 1080, 710);

      ctx.textAlign = 'center';
      ctx.fillStyle = '#94A3B8';
      ctx.font = 'bold 12px monospace';
      ctx.fillText(`VERIFIED ID: ${certificate.certificate_id}  |  ISSUE DATE: ${certificate.issue_date}`, 600, 770);

      // Trigger download
      canvas.toBlob((blob) => {
        if (!blob) {
          window.print();
          return;
        }
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `COLORIDO_2K26_CERTIFICATE_${certificate.certificate_id}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        showToast(`Certificate saved to downloads: COLORIDO_2K26_CERTIFICATE_${certificate.certificate_id}.png`, 'success');
      }, 'image/png');

    } catch (err) {
      showToast('Opening print dialog...', 'info');
      window.print();
    }
  };

  const isWinner = certificate.certificate_type.includes('Winner');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 overflow-y-auto animate-in fade-in duration-200"
    >
      <div
        onClick={e => e.stopPropagation()}
        className="max-w-3xl w-full relative my-auto"
      >
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 text-slate-300 hover:text-white bg-white/10 hover:bg-rose-600/80 p-2.5 rounded-full transition-all shadow-lg print:hidden flex items-center space-x-1.5 px-3 text-xs font-bold"
          title="Close Certificate View (Esc)"
        >
          <X className="w-4 h-4" />
          <span className="hidden sm:inline">Close</span>
        </button>

        {/* Certificate Container */}
        <div
          ref={certRef}
          className="bg-[#FCFCFA] text-slate-900 border-8 border-amber-600/60 p-8 sm:p-12 rounded-3xl shadow-2xl relative overflow-hidden print:border-black print:m-0"
        >
          {/* Ornate Gold Border Inner Inset */}
          <div className="border-2 border-amber-500/40 p-6 sm:p-10 rounded-2xl relative flex flex-col items-center text-center">
            {/* Corner Accents */}
            <div className="absolute top-2 left-2 text-amber-600/40 font-serif text-2xl">✤</div>
            <div className="absolute top-2 right-2 text-amber-600/40 font-serif text-2xl">✤</div>
            <div className="absolute bottom-2 left-2 text-amber-600/40 font-serif text-2xl">✤</div>
            <div className="absolute bottom-2 right-2 text-amber-600/40 font-serif text-2xl">✤</div>

            {/* Crest / Header */}
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-500 to-amber-700 p-1 flex items-center justify-center shadow-lg mb-3">
              <Award className="w-9 h-9 text-white" />
            </div>

            <h1 className="font-display font-black text-2xl sm:text-3xl text-slate-900 tracking-wider">
              COLORIDO 2K26
            </h1>
            <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-amber-800 mb-6">
              National Level Cultural & Sports Festival
            </p>

            <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-amber-600 to-transparent mb-6" />

            <h2 className="text-xl sm:text-2xl font-serif italic text-amber-900 mb-3">
              {certificate.certificate_type}
            </h2>

            <p className="text-xs uppercase tracking-widest text-slate-500 mb-2">
              This is to proudly certify that
            </p>

            {/* Participant Name */}
            <h3 className="font-serif font-bold text-2xl sm:text-4xl text-slate-900 underline decoration-amber-500/40 underline-offset-8 mb-3">
              {certificate.participant_name}
            </h3>

            <p className="text-sm font-semibold text-slate-700 max-w-lg mb-4">
              of <span className="text-amber-900 font-bold">{certificate.college}</span>
            </p>

            <p className="text-xs sm:text-sm text-slate-600 max-w-xl leading-relaxed mb-8">
              has exhibited exceptional skill, dedication, and sportsmanship in the discipline of{' '}
              <strong className="text-slate-900 font-bold">{certificate.event_name}</strong>, achieving{' '}
              <span className="font-bold text-amber-900">{certificate.achievement}</span> during COLORIDO 2K26 held at the University Campus.
            </p>

            {/* Signatures & QR Section */}
            <div className="w-full grid grid-cols-3 items-end pt-6 border-t border-amber-600/20 text-center gap-4">
              <div className="text-left space-y-1">
                <div className="h-8 flex items-end">
                  <span className="font-serif italic text-sm text-indigo-900 font-bold">Arvind Sharma</span>
                </div>
                <div className="border-t border-slate-400 pt-1 text-[10px] text-slate-600">
                  <p className="font-bold text-slate-900">Dr. Arvind Sharma</p>
                  <p>Festival Convener</p>
                </div>
              </div>

              {/* QR Verification Seal */}
              <div className="flex flex-col items-center">
                <div className="p-1.5 bg-white border border-amber-500/40 rounded-lg shadow-sm">
                  <QRCodeSVG value={`COLORIDO-CERT:${certificate.certificate_id}:${certificate.participant_name}`} size={64} />
                </div>
                <span className="text-[8px] font-mono text-slate-500 mt-1 uppercase font-bold">
                  {certificate.certificate_id}
                </span>
              </div>

              <div className="text-right space-y-1">
                <div className="h-8 flex items-end justify-end">
                  <span className="font-serif italic text-sm text-indigo-900 font-bold">Sunita Rao</span>
                </div>
                <div className="border-t border-slate-400 pt-1 text-[10px] text-slate-600">
                  <p className="font-bold text-slate-900">Prof. Sunita Rao</p>
                  <p>Dean of Student Affairs</p>
                </div>
              </div>
            </div>

            {/* Verification Footer */}
            <div className="mt-6 text-[9px] font-mono text-slate-400">
              Digitally verified by COLORIDO 2K26 Academic Secretariat • Issue Date: {certificate.issue_date}
            </div>
          </div>
        </div>

        {/* Modal Controls */}
        <div className="mt-4 flex justify-between items-center print:hidden">
          <span className="text-xs text-slate-400 font-mono">
            Unique Verification Hash: {certificate.verification_hash.slice(0, 24)}...
          </span>
          <div className="flex space-x-3">
            <button
              onClick={handlePrint}
              className="flex items-center space-x-2 py-2 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>Print Official Certificate</span>
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center space-x-2 py-2 px-4 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white text-xs font-bold shadow-lg transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Download PDF</span>
            </button>
            <button
              onClick={onClose}
              className="flex items-center space-x-1.5 py-2 px-4 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 hover:text-white text-xs font-bold transition-colors border border-rose-500/30"
            >
              <X className="w-4 h-4" />
              <span>Close</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
