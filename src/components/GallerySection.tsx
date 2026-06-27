import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, ZoomIn, Heart, ChevronLeft, ChevronRight } from "lucide-react";

const GALLERY_IMAGES = [
  {
    id: "img-1",
    url: "/WhatsApp Image 2026-06-23 at 08.15.15.jpeg",
    alt: "Beginning of Forever",
    caption: "Beginning of Forever"
  },
  {
    id: "img-2",
    url: "/WhatsApp Image 2026-06-23 at 08.15.15 (2).jpeg",
    alt: "Cherished Moments",
    caption: "Cherished Moments"
  },
  {
    id: "img-3",
    url: "/WhatsApp Image 2026-06-26 at 20.07.31.jpeg",
    alt: "A Union of Souls",
    caption: "A Union of Souls"
  },
  {
    id: "img-4",
    url: "/WhatsApp Image 2026-06-26 at 20.08.26.jpeg",
    alt: "Love & Blessings",
    caption: "Love & Blessings"
  },
  {
    id: "img-5",
    url: "/WhatsApp Image 2026-06-26 at 20.08.31.jpeg",
    alt: "The Nikkah Vows",
    caption: "The Nikkah Vows"
  },
  {
    id: "img-6",
    url: "/WhatsApp Image 2026-06-26 at 20.08.33.jpeg",
    alt: "Sacred Bond",
    caption: "Sacred Bond"
  },
  {
    id: "img-7",
    url: "/WhatsApp Image 2026-06-26 at 20.08.34.jpeg",
    alt: "Walking Together in Faith",
    caption: "Walking Together in Faith"
  },
  {
    id: "img-8",
    url: "/WhatsApp Image 2026-06-26 at 20.08.34 (1).jpeg",
    alt: "Endless Joy",
    caption: "Endless Joy"
  }
];

