import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Heart } from "lucide-react";

// --- 1. PROPHET'S WEDDING DUA CARD ---
export function ProphetDuaCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8 }}
      className="relative max-w-2xl mx-auto px-6 py-8 my-12 bg-[#032b1a]/40 border border-[#C2A289]/25 rounded-2xl shadow-[0_15px_30px_rgba(0,0,0,0.15)] backdrop-blur-sm text-center overflow-hidden"
    >
      {/* Delicate Islamic geometric border motif */}
      <div className="absolute inset-0 border-2 border-transparent bg-[radial-gradient(#C2A289_1px,transparent_1px)] [background-size:16px_16px] opacity-[0.05]" />
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#C2A289]/40 to-transparent" />
      <div className="absolute bottom-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#C2A289]/40 to-transparent" />

      {/* Decorative top icon */}
      <div className="relative z-10 flex justify-center mb-4 select-none">
        <span className="text-xl text-[#C2A289]">🕊️</span>
      </div>

      <div className="relative z-10 space-y-4">
        {/* Beautiful Arabic Calligraphy (Sunnah Wedding Dua) */}
        <h3 className="font-serif text-2xl md:text-3xl text-[#ebd89b] leading-loose tracking-wide font-medium select-text">
          بَارَكَ اللَّهُ لَكُمَا وَبَارَكَ عَلَيْكُمَا وَجَمَعَ بَيْنَكُمَا فِي خَيْرٍ
        </h3>

        {/* Translation */}
        <p className="font-serif italic text-sm md:text-base text-[#FCFAF6] max-w-lg mx-auto leading-relaxed">
          "May Allah bless you both, and shower His blessings upon you, and join you together in goodness."
        </p>

        <span className="block font-sans text-[9px] uppercase tracking-widest text-[#C2A289]">
          — THE PROPHET'S WEDDING DUA (SUNAN ABI DAWUD)
        </span>
      </div>
    </motion.div>
  );
}

// --- 2. PETAL RAIN / INTERACTIVE LOVE SPARKS ---
interface Petal {
  id: number;
  x: number; // percentage left
  y: number; // dynamic start offset
  size: number;
  duration: number;
  delay: number;
  rotation: number;
  spinSpeed: number;
  type: "rose" | "heart" | "sparkle";
}

