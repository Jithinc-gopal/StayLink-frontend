import React, { useState } from "react";
import { Mail } from "lucide-react";
import { forgotPassword } from "../../services/authService";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      alert("Please enter your email");
      return;
    }

    try {
      setLoading(true);
      await forgotPassword(email);
      alert("Reset link sent to your email");
    } catch (err) {
      alert(err.response?.data?.error || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#f1f3ff] font-sans text-[#041b3c] flex items-center justify-center h-screen p-4">

      <main className="w-full max-w-5xl flex flex-col md:flex-row bg-[#f9f9ff] rounded-[2rem] shadow-xl overflow-hidden">

        {/* LEFT SIDE (IMAGE) */}
        <section className="hidden md:flex md:w-[45%] relative">
          <img
            src="https://images.unsplash.com/photo-1560185007-cde436f6a4d0?auto=format&fit=crop&w=800&q=80"
            alt="reset password"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#003d9b]/80 to-transparent"></div>
        </section>

        {/* RIGHT SIDE */}
        <section className="flex-1 flex flex-col justify-center p-8 md:p-12">

          <div className="mb-6">
            <h1 className="text-3xl font-extrabold text-[#003d9b]">Forgot Password</h1>
            <p className="text-sm text-[#434654] mt-1">
              Enter your email and we’ll send you a reset link.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* EMAIL */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-widest text-[#434654]">
                Email
              </label>

              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#737685]" size={16} />
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 bg-[#f1f3ff] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#003d9b]"
                />
              </div>
            </div>

            {/* BUTTON */}
            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-br from-[#003d9b] to-[#0052cc] text-white font-bold rounded-xl"
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>

            {/* BACK TO LOGIN */}
            <p className="text-xs text-center text-[#434654]">
              Remember your password?
              <span
                onClick={() => navigate("/login")}
                className="ml-1 text-[#003d9b] font-bold cursor-pointer hover:underline"
              >
                Back to Login
              </span>
            </p>

          </form>
        </section>

      </main>
    </div>
  );
};

export default ForgotPassword;