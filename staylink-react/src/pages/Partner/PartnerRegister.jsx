import { useEffect, useState } from "react";
import {
  useLocation,
  useNavigate,
  Link,
} from "react-router-dom";

import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  ShieldCheck,
} from "lucide-react";

import { registerPartner } from "../../services/authService";

const PartnerRegister = () => {
  const navigate = useNavigate();
  const location = useLocation();

  /* ====================================================== */
  /* ================= ROLE FROM NAVIGATION =============== */
  /* ====================================================== */

  const selectedRole = location.state?.role;

  /* ====================================================== */
  /* ================= PROTECT DIRECT ACCESS ============== */
  /* ====================================================== */

  useEffect(() => {
    if (!selectedRole) {
      navigate("/join-our-team");
    }
  }, [selectedRole, navigate]);

  /* ====================================================== */
  /* ===================== STATES ========================= */
  /* ====================================================== */

  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    first_name: "",
    email: "",
    password: "",
    confirm_password: "",
  });

  /* ====================================================== */
  /* ================= HANDLE CHANGE ====================== */
  /* ====================================================== */

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.id]: e.target.value,
    });
  };

  /* ====================================================== */
  /* ================= HANDLE SUBMIT ====================== */
  /* ====================================================== */

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !form.first_name ||
      !form.email ||
      !form.password ||
      !form.confirm_password
    ) {
      alert("Please fill all fields");
      return;
    }

    if (form.password !== form.confirm_password) {
      alert("Passwords do not match");
      return;
    }

    const payload = {
      first_name: form.first_name,
      email: form.email,
      password: form.password,
      confirm_password: form.confirm_password,
      role: selectedRole,
    };

    try {
      setLoading(true);

      const res = await registerPartner(payload);

      const { user, access, refresh } = res.data;

      /* SAVE TOKENS */
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("access", access);
      localStorage.setItem("refresh", refresh);

      /* ROLE BASED REDIRECT */
      if (user.role === "owner") {
        navigate("/owner/setup");
      }

      else if (user.role === "broker") {
        navigate("/broker/setup");
      }

    } catch (err) {
      console.error(err.response?.data);

      alert(
        err.response?.data?.detail ||
        "Registration failed"
      );

    } finally {
      setLoading(false);
    }
  };

  /* ====================================================== */
  /* ================= ROLE LABEL ========================= */
  /* ====================================================== */

  const roleLabel =
    selectedRole === "owner"
      ? "Property Owner"
      : "Broker";

  /* ====================================================== */
  /* ====================== UI ============================ */
  /* ====================================================== */

  return (
    <div className="min-h-screen bg-[#f1f3ff] flex items-center justify-center p-4">

      <main className="w-full max-w-6xl h-full max-h-[760px] flex flex-col lg:flex-row overflow-hidden bg-[#f9f9ff] rounded-[2.5rem] shadow-2xl shadow-[#003d9b]/5">

        {/* ====================================================== */}
        {/* ================= LEFT SIDE ========================== */}
        {/* ====================================================== */}

        <section className="hidden lg:flex lg:w-[42%] relative p-10 flex-col justify-end overflow-hidden">

          {/* BACKGROUND IMAGE */}
          <div className="absolute inset-0 z-0">

            <img
              src="https://images.unsplash.com/photo-1505693416388-ac5ce068fe85"
              alt="Partner Register"
              className="w-full h-full object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-[#041b3c]/95 via-[#003d9b]/60 to-[#003d9b]/20"></div>

          </div>

          {/* CONTENT */}
          <div className="relative z-10 text-white">

            {/* BADGE */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/10 backdrop-blur-sm text-sm font-semibold mb-6">

              <ShieldCheck size={16} />

              StayLink Partner Program

            </div>

            {/* TITLE */}
            <h1 className="text-4xl font-extrabold leading-tight">

              Become a Verified
              <br />

              {roleLabel}

            </h1>

            {/* DESCRIPTION */}
            <p className="mt-5 text-[#dbe6ff] leading-relaxed text-sm max-w-md">

              Create your professional StayLink partner account and
              continue your onboarding process.

            </p>

            {/* FEATURES */}
            <div className="mt-10 space-y-4">

              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-white"></div>

                <span className="text-sm">
                  Professional dashboard access
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-white"></div>

                <span className="text-sm">
                  Verification & approval system
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-white"></div>

                <span className="text-sm">
                  Secure partner onboarding
                </span>
              </div>

            </div>
          </div>
        </section>

        {/* ====================================================== */}
        {/* ================= RIGHT SIDE ========================= */}
        {/* ====================================================== */}

        <section className="flex-1 flex flex-col justify-center p-8 lg:px-20 overflow-y-auto">

          {/* BACK BUTTON */}
          <div className="w-full max-w-md mb-6">

            <Link
              to="/join-our-team"
              className="text-sm text-[#003d9b] font-semibold hover:underline"
            >
              ← Back
            </Link>

          </div>

          {/* HEADING */}
          <div className="w-full max-w-md mb-8">

            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#eef4ff] text-[#003d9b] text-sm font-semibold mb-5">

              <ShieldCheck size={16} />

              {roleLabel} Registration

            </div>

            <h2 className="text-4xl font-extrabold text-[#041b3c]">

              Create Partner Account

            </h2>

            <p className="mt-3 text-[#5c6070] leading-relaxed">

              Register your professional StayLink partner account
              to continue the verification process.

            </p>
          </div>

          {/* FORM */}
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-md space-y-5"
          >

            {/* FULL NAME */}
            <div className="relative">

              <User
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                id="first_name"
                type="text"
                placeholder="Full Name"
                value={form.first_name}
                onChange={handleChange}
                className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-[#f1f3ff] border border-transparent focus:border-[#003d9b] outline-none text-sm"
              />
            </div>

            {/* EMAIL */}
            <div className="relative">

              <Mail
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                id="email"
                type="email"
                placeholder="Professional Email"
                value={form.email}
                onChange={handleChange}
                className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-[#f1f3ff] border border-transparent focus:border-[#003d9b] outline-none text-sm"
              />
            </div>

            {/* PASSWORD */}
            <div className="relative">

              <Lock
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                className="w-full pl-12 pr-12 py-3.5 rounded-2xl bg-[#f1f3ff] border border-transparent focus:border-[#003d9b] outline-none text-sm"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
              >
                {showPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>
            </div>

            {/* CONFIRM PASSWORD */}
            <div className="relative">

              <Lock
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                id="confirm_password"
                type="password"
                placeholder="Confirm Password"
                value={form.confirm_password}
                onChange={handleChange}
                className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-[#f1f3ff] border border-transparent focus:border-[#003d9b] outline-none text-sm"
              />
            </div>

            {/* BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#003d9b] to-[#0052cc] text-white font-bold hover:opacity-95 transition-all shadow-xl shadow-[#003d9b]/20"
            >

              {loading
                ? "Creating Account..."
                : `Continue as ${roleLabel}`}

            </button>

          </form>

          {/* LOGIN */}
          <div className="mt-6 w-full max-w-md text-center">

            <p className="text-sm text-[#5c6070]">

              Already have an account?

              <Link
                to="/login"
                className="text-[#003d9b] font-bold ml-1 hover:underline"
              >
                Sign In
              </Link>

            </p>
          </div>

          {/* FOOTER */}
          <div className="mt-auto pt-8 text-center text-xs text-[#7c8195]">

            © 2026 StayLink. All rights reserved.

          </div>
        </section>
      </main>
    </div>
  );
};

export default PartnerRegister;