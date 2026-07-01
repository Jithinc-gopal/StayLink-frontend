import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAdminDashboardStats } from "../../services/adminService";
import AdminNotifications from "../../components/AdminComponents/AdminNotifications";
import { 
  Users, 
  UserCheck, 
  UserPlus, 
  Building2, 
  CalendarDays, 
  TrendingUp, 
  LogOut,
  Home,
  Briefcase,
  CheckCircle,
  Clock,
  XCircle,
  DollarSign,
  Package,
  LayoutDashboard,
  Bell,
  ChevronRight,
  ArrowUpRight,
  Shield,
  Crown,
  BarChart3,
  PieChart,
  Activity,
  Sparkles,
  Calendar,
  Eye,
  Star,
  MessageCircle
} from "lucide-react";

export default function AdminDashboard() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboardStats = async () => {
    try {
      const data = await getAdminDashboardStats();
      setStats(data);
    } catch (error) {
      console.error(error);
      alert("Failed to load dashboard stats");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login", { replace: true });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-3 border-slate-200 border-t-[#003D9B] rounded-full animate-spin mx-auto"></div>
          <div>
            <p className="text-slate-600 font-medium">Loading dashboard...</p>
            <p className="text-slate-400 text-sm">Please wait</p>
          </div>
        </div>
      </div>
    );
  }

  // Helper function to calculate percentage for progress bars
  const calculatePercentage = (value, total) => {
    if (!total || total === 0) return 0;
    return Math.round((value / total) * 100);
  };

  const totalUsers = stats?.users?.total || 0;
  const travelers = stats?.users?.travelers || 0;
  const owners = stats?.users?.owners || 0;
  const brokers = stats?.users?.brokers || 0;

  const totalBookings = stats?.bookings?.total || 0;
  const confirmedBookings = stats?.bookings?.confirmed || 0;
  const completedBookings = stats?.bookings?.completed || 0;
  const cancelledBookings = stats?.bookings?.cancelled || 0;

  const totalProperties = stats?.properties?.total || 0;
  const activeProperties = stats?.properties?.active || 0;
  const availableProperties = stats?.properties?.available || 0;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        
        {/* Header Section */}
        <div className="mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200/80 px-6 py-5 lg:px-8 lg:py-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="p-2.5 bg-[#003D9B] rounded-xl text-white">
                  <LayoutDashboard className="w-5 h-5" />
                </div>
                <div>
                  <h1 className="text-xl lg:text-2xl font-semibold text-slate-900">
                    Dashboard
                  </h1>
                  <p className="text-sm text-slate-500">
                    Welcome back, {user?.email?.split('@')[0] || 'Admin'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 flex-wrap">
                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium ${
                  user?.is_superuser 
                    ? 'bg-amber-50 text-amber-700 border border-amber-200' 
                    : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                }`}>
                  {user?.is_superuser ? (
                    <Crown className="w-3.5 h-3.5" />
                  ) : (
                    <Shield className="w-3.5 h-3.5" />
                  )}
                  {user?.is_superuser ? 'Super Admin' : 'Admin'}
                </div>
                
                <div className="relative">
                  <AdminNotifications />
                </div>
                
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Sign out</span>
                </button>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mt-5 pt-5 border-t border-slate-200/60">
              <div className="flex flex-wrap gap-2">
                <QuickAction 
                  onClick={() => navigate("/admin/approvals/owners")}
                  icon={<UserPlus className="w-4 h-4" />}
                  label="Owner Approvals"
                  color="emerald"
                />
                <QuickAction 
                  onClick={() => navigate("/admin/approvals/brokers")}
                  icon={<Briefcase className="w-4 h-4" />}
                  label="Broker Approvals"
                  color="blue"
                />
                <QuickAction 
                  onClick={() => navigate("/admin/users")}
                  icon={<Users className="w-4 h-4" />}
                  label="Manage Users"
                  color="indigo"
                />
                <QuickAction 
                  onClick={() => navigate("/admin/properties")}
                  icon={<Building2 className="w-4 h-4" />}
                  label="Properties"
                  color="amber"
                />
                <QuickAction 
                  onClick={() => navigate("/admin/bookings")}
                  icon={<CalendarDays className="w-4 h-4" />}
                  label="Bookings"
                  color="purple"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Summary Cards Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <SummaryCard
            title="Total Users"
            value={totalUsers}
            icon={<Users className="w-5 h-5" />}
            color="indigo"
            change="+12%"
          />
          <SummaryCard
            title="Total Bookings"
            value={totalBookings}
            icon={<CalendarDays className="w-5 h-5" />}
            color="purple"
            change="+8%"
          />
          <SummaryCard
            title="Total Revenue"
            value={`₹${stats?.revenue?.total_booking_amount || 0}`}
            icon={<DollarSign className="w-5 h-5" />}
            color="emerald"
            change="+15%"
          />
          <SummaryCard
            title="Active Properties"
            value={activeProperties}
            icon={<Building2 className="w-5 h-5" />}
            color="blue"
            change="+5%"
          />
        </div>

        {/* Charts and Analytics Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* User Distribution Chart */}
          <div className="lg:col-span-1 bg-white rounded-xl shadow-sm border border-slate-200/80 p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-semibold text-slate-900">User Distribution</h3>
                <p className="text-xs text-slate-500">Role breakdown</p>
              </div>
              <PieChart className="w-4 h-4 text-slate-400" />
            </div>
            <div className="space-y-3">
              <ChartBar 
                label="Travelers" 
                value={travelers} 
                total={totalUsers} 
                color="bg-emerald-500"
              />
              <ChartBar 
                label="Property Owners" 
                value={owners} 
                total={totalUsers} 
                color="bg-blue-500"
              />
              <ChartBar 
                label="Brokers" 
                value={brokers} 
                total={totalUsers} 
                color="bg-amber-500"
              />
            </div>
            <div className="mt-4 pt-4 border-t border-slate-100">
              <div className="flex justify-between text-xs text-slate-500">
                <span>Total: {totalUsers} users</span>
                <span className="text-emerald-600 font-medium">+12% this month</span>
              </div>
            </div>
          </div>

          {/* Booking Status Chart */}
          <div className="lg:col-span-1 bg-white rounded-xl shadow-sm border border-slate-200/80 p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-semibold text-slate-900">Booking Status</h3>
                <p className="text-xs text-slate-500">Current distribution</p>
              </div>
              <Activity className="w-4 h-4 text-slate-400" />
            </div>
            <div className="space-y-3">
              <ChartBar 
                label="Confirmed" 
                value={confirmedBookings} 
                total={totalBookings} 
                color="bg-emerald-500"
              />
              <ChartBar 
                label="Completed" 
                value={completedBookings} 
                total={totalBookings} 
                color="bg-blue-500"
              />
              <ChartBar 
                label="Cancelled" 
                value={cancelledBookings} 
                total={totalBookings} 
                color="bg-red-500"
              />
            </div>
            <div className="mt-4 pt-4 border-t border-slate-100">
              <div className="flex justify-between text-xs text-slate-500">
                <span>Total: {totalBookings} bookings</span>
                <span className="text-emerald-600 font-medium">+8% this month</span>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="lg:col-span-1 bg-white rounded-xl shadow-sm border border-slate-200/80 p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-semibold text-slate-900">Quick Stats</h3>
                <p className="text-xs text-slate-500">At a glance</p>
              </div>
              <Sparkles className="w-4 h-4 text-slate-400" />
            </div>
            <div className="space-y-4">
              <QuickStatItem 
                label="Pending Approvals" 
                value={(stats?.approvals?.pending_owners || 0) + (stats?.approvals?.pending_brokers || 0)}
                icon={<Clock className="w-4 h-4" />}
                color="text-amber-600"
              />
              <QuickStatItem 
                label="Available Properties" 
                value={availableProperties}
                icon={<Home className="w-4 h-4" />}
                color="text-blue-600"
              />
              <QuickStatItem 
                label="Monthly Revenue" 
                value={`₹${stats?.revenue?.monthly_booking_amount || 0}`}
                icon={<TrendingUp className="w-4 h-4" />}
                color="text-emerald-600"
              />
              <QuickStatItem 
                label="Today's Bookings" 
                value={stats?.bookings?.today || 0}
                icon={<Calendar className="w-4 h-4" />}
                color="text-purple-600"
              />
            </div>
          </div>
        </div>

        {/* Detailed Stats Sections */}
        <div className="space-y-6">
          {/* Approvals Section with visual emphasis */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200/80 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-50 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">Approvals</h2>
                  <p className="text-sm text-slate-500">Pending and completed verifications</p>
                </div>
              </div>
              <button className="text-sm text-slate-400 hover:text-slate-600 transition-colors flex items-center gap-1">
                View all
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard 
                title="Pending Owners" 
                value={stats?.approvals?.pending_owners} 
                icon={<Clock className="w-5 h-5" />}
                color="amber"
                badge="Action"
              />
              <StatCard 
                title="Approved Owners" 
                value={stats?.approvals?.approved_owners} 
                icon={<CheckCircle className="w-5 h-5" />}
                color="emerald"
              />
              <StatCard 
                title="Pending Brokers" 
                value={stats?.approvals?.pending_brokers} 
                icon={<Clock className="w-5 h-5" />}
                color="amber"
                badge="Action"
              />
              <StatCard 
                title="Approved Brokers" 
                value={stats?.approvals?.approved_brokers} 
                icon={<CheckCircle className="w-5 h-5" />}
                color="emerald"
              />
            </div>
          </div>

          {/* Revenue Section */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200/80 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-50 rounded-lg">
                  <DollarSign className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">Revenue</h2>
                  <p className="text-sm text-slate-500">Financial performance overview</p>
                </div>
              </div>
              <button className="text-sm text-slate-400 hover:text-slate-600 transition-colors flex items-center gap-1">
                View all
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard 
                title="Total Revenue" 
                value={`₹${stats?.revenue?.total_booking_amount || 0}`} 
                icon={<DollarSign className="w-5 h-5" />}
                color="emerald"
                change="+15%"
              />
              <StatCard 
                title="Monthly Revenue" 
                value={`₹${stats?.revenue?.monthly_booking_amount || 0}`} 
                icon={<BarChart3 className="w-5 h-5" />}
                color="indigo"
                change="+22%"
              />
              <StatCard 
                title="Payments Received" 
                value={`₹${stats?.revenue?.total_payments_received || 0}`} 
                icon={<CheckCircle className="w-5 h-5" />}
                color="blue"
              />
              <StatCard 
                title="Paid Payments" 
                value={stats?.revenue?.total_paid_payments} 
                icon={<Package className="w-5 h-5" />}
                color="amber"
              />
            </div>
          </div>

          {/* Properties Section */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200/80 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-50 rounded-lg">
                  <Building2 className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">Properties</h2>
                  <p className="text-sm text-slate-500">Portfolio status</p>
                </div>
              </div>
              <button className="text-sm text-slate-400 hover:text-slate-600 transition-colors flex items-center gap-1">
                View all
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <StatCard 
                title="Total Properties" 
                value={totalProperties} 
                icon={<Building2 className="w-5 h-5" />}
                color="indigo"
              />
              <StatCard 
                title="Active Properties" 
                value={activeProperties} 
                icon={<CheckCircle className="w-5 h-5" />}
                color="emerald"
              />
              <StatCard 
                title="Available" 
                value={availableProperties} 
                icon={<Home className="w-5 h-5" />}
                color="blue"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Quick Action Button
function QuickAction({ onClick, icon, label, color }) {
  const colorClasses = {
    emerald: "text-emerald-600 hover:bg-emerald-50 border-emerald-200",
    blue: "text-blue-600 hover:bg-blue-50 border-blue-200",
    indigo: "text-indigo-600 hover:bg-indigo-50 border-indigo-200",
    amber: "text-amber-600 hover:bg-amber-50 border-amber-200",
    purple: "text-purple-600 hover:bg-purple-50 border-purple-200",
  };

  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border transition-all hover:shadow-sm ${colorClasses[color]}`}
    >
      {icon}
      <span className="hidden sm:inline">{label}</span>
      <span className="sm:hidden">{label.split(' ')[0]}</span>
      <ChevronRight className="w-3.5 h-3.5" />
    </button>
  );
}

