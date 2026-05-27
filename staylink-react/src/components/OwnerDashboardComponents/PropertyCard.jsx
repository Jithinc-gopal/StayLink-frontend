import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Bed, Bath, Eye, Heart, Share2, ChevronRight, Star } from "lucide-react";

const PropertyCard = ({ property }) => {
  const navigate = useNavigate();
  const [isLiked, setIsLiked] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  return (
    <div className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
      
      {/* IMAGE CONTAINER */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200">
        {/* Skeleton Loader */}
        {!isImageLoaded && (
          <div className="absolute inset-0 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 animate-pulse">
            <div className="w-full h-full flex items-center justify-center">
              <div className="w-12 h-12 border-4 border-slate-300 border-t-slate-600 rounded-full animate-spin"></div>
            </div>
          </div>
        )}
        
        <img
          src={property.images?.[0]?.image || "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&h=400&fit=crop"}
          alt={property.title}
          className={`w-full h-64 object-cover transition-all duration-700 group-hover:scale-110 ${
            isImageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => setIsImageLoaded(true)}
        />
        
        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        
        {/* Status Badge */}
        <div className={`absolute top-4 left-4 px-3 py-1.5 rounded-xl text-xs font-bold shadow-lg backdrop-blur-sm ${
          property.is_available
            ? "bg-emerald-500/90 text-white"
            : "bg-slate-700/90 text-white"
        }`}>
          {property.is_available ? "✨ Available" : "🔒 Unavailable"}
        </div>
        
 
        
      
      </div>

      {/* CONTENT */}
      <div className="p-5 bg-white">
        {/* Title & Location */}
        <div className="mb-4">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="text-xl font-bold text-slate-800 line-clamp-1 group-hover:text-slate-600 transition-colors">
              {property.title}
            </h3>
          </div>
          <div className="flex items-center gap-1.5 text-slate-500">
            <MapPin size={14} className="text-slate-400" />
            <span className="text-sm font-medium">
              {property.city}, {property.state}
            </span>
          </div>
        </div>

        {/* Property Details with Icons */}
        <div className="flex items-center justify-between py-3 mb-4 border-y border-slate-100">
          <div className="flex items-center gap-2 text-slate-600">
            <div className="w-8 h-8 bg-slate-50 rounded-lg flex items-center justify-center">
              <Bed size={16} className="text-slate-500" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">Bedrooms</p>
              <p className="text-sm font-bold text-slate-700">{property.bedrooms}</p>
            </div>
          </div>
          <div className="w-px h-8 bg-slate-100"></div>
          <div className="flex items-center gap-2 text-slate-600">
            <div className="w-8 h-8 bg-slate-50 rounded-lg flex items-center justify-center">
              <Bath size={16} className="text-slate-500" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">Bathrooms</p>
              <p className="text-sm font-bold text-slate-700">{property.bathrooms}</p>
            </div>
          </div>
          <div className="w-px h-8 bg-slate-100"></div>
          <div className="flex items-center gap-2 text-slate-600">
            <div className="w-8 h-8 bg-slate-50 rounded-lg flex items-center justify-center">
              <Eye size={16} className="text-slate-500" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">Max Guests</p>
              <p className="text-sm font-bold text-slate-700">{property.max_guest}</p>
            </div>
          </div>
        </div>

        {/* Price & Action */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-1">
              <p className="text-2xl font-bold text-slate-800">
                ₹{property.price.toLocaleString()}
              </p>
              <p className="text-xs text-slate-400 font-medium">
                /{property.price_unit}
              </p>
            </div>
            <p className="text-xs text-emerald-600 font-medium mt-1">
              ✨ Best price in area
            </p>
          </div>
          
          <button
            onClick={() => navigate(`/owner/properties/edit/${property.id}`)}
            className="group/btn relative overflow-hidden bg-gradient-to-r from-slate-800 to-slate-700 hover:from-slate-700 hover:to-slate-600 text-white px-5 py-2.5 rounded-xl font-semibold transition-all duration-300 shadow-md hover:shadow-lg"
          >
            <span className="relative z-10 flex items-center gap-2">
              Manage
              <ChevronRight size={16} className="group-hover/btn:translate-x-1 transition-transform duration-300" />
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent translate-x-full group-hover/btn:translate-x-0 transition-transform duration-500"></div>
          </button>
        </div>
      </div>
      
      {/* Hover Border Effect */}
      <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-slate-200 transition-all duration-500 pointer-events-none"></div>
    </div>
  );
};

export default PropertyCard;