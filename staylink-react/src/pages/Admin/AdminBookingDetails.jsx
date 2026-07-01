import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getAdminBookingDetail } from "../../services/adminService";
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  Users, 
  DollarSign, 
  CreditCard,
  Home,
  User,
  MessageSquare,
  CheckCircle,
  XCircle,
  AlertCircle,
  CalendarDays,
  Building2,
  Phone,
  Mail,
  Hash,
  Package,
  ArrowUpRight
} from "lucide-react";

export default function AdminBookingDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchBookingDetail = async () => {
    try {
      setLoading(true);

      const data = await getAdminBookingDetail(id);
      setBooking(data);
    } catch (error) {
      console.error(error);
      alert("Failed to load booking detail");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookingDetail();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-3 border-slate-200 border-t-[#003D9B] rounded-full animate-spin mx-auto"></div>
          <div>
            <p className="text-slate-600 font-medium">Loading booking details...</p>
            <p className="text-slate-400 text-sm">Please wait</p>
          </div>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">🔍</div>
          <h2 className="text-xl font-semibold text-slate-900">Booking not found</h2>
          <p className="text-slate-500 mt-1">The booking you're looking for doesn't exist</p>
          <button
            onClick={() => navigate("/admin/bookings")}
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-[#003D9B] text-white rounded-lg hover:bg-[#003D9B]/90 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Bookings
          </button>
        </div>
      </div>
    );
  }

  const getStatusIcon = (status) => {
    switch(status) {
      case 'confirmed': return <CheckCircle className="w-4 h-4" />;
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'cancelled': return <XCircle className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        
        {/* Header with Navigation */}
        <div className="mb-6">
          <button
            onClick={() => navigate("/admin/bookings")}
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Bookings
          </button>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200/80 px-6 py-5 lg:px-8 lg:py-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 tracking-tight">
                    Booking {booking.id}
                  </h1>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={booking.status} />
                    <PaymentBadge status={booking.payment_status} />
                  </div>
                </div>
                <div className="flex items-center gap-4 mt-1.5">
                  <span className="text-sm text-slate-500 flex items-center gap-1.5">
                    <Calendar className="w-4 h-4" />
                    Created: {new Date(booking.created_at).toLocaleString()}
                  </span>
                  <span className="text-sm text-slate-500 flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    Updated: {new Date(booking.updated_at).toLocaleString()}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center gap-2 flex-wrap">
                <button className="inline-flex items-center gap-2 px-4 py-2 bg-[#003D9B] text-white rounded-lg hover:bg-[#003D9B]/90 transition-colors text-sm font-medium">
                  <Package className="w-4 h-4" />
                  Download Invoice
                </button>
                <button className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-lg hover:bg-emerald-100 transition-colors text-sm font-medium border border-emerald-200">
                  <MessageSquare className="w-4 h-4" />
                  Contact Guest
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <QuickStat 
            icon={<CalendarDays className="w-5 h-5" />}
            label="Duration"
            value={`${booking.check_in} → ${booking.check_out}`}
            color="indigo"
          />
          <QuickStat 
            icon={<Users className="w-5 h-5" />}
            label="Guests"
            value={`${booking.guests_count} guests`}
            color="emerald"
          />
          <QuickStat 
            icon={<DollarSign className="w-5 h-5" />}
            label="Total Amount"
            value={`₹${booking.total_amount}`}
            color="amber"
          />
          <QuickStat 
            icon={<CreditCard className="w-5 h-5" />}
            label="Advance Paid"
            value={`₹${booking.advance_amount}`}
            color="blue"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column - Main Details */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Timeline/Details Card */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200/80 p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Booking Timeline</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <TimelineItem 
                  icon={<Calendar className="w-4 h-4" />}
                  label="Check In"
                  value={booking.check_in}
                  time={booking.check_in_time}
                  color="emerald"
                />
                <TimelineItem 
                  icon={<Calendar className="w-4 h-4" />}
                  label="Check Out"
                  value={booking.check_out}
                  time={booking.check_out_time}
                  color="blue"
                />
              </div>
            </div>

            {/* Parties Involved */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200/80 p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Parties Involved</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ContactCard
                  icon={<User className="w-5 h-5" />}
                  title="Traveler"
                  name={booking.traveler_name || "Traveler"}
                  email={booking.traveler_email}
                  phone={booking.traveler_phone || "N/A"}
                  color="indigo"
                />
                <ContactCard
                  icon={<Building2 className="w-5 h-5" />}
                  title="Property Owner"
                  name={booking.owner_name || "Owner"}
                  email={booking.owner_email}
                  phone={booking.owner_phone || "N/A"}
                  color="emerald"
                />
              </div>
            </div>

            {/* Property Details */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200/80 p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">Property</h2>
                  <p className="text-xl font-medium text-slate-800 mt-1">
                    {booking.property_title}
                  </p>
                  <p className="text-sm text-slate-500 mt-1 flex items-center gap-1">
                    <Home className="w-4 h-4" />
                    {booking.property_city}
                  </p>
                </div>
                <button className="text-sm text-[#003D9B] hover:text-[#003D9B]/80 font-medium flex items-center gap-1">
                  View Property
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Special Request */}
            {booking.special_request && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
                <div className="flex items-start gap-3">
                  <MessageSquare className="w-5 h-5 text-amber-600 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-amber-900">Special Request</h3>
                    <p className="text-amber-800 mt-1">{booking.special_request}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Payment & Status */}
          <div className="space-y-6">
            
            {/* Payment Details */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200/80 p-6">
              <div className="flex items-center gap-2 mb-4">
                <CreditCard className="w-5 h-5 text-slate-600" />
                <h2 className="text-lg font-semibold text-slate-900">Payment Details</h2>
              </div>
              
              {booking.payment ? (
                <div className="space-y-4">
                  <PaymentItem 
                    label="Payment ID"
                    value={booking.payment.id}
                    icon={<Hash className="w-4 h-4" />}
                  />
                  <PaymentItem 
                    label="Razorpay Order ID"
                    value={booking.payment.razorpay_order_id}
                    icon={<Package className="w-4 h-4" />}
                  />
                  {booking.payment.razorpay_payment_id && (
                    <PaymentItem 
                      label="Razorpay Payment ID"
                      value={booking.payment.razorpay_payment_id}
                      icon={<CreditCard className="w-4 h-4" />}
                    />
                  )}
                  <PaymentItem 
                    label="Amount"
                    value={`₹${booking.payment.amount}`}
                    icon={<DollarSign className="w-4 h-4" />}
                  />
                  <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                    <span className="text-sm text-slate-500">Status</span>
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
                      booking.payment.status === 'completed' 
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : booking.payment.status === 'pending'
                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                        : 'bg-red-50 text-red-700 border border-red-200'
                    }`}>
                      {booking.payment.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-sm text-slate-500">Created</span>
                    <span className="text-sm text-slate-700">
                      {new Date(booking.payment.created_at).toLocaleString()}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Package className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-500">No payment details found</p>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200/80 p-6">
              <h3 className="text-sm font-semibold text-slate-900 mb-3">Quick Actions</h3>
              <div className="space-y-2">
                <button className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 rounded-lg transition-colors flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  Send Message
                </button>
                <button className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 rounded-lg transition-colors flex items-center gap-2">
                  <Package className="w-4 h-4" />
                  View Invoice
                </button>
                <button className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-2">
                  <XCircle className="w-4 h-4" />
                  Cancel Booking
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Sub-components

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

function TimelineItem({ icon, label, value, time, color }) {
  const colorMap = {
    emerald: "bg-emerald-50 text-emerald-600 border-emerald-200",
    blue: "bg-blue-50 text-blue-600 border-blue-200",
  };

  return (
    <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
      <div className={`p-2 rounded-lg border ${colorMap[color]}`}>
        {icon}
      </div>
      <div>
        <p className="text-xs font-medium text-slate-500">{label}</p>
        <p className="text-sm font-semibold text-slate-900">{value}</p>
        {time && <p className="text-xs text-slate-500 mt-0.5">{time}</p>}
      </div>
    </div>
  );
}

function ContactCard({ icon, title, name, email, phone, color }) {
  const colorMap = {
    indigo: "bg-indigo-50 text-indigo-600 border-indigo-200",
    emerald: "bg-emerald-50 text-emerald-600 border-emerald-200",
  };

  return (
    <div className="p-4 bg-slate-50 rounded-lg">
      <div className="flex items-center gap-2 mb-3">
        <div className={`p-1.5 rounded-lg border ${colorMap[color]}`}>
          {icon}
        </div>
        <h3 className="text-sm font-semibold text-slate-700">{title}</h3>
      </div>
      <div className="space-y-1.5">
        <p className="text-sm font-medium text-slate-900">{name}</p>
        <p className="text-xs text-slate-500 flex items-center gap-1.5">
          <Mail className="w-3.5 h-3.5" />
          {email}
        </p>
        <p className="text-xs text-slate-500 flex items-center gap-1.5">
          <Phone className="w-3.5 h-3.5" />
          {phone}
        </p>
      </div>
    </div>
  );
}

function PaymentItem({ label, value, icon }) {
  return (
    <div className="flex items-center justify-between py-1.5">
      <div className="flex items-center gap-2">
        <span className="text-slate-400">{icon}</span>
        <span className="text-sm text-slate-600">{label}</span>
      </div>
      <span className="text-sm font-medium text-slate-900 truncate ml-4">{value}</span>
    </div>
  );
}

function StatusBadge({ status }) {
  const styles = {
    confirmed: "bg-emerald-50 text-emerald-700 border-emerald-200",
    completed: "bg-blue-50 text-blue-700 border-blue-200",
    cancelled: "bg-red-50 text-red-700 border-red-200",
    pending: "bg-amber-50 text-amber-700 border-amber-200",
  };

  const icons = {
    confirmed: <CheckCircle className="w-3.5 h-3.5" />,
    completed: <CheckCircle className="w-3.5 h-3.5" />,
    cancelled: <XCircle className="w-3.5 h-3.5" />,
    pending: <AlertCircle className="w-3.5 h-3.5" />,
  };

  const currentStyle = styles[status] || styles.pending;
  const currentIcon = icons[status] || icons.pending;

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${currentStyle}`}>
      {currentIcon}
      {status}
    </span>
  );
}

function PaymentBadge({ status }) {
  const styles = {
    full_paid: "bg-emerald-50 text-emerald-700 border-emerald-200",
    advance_paid: "bg-blue-50 text-blue-700 border-blue-200",
    pending: "bg-amber-50 text-amber-700 border-amber-200",
  };

  const labels = {
    full_paid: "Full Paid",
    advance_paid: "Advance Paid",
    pending: "Pending",
  };

  const currentStyle = styles[status] || styles.pending;
  const currentLabel = labels[status] || status;

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${currentStyle}`}>
      <DollarSign className="w-3.5 h-3.5" />
      {currentLabel}
    </span>
  );
}