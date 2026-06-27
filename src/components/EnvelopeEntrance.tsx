import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

interface EnvelopeEntranceProps {
  onOpen: () => void;
  onOpenStart?: () => void;
}

export default function EnvelopeEntrance({ onOpen, onOpenStart }: EnvelopeEntranceProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);

  const handleOpen = () => {
    if (isOpen) return;
    setIsOpen(true);
    
    // Trigger music or immediate actions synchronously within the user interaction click stack
    if (onOpenStart) {
      onOpenStart();
    }
    
    // Complete the reveal when the splitting panels finish sliding out
    setTimeout(() => {
      setIsRevealed(true);
      onOpen();
    }, 1400); // matches the 1.4s easeOut cubic transition
  };

  // High-fidelity paper texture from the uploaded reference image 2
  const paperTextureStyle = {
    backgroundColor: "#032b1a", // Deep emerald green fallback
    backgroundImage: `url("/paper_texture.png")`,
    backgroundBlendMode: "multiply" as const,
    backgroundSize: "cover",
    backgroundRepeat: "repeat"
  };

  return (
    <AnimatePresence>
      {!isRevealed && (
        <motion.div
          id="envelope-entrance-container"
          className="fixed inset-0 z-50 overflow-hidden"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          style={{ backgroundColor: "#021a10" }}
        >
          {/* Ambient radial lighting */}
          <div className="absolute inset-0 bg-radial from-transparent to-[#1E1214]/15 pointer-events-none z-10" />

          {/* 1. TOP HALFPANEL */}
          <motion.div
            id="envelope-panel-top"
            className="absolute top-0 left-0 right-0 h-[50vh] z-50 flex flex-col justify-end overflow-visible"
            animate={isOpen ? { y: "-100%" } : { y: 0 }}
            transition={{ duration: 1.4, ease: [0.76, 0, 0.24, 1] }}
          >
            {/* Textured top flap */}
            <div 
              className="absolute inset-0 border-b-2 border-[#C2A289]/30 shadow-[0_12px_40px_rgba(40,25,28,0.15)] overflow-hidden"
              style={paperTextureStyle}
            >
              {/* Vignette styling for authentic paper depth */}
              <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-black/5" />
              
              {/* Realistic soft paper crease shadow at edges */}
              <div className="absolute inset-x-0 bottom-0 h-4 bg-gradient-to-t from-black/5 to-transparent" />
            </div>

            {/* Hyper-realistic Golden Bronze Wax Seal & Button Container */}
            <motion.div
              id="wax-seal-button"
              className="absolute left-1/2 bottom-0 z-50 w-36 h-36 md:w-44 md:h-44 cursor-pointer select-none"
              style={{ x: "-50%", y: "50%" }}
              onClick={handleOpen}
              animate={isOpen ? { scale: 0.85, opacity: 0 } : { scale: 1, opacity: 1 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
            >
              {/* Soft warm gold ambient glow behind the seal */}
              <div className="absolute inset-0 bg-[#C29665]/25 rounded-full blur-2xl animate-pulse pointer-events-none" />

              {/* 3D Wax Seal - using the exact uploaded PNG asset, centered exactly on the split line */}
              <motion.div 
                className="w-full h-full flex items-center justify-center select-none"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <img 
                  src="/waxseal3.png" 
                  alt="Crimson Wax Seal" 
                  className="w-full h-full object-contain drop-shadow-[0_15px_30px_rgba(92,6,23,0.6)]"
                  referrerPolicy="no-referrer"
                />
              </motion.div>

              {/* Sophisticated Luxury 'Tap to Reveal' Button - cleanly positioned below the seal */}
              <motion.div 
                className="absolute top-full left-1/2 mt-4 md:mt-6 group flex flex-col items-center"
                style={{ x: "-50%" }}
                animate={{ y: [0, 4, 0] }}
                transition={{ repeat: Infinity, duration: 2.4, ease: "easeInOut" }}
              >
                {/* Radiant luxury gold border pulse glow */}
                <div className="absolute -inset-1.5 bg-gradient-to-r from-[#DFB17B] to-[#9F7243] rounded-full blur-md opacity-40 group-hover:opacity-75 transition duration-300" />
                
                <button className="relative px-6 py-2.5 md:px-8 md:py-3.5 bg-gradient-to-r from-[#946A3A] to-[#60401C] text-[#FEE2C3] border border-[#FFE1C2]/30 rounded-full font-serif text-[10px] md:text-xs tracking-[0.25em] uppercase shadow-[0_10px_30px_rgba(72,48,25,0.3)] hover:brightness-110 active:scale-95 transition-all duration-200 flex items-center gap-2 md:gap-3 whitespace-nowrap">
                  <span className="w-1 md:w-1.5 h-1 md:h-1.5 rounded-full bg-[#FEE2C3] animate-pulse" />
                  Tap to Reveal
                  <span className="w-1 md:w-1.5 h-1 md:h-1.5 rounded-full bg-[#FEE2C3] animate-pulse" />
                </button>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* 2. BOTTOM HALFPANEL */}
          <motion.div
            id="envelope-panel-bottom"
            className="absolute bottom-0 left-0 right-0 h-[50vh] z-40 flex flex-col justify-start"
            animate={isOpen ? { y: "100%" } : { y: 0 }}
            transition={{ duration: 1.4, ease: [0.76, 0, 0.24, 1] }}
          >
            {/* Textured bottom flap */}
            <div 
              className="absolute inset-0 border-t-2 border-[#C2A289]/30 shadow-[-0_-12px_40px_rgba(40,25,28,0.1)] overflow-hidden"
              style={paperTextureStyle}
            >
              {/* Vignette styling for authentic paper depth */}
              <div className="absolute inset-0 bg-gradient-to-t from-white/10 via-transparent to-black/5" />
              
              {/* Realistic soft paper crease shadow at edges */}
              <div className="absolute inset-x-0 top-0 h-4 bg-gradient-to-b from-black/5 to-transparent" />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
