import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getAdminProperties,
  updateAdminPropertyStatus,
} from "../../services/adminService";
import {
  Building2,
  Search,
  Filter,
  Eye,
  Edit,
  Home,
  MapPin,
  DollarSign,
  User,
  Mail,
  Calendar,
  CheckCircle,
  XCircle,
  AlertCircle,
  EyeOff,
  Ban,
  TrendingUp,
  Package,
  ChevronDown,
  Image as ImageIcon,
  Plus
} from "lucide-react";

export default function AdminProperties() {
  const navigate = useNavigate();

  const [properties, setProperties] = useState([]);
  const [count, setCount] = useState(0);
  const [status, setStatus] = useState("");
  const [isAvailable, setIsAvailable] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchProperties = async () => {
    try {
      setLoading(true);

      const data = await getAdminProperties({
        status,
        is_available: isAvailable,
        search,
      });

      setProperties(data.results || []);
      setCount(data.count || 0);
    } catch (error) {
      console.error(error);
      alert("Failed to load properties");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const handleStatusChange = async (property) => {
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
      fetchProperties();
    } catch (error) {
      alert(error.response?.data?.error || "Status update failed");
    }
  };

  const handleApplyFilters = () => {
    fetchProperties();
  };

  const handleResetFilters = () => {
    setStatus("");
    setIsAvailable("");
    setSearch("");
    setTimeout(() => fetchProperties(), 0);
  };

  // Calculate summary stats
  const activeProperties = properties.filter(p => p.status === 'active').length;
  const hiddenProperties = properties.filter(p => p.status === 'hidden').length;
  const blockedProperties = properties.filter(p => p.status === 'blocked').length;
  const availableProperties = properties.filter(p => p.is_available).length;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        
        {/* Header */}
        <div className="mb-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200/80 px-6 py-5 lg:px-8 lg:py-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-[#003D9B] rounded-xl text-white">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 tracking-tight">
                      Properties
                    </h1>
                    <p className="text-sm text-slate-500">
                      Manage and monitor all property listings
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-3 flex-wrap">
                <button className="inline-flex items-center gap-2 px-4 py-2 bg-[#003D9B] text-white rounded-lg hover:bg-[#003D9B]/90 transition-colors text-sm font-medium">
                  <Plus className="w-4 h-4" />
                  Add Property
                </button>
              </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mt-5 pt-5 border-t border-slate-200/60">
              <SummaryCard 
                title="Total" 
                value={count} 
                icon={<Package className="w-4 h-4" />}
                color="indigo"
              />
              <SummaryCard 
                title="Active" 
                value={activeProperties} 
                icon={<CheckCircle className="w-4 h-4" />}
                color="emerald"
              />
              <SummaryCard 
                title="Hidden" 
                value={hiddenProperties} 
                icon={<EyeOff className="w-4 h-4" />}
                color="amber"
              />
              <SummaryCard 
                title="Blocked" 
                value={blockedProperties} 
                icon={<Ban className="w-4 h-4" />}
                color="red"
              />
              <SummaryCard 
                title="Available" 
                value={availableProperties} 
                icon={<Home className="w-4 h-4" />}
                color="blue"
              />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200/80 p-4 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by title, city, or owner..."
                className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003D9B]/20 focus:border-[#003D9B] transition-colors text-sm"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3 flex-1 lg:flex-none">
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003D9B]/20 focus:border-[#003D9B] transition-colors text-sm bg-white min-w-[150px]"
              >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="hidden">Hidden</option>
                <option value="blocked">Blocked</option>
              </select>

              <select
                value={isAvailable}
                onChange={(e) => setIsAvailable(e.target.value)}
                className="px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003D9B]/20 focus:border-[#003D9B] transition-colors text-sm bg-white min-w-[150px]"
              >
                <option value="">All Availability</option>
                <option value="true">Available</option>
                <option value="false">Unavailable</option>
              </select>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleApplyFilters}
                className="px-6 py-2.5 bg-[#003D9B] text-white rounded-lg hover:bg-[#003D9B]/90 transition-colors text-sm font-medium whitespace-nowrap"
              >
                Apply Filters
              </button>
              <button
                onClick={handleResetFilters}
                className="px-4 py-2.5 text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors text-sm font-medium border border-slate-200"
              >
                Reset
              </button>
            </div>
          </div>
        </div>

        {/* Results Info */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-slate-500">
            Showing <span className="font-semibold text-slate-700">{properties.length}</span> of <span className="font-semibold text-slate-700">{count}</span> properties
          </p>
          <div className="flex items-center gap-2">
            <button className="text-sm text-slate-500 hover:text-slate-700 flex items-center gap-1">
              Sort by
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200/80 p-12 text-center">
            <div className="w-12 h-12 border-3 border-slate-200 border-t-[#003D9B] rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-600 font-medium">Loading properties...</p>
          </div>
        ) : properties.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200/80 p-12 text-center">
            <Building2 className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900">No properties found</h3>
            <p className="text-slate-500 mt-1">Try adjusting your filters or search terms</p>
            <button
              onClick={handleResetFilters}
              className="mt-4 px-4 py-2 bg-[#003D9B] text-white rounded-lg hover:bg-[#003D9B]/90 transition-colors text-sm"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200/80 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Property
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Owner
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Available
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Bookings
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {properties.map((property, index) => (
                    <tr
                      key={property.id}
                      className={`hover:bg-slate-50 transition-colors ${
                        index !== properties.length - 1 ? 'border-b border-slate-100' : ''
                      }`}
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          {property.images?.[0]?.image ? (
                            <img
                              src={property.images[0].image}
                              alt={property.title}
                              className="w-12 h-12 rounded-lg object-cover border border-slate-200"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center border border-slate-200">
                              <ImageIcon className="w-5 h-5 text-slate-400" />
                            </div>
                          )}
                          <div>
                            <p className="text-sm font-semibold text-slate-900 line-clamp-1">
                              {property.title}
                            </p>
                            <p className="text-xs text-slate-500 capitalize">
                              {property.property_type}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-3">
                        <div>
                          <p className="text-sm font-medium text-slate-900">
                            {property.owner_name || "N/A"}
                          </p>
                          <p className="text-xs text-slate-500 flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {property.owner_email}
                          </p>
                        </div>
                      </td>

                      <td className="px-4 py-3">
                        <div>
                          <p className="text-sm text-slate-700 flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-slate-400" />
                            {property.city}
                          </p>
                          <p className="text-xs text-slate-500">{property.state}</p>
                        </div>
                      </td>

                      <td className="px-4 py-3">
                        <div>
                          <p className="text-sm font-semibold text-slate-900">
                            ₹{property.price}
                          </p>
                          <p className="text-xs text-slate-500">
                            / {property.price_unit}
                          </p>
                        </div>
                      </td>

                      <td className="px-4 py-3">
                        <StatusBadge status={property.status} />
                      </td>

                      <td className="px-4 py-3">
                        {property.is_available ? (
                          <span className="inline-flex items-center gap-1 text-sm font-medium text-emerald-600">
                            <CheckCircle className="w-4 h-4" />
                            Yes
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-sm font-medium text-red-600">
                            <XCircle className="w-4 h-4" />
                            No
                          </span>
                        )}
                      </td>

                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-1 text-sm font-medium text-slate-700">
                          <TrendingUp className="w-3.5 h-3.5 text-slate-400" />
                          {property.total_bookings}
                        </span>
                      </td>

                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => navigate(`/admin/properties/${property.id}`)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#003D9B] text-white rounded-lg hover:bg-[#003D9B]/90 transition-colors text-xs font-medium"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            View
                          </button>
                          <button
                            onClick={() => handleStatusChange(property)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors text-xs font-medium"
                          >
                            <Edit className="w-3.5 h-3.5" />
                            Status
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function SummaryCard({ title, value, icon, color }) {
  const colorMap = {
    indigo: "bg-indigo-50 text-indigo-600 border-indigo-200",
    emerald: "bg-emerald-50 text-emerald-600 border-emerald-200",
    blue: "bg-blue-50 text-blue-600 border-blue-200",
    red: "bg-red-50 text-red-600 border-red-200",
    amber: "bg-amber-50 text-amber-600 border-amber-200",
  };

  return (
    <div className="bg-slate-50 rounded-lg p-3 border border-slate-200/60">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
            {title}
          </p>
          <p className="text-lg font-bold text-slate-900 mt-0.5">
            {value ?? 0}
          </p>
        </div>
        <div className={`p-1.5 rounded-lg border ${colorMap[color]}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const styles = {
    active: "bg-emerald-50 text-emerald-700 border-emerald-200",
    hidden: "bg-amber-50 text-amber-700 border-amber-200",
    blocked: "bg-red-50 text-red-700 border-red-200",
  };

  const icons = {
    active: <CheckCircle className="w-3.5 h-3.5" />,
    hidden: <EyeOff className="w-3.5 h-3.5" />,
    blocked: <Ban className="w-3.5 h-3.5" />,
  };

  const currentStyle = styles[status] || styles.active;
  const currentIcon = icons[status] || icons.active;

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${currentStyle}`}>
      {currentIcon}
      {status}
    </span>
  );
}