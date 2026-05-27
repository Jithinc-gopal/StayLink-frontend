import {
  MapPin,
  BedDouble,
  Bath,
  Users,
  Star,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

export default function PropertyCard({
  property,
}) {

  const navigate = useNavigate();

  // =====================================
  // PROPERTY IMAGE
  // =====================================

  const image =

    property.images?.[0]?.image ||

    "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1200";

  // =====================================
  // OPEN PROPERTY DETAILS
  // =====================================

  const handleOpenProperty = () => {

    navigate(
      `/properties/${property.id}`
    );
  };

  return (

    <div

      onClick={handleOpenProperty}

      className="
        group
        bg-white
        rounded-3xl
        overflow-hidden
        border
        border-slate-200
        hover:shadow-2xl
        hover:-translate-y-1
        transition-all
        duration-300
        cursor-pointer
      "
    >

      {/* ================================= */}
      {/* IMAGE SECTION */}
      {/* ================================= */}

      <div className="relative h-64 overflow-hidden">

        <img
          src={image}
          alt={property.title}
          className="
            w-full
            h-full
            object-cover
            group-hover:scale-105
            transition-transform
            duration-700
          "
        />

        {/* PROPERTY TYPE */}

        <div className="absolute top-4 left-4">

          <span className="
            bg-white/90
            backdrop-blur-md
            text-slate-900
            text-xs
            font-bold
            uppercase
            tracking-wider
            px-3
            py-1.5
            rounded-full
            shadow-sm
          ">

            {property.property_type}

          </span>

        </div>

        {/* PRICE */}

        <div className="absolute bottom-4 right-4">

          <div className="
            bg-black/80
            backdrop-blur-md
            text-white
            px-4
            py-2
            rounded-2xl
          ">

            <span className="text-xl font-black">

              ₹{property.price}

            </span>

            <span className="text-sm text-slate-300 ml-1">

              /{property.price_unit}

            </span>

          </div>

        </div>

      </div>

      {/* ================================= */}
      {/* CONTENT */}
      {/* ================================= */}

      <div className="p-5">

        {/* LOCATION */}

        <div className="flex items-center justify-between">

          <div className="
            flex
            items-center
            gap-2
            text-slate-500
            text-sm
          ">

            <MapPin size={16} />

            <span>

              {property.city},
              {" "}
              {property.state}

            </span>

          </div>

          {/* STATIC RATING */}

          <div className="
            flex
            items-center
            gap-1
            text-sm
            font-semibold
            text-amber-500
          ">

            <Star
              size={15}
              fill="currentColor"
            />

            4.8

          </div>

        </div>

        {/* TITLE */}

        <h2 className="
          text-xl
          font-bold
          text-slate-900
          mt-3
          line-clamp-1
        ">

          {property.title}

        </h2>

        {/* DESCRIPTION */}

        <p className="
          mt-2
          text-sm
          text-slate-500
          line-clamp-2
          leading-6
        ">

          {property.description}

        </p>

        {/* PROPERTY DETAILS */}

        <div className="
          flex
          items-center
          justify-between
          mt-5
          pt-5
          border-t
          border-slate-100
        ">

          {/* BEDROOMS */}

          <div className="
            flex
            items-center
            gap-2
            text-slate-700
            text-sm
            font-medium
          ">

            <BedDouble size={17} />

            <span>

              {property.bedrooms}
              {" "}
              Beds

            </span>

          </div>

          {/* BATHROOMS */}

          <div className="
            flex
            items-center
            gap-2
            text-slate-700
            text-sm
            font-medium
          ">

            <Bath size={17} />

            <span>

              {property.bathrooms}
              {" "}
              Baths

            </span>

          </div>

          {/* GUESTS */}

          <div className="
            flex
            items-center
            gap-2
            text-slate-700
            text-sm
            font-medium
          ">

            <Users size={17} />

            <span>

              {property.max_guest}
              {" "}
              Guests

            </span>

          </div>

        </div>

      </div>

    </div>
  );
}