import React from "react";
import { useNavigate } from "react-router-dom";
import { Building2, ChevronRight, Sparkles, ArrowRight } from "lucide-react";
import PropertyCard from "./PropertyCard";

const PropertySection = ({ properties }) => {
  const navigate = useNavigate();

  return (
    <div className="relative">
      {/* Decorative Background Element */}
      <div className="absolute -top-10 -right-10 w-64 h-64 bg-gradient-to-br from-slate-100/50 to-transparent rounded-full blur-3xl -z-10"></div>
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-8 gap-4">
        <div className="relative">
          <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-slate-700 to-slate-500 rounded-full"></div>
          <div className="pl-4">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              Your Properties
            </h2>
            <p className="text-slate-500 text-sm mt-1 font-medium flex items-center gap-2">
              <Sparkles size={14} className="text-amber-500" />
              Recently added properties
            </p>
          </div>
        </div>
        
        <button
          onClick={() => navigate("/owner/my-properties")}
          className="group relative inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-700 font-semibold text-sm hover:border-slate-300 hover:shadow-md transition-all duration-300 overflow-hidden"
        >
          <span className="relative z-10 flex items-center gap-2">
            View All Properties
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-slate-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </button>
      </div>

      {/* EMPTY STATE with Premium Design */}
      {properties.length === 0 ? (
        <div className="relative overflow-hidden bg-gradient-to-br from-white to-slate-50 rounded-2xl border border-slate-200 p-16 text-center shadow-lg">
          {/* Decorative Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-0 right-0 w-64 h-64 bg-slate-400 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-slate-500 rounded-full blur-3xl"></div>
          </div>
          
          <div className="relative z-10">
            <div className="relative inline-block">
              <div className="w-28 h-28 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center mx-auto mb-6 shadow-inner">
                <Building2 className="w-12 h-12 text-slate-500" />
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-amber-400 rounded-full animate-pulse"></div>
            </div>
            
            <h3 className="text-2xl font-bold text-slate-800 mb-3">
              No Properties Yet
            </h3>
            <p className="text-slate-500 mb-8 max-w-sm mx-auto font-medium">
              Start your journey by adding your first property. 
              Properties with high-quality images get more bookings.
            </p>
            
            <button
              onClick={() => navigate("/owner/add-property")}
              className="group relative inline-flex items-center gap-2 bg-gradient-to-r from-slate-800 to-slate-700 hover:from-slate-700 hover:to-slate-600 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <span>Add Your First Property</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Stats Bar */}
          <div className="flex items-center justify-between mb-6 px-1">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                <span className="text-xs text-slate-500 font-medium">
                  {properties.filter(p => p.is_available).length} Available
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-slate-400 rounded-full"></div>
                <span className="text-xs text-slate-500 font-medium">
                  {properties.filter(p => !p.is_available).length} Unavailable
                </span>
              </div>
            </div>
            <div className="text-xs text-slate-400 font-medium">
              Showing {Math.min(4, properties.length)} of {properties.length} properties
            </div>
          </div>
          
          {/* Property Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-7">
            {properties.slice(0, 4).map((property, index) => (
              <div 
                key={property.id} 
                className="animate-fadeInUp"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <PropertyCard property={property} />
              </div>
            ))}
          </div>
          
          {/* View More CTA (if more than 4 properties) */}
          {properties.length > 4 && (
            <div className="text-center mt-10">
              <button
                onClick={() => navigate("/owner/my-properties")}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 font-medium text-sm hover:border-slate-300 hover:shadow-md transition-all duration-300"
              >
                View All {properties.length} Properties
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </>
      )}
      
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeInUp {
          animation: fadeInUp 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default PropertySection;