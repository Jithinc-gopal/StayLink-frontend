import { useEffect, useState } from "react";
import {
  Star,
  MessageSquareText,
  Home,
  User,
  CalendarDays,
  TrendingUp,
} from "lucide-react";

import TopNavbar from "../../components/OwnerDashboardComponents/TopNavbar";
import { getOwnerReviews } from "../../services/propertyService";

const OwnerReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    try {
      setLoading(true);
      const data = await getOwnerReviews();
      setReviews(data || []);
    } catch (error) {
      console.log("Owner reviews error:", error);
    } finally {
      setLoading(false);
    }
  };

  const totalReviews = reviews.length;

  const averageRating =
    totalReviews > 0
      ? (
          reviews.reduce(
            (sum, review) => sum + Number(review.rating || 0),
            0
          ) / totalReviews
        ).toFixed(1)
      : "0.0";

  const fiveStarReviews = reviews.filter(
    (review) => Number(review.rating) === 5
  ).length;

  const renderStars = (rating) => {
    return [1, 2, 3, 4, 5].map((num) => (
      <Star
        key={num}
        size={17}
        className={
          num <= rating
            ? "fill-yellow-400 text-yellow-400"
            : "text-slate-300"
        }
      />
    ));
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <TopNavbar />

      <div className="pt-24 px-6 md:px-10 pb-12 max-w-7xl mx-auto">
        {/* HEADER */}
        <section className="bg-slate-900 rounded-[2rem] p-8 md:p-10 text-white shadow-xl relative overflow-hidden">
          <div className="absolute -top-20 -right-20 w-72 h-72 bg-yellow-400/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/10 text-white/80 text-sm font-semibold mb-5">
                <MessageSquareText size={16} />
                Guest Feedback Center
              </div>

              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
                Property Reviews
              </h1>

              <p className="text-slate-300 mt-4 max-w-3xl leading-relaxed">
                Monitor traveler feedback, understand guest experience,
                and improve your property performance through verified
                post-stay reviews.
              </p>
            </div>

            <div className="bg-white text-slate-900 rounded-3xl p-6 min-w-[240px] shadow-xl">
              <p className="text-sm text-slate-500 font-semibold">
                Average Rating
              </p>

              <div className="flex items-end gap-2 mt-2">
                <h2 className="text-5xl font-extrabold">
                  {averageRating}
                </h2>
                <span className="text-slate-400 mb-2">/ 5</span>
              </div>

              <div className="flex gap-1 mt-3">
                {renderStars(Math.round(Number(averageRating)))}
              </div>
            </div>
          </div>
        </section>

        {/* STATS */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-8">
          <StatCard
            icon={MessageSquareText}
            title="Total Reviews"
            value={totalReviews}
            text="Verified reviews received from completed stays."
          />

          <StatCard
            icon={Star}
            title="5-Star Reviews"
            value={fiveStarReviews}
            text="Travelers who rated your property experience excellent."
          />

          <StatCard
            icon={TrendingUp}
            title="Guest Satisfaction"
            value={`${averageRating}/5`}
            text="Overall rating performance across your properties."
          />
        </section>

        {/* REVIEWS LIST */}
        <section className="mt-8 bg-white border border-slate-200 rounded-[2rem] shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <h2 className="text-2xl font-bold text-slate-900">
              Recent Guest Reviews
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              Reviews submitted by travelers after completed and fully paid stays.
            </p>
          </div>

          {loading ? (
            <div className="p-10 text-center text-slate-500">
              Loading reviews...
            </div>
          ) : reviews.length === 0 ? (
            <div className="p-14 text-center">
              <Star size={44} className="mx-auto text-slate-300" />

              <h3 className="text-xl font-bold text-slate-900 mt-4">
                No reviews yet
              </h3>

              <p className="text-slate-500 mt-2">
                Guest reviews will appear here after travelers complete their stays.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="p-6 hover:bg-slate-50 transition"
                >
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        {renderStars(Number(review.rating))}
                      </div>

                      <p className="text-slate-700 mt-4 leading-relaxed">
                        “{review.comment}”
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-5 text-sm text-slate-500">
                        <p className="flex items-center gap-2">
                          <Home size={16} />
                          {review.property_title}
                        </p>

                        <p className="flex items-center gap-2">
                          <User size={16} />
                          {review.user_name}
                        </p>

                        <p className="flex items-center gap-2">
                          <CalendarDays size={16} />
                          {new Date(review.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="bg-yellow-50 border border-yellow-100 rounded-2xl px-5 py-4 min-w-[110px] text-center">
                      <p className="text-3xl font-extrabold text-yellow-600">
                        {review.rating}
                      </p>
                      <p className="text-xs text-yellow-700 font-semibold">
                        Rating
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

const StatCard = ({ icon: Icon, title, value, text }) => {
  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-md transition">
      <div className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center">
        <Icon size={22} />
      </div>

      <h3 className="text-sm font-semibold text-slate-500 mt-5">
        {title}
      </h3>

      <p className="text-3xl font-extrabold text-slate-900 mt-2">
        {value}
      </p>

      <p className="text-sm text-slate-500 mt-2 leading-relaxed">
        {text}
      </p>
    </div>
  );
};

export default OwnerReviews;