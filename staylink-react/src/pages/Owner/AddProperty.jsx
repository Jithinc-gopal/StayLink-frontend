import { ArrowLeft, Building2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

import TopNavbar from "../../components/OwnerDashboardComponents/TopNavbar";
import PropertyAddForm from "../../components/ownerProperty/PropertyAddForm";

const AddProperty = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100">

      {/* TOP NAVBAR */}
      <TopNavbar />

      {/* PAGE CONTENT */}
      <div className="pt-24 px-4 md:px-10 pb-10">

        {/* HEADER */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 mb-8">

          {/* LEFT */}
          <div>
            <button
              onClick={() => navigate("/owner/dashboard")}
              className="flex items-center gap-2 text-gray-500 hover:text-blue-600 transition mb-4"
            >
              <ArrowLeft size={18} />
              Back to Dashboard
            </button>

            <div className="flex items-center gap-4">
              <div className="bg-blue-100 p-4 rounded-2xl">
                <Building2 className="text-blue-600" size={30} />
              </div>

              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                  Add New Property
                </h1>

                <p className="text-gray-500 mt-2">
                  Fill all required details to list your property on StayLink
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="bg-white rounded-2xl shadow-sm border px-6 py-4">
            <p className="text-sm text-gray-500">Property Status</p>

            <div className="flex items-center gap-2 mt-2">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="font-semibold text-gray-800">
                Ready to Publish
              </span>
            </div>
          </div>
        </div>

        {/* FORM */}
        <div className="bg-white rounded-3xl shadow-sm border p-5 md:p-8">
          <PropertyAddForm />
        </div>

      </div>
    </div>
  );
};

export default AddProperty;