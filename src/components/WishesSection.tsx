import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { collection, addDoc, onSnapshot, query, orderBy, limit } from "firebase/firestore";
import { db, handleFirestoreError, OperationType } from "../lib/firebase";
import { Wish } from "../types";

const PASTEL_COLORS = [
  "bg-[#FBF8F3] text-[#4A3B32] border-[#E8DEC9] shadow-[0_5px_15px_rgba(166,143,128,0.06)]",
  "bg-[#FCEFEA] text-[#5C3E35] border-[#EAD0C7] shadow-[0_5px_15px_rgba(166,143,128,0.06)]",
  "bg-[#EBF3FC] text-[#344E5C] border-[#CBDDF2] shadow-[0_5px_15px_rgba(166,143,128,0.06)]",
  "bg-[#F3EEFC] text-[#4A345C] border-[#D6CBE8] shadow-[0_5px_15px_rgba(166,143,128,0.06)]",
  "bg-[#EDF6F0] text-[#34523C] border-[#CDDFD2] shadow-[0_5px_15px_rgba(166,143,128,0.06)]",
  "bg-[#FAF0E6] text-[#61452D] border-[#E6D4C3] shadow-[0_5px_15px_rgba(166,143,128,0.06)]",
];

const INITIAL_WISHES: Wish[] = [];

