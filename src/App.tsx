import React, { useState, useRef, useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Music, Pause, Leaf } from 'lucide-react';
import HeartBackground from './components/HeartBackground';
import { Canvas } from '@react-three/fiber';
import { Ring3D } from './components/Ring3D';

const App = () => {
  const [stage, setStage] = useState<'opening' | 'transition' | 'letter'>('opening');
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // You can replace this URL with any romantic royalty-free piano music (e.g. Clair de Lune)
    audioRef.current = new Audio('https://cdn.pixabay.com/download/audio/2022/05/16/audio_03df8993f4.mp3?filename=clair-de-lune-113217.mp3');
    audioRef.current.loop = true;
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const toggleMusic = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(e => console.log('Audio play error:', e));
    }
    setIsPlaying(!isPlaying);
  };

  const handleRingClick = () => {
    setStage('transition');
    if (audioRef.current) {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(e => console.log('Audio play error:', e));
    }
    setTimeout(() => {
      setStage('letter');
    }, 1500);
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden font-sans text-slate-800">
      <HeartBackground />
      
      {/* Music Toggle */}
      {stage !== 'opening' && (
        <motion.button
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="absolute top-4 right-4 z-50 p-3 bg-white/30 backdrop-blur-md rounded-full shadow-lg border border-white/40 text-emerald-500 hover:bg-white/50 transition-all hover:scale-110"
          onClick={toggleMusic}
        >
          {isPlaying ? <Pause size={24} /> : <Music size={24} />}
        </motion.button>
      )}

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-4">
        <AnimatePresence mode="wait">
          {stage === 'opening' && (
            <motion.div
              key="opening"
              exit={{ opacity: 0, scale: 2, filter: 'blur(20px)' }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              className="flex flex-col items-center justify-center cursor-pointer group"
              onClick={handleRingClick}
            >
              <motion.div
                animate={{ 
                  scale: [1, 1.05, 1],
                  boxShadow: [
                    "0 0 20px 5px rgba(16, 185, 129, 0.3)",
                    "0 0 60px 20px rgba(16, 185, 129, 0.6)",
                    "0 0 20px 5px rgba(16, 185, 129, 0.3)"
                  ]
                }}
                transition={{ 
                  duration: 3, 
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="w-64 h-64 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-sm mb-8 relative transition-transform duration-500 group-hover:scale-105"
              >
                <div className="absolute inset-0 w-full h-full pointer-events-none">
                  <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
                    <Suspense fallback={null}>
                      <Ring3D modelPath="/ring.glb" />
                    </Suspense>
                  </Canvas>
                </div>
              </motion.div>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ 
                  opacity: [0.6, 1, 0.6], 
                  y: 0,
                  scale: [0.98, 1.02, 0.98]
                }}
                transition={{ 
                  opacity: { duration: 2, repeat: Infinity, ease: "easeInOut" },
                  scale: { duration: 2, repeat: Infinity, ease: "easeInOut" },
                  y: { delay: 0.5, duration: 1 }
                }}
                className="font-dancing text-3xl md:text-4xl text-emerald-600 text-center drop-shadow-md"
              >
                Tap on this ring...
              </motion.p>
            </motion.div>
          )}

          {stage === 'letter' && (
            <motion.div
              key="letter"
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 1.2, ease: "easeOut", type: "spring", bounce: 0.3 }}
              className="relative w-full max-w-2xl bg-gradient-to-br from-white/95 to-emerald-50/95 backdrop-blur-md rounded-3xl shadow-2xl border border-white/60 p-6 md:p-10 overflow-hidden"
            >
              {/* Decorative corners */}
              <div className="absolute top-4 left-4 text-emerald-200/50"><Leaf size={32} strokeWidth={1.5} /></div>
              <div className="absolute top-4 right-4 text-emerald-200/50 scale-x-[-1]"><Leaf size={32} strokeWidth={1.5} /></div>
              <div className="absolute bottom-4 left-4 text-emerald-200/50 scale-y-[-1]"><Leaf size={32} strokeWidth={1.5} /></div>
              <div className="absolute bottom-4 right-4 text-emerald-200/50 rotate-180"><Leaf size={32} strokeWidth={1.5} /></div>

              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="text-center mb-8 relative z-10"
              >
                <h1 className="font-dancing text-4xl md:text-6xl text-emerald-600 mb-4 drop-shadow-sm">Happy 3 Months</h1>
                <div className="flex items-center justify-center gap-3">
                  <div className="w-16 h-[2px] bg-gradient-to-r from-transparent to-emerald-200 rounded-full"></div>
                  <Leaf size={18} className="text-emerald-400" />
                  <div className="w-16 h-[2px] bg-gradient-to-l from-transparent to-emerald-200 rounded-full"></div>
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 1 }}
                className="relative z-10 font-playfair text-lg md:text-xl leading-relaxed text-slate-700 h-[50vh] overflow-y-auto letter-scroll pr-4 space-y-6"
              >
                <p>
                  <span className="float-left text-5xl md:text-6xl text-emerald-500 font-dancing pr-2 pt-1 leading-none drop-shadow-sm">T</span>
                  o my beautiful Kristine,
                </p>
                <p>
                  Happy 3-month anniversary!
                </p>
                <p>
                  Today, I wanted to write something a little different for you. When I look back at the last 90 days, I just smile. It is amazing how much my world has changed since you came into it.
                </p>
                <p>
                  Before you, my days were just normal routines. Now, you are the favorite part of my everyday life. We are building our story day by day, step by step, and every new memory we make together is so precious to me.
                </p>
                <p>
                  I love how comfortable I feel with you. I love our long talks, our silly jokes, and the quiet moments when we just sit next to each other. You have this sweet way of making everything feel warm and safe. Whenever I am tired, just seeing your smile makes everything better. You are so kind, so caring, and so patient with me. Knowing that I have you by my side gives me so much strength.
                </p>
                <p>
                  Three months down, and we have so many more to go. I am so excited to keep creating beautiful things and happy memories with you. I promise to always be the man who holds your hand, listens to your heart, and makes you feel loved every single day.
                </p>
                <p>
                  Thank you for being you, Kristine. I love you so much.
                </p>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.5, duration: 0.8 }}
                className="relative z-10 mt-8 pt-6 border-t border-emerald-100/50 text-right font-dancing text-3xl md:text-4xl text-emerald-600"
              >
                <p>Yours always,</p>
                <p className="mt-2 text-2xl md:text-3xl text-emerald-700">nguyễn thành phú love you.</p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default App;
