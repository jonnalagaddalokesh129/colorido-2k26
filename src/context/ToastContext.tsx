import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastItem {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType, duration?: number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const showToast = useCallback((message: string, type: ToastType = 'info', duration = 4000) => {
    const id = `toast_${Date.now()}_${Math.random()}`;
    setToasts(prev => [...prev, { id, message, type }]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Toast container portal */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col space-y-3 max-w-md w-full px-4 pointer-events-none">
        {toasts.map(toast => {
          let bgColor = 'bg-slate-900 border-slate-700 text-white';
          let Icon = Info;
          let iconColor = 'text-sky-400';

          if (toast.type === 'success') {
            bgColor = 'bg-emerald-950/90 border-emerald-500/40 text-emerald-100';
            Icon = CheckCircle2;
            iconColor = 'text-emerald-400';
          } else if (toast.type === 'error') {
            bgColor = 'bg-rose-950/90 border-rose-500/40 text-rose-100';
            Icon = AlertCircle;
            iconColor = 'text-rose-400';
          } else if (toast.type === 'warning') {
            bgColor = 'bg-amber-950/90 border-amber-500/40 text-amber-100';
            Icon = AlertTriangle;
            iconColor = 'text-amber-400';
          } else {
            bgColor = 'bg-indigo-950/90 border-indigo-500/40 text-indigo-100';
            Icon = Info;
            iconColor = 'text-indigo-400';
          }

          return (
            <div
              key={toast.id}
              className={`pointer-events-auto flex items-start space-x-3 p-4 rounded-xl border backdrop-blur-md shadow-2xl transition-all duration-300 transform translate-y-0 animate-in fade-in slide-in-from-bottom-5 ${bgColor}`}
            >
              <Icon className={`w-5 h-5 mt-0.5 flex-shrink-0 ${iconColor}`} />
              <p className="text-sm font-medium flex-1 leading-snug">{toast.message}</p>
              <button
                onClick={() => removeToast(toast.id)}
                className="text-slate-400 hover:text-white transition-colors p-1 -mr-1"
                aria-label="Dismiss notification"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
