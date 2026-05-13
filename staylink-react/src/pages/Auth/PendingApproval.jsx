import React from "react";

const PendingApproval = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-[#f1f3ff]">
      <div className="bg-white p-10 rounded-2xl shadow-lg text-center">
        <h1 className="text-2xl font-bold text-[#003d9b]">
          Waiting for Approval ⏳
        </h1>
        <p className="text-gray-600 mt-4">
          Your broker profile is under review by admin.
        </p>
        <p className="text-sm text-gray-400 mt-2">
          You will get access once approved.
        </p>
      </div>
    </div>
  );
};

export default PendingApproval;