import React from "react";
import { Sparkles } from "lucide-react";

const TipCard = () => {
  return (
    <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-xl border border-amber-200 p-6 shadow-sm">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
          <Sparkles className="w-5 h-5 text-amber-600" />
        </div>
        <div>
          <h3 className="font-bold text-slate-800 text-lg">
            Pro Tip
          </h3>
          <p className="text-sm text-slate-600 mt-2 leading-relaxed font-medium">
            Properties with high-quality images and complete details
            usually get more bookings and better engagement from users.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TipCard;