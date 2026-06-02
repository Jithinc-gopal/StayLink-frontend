import {
  MapPin,
  CreditCard,
  Building2,
  Search,
  Star,
  Wifi,
  Coffee,
  Tv,
  Wind,
  Bath,
  Utensils,
  Globe,
  Dumbbell,
} from "lucide-react";

import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Hero() {
  const navigate = useNavigate();

  const [filters, setFilters] = useState({
    location: "",
    guests: "",
    max_price: "",
    property_type: "",
  });

  // ================= HANDLE CHANGE =================
  const handleChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  // ================= SEARCH =================
  const handleSearch = () => {
    const queryParams = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        queryParams.append(key, value);
      }
    });

    navigate(`/stays?${queryParams.toString()}`);
  };

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-4 md:px-6 py-12 overflow-hidden bg-gradient-to-b from-[#F8FAFE] via-white to-white">
      {/* Decorative background elements using new color palette */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 right-[-200px] w-[500px] h-[500px] rounded-full bg-[#0052CC] opacity-5 blur-3xl" />
        <div className="absolute bottom-20 left-[-200px] w-[400px] h-[400px] rounded-full bg-[#36B37E] opacity-5 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-[#FEBB02] opacity-5 blur-3xl" />
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 w-full max-w-7xl mx-auto">
        
        {/* Hero Image Card - Pinterest Style */}
        <div className="relative w-full h-[500px] md:h-[600px] rounded-3xl overflow-hidden shadow-2xl mb-12">
          <img 
            src="https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop"
            alt="Luxury hotel suite with ocean view"
            className="w-full h-full object-cover"
          />
          
          {/* Gradient Overlay using neutral */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#172B4D]/80 via-[#172B4D]/20 to-transparent" />
          
          {/* Floating Card on Image */}
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 text-white">
            <div className="flex flex-wrap items-center gap-4 mb-3">
              <div className="flex items-center gap-1 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full">
                <Star size={14} className="fill-[#FEBB02] text-[#FEBB02]" />
                <span className="text-sm font-medium">4.7</span>
                <span className="text-xs opacity-80">From Google Reviews</span>
              </div>
              <div className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full">
                <span className="text-sm font-medium">$299</span>
                <span className="text-xs opacity-80">/night</span>
              </div>
            </div>
            
            <h2 className="font-headline text-3xl md:text-5xl font-bold mb-2 max-w-2xl">
              The Best Coolest Place Where Luxury Meets Affordability
            </h2>
            <p className="text-base md:text-lg opacity-90 max-w-xl">
              Experience unparalleled comfort and elegance in the heart of paradise.
            </p>
          </div>

          {/* Luxury Rooms Badge - Top Right */}
          <div className="absolute top-6 right-6 bg-white/90 backdrop-blur-md rounded-xl px-4 py-3 shadow-lg">
            <p className="text-xs uppercase tracking-wider text-[#0052CC] font-medium">Luxury Rooms</p>
            <p className="text-sm text-[#172B4D] font-headline">The ultimate luxury accommodation experience.</p>
          </div>
        </div>

        {/* Contact Banner - using neutral and primary */}
      

        {/* SEARCH BAR - Premium Card */}
        <div className="w-full bg-white p-3 rounded-2xl shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] border border-gray-100 flex flex-col md:flex-row gap-1 mb-16">
          
          {/* LOCATION */}
          <div className="flex-1 flex items-center px-4 py-3.5 gap-3 border-r border-gray-100">
            <MapPin size={20} className="text-[#0052CC]" />
            <div className="flex flex-col w-full">
              <span className="text-[9px] font-label uppercase tracking-[0.2em] text-[#0052CC] font-semibold">
                Location
              </span>
              <input
                type="text"
                name="location"
                value={filters.location}
                onChange={handleChange}
                placeholder="Kochi, Kerala"
                className="bg-transparent outline-none font-body text-[#172B4D] text-sm placeholder:text-[#A0AEC0] w-full"
              />
            </div>
          </div>

          {/* GUESTS */}
          <div className="flex-1 flex items-center px-4 py-3.5 gap-3 border-r border-gray-100">
            <CreditCard size={20} className="text-[#0052CC]" />
            <div className="flex flex-col w-full">
              <span className="text-[9px] font-label uppercase tracking-[0.2em] text-[#0052CC] font-semibold">
                Guests
              </span>
              <input
                type="number"
                name="guests"
                value={filters.guests}
                onChange={handleChange}
                placeholder="2"
                className="bg-transparent outline-none font-body text-[#172B4D] text-sm placeholder:text-[#A0AEC0] w-full"
              />
            </div>
          </div>

          {/* MAX PRICE */}
          <div className="flex-1 flex items-center px-4 py-3.5 gap-3 border-r border-gray-100">
            <CreditCard size={20} className="text-[#0052CC]" />
            <div className="flex flex-col w-full">
              <span className="text-[9px] font-label uppercase tracking-[0.2em] text-[#0052CC] font-semibold">
                Max Price
              </span>
              <input
                type="number"
                name="max_price"
                value={filters.max_price}
                onChange={handleChange}
                placeholder="5000"
                className="bg-transparent outline-none font-body text-[#172B4D] text-sm placeholder:text-[#A0AEC0] w-full"
              />
            </div>
          </div>

          {/* PROPERTY TYPE */}
          <div className="flex-1 flex items-center px-4 py-3.5 gap-3 md:border-r-0">
            <Building2 size={20} className="text-[#0052CC]" />
            <div className="flex flex-col w-full">
              <span className="text-[9px] font-label uppercase tracking-[0.2em] text-[#0052CC] font-semibold">
                Property Type
              </span>
              <select
                name="property_type"
                value={filters.property_type}
                onChange={handleChange}
                className="bg-transparent outline-none font-body text-[#172B4D] text-sm w-full cursor-pointer"
              >
                <option value="">All</option>
                <option value="villa">Villa</option>
                <option value="apartment">Apartment</option>
                <option value="room">Room</option>
                <option value="hostel">Hostel</option>
                <option value="pg">PG</option>
              </select>
            </div>
          </div>

          {/* SEARCH BUTTON */}
          <button
            onClick={handleSearch}
            className="bg-[#0052CC] text-white px-8 py-4 rounded-xl font-body font-semibold hover:bg-[#0041A3] transition-all duration-300 flex items-center justify-center gap-2 shadow-sm hover:shadow-md min-w-[140px]"
          >
            <Search size={18} />
            Explore
          </button>
        </div>

  
      </div>
    </section>
  );
}