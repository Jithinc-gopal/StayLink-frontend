import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  setupMFA,
  verifyMFASetup,
  disableMFA,
} from "../../services/authService";

export default function MFASetup() {
  const navigate = useNavigate();

  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  const [qrCode, setQrCode] = useState("");
  const [secret, setSecret] = useState("");
  const [code, setCode] = useState("");
  const [disableCode, setDisableCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [mfaEnabled, setMfaEnabled] = useState(user?.is_2fa_enabled || false);

  const startSetup = async () => {
    try {
      setLoading(true);

      const res = await setupMFA();

      setQrCode(res.data.qr_code);
      setSecret(res.data.secret);
    } catch (error) {
      alert(error.response?.data?.error || "Failed to start MFA setup");
    } finally {
      setLoading(false);
    }
  };

  const verifySetup = async () => {
    if (!code.trim()) {
      alert("Enter MFA code");
      return;
    }

    try {
      setLoading(true);

      await verifyMFASetup(code);

      const updatedUser = {
        ...user,
        is_2fa_enabled: true,
      };

      localStorage.setItem("user", JSON.stringify(updatedUser));

      setMfaEnabled(true);
      setQrCode("");
      setSecret("");
      setCode("");

      alert("MFA enabled successfully");
    } catch (error) {
      alert(error.response?.data?.error || "Invalid MFA code");
    } finally {
      setLoading(false);
    }
  };

  const handleDisable = async () => {
    if (!disableCode.trim()) {
      alert("Enter MFA code");
      return;
    }

    try {
      setLoading(true);

      await disableMFA(disableCode);

      const updatedUser = {
        ...user,
        is_2fa_enabled: false,
      };

      localStorage.setItem("user", JSON.stringify(updatedUser));

      setMfaEnabled(false);
      setDisableCode("");

      alert("MFA disabled successfully");
    } catch (error) {
      alert(error.response?.data?.error || "Failed to disable MFA");
    } finally {
      setLoading(false);
    }
  };

  if (!user || !["owner", "broker"].includes(user.role)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="bg-white p-8 rounded-2xl shadow text-center">
          <h2 className="text-xl font-bold">Not allowed</h2>
          <button
            onClick={() => navigate("/")}
            className="mt-4 px-5 py-2 bg-blue-600 text-white rounded-xl"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-xl p-8">
        <h1 className="text-2xl font-bold text-slate-900">
          Multi-Factor Authentication
        </h1>

        <p className="text-sm text-slate-500 mt-2">
          Secure your owner/broker account using Google Authenticator or any
          authenticator app.
        </p>

        {mfaEnabled ? (
          <div className="mt-6">
            <div className="bg-green-50 border border-green-200 text-green-700 rounded-2xl p-4 text-sm font-semibold">
              MFA is currently enabled.
            </div>

            <div className="mt-5">
              <label className="text-sm font-semibold text-slate-700">
                Enter MFA code to disable
              </label>

              <input
                value={disableCode}
                onChange={(e) => setDisableCode(e.target.value)}
                maxLength={6}
                placeholder="6-digit code"
                className="w-full mt-2 px-4 py-3 bg-slate-100 rounded-xl outline-none"
              />

              <button
                onClick={handleDisable}
                disabled={loading}
                className="w-full mt-4 py-3 bg-red-600 text-white rounded-xl font-bold disabled:opacity-60"
              >
                {loading ? "Processing..." : "Disable MFA"}
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-6">
            {!qrCode ? (
              <button
                onClick={startSetup}
                disabled={loading}
                className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold disabled:opacity-60"
              >
                {loading ? "Starting..." : "Set up MFA"}
              </button>
            ) : (
              <div>
                <div className="flex justify-center mt-4">
                  <img
                    src={qrCode}
                    alt="MFA QR Code"
                    className="w-56 h-56 border rounded-2xl"
                  />
                </div>

                <p className="text-xs text-slate-500 text-center mt-3">
                  Scan this QR code using Google Authenticator or Microsoft
                  Authenticator.
                </p>

                {secret && (
                  <div className="mt-4 bg-slate-100 rounded-xl p-3 text-xs break-all">
                    Manual secret: {secret}
                  </div>
                )}

                <input
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  maxLength={6}
                  placeholder="Enter 6-digit code"
                  className="w-full mt-5 px-4 py-3 bg-slate-100 rounded-xl outline-none"
                />

                <button
                  onClick={verifySetup}
                  disabled={loading}
                  className="w-full mt-4 py-3 bg-blue-600 text-white rounded-xl font-bold disabled:opacity-60"
                >
                  {loading ? "Verifying..." : "Verify & Enable MFA"}
                </button>
              </div>
            )}
          </div>
        )}

        <button
          onClick={() => navigate(-1)}
          className="w-full mt-4 py-3 border rounded-xl font-semibold text-slate-600"
        >
          Back
        </button>
      </div>
    </div>
  );
}