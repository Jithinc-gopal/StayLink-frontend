import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getAdminUsers,
  toggleAdminUserBlock,
} from "../../services/adminService";
import {
  Users,
  Search,
  Filter,
  Eye,
  UserCheck,
  UserX,
  Shield,
  Mail,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  User,
  Briefcase,
  Building2,
  ChevronDown,
  Crown,
  Activity
} from "lucide-react";

export default function AdminUsers() {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [count, setCount] = useState(0);
  const [role, setRole] = useState("");
  const [isActive, setIsActive] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      setLoading(true);

      const data = await getAdminUsers({
        role,
        is_active: isActive,
        search,
      });

      setUsers(data.results || []);
      setCount(data.count || 0);
    } catch (error) {
      console.error(error);
      alert("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleBlockToggle = async (user) => {
    const action = user.is_active ? "block" : "unblock";

    if (!window.confirm(`Are you sure you want to ${action} this user?`)) {
      return;
    }

    try {
      await toggleAdminUserBlock(user.id);
      alert(`User ${action}ed successfully`);
      fetchUsers();
    } catch (error) {
      alert(error.response?.data?.error || "Action failed");
    }
  };

  const handleApplyFilters = () => {
    fetchUsers();
  };

  const handleResetFilters = () => {
    setRole("");
    setIsActive("");
    setSearch("");
    setTimeout(() => fetchUsers(), 0);
  };

  // Calculate summary stats
  const activeUsers = users.filter(u => u.is_active).length;
  const blockedUsers = users.filter(u => !u.is_active).length;
  const travelers = users.filter(u => u.role === 'user').length;
  const owners = users.filter(u => u.role === 'owner').length;
  const brokers = users.filter(u => u.role === 'broker').length;

  const getInitials = (user) => {
    const first = user.first_name?.charAt(0) || '';
    const last = user.last_name?.charAt(0) || '';
    return (first + last).toUpperCase() || 'U';
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
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 tracking-tight">
                      Users
                    </h1>
                    <p className="text-sm text-slate-500">
                      Manage and monitor all platform users
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-3 flex-wrap">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-[#003D9B]/5 text-[#003D9B] rounded-full border border-[#003D9B]/10">
                  <Users className="w-4 h-4" />
                  <span className="text-sm font-medium">{count} Total</span>
                </div>
              </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mt-5 pt-5 border-t border-slate-200/60">
              <SummaryCard 
                title="Total" 
                value={count} 
                icon={<Users className="w-4 h-4" />}
                color="indigo"
              />
              <SummaryCard 
                title="Active" 
                value={activeUsers} 
                icon={<UserCheck className="w-4 h-4" />}
                color="emerald"
              />
              <SummaryCard 
                title="Blocked" 
                value={blockedUsers} 
                icon={<UserX className="w-4 h-4" />}
                color="red"
              />
              <SummaryCard 
                title="Travelers" 
                value={travelers} 
                icon={<User className="w-4 h-4" />}
                color="blue"
              />
              <SummaryCard 
                title="Owners/Brokers" 
                value={owners + brokers} 
                icon={<Building2 className="w-4 h-4" />}
                color="amber"
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
                placeholder="Search by name, email, or role..."
                className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003D9B]/20 focus:border-[#003D9B] transition-colors text-sm"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3 flex-1 lg:flex-none">
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003D9B]/20 focus:border-[#003D9B] transition-colors text-sm bg-white min-w-[150px]"
              >
                <option value="">All Roles</option>
                <option value="user">Traveler</option>
                <option value="owner">Owner</option>
                <option value="broker">Broker</option>
              </select>

              <select
                value={isActive}
                onChange={(e) => setIsActive(e.target.value)}
                className="px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003D9B]/20 focus:border-[#003D9B] transition-colors text-sm bg-white min-w-[150px]"
              >
                <option value="">All Status</option>
                <option value="true">Active</option>
                <option value="false">Blocked</option>
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
            Showing <span className="font-semibold text-slate-700">{users.length}</span> of <span className="font-semibold text-slate-700">{count}</span> users
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
            <p className="text-slate-600 font-medium">Loading users...</p>
          </div>
        ) : users.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200/80 p-12 text-center">
            <Users className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900">No users found</h3>
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
                      User
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Profile
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Joined
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {users.map((user, index) => (
                    <tr
                      key={user.id}
                      className={`hover:bg-slate-50 transition-colors ${
                        index !== users.length - 1 ? 'border-b border-slate-100' : ''
                      }`}
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-[#003D9B]/10 text-[#003D9B] flex items-center justify-center text-sm font-semibold">
                            {getInitials(user)}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-slate-900">
                              {user.first_name || "No Name"} {user.last_name || ""}
                            </p>
                            <p className="text-xs text-slate-500 flex items-center gap-1">
                              <Mail className="w-3 h-3" />
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-3">
                        <RoleBadge role={user.role} />
                      </td>

                      <td className="px-4 py-3">
                        {user.profile_completed ? (
                          <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600">
                            <CheckCircle className="w-3.5 h-3.5" />
                            Completed
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-600">
                            <AlertCircle className="w-3.5 h-3.5" />
                            Pending
                          </span>
                        )}
                      </td>

                      <td className="px-4 py-3">
                        <StatusBadge isActive={user.is_active} />
                      </td>

                      <td className="px-4 py-3">
                        <div>
                          <p className="text-sm text-slate-700">
                            {new Date(user.date_joined).toLocaleDateString()}
                          </p>
                          <p className="text-xs text-slate-500 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {new Date(user.date_joined).toLocaleTimeString()}
                          </p>
                        </div>
                      </td>

                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => navigate(`/admin/users/${user.id}`)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#003D9B] text-white rounded-lg hover:bg-[#003D9B]/90 transition-colors text-xs font-medium"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            View
                          </button>
                          <button
                            onClick={() => handleBlockToggle(user)}
                            className={`inline-flex items-center gap-1 px-3 py-1.5 text-white rounded-lg transition-colors text-xs font-medium ${
                              user.is_active
                                ? 'bg-red-500 hover:bg-red-600'
                                : 'bg-emerald-500 hover:bg-emerald-600'
                            }`}
                          >
                            {user.is_active ? (
                              <>
                                <UserX className="w-3.5 h-3.5" />
                                Block
                              </>
                            ) : (
                              <>
                                <UserCheck className="w-3.5 h-3.5" />
                                Unblock
                              </>
                            )}
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

function RoleBadge({ role }) {
  const styles = {
    user: "bg-blue-50 text-blue-700 border-blue-200",
    owner: "bg-emerald-50 text-emerald-700 border-emerald-200",
    broker: "bg-amber-50 text-amber-700 border-amber-200",
  };

  const icons = {
    user: <User className="w-3.5 h-3.5" />,
    owner: <Building2 className="w-3.5 h-3.5" />,
    broker: <Briefcase className="w-3.5 h-3.5" />,
  };

  const labels = {
    user: "Traveler",
    owner: "Owner",
    broker: "Broker",
  };

  const currentStyle = styles[role] || styles.user;
  const currentIcon = icons[role] || icons.user;
  const displayLabel = labels[role] || role;

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${currentStyle}`}>
      {currentIcon}
      {displayLabel}
    </span>
  );
}

function StatusBadge({ isActive }) {
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
      isActive 
        ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
        : 'bg-red-50 text-red-700 border-red-200'
    }`}>
      {isActive ? (
        <CheckCircle className="w-3.5 h-3.5" />
      ) : (
        <XCircle className="w-3.5 h-3.5" />
      )}
      {isActive ? 'Active' : 'Blocked'}
    </span>
  );
}