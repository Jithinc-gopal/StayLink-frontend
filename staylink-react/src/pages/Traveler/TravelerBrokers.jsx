import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getApprovedBrokers } from "../../services/brokerService";

export default function TravelerBrokers() {
  const navigate = useNavigate();

  const [brokers, setBrokers] = useState([]);
  const [place, setPlace] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchBrokers = async () => {
    try {
      setLoading(true);
      const res = await getApprovedBrokers(place);
      setBrokers(res.data);
    } catch (error) {
      console.error(error);
      alert("Failed to load brokers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrokers();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchBrokers();
  };

  return (
    <div style={{ padding: "32px", background: "#f1f3ff", minHeight: "100vh" }}>
      <h1 style={{ fontSize: "28px", fontWeight: "bold", color: "#041b3c" }}>
        Find Brokers
      </h1>

      <p style={{ color: "#6b7280", marginBottom: "20px" }}>
        Search approved brokers based on your preferred place.
      </p>

      <form onSubmit={handleSearch} style={{ display: "flex", gap: "10px", marginBottom: "24px" }}>
        <input
          type="text"
          placeholder="Search by city, district, or state"
          value={place}
          onChange={(e) => setPlace(e.target.value)}
          style={{
            padding: "10px 14px",
            width: "320px",
            borderRadius: "8px",
            border: "1px solid #d1d5db",
          }}
        />

        <button
          type="submit"
          style={{
            background: "#003d9b",
            color: "white",
            border: "none",
            padding: "10px 18px",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          Search
        </button>
      </form>

      {loading ? (
        <p>Loading brokers...</p>
      ) : brokers.length === 0 ? (
        <p>No approved brokers found.</p>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "18px" }}>
          {brokers.map((broker) => (
            <div
              key={broker.id}
              style={{
                background: "white",
                padding: "20px",
                borderRadius: "14px",
                boxShadow: "0 1px 5px rgba(0,0,0,0.08)",
              }}
            >
              <img
                src={broker.profile_image || "https://ui-avatars.com/api/?name=Broker"}
                alt="Broker"
                style={{
                  width: "80px",
                  height: "80px",
                  borderRadius: "50%",
                  objectFit: "cover",
                  marginBottom: "12px",
                }}
              />

              <h3 style={{ color: "#041b3c", fontWeight: "bold" }}>
                {broker.first_name || "Broker"}
              </h3>

              <p>{broker.agency_name}</p>
              <p>{broker.city}, {broker.district}</p>
              <p>Experience: {broker.experience} years</p>
              <p>Rating: {broker.average_rating ?? "No reviews yet"}</p>

              <button
                onClick={() => navigate(`/brokers/${broker.id}`)}
                style={{
                  marginTop: "12px",
                  width: "100%",
                  padding: "10px",
                  background: "#041b3c",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                }}
              >
                View Profile
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}