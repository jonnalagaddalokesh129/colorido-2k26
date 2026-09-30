import React, { useEffect, useRef, useState } from 'react';
import { Camera, CameraOff, ScanLine, RefreshCw } from 'lucide-react';
import { Html5Qrcode, Html5QrcodeSupportedFormats } from 'html5-qrcode';

interface QRScannerWidgetProps {
  onScan: (code: string) => void;
}

export const QRScannerWidget: React.FC<QRScannerWidgetProps> = ({ onScan }) => {
  const [isActive, setIsActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isStarting, setIsStarting] = useState(false);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const SCANNER_ID = 'qr-scanner-container';

  const startScanner = async () => {
    setError(null);
    setIsStarting(true);

    try {
      const scanner = new Html5Qrcode(SCANNER_ID, {
        formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE],
        verbose: false,
      });
      scannerRef.current = scanner;

      const devices = await Html5Qrcode.getCameras();
      if (!devices || devices.length === 0) {
        setError('No camera found on this device.');
        setIsStarting(false);
        return;
      }

      // Prefer back camera
      const backCamera = devices.find(d =>
        d.label.toLowerCase().includes('back') ||
        d.label.toLowerCase().includes('environment')
      ) || devices[0];

      await scanner.start(
        backCamera.id,
        { fps: 10, qrbox: { width: 250, height: 250 } },
        (decodedText) => {
          // Successful scan
          onScan(decodedText);
          stopScanner();
        },
        (_errorMsg) => {
          // Frame decode errors are normal — suppress them
        }
      );

      setIsActive(true);
    } catch (err: any) {
      const msg = err?.message || String(err);
      if (msg.includes('Permission') || msg.includes('NotAllowed')) {
        setError('Camera permission denied. Please allow camera access in your browser.');
      } else if (msg.includes('NotFound') || msg.includes('DevicesNotFound')) {
        setError('No camera found on this device.');
      } else {
        setError(`Camera error: ${msg}`);
      }
    } finally {
      setIsStarting(false);
    }
  };

  const stopScanner = async () => {
    try {
      if (scannerRef.current?.isScanning) {
        await scannerRef.current.stop();
        scannerRef.current.clear();
      }
    } catch (_) {
      // ignore stop errors
    }
    scannerRef.current = null;
    setIsActive(false);
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      stopScanner();
    };
  }, []);

  return (
    <div className="space-y-3">
      {/* Camera viewport */}
      <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-[#0C1020]">
        {/* Html5Qrcode mounts its <video> here */}
        <div
          id={SCANNER_ID}
          className={`w-full ${isActive ? 'min-h-[260px]' : 'hidden'}`}
          style={{ position: 'relative' }}
        />

        {/* Idle / Error State */}
        {!isActive && (
          <div className="p-8 text-center space-y-4">
            {error ? (
              <>
                <div className="w-16 h-16 rounded-2xl bg-rose-500/15 text-rose-400 flex items-center justify-center mx-auto border border-rose-500/30">
                  <CameraOff className="w-8 h-8" />
                </div>
                <div>
                  <p className="font-bold text-sm text-rose-300">Camera Error</p>
                  <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">{error}</p>
                </div>
              </>
            ) : (
              <>
                <div className="w-16 h-16 rounded-2xl bg-fuchsia-600/20 text-fuchsia-400 flex items-center justify-center mx-auto border border-fuchsia-500/30 animate-pulse">
                  <Camera className="w-8 h-8" />
                </div>
                <div>
                  <p className="font-bold text-sm text-white">Camera Scanner</p>
                  <p className="text-xs text-slate-400 mt-0.5">Click the button below to activate your device camera</p>
                </div>
              </>
            )}
          </div>
        )}

        {/* Scanning overlay — animated scan line */}
        {isActive && (
          <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center">
            <div className="relative w-56 h-56">
              {/* Corner brackets */}
              <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-emerald-400 rounded-tl-md" />
              <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-emerald-400 rounded-tr-md" />
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-emerald-400 rounded-bl-md" />
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-emerald-400 rounded-br-md" />
              {/* Scan line */}
              <div className="absolute left-2 right-2 h-0.5 bg-emerald-400/70 shadow-[0_0_8px_2px_rgba(52,211,153,0.5)]"
                style={{ animation: 'scanLine 2s ease-in-out infinite' }}
              />
            </div>
            <p className="text-xs text-emerald-300 font-semibold mt-3 bg-black/50 px-3 py-1 rounded-full">
              Point camera at QR Code
            </p>
          </div>
        )}
      </div>

      {/* Scan line animation */}
      <style>{`
        @keyframes scanLine {
          0%   { top: 8px; }
          50%  { top: calc(100% - 8px); }
          100% { top: 8px; }
        }
      `}</style>

      {/* Control Button */}
      <button
        type="button"
        onClick={isActive ? stopScanner : startScanner}
        disabled={isStarting}
        className={`w-full py-3 rounded-xl font-bold text-xs flex items-center justify-center space-x-2 transition-all shadow-lg ${
          isActive
            ? 'bg-rose-600 hover:bg-rose-500 text-white'
            : isStarting
            ? 'bg-slate-700 text-slate-400 cursor-wait'
            : 'bg-gradient-to-r from-fuchsia-600 to-violet-600 hover:from-fuchsia-500 hover:to-violet-500 text-white'
        }`}
      >
        {isStarting ? (
          <>
            <RefreshCw className="w-4 h-4 animate-spin" />
            <span>Starting Camera…</span>
          </>
        ) : isActive ? (
          <>
            <CameraOff className="w-4 h-4" />
            <span>Stop Scanner</span>
          </>
        ) : (
          <>
            <ScanLine className="w-4 h-4" />
            <span>{error ? 'Retry Camera Scan' : 'Tap to Activate Camera Scanner'}</span>
          </>
        )}
      </button>
    </div>
  );
};
