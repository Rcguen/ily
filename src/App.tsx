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
    audioRef.current = new Audio('./music.m4a');
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
      
      {/* Background Brightening Overlay (Turns completely bright) */}
      <motion.div 
        className="absolute inset-0 pointer-events-none z-0 bg-gradient-to-br from-emerald-100 via-emerald-200 to-emerald-400"
        initial={{ opacity: 0 }}
        animate={{ opacity: stage !== 'opening' ? 1 : 0 }}
        transition={{ duration: 2, ease: "easeInOut" }}
      />

      {/* Vintage Botanical Decorations (Visible in Letter Stage) */}
      <AnimatePresence>
        {stage !== 'opening' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2 }}
            className="absolute inset-0 pointer-events-none z-0 overflow-hidden flex items-center justify-center"
          >
            {/* Top Left Leaf */}
            <motion.div 
              className="absolute -top-10 -left-10 text-emerald-800/10"
              animate={{ rotate: [0, 5, 0] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            >
              <Leaf size={350} strokeWidth={0.5} />
            </motion.div>
            
            {/* Bottom Right Leaf */}
            <motion.div 
              className="absolute -bottom-20 -right-20 text-emerald-800/10 scale-x-[-1] scale-y-[-1]"
              animate={{ rotate: [0, -5, 0] }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            >
              <Leaf size={450} strokeWidth={0.5} />
            </motion.div>

            {/* Top Right small leaf */}
            <motion.div 
              className="absolute top-20 -right-10 text-emerald-800/5 rotate-90"
              animate={{ rotate: [90, 95, 90] }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            >
              <Leaf size={250} strokeWidth={0.5} />
            </motion.div>

            {/* Bottom Left small leaf */}
            <motion.div 
              className="absolute bottom-10 -left-10 text-emerald-800/5 -rotate-90"
              animate={{ rotate: [-90, -85, -90] }}
              transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
            >
              <Leaf size={300} strokeWidth={0.5} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Flash of magical light during transition */}
      <motion.div 
        className="absolute inset-0 pointer-events-none z-10 bg-[#fdfbf7]"
        initial={{ opacity: 0 }}
        animate={{ 
          opacity: stage === 'transition' ? [0, 1, 0] : 0
        }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
      />
      
      {/* Music Toggle */}
      {stage !== 'opening' && (
        <motion.button
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="absolute top-4 right-4 z-50 p-3 bg-white/50 backdrop-blur-md rounded-full shadow-lg border border-emerald-200 text-emerald-600 hover:bg-white transition-all hover:scale-110"
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
              initial={{ opacity: 0, scale: 0.8, filter: 'blur(10px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, scale: 1.5, filter: 'blur(20px)' }}
              transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
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
                className="w-72 h-72 flex items-center justify-center rounded-full bg-slate-900/60 backdrop-blur-md border border-emerald-500/20 relative transition-transform duration-500 group-hover:scale-105 shadow-[0_0_40px_rgba(52,211,153,0.3)]"
              >
                {/* Magical Aura Effects */}
                <div className="absolute inset-0 rounded-full border border-emerald-400/30 animate-[ping_3s_cubic-bezier(0,0,0.2,1)_infinite]"></div>
                <div className="absolute -inset-4 rounded-full border border-emerald-500/30 animate-[spin_10s_linear_infinite]"></div>
                <div className="absolute -inset-8 rounded-full border-[1.5px] border-dashed border-emerald-300/20 animate-[spin_15s_linear_infinite_reverse]"></div>
                <div className="absolute -inset-12 rounded-full border-[0.5px] border-emerald-400/10 animate-[spin_20s_linear_infinite]"></div>

                <div className="absolute inset-0 w-full h-full pointer-events-none z-10">
                  <Canvas dpr={1} camera={{ position: [0, 0, 5], fov: 50 }}>
                    <Suspense fallback={<CanvasLoader />}>
                      <Ring3D modelPath="./ring.glb" scale={1.1} />
                    </Suspense>
                  </Canvas>
                </div>
              </motion.div>

              {/* Text placed OUTSIDE the ring div as a flex sibling */}
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
                className="mt-16 font-dancing text-4xl md:text-5xl text-emerald-400 text-center text-glow"
              >
                Tap on this ring...
              </motion.p>
            </motion.div>
          )}

          {stage === 'letter' && (
            <motion.div
              key="letter-container"
              className="relative w-full max-w-3xl flex justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {/* Left GIF */}
              <motion.img 
                src="https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExbDBoY2ZwcnFhbWpsNHNlZDMxc2ltNXN4cHNrOGczdXN1cjh2bnVqcSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/9xghIQ617XHnGYN3jG/giphy.gif"
                alt="Cute decoration left"
                className="hidden xl:block absolute -left-56 bottom-0 w-64 h-auto z-20 pointer-events-none"
                initial={{ opacity: 0, scale: 0.5, x: 50 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                transition={{ delay: 6.5, duration: 1.5, type: "spring", bounce: 0.4 }}
              />

              <motion.div
                className="relative w-full max-h-[90vh] flex flex-col bg-[#fdfbf7] rounded-sm p-8 md:p-12 shadow-2xl border border-[#e2dfd6] overflow-hidden z-10"
                initial={{ opacity: 0, y: 100, scale: 0.9, filter: 'blur(10px)' }}
                animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
                transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
              >
              {/* Inner border frame */}
              <div className="absolute inset-4 border-[0.5px] border-[#c2bca8] pointer-events-none rounded-sm"></div>
              
              {/* Corner ornaments */}
              <div className="absolute top-3 left-3 text-[#8b917c] bg-[#fdfbf7] p-1"><Leaf size={16} strokeWidth={1} /></div>
              <div className="absolute top-3 right-3 text-[#8b917c] bg-[#fdfbf7] p-1 scale-x-[-1]"><Leaf size={16} strokeWidth={1} /></div>
              <div className="absolute bottom-3 left-3 text-[#8b917c] bg-[#fdfbf7] p-1 scale-y-[-1]"><Leaf size={16} strokeWidth={1} /></div>
              <div className="absolute bottom-3 right-3 text-[#8b917c] bg-[#fdfbf7] p-1 rotate-180"><Leaf size={16} strokeWidth={1} /></div>

              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="text-center mb-6 relative z-10 flex flex-col items-center shrink-0"
              >
                <div className="w-full text-right font-dancing text-lg text-[#4a5d4e] mb-2">June 04, 2026</div>
                <h1 className="font-dancing text-5xl md:text-6xl text-[#2c4031] mb-6">Happy 3-Month Anniversary</h1>
                
                <div className="flex items-center justify-center gap-3 opacity-60 w-full max-w-[200px]">
                  <div className="flex-1 h-[0.5px] bg-[#2c4031]"></div>
                  <Leaf size={14} className="text-[#2c4031]" />
                  <div className="flex-1 h-[0.5px] bg-[#2c4031]"></div>
                </div>
              </motion.div>

              <motion.div 
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: { staggerChildren: 1.0, delayChildren: 0.8 }
                  }
                }}
                className="relative z-10 font-playfair italic text-lg md:text-xl leading-loose tracking-wide text-[#3a4a3e] flex-1 min-h-0 overflow-y-auto letter-scroll pr-6 space-y-6"
              >
                <motion.p variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] } } }}>
                  To my beautiful Kristine,
                </motion.p>
                <motion.p variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] } } }}>
                  Today, I wanted to write something a little different for you. When I look back at the last 90 days, I just smile. It is amazing how much my world has changed since you came into it.
                </motion.p>
                <motion.p variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] } } }}>
                  Before you, my days were just normal routines. Now, you are the favorite part of my everyday life. We are building our story day by day, step by step, and every new memory we make together is so precious to me.
                </motion.p>
                <motion.p variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] } } }}>
                  I love how comfortable I feel with you. I love our long talks, our silly jokes, and the quiet moments when we just sit next to each other. You have this sweet way of making everything feel warm and safe. Whenever I am tired, just seeing your smile makes everything better. You are so kind, so caring, and so patient with me. Knowing that I have you by my side gives me so much strength.
                </motion.p>
                <motion.p variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] } } }}>
                  Three months down, and we have so many more to go. I am so excited to keep creating beautiful things and happy memories with you. I promise to always be the man who holds your hand, listens to your heart, and makes you feel loved every single day.
                </motion.p>
                <motion.p variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] } } }}>
                  Thank you for being you, Kristine. I love you so much.
                </motion.p>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 6.8, duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                className="relative z-10 mt-6 pt-6 border-t-[0.5px] border-[#c2bca8] flex justify-between items-end shrink-0"
              >
                {/* Left: Wax Seal */}
                <div className="flex flex-col items-center gap-2">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#8b2323] to-[#4a1212] shadow-inner flex items-center justify-center border-2 border-[#a33535] relative">
                    <span className="font-playfair text-[#f4dbb2] text-2xl">P</span>
                    <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent to-white/10 pointer-events-none"></div>
                  </div>
                  <span className="font-sans text-[10px] tracking-widest text-[#8b917c] uppercase">To my love</span>
                </div>

                {/* Right: Signature */}
                <div className="text-right flex flex-col items-end">
                  <p className="font-dancing text-2xl md:text-3xl text-[#4a5d4e]">Yours always,</p>
                  <p className="font-dancing text-3xl md:text-4xl text-[#2c4031] mt-1">nguyễn thành phú</p>
                </div>
              </motion.div>
            </motion.div>

            {/* Right GIF */}
            <motion.img 
              src="https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExbDBoY2ZwcnFhbWpsNHNlZDMxc2ltNXN4cHNrOGczdXN1cjh2bnVqcSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/9xghIQ617XHnGYN3jG/giphy.gif"
              alt="Cute decoration right"
              className="hidden xl:block absolute -right-56 bottom-0 w-64 h-auto z-20 pointer-events-none scale-x-[-1]"
              initial={{ opacity: 0, scale: 0.5, x: -50 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ delay: 6.5, duration: 1.5, type: "spring", bounce: 0.4 }}
            />
          </motion.div>
        )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default App;
