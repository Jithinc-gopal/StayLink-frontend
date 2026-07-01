import { useEffect, useState } from "react";
import {
  getPendingOwners,
  approveOwner,
  rejectOwner,
} from "../../services/adminService";
import {
  Users,
  Search,
  UserCheck,
  UserX,
  Home,
  Phone,
  MapPin,
  Mail,
  User,
  Calendar,
  Shield,
  Eye,
  Clock,
  CheckCircle,
  XCircle,
  FileText,
  Image,
  Building2,
  Award
} from "lucide-react";

export default function AdminOwnerApprovals() {
  const [owners, setOwners] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchOwners = async () => {
    try {
      setLoading(true);
      const data = await getPendingOwners(search);
      setOwners(data.results || []);
    } catch (error) {
      console.error(error);
      alert("Failed to load pending owners");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOwners();
  }, []);

  const handleApprove = async (id) => {
    if (!window.confirm("Are you sure you want to approve this owner?")) return;

    try {
      await approveOwner(id);
      alert("Owner approved successfully");
      fetchOwners();
    } catch (error) {
      alert(error.response?.data?.error || "Approval failed");
    }
  };

  const handleReject = async (id) => {
    const reason = prompt("Please enter a rejection reason:");

    if (!reason || !reason.trim()) {
      alert("Rejection reason is required");
      return;
    }

    try {
      await rejectOwner(id, reason);
      alert("Owner rejected successfully");
      fetchOwners();
    } catch (error) {
      alert(error.response?.data?.error || "Rejection failed");
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchOwners();
  };

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
                    <Home className="w-5 h-5" />
                  </div>
                  <div>
                    <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 tracking-tight">
                      Owner Approvals
                    </h1>
                    <p className="text-sm text-slate-500">
                      Review and manage pending property owner applications
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 text-amber-700 rounded-full border border-amber-200">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    {owners.length} Pending
                  </span>
                </div>
              </div>
            </div>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="mt-5 pt-5 border-t border-slate-200/60">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search by name, email, city, or phone..."
                    className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003D9B]/20 focus:border-[#003D9B] transition-colors text-sm"
                  />
                </div>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#003D9B] text-white rounded-lg hover:bg-[#003D9B]/90 transition-colors text-sm font-medium whitespace-nowrap"
                >
                  Search
                </button>
                {search && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearch("");
                      setTimeout(fetchOwners, 0);
                    }}
                    className="px-4 py-2.5 text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors text-sm font-medium border border-slate-200"
                  >
                    Clear
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* Results Info */}
        {!loading && owners.length > 0 && (
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-slate-500">
              Showing <span className="font-semibold text-slate-700">{owners.length}</span> pending applications
            </p>
          </div>
        )}

        {/* Content */}
        {loading ? (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200/80 p-12 text-center">
            <div className="w-12 h-12 border-3 border-slate-200 border-t-[#003D9B] rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-600 font-medium">Loading applications...</p>
          </div>
        ) : owners.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200/80 p-12 text-center">
            <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <UserCheck className="w-10 h-10 text-emerald-600" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900">All clear!</h3>
            <p className="text-slate-500 mt-1">No pending owner applications to review</p>
            {search && (
              <button
                onClick={() => {
                  setSearch("");
                  setTimeout(fetchOwners, 0);
                }}
                className="mt-4 px-4 py-2 bg-[#003D9B] text-white rounded-lg hover:bg-[#003D9B]/90 transition-colors text-sm"
              >
                Clear search
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {owners.map((owner) => (
              <div
                key={owner.id}
                className="bg-white rounded-xl shadow-sm border border-slate-200/80 overflow-hidden hover:shadow-md transition-shadow"
              >
                {/* Card Header */}
                <div className="bg-gradient-to-r from-[#003D9B]/5 to-indigo-50/50 px-6 py-4 border-b border-slate-200/60">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-[#003D9B]/10 text-[#003D9B] flex items-center justify-center text-lg font-semibold">
                        {(owner.user?.first_name || 'O')[0].toUpperCase()}
                      </div>
                      <div>
                        <h2 className="text-lg font-semibold text-slate-900">
                          {owner.user?.first_name || "Owner"} {owner.user?.last_name || ""}
                        </h2>
                        <div className="flex items-center gap-2 text-sm text-slate-500">
                          <Mail className="w-3.5 h-3.5" />
                          {owner.user?.email}
                        </div>
                      </div>
                    </div>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-700 rounded-full text-xs font-medium border border-amber-200">
                      <Clock className="w-3.5 h-3.5" />
                      Pending Review
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="px-6 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    {/* Left Column */}
                    <div className="space-y-3">
                      <DetailItem 
                        icon={<Phone className="w-4 h-4" />}
                        label="Phone"
                        value={owner.phone}
                      />
                      <DetailItem 
                        icon={<MapPin className="w-4 h-4" />}
                        label="Location"
                        value={`${owner.city}, ${owner.district}`}
                      />
                      <DetailItem 
                        icon={<Shield className="w-4 h-4" />}
                        label="State"
                        value={owner.state}
                      />
                    </div>

                    {/* Right Column */}
                    <div className="space-y-3">
                      <DetailItem 
                        icon={<Building2 className="w-4 h-4" />}
                        label="Pincode"
                        value={owner.pincode}
                      />
                      <DetailItem 
                        icon={<Calendar className="w-4 h-4" />}
                        label="Joined"
                        value={new Date(owner.created_at).toLocaleDateString()}
                      />
                      <DetailItem 
                        icon={<Award className="w-4 h-4" />}
                        label="Verification Status"
                        value={owner.verification_status}
                        badge
                      />
                    </div>
                  </div>

                  {/* Documents */}
                  {(owner.profile_image || owner.id_proof) && (
                    <div className="mt-4 pt-4 border-t border-slate-200/60">
                      <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">
                        Documents
                      </p>
                      <div className="flex flex-wrap gap-3">
                        {owner.profile_image && (
                          <a
                            href={owner.profile_image}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 rounded-lg text-sm text-slate-700 transition-colors border border-slate-200"
                          >
                            <Image className="w-4 h-4" />
                            Profile Image
                            <Eye className="w-3.5 h-3.5 ml-1" />
                          </a>
                        )}
                        {owner.id_proof && (
                          <a
                            href={owner.id_proof}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 rounded-lg text-sm text-slate-700 transition-colors border border-slate-200"
                          >
                            <FileText className="w-4 h-4" />
                            ID Proof
                            <Eye className="w-3.5 h-3.5 ml-1" />
                          </a>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Card Footer - Actions */}
                <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-200/60">
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleApprove(owner.id)}
                      className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors text-sm font-medium"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(owner.id)}
                      className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm font-medium"
                    >
                      <XCircle className="w-4 h-4" />
                      Reject
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
}

// Helper Components
function DetailItem({ icon, label, value, badge }) {
  return (
    <div className="flex items-start gap-2">
      <span className="text-slate-400 mt-0.5">{icon}</span>
      <div className="flex-1">
        <p className="text-xs font-medium text-slate-500">{label}</p>
        {badge ? (
          <span className="inline-flex items-center px-2 py-0.5 bg-yellow-50 text-yellow-700 rounded text-xs font-medium border border-yellow-200 mt-0.5">
            {value || "N/A"}
          </span>
        ) : (
          <p className="text-sm text-slate-900">{value || "N/A"}</p>
        )}
      </div>
    </div>
  );
}