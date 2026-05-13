import { MapPin, CreditCard, Building2, Search, Sparkles } from "lucide-react";
import { useState } from "react";

export default function Hero() {
  const [aiEnabled, setAiEnabled] = useState(true);

  return (
    <section className="relative min-h-[870px] flex flex-col items-center justify-center px-6 overflow-hidden">
      {/* Background radial gradient */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,_#d7e2ff66,_#f9f9ff,_#f9f9ff)]" />

      {/* Headline */}
      <div className="max-w-4xl w-full text-center mb-12">
        <h1 className="font-['Plus_Jakarta_Sans'] text-5xl md:text-7xl font-extrabold text-[#041b3c] tracking-tighter mb-6 leading-tight">
          Find your{" "}
          <span className="text-[#003d9b] italic">flow</span>,{" "}
          <br />
          wherever you land.
        </h1>
        <p className="text-slate-500 text-lg md:text-xl max-w-2xl mx-auto">
          The premium concierge for hybrid stays. Curated properties tailored
          to your budget and lifestyle.
        </p>
      </div>

      {/* Search Bar */}
      <div className="w-full max-w-5xl bg-white p-2 rounded-2xl shadow-[0px_8px_40px_rgba(4,27,60,0.08)] flex flex-col md:flex-row items-stretch md:items-center gap-2">
        {/* Location */}
        <div className="flex-1 flex items-center px-4 py-3 gap-3">
          <MapPin size={20} className="text-[#003d9b] shrink-0" />
          <div className="flex flex-col">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Location
            </span>
            <input
              type="text"
              placeholder="Where to?"
              className="bg-transparent border-none p-0 focus:ring-0 text-[#041b3c] font-semibold placeholder:text-slate-300 text-sm outline-none"
            />
          </div>
        </div>

        <div className="hidden md:block w-px h-10 bg-slate-200" />

        {/* Budget */}
        <div className="flex-1 flex items-center px-4 py-3 gap-3">
          <CreditCard size={20} className="text-[#003d9b] shrink-0" />
          <div className="flex flex-col">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Budget
            </span>
            <input
              type="text"
              placeholder="Max price"
              className="bg-transparent border-none p-0 focus:ring-0 text-[#041b3c] font-semibold placeholder:text-slate-300 text-sm outline-none"
            />
          </div>
        </div>

        <div className="hidden md:block w-px h-10 bg-slate-200" />

        {/* Type */}
        <div className="flex-1 flex items-center px-4 py-3 gap-3">
          <Building2 size={20} className="text-[#003d9b] shrink-0" />
          <div className="flex flex-col">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Type
            </span>
            <select className="bg-transparent border-none p-0 focus:ring-0 text-[#041b3c] font-semibold appearance-none text-sm outline-none cursor-pointer">
              <option>All Stays</option>
              <option>Hotels</option>
              <option>PGs</option>
              <option>Homestays</option>
            </select>
          </div>
        </div>

        <div className="hidden md:block w-px h-10 bg-slate-200" />

        {/* AI Toggle + Search */}
        <div className="flex items-center px-4 py-3 gap-4">
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#006c47]">
              AI-Suggested
            </span>
            <button
              onClick={() => setAiEnabled(!aiEnabled)}
              className={`relative inline-flex items-center mt-1 h-6 w-11 rounded-full transition-colors duration-300 focus:outline-none ${
                aiEnabled ? "bg-[#006c47]" : "bg-slate-200"
              }`}
            >
              <span
                className={`inline-block h-5 w-5 bg-white rounded-full shadow transform transition-transform duration-300 ${
                  aiEnabled ? "translate-x-5" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          <button className="bg-gradient-to-br from-[#003d9b] to-[#0052cc] text-white px-8 py-4 rounded-xl font-bold font-['Plus_Jakarta_Sans'] shadow-lg shadow-blue-800/20 hover:scale-[1.02] transition-transform flex items-center gap-2">
            <Search size={16} />
            Search
          </button>
        </div>
      </div>
    </section>
  );
}