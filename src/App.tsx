import React, { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "motion/react";
import { 
  Heart, 
  MapPin, 
  Calendar, 
  Clock, 
  Sparkles, 
  ChevronDown, 
  ExternalLink,
  Info
} from "lucide-react";
import EnvelopeEntrance from "./components/EnvelopeEntrance";
import ScratchCard from "./components/ScratchCard";
import WishesSection from "./components/WishesSection";
import GallerySection from "./components/GallerySection";
import MusicPlayer from "./components/MusicPlayer";
import { PetalRain, ProphetDuaCard, SwayingLantern } from "./components/IslamicLoveDecor";

export default function App() {
  const [isEnvelopeOpened, setIsEnvelopeOpened] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isMuted, setIsMuted] = useState(false);

  // Audio configuration & fallback direct URLs
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const currentCandidateIndexRef = useRef(0);
  const isEnvelopeOpenedRef = useRef(false);

  const AUDIO_CANDIDATES = [
    "/bg-music.mp3",
    "https://archive.org/download/BeautifulNasheed/06%20-%20Mawlaya%20Salli.mp3",
    "https://archive.org/download/no-music-nasheeds/04%20-%20Hasbi%20Rabbi.mp3",
    "https://archive.org/download/no-music-nasheeds/02%20-%20Ya%20Taybah.mp3"
  ];

  useEffect(() => {
    isEnvelopeOpenedRef.current = isEnvelopeOpened;
  }, [isEnvelopeOpened]);

  // Pre-instantiate the Audio element safely
  useEffect(() => {
    const audio = new Audio(AUDIO_CANDIDATES[0]);
    audio.loop = true;
    audio.volume = 0.45;
    audio.muted = isMuted;

    const handleError = () => {
      // Only switch candidate if the envelope has been opened
      if (!isEnvelopeOpenedRef.current) {
        return;
      }
      console.warn("Audio load error on candidate index " + currentCandidateIndexRef.current + ". Attempting fallback...");
      if (currentCandidateIndexRef.current < AUDIO_CANDIDATES.length - 1) {
        currentCandidateIndexRef.current += 1;
        audio.src = AUDIO_CANDIDATES[currentCandidateIndexRef.current];
        audio.load();
        audio.play().catch(e => console.log("Playback failed for fallback candidate:", e));
      }
    };

    audio.addEventListener("error", handleError);
    audioRef.current = audio;

    return () => {
      audio.removeEventListener("error", handleError);
      audio.pause();
      audioRef.current = null;
    };
  }, []);

  // Synchronize muted state whenever user toggles
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = isMuted;
    }
  }, [isMuted]);

  // Synchronously play audio within user gesture click stack for perfect browser compatibility
  const handlePlayMusicOnReveal = () => {
    if (audioRef.current) {
      // Force reload the /bg-music.mp3 source to capture the updated file in the public folder
      audioRef.current.src = AUDIO_CANDIDATES[0];
      audioRef.current.load();
      audioRef.current.play().catch((err) => {
        console.warn("Autoplay or play call blocked by browser:", err);
      });
    }
  };

  const toggleMute = () => {
    setIsMuted((prev) => {
      const nextMuted = !prev;
      if (audioRef.current) {
        audioRef.current.muted = nextMuted;
        if (!nextMuted) {
          audioRef.current.play().catch((err) => {
            console.warn("Play on unmute failed:", err);
          });
        } else {
          audioRef.current.pause();
        }
      }
      return nextMuted;
    });
  };

  // References for parallax scrolling effects
  const heroRef = useRef<HTMLDivElement>(null);
  const messageSleeveRef = useRef<HTMLDivElement>(null);

  // 1. Hero Scroll Transformations (Smooth Title Scaling & Background Dim)
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 1000], [0, 180]);
  const heroScale = useTransform(scrollY, [0, 1000], [1, 0.95]);
  const heroOpacity = useTransform(scrollY, [0, 800], [1, 0]);

  // 2. Invitation Message Sliding Out of Envelope Sleeve on Scroll
  const { scrollYProgress: envelopeScrollYProgress } = useScroll({
    target: messageSleeveRef,
    offset: ["start 0.9", "end 0.55"],
  });

  // flap opens up and back first
  const flapRotate = useTransform(envelopeScrollYProgress, [0, 0.4], [0, -165]);
  // then the letter rises up out of the envelope opening (in px, masked)
  const letterY = useTransform(envelopeScrollYProgress, [0.18, 1], [400, -74]);

  // 3. Photo Parallax is handled dynamically within GallerySection

  // 4. Background scroll-linked parallax elements for subtle 3D depth
  const decoY1 = useTransform(scrollY, [0, 1000], [0, -120]);
  const decoY2 = useTransform(scrollY, [0, 2500], [0, 180]);
  const decoY3 = useTransform(scrollY, [0, 4000], [0, -150]);
  const decoY4 = useTransform(scrollY, [0, 5000], [0, 100]);

  // Live Countdown Timer to 26 July 2026
  useEffect(() => {
    const targetDate = new Date("July 26, 2026 00:00:00").getTime();

    const updateCountdown = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div id="microsite-root" className="min-h-screen paper-texture text-[#FCFAF6] font-sans relative overflow-x-hidden antialiased">
      
      {/* 1. Fullscreen Wax-Sealed Envelope Entrance Overlay */}
      <EnvelopeEntrance 
        onOpen={() => setIsEnvelopeOpened(true)} 
        onOpenStart={handlePlayMusicOnReveal} 
      />

      {/* Main Content (Visible under the envelope but scroll-blocked/non-interactive until opened) */}
      <div 
        id="main-invitation-site" 
        className={`transition-all duration-1000 ${isEnvelopeOpened ? "opacity-100 blur-0 pointer-events-auto" : "opacity-0 blur-md pointer-events-none h-screen overflow-hidden"}`}
      >
        {/* Music background play controller */}
        <MusicPlayer 
          isMuted={isMuted} 
          toggleMute={toggleMute} 
          isEnvelopeOpened={isEnvelopeOpened} 
        />

        {/* Falling Petals and Gold Hearts Ambiance */}
        {isEnvelopeOpened && <PetalRain />}
        
        {/* Subtle global decorative gold frame on edges */}
        <div className="fixed inset-3 md:inset-6 border border-[#C2A289]/15 rounded-2xl pointer-events-none z-40" />
        <div className="fixed inset-4 md:inset-7 border border-[#C2A289]/5 rounded-2xl pointer-events-none z-40" />

        {/* Floating Background Parallax Ornaments */}
        <motion.div 
          style={{ y: decoY1 }}
          className="absolute left-[5%] top-[120vh] text-[#C2A289]/15 pointer-events-none z-0 hidden lg:block select-none"
        >
          <svg width="120" height="120" viewBox="0 0 100 100" fill="currentColor">
            <path d="M50 0 C60 30, 90 40, 100 50 C90 60, 60 70, 50 100 C40 70, 10 60, 0 50 C10 40, 40 30, 50 0 Z" />
          </svg>
        </motion.div>
        <motion.div 
          style={{ y: decoY2 }}
          className="absolute right-[8%] top-[240vh] text-[#C2A289]/12 pointer-events-none z-0 hidden lg:block select-none"
        >
          <svg width="160" height="160" viewBox="0 0 100 100" fill="currentColor">
            <path d="M50 15 C55 35, 75 45, 95 50 C75 55, 55 65, 50 85 C45 65, 25 55, 5 50 C25 45, 45 35, 50 15 Z" />
          </svg>
        </motion.div>
        <motion.div 
          style={{ y: decoY3 }}
          className="absolute left-[6%] top-[360vh] text-[#C2A289]/15 pointer-events-none z-0 hidden lg:block select-none"
        >
          <svg width="140" height="140" viewBox="0 0 100 100" fill="currentColor">
            <path d="M50 5 L55 35 L85 40 L58 55 L65 85 L50 65 L35 85 L42 55 L15 40 L45 35 Z" />
          </svg>
        </motion.div>
        <motion.div 
          style={{ y: decoY4 }}
          className="absolute right-[5%] top-[480vh] text-[#C2A289]/12 pointer-events-none z-0 hidden lg:block select-none"
        >
          <svg width="130" height="130" viewBox="0 0 100 100" fill="currentColor">
            <path d="M50 0 C60 30, 90 40, 100 50 C90 60, 60 70, 50 100 C40 70, 10 60, 0 50 C10 40, 40 30, 50 0 Z" />
          </svg>
        </motion.div>

        {/* --- HERO SECTION --- */}
        <div 
          ref={heroRef}
          id="hero-section"
          className="relative min-h-screen flex flex-col justify-center items-center px-6 text-center overflow-hidden border-b border-[#DCD0C0]/50"
        >
          {/* Parallax Background */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
            <motion.img 
              src="/WhatsApp Image 2026-06-26 at 20.08.33.jpeg" 
              alt="Wedding Celebration Background" 
              className="w-full h-[130%] object-cover absolute left-0 object-[52%_50%] md:object-[50%_50%]"
              style={{ 
                y: useTransform(scrollY, [0, 1000], ["-3%", "12%"]), 
                opacity: 0.85 
              }}
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="absolute inset-0 islamic-pattern opacity-[0.03]" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#021a10]/15 via-[#021a10]/45 to-[#021a10]/90" />

          {/* Golden Arch Accent Line */}
          <motion.div 
            className="w-24 h-24 mb-6 border-t border-l border-r border-[#C2A289]/30 rounded-t-full flex items-center justify-center relative opacity-80"
            initial={{ opacity: 0, y: 30 }}
            animate={isEnvelopeOpened ? { opacity: 0.8, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.3 }}
          >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[#C2A289] text-lg">
              ✦
            </div>
            {/* Glowing dot */}
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-[#C2A289] rounded-full shadow-md shadow-[#C2A289]/40" />
          </motion.div>

          <motion.div 
            style={{ scale: heroScale, opacity: heroOpacity }}
            className="max-w-3xl z-10 space-y-4"
          >
            {/* Floral Golden Divider */}
            <div className="flex items-center justify-center gap-4 my-8">
              <div className="h-[1px] w-12 md:w-20 bg-gradient-to-r from-transparent to-[#C2A289]/40" />
              <span className="text-[#C2A289] text-xs">✿</span>
              <div className="h-[1px] w-12 md:w-20 bg-gradient-to-l from-transparent to-[#C2A289]/40" />
            </div>

            {/* Wedding celebration tag */}
            <span className="block font-sans text-[10px] md:text-xs tracking-[0.25em] text-[#A68F80] font-semibold uppercase">
              THE WEDDING CELEBRATION OF
            </span>

            {/* Couples Names Display */}
            <h1 className="font-cinzel text-4xl sm:text-5xl md:text-6xl font-normal text-[#ebd89b] py-2 leading-tight tracking-wide">
              Mohammed Saleem
            </h1>
            
            <p className="font-serif italic text-lg md:text-xl text-[#C2A289] my-1">
              &
            </p>

            <h1 className="font-cinzel text-4xl sm:text-5xl md:text-6xl font-normal text-[#ebd89b] py-2 leading-tight tracking-wide">
              Dhilshana Suman
            </h1>

            {/* Subtle separator */}
            <div className="py-6 flex justify-center items-center">
              <div className="w-1 h-1 rounded-full bg-[#DCD0C0] mx-1" />
              <div className="w-1.5 h-1.5 rounded-full bg-[#C2A289] mx-1 shadow-sm" />
              <div className="w-1 h-1 rounded-full bg-[#DCD0C0] mx-1" />
            </div>
          </motion.div>

          {/* Bounce Down Indicator */}
          <motion.div 
            className="absolute bottom-10 z-10 flex flex-col items-center gap-1.5 cursor-pointer opacity-70 hover:opacity-100 transition-opacity"
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            onClick={() => {
              document.getElementById("interactive-date-section")?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            <span className="font-sans text-[9px] tracking-widest uppercase text-[#C2A289] font-semibold">
              Scroll down to reveal invite
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-[#C2A289]" />
          </motion.div>
        </div>


        {/* --- SECTION: LIVE COUNTDOWN & DATE CARDS --- */}
        <section 
          id="interactive-date-section"
          className="relative py-20 px-6 max-w-5xl mx-auto space-y-16"
        >
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="text-center space-y-2"
          >
            <span className="font-sans text-[10px] font-bold tracking-[0.3em] text-[#C2A289] uppercase block">
              SAVE THE DATE
            </span>
            <h2 className="font-cinzel text-2xl md:text-3xl font-bold text-[#EBD89B]">
              Scratch to Reveal the Date
            </h2>
          </motion.div>

          {/* 3 Interactive Scratch Cards */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid grid-cols-3 gap-3 sm:gap-6"
          >
            <ScratchCard label="Wedding Day" value="26" hint="Scratch Day" />
            <ScratchCard label="Wedding Month" value="JULY" hint="Scratch Month" />
            <ScratchCard label="Wedding Year" value="2026" hint="Scratch Year" />
          </motion.div>

          {/* Countdown timer container */}
          <motion.div 
            id="countdown-timer" 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="bg-[#032b1a]/40 border border-[#C2A289]/25 rounded-2xl p-8 max-w-3xl mx-auto relative overflow-hidden shadow-[0_15px_30px_rgba(0,0,0,0.15)] backdrop-blur-sm"
          >
            <div className="absolute inset-0 islamic-pattern opacity-[0.04]" />
            
            <div className="relative z-10 text-center space-y-6">
              <div className="flex items-center justify-center gap-2">
                <Clock className="w-3.5 h-3.5 text-[#C2A289]" />
                <span className="font-sans text-[10px] font-semibold tracking-widest text-[#C2A289] uppercase">
                  TIME REMAINING UNTIL THE UNION
                </span>
              </div>

              {/* Countdown Grid */}
              <div className="grid grid-cols-4 gap-3 sm:gap-6 max-w-xl mx-auto">
                {/* Days */}
                <div className="bg-[#021a10]/50 border border-[#C2A289]/20 shadow-inner rounded-xl p-3 sm:p-5 flex flex-col justify-center items-center">
                  <span className="font-mono text-2xl sm:text-3xl font-bold text-[#ebd89b]">
                    {timeLeft.days.toString().padStart(2, "0")}
                  </span>
                  <span className="font-sans text-[9px] font-semibold text-[#FCFAF6]/80 tracking-wider uppercase mt-1">
                    Days
                  </span>
                </div>

                {/* Hours */}
                <div className="bg-[#021a10]/50 border border-[#C2A289]/20 shadow-inner rounded-xl p-3 sm:p-5 flex flex-col justify-center items-center">
                  <span className="font-mono text-2xl sm:text-3xl font-bold text-[#ebd89b]">
                    {timeLeft.hours.toString().padStart(2, "0")}
                  </span>
                  <span className="font-sans text-[9px] font-semibold text-[#FCFAF6]/80 tracking-wider uppercase mt-1">
                    Hours
                  </span>
                </div>

                {/* Minutes */}
                <div className="bg-[#021a10]/50 border border-[#C2A289]/20 shadow-inner rounded-xl p-3 sm:p-5 flex flex-col justify-center items-center">
                  <span className="font-mono text-2xl sm:text-3xl font-bold text-[#ebd89b]">
                    {timeLeft.minutes.toString().padStart(2, "0")}
                  </span>
                  <span className="font-sans text-[9px] font-semibold text-[#FCFAF6]/80 tracking-wider uppercase mt-1">
                    Mins
                  </span>
                </div>

                {/* Seconds */}
                <div className="bg-[#021a10]/50 border border-[#C2A289]/20 shadow-inner rounded-xl p-3 sm:p-5 flex flex-col justify-center items-center">
                  <span className="font-mono text-2xl sm:text-3xl font-bold text-[#ebd89b]">
                    {timeLeft.seconds.toString().padStart(2, "0")}
                  </span>
                  <span className="font-sans text-[9px] font-semibold text-[#FCFAF6]/80 tracking-wider uppercase mt-1">
                    Secs
                  </span>
                </div>
              </div>

            </div>
          </motion.div>
        </section>

        {/* --- PROPHET'S WEDDING DUA CARD --- */}
        <section className="px-6 relative z-10">
          <ProphetDuaCard />
        </section>


        {/* --- SECTION: ENVELOPE SCROLL REVEAL MESSAGE --- */}
        <section 
          id="scroll-envelope-section"
          className="relative overflow-hidden bg-gradient-to-b from-[#032b1a] via-[#021a10] to-[#032b1a] pt-14 pb-20 border-t border-b border-[#C2A289]/25"
        >
          <div className="mx-auto max-w-3xl px-6 text-center select-none">
            <p className="font-sans text-xs uppercase tracking-[0.4em] text-[#C2A289]">
              A Note From The Couple
            </p>
            <h2 className="mt-3 font-cinzel text-3xl sm:text-4xl text-[#ebd89b] font-semibold tracking-wide">
              Our Invitation
            </h2>
            <span className="font-serif italic text-xs tracking-wider text-[#FCFAF6]/70 block mt-1">Scroll to open the envelope</span>
          </div>

          {/* tall track gives the letter scroll room to rise */}
          <div ref={messageSleeveRef} className="relative mx-auto mt-4 h-[660px] w-full max-w-md px-4 sm:px-6">
            {/* envelope pinned to the bottom of the track */}
            <div
              className="absolute bottom-0 left-1/2 h-[300px] w-full max-w-[310px] xs:max-w-[350px] sm:max-w-[400px] md:max-w-md -translate-x-1/2"
              style={{ perspective: "1600px" }}
            >
              {/* Back panel (Layer 1) */}
              <div 
                className="absolute inset-0 z-0 rounded-lg shadow-2xl ring-1 ring-[#C2A289]/30"
                style={{
                  background: "#021a10",
                }}
              />

              {/* Flap (Layer 3 - opens upward/back, sits behind the letter) */}
              <motion.div
                aria-hidden
                style={{ rotateX: flapRotate, transformStyle: "preserve-3d" }}
                className="absolute left-0 top-0 z-10 w-full origin-top"
              >
                <div
                  className="h-[160px] w-full relative"
                  style={{
                    background:
                      "linear-gradient(170deg, #0d6340, #032b1a)",
                    clipPath: "polygon(0 0, 100% 0, 50% 100%)",
                    boxShadow: "0 4px 8px rgba(0,0,0,0.3)",
                    backfaceVisibility: "visible",
                  }}
                >
                  {/* Gold double line details inside outer flap face */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <path d="M 5,3 L 95,3 L 50,92 Z" fill="none" stroke="#C2A289" strokeWidth="0.5" opacity="0.45" />
                  </svg>
                </div>
              </motion.div>

              {/* Invitation Letter inside Mask (Layer 2) */}
              <div
                className="absolute inset-x-0 -top-[320px] bottom-[88px] z-20 overflow-hidden"
              >
                <motion.div
                  className="absolute bottom-0 left-1/2 w-[92%] max-w-sm -translate-x-1/2 rounded-md p-4 shadow-2xl ring-1 ring-[#C2A289]/30 sm:p-6"
                  style={{
                    y: letterY,
                    background: "linear-gradient(to bottom, #FCFAF6, #FFFDF9, #FCFAF6)",
                  }}
                >
                  {/* Parchment texture overlay */}
                  <div className="absolute inset-0 bg-[url('/paper_texture.png')] opacity-25 mix-blend-multiply pointer-events-none rounded-md" />

                  <div className="relative rounded-sm border border-[#C2A289]/40 px-3 py-4 text-center sm:px-5 sm:py-5">
                    {/* Decorative Scroll Corners */}
                    <div className="absolute top-2 left-2 w-2 h-2 border-t border-l border-[#C2A289]/50 pointer-events-none" />
                    <div className="absolute top-2 right-2 w-2 h-2 border-t border-r border-[#C2A289]/50 pointer-events-none" />
                    <div className="absolute bottom-2 left-2 w-2 h-2 border-b border-l border-[#C2A289]/50 pointer-events-none" />
                    <div className="absolute bottom-2 right-2 w-2 h-2 border-b border-r border-[#C2A289]/50 pointer-events-none" />

                    <p className="font-serif italic text-xl text-[#b8861c] sm:text-2xl">Bismillah</p>
                    <p className="mt-2 font-cinzel text-[9px] sm:text-[10px] tracking-wider uppercase text-[#A68F80]">
                      In the Name of Allah
                    </p>
                    
                    <p className="mt-3 font-serif text-xs leading-relaxed text-[#063e26] sm:text-sm">
                      We warmly invite you to celebrate the wedding of
                    </p>
                    <p className="mt-2 font-serif text-sm sm:text-base font-semibold text-[#0d6340]">
                      Mohammed Saleem <br />
                      <span className="text-xs font-normal text-[#8C7A6B]">&amp;</span> <br />
                      Dhilshana Suman
                    </p>
                    
                    <span className="mx-auto mt-3 block h-px w-12 bg-[#C2A289]/30" />
                    <p className="mt-2 font-serif italic text-xs text-[#0d6340]">
                      Please join us in your prayers.
                    </p>
                  </div>
                </motion.div>
              </div>

              {/* Front pocket (Layer 4 - always in front, letter tucks behind it) */}
              <div
                aria-hidden
                className="absolute bottom-0 left-0 z-30 h-[178px] w-full overflow-hidden rounded-b-lg pointer-events-none"
              >
                <div
                  className="h-full w-full relative"
                  style={{
                    background:
                      "linear-gradient(180deg, #0d6340, #032b1a)",
                    clipPath: "polygon(0 34%, 50% 0, 100% 34%, 100% 100%, 0 100%)",
                    boxShadow: "inset 0 2px 10px rgba(0,0,0,0.3)",
                  }}
                >
                  {/* Decorative inner patterned lattice */}
                  <div className="absolute inset-0 bg-[radial-gradient(#C2A289_1px,transparent_1px)] [background-size:12px_12px] opacity-[0.03]" />
                  
                  {/* Gold borders along pocket cut */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <path d="M 0,34 L 50,0 L 100,34" fill="none" stroke="#C2A289" strokeWidth="0.8" opacity="0.5" />
                  </svg>
                </div>
              </div>

            </div>
          </div>
        </section>


        {/* --- SECTION: PHOTO GALLERY WITH PARALLAX --- */}
        <section id="gallery-section" className="py-24 px-6 max-w-6xl mx-auto">

          {/* Dynamically connected to Firestore database with real-time sync */}
          <GallerySection />
        </section>


        {/* --- SECTION: EVENT DETAILS & MAP --- */}
        <section 
          id="event-details-section"
          className="relative py-24 px-6 overflow-hidden"
        >
          {/* Subtle floral background highlight */}
          <div className="absolute inset-0 islamic-pattern opacity-[0.06]" />

          {/* Elegant Hanging Oriental Lanterns */}
          <SwayingLantern top="-40px" left="10%" size={50} delay={0.2} />
          <SwayingLantern top="-40px" right="10%" size={50} delay={0.9} />

          <div className="max-w-5xl mx-auto space-y-12 relative z-10">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className="text-center space-y-2"
            >
              <span className="font-sans text-[10px] font-bold tracking-[0.3em] text-[#C2A289] uppercase block">
                VENUE & VENUE GUIDE
              </span>
              <h2 className="font-cinzel text-2xl md:text-3xl font-bold text-[#EBD89B]">
                Celebration Details
              </h2>
              <p className="font-serif italic text-[#E8E2D5] text-xs sm:text-sm max-w-md mx-auto leading-relaxed">
                Join us for the reception and blessings at the magnificent Diamond Auditorium.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
              
              {/* Venue details cards */}
              <motion.div 
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, delay: 0.15 }}
                className="lg:col-span-5 flex flex-col gap-6"
              >
                
                {/* Card 1: Venue Name & Address */}
                <div id="venue-info-card" className="bg-[#032b1a]/40 border border-[#C2A289]/25 rounded-2xl p-6 shadow-[0_15px_30px_rgba(0,0,0,0.15)] backdrop-blur-sm flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#C2A289]/10 flex items-center justify-center text-[#ebd89b] shrink-0">
                    <MapPin className="w-4.5 h-4.5" />
                  </div>
                  <div className="space-y-1.5">
                    <h4 className="font-cinzel text-[10px] font-bold tracking-wider text-[#C2A289] uppercase">
                      Venue Name & Location
                    </h4>
                    <p className="font-serif font-bold text-base text-[#FCFAF6]">
                      Diamond Auditorium
                    </p>
                    <p className="font-sans text-xs text-[#E8E2D5] leading-relaxed">
                      Puthuparamba Rd, Chudalappara, Kuttippala, Puthuparambu Town, Kerala 676501
                    </p>
                  </div>
                </div>

                {/* Card 2: Date & Time Card */}
                <div id="date-info-card" className="bg-[#032b1a]/40 border border-[#C2A289]/25 rounded-2xl p-6 shadow-[0_15px_30px_rgba(0,0,0,0.15)] backdrop-blur-sm flex gap-4 flex-grow">
                  <div className="w-10 h-10 rounded-full bg-[#C2A289]/10 flex items-center justify-center text-[#ebd89b] shrink-0">
                    <Calendar className="w-4.5 h-4.5" />
                  </div>
                  <div className="space-y-1.5">
                    <h4 className="font-cinzel text-[10px] font-bold tracking-wider text-[#C2A289] uppercase">
                      Date & Time of Ceremony
                    </h4>
                    <p className="font-serif font-bold text-base text-[#ebd89b]">
                      26 July 2026 • 12:00 PM
                    </p>
                    <p className="font-sans text-xs text-[#E8E2D5] leading-relaxed">
                      Sunday, 26th July 2026 at 12:00 PM • Insha'Allah. Please join us for the grand feast.
                    </p>
                  </div>
                </div>

              </motion.div>

              {/* Map Box */}
              <motion.div 
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, delay: 0.15 }}
                className="lg:col-span-7 bg-[#032b1a]/40 border border-[#C2A289]/25 rounded-2xl p-4 shadow-[0_15px_30px_rgba(0,0,0,0.15)] backdrop-blur-sm flex flex-col gap-4"
              >
                {/* Embed Map Frame */}
                <div id="map-frame-wrapper" className="w-full h-80 rounded-xl overflow-hidden relative border border-[#C2A289]/30 shadow-inner bg-[#021a10]/50">
                  <iframe
                    src="https://maps.google.com/maps?q=11.0163123,75.9756875&t=&z=15&ie=UTF8&iwloc=&output=embed"
                    width="100%"
                    height="100%"
                    style={{ border: 0, filter: "contrast(1.05) brightness(0.98) grayscale(0.05)" }}
                    allowFullScreen={true}
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    title="Diamond Auditorium Location Map"
                  />
                </div>

                {/* Open in Google Maps Button */}
                <a
                  href="https://www.google.com/maps/dir//Diamond+Auditorium,+Puthuparamba+Rd,+Chudalappara,+Kuttippala,+Puthuparambu+Town,+Kerala+676501/@11.1527694,75.8882503,4485m/data=!3m1!1e3!4m8!4m7!1m0!1m5!1m1!1s0x3ba64cb383d3ad53:0x632f6e9296c4f57d!2m2!1d75.9756875!2d11.0163123?entry=ttu&g_ep=EgoyMDI2MDYyNC4wIKXMDSoASAFQAw%3D%3D"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full relative overflow-hidden py-4 bg-[#C2A289] hover:bg-[#B8861C] text-[#021a10] rounded-xl font-cinzel text-xs font-bold tracking-widest transition-all duration-150 flex items-center justify-center gap-2 shadow-sm"
                >
                  <span>OPEN IN GOOGLE MAPS</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </motion.div>

            </div>
          </div>
        </section>


        {/* --- SECTION: GUEST WISHES BOARD --- */}
        <section id="wishes-section" className="py-24 px-6 max-w-6xl mx-auto space-y-12">
          <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className="text-center space-y-2"
            >
              <span className="font-sans text-[10px] font-bold tracking-[0.3em] text-[#C2A289] uppercase block">
                CONGRATULATIONS
              </span>
              <h2 className="font-cinzel text-2xl md:text-3xl font-bold text-[#EBD89B]">
                Blessings & Du'as
              </h2>
              <p className="font-serif italic text-[#E8E2D5] text-xs sm:text-sm max-w-md mx-auto leading-relaxed">
                Please leave your congratulatory wishes and prayers for our marital life.
              </p>
            </motion.div>

          <WishesSection />
        </section>


        {/* --- FOOTER SECTION --- */}
        <footer id="footer-section" className="relative py-16 px-6 text-center border-t border-[#C2A289]/20">
          <div className="absolute inset-0 islamic-pattern opacity-[0.03]" />
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="max-w-xl mx-auto space-y-4 relative z-10"
          >
            {/* Elegant Golden Calligraphy Ornament */}
            <div className="text-[#C2A289] text-sm">✦ ✿ ✦</div>
            
            <h3 className="font-decorative text-xl font-bold text-[#ebd89b]">
              Saleem & Dhilshana
            </h3>

            <p className="font-serif italic text-xs text-[#E8E2D5] leading-relaxed">
              We look forward to welcoming you and celebrating this joyous day with you and your family. May Allah bless you always.
            </p>

            <div className="h-[1px] w-24 bg-[#C2A289]/20 mx-auto my-4" />

            <p className="font-mono text-[9px] tracking-wider text-[#C2A289] uppercase">
              JULY 26, 2026 • DIAMOND AUDITORIUM PUTHUPARAMBA
            </p>
          </motion.div>
        </footer>

      </div>
    </div>
  );
}
