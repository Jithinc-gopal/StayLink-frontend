import React, {
  useEffect,
  useState,
} from "react";

import { useParams, useNavigate } from "react-router-dom";

import OwnerCalendar from "../../components/ownerProperty/OwnerCalendar";

import BlockDateModal from "../../components/ownerProperty/BlockDateModal";

import {
  getOwnerPropertyCalendar,
  blockPropertyDates,
  updateBlockedDate,
  unblockDate,
  getOwnerPropertyBookings,
  completeOwnerBooking,
} from "../../services/propertyService";

import { 
  Calendar, 
  ChevronLeft, 
  Home,
  AlertCircle,
  CheckCircle,
  TrendingUp,
  DollarSign
} from "lucide-react";

const OwnerPropertyCalendarPage = () => {

  const { propertyId } = useParams();
  const navigate = useNavigate();

  const [calendarData, setCalendarData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRange, setSelectedRange] = useState(null);
  const [editingBlock, setEditingBlock] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);

  const [bookings, setBookings] = useState([]);
  const [bookingLoading, setBookingLoading] = useState(false);

  const [stats, setStats] = useState({
    blockedDays: 0,
    availableDays: 0,
    upcomingBookings: 0,
    occupancyRate: 0
  });

  const fetchCalendar = async () => {
    try {
      const data = await getOwnerPropertyCalendar(propertyId);
      console.log("API DATA:", data);
      setCalendarData(data);
      
      // Calculate statistics
      if (data && data.blocked_dates) {
        const blockedCount = data.blocked_dates.length;
        const totalDays = 365;
        const availableDays = totalDays - blockedCount;
        const occupancyRate = ((availableDays / totalDays) * 100).toFixed(1);
        
        setStats({
          blockedDays: blockedCount,
          availableDays: availableDays,
          upcomingBookings: data.upcoming_bookings || 0,
          occupancyRate: occupancyRate
        });
      }
    } catch (error) {
      console.log("Calendar error:", error);
    }
  };

  const fetchBookings = async () => {
  try {
    setBookingLoading(true);

    const data = await getOwnerPropertyBookings(propertyId);

    setBookings(data || []);
  } catch (error) {
    console.log("Bookings error:", error);
  } finally {
    setBookingLoading(false);
  }
};

  useEffect(() => {
    fetchCalendar();
    fetchBookings();
}, [propertyId]);


