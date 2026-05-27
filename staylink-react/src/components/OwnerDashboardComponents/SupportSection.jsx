import React from "react";
import { Phone, Mail, ChevronRight } from "lucide-react";

const SupportSection = () => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
      <h3 className="font-bold text-slate-800 mb-5 text-lg">
        Support
      </h3>
      <div className="space-y-3">
        {/* CONTACT */}
        <button className="w-full flex items-center justify-between bg-slate-50 hover:bg-slate-100 transition-all duration-300 p-4 rounded-lg group">
          <div className="flex items-center gap-3">
            <Phone className="w-5 h-5 text-slate-500 group-hover:text-slate-700 transition-colors" />
            <span className="font-semibold text-slate-700">
              Contact Support
            </span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 group-hover:translate-x-1 transition-all duration-300" />
        </button>

        {/* EMAIL */}
        <button className="w-full flex items-center justify-between bg-slate-50 hover:bg-slate-100 transition-all duration-300 p-4 rounded-lg group">
          <div className="flex items-center gap-3">
            <Mail className="w-5 h-5 text-slate-500 group-hover:text-slate-700 transition-colors" />
            <span className="font-semibold text-slate-700">
              Email Support
            </span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 group-hover:translate-x-1 transition-all duration-300" />
        </button>
      </div>
    </div>
  );
};

export default SupportSection;