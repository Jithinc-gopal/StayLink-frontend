import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";

export default function AdminMFASetup() {
  const navigate = useNavigate();

  const [qrCode, setQrCode] = useState("");
  const [secret, setSecret] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  const startSetup = async () => {
    try {
      setLoading(true);

      const res = await API.post(
        "/api/admin/auth/mfa/setup/"
      );

      setQrCode(res.data.qr_code);
      setSecret(res.data.secret);
    } catch (err) {
      alert(
        err.response?.data?.error ||
          "Failed to generate MFA"
      );
    } finally {
      setLoading(false);
    }
  };

  const verifySetup = async () => {
    try {
      setLoading(true);

      await API.post(
        "/api/admin/auth/mfa/verify-setup/",
        { code }
      );

      const user = JSON.parse(
        localStorage.getItem("user")
      );

      localStorage.setItem(
        "user",
        JSON.stringify({
          ...user,
          is_2fa_enabled: true,
        })
      );

      alert("MFA enabled successfully");
      navigate("/admin/dashboard");
    } catch (err) {
      alert(
        err.response?.data?.error ||
          "Invalid MFA code"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-slate-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-lg">
        <h1 className="text-2xl font-bold mb-4">
          Admin MFA Setup
        </h1>

        {!qrCode ? (
          <button
            onClick={startSetup}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-xl disabled:opacity-60"
          >
            {loading ? "Generating..." : "Generate QR Code"}
          </button>
        ) : (
          <>
            <img
              src={qrCode}
              alt="MFA QR Code"
              className="mx-auto w-60 h-60"
            />

            <div className="bg-gray-100 p-3 rounded-xl mt-4 break-all">
              {secret}
            </div>

            <input
              type="text"
              placeholder="Enter 6 digit code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full border mt-4 p-3 rounded-xl"
            />

            <button
              onClick={verifySetup}
              disabled={loading || !code}
              className="w-full mt-4 bg-green-600 text-white py-3 rounded-xl disabled:opacity-60"
            >
              {loading ? "Verifying..." : "Verify & Enable MFA"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}