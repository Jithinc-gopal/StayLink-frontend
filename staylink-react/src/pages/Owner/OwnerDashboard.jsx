import React, { useEffect, useState } from "react";

import TopNavbar from "../../components/OwnerDashboardComponents/TopNavbar";

import DashboardHeader from "../../components/OwnerDashboardComponents/DashboardHeader";

import VerificationBanner from "../../components/OwnerDashboardComponents/VerificationBanner";

import DashboardStats from "../../components/OwnerDashboardComponents/DashboardStats";

import QuickActions from "../../components/OwnerDashboardComponents/QuickActions";

import PropertySection from "../../components/OwnerDashboardComponents/PropertySection";

import QuickStatistics from "../../components/OwnerDashboardComponents/QuickStatistics";

import SupportSection from "../../components/OwnerDashboardComponents/SupportSection";

import TipCard from "../../components/OwnerDashboardComponents/TipCard";

import {
  getOwnerProfile,
} from "../../services/authService";

import {
  getMyProperties,
} from "../../services/propertyService";



const OwnerDashboard = () => {

  const [loading, setLoading] = useState(true);

  const [properties, setProperties] = useState([]);

  const [verificationStatus, setVerificationStatus] =
    useState("pending");

  const [showNotification, setShowNotification] =
    useState(true);



  useEffect(() => {

    const fetchDashboardData = async () => {

      try {

        const profileResponse =
          await getOwnerProfile();

        setVerificationStatus(
          profileResponse.data.verification_status
        );

        const propertyResponse =
          await getMyProperties();

        setProperties(
          propertyResponse.data
        );

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



  const isApproved =
    verificationStatus === "approved";



  if (loading) {

    return (

      <div className="min-h-screen flex items-center justify-center bg-gray-50">

        <div className="text-center">

          <div className="w-16 h-16 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>

          <p className="text-gray-600 font-medium">

            Loading Dashboard...

          </p>

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



        <div className="relative mt-6 rounded-3xl overflow-hidden">

          {!isApproved && (

            <div className="absolute inset-0 z-50 bg-white/70 backdrop-blur-sm flex items-center justify-center">

              <div className="bg-white shadow-2xl border border-gray-100 rounded-3xl p-10 max-w-lg text-center">

                <div className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">

                  <span className="text-5xl">

                    🔒

                  </span>

                </div>

                <h2 className="text-3xl font-bold text-gray-800 mb-4">

                  Verification Pending

                </h2>

                <p className="text-gray-600 leading-relaxed text-lg">

                  Your account is currently under admin review.

                  Once approved, all owner dashboard features
                  including property management, analytics,
                  and booking controls will be unlocked.

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

            <DashboardStats
              properties={properties}
            />



            <QuickActions />



            <PropertySection
              properties={properties}
            />



            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-10">

              <QuickStatistics
                properties={properties}
              />

              <SupportSection />

              <TipCard />

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default OwnerDashboard;