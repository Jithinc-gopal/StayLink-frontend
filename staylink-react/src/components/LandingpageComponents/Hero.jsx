import {
  MapPin,
  CreditCard,
  Building2,
  Search,
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

    navigate(
      `/stays?${queryParams.toString()}`
    );
  };

  return (

    <section className="relative min-h-[870px] flex flex-col items-center justify-center px-6 overflow-hidden">

      {/* Background */}

      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,_#d7e2ff66,_#f9f9ff,_#f9f9ff)]" />

      {/* Heading */}

      <div className="max-w-4xl w-full text-center mb-12">

        <h1 className="font-['Plus_Jakarta_Sans'] text-5xl md:text-7xl font-extrabold text-[#041b3c] tracking-tighter mb-6 leading-tight">

          Find your{" "}
          <span className="text-[#003d9b] italic">
            flow
          </span>

          <br />

          wherever you land.

        </h1>

        <p className="text-slate-500 text-lg md:text-xl max-w-2xl mx-auto">

          Premium stays tailored to your lifestyle.

        </p>

      </div>

      {/* SEARCH BAR */}

      <div className="w-full max-w-6xl bg-white p-2 rounded-2xl shadow-[0px_8px_40px_rgba(4,27,60,0.08)] flex flex-col md:flex-row gap-2">

        {/* LOCATION */}

        <div className="flex-1 flex items-center px-4 py-3 gap-3">

          <MapPin
            size={20}
            className="text-[#003d9b]"
          />

          <div className="flex flex-col w-full">

            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Location
            </span>

            <input
              type="text"
              name="location"
              value={filters.location}
              onChange={handleChange}
              placeholder="Kochi, Kerala"
              className="bg-transparent outline-none font-semibold text-sm"
            />

          </div>

        </div>

        {/* GUESTS */}

        <div className="flex-1 flex items-center px-4 py-3 gap-3">

          <CreditCard
            size={20}
            className="text-[#003d9b]"
          />

          <div className="flex flex-col w-full">

            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Guests
            </span>

            <input
              type="number"
              name="guests"
              value={filters.guests}
              onChange={handleChange}
              placeholder="2"
              className="bg-transparent outline-none font-semibold text-sm"
            />

          </div>

        </div>

        {/* MAX PRICE */}

        <div className="flex-1 flex items-center px-4 py-3 gap-3">

          <CreditCard
            size={20}
            className="text-[#003d9b]"
          />

          <div className="flex flex-col w-full">

            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Max Price
            </span>

            <input
              type="number"
              name="max_price"
              value={filters.max_price}
              onChange={handleChange}
              placeholder="5000"
              className="bg-transparent outline-none font-semibold text-sm"
            />

          </div>

        </div>

        {/* PROPERTY TYPE */}

        <div className="flex-1 flex items-center px-4 py-3 gap-3">

          <Building2
            size={20}
            className="text-[#003d9b]"
          />

          <div className="flex flex-col w-full">

            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Property Type
            </span>

            <select
              name="property_type"
              value={filters.property_type}
              onChange={handleChange}
              className="bg-transparent outline-none font-semibold text-sm"
            >

              <option value="">
                All
              </option>

              <option value="villa">
                Villa
              </option>

              <option value="apartment">
                Apartment
              </option>

              <option value="room">
                Room
              </option>

              <option value="hostel">
                Hostel
              </option>

              <option value="pg">
                PG
              </option>

            </select>

          </div>

        </div>

        {/* SEARCH BUTTON */}

        <button
          onClick={handleSearch}
          className="bg-gradient-to-br from-[#003d9b] to-[#0052cc] text-white px-8 py-4 rounded-xl font-bold hover:scale-[1.02] transition-transform flex items-center justify-center gap-2"
        >

          <Search size={18} />

          Search

        </button>

      </div>

    </section>
  );
}