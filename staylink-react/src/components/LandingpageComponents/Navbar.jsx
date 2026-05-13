import { Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { logoutUser } from "../../services/authService";

export default function Navbar() {
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);

  // ✅ check auth
  const isLoggedIn = !!localStorage.getItem("access");

  // ✅ logout function
  const handleLogout = async () => {
    try {
      const refresh = localStorage.getItem("refresh");

      if (refresh) {
        await logoutUser(refresh);
      }
    } catch (err) {
      console.error("Logout error:", err.response?.data);
    } finally {
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
      localStorage.removeItem("user");

      navigate("/login");
    }
  };

  return (
    <nav className="bg-white/70 backdrop-blur-xl sticky top-0 z-50 shadow-[0px_4px_20px_rgba(4,27,60,0.04)]">
      <div className="flex justify-between items-center w-full px-8 py-4 max-w-screen-2xl mx-auto">
        
        {/* Left: Logo + Links */}
        <div className="flex items-center gap-8">
          <span className="text-2xl font-black text-blue-900 tracking-tighter font-['Plus_Jakarta_Sans']">
            StayLink
          </span>
          <div className="hidden md:flex items-center gap-6 font-['Plus_Jakarta_Sans'] text-sm font-medium tracking-tight">
            <a href="#" className="text-blue-900 border-b-2 border-blue-900 pb-1">
              Discover
            </a>
            <a href="#" className="text-slate-500 hover:text-blue-800 transition-colors duration-300">
              Stays
            </a>
            <a href="#" className="text-slate-500 hover:text-blue-800 transition-colors duration-300">
              Experiences
            </a>
          </div>
        </div>

        {/* Right: Notification + Avatar */}
        <div className="flex items-center gap-4 relative">
          
          <button className="p-2 text-slate-500 hover:bg-slate-50 rounded-full transition-colors duration-300">
            <Bell size={22} />
          </button>

          {/* Avatar */}
          <div
            onClick={() => setOpen(!open)}
            className="h-8 w-8 rounded-full overflow-hidden border border-slate-200 cursor-pointer"
          >
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBwidA9OeFqz8TlFCYCnBiDG8GRLP_8Ez3pljwQ5cKSLOyFk1T8YhyvJTmSXCmBLo2SRqlZPLq697gA6wGXjHetF5vrpkEVIqBpJHKFSPjkxxFaRowopIF8ZB69oED7JA5DNezOlQ0WEFwewfM5iR7SfZbnd3DGMjCbG-fS5mzJ7ULFzvw7SphvZYHyOd1qQJNykSRy3kOj0ZBGL2y1147Owc9y_bQyY720OmAdmEyO0mWjWcfsB1kROoWzl_hWaKQoMLNrj2RPBx8"
              alt="User profile"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Dropdown */}
          {open && (
            <div className="absolute right-0 top-12 w-40 bg-white rounded-xl shadow-md border border-slate-100 py-2 text-sm">
              
              {isLoggedIn ? (
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 hover:bg-slate-50"
                >
                  Logout
                </button>
              ) : (
                <button
                  onClick={() => navigate("/login")}
                  className="w-full text-left px-4 py-2 hover:bg-slate-50"
                >
                  Login
                </button>
              )}

            </div>
          )}

        </div>
      </div>
    </nav>
  );
}