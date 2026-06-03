import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const HeartBackground: React.FC = () => {
  const [hearts, setHearts] = useState<{ id: number; size: number; left: number; duration: number; delay: number }[]>([]);

  useEffect(() => {
    const generatedHearts = Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      size: Math.random() * 24 + 12, // 12px to 36px
      left: Math.random() * 100,
      duration: Math.random() * 15 + 10, // 10s to 25s
      delay: Math.random() * 10, // 0 to 10s
    }));
    setHearts(generatedHearts);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 bg-gradient-to-t from-emerald-100 to-emerald-50">
      {hearts.map((heart) => (
        <motion.div
          key={heart.id}
          initial={{ y: '110vh', opacity: 0, rotate: 0 }}
          animate={{
            y: '-10vh',
            opacity: [0, 0.8, 0.8, 0],
            x: [0, Math.random() * 100 - 50, Math.random() * 100 - 50],
            rotate: [0, Math.random() * 360],
          }}
          transition={{
            duration: heart.duration,
            delay: heart.delay,
            ease: 'linear',
            repeat: Infinity,
          }}
          className="absolute text-emerald-300 drop-shadow-sm"
          style={{
            left: `${heart.left}%`,
            fontSize: `${heart.size}px`,
            filter: 'blur(1px)'
          }}
        >
          {heart.id % 3 === 0 ? '✨' : '💚'}
        </motion.div>
      ))}
    </div>
  );
};

export default HeartBackground;
