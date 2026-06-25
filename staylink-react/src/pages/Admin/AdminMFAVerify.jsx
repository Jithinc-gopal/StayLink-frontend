import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { verifyMFALogin } from "../../services/authService";

export default function AdminMFAVerify() {
  const navigate = useNavigate();
  const location = useLocation();

  const userId = location.state?.userId;
  const email = location.state?.email;

  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  const saveAuthData = (data) => {
    const user = data.user;

    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("access", data.access_token || data.access);
    localStorage.setItem("refresh", data.refresh_token || data.refresh || "");
    localStorage.setItem("role", user.role);
    localStorage.setItem("isLoged", "true");
  };

  const handleVerify = async (e) => {
    e.preventDefault();

    if (!userId) {
      alert("Login session expired. Please login again.");
      navigate("/login", { replace: true });
      return;
    }

    if (!code.trim()) {
      alert("Enter MFA code");
      return;
    }

    try {
      setLoading(true);

      const res = await verifyMFALogin({
        user_id: userId,
        code,
      });

      saveAuthData(res.data);

      navigate("/admin/dashboard", {
        replace: true,
      });
    } catch (error) {
      alert(error.response?.data?.error || "Invalid MFA code");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f1f3ff] flex items-center justify-center px-4">
      <form
        onSubmit={handleVerify}
        className="bg-white w-full max-w-md rounded-3xl shadow-xl p-8"
      >
        <h1 className="text-2xl font-bold text-[#003d9b]">
          Admin MFA Verification
        </h1>

        <p className="text-sm text-gray-500 mt-2 mb-6">
          Enter the 6-digit code for {email || "admin account"}.
        </p>

        <input
          value={code}
          onChange={(e) => setCode(e.target.value)}
          maxLength={6}
          placeholder="6-digit code"
          className="w-full px-4 py-3 bg-[#f1f3ff] rounded-xl outline-none"
        />

        <button
          disabled={loading}
          className="w-full mt-5 py-3 bg-[#003d9b] text-white rounded-xl font-bold disabled:opacity-60"
        >
          {loading ? "Verifying..." : "Verify & Login"}
        </button>
      </form>
    </div>
  );
}