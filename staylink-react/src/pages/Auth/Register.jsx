import { useState } from "react";

import {
  Eye,
  EyeOff,
  Mail,
  User,
  Lock,
  MailCheck,
} from "lucide-react";

import {
  registerUser,
} from "../../services/authService";

import {
  useNavigate,
  Link,
} from "react-router-dom";

const Register = () => {

  const navigate = useNavigate();

  const [showPassword, setShowPassword] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [successMessage, setSuccessMessage] =
    useState("");

  const [form, setForm] = useState({
    first_name: "",
    email: "",
    password: "",
    confirm_password: "",
  });

  // =========================
  // HANDLE INPUT
  // =========================

  const handleChange = (e) => {

    setForm({
      ...form,
      [e.target.id]: e.target.value,
    });
  };

  // =========================
  // SUBMIT REGISTER
  // =========================

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

    if (
      form.password !==
      form.confirm_password
    ) {

      alert("Passwords do not match");

      return;
    }

    const payload = {
      first_name: form.first_name,
      email: form.email,
      password: form.password,
      confirm_password:
        form.confirm_password,
    };

    try {

      setLoading(true);

      // =========================
      // REGISTER API
      // =========================

      const res =
        await registerUser(payload);

      // =========================
      // DO NOT STORE TOKENS
      // =========================

      // ONLY STORE EMAIL
      // FOR VERIFY CODE PAGE

      localStorage.setItem(
        "verification_email",
        form.email
      );

      // =========================
      // SHOW SUCCESS MESSAGE
      // =========================

      setSuccessMessage(
        res.data.message ||
        "Registration successful. Check your email for verification code."
      );

      // =========================
      // REDIRECT TO VERIFY PAGE
      // =========================

      setTimeout(() => {

        navigate("/verify-code");

      }, 1500);

    } catch (err) {

      console.error(
        err.response?.data
      );

      if (err.response?.data) {

        const errors =
          err.response.data;

        if (
          typeof errors === "object"
        ) {

          const firstError =
            Object.values(errors)[0];

          alert(
            Array.isArray(firstError)
              ? firstError[0]
              : firstError
          );

        } else {

          alert(
            "Registration failed"
          );
        }

      } else {

        alert(
          "Something went wrong"
        );
      }

    } finally {

      setLoading(false);
    }
  };

  return (

    <div className="bg-[#f1f3ff] font-sans text-[#041b3c] flex items-center justify-center min-h-screen p-4">

      <main className="w-full max-w-6xl min-h-[700px] flex flex-col md:flex-row overflow-hidden bg-[#f9f9ff] rounded-[2.5rem] shadow-2xl shadow-[#003d9b]/5">

        {/* =========================
            LEFT SIDE
        ========================= */}

        <section className="hidden md:flex md:w-[40%] relative p-10 flex-col justify-end">

          <div className="absolute inset-0 z-0">

            <img
              alt="StayLink"
              className="w-full h-full object-cover"
              src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-[#003d9b]/80 via-[#003d9b]/20 to-transparent"></div>

          </div>

          <div className="relative z-10 space-y-4">

            <h2 className="text-white text-4xl font-extrabold leading-tight">

              Discover Unique
              <br />
              Places with StayLink

            </h2>

            <p className="text-sm text-[#f1f3ff] leading-relaxed">

              Create your account and start exploring verified stays,
              premium experiences, and trusted travel services.

            </p>

          </div>

        </section>

        {/* =========================
            RIGHT SIDE
        ========================= */}

        <section className="flex-1 flex flex-col items-center justify-center p-8 lg:px-20 bg-[#f9f9ff]">

          {/* BACK BUTTON */}

          <div className="w-full max-w-md mb-3">

            <Link
              to="/login"
              className="text-sm text-[#003d9b] font-semibold hover:underline"
            >

              ← Back to Login

            </Link>

          </div>

          {/* HEADER */}

          <div className="mb-8 w-full max-w-md">

            <h1 className="text-4xl font-extrabold text-[#003d9b]">

              Create Account

            </h1>

            <p className="text-sm text-[#434654] mt-2">

              Join StayLink and start your journey today.

            </p>

          </div>

          {/* SUCCESS MESSAGE */}

          {successMessage && (

            <div className="w-full max-w-md mb-5 bg-green-100 border border-green-200 text-green-700 px-5 py-4 rounded-2xl flex items-start gap-3">

              <MailCheck
                size={22}
                className="mt-0.5"
              />

              <div>

                <h3 className="font-bold">

                  Verification Required

                </h3>

                <p className="text-sm mt-1">

                  {successMessage}

                </p>

              </div>

            </div>

          )}

          {/* FORM */}

          <form
            onSubmit={handleSubmit}
            className="w-full max-w-md space-y-5"
          >

            {/* FULL NAME */}

            <div className="relative">

              <User
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />

              <input
                id="first_name"
                type="text"
                placeholder="Full Name"
                value={form.first_name}
                onChange={handleChange}
                className="w-full pl-12 pr-4 py-3 bg-[#f1f3ff] rounded-xl text-sm outline-none border border-transparent focus:border-[#003d9b]"
              />

            </div>

            {/* EMAIL */}

            <div className="relative">

              <Mail
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />

              <input
                id="email"
                type="email"
                placeholder="Email Address"
                value={form.email}
                onChange={handleChange}
                className="w-full pl-12 pr-4 py-3 bg-[#f1f3ff] rounded-xl text-sm outline-none border border-transparent focus:border-[#003d9b]"
              />

            </div>

            {/* PASSWORD */}

            <div className="relative">

              <Lock
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />

              <input
                id="password"
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                className="w-full pl-12 pr-12 py-3 bg-[#f1f3ff] rounded-xl text-sm outline-none border border-transparent focus:border-[#003d9b]"
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword(
                    !showPassword
                  )
                }
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
              >

                {showPassword
                  ? <EyeOff size={18} />
                  : <Eye size={18} />
                }

              </button>

            </div>

            {/* CONFIRM PASSWORD */}

            <div className="relative">

              <Lock
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />

              <input
                id="confirm_password"
                type="password"
                placeholder="Confirm Password"
                value={
                  form.confirm_password
                }
                onChange={handleChange}
                className="w-full pl-12 pr-4 py-3 bg-[#f1f3ff] rounded-xl text-sm outline-none border border-transparent focus:border-[#003d9b]"
              />

            </div>

            {/* BUTTON */}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-[#003d9b] to-[#0052cc] hover:opacity-95 transition-all text-white font-bold rounded-xl shadow-lg shadow-[#003d9b]/20"
            >

              {loading
                ? "Creating Account..."
                : "Create Account"
              }

            </button>

          </form>

          {/* LOGIN */}

          <div className="pt-6 text-center">

            <p className="text-sm text-[#434654]">

              Already have an account?

              <Link
                to="/login"
                className="text-[#003d9b] font-bold hover:underline ml-1"
              >

                Sign In

              </Link>

            </p>

          </div>

          {/* JOIN OUR TEAM */}

          <div className="mt-8 w-full max-w-md border-t pt-6 text-center">

            <p className="text-sm text-[#434654] mb-3">

              Want to become a property owner or broker?

            </p>

            <Link
              to="/join-our-team"
              className="inline-block px-6 py-3 rounded-xl border border-[#003d9b] text-[#003d9b] font-semibold hover:bg-[#003d9b] hover:text-white transition-all"
            >

              Join Our Team

            </Link>

          </div>

          {/* FOOTER */}

          <footer className="mt-10 text-[#737685] text-xs opacity-60">

            © 2026 StayLink. All rights reserved.

          </footer>

        </section>

      </main>

    </div>
  );
};

export default Register;