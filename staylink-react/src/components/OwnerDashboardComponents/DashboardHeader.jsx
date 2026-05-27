import React from "react";

const DashboardHeader = () => {
  return (
    <div className="mb-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
            Owner Dashboard
          </h1>
          <p className="text-slate-500 mt-2 font-medium">
            Manage your properties easily
          </p>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;