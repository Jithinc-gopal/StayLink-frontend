import { Hotel, Building, Palmtree } from "lucide-react";

const categories = [
  {
    icon: Hotel,
    title: "Premium Hotels",
    description:
      "Luxury amenities and full-service support for professional transients.",
    colorClass: "bg-blue-50 text-[#003d9b] group-hover:bg-[#003d9b] group-hover:text-white",
  },
  {
    icon: Building,
    title: "Modern PGs",
    description:
      "Community-focused living with modern infrastructure for long-term comfort.",
    colorClass: "bg-emerald-50 text-[#006c47] group-hover:bg-[#006c47] group-hover:text-white",
  },
  {
    icon: Palmtree,
    title: "Curated Homestays",
    description:
      "Authentic local experiences in quiet, verified residential neighborhoods.",
    colorClass: "bg-amber-50 text-[#583f00] group-hover:bg-[#583f00] group-hover:text-white",
  },
];

export default function RefinedCategories() {
  return (
    <section className="py-20 px-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
        <div>
          <h2 className="font-['Plus_Jakarta_Sans'] text-3xl font-bold text-[#041b3c] tracking-tight mb-2">
            Refined Categories
          </h2>
          <p className="text-slate-500">
            Tailored stays for every phase of your journey.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {categories.map(({ icon: Icon, title, description, colorClass }) => (
          <div
            key={title}
            className="group cursor-pointer bg-white p-8 rounded-3xl transition-all duration-300 hover:shadow-[0px_8px_40px_rgba(4,27,60,0.06)] flex flex-col gap-6"
          >
            <div
              className={`h-14 w-14 rounded-2xl flex items-center justify-center transition-colors duration-300 ${colorClass}`}
            >
              <Icon size={28} />
            </div>
            <div>
              <h3 className="font-['Plus_Jakarta_Sans'] text-xl font-bold mb-2">
                {title}
              </h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                {description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}