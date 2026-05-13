import React, { useState } from "react";
import { Lock, Eye, EyeOff } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { resetPassword } from "../../services/authService";

const ResetPassword = () => {
  const { uid, token } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.password || !form.confirmPassword) {
      alert("Please fill all fields");
      return;
    }

    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      await resetPassword({
        uid,
        token,
        password: form.password,
      });

      alert("Password reset successful");
      navigate("/login");

    } catch (err) {
      alert(err.response?.data?.error || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#f1f3ff] font-sans text-[#041b3c] flex items-center justify-center h-screen p-4">

      <main className="w-full max-w-5xl flex flex-col md:flex-row bg-[#f9f9ff] rounded-[2rem] shadow-xl overflow-hidden">

        {/* LEFT SIDE */}
        <section className="hidden md:flex md:w-[45%] relative">
          <img
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80"
            alt="reset password"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#003d9b]/80 to-transparent"></div>
        </section>

        {/* RIGHT SIDE */}
        <section className="flex-1 flex flex-col justify-center p-8 md:p-12">

          <div className="mb-6">
            <h1 className="text-3xl font-extrabold text-[#003d9b]">
              Reset Password
            </h1>
            <p className="text-sm text-[#434654] mt-1">
              Enter your new password below.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* NEW PASSWORD */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-widest text-[#434654]">
                New Password
              </label>

              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#737685]" size={16} />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter new password"
                  onChange={handleChange}
                  className="w-full pl-11 pr-11 py-2.5 bg-[#f1f3ff] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#003d9b]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#737685]"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* CONFIRM PASSWORD */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-widest text-[#434654]">
                Confirm Password
              </label>

              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#737685]" size={16} />
                <input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm password"
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-2.5 bg-[#f1f3ff] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#003d9b]"
                />
              </div>
            </div>

            {/* BUTTON */}
            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-br from-[#003d9b] to-[#0052cc] text-white font-bold rounded-xl"
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>

            {/* BACK TO LOGIN */}
            <p className="text-xs text-center text-[#434654]">
              Back to
              <span
                onClick={() => navigate("/login")}
                className="ml-1 text-[#003d9b] font-bold cursor-pointer hover:underline"
              >
                Login
              </span>
            </p>

          </form>
        </section>

      </main>
    </div>
  );
};

export default ResetPassword;