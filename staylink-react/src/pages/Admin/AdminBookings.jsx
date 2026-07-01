import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getAdminBookingSummary,
  getAdminBookings,
} from "../../services/adminService";
import {
  CalendarDays,
  Users,
  DollarSign,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Search,
  Filter,
  Eye,
  ArrowUpRight,
  Building2,
  User,
  Mail,
  Calendar,
  CreditCard,
  TrendingUp,
  Package,
  ChevronDown,
  Download
} from "lucide-react";

export default function AdminBookings() {
  const navigate = useNavigate();

  const [summary, setSummary] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [count, setCount] = useState(0);

  const [status, setStatus] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);

  const fetchBookingsPage = async () => {
    try {
      setLoading(true);

      const summaryData = await getAdminBookingSummary();

      const bookingData = await getAdminBookings({
        status,
        payment_status: paymentStatus,
        search,
      });

      setSummary(summaryData);
      setBookings(bookingData.results || []);
      setCount(bookingData.count || 0);
    } catch (error) {
      console.error(error);
      alert("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookingsPage();
  }, []);

  const handleApplyFilters = () => {
    fetchBookingsPage();
  };

  const handleResetFilters = () => {
    setStatus("");
    setPaymentStatus("");
    setSearch("");
    setTimeout(() => fetchBookingsPage(), 0);
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
                    <CalendarDays className="w-5 h-5" />
                  </div>
                  <div>
                    <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 tracking-tight">
                      Bookings
                    </h1>
                    <p className="text-sm text-slate-500">
                      Manage and track all bookings
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-3 flex-wrap">
                <button className="inline-flex items-center gap-2 px-4 py-2 bg-[#003D9B] text-white rounded-lg hover:bg-[#003D9B]/90 transition-colors text-sm font-medium">
                  <Download className="w-4 h-4" />
                  Export
                </button>
              </div>
            </div>

            {/* Summary Cards */}
            {summary && (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3 mt-6">
                <SummaryCard 
                  title="Total" 
                  value={summary.total} 
                  icon={<Package className="w-4 h-4" />}
                  color="indigo"
                />
                <SummaryCard 
                  title="Confirmed" 
                  value={summary.confirmed} 
                  icon={<CheckCircle className="w-4 h-4" />}
                  color="emerald"
                />
                <SummaryCard 
                  title="Completed" 
                  value={summary.completed} 
                  icon={<CheckCircle className="w-4 h-4" />}
                  color="blue"
                />
                <SummaryCard 
                  title="Cancelled" 
                  value={summary.cancelled} 
                  icon={<XCircle className="w-4 h-4" />}
                  color="red"
                />
                <SummaryCard 
                  title="Pending Payment" 
                  value={summary.pending_payment} 
                  icon={<Clock className="w-4 h-4" />}
                  color="amber"
                />
                <SummaryCard 
                  title="On Hold" 
                  value={summary.on_hold} 
                  icon={<AlertCircle className="w-4 h-4" />}
                  color="amber"
                />
                <SummaryCard 
                  title="Revenue" 
                  value={`₹${summary.total_revenue || 0}`} 
                  icon={<TrendingUp className="w-4 h-4" />}
                  color="emerald"
                />
              </div>
            )}
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
                placeholder="Search by email, property, or booking ID..."
                className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003D9B]/20 focus:border-[#003D9B] transition-colors text-sm"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3 flex-1 lg:flex-none">
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003D9B]/20 focus:border-[#003D9B] transition-colors text-sm bg-white min-w-[160px]"
              >
                <option value="">Booking Status</option>
                <option value="hold">On Hold</option>
                <option value="pending_payment">Pending Payment</option>
                <option value="confirmed">Confirmed</option>
                <option value="cancelled">Cancelled</option>
                <option value="completed">Completed</option>
              </select>

              <select
                value={paymentStatus}
                onChange={(e) => setPaymentStatus(e.target.value)}
                className="px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003D9B]/20 focus:border-[#003D9B] transition-colors text-sm bg-white min-w-[160px]"
              >
                <option value="">Payment Status</option>
                <option value="advance_paid">Advance Paid</option>
                <option value="full_paid">Full Paid</option>
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
            Showing <span className="font-semibold text-slate-700">{bookings.length}</span> of <span className="font-semibold text-slate-700">{count}</span> bookings
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
            <p className="text-slate-600 font-medium">Loading bookings...</p>
          </div>
        ) : bookings.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200/80 p-12 text-center">
            <Package className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900">No bookings found</h3>
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
                      Booking
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Traveler
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Property
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Dates
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Guests
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Payment
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {bookings.map((booking, index) => (
                    <tr
                      key={booking.id}
                      className={`hover:bg-slate-50 transition-colors ${
                        index !== bookings.length - 1 ? 'border-b border-slate-100' : ''
                      }`}
                    >
                      <td className="px-4 py-3">
                        <span className="text-sm font-medium text-slate-900">
                          {booking.id}
                        </span>
                      </td>

                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center text-xs font-semibold">
                            {(booking.traveler_name || 'T')[0].toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-slate-900">
                              {booking.traveler_name || "Traveler"}
                            </p>
                            <p className="text-xs text-slate-500 flex items-center gap-1">
                              <Mail className="w-3 h-3" />
                              {booking.traveler_email}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-3">
                        <div>
                          <p className="text-sm font-medium text-slate-900">
                            {booking.property_title}
                          </p>
                          <p className="text-xs text-slate-500 flex items-center gap-1">
                            <Building2 className="w-3 h-3" />
                            {booking.property_city}
                          </p>
                          <p className="text-xs text-slate-400">
                            Owner: {booking.owner_email}
                          </p>
                        </div>
                      </td>

                      <td className="px-4 py-3">
                        <div>
                          <p className="text-sm text-slate-700">{booking.check_in}</p>
                          <p className="text-xs text-slate-500">→ {booking.check_out}</p>
                        </div>
                      </td>

                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-1 text-sm text-slate-700">
                          <Users className="w-3.5 h-3.5" />
                          {booking.guests_count}
                        </span>
                      </td>

                      <td className="px-4 py-3">
                        <div>
                          <p className="text-sm font-semibold text-slate-900">
                            ₹{booking.total_amount}
                          </p>
                          <p className="text-xs text-slate-500">
                            Advance: ₹{booking.advance_amount}
                          </p>
                        </div>
                      </td>

                      <td className="px-4 py-3">
                        <StatusBadge status={booking.status} />
                      </td>

                      <td className="px-4 py-3">
                        <PaymentBadge status={booking.payment_status} />
                      </td>

                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => navigate(`/admin/bookings/${booking.id}`)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#003D9B] text-white rounded-lg hover:bg-[#003D9B]/90 transition-colors text-xs font-medium"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          View
                        </button>
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
    confirmed: "bg-emerald-50 text-emerald-700 border-emerald-200",
    completed: "bg-blue-50 text-blue-700 border-blue-200",
    cancelled: "bg-red-50 text-red-700 border-red-200",
    hold: "bg-amber-50 text-amber-700 border-amber-200",
    pending_payment: "bg-amber-50 text-amber-700 border-amber-200",
  };

  const labels = {
    hold: "On Hold",
    pending_payment: "Pending Payment",
  };

  const currentStyle = styles[status] || styles.pending_payment;
  const displayLabel = labels[status] || status;

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${currentStyle}`}>
      {displayLabel}
    </span>
  );
}

function PaymentBadge({ status }) {
  const styles = {
    full_paid: "bg-emerald-50 text-emerald-700 border-emerald-200",
    advance_paid: "bg-blue-50 text-blue-700 border-blue-200",
  };

  const labels = {
    full_paid: "Full Paid",
    advance_paid: "Advance Paid",
  };

  const currentStyle = styles[status] || styles.advance_paid;
  const displayLabel = labels[status] || status;

  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${currentStyle}`}>
      <CreditCard className="w-3 h-3" />
      {displayLabel}
    </span>
  );
}