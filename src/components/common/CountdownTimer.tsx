import React, { useState, useEffect } from 'react';

interface Props {
  targetDate?: string;
}

export const CountdownTimer: React.FC<Props> = ({ 
  targetDate = '2026-10-15T09:00:00' 
}) => {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculate = () => {
      const target = new Date(targetDate).getTime();
      const now = new Date().getTime();
      const difference = target - now;

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    calculate();
    const interval = setInterval(calculate, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  return (
    <div className="grid grid-cols-4 gap-2 sm:gap-4 max-w-lg mx-auto">
      {[
        { label: 'DAYS', value: timeLeft.days },
        { label: 'HOURS', value: timeLeft.hours },
        { label: 'MINUTES', value: timeLeft.minutes },
        { label: 'SECONDS', value: timeLeft.seconds }
      ].map(item => (
        <div 
          key={item.label}
          className="bg-white/90 backdrop-blur-md border border-[#006D8F]/20 rounded-2xl p-2.5 sm:p-4 text-center shadow-md group hover:border-[#20B2AA] transition-colors"
        >
          <span className="font-display font-black text-2xl sm:text-4xl text-[#064E52] block">
            {String(item.value).padStart(2, '0')}
          </span>
          <span className="text-[9px] sm:text-xs font-extrabold tracking-wider text-[#20B2AA] uppercase mt-1 block">
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
};
