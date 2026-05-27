import React from "react";
import { Building2, CalendarDays, Wallet, TrendingUp, ArrowUpRight, ArrowDownRight } from "lucide-react";

const DashboardStats = ({ properties }) => {
  const statsCards = [
    {
      title: "Total Properties",
      value: properties.length,
      icon: Building2,
      trend: "+12%",
      trendUp: true,
      bgGradient: "from-slate-500 to-slate-700",
      iconBg: "bg-white/20",
      iconColor: "text-white",
    },
    {
      title: "Available Properties",
      value: properties.filter((property) => property.is_available).length,
      icon: CalendarDays,
      trend: "+5%",
      trendUp: true,
      bgGradient: "from-emerald-500 to-teal-700",
      iconBg: "bg-white/20",
      iconColor: "text-white",
    },
    {
      title: "Total Revenue",
      value: "₹0",
      icon: Wallet,
      trend: "0%",
      trendUp: false,
      bgGradient: "from-violet-500 to-purple-700",
      iconBg: "bg-white/20",
      iconColor: "text-white",
    },
    {
      title: "Occupancy Rate",
      value: "0%",
      icon: TrendingUp,
      trend: "0%",
      trendUp: false,
      bgGradient: "from-blue-500 to-indigo-700",
      iconBg: "bg-white/20",
      iconColor: "text-white",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
      {statsCards.map((stat, idx) => {
        const Icon = stat.icon;
        return (
          <div
            key={idx}
            className={`relative overflow-hidden bg-gradient-to-br ${stat.bgGradient} rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 group`}
          >
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full -mr-16 -mt-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full -ml-12 -mb-12"></div>
            </div>
            
            <div className="relative p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`${stat.iconBg} p-3 rounded-xl backdrop-blur-sm`}>
                  <Icon className={stat.iconColor} size={24} />
                </div>
                <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold ${
                  stat.trendUp ? 'bg-emerald-500/30 text-emerald-100' : 'bg-rose-500/30 text-rose-100'
                }`}>
                  {stat.trendUp ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                  {stat.trend}
                </div>
              </div>
              
              <h3 className="text-white/80 text-xs font-semibold uppercase tracking-wider mb-1">
                {stat.title}
              </h3>
              
              <div className="flex items-baseline gap-2">
                <p className="text-3xl font-bold text-white">
                  {stat.value}
                </p>
                {stat.title === "Total Revenue" && stat.value !== "₹0" && (
                  <span className="text-white/60 text-sm">this month</span>
                )}
              </div>
              
              {/* Mini Chart Line */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20 group-hover:bg-white/40 transition-all duration-300"></div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DashboardStats;