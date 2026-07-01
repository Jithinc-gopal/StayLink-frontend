import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getAdminPropertyDetail,
  updateAdminPropertyStatus,
} from "../../services/adminService";
import {
  ArrowLeft,
  Building2,
  MapPin,
  DollarSign,
  Home,
  Bed,
  Bath,
  Users,
  Sofa,
  Calendar,
  TrendingUp,
  User,
  Mail,
  Phone,
  Edit,
  Eye,
  CheckCircle,
  XCircle,
  AlertCircle,
  Image as ImageIcon,
  Package,
  Clock,
  CreditCard,
  ChevronRight,
  FileText,
  CalendarDays,
  Star
} from "lucide-react";

export default function AdminPropertyDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const fetchPropertyDetail = async () => {
    try {
      setLoading(true);
      const data = await getAdminPropertyDetail(id);
      setProperty(data);
    } catch (error) {
      console.error(error);
      alert("Failed to load property detail");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPropertyDetail();
  }, [id]);

  const handleStatusChange = async () => {
    const newStatus = prompt(
      "Enter new status: active, hidden, or blocked",
      property.status
    );

    if (!newStatus) return;

    const cleanStatus = newStatus.trim().toLowerCase();

    if (!["active", "hidden", "blocked"].includes(cleanStatus)) {
      alert("Invalid status. Use active, hidden, or blocked.");
      return;
    }

    let admin_note = "";

    if (cleanStatus === "hidden" || cleanStatus === "blocked") {
      admin_note = prompt("Enter admin note / reason") || "";
    }

    try {
      await updateAdminPropertyStatus(property.id, {
        status: cleanStatus,
        admin_note,
      });

      alert("Property status updated successfully");
      fetchPropertyDetail();
    } catch (error) {
      alert(error.response?.data?.error || "Status update failed");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-3 border-slate-200 border-t-[#003D9B] rounded-full animate-spin mx-auto"></div>
          <div>
            <p className="text-slate-600 font-medium">Loading property details...</p>
            <p className="text-slate-400 text-sm">Please wait</p>
          </div>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <Building2 className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-slate-900">Property not found</h2>
          <p className="text-slate-500 mt-1">The property you're looking for doesn't exist</p>
          <button
            onClick={() => navigate("/admin/properties")}
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-[#003D9B] text-white rounded-lg hover:bg-[#003D9B]/90 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Properties
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        
        {/* Header with Navigation */}
        <div className="mb-6">
          <button
            onClick={() => navigate("/admin/properties")}
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Properties
          </button>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200/80 px-6 py-5 lg:px-8 lg:py-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-[#003D9B] rounded-xl text-white">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 tracking-tight">
                      {property.title}
                    </h1>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-sm text-slate-500 flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {property.city}, {property.state}
                      </span>
                      <span className="text-sm text-slate-500 flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        Listed: {new Date(property.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-3 flex-wrap">
                <StatusBadge status={property.status} size="lg" />
                <button
                  onClick={handleStatusChange}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors text-sm font-medium"
                >
                  <Edit className="w-4 h-4" />
                  Change Status
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <QuickStat 
            icon={<DollarSign className="w-5 h-5" />}
            label="Price"
            value={`₹${property.price} / ${property.price_unit}`}
            color="emerald"
          />
          <QuickStat 
            icon={<Home className="w-5 h-5" />}
            label="Property Type"
            value={property.property_type}
            color="indigo"
          />
          <QuickStat 
            icon={<TrendingUp className="w-5 h-5" />}
            label="Total Bookings"
            value={property.total_bookings}
            color="blue"
          />
          <QuickStat 
            icon={<DollarSign className="w-5 h-5" />}
            label="Total Revenue"
            value={`₹${property.total_revenue || 0}`}
            color="amber"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column - Main Details */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Images */}
            {property.images?.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-slate-200/80 p-6">
                <div className="grid grid-cols-2 gap-3">
                  {property.images.map((img, index) => (
                    <div
                      key={img.id}
                      className={`relative rounded-lg overflow-hidden cursor-pointer transition-all hover:shadow-md ${
                        index === activeImageIndex ? 'ring-2 ring-[#003D9B] ring-offset-2' : ''
                      }`}
                      onClick={() => setActiveImageIndex(index)}
                    >
                      <img
                        src={img.image}
                        alt={`${property.title} - ${index + 1}`}
                        className="w-full h-48 object-cover"
                      />
                      {index === activeImageIndex && (
                        <div className="absolute top-2 right-2 bg-[#003D9B] text-white text-xs px-2 py-1 rounded-full">
                          Active
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                {property.images.length > 1 && (
                  <div className="mt-3 flex justify-center gap-1">
                    {property.images.map((_, index) => (
                      <button
                        key={index}
                        className={`w-2 h-2 rounded-full transition-colors ${
                          index === activeImageIndex ? 'bg-[#003D9B]' : 'bg-slate-300'
                        }`}
                        onClick={() => setActiveImageIndex(index)}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Property Details */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200/80 p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Property Details</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <DetailItem 
                  icon={<Bed className="w-4 h-4" />}
                  label="Bedrooms"
                  value={property.bedrooms}
                />
                <DetailItem 
                  icon={<Bath className="w-4 h-4" />}
                  label="Bathrooms"
                  value={property.bathrooms}
                />
                <DetailItem 
                  icon={<Users className="w-4 h-4" />}
                  label="Max Guests"
                  value={property.max_guest}
                />
                <DetailItem 
                  icon={<Sofa className="w-4 h-4" />}
                  label="Furnished"
                  value={property.is_furnished ? "Yes" : "No"}
                />
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200/80 p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-3">Description</h2>
              <p className="text-slate-600 leading-relaxed">{property.description}</p>
            </div>

            {/* Address */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200/80 p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-3">Address</h2>
              <p className="text-slate-600">{property.address}</p>
            </div>

            {/* Admin Note */}
            {property.admin_note && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-amber-900">Admin Note</h3>
                    <p className="text-amber-800 mt-1">{property.admin_note}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Bookings */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200/80 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-slate-900">Bookings</h2>
                <span className="text-sm text-slate-500">{property.bookings?.length || 0} total</span>
              </div>

              {!property.bookings || property.bookings.length === 0 ? (
                <div className="text-center py-8">
                  <CalendarDays className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-500">No bookings found for this property</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-200">
                        <th className="px-3 py-2 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                          Traveler
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                          Dates
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                          Guests
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                          Amount
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {property.bookings.map((booking) => (
                        <tr key={booking.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                          <td className="px-3 py-3">
                            <div>
                              <p className="text-sm font-medium text-slate-900">
                                {booking.traveler_name || "Traveler"}
                              </p>
                              <p className="text-xs text-slate-500">{booking.traveler_email}</p>
                            </div>
                          </td>
                          <td className="px-3 py-3">
                            <div>
                              <p className="text-sm text-slate-700">{booking.check_in}</p>
                              <p className="text-xs text-slate-500">→ {booking.check_out}</p>
                            </div>
                          </td>
                          <td className="px-3 py-3 text-sm text-slate-700">
                            {booking.guests_count}
                          </td>
                          <td className="px-3 py-3 text-sm font-medium text-slate-900">
                            ₹{booking.total_amount}
                          </td>
                          <td className="px-3 py-3">
                            <BookingStatusBadge status={booking.status} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            
            {/* Owner Information */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200/80 p-6">
              <div className="flex items-center gap-2 mb-4">
                <User className="w-5 h-5 text-slate-600" />
                <h2 className="text-lg font-semibold text-slate-900">Property Owner</h2>
              </div>
              <div className="space-y-3">
                <ContactInfo 
                  icon={<User className="w-4 h-4" />}
                  label="Name"
                  value={property.owner_name || "N/A"}
                />
                <ContactInfo 
                  icon={<Mail className="w-4 h-4" />}
                  label="Email"
                  value={property.owner_email}
                />
                {property.owner_phone && (
                  <ContactInfo 
                    icon={<Phone className="w-4 h-4" />}
                    label="Phone"
                    value={property.owner_phone}
                  />
                )}
              </div>
            </div>

            {/* Property Status */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200/80 p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-3">Status Information</h2>
              <div className="space-y-3">
                <StatusInfo 
                  label="Current Status"
                  value={<StatusBadge status={property.status} />}
                />
                <StatusInfo 
                  label="Availability"
                  value={
                    property.is_available ? (
                      <span className="text-emerald-600 font-medium flex items-center gap-1">
                        <CheckCircle className="w-4 h-4" />
                        Available
                      </span>
                    ) : (
                      <span className="text-red-600 font-medium flex items-center gap-1">
                        <XCircle className="w-4 h-4" />
                        Unavailable
                      </span>
                    )
                  }
                />
                <StatusInfo 
                  label="Last Updated"
                  value={new Date(property.updated_at).toLocaleString()}
                />
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200/80 p-6">
              <h3 className="text-sm font-semibold text-slate-900 mb-3">Quick Actions</h3>
              <div className="space-y-2">
                <button className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 rounded-lg transition-colors flex items-center gap-2">
                  <Package className="w-4 h-4" />
                  View All Bookings
                </button>
                <button className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 rounded-lg transition-colors flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Generate Report
                </button>
                <button className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  Report Issue
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper Components
function QuickStat({ icon, label, value, color }) {
  const colorMap = {
    emerald: "bg-emerald-50 text-emerald-600",
    indigo: "bg-indigo-50 text-indigo-600",
    blue: "bg-blue-50 text-blue-600",
    amber: "bg-amber-50 text-amber-600",
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200/80 p-4">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg ${colorMap[color]}`}>
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">{label}</p>
          <p className="text-sm font-semibold text-slate-900 truncate">{value}</p>
        </div>
      </div>
    </div>
  );
}

function DetailItem({ icon, label, value }) {
  return (
    <div className="bg-slate-50 rounded-lg p-3">
      <div className="flex items-center gap-2 text-slate-600">
        {icon}
        <span className="text-xs font-medium">{label}</span>
      </div>
      <p className="text-sm font-semibold text-slate-900 mt-1">{value}</p>
    </div>
  );
}

function ContactInfo({ icon, label, value }) {
  return (
    <div className="flex items-start gap-2">
      <span className="text-slate-400 mt-0.5">{icon}</span>
      <div>
        <p className="text-xs font-medium text-slate-500">{label}</p>
        <p className="text-sm text-slate-900">{value}</p>
      </div>
    </div>
  );
}

function StatusInfo({ label, value }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
      <span className="text-sm text-slate-500">{label}</span>
      <span>{value}</span>
    </div>
  );
}

function StatusBadge({ status, size = "sm" }) {
  const styles = {
    active: "bg-emerald-50 text-emerald-700 border-emerald-200",
    hidden: "bg-amber-50 text-amber-700 border-amber-200",
    blocked: "bg-red-50 text-red-700 border-red-200",
  };

  const icons = {
    active: <CheckCircle className="w-3.5 h-3.5" />,
    hidden: <Eye className="w-3.5 h-3.5" />,
    blocked: <AlertCircle className="w-3.5 h-3.5" />,
  };

  const sizes = {
    sm: "px-2.5 py-1 text-xs",
    lg: "px-4 py-1.5 text-sm",
  };

  const currentStyle = styles[status] || styles.active;
  const currentIcon = icons[status] || icons.active;

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full font-medium border ${sizes[size]} ${currentStyle}`}>
      {currentIcon}
      {status}
    </span>
  );
}

function BookingStatusBadge({ status }) {
  const styles = {
    confirmed: "bg-emerald-50 text-emerald-700 border-emerald-200",
    completed: "bg-blue-50 text-blue-700 border-blue-200",
    cancelled: "bg-red-50 text-red-700 border-red-200",
    pending: "bg-amber-50 text-amber-700 border-amber-200",
    hold: "bg-amber-50 text-amber-700 border-amber-200",
  };

  const currentStyle = styles[status] || styles.pending;

  return (
    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium border ${currentStyle}`}>
      {status}
    </span>
  );
}