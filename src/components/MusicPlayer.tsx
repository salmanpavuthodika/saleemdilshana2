import React from "react";
import { Volume2, VolumeX } from "lucide-react";

interface MusicPlayerProps {
  isMuted: boolean;
  toggleMute: () => void;
  isEnvelopeOpened: boolean;
}

export default function MusicPlayer({ isMuted, toggleMute, isEnvelopeOpened }: MusicPlayerProps) {
  if (!isEnvelopeOpened) return null;

  return (
    <div 
      id="music-player-root" 
      className="fixed bottom-6 right-6 z-40 flex items-center pointer-events-auto animate-fade-in"
    >
      <button
        id="btn-music-mute"
        onClick={toggleMute}
        className="p-3 bg-[#032b1a]/90 backdrop-blur-md border border-[#C2A289]/50 hover:border-[#ebd89b] text-[#ebd89b] hover:text-[#dfbe60] rounded-full shadow-[0_8px_30px_rgba(0,0,0,0.25)] active:scale-95 transition-all duration-300 flex items-center justify-center group"
        title={isMuted ? "Unmute Music" : "Mute Music"}
      >
        {isMuted ? (
          <VolumeX className="w-5 h-5 text-rose-700 group-hover:scale-110 transition-transform duration-200" />
        ) : (
          <Volume2 className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
        )}
      </button>
    </div>
  );
}