const handleCompleteBooking = async (bookingId) => {
  const confirmAction = window.confirm(
    "Confirm full payment received and mark this booking as completed?"
  );

  if (!confirmAction) return;

  try {
    await completeOwnerBooking(bookingId);

    alert("Booking completed. Traveler can now review.");

    fetchBookings();
    fetchCalendar();
  } catch (error) {
    console.log("Complete booking error:", error);

    alert(
      error.response?.data?.error ||
        "Failed to complete booking"
    );
  }
};

  const handleSingleDateSelect = (info) => {
    setEditingBlock(null);
    setIsEditMode(false);
    setSelectedRange({
      start: info.dateStr,
      end: info.dateStr,
    });
    setIsModalOpen(true);
  };

  const handleRangeSelect = (selectionInfo) => {
    const start = selectionInfo.startStr;
    const endDateObj = new Date(selectionInfo.endStr);
    endDateObj.setDate(endDateObj.getDate() - 1);
    const end = endDateObj.toISOString().split("T")[0];
    setEditingBlock(null);
    setIsEditMode(false);
    setSelectedRange({ start, end });
    selectionInfo.view.calendar.unselect();
    setIsModalOpen(true);
  };

  const handleBlockedDateClick = (blockData) => {
    setEditingBlock(blockData);
    setIsEditMode(true);
    setSelectedRange({
      start: blockData.date,
      end: blockData.date,
    });
    setIsModalOpen(true);
  };

  const handleBlockDates = async (formData) => {
    try {
      await blockPropertyDates(formData);
      closeModal();
      fetchCalendar();
    } catch (error) {
      console.log("Block error:", error);
    }
  };

  const handleUpdateBlock = async (formData) => {
    try {
      await updateBlockedDate(editingBlock.ids, formData);
      setIsModalOpen(false);
      setEditingBlock(null);
      setIsEditMode(false);
      fetchCalendar();
    } catch (error) {
      console.log("Update error:", error);
    }
  };

  const handleUnblock = async () => {
    try {
      await unblockDate(editingBlock.ids);
      setIsModalOpen(false);
      setEditingBlock(null);
      setIsEditMode(false);
      fetchCalendar();
    } catch (error) {
      console.log("Unblock error:", error);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedRange(null);
    setEditingBlock(null);
    setIsEditMode(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        
        {/* Header with Navigation */}
        <div className="mb-6 lg:mb-8">
          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="group flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-4 transition-all duration-200"
          >
            <div className="p-1 rounded-lg bg-gray-100 group-hover:bg-gray-200 transition-colors">
              <ChevronLeft size={16} />
            </div>
            <span className="text-sm font-medium">Back to Properties</span>
          </button>
          
          {/* Title Section */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2.5 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl shadow-lg">
                  <Calendar size={22} className="text-white" />
                </div>
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
                  Property Calendar
                </h1>
              </div>
              <p className="text-gray-500 text-sm lg:text-base ml-12">
                Manage availability, block dates, and track bookings
              </p>
            </div>
            
            {/* Quick Stats */}
            <div className="flex gap-3 ml-0 lg:ml-0">
              <div className="bg-white rounded-xl px-4 py-2 shadow-sm border border-gray-200">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-xs text-gray-500">Available</span>
                  <span className="text-lg font-bold text-gray-800">{stats.availableDays}</span>
                </div>
              </div>
              <div className="bg-white rounded-xl px-4 py-2 shadow-sm border border-gray-200">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span className="text-xs text-gray-500">Blocked</span>
                  <span className="text-lg font-bold text-gray-800">{stats.blockedDays}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Occupancy Rate</p>
                <p className="text-2xl font-bold text-gray-900">{stats.occupancyRate}%</p>
              </div>
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                <TrendingUp size={20} className="text-blue-600" />
              </div>
            </div>
            <div className="mt-2">
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div 
                  className="bg-blue-600 h-1.5 rounded-full transition-all duration-500"
                  style={{ width: `${stats.occupancyRate}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Total Blocked Days</p>
                <p className="text-2xl font-bold text-gray-900">{stats.blockedDays}</p>
              </div>
              <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center">
                <AlertCircle size={20} className="text-red-600" />
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-2">Dates marked as unavailable</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Available Days</p>
                <p className="text-2xl font-bold text-gray-900">{stats.availableDays}</p>
              </div>
              <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                <CheckCircle size={20} className="text-green-600" />
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-2">Days ready for booking</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Est. Annual Revenue</p>
                <p className="text-2xl font-bold text-gray-900">
                  ₹{calendarData?.estimated_annual_income?.toLocaleString() || '0'}
                </p>
              </div>
              <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                <DollarSign size={20} className="text-purple-600" />
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-2">Based on current availability</p>
          </div>
        </div>

        {/* Calendar Container */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="p-4 lg:p-6">
            {/* Calendar Tips */}
            <div className="mb-4 p-3 bg-blue-50/50 rounded-lg border border-blue-100">
              <div className="flex items-start gap-2">
                <div className="p-1 bg-blue-100 rounded-lg">
                  <Home size={14} className="text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-blue-800 font-medium">Pro Tip</p>
                  <p className="text-xs text-blue-600">
                    Click on any date to block it, or drag across multiple dates to block a range. 
                    Click on blocked dates to edit or remove the block.
                  </p>
                </div>
              </div>
            </div>
            
            <OwnerCalendar
              calendarData={calendarData}
              onSingleDateSelect={handleSingleDateSelect}
              onRangeSelect={handleRangeSelect}
              onBlockedDateClick={handleBlockedDateClick}
            />
          </div>
        </div>
        

        <div className="mt-8 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
  <div className="p-6 border-b border-gray-100">
    <h2 className="text-xl font-bold text-gray-900">
      Property Bookings
    </h2>
    <p className="text-sm text-gray-500 mt-1">
      Confirm full payment and complete stays after checkout.
    </p>
  </div>

  <div className="p-6">
    {bookingLoading ? (
      <p className="text-gray-500">Loading bookings...</p>
    ) : bookings.length === 0 ? (
      <p className="text-gray-500">No bookings found.</p>
    ) : (
      <div className="space-y-4">
        {bookings.map((booking) => {
          const isCompleted = booking.status === "completed";
          const isFullPaid = booking.payment_status === "full_paid";

          return (
            <div
              key={booking.id}
              className="border border-gray-200 rounded-xl p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
            >
              <div>
                <h3 className="font-bold text-gray-900">
                  Booking #{booking.id}
                </h3>

                <p className="text-sm text-gray-500">
                  Traveler: {booking.traveler_name}
                </p>

                <p className="text-sm text-gray-500">
                  {booking.check_in} → {booking.check_out}
                </p>

                <p className="text-sm text-gray-500">
                  Total: ₹{booking.total_amount} | Advance: ₹{booking.advance_amount}
                </p>

                <div className="flex gap-2 mt-2">
                  <span className="px-3 py-1 rounded-full text-xs bg-blue-50 text-blue-700">
                    {booking.status}
                  </span>

                  <span className="px-3 py-1 rounded-full text-xs bg-green-50 text-green-700">
                    {booking.payment_status}
                  </span>

                  {booking.has_review && (
                    <span className="px-3 py-1 rounded-full text-xs bg-yellow-50 text-yellow-700">
                      Reviewed
                    </span>
                  )}
                </div>
              </div>

              <div>
                {isCompleted && isFullPaid ? (
                  <button
                    disabled
                    className="px-5 py-2 rounded-xl bg-gray-100 text-gray-500 text-sm font-semibold"
                  >
                    Completed
                  </button>
                ) : (
                  <button
                    onClick={() => handleCompleteBooking(booking.id)}
                    className="px-5 py-2 rounded-xl bg-gray-900 text-white text-sm font-semibold hover:bg-gray-800"
                  >
                    Mark Full Paid & Completed
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    )}
  </div>
</div>

        {/* Modal */}
        <BlockDateModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedRange(null);
            setEditingBlock(null);
            setIsEditMode(false);
          }}
          onSubmit={handleBlockDates}
          onUpdate={handleUpdateBlock}
          onUnblock={handleUnblock}
          selectedRange={selectedRange}
          propertyId={propertyId}
          editingBlock={editingBlock}
          isEditMode={isEditMode}
        />
      </div>
    </div>
  );
};

export default OwnerPropertyCalendarPage;