// Summary Card for top row
function SummaryCard({ title, value, icon, color, change }) {
  const colorMap = {
    indigo: "bg-indigo-50 text-indigo-600",
    purple: "bg-purple-50 text-purple-600",
    emerald: "bg-emerald-50 text-emerald-600",
    blue: "bg-blue-50 text-blue-600",
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200/80 p-5 transition-all hover:shadow-md">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">{title}</p>
          <p className="text-2xl font-bold text-slate-900 mt-1.5">{value}</p>
          {change && (
            <p className="text-xs text-emerald-600 font-medium mt-1">{change}</p>
          )}
        </div>
        <div className={`p-2.5 rounded-xl ${colorMap[color]}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}

// Chart Bar Component
function ChartBar({ label, value, total, color }) {
  const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
  
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-slate-600">{label}</span>
        <span className="text-slate-900 font-medium">{value}</span>
      </div>
      <div className="w-full bg-slate-100 rounded-full h-2">
        <div 
          className={`${color} h-2 rounded-full transition-all duration-500`} 
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

// Quick Stat Item
function QuickStatItem({ label, value, icon, color }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className={color}>{icon}</span>
        <span className="text-sm text-slate-600">{label}</span>
      </div>
      <span className="text-sm font-semibold text-slate-900">{value}</span>
    </div>
  );
}

// Stat Card Component
function StatCard({ title, value, icon, color = "indigo", change, badge }) {
  const colorMap = {
    indigo: {
      bg: "bg-indigo-50",
      text: "text-indigo-600",
      border: "border-indigo-100",
      hover: "hover:border-indigo-200",
    },
    emerald: {
      bg: "bg-emerald-50",
      text: "text-emerald-600",
      border: "border-emerald-100",
      hover: "hover:border-emerald-200",
    },
    blue: {
      bg: "bg-blue-50",
      text: "text-blue-600",
      border: "border-blue-100",
      hover: "hover:border-blue-200",
    },
    amber: {
      bg: "bg-amber-50",
      text: "text-amber-600",
      border: "border-amber-100",
      hover: "hover:border-amber-200",
    },
    red: {
      bg: "bg-red-50",
      text: "text-red-600",
      border: "border-red-100",
      hover: "hover:border-red-200",
    },
    purple: {
      bg: "bg-purple-50",
      text: "text-purple-600",
      border: "border-purple-100",
      hover: "hover:border-purple-200",
    },
  };

  return (
    <div className={`relative bg-slate-50 rounded-lg border ${colorMap[color].border} ${colorMap[color].hover} p-4 transition-all hover:shadow-sm hover:-translate-y-0.5`}>
      {badge && (
        <div className="absolute -top-2 -right-2">
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700 border border-red-200">
            {badge}
          </span>
        </div>
      )}
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
            {title}
          </p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-xl font-bold text-slate-900 tracking-tight">
              {value ?? 0}
            </span>
            {change && (
              <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                {change}
              </span>
            )}
          </div>
        </div>
        {icon && (
          <div className={`p-1.5 rounded-lg ${colorMap[color].bg} ${colorMap[color].text}`}>
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}