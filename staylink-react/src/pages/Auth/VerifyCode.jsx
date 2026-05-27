import React, { useState } from "react";

import {
  ShieldCheck,
  Loader2,
  MailCheck,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import { verifyCode } from "../../services/authService";
const VerifyCode = () => {

  const navigate = useNavigate();

  const [code, setCode] = useState("");

  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState("");

  const [success, setSuccess] = useState(false);

  // =========================
  // GET EMAIL FROM LOCALSTORAGE
  // =========================

  const email = localStorage.getItem(
    "verification_email"
  );

  // =========================
  // VERIFY CODE
  // =========================

  const handleVerify = async (e) => {

    e.preventDefault();

    // CHECK EMAIL
    if (!email) {

      setMessage(
        "Email not found. Please register again."
      );

      return;
    }

    // CHECK CODE
    if (!code) {

      setMessage(
        "Please enter verification code"
      );

      return;
    }

    try {

      setLoading(true);

      setMessage("");

      // API CALL
      const response = await verifyCode({
        email,
        code,
      });

      console.log(
        "VERIFY RESPONSE:",
        response.data
      );

      // =========================
      // STORE TOKENS
      // =========================

      localStorage.setItem(
        "access",
        response.data.access_token
      );

      localStorage.setItem(
        "refresh",
        response.data.refresh_token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(response.data.user)
      );

      // REMOVE TEMP EMAIL
      localStorage.removeItem(
        "verification_email"
      );

      setSuccess(true);

      setMessage(
        response.data.message ||
        "Email verified successfully"
      );

      // =========================
      // REDIRECT
      // =========================

      setTimeout(() => {

        const user = response.data.user;

        // OWNER
        if (user?.role === "owner") {

          navigate(
            user.profile_completed
              ? "/owner/dashboard"
              : "/owner/setup"
          );

          return;
        }

        // BROKER
        if (user?.role === "broker") {

          navigate(
            user.profile_completed
              ? "/broker/dashboard"
              : "/broker/setup"
          );

          return;
        }

        // NORMAL USER
        navigate("/");

      }, 2000);

    } catch (error) {

      console.log(
        "FULL ERROR:",
        error
      );

      console.log(
        "ERROR RESPONSE:",
        error.response
      );

      console.log(
        "ERROR DATA:",
        error.response?.data
      );

      setSuccess(false);

      setMessage(
        error.response?.data?.error ||
        error.message ||
        "Verification failed"
      );

    } finally {

      setLoading(false);
    }
  };

  return (

    <div className="min-h-screen bg-[#f1f3ff] flex items-center justify-center p-4">

      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-10">

        {/* ICON */}

        <div className="flex justify-center mb-6">

          <div className="bg-blue-100 p-5 rounded-full">

            <MailCheck
              className="text-[#003d9b]"
              size={50}
            />

          </div>

        </div>

        {/* TITLE */}

        <div className="text-center mb-8">

          <h1 className="text-3xl font-extrabold text-[#003d9b]">

            Verify Your Email

          </h1>

          <p className="text-gray-500 mt-3 text-sm leading-relaxed">

            Enter the verification code sent to

            <br />

            <span className="font-semibold text-gray-700">

              {email}

            </span>

          </p>

        </div>

        {/* FORM */}

        <form
          onSubmit={handleVerify}
          className="space-y-5"
        >

          {/* INPUT */}

          <div>

            <input
              type="text"
              placeholder="Enter verification code"
              value={code}
              onChange={(e) =>
                setCode(e.target.value)
              }
              className="
                w-full
                text-center
                tracking-[10px]
                uppercase
                text-2xl
                font-bold
                py-4
                rounded-2xl
                border
                border-gray-300
                focus:border-[#003d9b]
                outline-none
                bg-[#f9f9ff]
              "
              maxLength={6}
            />

          </div>

          {/* MESSAGE */}

          {message && (

            <div
              className={`
                text-sm
                text-center
                font-medium
                ${
                  success
                    ? "text-green-600"
                    : "text-red-500"
                }
              `}
            >

              {message}

            </div>

          )}

          {/* BUTTON */}

          <button
            type="submit"
            disabled={loading}
            className="
              w-full
              py-4
              rounded-2xl
              bg-gradient-to-r
              from-[#003d9b]
              to-[#0052cc]
              text-white
              font-bold
              hover:opacity-95
              transition-all
              flex
              items-center
              justify-center
              gap-2
            "
          >

            {loading ? (
              <>
                <Loader2
                  className="animate-spin"
                  size={20}
                />

                Verifying...

              </>
            ) : (
              <>
                <ShieldCheck size={20} />

                Verify Email

              </>
            )}

          </button>

        </form>

      </div>

    </div>
  );
};

export default VerifyCode;