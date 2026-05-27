import React from "react";
import { Eye, ThumbsUp, Building2, CheckCircle2 } from "lucide-react";

const QuickStatistics = ({ properties }) => {
  const availableProperties = properties.filter(
    (property) => property.is_available
  ).length;

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
      <h3 className="font-bold text-slate-800 mb-5 text-lg">
        Quick Statistics
      </h3>
      <div className="space-y-5">
        {/* TOTAL */}
        <div className="flex items-center justify-between group">
          <div className="flex items-center gap-3">
            <Building2 className="w-5 h-5 text-slate-600 group-hover:text-slate-800 transition-colors" />
            <span className="text-slate-600 font-medium">
              Total Properties
            </span>
          </div>
          <span className="font-bold text-xl text-slate-800">
            {properties.length}
          </span>
        </div>

        {/* AVAILABLE */}
        <div className="flex items-center justify-between group">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 group-hover:text-emerald-700 transition-colors" />
            <span className="text-slate-600 font-medium">
              Available
            </span>
          </div>
          <span className="font-bold text-xl text-slate-800">
            {availableProperties}
          </span>
        </div>

        {/* VIEWS */}
        <div className="flex items-center justify-between group">
          <div className="flex items-center gap-3">
            <Eye className="w-5 h-5 text-blue-600 group-hover:text-blue-700 transition-colors" />
            <span className="text-slate-600 font-medium">
              Profile Views
            </span>
          </div>
          <span className="font-bold text-xl text-slate-800">
            0
          </span>
        </div>

        {/* INQUIRIES */}
        <div className="flex items-center justify-between group">
          <div className="flex items-center gap-3">
            <ThumbsUp className="w-5 h-5 text-violet-600 group-hover:text-violet-700 transition-colors" />
            <span className="text-slate-600 font-medium">
              Inquiries
            </span>
          </div>
          <span className="font-bold text-xl text-slate-800">
            0
          </span>
        </div>
      </div>
    </div>
  );
};

export default QuickStatistics;