export default function GallerySection() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollAmount = clientWidth * 0.75; // Scroll 75% of view width
      scrollRef.current.scrollTo({
        left: direction === "left" ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: "smooth"
      });
    }
  };

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      if (scrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        const maxScrollLeft = scrollWidth - clientWidth;
        
        // Find individual card width (or default to 344)
        const firstCard = scrollRef.current.querySelector(".snap-center") as HTMLElement;
        const itemWidth = (firstCard && firstCard.offsetWidth > 0) ? firstCard.offsetWidth + 24 : 344;

        if (scrollLeft >= maxScrollLeft - 15) {
          // Reset to start smoothly
          scrollRef.current.scrollTo({
            left: 0,
            behavior: "smooth"
          });
        } else {
          // Scroll to next item
          scrollRef.current.scrollTo({
            left: scrollLeft + itemWidth,
            behavior: "smooth"
          });
        }
      }
    }, 3000); // Auto scroll every 3 seconds

    return () => clearInterval(interval);
  }, [isPaused]);

  return (
    <div id="gallery-section-container" className="relative max-w-7xl mx-auto px-4 py-6">
      {/* Webkit scrollbar hiding rule inline style safety */}
      <style dangerouslySetInnerHTML={{__html: `
        #gallery-section-container div::-webkit-scrollbar {
          display: none;
        }
      `}} />

      {/* Scroll Navigation Buttons */}
      <div className="absolute top-1/2 -left-2 md:-left-4 z-10 -translate-y-1/2">
        <button
          onClick={() => scroll("left")}
          className="p-3 rounded-full bg-white/90 backdrop-blur-md border border-[#DCD0C0] shadow-[0_4px_12px_rgba(126,94,78,0.15)] text-[#7E5E4E] hover:bg-[#7E5E4E] hover:text-white transition-all duration-300 focus:outline-none cursor-pointer"
          aria-label="Scroll Left"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
      </div>

      <div className="absolute top-1/2 -right-2 md:-right-4 z-10 -translate-y-1/2">
        <button
          onClick={() => scroll("right")}
          className="p-3 rounded-full bg-white/90 backdrop-blur-md border border-[#DCD0C0] shadow-[0_4px_12px_rgba(126,94,78,0.15)] text-[#7E5E4E] hover:bg-[#7E5E4E] hover:text-white transition-all duration-300 focus:outline-none cursor-pointer"
          aria-label="Scroll Right"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Horizontal Scrolling Track */}
      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto snap-x snap-mandatory py-4 px-2 no-scrollbar scroll-smooth"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
      >

        {GALLERY_IMAGES.map((img, index) => (
          <motion.div
            key={img.id}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="flex-shrink-0 w-[280px] sm:w-[320px] md:w-[360px] snap-center"
          >
            <div className="relative h-[400px] md:h-[460px] rounded-2xl overflow-hidden border border-[#DCD0C0]/40 shadow-[0_12px_30px_rgba(163,117,109,0.06)] group bg-[#FAF8F5] transition-all duration-500">
              {/* Image source pointing directly to the local public folder asset */}
              <img
                src={img.url}
                alt={img.alt}
                loading="lazy"
                className="w-full h-full object-cover object-center filter brightness-[0.98] group-hover:brightness-100 group-hover:scale-[1.03] transition-all duration-700 ease-out cursor-pointer"
                onClick={() => setSelectedImage(img.url)}
                onError={(e) => {
                  // Fallback to beautiful wedding placeholder if anything fails
                  const target = e.target as HTMLImageElement;
                  if (!target.src.includes("unsplash")) {
                    target.src = `https://images.unsplash.com/photo-1519225495810-7517c3198a7a?auto=format&fit=crop&q=80&w=600&h=800`;
                  }
                }}
              />

              {/* Minimal Hover Overlay with Zoom Icon */}
              <div 
                className="absolute inset-0 bg-black/15 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center cursor-pointer"
                onClick={() => setSelectedImage(img.url)}
              >
                <div className="p-3.5 bg-white/95 rounded-full shadow-lg text-[#7E5E4E] transform scale-90 group-hover:scale-100 transition-transform duration-300">
                  <ZoomIn className="w-5 h-5" />
                </div>
              </div>

              {/* Clean decorative bottom bar with custom caption and heart icon */}
              <div className="absolute bottom-4 left-4 right-4 p-3 bg-white/95 backdrop-blur-md rounded-xl border border-[#DCD0C0]/30 shadow-sm opacity-90 group-hover:opacity-100 transition-all duration-300">
                <p className="font-sans text-[10px] font-semibold tracking-wider text-[#7E5E4E] uppercase text-center flex items-center justify-center gap-1.5">
                  <Heart className="w-3 h-3 text-[#C2A289] fill-[#C2A289]" />
                  {img.caption}
                </p>
              </div>

              {/* Aesthetic golden border overlay on hover */}
              <div className="absolute inset-3 border border-[#C2A289]/0 group-hover:border-[#C2A289]/20 rounded-xl transition-all duration-500 pointer-events-none" />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Swipe Indicator helper text */}
      <p className="text-center font-sans text-[10px] tracking-widest text-[#9A8A78]/70 uppercase mt-4 animate-pulse">
        Swipe or scroll horizontally to explore the album
      </p>

      {/* Lightbox / Zoom Modal Viewer */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4 backdrop-blur-md"
            onClick={() => setSelectedImage(null)}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer border border-white/10"
              title="Close viewer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Main Image */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 120 }}
              className="relative max-w-5xl max-h-[85vh] overflow-hidden rounded-xl border border-white/10 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={selectedImage}
                alt="Zoomed wedding celebration moment"
                className="max-w-full max-h-[85vh] object-contain rounded-xl"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  if (!target.src.includes("unsplash")) {
                    target.src = `https://images.unsplash.com/photo-1519225495810-7517c3198a7a?auto=format&fit=crop&q=80&w=1200&h=800`;
                  }
                }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

