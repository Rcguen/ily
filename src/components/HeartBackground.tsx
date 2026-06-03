import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const HeartBackground: React.FC = () => {
  const [particles, setParticles] = useState<{ id: number; size: number; left: number; duration: number; delay: number; type: 'heart' | 'firefly' }[]>([]);

  useEffect(() => {
    // Reduce number to 40 for performance, mix of hearts and fireflies
    const items = Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      size: i % 3 === 0 ? Math.random() * 20 + 10 : Math.random() * 4 + 2, // Hearts are 10-30px, fireflies 2-6px
      left: Math.random() * 100,
      duration: Math.random() * 10 + 15, // Slow float 15-25s
      delay: Math.random() * 10,
      type: i % 3 === 0 ? 'heart' as const : 'firefly' as const
    }));
    setParticles(items);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-950 via-slate-950 to-black">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute bottom-[-10%]"
          initial={{ y: '0vh', x: 0, opacity: 0, rotate: 0 }}
          animate={{
            y: '-120vh',
            x: [0, Math.random() * 100 - 50, 0],
            opacity: [0, p.type === 'heart' ? 0.3 : 0.8, 0],
            rotate: p.type === 'heart' ? [0, 180] : 0
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: 'linear'
          }}
          style={{ left: `${p.left}%` }}
        >
          {p.type === 'heart' ? (
            <svg width={p.size} height={p.size} viewBox="0 0 24 24" fill="rgba(52, 211, 153, 0.4)" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
          ) : (
            <div 
              className="rounded-full bg-emerald-200 blur-[1px]" 
              style={{ width: p.size, height: p.size, boxShadow: '0 0 10px 2px rgba(52, 211, 153, 0.6)' }}
            />
          )}
        </motion.div>
      ))}
      
      {/* Subtle overlay to blend the bottom */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
    </div>
  );
};

export default HeartBackground;
