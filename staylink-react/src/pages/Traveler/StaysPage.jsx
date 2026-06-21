import { useEffect, useState } from "react";

import {
  useSearchParams,
} from "react-router-dom";

import Navbar from "../../components/LandingpageComponents/Navbar";

import PropertyCard from "../../components/TravelerComponents/PropertyCard";
import AIChatButton from "../../components/LandingpageComponents/AIChatButton";


import {
  searchProperties,
} from "../../services/propertyService";

export default function StaysPage() {

  const [searchParams] =
    useSearchParams();

  const [properties, setProperties] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  // ================= FETCH PROPERTIES =================

  useEffect(() => {

    const fetchProperties = async () => {

      try {

        setLoading(true);

        const params = {

          location:
            searchParams.get(
              "location"
            ),

          property_type:
            searchParams.get(
              "property_type"
            ),

          guests:
            searchParams.get(
              "guests"
            ),

          max_price:
            searchParams.get(
              "max_price"
            ),
        };

        const response =
          await searchProperties(
            params
          );

        setProperties(
          response.data
        );

      } catch (error) {

        console.error(
          "Property fetch error:",
          error
        );

      } finally {

        setLoading(false);

      }
    };

    fetchProperties();

  }, [searchParams]);

  // ================= LOADING =================

  if (loading) {

    return (

      <div className="min-h-screen bg-slate-50">

        <Navbar />

        <div className="flex justify-center items-center h-[70vh]">

          <p className="text-lg text-slate-500">

            Loading properties...

          </p>

        </div>

      </div>
    );
  }

  return (

    <div className="min-h-screen bg-slate-50">

      <Navbar />

      <div className="max-w-screen-2xl mx-auto px-6 py-10">

        {/* HEADER */}

        <div className="mb-10">

          <h1 className="text-4xl font-black text-slate-900">

            Available Stays

          </h1>

          <p className="mt-2 text-slate-500">

            Discover verified stays
            across India.

          </p>

        </div>

        {/* NO RESULTS */}

        {properties.length === 0 ? (

          <div className="bg-white border border-slate-200 rounded-3xl p-16 text-center">

            <h2 className="text-2xl font-bold text-slate-900">

              No properties found

            </h2>

            <p className="text-slate-500 mt-3">

              Try changing your filters
              or location.

            </p>

          </div>

        ) : (

          /* PROPERTY GRID */

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">

            {properties.map(
              (property) => (

                <PropertyCard
                  key={property.id}
                  property={property}
                />

              )
            )}

          </div>

        )}
                     <AIChatButton />


      </div>

    </div>
  );
}