import React from "react";
import { Building2, TrendingUp } from "lucide-react";

const DashboardHeader = () => {
  return (
    <div className="mb-8">
      <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

          {/* LEFT */}
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 text-slate-700 text-sm font-semibold mb-4">
              <Building2 size={16} />
              Property Management Portal
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">
              Welcome Back
            </h1>

            <p className="text-slate-600 text-lg mt-3 max-w-3xl leading-relaxed">
              Manage your listings, monitor reservations,
              track guest activity, and grow your property
              business through the StayLink Owner Platform.
            </p>
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-4">
            <div className="bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 min-w-[220px]">
              <div className="flex items-center gap-2 text-slate-500 text-sm">
                <TrendingUp size={16} />
                Platform Status
              </div>

              <h3 className="text-slate-900 font-bold text-lg mt-2">
                Owner Workspace Active
              </h3>

              <p className="text-slate-500 text-sm mt-1">
                Access bookings, guests, analytics and property controls.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;