import React from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Building2, ArrowRight, Sparkles, TrendingUp, Zap } from "lucide-react";

const QuickActions = () => {
  const navigate = useNavigate();

  const actions = [
    {
      id: "add",
      title: "Add New Property",
      description: "Create a new property listing",
      icon: Plus,
      gradient: "from-emerald-500 to-teal-600",
      bgGradient: "from-emerald-50 to-teal-50",
      iconBg: "bg-gradient-to-br from-emerald-500 to-teal-600",
      stats: "List your property in minutes",
      statIcon: Zap,
      onClick: () => navigate("/owner/add-property"),
      borderColor: "border-emerald-200",
      hoverBorder: "hover:border-emerald-300",
    },
    {
      id: "manage",
      title: "Manage Properties",
      description: "Edit and manage your properties",
      icon: Building2,
      gradient: "from-slate-600 to-slate-700",
      bgGradient: "from-slate-50 to-slate-100",
      iconBg: "bg-gradient-to-br from-slate-600 to-slate-700",
      stats: "Total properties",
      statIcon: TrendingUp,
      onClick: () => navigate("/owner/my-properties"),
      borderColor: "border-slate-200",
      hoverBorder: "hover:border-slate-300",
    },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
      {actions.map((action) => {
        const Icon = action.icon;
        const StatIcon = action.statIcon;
        
        return (
          <button
            key={action.id}
            onClick={action.onClick}
            className={`group relative overflow-hidden bg-gradient-to-br ${action.bgGradient} rounded-2xl border ${action.borderColor} ${action.hoverBorder} hover:shadow-xl transition-all duration-500 p-0 text-left focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-400`}
          >
            {/* Animated Background Pattern */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
              <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/30 rounded-full blur-3xl animate-pulse"></div>
              <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/20 rounded-full blur-3xl"></div>
            </div>
            
            {/* Content Container */}
            <div className="relative p-7">
              <div className="flex items-start justify-between">
                {/* Left Section */}
                <div className="flex-1">
                  {/* Icon with Animation */}
                  <div className={`relative mb-5 w-16 h-16 ${action.iconBg} rounded-xl flex items-center justify-center shadow-lg transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-3`}>
                    <Icon className="w-8 h-8 text-white" />
                    <div className="absolute inset-0 rounded-xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  
                  {/* Title */}
                  <h3 className="text-2xl font-bold text-slate-800 mb-2 group-hover:text-slate-700 transition-colors duration-300">
                    {action.title}
                  </h3>
                  
                  {/* Description */}
                  <p className="text-slate-500 text-sm font-medium mb-4 leading-relaxed">
                    {action.description}
                  </p>
                  
                  {/* Stats Badge */}
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/60 backdrop-blur-sm rounded-full border border-slate-200">
                    <StatIcon className="w-3.5 h-3.5 text-slate-500" />
                    <span className="text-xs font-semibold text-slate-600">
                      {action.stats}
                    </span>
                  </div>
                </div>
                
                {/* Right Section - Arrow */}
                <div className="ml-4">
                  <div className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center transform transition-all duration-500 group-hover:translate-x-1 group-hover:scale-110">
                    <ArrowRight className="w-5 h-5 text-slate-600 group-hover:text-slate-800 transition-colors" />
                  </div>
                </div>
              </div>
              
              {/* Bottom Progress Bar */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/50 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left"></div>
            </div>
            
            {/* Decorative Corner */}
            <div className="absolute top-0 right-0 w-20 h-20 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <div className="absolute top-0 right-0 w-0 h-0 border-t-[80px] border-r-[80px] border-t-transparent border-r-white/10"></div>
            </div>
          </button>
        );
      })}
      
      {/* Additional Quick Tip Banner */}
      <div className="lg:col-span-2 mt-2">
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200 p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-amber-800">
                Pro Tip: Properties with professional photos get 3x more bookings
              </p>
              <p className="text-xs text-amber-600">
                Take high-quality photos from different angles
              </p>
            </div>
          </div>
          <button 
            onClick={() => navigate("/owner/add-property")}
            className="text-amber-700 text-sm font-semibold hover:text-amber-800 transition-colors"
          >
            Learn more →
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuickActions;