import React from "react";
import { CheckCircle2, XCircle, Clock, Sparkles, X } from "lucide-react";

const VerificationBanner = ({
  verificationStatus,
  showNotification,
  setShowNotification,
}) => {
  const getStatusConfig = () => {
    switch (verificationStatus) {
      case "approved":
        return {
          bg: "bg-emerald-50",
          border: "border-emerald-200",
          text: "text-emerald-800",
          icon: CheckCircle2,
          iconBg: "bg-emerald-100",
          iconColor: "text-emerald-600",
          badge: "Verified Account",
          message: "Your account is fully verified.",
        };
      case "rejected":
        return {
          bg: "bg-rose-50",
          border: "border-rose-200",
          text: "text-rose-800",
          icon: XCircle,
          iconBg: "bg-rose-100",
          iconColor: "text-rose-600",
          badge: "Verification Failed",
          message: "Please update your profile.",
        };
      default:
        return {
          bg: "bg-amber-50",
          border: "border-amber-200",
          text: "text-amber-800",
          icon: Clock,
          iconBg: "bg-amber-100",
          iconColor: "text-amber-600",
          badge: "Pending Review",
          message: "Your verification is under review.",
        };
    }
  };

  const statusConfig = getStatusConfig();
  const StatusIcon = statusConfig.icon;

  return (
    <>
      {showNotification && (
        <div className="mb-6 bg-slate-50 border border-slate-200 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-slate-600" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800">
                  Welcome to StayLink Owner Panel
                </p>
                <p className="text-xs text-slate-500 font-medium">
                  Manage all your properties from one place
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowNotification(false)}
              className="hover:bg-slate-200 rounded-lg p-1 transition-colors"
            >
              <X className="w-5 h-5 text-slate-400" />
            </button>
          </div>
        </div>
      )}

      <div className={`${statusConfig.bg} border ${statusConfig.border} rounded-xl p-5 mb-8 shadow-sm`}>
        <div className="flex items-center gap-4">
          <div className={`${statusConfig.iconBg} p-2.5 rounded-full`}>
            <StatusIcon className={statusConfig.iconColor} size={22} />
          </div>
          <div>
            <h2 className={`text-base font-bold ${statusConfig.text}`}>
              {statusConfig.badge}
            </h2>
            <p className={`text-sm ${statusConfig.text} opacity-90 font-medium`}>
              {statusConfig.message}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default VerificationBanner;