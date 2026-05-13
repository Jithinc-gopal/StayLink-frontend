import { BadgeCheck, ArrowRight } from "lucide-react";

const properties = [
  {
    id: 1,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCeGrMvekxdfw9hLP1d_HINln9QvZfoGGm949VtlSCsaILlC65BxFBj7lIZ9cEHRr1s9NVZ0VyRnR3O8zec3vhfFvjk9u9pqikpLgeYiEB8s5Hyk7deUQR1cGF74qFlkuS0WIC3GDkiETbTRIeft098LvNRLMYxMQbwBVkD4ysclskG6J8p1QzRS477mp7AucQfRylT_b88UlwDpqWhIenJX4K1pJ5odbstir7_6KiJXxvklHvMtiK2YGCdHCSI7fbqbqBKkEHVHE8",
    title: "The Azure Retreat",
    subtitle: "Santorini Inspired • Private Pool",
    price: "$450",
    priceUnit: "per night",
    badge: "StayLink Select",
    large: true,
  },
  {
    id: 2,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBFfQ8VH6vH8D1EgttVbEpgYiOEFDzIiMI9iLr6kYtiOKjDVEglAlBIYC1RyXKkBOSGQi3YTUjnqsubIPRZ1uCcFDyVtqCsnYVZwDBG8sbEUuTJfRIHUGq-sQbzu5RKPlm__itU-FJ2Mly5Pob5y-SGgH8ILmKyBsl4h5InCAZUFV_oaYhaBxKn7R5nGnSP9FPR6a_e6mkg2L2pbsmDv-xHI6fDoD5AX2RK7gKCBebCp9C3gX35DWopqrYUDsfcmp9EsLxqRaJXt80",
    title: "Urban Sanctuary PG",
    subtitle: "Tech District • All Inclusive",
    price: "$1,200/mo",
    large: false,
  },
  {
    id: 3,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCp_6Ha0D3mBvfsJj-8e545fRPOOZy7k4tP5lRESfynXrRrf5bEBpaqAyLFbDIhz4VGDn0Jk3HhXJvFRBn-qfS7NVGdvwC8paLFr45mQ34APuQmih7tSVfU10Vxq_WN92Bsj_JyxigbyujSX0NiQkzqs18lqfCqw2ypVVX6MlMJbXmp99tYZVcys5bvIJIy3-1f1hI-klJrWYiPXcZrZxKc9BP7lxqZI7sCEdeHnoZKS8FxFqEGKYBEiC2k_0PRkP9krlahQgbz-cU",
    title: "Heritage Homestay",
    subtitle: "Old Town • Breakfast Included",
    price: "$85/night",
    large: false,
  },
];

function VerifiedBadge() {
  return (
    <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 backdrop-blur-md">
      <BadgeCheck size={14} />
      Verified
    </span>
  );
}

export default function FeaturedExperiences() {
  const large = properties.find((p) => p.large);
  const small = properties.filter((p) => !p.large);

  return (
    <section className="py-20 bg-[#f1f3ff] px-8 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-16">
          <h2 className="font-['Plus_Jakarta_Sans'] text-4xl font-extrabold tracking-tighter text-[#041b3c]">
            Featured Experiences
          </h2>
          <a
            href="#"
            className="text-[#003d9b] font-bold flex items-center gap-2 group"
          >
            Explore all
            <ArrowRight
              size={18}
              className="transition-transform group-hover:translate-x-1"
            />
          </a>
        </div>

        <div className="grid grid-cols-12 gap-8">
          {/* Large Card */}
          <div className="col-span-12 md:col-span-7 group">
            <div className="relative rounded-[2rem] overflow-hidden aspect-[16/10] mb-6 shadow-xl">
              <img
                src={large.image}
                alt={large.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute top-6 left-6 flex gap-2">
                <VerifiedBadge />
                <span className="bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold text-[#041b3c]">
                  {large.badge}
                </span>
              </div>
            </div>
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-['Plus_Jakarta_Sans'] text-2xl font-bold mb-1">
                  {large.title}
                </h3>
                <p className="text-slate-500">{large.subtitle}</p>
              </div>
              <div className="text-right">
                <span className="text-2xl font-black text-[#003d9b]">
                  {large.price}
                </span>
                <span className="text-xs font-bold text-slate-400 uppercase block tracking-widest">
                  {large.priceUnit}
                </span>
              </div>
            </div>
          </div>

          {/* Small Cards Stack */}
          <div className="col-span-12 md:col-span-5 flex flex-col gap-12">
            {small.map((p) => (
              <div key={p.id} className="group">
                <div className="relative rounded-[2rem] overflow-hidden aspect-video mb-4 shadow-lg">
                  <img
                    src={p.image}
                    alt={p.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute top-4 left-4">
                    <VerifiedBadge />
                  </div>
                </div>
                <h3 className="font-['Plus_Jakarta_Sans'] text-xl font-bold">
                  {p.title}
                </h3>
                <p className="text-slate-500 text-sm">{p.subtitle}</p>
                <span className="text-lg font-bold text-[#003d9b] mt-2 inline-block">
                  {p.price}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}