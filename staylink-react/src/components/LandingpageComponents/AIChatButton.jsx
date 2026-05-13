import { Sparkles } from "lucide-react";

export default function AIChatButton() {
  return (
    <div className="fixed bottom-8 right-8 z-[100] group">
      {/* Tooltip */}
      <div className="absolute right-0 bottom-full mb-4 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 pointer-events-none">
        <div className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl shadow-xl border border-white/20 whitespace-nowrap">
          <span className="text-sm font-bold bg-gradient-to-r from-[#0052CC] to-[#4B9BFF] bg-clip-text text-transparent font-['Plus_Jakarta_Sans']">
            Ask AI
          </span>
        </div>
      </div>

      {/* Pulse ring */}
      <div className="absolute inset-0 rounded-full animate-[subtle-pulse_3s_cubic-bezier(0.4,0,0.6,1)_infinite]" />

      {/* Button */}
      <button
        className="relative h-16 w-16 rounded-full bg-gradient-to-br from-[#0052CC] to-[#4B9BFF] shadow-[0_8px_32px_rgba(0,82,204,0.3)] border border-white/20 flex items-center justify-center text-white hover:scale-110 active:scale-95 transition-transform duration-200"
        aria-label="Ask AI"
      >
        <Sparkles size={26} fill="white" />
      </button>

      <style>{`
        @keyframes subtle-pulse {
          0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(0,82,204,0.4); }
          70% { transform: scale(1.05); box-shadow: 0 0 0 15px rgba(0,82,204,0); }
          100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(0,82,204,0); }
        }
      `}</style>
    </div>
  );
}