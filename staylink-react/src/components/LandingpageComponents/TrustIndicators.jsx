import { ShieldCheck, UserCheck, Headphones, ThumbsUp } from "lucide-react";

const trustItems = [
  {
    icon: ShieldCheck,
    title: "Secured Payments",
    description: "Bank-grade encryption for every transaction.",
  },
  {
    icon: UserCheck,
    title: "Verified Hosts",
    description: "100% ID and property background checks.",
  },
  {
    icon: Headphones,
    title: "Concierge Support",
    description: "24/7 dedicated assistance for your stay.",
  },
  {
    icon: ThumbsUp,
    title: "Quality Guaranteed",
    description: "Property audit before every new listing.",
  },
];

export default function TrustIndicators() {
  return (
    <section className="py-24 px-8 max-w-7xl mx-auto text-center">
      <h2 className="font-['Plus_Jakarta_Sans'] text-3xl font-bold mb-16 text-[#041b3c]">
        Built on Unwavering Trust
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
        {trustItems.map(({ icon: Icon, title, description }) => (
          <div key={title} className="flex flex-col items-center gap-4">
            <Icon size={40} className="text-[#003d9b]" strokeWidth={1.5} />
            <h4 className="font-bold text-[#041b3c]">{title}</h4>
            <p className="text-sm text-slate-500">{description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}