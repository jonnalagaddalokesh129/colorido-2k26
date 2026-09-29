import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { X, Copy, Check, Share2, MessageCircle } from 'lucide-react';
import { EventItem } from '../../types/database';
import { useToast } from '../../context/ToastContext';

interface Props {
  event: EventItem;
  isOpen: boolean;
  onClose: () => void;
}

export const ShareModal: React.FC<Props> = ({ event, isOpen, onClose }) => {
  const { showToast } = useToast();
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const shareUrl = `${window.location.origin}/events/${event.event_id}`;
  const shareText = `🌟 Join me for ${event.event_name} at COLORIDO 2K26!\n📍 Venue: ${event.venue}\n📅 Date: ${new Date(event.event_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}\n⏰ Time: ${event.start_time.slice(0, 5)} - ${event.end_time.slice(0, 5)}\n\nRegister now: ${shareUrl}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    showToast('Event link copied to clipboard!', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsApp = () => {
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank');
  };

  const handleTwitter = () => {
    const text = `Excited for ${event.event_name} at COLORIDO 2K26! Where Talent Meets the Spotlight. #COLORIDO2K26 #UniversityFest`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(url, '_blank');
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `COLORIDO 2K26: ${event.event_name}`,
          text: shareText,
          url: shareUrl,
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      handleCopyLink();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-[#12172F] border border-festival-border rounded-2xl max-w-md w-full p-6 shadow-2xl relative text-slate-100">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-2 rounded-lg hover:bg-white/5 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 mb-5">
          <div className="p-2.5 bg-fuchsia-500/10 text-fuchsia-400 rounded-xl border border-fuchsia-500/20">
            <Share2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold">Share Event</h3>
            <p className="text-xs text-slate-400 line-clamp-1">{event.event_name}</p>
          </div>
        </div>

        {/* QR Code preview */}
        <div className="flex flex-col items-center justify-center bg-white p-4 rounded-xl mb-6 shadow-inner mx-auto w-48 h-48">
          <QRCodeSVG value={shareUrl} size={150} level="H" includeMargin={false} />
          <p className="text-[10px] text-slate-600 font-bold mt-2 uppercase tracking-wider">Scan to open event</p>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <button
            onClick={handleWhatsApp}
            className="flex items-center justify-center space-x-2 py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold shadow-md transition-all"
          >
            <MessageCircle className="w-4 h-4" />
            <span>WhatsApp</span>
          </button>
          <button
            onClick={handleTwitter}
            className="flex items-center justify-center space-x-2 py-3 px-4 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-semibold shadow-md transition-all"
          >
            <span>Twitter / X</span>
          </button>
        </div>

        {/* Copy Link input */}
        <div className="relative">
          <input
            type="text"
            readOnly
            value={shareUrl}
            className="w-full bg-[#1A2142] border border-white/10 rounded-xl py-2.5 pl-3 pr-24 text-xs text-slate-300 font-mono focus:outline-none"
          />
          <button
            onClick={handleCopyLink}
            className="absolute right-1.5 top-1.5 bottom-1.5 px-3 bg-fuchsia-600 hover:bg-fuchsia-500 text-white rounded-lg text-xs font-semibold flex items-center space-x-1 transition-all"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>

        {typeof navigator !== 'undefined' && 'share' in navigator && (
          <button
            onClick={handleNativeShare}
            className="w-full mt-3 py-2 text-xs font-medium text-slate-400 hover:text-white transition-colors"
          >
            More sharing options...
          </button>
        )}
      </div>
    </div>
  );
};
