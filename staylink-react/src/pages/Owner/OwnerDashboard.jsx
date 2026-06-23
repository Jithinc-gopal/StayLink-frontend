import React, { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import {
  CalendarCheck,
  ArrowRight,
  Users,
  IndianRupee,
  ShieldCheck,
  Star,
  MessageSquareText,
} from "lucide-react";

import TopNavbar from "../../components/OwnerDashboardComponents/TopNavbar";
import DashboardHeader from "../../components/OwnerDashboardComponents/DashboardHeader";
import VerificationBanner from "../../components/OwnerDashboardComponents/VerificationBanner";
import DashboardStats from "../../components/OwnerDashboardComponents/DashboardStats";
import QuickActions from "../../components/OwnerDashboardComponents/QuickActions";
import PropertySection from "../../components/OwnerDashboardComponents/PropertySection";
import QuickStatistics from "../../components/OwnerDashboardComponents/QuickStatistics";
import SupportSection from "../../components/OwnerDashboardComponents/SupportSection";
import TipCard from "../../components/OwnerDashboardComponents/TipCard";

import { getOwnerProfile } from "../../services/authService";
import { getMyProperties } from "../../services/propertyService";

const OwnerDashboard = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [properties, setProperties] = useState([]);
  const [verificationStatus, setVerificationStatus] = useState("pending");
  const [showNotification, setShowNotification] = useState(true);
  const [mfaEnabled, setMfaEnabled] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const profileResponse = await getOwnerProfile();
        const profileData = profileResponse.data.data || profileResponse.data;

        setVerificationStatus(profileData.verification_status);

        const storedUser = JSON.parse(localStorage.getItem("user"));

        const updatedUser = {
          ...storedUser,
          is_2fa_enabled:
            profileData.user?.is_2fa_enabled ??
            profileData.is_2fa_enabled ??
            storedUser?.is_2fa_enabled ??
            false,
        };

        localStorage.setItem("user", JSON.stringify(updatedUser));
        setMfaEnabled(updatedUser.is_2fa_enabled);

        const propertyResponse = await getMyProperties();
        setProperties(propertyResponse.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleSearch = (value) => {
    console.log(value);
  };

  const isApproved = verificationStatus === "approved";

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <TopNavbar onSearch={handleSearch} />

      <div className="pt-20 px-6 md:px-10 pb-12 max-w-[1600px] mx-auto">
        <DashboardHeader />

        <VerificationBanner
          verificationStatus={verificationStatus}
          showNotification={showNotification}
          setShowNotification={setShowNotification}
        />

        {isApproved && !mfaEnabled && (
          <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-yellow-900">
                Secure your owner account
              </h3>
              <p className="text-sm text-yellow-800 mt-1">
                Set up Multi-Factor Authentication using an authenticator app
                to protect your dashboard, properties, bookings, and payouts.
              </p>
            </div>

            <button
              onClick={() => navigate("/mfa/setup")}
              className="px-5 py-3 bg-yellow-500 hover:bg-yellow-600 text-white rounded-2xl font-semibold transition-colors"
            >
              Set up MFA
            </button>
          </div>
        )}

        <div className="relative mt-6 rounded-3xl overflow-hidden">
          {!isApproved && (
            <div className="absolute inset-0 z-50 bg-white/70 backdrop-blur-sm flex items-center justify-center">
              <div className="bg-white shadow-2xl border border-gray-100 rounded-3xl p-10 max-w-lg text-center">
                <div className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-5xl">🔒</span>
                </div>

                <h2 className="text-3xl font-bold text-gray-800 mb-4">
                  Verification Pending
                </h2>

                <p className="text-gray-600 leading-relaxed text-lg">
                  Your account is currently under admin review. Once approved,
                  all owner dashboard features including property management,
                  analytics, and booking controls will be unlocked.
                </p>

                <div className="mt-8 flex items-center justify-center gap-3">
                  <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-yellow-700">
                    Waiting for approval
                  </span>
                </div>
              </div>
            </div>
          )}

          <div
            className={
              !isApproved
                ? "pointer-events-none select-none opacity-50 blur-[1px]"
                : ""
            }
          >
            <DashboardStats properties={properties} />

            <section className="mt-8 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 rounded-[2rem] overflow-hidden shadow-2xl border border-slate-700">
              <div className="relative p-8 md:p-10">
                <div className="absolute top-0 right-0 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl -translate-y-24 translate-x-24"></div>
                <div className="absolute bottom-0 left-0 w-56 h-56 bg-indigo-500/20 rounded-full blur-3xl translate-y-20 -translate-x-20"></div>

                <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
                  <div className="lg:col-span-2">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/10 rounded-full text-white/80 text-sm font-medium mb-5">
                      <ShieldCheck size={16} />
                      Owner Reservation Center
                    </div>

                    <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
                      Manage all property bookings in one place
                    </h2>

                    <p className="text-slate-300 mt-4 max-w-2xl leading-relaxed">
                      View every booking across your properties, check traveler
                      details, payment status, stay dates, guest count, advance
                      amount, and completion status from a single Airbnb-style
                      owner booking dashboard.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-7">
                      <MiniFeature icon={CalendarCheck} title="Bookings" text="All Properties" />
                      <MiniFeature icon={Users} title="Travelers" text="Full Details" />
                      <MiniFeature icon={IndianRupee} title="Payments" text="Track Status" />
                    </div>
                  </div>

                  <ActionCard
                    icon={CalendarCheck}
                    title="Booking Dashboard"
                    text="Open your complete booking list and manage confirmed, pending, completed, and cancelled stays."
                    buttonText="View All Bookings"
                    onClick={() => navigate("/owner/bookings")}
                  />
                </div>
              </div>
            </section>

            <section className="mt-8 bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-3">
                <div className="lg:col-span-2 p-8 md:p-10">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-50 border border-yellow-100 rounded-full text-yellow-700 text-sm font-semibold mb-5">
                    <Star size={16} className="fill-yellow-400 text-yellow-400" />
                    Guest Experience Center
                  </div>

                  <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
                    Track guest reviews and property ratings
                  </h2>

                  <p className="text-slate-500 mt-4 max-w-2xl leading-relaxed">
                    View verified traveler reviews after completed stays,
                    monitor ratings across your properties, and understand
                    what guests loved about their experience.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-7">
                    <div className="rounded-2xl bg-slate-50 border border-slate-100 p-4">
                      <div className="flex items-center gap-2 text-slate-500 text-sm">
                        <MessageSquareText size={17} />
                        Feedback
                      </div>
                      <p className="text-slate-900 font-bold text-xl mt-2">
                        Verified
                      </p>
                    </div>

                    <div className="rounded-2xl bg-slate-50 border border-slate-100 p-4">
                      <div className="flex items-center gap-2 text-slate-500 text-sm">
                        <Star size={17} />
                        Ratings
                      </div>
                      <p className="text-slate-900 font-bold text-xl mt-2">
                        Property-wise
                      </p>
                    </div>

                    <div className="rounded-2xl bg-slate-50 border border-slate-100 p-4">
                      <div className="flex items-center gap-2 text-slate-500 text-sm">
                        <ShieldCheck size={17} />
                        Trust
                      </div>
                      <p className="text-slate-900 font-bold text-xl mt-2">
                        Post-stay
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-900 p-8 md:p-10 flex items-center">
                  <div className="bg-white rounded-3xl p-6 shadow-xl w-full">
                    <div className="w-14 h-14 bg-yellow-400 rounded-2xl flex items-center justify-center mb-5">
                      <Star size={28} className="text-white fill-white" />
                    </div>

                    <h3 className="text-xl font-bold text-slate-900">
                      Reviews Dashboard
                    </h3>

                    <p className="text-sm text-slate-500 mt-2 leading-relaxed">
                      Open the full review center to see guest comments,
                      ratings, and property feedback.
                    </p>

                    <button
                      onClick={() => navigate("/owner/reviews")}
                      className="mt-6 w-full flex items-center justify-center gap-2 px-5 py-3 bg-yellow-500 hover:bg-yellow-600 text-white rounded-2xl font-semibold transition-all shadow-lg"
                    >
                      View Guest Reviews
                      <ArrowRight size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </section>

            <QuickActions />

            <PropertySection properties={properties} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-10">
              <QuickStatistics properties={properties} />
              <SupportSection />
              <TipCard />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const MiniFeature = ({ icon: Icon, title, text }) => {
  return (
    <div className="bg-white/10 border border-white/10 rounded-2xl p-4">
      <div className="flex items-center gap-2 text-blue-200 text-sm">
        <Icon size={17} />
        {title}
      </div>
      <p className="text-white font-bold text-xl mt-2">{text}</p>
    </div>
  );
};

const ActionCard = ({ icon: Icon, title, text, buttonText, onClick }) => {
  return (
    <div className="bg-white rounded-3xl p-6 shadow-xl">
      <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center mb-5">
        <Icon size={28} className="text-white" />
      </div>

      <h3 className="text-xl font-bold text-slate-900">{title}</h3>

      <p className="text-sm text-slate-500 mt-2 leading-relaxed">{text}</p>

      <button
        onClick={onClick}
        className="mt-6 w-full flex items-center justify-center gap-2 px-5 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-semibold transition-all shadow-lg"
      >
        {buttonText}
        <ArrowRight size={18} />
      </button>
    </div>
  );
};

export default OwnerDashboard;