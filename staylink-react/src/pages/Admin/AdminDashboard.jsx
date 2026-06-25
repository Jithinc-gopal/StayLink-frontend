import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const navigate = useNavigate();

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-slate-100 p-8">
      <div className="bg-white rounded-3xl shadow p-8">
        <h1 className="text-3xl font-bold text-[#003d9b]">
          StayLink Admin Dashboard
        </h1>

        <p className="mt-3 text-gray-600">
          Welcome, {user?.email}
        </p>

        {user?.is_superuser ? (
          <span className="inline-block mt-4 bg-purple-100 text-purple-700 px-4 py-1 rounded-full">
            Super Admin
          </span>
        ) : (
          <span className="inline-block mt-4 bg-blue-100 text-blue-700 px-4 py-1 rounded-full">
            Admin
          </span>
        )}

        <button
          onClick={handleLogout}
          className="block mt-8 px-5 py-2 bg-red-600 text-white rounded-xl"
        >
          Logout
        </button>
      </div>
    </div>
  );
}