import { useNavigate } from "react-router-dom";
import {
  Building2,
  BriefcaseBusiness,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  FileCheck,
  UserCheck,
  BadgeCheck,
} from "lucide-react";

import Navbar from "../../components/LandingpageComponents/Navbar";
import Footer from "../../components/LandingpageComponents/Footer";

const JoinOurTeamPage = () => {
  const navigate = useNavigate();

  /* ================= ROLE DATA ================= */

  const roles = [
    {
      title: "Property Owner",
      icon: <Building2 size={34} />,
      role: "owner",

      description:
        "Manage and grow your rental properties with StayLink’s professional owner platform.",

      features: [
        "Professional property dashboard",
        "Property & booking management",
        "Verified owner profile",
        "Revenue & analytics access",
      ],
    },

    {
      title: "Broker",
      icon: <BriefcaseBusiness size={34} />,
      role: "broker",

      description:
        "Help users discover premium stays and build your trusted broker presence.",

      features: [
        "Lead & inquiry management",
        "Verified broker profile",
        "Business growth opportunities",
        "Client & property management",
      ],
    },
  ];

  /* ================= PROCESS STEPS ================= */

  const steps = [
    {
      icon: <UserCheck size={28} />,

      title: "Create Account",

      description:
        "Register using your professional email and select your role.",
    },

    {
      icon: <FileCheck size={28} />,

      title: "Submit Details",

      description:
        "Fill your profile information and upload verification documents.",
    },

    {
      icon: <ShieldCheck size={28} />,

      title: "Admin Review",

      description:
        "Our admin team carefully reviews and verifies your profile.",
    },

    {
      icon: <BadgeCheck size={28} />,

      title: "Get Approved",

      description:
        "Access your professional dashboard after successful approval.",
    },
  ];

  /* ================= CONTINUE FUNCTION ================= */

  const handleContinue = (role) => {
    navigate("/partner/register", {
      state: {
        role: role,
      },
    });
  };

  return (
    <div className="bg-[#f9f9ff] text-[#041b3c] min-h-screen">

      {/* ================= NAVBAR ================= */}

      <Navbar />

      {/* ===================================================== */}
      {/* ===================== HERO SECTION ================== */}
      {/* ===================================================== */}

      <section className="relative overflow-hidden">

        {/* BACKGROUND IMAGE */}
        <div className="absolute inset-0">

          <img
            src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267"
            alt="Join Our Team"
            className="w-full h-full object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-r from-[#041b3c]/95 via-[#003d9b]/85 to-[#003d9b]/70"></div>

        </div>

        {/* HERO CONTENT */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-28 lg:py-36">

          <div className="max-w-3xl">

            {/* BADGE */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/10 backdrop-blur-sm text-white text-sm font-semibold mb-6">

              <ShieldCheck size={16} />

              StayLink Partner Program

            </div>

            {/* TITLE */}
            <h1 className="text-5xl lg:text-6xl font-extrabold text-white leading-tight">

              Build Your Business
              <br />

              With
              <span className="text-[#8bb8ff]"> StayLink</span>

            </h1>

            {/* DESCRIPTION */}
            <p className="mt-6 text-lg text-[#dbe6ff] leading-relaxed max-w-2xl">

              Join StayLink as a verified property owner or broker and
              connect with travelers searching for premium stays and
              trusted experiences.

            </p>

            {/* TAGS */}
            <div className="flex flex-wrap gap-4 mt-10">

              <div className="bg-white/10 backdrop-blur-sm px-5 py-3 rounded-2xl text-white text-sm font-medium">
                ✔ Verified Partner Access
              </div>

              <div className="bg-white/10 backdrop-blur-sm px-5 py-3 rounded-2xl text-white text-sm font-medium">
                ✔ Admin Approval System
              </div>

              <div className="bg-white/10 backdrop-blur-sm px-5 py-3 rounded-2xl text-white text-sm font-medium">
                ✔ Professional Dashboard
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ===================================================== */}
      {/* ================= HOW IT WORKS SECTION ============== */}
      {/* ===================================================== */}

      <section className="py-24">

        <div className="max-w-7xl mx-auto px-6">

          {/* SECTION HEADER */}
          <div className="text-center max-w-3xl mx-auto mb-16">

            <h2 className="text-4xl lg:text-5xl font-extrabold text-[#041b3c]">
              How Joining Works
            </h2>

            <p className="mt-5 text-[#5c6070] leading-relaxed">
              Our onboarding process ensures a trusted and professional
              ecosystem for all partners on StayLink.
            </p>

          </div>

          {/* STEPS */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">

            {steps.map((step, index) => (

              <div
                key={index}
                className="bg-white rounded-[2rem] p-8 border border-[#edf1ff] shadow-xl shadow-[#003d9b]/5 hover:-translate-y-1 transition-all duration-300"
              >

                {/* ICON */}
                <div className="w-16 h-16 rounded-2xl bg-[#eef4ff] text-[#003d9b] flex items-center justify-center mb-8">

                  {step.icon}

                </div>

                {/* TITLE */}
                <h3 className="text-2xl font-bold mb-4">

                  {step.title}

                </h3>

                {/* DESCRIPTION */}
                <p className="text-[#5c6070] leading-relaxed text-sm">

                  {step.description}

                </p>
              </div>

            ))}
          </div>
        </div>
      </section>

      {/* ===================================================== */}
      {/* ==================== ROLE SECTION =================== */}
      {/* ===================================================== */}

      <section className="pb-28">

        <div className="max-w-7xl mx-auto px-6">

          {/* HEADER */}
          <div className="text-center max-w-3xl mx-auto mb-16">

            <h2 className="text-4xl lg:text-5xl font-extrabold text-[#041b3c]">
              Choose Your Role
            </h2>

            <p className="mt-5 text-[#5c6070] leading-relaxed">
              Start your professional journey by selecting the role
              that best matches your business.
            </p>

          </div>

          {/* ROLE CARDS */}
          <div className="grid lg:grid-cols-2 gap-8">

            {roles.map((role, index) => (

              <div
                key={index}
                className="relative overflow-hidden bg-white rounded-[2rem] border border-[#edf1ff] p-10 shadow-xl shadow-[#003d9b]/5 hover:-translate-y-1 transition-all duration-300"
              >

                {/* BG EFFECT */}
                <div className="absolute top-0 right-0 w-40 h-40 bg-[#003d9b]/5 rounded-full blur-3xl"></div>

                {/* ICON */}
                <div className="relative z-10 w-16 h-16 rounded-2xl bg-[#eef4ff] text-[#003d9b] flex items-center justify-center mb-8">

                  {role.icon}

                </div>

                {/* CONTENT */}
                <div className="relative z-10">

                  {/* TITLE */}
                  <h3 className="text-3xl font-extrabold mb-4">

                    {role.title}

                  </h3>

                  {/* DESCRIPTION */}
                  <p className="text-[#5c6070] leading-relaxed mb-8">

                    {role.description}

                  </p>

                  {/* FEATURES */}
                  <div className="space-y-4 mb-10">

                    {role.features.map((feature, idx) => (

                      <div
                        key={idx}
                        className="flex items-center gap-3"
                      >

                        <CheckCircle2
                          size={18}
                          className="text-[#003d9b]"
                        />

                        <span className="text-sm text-[#434654]">

                          {feature}

                        </span>

                      </div>

                    ))}
                  </div>

                  {/* CONTINUE BUTTON */}
                  <button
                    onClick={() => handleContinue(role.role)}
                    className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#003d9b] to-[#0052cc] text-white font-bold flex items-center justify-center gap-2 hover:opacity-95 transition-all shadow-lg shadow-[#003d9b]/20"
                  >

                    Continue as {role.title}

                    <ArrowRight size={18} />

                  </button>
                </div>
              </div>

            ))}
          </div>
        </div>
      </section>

      {/* ================= FOOTER ================= */}

      <Footer />
    </div>
  );
};

export default JoinOurTeamPage;