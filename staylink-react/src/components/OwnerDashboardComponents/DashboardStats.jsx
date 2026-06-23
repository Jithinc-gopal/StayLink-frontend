import React from "react";
import {
  Building2,
  CalendarCheck,
  Wallet,
  TrendingUp,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

const DashboardStats = ({ properties }) => {
  const totalProperties = properties.length;

  const availableProperties = properties.filter(
    (property) => property.is_available
  ).length;

  const occupancyRate =
    totalProperties > 0
      ? Math.round((availableProperties / totalProperties) * 100)
      : 0;

  return (
    <section className="mb-10">
      <div className="bg-white border border-slate-200 rounded-[2rem] shadow-sm overflow-hidden">
        <div className="grid grid-cols-1 xl:grid-cols-3">

          {/* LEFT SUMMARY */}
          <div className="xl:col-span-1 bg-slate-900 p-8 text-white relative overflow-hidden">
            <div className="absolute -top-16 -right-16 w-52 h-52 bg-blue-500/20 rounded-full blur-3xl" />
            <div className="absolute -bottom-20 -left-20 w-52 h-52 bg-indigo-500/20 rounded-full blur-3xl" />

            <div className="relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center mb-6">
                <ShieldCheck size={28} />
              </div>

              <p className="text-sm text-slate-300 font-medium">
                Business Overview
              </p>

              <h2 className="text-3xl font-bold mt-2 leading-tight">
                Your hosting performance at a glance
              </h2>

              <p className="text-slate-300 text-sm mt-4 leading-relaxed">
                Track property availability, reservation readiness,
                revenue progress, and operational health from one owner
                workspace.
              </p>

              <button className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-white/90 hover:text-white">
                View detailed insights
                <ArrowRight size={16} />
              </button>
            </div>
          </div>

          {/* RIGHT METRICS */}
          <div className="xl:col-span-2 p-6 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              <MetricCard
                icon={Building2}
                label="Listed Properties"
                value={totalProperties}
                description="Total stays managed under your owner account."
                status="Portfolio"
              />

              <MetricCard
                icon={CalendarCheck}
                label="Available Listings"
                value={availableProperties}
                description="Properties currently open for traveler bookings."
                status="Live"
              />

              <MetricCard
                icon={Wallet}
                label="Revenue Tracked"
                value="₹0"
                description="Earnings from confirmed and completed bookings."
                status="Finance"
              />

              <MetricCard
                icon={TrendingUp}
                label="Availability Rate"
                value={`${occupancyRate}%`}
                description="Percentage of your listed properties available now."
                status="Performance"
              />

            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const MetricCard = ({
  icon: Icon,
  label,
  value,
  description,
  status,
}) => {
  return (
    <div className="group rounded-3xl border border-slate-200 bg-slate-50/70 p-6 hover:bg-white hover:shadow-lg transition-all duration-300">
      <div className="flex items-start justify-between gap-4">
        <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center shadow-sm">
          <Icon size={22} />
        </div>

        <span className="px-3 py-1 rounded-full bg-white border border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wide">
          {status}
        </span>
      </div>

      <div className="mt-6">
        <p className="text-sm font-semibold text-slate-500">
          {label}
        </p>

        <h3 className="text-4xl font-extrabold text-slate-900 mt-2">
          {value}
        </h3>

        <p className="text-sm text-slate-500 mt-3 leading-relaxed">
          {description}
        </p>
      </div>

      <div className="mt-5 h-1.5 w-full rounded-full bg-slate-200 overflow-hidden">
        <div className="h-full w-2/3 bg-slate-900 rounded-full group-hover:w-full transition-all duration-500" />
      </div>
    </div>
  );
};

export default DashboardStats;