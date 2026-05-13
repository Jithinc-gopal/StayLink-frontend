import { useNavigate } from "react-router-dom";
import {
  Building2,
  BriefcaseBusiness,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

const JoinOurTeamPreview = () => {
  const navigate = useNavigate();

  return (
    <section className="py-24 bg-gradient-to-b from-[#f9f9ff] to-white">

      <div className="max-w-7xl mx-auto px-6">

        {/* TOP HEADER */}
        <div className="text-center max-w-3xl mx-auto mb-16">

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#eef4ff] text-[#003d9b] text-sm font-semibold mb-6">
            <ShieldCheck size={16} />
            Trusted Partner Program
          </div>

          <h2 className="text-4xl lg:text-5xl font-extrabold text-[#041b3c] leading-tight">
            Join the
            <span className="text-[#003d9b]"> StayLink </span>
            Network
          </h2>

          <p className="mt-6 text-[#5c6070] text-lg leading-relaxed">
            Become a verified property owner or broker and grow your
            business with StayLink’s trusted platform.
          </p>
        </div>

        {/* CARDS */}
        <div className="grid lg:grid-cols-2 gap-8">

          {/* OWNER CARD */}
          <div className="group relative overflow-hidden bg-white rounded-[2rem] border border-[#edf1ff] p-10 shadow-xl shadow-[#003d9b]/5 hover:-translate-y-1 transition-all duration-300">

            {/* BG EFFECT */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-[#003d9b]/5 rounded-full blur-3xl"></div>

            {/* ICON */}
            <div className="relative z-10 w-16 h-16 rounded-2xl bg-[#eef4ff] text-[#003d9b] flex items-center justify-center mb-8">
              <Building2 size={34} />
            </div>

            {/* CONTENT */}
            <div className="relative z-10">

              <h3 className="text-3xl font-extrabold text-[#041b3c] mb-4">
                Property Owners
              </h3>

              <p className="text-[#5c6070] leading-relaxed mb-8">
                List and manage your verified properties, connect with
                travelers, and grow your rental business through StayLink.
              </p>

              <div className="space-y-4">

                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-[#003d9b]"></div>
                  <span className="text-sm text-[#434654]">
                    Professional property dashboard
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-[#003d9b]"></div>
                  <span className="text-sm text-[#434654]">
                    Booking & revenue management
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-[#003d9b]"></div>
                  <span className="text-sm text-[#434654]">
                    Verified owner profile
                  </span>
                </div>

              </div>
            </div>
          </div>

          {/* BROKER CARD */}
          <div className="group relative overflow-hidden bg-white rounded-[2rem] border border-[#edf1ff] p-10 shadow-xl shadow-[#003d9b]/5 hover:-translate-y-1 transition-all duration-300">

            {/* BG EFFECT */}
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-[#003d9b]/5 rounded-full blur-3xl"></div>

            {/* ICON */}
            <div className="relative z-10 w-16 h-16 rounded-2xl bg-[#eef4ff] text-[#003d9b] flex items-center justify-center mb-8">
              <BriefcaseBusiness size={34} />
            </div>

            {/* CONTENT */}
            <div className="relative z-10">

              <h3 className="text-3xl font-extrabold text-[#041b3c] mb-4">
                Brokers
              </h3>

              <p className="text-[#5c6070] leading-relaxed mb-8">
                Help clients discover premium stays and build your trusted
                broker presence with StayLink’s verified ecosystem.
              </p>

              <div className="space-y-4">

                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-[#003d9b]"></div>
                  <span className="text-sm text-[#434654]">
                    Verified broker identity
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-[#003d9b]"></div>
                  <span className="text-sm text-[#434654]">
                    Lead & inquiry management
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-[#003d9b]"></div>
                  <span className="text-sm text-[#434654]">
                    Business growth opportunities
                  </span>
                </div>

              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="flex justify-center mt-16">

          <button
            onClick={() => navigate("/join-our-team")}
            className="group px-8 py-4 rounded-2xl bg-gradient-to-r from-[#003d9b] to-[#0052cc] text-white font-bold flex items-center gap-3 hover:opacity-95 transition-all shadow-xl shadow-[#003d9b]/20"
          >
            Learn More & Join Our Team

            <ArrowRight
              size={18}
              className="group-hover:translate-x-1 transition-transform"
            />
          </button>

        </div>
      </div>
    </section>
  );
};

export default JoinOurTeamPreview;