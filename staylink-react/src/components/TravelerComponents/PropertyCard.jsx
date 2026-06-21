import {
  MapPin,
  BedDouble,
  Bath,
  Users,
  Star,
  Heart,
  Share2,
  Eye,
  Wifi,
  Coffee,
  Sparkles,
  ChevronRight,
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function PropertyCard({ property }) {
  const navigate = useNavigate();

  const [isLiked, setIsLiked] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const image =
    property.images?.[0]?.image ||
    "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1200";

  const rating = Number(property.avg_rating || 0).toFixed(1);
  const reviewCount = property.review_count || 0;

  const handleOpenProperty = () => {
    navigate(`/properties/${property.id}`);
  };

  const handleLike = (e) => {
    e.stopPropagation();
    setIsLiked(!isLiked);
  };

  const handleShare = (e) => {
    e.stopPropagation();
    navigator.clipboard?.writeText(
      `${window.location.origin}/properties/${property.id}`
    );
    alert("Link copied to clipboard!");
  };

  return (
    <div
      onClick={handleOpenProperty}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-400 cursor-pointer transform hover:-translate-y-2"
    >
      <div className="relative h-72 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
        <img
          src={image}
          alt={property.title}
          className="w-full h-full object-cover transition-all duration-700 ease-out"
          style={{
            transform: isHovered ? "scale(1.08)" : "scale(1)",
          }}
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        <div className="absolute top-4 left-4 z-10">
          <span className="bg-white/95 backdrop-blur-sm text-gray-900 text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full shadow-md border border-gray-100">
            {property.property_type || "Property"}
          </span>
        </div>

        {property.is_superhost && (
          <div className="absolute top-4 left-32 z-10">
            <span className="bg-black/80 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1">
              <Sparkles size={12} />
              Superhost
            </span>
          </div>
        )}

        <div className="absolute top-4 right-4 z-10 flex gap-2">
          <button
            onClick={handleShare}
            className="bg-white/95 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-110"
          >
            <Share2 size={18} className="text-gray-700" />
          </button>

          <button
            onClick={handleLike}
            className="bg-white/95 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-110"
          >
            <Heart
              size={18}
              className={`transition-colors duration-200 ${
                isLiked
                  ? "fill-red-500 text-red-500"
                  : "text-gray-700"
              }`}
            />
          </button>
        </div>

        <div className="absolute bottom-4 left-4 right-4 z-10">
          <div className="bg-gradient-to-r from-black/90 to-black/70 backdrop-blur-md text-white px-4 py-2.5 rounded-xl flex items-center justify-between shadow-xl">
            <div>
              <span className="text-2xl font-black">
                ₹{Number(property.price || 0).toLocaleString()}
              </span>
              <span className="text-sm text-gray-300 ml-1">
                /{property.price_unit || "night"}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-5 bg-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-gray-500 text-sm">
            <MapPin size={14} />
            <span className="font-medium">
              {property.city}, {property.state || "Location"}
            </span>
          </div>

          <div className="flex items-center gap-1.5 bg-green-50 px-2.5 py-1 rounded-full">
            <Star size={14} className="text-green-600 fill-green-600" />

            <span className="text-sm font-bold text-green-700">
              {reviewCount > 0 ? rating : "New"}
            </span>

            {reviewCount > 0 && (
              <span className="text-xs text-gray-500">
                ({reviewCount})
              </span>
            )}
          </div>
        </div>

        <h2 className="text-lg font-bold text-gray-900 mt-3 line-clamp-1 group-hover:text-blue-600 transition-colors duration-200">
          {property.title}
        </h2>

        <p className="mt-2 text-sm text-gray-500 line-clamp-2 leading-relaxed">
          {property.description ||
            "Beautiful property with amazing amenities and perfect location for your stay."}
        </p>

        <div className="flex items-center gap-3 mt-3">
          {property.wifi && (
            <div className="flex items-center gap-1 text-gray-400 text-xs">
              <Wifi size={12} />
              <span>WiFi</span>
            </div>
          )}

          {property.ac && (
            <div className="flex items-center gap-1 text-gray-400 text-xs">
              <Coffee size={12} />
              <span>AC</span>
            </div>
          )}

          <div className="text-gray-300 text-xs">•</div>

          <div className="text-gray-500 text-xs">
            {property.bedrooms} beds • {property.bathrooms} baths
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-gray-100">
          <div className="flex flex-col items-center gap-1.5 p-2 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200">
            <BedDouble size={16} className="text-gray-600" />
            <span className="text-xs font-semibold text-gray-700">
              {property.bedrooms || 0} Beds
            </span>
          </div>

          <div className="flex flex-col items-center gap-1.5 p-2 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200">
            <Bath size={16} className="text-gray-600" />
            <span className="text-xs font-semibold text-gray-700">
              {property.bathrooms || 0} Baths
            </span>
          </div>

          <div className="flex flex-col items-center gap-1.5 p-2 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200">
            <Users size={16} className="text-gray-600" />
            <span className="text-xs font-semibold text-gray-700">
              {property.max_guest || 0} Guests
            </span>
          </div>
        </div>

        <div
          className={`mt-4 overflow-hidden transition-all duration-300 ease-out ${
            isHovered ? "max-h-12 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <button
            onClick={handleOpenProperty}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-md hover:shadow-lg"
          >
            <Eye size={16} />
            View Details
            <ChevronRight
              size={16}
              className="group-hover:translate-x-1 transition-transform"
            />
          </button>
        </div>
      </div>

      <div className="absolute inset-0 rounded-2xl border-2 border-blue-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </div>
  );
}