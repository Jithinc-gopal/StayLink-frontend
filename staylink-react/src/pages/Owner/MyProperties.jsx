import { useEffect, useState } from "react";
import {
  getMyProperties,
  deleteProperty,
} from "../../services/propertyService";

import {
  Pencil,
  Trash2,
  CalendarDays,
  MapPin,
  Home,
  BedDouble,
  Bath,
  Users,
  MessageCircle,
  Star,
  Sparkles,
  ChevronRight,
  Eye,
  Clock,
  TrendingUp,
  DollarSign,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

const MyProperties = () => {

  const navigate = useNavigate();

  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProperties = async () => {
    try {
      const res = await getMyProperties();
      setProperties(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Delete this property?");
    if (!confirmDelete) return;

    try {
      await deleteProperty(id);
      fetchProperties();
    } catch (error) {
      console.log(error);
    }
  };

  const openConversations = (propertyId) => {
    navigate(`/owner/properties/${propertyId}/conversations`);
  };

  const openEdit = (propertyId) => {
    navigate(`/owner/properties/edit/${propertyId}`);
  };

  const openCalendar = (propertyId) => {
    navigate(`/owner/properties/calendar/${propertyId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-blue-600 shadow-lg"></div>
          <p className="mt-6 text-gray-600 font-medium">Loading your properties...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">

        {/* HEADER WITH STATS */}
        <div className="mb-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                My Properties
              </h1>
              <div className="flex items-center gap-2 mt-2">
                <div className="w-1 h-7 bg-gradient-to-b from-blue-500 to-blue-600 rounded-full"></div>
                <p className="text-gray-500 text-lg">
                  {properties.length} {properties.length === 1 ? "property" : "properties"} listed
                </p>
              </div>
            </div>
            
            {properties.length > 0 && (
              <div className="bg-white rounded-full px-6 py-3 shadow-sm border border-gray-200">
                <div className="flex items-center gap-2">
                  <DollarSign size={18} className="text-green-600" />
                  <span className="text-sm text-gray-600 font-medium">Total Value:</span>
                  <span className="text-lg font-bold text-gray-900">
                    ₹{properties.reduce((sum, p) => sum + Number(p.price), 0).toLocaleString()}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* EMPTY STATE */}
        {properties.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-xl p-16 text-center border border-gray-100">
            <div className="inline-block p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-full mb-6">
              <Home className="w-20 h-20 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">
              No properties yet
            </h3>
            <p className="text-gray-500 text-lg mb-8">
              Add your first property to start earning
            </p>
            <button 
              onClick={() => navigate("/owner/properties/add")}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-medium hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl"
            >
              <Sparkles size={18} />
              Add Your First Property
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {properties.map((property) => (
              <div
                key={property.id}
                className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-blue-200"
              >
                <div className="flex flex-col lg:flex-row">
                  
                  {/* LEFT SIDE - IMAGE SECTION */}
                  <div className="lg:w-2/5 relative bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                    <div className="relative h-64 lg:h-full min-h-[320px]">
                      {property.images?.[0]?.image ? (
                        <>
                          <img
                            src={property.images[0].image}
                            alt={property.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-transparent"></div>
                        </>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Home className="w-24 h-24 text-gray-300" />
                        </div>
                      )}
                      
                      {/* BADGES ON IMAGE */}
                      <div className="absolute top-4 left-4 flex gap-2">
                        <span className="px-3 py-1.5 bg-white/95 backdrop-blur-sm rounded-xl text-xs font-semibold text-gray-800 shadow-sm">
                          {property.property_type}
                        </span>
                        {property.rating && (
                          <span className="px-3 py-1.5 bg-yellow-500/95 backdrop-blur-sm rounded-xl text-xs font-semibold text-white shadow-sm flex items-center gap-1">
                            <Star size={12} fill="white" />
                            {property.rating}
                          </span>
                        )}
                      </div>
                      
                      {/* PRICE TAG ON IMAGE */}
                      <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm rounded-xl px-4 py-2 shadow-lg">
                        <div className="flex items-baseline gap-1">
                          <span className="text-2xl font-bold text-gray-900">
                            ₹{property.price}
                          </span>
                          <span className="text-gray-600 text-sm">
                            / {property.price_unit}
                          </span>
                        </div>
                      </div>

                      {/* VIEW COUNT ON IMAGE */}
                      <div className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-sm rounded-lg px-2 py-1">
                        <div className="flex items-center gap-1">
                          <Eye size={12} className="text-white" />
                          <span className="text-white text-xs">{property.views || 0} views</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* RIGHT SIDE - CONTENT & FUNCTIONS */}
                  <div className="lg:w-3/5 p-6 lg:p-8">
                    {/* TITLE & DESCRIPTION */}
                    <div className="mb-4">
                      <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                        {property.title}
                      </h3>
                      
                      {/* LOCATION */}
                      <div className="flex items-center gap-2 text-gray-500 text-sm mb-3">
                        <MapPin size={16} />
                        <span>
                          {property.city}, {property.state || "Location"}
                        </span>
                      </div>
                      
                      {/* SHORT DESCRIPTION */}
                      {property.description && (
                        <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                          {property.description}
                        </p>
                      )}
                    </div>

                    {/* SPECIFICATIONS GRID */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 py-4 border-y border-gray-100">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-50 rounded-lg">
                          <BedDouble size={18} className="text-blue-600" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Bedrooms</p>
                          <p className="text-lg font-semibold text-gray-800">{property.bedrooms}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-50 rounded-lg">
                          <Bath size={18} className="text-green-600" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Bathrooms</p>
                          <p className="text-lg font-semibold text-gray-800">{property.bathrooms}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-50 rounded-lg">
                          <Users size={18} className="text-purple-600" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Max Guests</p>
                          <p className="text-lg font-semibold text-gray-800">{property.max_guest}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-orange-50 rounded-lg">
                          <Home size={18} className="text-orange-600" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Area</p>
                          <p className="text-lg font-semibold text-gray-800">{property.area || 1000} sq.ft</p>
                        </div>
                      </div>
                    </div>

                    {/* ADDITIONAL INFO */}
                    <div className="flex items-center gap-4 mb-6 text-sm">
                      <div className="flex items-center gap-1 text-gray-500">
                        <Clock size={14} />
                        <span>Listed: {new Date(property.created_at).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-1 text-gray-500">
                        <TrendingUp size={14} />
                        <span>Booking Rate: {property.booking_rate || 0}%</span>
                      </div>
                    </div>

                    {/* ACTION BUTTONS */}
                    <div className="space-y-3">
                      <div className="flex gap-3">
                        {/* EDIT */}
                        <button
                          onClick={() => openEdit(property.id)}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl text-sm font-medium transition-all shadow-md hover:shadow-lg"
                        >
                          <Pencil size={16} />
                          Edit Property
                        </button>

                        {/* CALENDAR */}
                        <button
                          onClick={() => openCalendar(property.id)}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl text-sm font-medium transition-all shadow-md hover:shadow-lg"
                        >
                          <CalendarDays size={16} />
                          Availability
                        </button>
                      </div>

                      <div className="flex gap-3">
                        {/* MESSAGES */}
                        <button
                          onClick={() => openConversations(property.id)}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-xl text-sm font-medium transition-all shadow-md hover:shadow-lg"
                        >
                          <MessageCircle size={16} />
                          Messages & Inquiries
                        </button>

                        {/* DELETE */}
                        <button
                          onClick={() => handleDelete(property.id)}
                          className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl transition-all shadow-md hover:shadow-lg"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>

                    {/* VIEW DETAILS LINK */}
                    <button
                      onClick={() => navigate(`/properties/${property.id}`)}
                      className="w-full mt-4 flex items-center justify-center gap-2 text-gray-500 hover:text-blue-600 text-sm font-medium transition-colors group/btn pt-3 border-t border-gray-100"
                    >
                      <span>View complete property details</span>
                      <ChevronRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Custom styles */}
      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        .space-y-6 > div {
          animation: slideIn 0.4s ease-out forwards;
          opacity: 0;
        }
        
        .space-y-6 > div:nth-child(1) { animation-delay: 0.05s; }
        .space-y-6 > div:nth-child(2) { animation-delay: 0.1s; }
        .space-y-6 > div:nth-child(3) { animation-delay: 0.15s; }
        .space-y-6 > div:nth-child(4) { animation-delay: 0.2s; }
        .space-y-6 > div:nth-child(5) { animation-delay: 0.25s; }
        
        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        
        ::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        
        ::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
        
        /* Line clamp utility */
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default MyProperties;