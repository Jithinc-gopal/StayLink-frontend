import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Bell,
  LogOut,
  Settings,
  LayoutDashboard,
  Building2,
  Users,
  Star,
  StickyNote,
  Menu,
  X,
} from "lucide-react";

const BrokerNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [open, setOpen] = useState(false);

  const navItems = [
    {
      label: "Dashboard",
      path: "/broker/dashboard",
      icon: LayoutDashboard,
    },
    {
      label: "My Properties",
      path: "/broker/properties",
      icon: Building2,
    },
    {
      label: "Connections",
      path: "/broker/connections",
      icon: Users,
    },
    {
      label: "Reviews",
      path: "/broker/reviews",
      icon: Star,
    },
    {
      label: "Notes",
      path: "/broker/notes",
      icon: StickyNote,
    },
  ];

  const isActive = (path) => location.pathname === path;

  const handleNavigate = (path) => {
    navigate(path);
    setOpen(false);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-slate-200 shadow-sm">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="h-16 flex items-center justify-between">

          {/* LOGO */}
          <div
            onClick={() => handleNavigate("/broker/dashboard")}
            className="flex items-center gap-2 cursor-pointer"
          >
            <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold">
              S
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900">
                StayLink
              </h1>
              <p className="text-[11px] text-slate-500 -mt-1">
                Broker Panel
              </p>
            </div>
          </div>

          {/* DESKTOP NAV */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;

              return (
                <button
                  key={item.path}
                  onClick={() => handleNavigate(item.path)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition ${
                    isActive(item.path)
                      ? "bg-slate-900 text-white"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  <Icon size={16} />
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* RIGHT ACTIONS */}
          <div className="hidden lg:flex items-center gap-3">
            <button
              onClick={() => handleNavigate("/broker/notifications")}
              className="relative p-2 rounded-xl text-slate-600 hover:bg-slate-100"
            >
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </button>

            <button
              onClick={() => handleNavigate("/broker/profile")}
              className="p-2 rounded-xl text-slate-600 hover:bg-slate-100"
            >
              <Settings size={20} />
            </button>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-50 text-red-600 text-sm font-medium hover:bg-red-100"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>

          {/* MOBILE MENU BUTTON */}
          <button
            onClick={() => setOpen(!open)}
            className="lg:hidden p-2 rounded-xl hover:bg-slate-100"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      {open && (
        <div className="lg:hidden bg-white border-t border-slate-200 px-4 py-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.path}
                onClick={() => handleNavigate(item.path)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium ${
                  isActive(item.path)
                    ? "bg-slate-900 text-white"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <Icon size={17} />
                {item.label}
              </button>
            );
          })}

          <button
            onClick={() => handleNavigate("/broker/notifications")}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-100"
          >
            <Bell size={17} />
            Notifications
          </button>

          <button
            onClick={() => handleNavigate("/broker/profile")}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-100"
          >
            <Settings size={17} />
            Settings
          </button>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100"
          >
            <LogOut size={17} />
            Logout
          </button>
        </div>
      )}
    </header>
  );
};

export default BrokerNavbar;