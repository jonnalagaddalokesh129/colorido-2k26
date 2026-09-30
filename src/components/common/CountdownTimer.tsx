import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface Props {
  targetDate?: string;
}

interface ItemProps {
  label: string;
  value: number;
}

const CountdownCard: React.FC<ItemProps> = ({ label, value }) => {
  const [animating, setAnimating] = useState(false);
  const prevValueRef = useRef(value);

  useEffect(() => {
    if (prevValueRef.current !== value) {
      setAnimating(true);
      const timer = setTimeout(() => setAnimating(false), 380);
      prevValueRef.current = value;
      return () => clearTimeout(timer);
    }
  }, [value]);

  return (
    <div 
      className="p-3 sm:p-5 text-center relative overflow-hidden transition-all duration-300 hover:border-[#FF1493]/60 group"
      style={{
        background: 'rgba(10, 4, 25, 0.88)',
        border: '1px solid rgba(216, 180, 254, 0.35)',
        boxShadow: '0 12px 40px rgba(91, 33, 245, 0.18)',
        borderRadius: '18px',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)'
      }}
    >
      {/* Subtle top gloss reflection */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#D8B4FE]/30 to-transparent pointer-events-none" />

      {/* High-Contrast Large Number (#7C3AED with subtle Dragon Fruit glow) */}
      <motion.span 
        animate={animating ? { scale: [1.0, 1.08, 1.0] } : { scale: 1.0 }}
        transition={{ duration: 0.38, ease: 'easeInOut' }}
        className="font-display font-black text-3xl sm:text-5xl lg:text-6xl block select-none"
        style={{
          color: '#7C3AED',
          textShadow: '0 0 18px rgba(124, 58, 237, 0.4), 0 0 35px rgba(255, 20, 147, 0.25)',
          lineHeight: 1.1
        }}
      >
        {String(value).padStart(2, '0')}
      </motion.span>

      {/* High-Contrast Dragon Fruit Label (#FF1493) */}
      <span 
        className="text-[10px] sm:text-xs font-bold block mt-1.5 uppercase select-none tracking-wider"
        style={{
          color: '#FF1493',
          letterSpacing: '0.08em',
          textShadow: '0 0 10px rgba(255, 20, 147, 0.4)'
        }}
      >
        {label}
      </span>
    </div>
  );
};

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
      const minutes = Math.floor((difference / (1000 * 60)) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    calculate();
    const interval = setInterval(calculate, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  return (
    <div className="grid grid-cols-4 gap-2.5 sm:gap-4 max-w-xl mx-auto px-2">
      <CountdownCard label="DAYS" value={timeLeft.days} />
      <CountdownCard label="HOURS" value={timeLeft.hours} />
      <CountdownCard label="MINUTES" value={timeLeft.minutes} />
      <CountdownCard label="SECONDS" value={timeLeft.seconds} />
    </div>
  );
};