export function PetalRain() {
  const [petals, setPetals] = useState<Petal[]>([]);

  // Initialize petals once
  useEffect(() => {
    const generatedPetals: Petal[] = Array.from({ length: 24 }).map((_, i) => {
      const typeRand = Math.random();
      const type = typeRand < 0.6 ? "rose" : typeRand < 0.85 ? "heart" : "sparkle";
      return {
        id: i,
        x: Math.random() * 100,
        y: -10 - Math.random() * 20,
        size: type === "rose" ? 8 + Math.random() * 14 : type === "heart" ? 6 + Math.random() * 8 : 4 + Math.random() * 4,
        duration: 12 + Math.random() * 12,
        delay: Math.random() * -20, // Start negative to stagger instantly
        rotation: Math.random() * 360,
        spinSpeed: (Math.random() > 0.5 ? 1 : -1) * (15 + Math.random() * 30),
        type,
      };
    });
    setPetals(generatedPetals);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-20">
      {petals.map((petal) => (
          <motion.div
            key={petal.id}
            initial={{ 
              y: `${petal.y}vh`, 
              x: `${petal.x}vw`, 
              rotate: petal.rotation,
              opacity: 0 
            }}
            animate={{
              y: "105vh",
              x: [
                `${petal.x}vw`,
                `${petal.x + (Math.random() > 0.5 ? 8 : -8)}vw`,
                `${petal.x + (Math.random() > 0.5 ? -4 : 4)}vw`,
                `${petal.x}vw`
              ],
              rotate: petal.rotation + 360 * (petal.spinSpeed > 0 ? 1 : -1),
              opacity: [0, 0.75, 0.75, 0]
            }}
            transition={{
              duration: petal.duration,
              repeat: Infinity,
              delay: petal.delay,
              ease: "linear",
              times: [0, 0.15, 0.85, 1]
            }}
            style={{ position: "absolute" }}
          >
            {petal.type === "rose" && (
              <svg 
                width={petal.size} 
                height={petal.size} 
                viewBox="0 0 24 24" 
                fill="none" 
                className="text-[#E8A5A5]/45 hover:text-[#E8A5A5]"
              >
                {/* Custom premium organic rose petal shape */}
                <path
                  d="M12 2C17.5 2 21 6.5 21 11.5C21 17 16.5 21.5 12 21.5C7.5 21.5 3 17 3 11.5C3 6.5 6.5 2 12 2Z"
                  fill="currentColor"
                  className="drop-shadow-[0_2px_4px_rgba(232,165,165,0.15)]"
                />
              </svg>
            )}

            {petal.type === "heart" && (
              <Heart 
                size={petal.size} 
                className="fill-[#C2A289]/15 text-[#C2A289]/25 drop-shadow-[0_1px_3px_rgba(194,162,137,0.1)]" 
              />
            )}

            {petal.type === "sparkle" && (
              <svg 
                width={petal.size} 
                height={petal.size} 
                viewBox="0 0 24 24" 
                fill="none"
              >
                <path 
                  d="M12 0C12 6.62742 17.3726 12 24 12C17.3726 12 12 17.3726 12 24C12 17.3726 6.62742 12 0 12C6.62742 12 12 6.62742 12 0Z" 
                  fill="#E6CAAB" 
                  className="opacity-45"
                />
              </svg>
            )}
          </motion.div>
        ))}
      </div>
  );
}

// --- 3. SWAYING LANTERN (ISLAMIC FANOOS) ---
interface SwayingLanternProps {
  top?: string;
  left?: string;
  right?: string;
  size?: number;
  delay?: number;
}

export function SwayingLantern({ top = "0px", left, right, size = 60, delay = 0 }: SwayingLanternProps) {
  return (
    <motion.div
      style={{
        position: "absolute",
        top,
        left,
        right,
        transformOrigin: "top center",
        zIndex: 10,
      }}
      animate={{ rotate: [-4, 4, -4] }}
      transition={{
        duration: 5,
        repeat: Infinity,
        ease: "easeInOut",
        delay,
      }}
      className="pointer-events-none select-none drop-shadow-[0_10px_20px_rgba(126,94,78,0.15)]"
    >
      {/* Supporting cord/string */}
      <div className="w-[1px] h-20 bg-gradient-to-b from-[#C2A289]/80 to-[#A8886E] mx-auto" />
      
      {/* Lantern Body SVG */}
      <svg 
        width={size} 
        height={size * 1.5} 
        viewBox="0 0 100 150" 
        className="mx-auto"
      >
        <defs>
          <radialGradient id="lantern-glow" cx="50%" cy="55%" r="35%">
            <stop offset="0%" stopColor="#FFF2D4" stopOpacity="1" />
            <stop offset="35%" stopColor="#FFD275" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#7E5E4E" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Golden/Brass Metallic frame */}
        {/* Top Loop/Ring */}
        <circle cx="50" cy="12" r="8" fill="none" stroke="#C2A289" strokeWidth="4" />
        
        {/* Dome Cap */}
        <path d="M30 35 C30 20, 70 20, 70 35 L75 42 L25 42 Z" fill="#7E5E4E" stroke="#C2A289" strokeWidth="2" />
        <path d="M50 14 L50 22" stroke="#C2A289" strokeWidth="3" />

        {/* Central Glowing Glass Chamber */}
        <path d="M28 42 L35 105 L65 105 L72 42 Z" fill="none" stroke="#C2A289" strokeWidth="3" />
        {/* Glow effect */}
        <circle cx="50" cy="72" r="28" fill="url(#lantern-glow)" />
        
        {/* Glass panes curves (Arabesque pattern) */}
        <path d="M50 42 C40 60, 40 85, 50 105" fill="none" stroke="#C2A289" strokeWidth="1.5" strokeDasharray="1,1" />
        <path d="M50 42 C60 60, 60 85, 50 105" fill="none" stroke="#C2A289" strokeWidth="1.5" strokeDasharray="1,1" />
        <path d="M28 42 C40 55, 60 55, 72 42" fill="none" stroke="#C2A289" strokeWidth="1.5" strokeDasharray="1,1" />
        <path d="M31 72 C40 80, 60 80, 69 72" fill="none" stroke="#C2A289" strokeWidth="1.5" strokeDasharray="1,1" />

        {/* Candle Flame (pulsating) */}
        <motion.path
          d="M50 65 C47 73, 46 80, 50 84 C54 80, 53 73, 50 65 Z"
          fill="#FFAA44"
          animate={{ scale: [1, 1.15, 1], opacity: [0.9, 1, 0.9] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.circle
          cx="50"
          cy="78"
          r="4"
          fill="#FFDD66"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 0.8, repeat: Infinity }}
        />

        {/* Base cap */}
        <path d="M33 105 L67 105 L63 118 L37 118 Z" fill="#7E5E4E" stroke="#C2A289" strokeWidth="2" />
        
        {/* Hanging bottom tassel / crescent */}
        <path d="M50 118 L50 132" stroke="#C2A289" strokeWidth="2.5" />
        <path d="M44 135 C44 142, 56 142, 56 135" fill="none" stroke="#C2A289" strokeWidth="2" />
        <polygon points="50,138 47,146 53,146" fill="#C2A289" />
      </svg>
    </motion.div>
  );
}

// --- 4. WEDDING STAGE DECOR BACKGROUND ---
export function StageDecor() {
  return (
    <div className="absolute inset-0 pointer-events-none select-none z-0 overflow-hidden">
      {/* 4a. Left Premium Fabric Curtain Drape (SVG curve) */}
      <svg
        className="absolute left-0 top-0 h-[80vh] md:h-screen w-36 sm:w-64 md:w-96 text-[#032b1a] fill-current drop-shadow-[5px_0_15px_rgba(0,0,0,0.3)]"
        viewBox="0 0 300 800"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="left-curtain-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#021a10" />
            <stop offset="15%" stopColor="#032b1a" />
            <stop offset="35%" stopColor="#063e26" />
            <stop offset="55%" stopColor="#0d6340" />
            <stop offset="75%" stopColor="#063e26" />
            <stop offset="90%" stopColor="#032b1a" />
            <stop offset="100%" stopColor="#ebd89b" stopOpacity="0.4" />
          </linearGradient>
        </defs>
        {/* Curving gathered fabric path */}
        <path 
          d="M 0,0 
          L 300,0 
          C 250,150 120,250 110,420 
          C 100,560 210,680 230,800 
          L 0,800 Z" 
          fill="url(#left-curtain-grad)" 
        />
        {/* Left Gold Tieback sash */}
        <path d="M 0,410 C 60,410 110,420 110,420 C 110,420 90,435 0,435 Z" fill="#C2A289" opacity="0.8" />
        {/* Golden fringe detailing on tieback */}
        <path d="M 100,420 L 105,432" stroke="#b8861c" strokeWidth="2" />
        <path d="M 103,421 L 108,431" stroke="#b8861c" strokeWidth="2" />
      </svg>

      {/* 4b. Right Premium Fabric Curtain Drape (SVG curve) */}
      <svg
        className="absolute right-0 top-0 h-[80vh] md:h-screen w-36 sm:w-64 md:w-96 text-[#032b1a] fill-current drop-shadow-[-5px_0_15px_rgba(0,0,0,0.3)]"
        viewBox="0 0 300 800"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="right-curtain-grad" x1="100%" y1="0%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#021a10" />
            <stop offset="15%" stopColor="#032b1a" />
            <stop offset="35%" stopColor="#063e26" />
            <stop offset="55%" stopColor="#0d6340" />
            <stop offset="75%" stopColor="#063e26" />
            <stop offset="90%" stopColor="#032b1a" />
            <stop offset="100%" stopColor="#ebd89b" stopOpacity="0.4" />
          </linearGradient>
        </defs>
        {/* Curving gathered fabric path */}
        <path 
          d="M 300,0 
          L 0,0 
          C 50,150 180,250 190,420 
          C 200,560 90,680 70,800 
          L 300,800 Z" 
          fill="url(#right-curtain-grad)" 
        />
        {/* Right Gold Tieback sash */}
        <path d="M 300,410 C 240,410 190,420 190,420 C 190,420 210,435 300,435 Z" fill="#C2A289" opacity="0.8" />
        {/* Golden fringe detailing on tieback */}
        <path d="M 200,420 L 195,432" stroke="#b8861c" strokeWidth="2" />
        <path d="M 197,421 L 192,431" stroke="#b8861c" strokeWidth="2" />
      </svg>

      {/* 4c. Top Stage Canopy Valance Swag with Arches */}
      <div className="absolute top-0 inset-x-0 h-16 sm:h-24 bg-gradient-to-b from-[#021a10] to-[#032b1a] border-b border-[#ebd89b]/30 shadow-lg">
        <div className="absolute inset-x-0 bottom-0 flex justify-between h-4">
          {/* Repeating arch peaks or drapes border */}
          {Array.from({ length: 15 }).map((_, i) => (
            <div 
              key={i} 
              className="flex-1 h-4 bg-[#032b1a] border-b border-r border-[#ebd89b]/20 rounded-b-full shadow-inner"
              style={{ transform: "translateY(50%)", margin: "0 -1px" }}
            />
          ))}
        </div>
        {/* Golden hanging beads/dots detail along top valance */}
        <div className="absolute -bottom-2.5 inset-x-0 flex justify-around">
          {Array.from({ length: 30 }).map((_, i) => (
            <div key={i} className="w-1 h-1 rounded-full bg-[#ebd89b] opacity-75" />
          ))}
        </div>
      </div>

      {/* 4d. Swaying Jasmine & Marigold Flower Garlands (Haras) */}
      {/* Garland 1: Left drape border */}
      <FlowerGarland left="20%" height="60%" delay={0.2} />
      {/* Garland 2: Left intermediate */}
      <FlowerGarland left="35%" height="35%" delay={1.1} />
      {/* Garland 3: Center-left */}
      <FlowerGarland left="45%" height="25%" delay={0.5} />
      {/* Garland 4: Center-right */}
      <FlowerGarland right="45%" height="25%" delay={0.8} />
      {/* Garland 5: Right intermediate */}
      <FlowerGarland right="35%" height="35%" delay={1.4} />
      {/* Garland 6: Right drape border */}
      <FlowerGarland right="20%" height="60%" delay={0.4} />

      {/* 4e. Hanging Brass Lanterns inside the stage backdrop */}
      <SwayingLantern top="-10px" left="25%" size={45} delay={0.5} />
      <SwayingLantern top="-10px" right="25%" size={45} delay={1.2} />
    </div>
  );
}

// --- 4f. FLOWER GARLAND HELPER COMPONENT ---
interface FlowerGarlandProps {
  left?: string;
  right?: string;
  height?: string;
  delay?: number;
}

function FlowerGarland({ left, right, height = "40%", delay = 0 }: FlowerGarlandProps) {
  // Staggered flowers along the thread
  const flowerCount = 12;

  return (
    <motion.div
      style={{
        position: "absolute",
        top: "40px",
        left,
        right,
        height,
        transformOrigin: "top center",
        zIndex: 5,
      }}
      animate={{ rotate: [-2, 2, -2] }}
      transition={{
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut",
        delay,
      }}
      className="hidden md:flex flex-col items-center select-none"
    >
      {/* Thin thread */}
      <div className="w-[0.5px] h-full bg-green-800/20 absolute top-0 bottom-0 left-1/2 -translate-x-1/2" />
      
      {/* Staggered Flowers (Jasmine = white/cream, Marigold = orange/yellow, Red Rose = accent) */}
      <div className="flex flex-col justify-between h-full items-center">
        {Array.from({ length: flowerCount }).map((_, idx) => {
          // Alternative orange marigold, white jasmine, golden rosebud
          const isJasmine = idx % 2 === 0;
          const isRosebud = idx === flowerCount - 1; // End with rosebud
          
          return (
            <motion.div
              key={idx}
              className="relative shrink-0"
              style={{
                width: isRosebud ? "12px" : isJasmine ? "10px" : "8px",
                height: isRosebud ? "12px" : isJasmine ? "10px" : "8px",
              }}
            >
              {isRosebud ? (
                // Crimson Rosebud
                <div className="w-3 h-3 rounded-full bg-gradient-to-br from-[#8C1B2F] to-[#5C0A17] border border-[#AA7C11]/50 shadow-sm" />
              ) : isJasmine ? (
                // White Jasmine Petal cluster
                <div className="w-2.5 h-2.5 rounded-full bg-white border border-[#E3DAC9] shadow-[0_1px_2px_rgba(0,0,0,0.05)] flex items-center justify-center">
                  <div className="w-1 h-1 rounded-full bg-yellow-100" />
                </div>
              ) : (
                // Marigold Orange/Yellow Blossom
                <div className="w-2 h-2 rounded-full bg-gradient-to-r from-amber-500 to-yellow-500 border border-amber-600/20 shadow-sm" />
              )}
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
