import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getAdminUserDetail,
  toggleAdminUserBlock,
} from "../../services/adminService";
import {
  ArrowLeft,
  User,
  Mail,
  Calendar,
  Clock,
  Shield,
  CheckCircle,
  XCircle,
  AlertCircle,
  Users,
  Building2,
  Briefcase,
  Phone,
  MapPin,
  Award,
  FileText,
  Image as ImageIcon,
  Package,
  Star,
  Activity,
  Crown,
  UserCheck,
  UserX,
  Edit,
  MoreVertical
} from "lucide-react";

export default function AdminUserDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUserDetail = async () => {
    try {
      setLoading(true);
      const data = await getAdminUserDetail(id);
      setUser(data);
    } catch (error) {
      console.error(error);
      alert("Failed to load user detail");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserDetail();
  }, [id]);

  const handleBlockToggle = async () => {
    const action = user.is_active ? "block" : "unblock";

    if (!window.confirm(`Are you sure you want to ${action} this user?`)) {
      return;
    }

    try {
      await toggleAdminUserBlock(user.id);
      alert(`User ${action}ed successfully`);
      fetchUserDetail();
    } catch (error) {
      alert(error.response?.data?.error || "Action failed");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-3 border-slate-200 border-t-[#003D9B] rounded-full animate-spin mx-auto"></div>
          <div>
            <p className="text-slate-600 font-medium">Loading user details...</p>
            <p className="text-slate-400 text-sm">Please wait</p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <User className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-slate-900">User not found</h2>
          <p className="text-slate-500 mt-1">The user you're looking for doesn't exist</p>
          <button
            onClick={() => navigate("/admin/users")}
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-[#003D9B] text-white rounded-lg hover:bg-[#003D9B]/90 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Users
          </button>
        </div>
      </div>
    );
  }

  const getInitials = () => {
    const first = user.first_name?.charAt(0) || '';
    const last = user.last_name?.charAt(0) || '';
    return (first + last).toUpperCase() || 'U';
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        
        {/* Header with Navigation */}
        <div className="mb-6">
          <button
            onClick={() => navigate("/admin/users")}
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Users
          </button>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200/80 px-6 py-5 lg:px-8 lg:py-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-[#003D9B]/10 text-[#003D9B] flex items-center justify-center text-2xl font-bold">
                  {getInitials()}
                </div>
                <div>
                  <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 tracking-tight">
                    {user.first_name || "No Name"} {user.last_name || ""}
                  </h1>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-sm text-slate-500 flex items-center gap-1">
                      <Mail className="w-4 h-4" />
                      {user.email}
                    </span>
                    <span className="text-sm text-slate-500 flex items-center gap-1">
                      <Shield className="w-4 h-4" />
                      {user.role}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-3 flex-wrap">
                <StatusBadge status={user.is_active} />
                <button
                  onClick={handleBlockToggle}
                  className={`inline-flex items-center gap-2 px-4 py-2 text-white rounded-lg transition-colors text-sm font-medium ${
                    user.is_active 
                      ? 'bg-red-600 hover:bg-red-700' 
                      : 'bg-emerald-600 hover:bg-emerald-700'
                  }`}
                >
                  {user.is_active ? (
                    <>
                      <UserX className="w-4 h-4" />
                      Block User
                    </>
                  ) : (
                    <>
                      <UserCheck className="w-4 h-4" />
                      Unblock User
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <QuickStat 
            icon={<Calendar className="w-5 h-5" />}
            label="Joined"
            value={new Date(user.date_joined).toLocaleDateString()}
            color="indigo"
          />
          <QuickStat 
            icon={<Clock className="w-5 h-5" />}
            label="Last Login"
            value={user.last_login ? new Date(user.last_login).toLocaleDateString() : "Never"}
            color="emerald"
          />
          <QuickStat 
            icon={<CheckCircle className="w-5 h-5" />}
            label="Profile Status"
            value={user.profile_completed ? "Completed" : "Incomplete"}
            color={user.profile_completed ? "emerald" : "amber"}
          />
          <QuickStat 
            icon={<Users className="w-5 h-5" />}
            label="Total Bookings"
            value={user.total_bookings ?? 0}
            color="blue"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column - Main Details */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Account Information */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200/80 p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Account Information</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InfoItem 
                  icon={<User className="w-4 h-4" />}
                  label="Full Name"
                  value={`${user.first_name || "N/A"} ${user.last_name || ""}`.trim()}
                />
                <InfoItem 
                  icon={<Mail className="w-4 h-4" />}
                  label="Email"
                  value={user.email}
                />
                <InfoItem 
                  icon={<Shield className="w-4 h-4" />}
                  label="Role"
                  value={user.role}
                />
                <InfoItem 
                  icon={<CheckCircle className="w-4 h-4" />}
                  label="Staff Status"
                  value={user.is_staff ? "Yes" : "No"}
                />
              </div>
            </div>

            {/* Traveler Details */}
            {user.role === "user" && (
              <div className="bg-white rounded-xl shadow-sm border border-slate-200/80 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Users className="w-5 h-5 text-indigo-600" />
                  <h2 className="text-lg font-semibold text-slate-900">Traveler Details</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <InfoItem 
                    icon={<Package className="w-4 h-4" />}
                    label="Total Bookings"
                    value={user.total_bookings ?? 0}
                  />
                  <InfoItem 
                    icon={<Star className="w-4 h-4" />}
                    label="Booking Status"
                    value={user.total_bookings > 0 ? "Active" : "No bookings"}
                  />
                </div>
              </div>
            )}

            {/* Owner Profile */}
            {user.owner_profile && (
              <ProfileSection 
                title="Owner Profile"
                icon={<Building2 className="w-5 h-5" />}
                profile={user.owner_profile}
              />
            )}

            {/* Broker Profile */}
            {user.broker_profile && (
              <ProfileSection 
                title="Broker Profile"
                icon={<Briefcase className="w-5 h-5" />}
                profile={user.broker_profile}
                isBroker
              />
            )}
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            
            {/* Account Status */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200/80 p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-3">Account Status</h2>
              <div className="space-y-3">
                <StatusInfo 
                  label="Account Status"
                  value={
                    user.is_active ? (
                      <span className="text-emerald-600 font-medium flex items-center gap-1">
                        <CheckCircle className="w-4 h-4" />
                        Active
                      </span>
                    ) : (
                      <span className="text-red-600 font-medium flex items-center gap-1">
                        <XCircle className="w-4 h-4" />
                        Blocked
                      </span>
                    )
                  }
                />
                <StatusInfo 
                  label="Profile"
                  value={
                    user.profile_completed ? (
                      <span className="text-emerald-600 font-medium">Complete</span>
                    ) : (
                      <span className="text-amber-600 font-medium">Incomplete</span>
                    )
                  }
                />
                <StatusInfo 
                  label="Staff"
                  value={user.is_staff ? "Yes" : "No"}
                />
                <StatusInfo 
                  label="Date Joined"
                  value={new Date(user.date_joined).toLocaleString()}
                />
                {user.last_login && (
                  <StatusInfo 
                    label="Last Login"
                    value={new Date(user.last_login).toLocaleString()}
                  />
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200/80 p-6">
              <h3 className="text-sm font-semibold text-slate-900 mb-3">Quick Actions</h3>
              <div className="space-y-2">
                <button className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 rounded-lg transition-colors flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Send Message
                </button>
                <button className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 rounded-lg transition-colors flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  View Activity Log
                </button>
                <button 
                  onClick={handleBlockToggle}
                  className={`w-full text-left px-4 py-2.5 text-sm rounded-lg transition-colors flex items-center gap-2 ${
                    user.is_active 
                      ? 'text-red-600 hover:bg-red-50' 
                      : 'text-emerald-600 hover:bg-emerald-50'
                  }`}
                >
                  {user.is_active ? (
                    <>
                      <UserX className="w-4 h-4" />
                      Block User
                    </>
                  ) : (
                    <>
                      <UserCheck className="w-4 h-4" />
                      Unblock User
                    </>
                  )}
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
    indigo: "bg-indigo-50 text-indigo-600",
    emerald: "bg-emerald-50 text-emerald-600",
    amber: "bg-amber-50 text-amber-600",
    blue: "bg-blue-50 text-blue-600",
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

function InfoItem({ icon, label, value }) {
  return (
    <div className="bg-slate-50 rounded-lg p-3">
      <div className="flex items-center gap-2 text-slate-600">
        {icon}
        <span className="text-xs font-medium">{label}</span>
      </div>
      <p className="text-sm font-semibold text-slate-900 mt-1">{value || "N/A"}</p>
    </div>
  );
}

function StatusInfo({ label, value }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
      <span className="text-sm text-slate-500">{label}</span>
      <span className="text-sm font-medium">{value}</span>
    </div>
  );
}

function StatusBadge({ status }) {
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${
      status 
        ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
        : 'bg-red-50 text-red-700 border-red-200'
    }`}>
      {status ? (
        <CheckCircle className="w-3.5 h-3.5" />
      ) : (
        <XCircle className="w-3.5 h-3.5" />
      )}
      {status ? 'Active' : 'Blocked'}
    </span>
  );
}

function ProfileSection({ title, icon, profile, isBroker }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200/80 p-6">
      <div className="flex items-center gap-2 mb-4">
        {icon}
        <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {profile.verification_status && (
          <InfoItem 
            icon={<Award className="w-4 h-4" />}
            label="Verification Status"
            value={profile.verification_status}
          />
        )}
        {profile.agency_name && (
          <InfoItem 
            icon={<Building2 className="w-4 h-4" />}
            label="Agency Name"
            value={profile.agency_name}
          />
        )}
        {profile.city && (
          <InfoItem 
            icon={<MapPin className="w-4 h-4" />}
            label="City"
            value={profile.city}
          />
        )}
        {profile.phone && (
          <InfoItem 
            icon={<Phone className="w-4 h-4" />}
            label="Phone"
            value={profile.phone}
          />
        )}
        {isBroker && profile.experience && (
          <InfoItem 
            icon={<Award className="w-4 h-4" />}
            label="Experience"
            value={`${profile.experience} years`}
          />
        )}
        {isBroker && profile.license_number && (
          <InfoItem 
            icon={<FileText className="w-4 h-4" />}
            label="License Number"
            value={profile.license_number}
          />
        )}
      </div>

      {profile.profile_image && (
        <div className="mt-4 pt-4 border-t border-slate-200/60">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">
            Profile Image
          </p>
          <img
            src={profile.profile_image}
            alt="Profile"
            className="w-24 h-24 rounded-lg object-cover border border-slate-200"
          />
        </div>
      )}
      
      {profile.id_proof && (
        <div className="mt-3">
          <a
            href={profile.id_proof}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 rounded-lg text-sm text-slate-700 transition-colors border border-slate-200"
          >
            <FileText className="w-4 h-4" />
            View ID Proof
          </a>
        </div>
      )}
    </div>
  );
}