export default function WishesSection() {
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load wishes on mount from Firestore
  useEffect(() => {
    const q = query(collection(db, "wishes"), orderBy("timestamp", "desc"), limit(50));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items: Wish[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        items.push({
          id: doc.id,
          name: data.name || "",
          message: data.message || "",
          color: data.color || PASTEL_COLORS[0],
          rotation: typeof data.rotation === "number" ? data.rotation : 0,
          timestamp: typeof data.timestamp === "number" ? data.timestamp : Date.now(),
        });
      });
      
      if (items.length === 0) {
        setWishes(INITIAL_WISHES);
      } else {
        setWishes(items);
      }
    }, (err) => {
      console.error("Firestore loading error, falling back to local storage:", err);
      const stored = localStorage.getItem("wedding_wishes");
      if (stored) {
        try {
          setWishes(JSON.parse(stored));
        } catch (e) {
          setWishes(INITIAL_WISHES);
        }
      } else {
        setWishes(INITIAL_WISHES);
      }
      handleFirestoreError(err, OperationType.GET, "wishes");
    });

    return () => unsubscribe();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Please write your name.");
      return;
    }
    if (!message.trim()) {
      setError("Please write a warm wish or message.");
      return;
    }
    if (message.length > 250) {
      setError("Please keep your message within 250 characters.");
      return;
    }

    setIsSubmitting(true);

    const colorIndex = Math.floor(Math.random() * PASTEL_COLORS.length);
    const rotation = Math.random() * 6 - 3; // Random float between -3 and +3 degrees

    const newWishData = {
      name: name.trim(),
      message: message.trim(),
      color: PASTEL_COLORS[colorIndex],
      rotation: Number(rotation.toFixed(1)),
      timestamp: Date.now(),
    };

    addDoc(collection(db, "wishes"), newWishData)
      .then(() => {
        setName("");
        setMessage("");
        setIsSubmitting(false);
      })
      .catch((err) => {
        console.error("Error adding wish to Firestore:", err);
        // Fallback write to localStorage
        const newWish: Wish = {
          id: "wish-" + Date.now() + "-" + Math.floor(Math.random() * 1000),
          ...newWishData
        };
        const updated = [newWish, ...wishes];
        setWishes(updated);
        localStorage.setItem("wedding_wishes", JSON.stringify(updated));
        setName("");
        setMessage("");
        setIsSubmitting(false);
        handleFirestoreError(err, OperationType.WRITE, "wishes");
      });
  };

  return (
    <div id="wishes-module" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      
      {/* Form Input Card */}
      <div className="lg:col-span-5 bg-[#032b1a]/40 border border-[#C2A289]/25 rounded-2xl p-6 md:p-8 shadow-[0_15px_30px_rgba(0,0,0,0.15)] relative overflow-hidden backdrop-blur-sm">
        {/* Subtle geometric corner highlights */}
        <div className="absolute top-0 right-0 w-16 h-16 pointer-events-none opacity-40 border-r border-t border-[#C2A289]/30 rounded-tr-2xl" />
        <div className="absolute bottom-0 left-0 w-16 h-16 pointer-events-none opacity-40 border-l border-b border-[#C2A289]/30 rounded-bl-2xl" />

        <div className="relative z-10 text-[#FCFAF6]">
          <h3 className="font-cinzel text-xl text-[#ebd89b] font-bold tracking-wider mb-2 text-center lg:text-left">
            Send Your Blessings
          </h3>
          <p className="font-sans text-xs text-[#E8E2D5] leading-relaxed mb-6 text-center lg:text-left">
            Leave a message, prayers, or du'a for Saleem and Dhilshana. Your wishes will be pinned to our celebration board.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="guest-name" className="block text-xs font-semibold uppercase tracking-wider text-[#C2A289] mb-1.5">
                Your Name
              </label>
              <input
                id="guest-name"
                type="text"
                placeholder="e.g. Sameer & Family"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={40}
                className="w-full bg-[#021a10]/50 border border-[#C2A289]/25 rounded-lg px-4 py-3 text-sm text-[#FCFAF6] placeholder-[#FCFAF6]/40 focus:outline-none focus:border-[#C2A289] focus:ring-1 focus:ring-[#C2A289] transition-all duration-250"
              />
            </div>

            <div>
              <label htmlFor="guest-message" className="block text-xs font-semibold uppercase tracking-wider text-[#C2A289] mb-1.5">
                Your Wish
              </label>
              <textarea
                id="guest-message"
                rows={4}
                placeholder="Write your prayers, warm wishes, or congratulations..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                maxLength={250}
                className="w-full bg-[#021a10]/50 border border-[#C2A289]/25 rounded-lg px-4 py-3 text-sm text-[#FCFAF6] placeholder-[#FCFAF6]/40 focus:outline-none focus:border-[#C2A289] focus:ring-1 focus:ring-[#C2A289] transition-all duration-250 resize-none"
              />
              <div className="flex justify-end mt-1 text-[10px] text-[#A68F80]">
                {message.length}/250 characters
              </div>
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xs text-rose-800 bg-rose-50 border border-rose-200 px-3 py-2 rounded-lg"
              >
                {error}
              </motion.p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full relative overflow-hidden group py-3.5 bg-[#C2A289] hover:bg-[#B8861C] text-[#021a10] rounded-xl font-cinzel text-xs font-bold tracking-widest active:scale-[0.98] transition-all duration-150 shadow-md cursor-pointer disabled:opacity-55"
            >
              {isSubmitting ? "PINNING YOUR WISH..." : "SEND BLESSINGS & PIN"}
            </button>
          </form>
        </div>
      </div>

      {/* Board Display of Pinned Notes */}
      <div className="lg:col-span-7 h-[500px] bg-[#032b1a]/40 rounded-2xl border border-[#C2A289]/25 p-6 shadow-[0_15px_30px_rgba(0,0,0,0.15)] relative overflow-y-auto overflow-x-hidden backdrop-blur-sm">
        {/* Board Background Linen Style */}
        <div className="absolute inset-0 bg-gradient-to-tr from-[#032b1a]/50 via-[#021a10]/50 to-[#032b1a]/50" />
        <div className="absolute inset-0 islamic-pattern opacity-[0.03]" />
        


        {/* Board Pinned Items Grid */}
        <div className="relative z-10 mt-6 grid grid-cols-1 sm:grid-cols-2 gap-6 p-2">
          <AnimatePresence initial={false}>
            {wishes.map((w) => (
              <motion.div
                key={w.id}
                id={`wish-note-${w.id}`}
                layout
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0, rotate: w.rotation }}
                exit={{ opacity: 0, scale: 0.8, y: -20 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                whileHover={{ scale: 1.04, zIndex: 30, rotate: 0 }}
                className={`relative p-5 rounded-md border shadow-md flex flex-col justify-between ${w.color} select-none transition-all duration-200 min-h-[170px]`}
                style={{ transformOrigin: "center top" }}
              >
                {/* 3D Gold Pin at Top Center */}
                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-3.5 h-3.5 rounded-full bg-gradient-to-r from-[#ECDBC9] via-[#C5A285] to-[#A37B5C] border border-white/40 shadow-sm flex items-center justify-center">
                  {/* Pin head shine */}
                  <div className="w-1 h-1 rounded-full bg-white opacity-80" />
                  {/* Realistic shadow under the pin */}
                  <div className="absolute -bottom-1 left-1.5 w-1 h-2 bg-black/10 blur-[0.5px] rounded-full transform -rotate-12" />
                </div>

                {/* Wish Content text */}
                <div className="mt-2 text-xs font-serif leading-relaxed italic flex-grow">
                  "{w.message}"
                </div>

                {/* Guest Author & Time details */}
                <div className="mt-4 pt-2 border-t border-black/5 flex justify-between items-center text-[10px]">
                  <span className="font-sans font-bold tracking-wide uppercase opacity-80 truncate max-w-[130px]">
                    — {w.name}
                  </span>
                  <span className="font-mono opacity-40">
                    {new Date(w.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Empty State */}
        {wishes.length === 0 && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center text-[#C2A289] opacity-60 z-10">
            <svg className="w-12 h-12 mb-3 stroke-current opacity-30" viewBox="0 0 24 24" fill="none">
              <path d="M12 19V5M5 12h14" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <p className="font-cinzel text-sm">No blessings pinned yet</p>
            <p className="font-sans text-xs mt-1">Be the first to send your prayers!</p>
          </div>
        )}
      </div>
    </div>
  );
}
