import { useState, useRef, useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Music, Pause, Leaf } from 'lucide-react';
import HeartBackground from './components/HeartBackground';
import { Canvas } from '@react-three/fiber';
import { Html, useProgress } from '@react-three/drei';
import { Ring3D } from './components/Ring3D';

function CanvasLoader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className="flex flex-col items-center justify-center space-y-3">
        <div className="w-10 h-10 border-2 border-emerald-500/20 border-t-emerald-400 rounded-full animate-spin shadow-[0_0_15px_rgba(52,211,153,0.3)]"></div>
        <span className="text-emerald-400 font-dancing text-2xl text-glow">{progress.toFixed(0)}%</span>
      </div>
    </Html>
  );
}

const App = () => {
  const [stage, setStage] = useState<'opening' | 'transition' | 'letter'>('opening');
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // You can replace this URL with any romantic royalty-free piano music (e.g. Clair de Lune)
    audioRef.current = new Audio('./music.mp3');
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
    <div className="relative min-h-screen w-full overflow-hidden font-sans text-slate-800 bg-slate-950">
      <HeartBackground />
      
      {/* Background Brightening Overlay (Turns on after clicking the ring) */}
      <motion.div 
        className="absolute inset-0 pointer-events-none z-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-300/30 via-emerald-800/10 to-transparent mix-blend-screen"
        initial={{ opacity: 0 }}
        animate={{ opacity: stage !== 'opening' ? 1 : 0 }}
        transition={{ duration: 2, ease: "easeInOut" }}
      />

      {/* Flash of magical light during transition */}
      <motion.div 
        className="absolute inset-0 pointer-events-none z-10 bg-emerald-50"
        initial={{ opacity: 0 }}
        animate={{ 
          opacity: stage === 'transition' ? [0, 0.4, 0] : 0
        }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
      />
      
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
                  scale: [1, 1.05, 1]
                }}
                transition={{ 
                  duration: 4, 
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="w-72 h-72 flex items-center justify-center rounded-full bg-slate-900/60 backdrop-blur-md border border-emerald-500/20 mb-8 relative transition-transform duration-500 group-hover:scale-105 shadow-[0_0_40px_rgba(52,211,153,0.3)]"
              >
                <div className="absolute inset-0 w-full h-full pointer-events-none">
                  <Canvas dpr={1} camera={{ position: [0, 0, 5], fov: 50 }}>
                    <Suspense fallback={<CanvasLoader />}>
                      <Ring3D modelPath="./ring.glb" />
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
                className="font-dancing text-4xl md:text-5xl text-emerald-400 text-center text-glow"
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
              className="relative w-full max-w-3xl glass-panel rounded-3xl p-8 md:p-12 overflow-hidden"
            >
              {/* Decorative corners */}
              <div className="absolute top-4 left-4 text-emerald-500/40"><Leaf size={32} strokeWidth={1} /></div>
              <div className="absolute top-4 right-4 text-emerald-500/40 scale-x-[-1]"><Leaf size={32} strokeWidth={1} /></div>
              <div className="absolute bottom-4 left-4 text-emerald-500/40 scale-y-[-1]"><Leaf size={32} strokeWidth={1} /></div>
              <div className="absolute bottom-4 right-4 text-emerald-500/40 rotate-180"><Leaf size={32} strokeWidth={1} /></div>

              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="text-center mb-8 relative z-10"
              >
                <h1 className="font-dancing text-4xl md:text-6xl text-emerald-400 mb-4 text-glow">Happy 3 Months</h1>
                <div className="flex items-center justify-center gap-3 opacity-70">
                  <div className="w-16 h-[1px] bg-gradient-to-r from-transparent to-emerald-400 rounded-full"></div>
                  <Leaf size={18} className="text-emerald-400" />
                  <div className="w-16 h-[1px] bg-gradient-to-l from-transparent to-emerald-400 rounded-full"></div>
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 1 }}
                className="relative z-10 font-playfair text-lg md:text-xl leading-relaxed text-slate-200 h-[50vh] overflow-y-auto letter-scroll pr-4 space-y-6"
              >
                <p>
                  <span className="float-left text-6xl md:text-7xl text-emerald-400 font-dancing pr-3 pt-2 leading-none text-glow">T</span>
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
                className="relative z-10 mt-8 pt-6 border-t border-emerald-500/20 text-right font-dancing text-3xl md:text-4xl text-emerald-400 opacity-90"
              >
                <p>Yours always,</p>
                <p className="mt-2 text-2xl md:text-3xl text-emerald-300">nguyễn thành phú love you.</p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default App;
