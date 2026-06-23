import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getApprovedBrokers } from "../../services/brokerService";

export default function ApprovedBrokers() {
  const navigate = useNavigate();
  const [brokers, setBrokers] = useState([]);

  useEffect(() => {
    const fetchBrokers = async () => {
      try {
        const res = await getApprovedBrokers();
        setBrokers(res.data.slice(0, 3));
      } catch (error) {
        console.log(error);
      }
    };

    fetchBrokers();
  }, []);

  if (brokers.length === 0) return null;

  return (
    <section className="py-16 px-6 bg-[#f1f3ff]">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-[#041b3c]">
              Verified Brokers
            </h2>
            <p className="text-gray-600 mt-2">
              Connect with approved StayLink brokers near you.
            </p>
          </div>

          <button
            onClick={() => navigate("/traveler/brokers")}
            className="bg-[#003d9b] text-white px-5 py-2 rounded-lg"
          >
            View All
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {brokers.map((broker) => (
            <div
              key={broker.id}
              className="bg-white rounded-2xl p-6 shadow-sm"
            >
              <img
                src={
                  broker.profile_image ||
                  "https://ui-avatars.com/api/?name=Broker"
                }
                alt="Broker"
                className="w-20 h-20 rounded-full object-cover mb-4"
              />

              <h3 className="text-lg font-bold text-[#041b3c]">
                {broker.first_name || "Broker"}
              </h3>

              <p className="text-sm text-gray-600">
                {broker.agency_name}
              </p>

              <p className="text-sm text-gray-500 mt-1">
                {broker.city}, {broker.district}
              </p>

              <p className="text-sm text-gray-500 mt-1">
                ⭐ {broker.average_rating ?? "No reviews yet"}
              </p>

              <button
                onClick={() =>
                  navigate(`/traveler/brokers/${broker.id}`)}
                className="mt-4 w-full bg-[#041b3c] text-white py-2 rounded-lg"
              >
                View Profile
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}