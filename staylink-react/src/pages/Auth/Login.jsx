import React, { useState } from "react";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../services/authService";
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";

const LoginModal = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.id]: e.target.value,
    });
  };

  const redirectUser = (user) => {
    if (user.role === "admin") {
      return "/admin/dashboard";
    }

    if (user.role === "owner") {
      return user.profile_completed
        ? "/owner/dashboard"
        : "/owner/setup";
    }

    if (user.role === "broker") {
      return user.profile_completed
        ? "/broker/dashboard"
        : "/broker/setup";
    }

    return "/";
  };

  const saveAuthData = (data) => {
    const user = data.user;

    const access = data.access || data.access_token;
    const refresh = data.refresh || data.refresh_token;

    if (!user || !access) {
      console.log("Login response:", data);
      alert("Login failed: user or token missing");
      return false;
    }

    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("access", access);
    localStorage.setItem("refresh", refresh || "");
    localStorage.setItem("role", user.role);
    localStorage.setItem("isLoged", "true");

    return true;
  };

  const handleMFAFlow = (data) => {
    if (data.mfa_required) {
      const path =
        data.role === "admin"
          ? "/admin/mfa-verify"
          : "/mfa/verify-login";

      navigate(path, {
        state: {
          userId: data.user_id,
          role: data.role,
          email: data.email,
        },
        replace: true,
      });

      return true;
    }

    if (
      data.mfa_setup_required &&
      data.user?.role === "admin"
    ) {
      const saved = saveAuthData(data);

      if (!saved) return true;

      navigate("/admin/mfa-setup", {
        replace: true,
      });

      return true;
    }

    return false;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      alert("Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      const res = await loginUser(form);
      const data = res.data;

      const isMFAFlow = handleMFAFlow(data);

      if (isMFAFlow) return;

      const saved = saveAuthData(data);

      if (!saved) return;

      navigate(redirectUser(data.user), {
        replace: true,
      });
    } catch (err) {
      console.error(err.response?.data || err);
      alert(err.response?.data?.error || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setLoading(true);

      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/accounts/google-login/`,
        {
          token: credentialResponse.credential,
        }
      );

      const data = res.data;

      const isMFAFlow = handleMFAFlow(data);

      if (isMFAFlow) return;

      const saved = saveAuthData(data);

      if (!saved) return;

      navigate(redirectUser(data.user), {
        replace: true,
      });
    } catch (err) {
      console.error(err.response?.data || err);

      if (err.response?.status === 404) {
        alert("Please register first");
      } else {
        alert(
          err.response?.data?.error ||
            "Google login failed"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#f1f3ff] font-sans text-[#041b3c] antialiased flex items-center justify-center h-screen overflow-hidden p-4">
      <main className="w-full max-w-6xl h-full max-h-[750px] flex flex-col md:flex-row overflow-hidden bg-[#f9f9ff] rounded-[2.5rem] shadow-2xl shadow-[#003d9b]/5">
        <section className="hidden md:flex md:w-[40%] relative p-10 flex-col justify-end">
          <div className="absolute inset-0 z-0">
            <img
              alt="Luxury Mediterranean villa"
              className="w-full h-full object-cover"
              src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#003d9b]/80 via-[#003d9b]/20 to-transparent"></div>
          </div>

          <div className="relative z-10 space-y-4">
            <h2 className="text-[#f9f9ff] font-sans text-3xl font-extrabold tracking-tight leading-tight">
              Seamless Stays,
              <br />
              Curated for You.
            </h2>

            <p className="text-[#f1f3ff] text-sm opacity-90 leading-relaxed max-w-xs">
              Experience the next generation of hybrid accommodation.
            </p>
          </div>
        </section>

        <section className="flex-1 flex flex-col items-center p-8 lg:px-20 bg-[#f9f9ff] overflow-y-auto">
          <div className="mb-6 text-center md:text-left w-full max-w-md">
            <h1 className="font-sans text-3xl font-extrabold text-[#003d9b] tracking-tighter mb-1">
              StayLink
            </h1>

            <p className="text-[#434654] text-sm font-medium">
              Welcome back.
            </p>
          </div>

          <form
            className="w-full max-w-md space-y-4"
            onSubmit={handleSubmit}
          >
            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold uppercase tracking-widest text-[#434654] ml-1">
                Email
              </label>

              <div className="relative">
                <Mail
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[#737685]"
                  size={16}
                />

                <input
                  id="email"
                  type="email"
                  value={form.email}
                  className="w-full pl-11 pr-4 py-2.5 bg-[#f1f3ff] rounded-xl text-sm"
                  placeholder="Enter your email"
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center px-1">
                <label className="block text-[10px] font-bold uppercase tracking-widest text-[#434654]">
                  Password
                </label>
              </div>

              <div className="relative">
                <Lock
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[#737685]"
                  size={16}
                />

                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  className="w-full pl-11 pr-11 py-2.5 bg-[#f1f3ff] rounded-xl text-sm"
                  placeholder="••••••••"
                  onChange={handleChange}
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#737685]"
                >
                  {showPassword ? (
                    <EyeOff size={16} />
                  ) : (
                    <Eye size={16} />
                  )}
                </button>
              </div>
            </div>

            <button
              className="w-full py-3.5 bg-gradient-to-br from-[#003d9b] to-[#0052cc] text-white font-bold rounded-xl disabled:opacity-60"
              type="submit"
              disabled={loading}
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>

            <div className="text-right text-xs mt-1">
              <span
                onClick={() => navigate("/forgot-password")}
                className="text-[#003d9b] cursor-pointer hover:underline"
              >
                Forgot Password?
              </span>
            </div>

            <div className="flex justify-center pt-2">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => alert("Google Login Failed")}
              />
            </div>

            <div className="pt-3 text-center">
              <p className="text-xs text-[#434654]">
                New here?
                <span
                  onClick={() => navigate("/register")}
                  className="text-[#003d9b] font-bold ml-1 cursor-pointer hover:underline"
                >
                  Create account
                </span>
              </p>
            </div>
          </form>

          <footer className="mt-auto pt-6 text-[#737685] text-[9px] font-bold opacity-60">
            © 2024 StayLink
          </footer>
        </section>
      </main>
    </div>
  );
};

export default LoginModal;