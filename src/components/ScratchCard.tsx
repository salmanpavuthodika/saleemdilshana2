import React, { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

interface ScratchCardProps {
  label: string; // e.g. "DAY", "MONTH", "YEAR"
  value: string; // e.g. "27", "JULY", "2026"
  hint?: string; // e.g. "Scratch here"
}

export default function ScratchCard({ label, value, hint = "Scratch" }: ScratchCardProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas dimensions based on container bounding box
    const resizeCanvas = () => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (rect) {
        canvas.width = rect.width;
        canvas.height = rect.height;
        drawFoil(ctx, rect.width, rect.height);
      }
    };

    // Draw the clean, elegant gradient scratch foil layer
    const drawFoil = (context: CanvasRenderingContext2D, w: number, h: number) => {
      // Create a smooth, modern linear gradient from top-left to bottom-right
      const gradient = context.createLinearGradient(0, 0, w, h);
      gradient.addColorStop(0, "#EADDC9");   // Elegant light champagne gold
      gradient.addColorStop(0.5, "#D8C3A5"); // Warm beige gold
      gradient.addColorStop(1, "#C2A289");   // Signature warm taupe gold

      context.fillStyle = gradient;
      context.fillRect(0, 0, w, h);

      // Add a very subtle, clean border matching the overall card border style
      context.strokeStyle = "rgba(194, 162, 137, 0.2)";
      context.lineWidth = 1.5;
      context.strokeRect(4, 4, w - 8, h - 8);

      // Write a beautiful, clean scratch instruction text in a minimalist style
      const fontSize = w < 110 ? "8px" : w < 150 ? "9px" : "10px";
      context.font = `bold ${fontSize} 'Cinzel', 'Playfair Display', serif`;
      context.fillStyle = "#032b1a";
      context.textAlign = "center";
      context.textBaseline = "middle";
      
      const textToDisplay = hint.toUpperCase().split("").join(" ");
      context.fillText(textToDisplay, w / 2, h / 2);
    };

    resizeCanvas();

    // Resize listener
    window.addEventListener("resize", resizeCanvas);
    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [hint]);

  // Handle Scratching action
  const getMousePos = (e: MouseEvent | TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    
    // Support both mouse and touch events
    let clientX = 0;
    let clientY = 0;
    if ("touches" in e) {
      if (e.touches.length === 0) return null;
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
  };

  const scratch = (x: number, y: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.save();
    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(x, y, 22, 0, Math.PI * 2, false); // Scratch circle diameter
    ctx.fill();
    ctx.restore();

    checkScratchPercentage();
  };

  // Sample pixels to see if enough is scratched away (e.g. 40%)
  const checkScratchPercentage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    
    // Sample a small 10x10 grid for performance instead of loading the full image data
    let transparentCount = 0;
    const gridX = 10;
    const gridY = 10;
    const stepX = width / gridX;
    const stepY = height / gridY;

    for (let i = 0; i < gridX; i++) {
      for (let j = 0; j < gridY; j++) {
        const x = Math.floor(i * stepX + stepX / 2);
        const y = Math.floor(j * stepY + stepY / 2);
        const pixel = ctx.getImageData(x, y, 1, 1).data;
        // pixel[3] is alpha value
        if (pixel[3] === 0) {
          transparentCount++;
        }
      }
    }

    const totalSamplePoints = gridX * gridY;
    const ratio = transparentCount / totalSamplePoints;

    if (ratio >= 0.4) {
      setIsRevealed(true);
    }
  };

  // Event handlers
  const handleStart = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDrawing(true);
    const pos = getMousePos(e.nativeEvent);
    if (pos) {
      scratch(pos.x, pos.y);
    }
  };

  const handleMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || isRevealed) return;
    const pos = getMousePos(e.nativeEvent);
    if (pos) {
      scratch(pos.x, pos.y);
    }
  };

  const handleEnd = () => {
    setIsDrawing(false);
  };

  return (
    <div
      aria-hidden={false}
      ref={containerRef}
      id={`scratch-card-${label.toLowerCase()}`}
      className="relative w-full h-28 sm:h-40 rounded-xl bg-gradient-to-br from-[#032b1a]/90 to-[#021a10]/95 border border-[#C2A289]/25 shadow-[0_10px_25px_rgba(0,0,0,0.2)] overflow-hidden flex flex-col items-center justify-center p-2.5 sm:p-4 group select-none"
    >
      {/* Background card with the secret revealed date details */}
      <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-2 sm:p-4 z-0">
        {/* Subtle patterned background for revealed details */}
        <div className="absolute inset-0 bg-[#C2A289]/5 opacity-[0.15] islamic-pattern" />
        
        {/* Date Label */}
        <span className="font-sans text-[8px] sm:text-[10px] font-bold tracking-[0.1em] sm:tracking-[0.2em] text-[#C2A289] uppercase text-center block">
          {label}
        </span>
        
        {/* Date Revealed Value */}
        <motion.span
          className="font-cinzel font-bold text-xl sm:text-3xl md:text-5xl text-[#ebd89b] mt-1 sm:mt-2 select-text text-center block"
          initial={{ scale: 0.8 }}
          animate={isRevealed ? { scale: 1, textShadow: "0 0 10px rgba(166,143,128,0.15)" } : { scale: 0.8 }}
          transition={{ duration: 0.4 }}
        >
          {value}
        </motion.span>
        
        {/* Sparkle decorative effect */}
        {isRevealed && (
          <motion.div
            className="absolute top-2 right-2 text-[#C2A289] text-sm animate-pulse"
            initial={{ opacity: 0, rotate: -20 }}
            animate={{ opacity: 1, rotate: 0 }}
          >
            ✦
          </motion.div>
        )}
      </div>

      {/* Foil Layer Canvas Overlay */}
      <AnimatePresence>
        {!isRevealed && (
          <motion.canvas
            ref={canvasRef}
            className="scratch-canvas z-10"
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            onMouseDown={handleStart}
            onMouseMove={handleMove}
            onMouseUp={handleEnd}
            onMouseLeave={handleEnd}
            onTouchStart={handleStart}
            onTouchMove={handleMove}
            onTouchEnd={handleEnd}
          />
        )}
      </AnimatePresence>

      {/* Elegant Frame Outline on Reveal */}
      <div className="absolute inset-1.5 border border-[#E3DAC9]/40 rounded-lg pointer-events-none group-hover:border-[#C2A289]/30 transition-all duration-300" />
    </div>
  );
}
