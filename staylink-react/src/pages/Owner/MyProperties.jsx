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
  DollarSign,
  Star,
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading your properties...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Properties</h1>
          <p className="text-gray-500 mt-1">
            {properties.length} {properties.length === 1 ? 'property' : 'properties'} listed
          </p>
        </div>

        {properties.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm p-12 text-center border border-gray-100">
            <Home className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No properties yet</h3>
            <p className="text-gray-500">Add your first property to get started</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => (
              <div
                key={property.id}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300"
              >
                {/* Image */}
                <div className="relative h-52 bg-gray-100">
                  {property.images?.[0]?.image ? (
                    <img
                      src={property.images[0].image}
                      alt={property.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100">
                      <Home className="w-12 h-12 text-gray-300" />
                    </div>
                  )}
                  <div className="absolute top-3 right-3">
                    <span className="px-2 py-1 bg-white/90 backdrop-blur-sm rounded-lg text-xs font-medium text-gray-700">
                      {property.property_type}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  {/* Title */}
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">
                    {property.title}
                  </h3>

                  {/* Location */}
                  <div className="flex items-center gap-1.5 text-gray-500 text-sm mb-3">
                    <MapPin size="14" />
                    <span>{property.city}, {property.state || 'Location'}</span>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-4 py-3 border-y border-gray-100 mb-3">
                    <div className="flex items-center gap-1.5 text-gray-600">
                      <BedDouble size="15" />
                      <span className="text-sm">{property.bedrooms} {property.bedrooms === 1 ? 'bed' : 'beds'}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-gray-600">
                      <Bath size="15" />
                      <span className="text-sm">{property.bathrooms} {property.bathrooms === 1 ? 'bath' : 'baths'}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-gray-600">
                      <Users size="15" />
                      <span className="text-sm">{property.max_guest} guests</span>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="mb-4">
                    <span className="text-2xl font-bold text-gray-900">₹{property.price}</span>
                    <span className="text-gray-500 text-sm"> / {property.price_unit}</span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => navigate(`/owner/properties/edit/${property.id}`)}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl transition-colors duration-200 text-sm font-medium"
                    >
                      <Pencil size="16" />
                      Edit
                    </button>
                    <button
                      onClick={() => navigate(`/owner/properties/calendar/${property.id}`)}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-green-50 hover:bg-green-100 text-green-700 rounded-xl transition-colors duration-200 text-sm font-medium"
                    >
                      <CalendarDays size="16" />
                      Calendar
                    </button>
                    <button
                      onClick={() => handleDelete(property.id)}
                      className="flex items-center justify-center px-3 py-2 bg-red-50 hover:bg-red-100 text-red-700 rounded-xl transition-colors duration-200"
                    >
                      <Trash2 size="16" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyProperties;