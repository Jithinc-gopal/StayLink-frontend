import Hero from "../../components/LandingpageComponents/Hero";
import RefinedCategories from "../../components/LandingpageComponents/RefinedCategories";
import FeaturedExperiences from "../../components/LandingpageComponents/FeaturedExperiences";
import TrustIndicators from "../../components/LandingpageComponents/TrustIndicators";
import JoinOurTeamPreview from "../../components/LandingpageComponents/JoinOurTeamPreview";
import Footer from "../../components/LandingpageComponents/Footer";
import AIChatButton from "../../components/LandingpageComponents/AIChatButton";
import Navbar from "../../components/LandingpageComponents/Navbar";

export default function Landing() {
    return (
        <div className="bg-[#f9f9ff] text-[#041b3c] min-h-screen">

            <Navbar />

            <main>
                <Hero />

                <RefinedCategories />

                <FeaturedExperiences />

                <TrustIndicators />

                {/* ✅ JOIN OUR TEAM SECTION */}
                <JoinOurTeamPreview />
            </main>

            <Footer />

            <AIChatButton />
        </div>
    );
}