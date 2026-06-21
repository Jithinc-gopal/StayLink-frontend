import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import BrokerLayout from "../../components/BrokerComponents/BrokerLayout";

import {
  getBrokerDashboardStats,
} from "../../services/brokerService";

import {
  Building2,
  Users,
  Star,
  CalendarCheck,
  IndianRupee,
  Bell,
  Plus,
  UserRound,
  NotebookPen,
  ArrowRight,
  Loader2,
} from "lucide-react";

const BrokerDashboard = () => {
  const navigate = useNavigate();

  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const res = await getBrokerDashboardStats();
      setDashboard(res.data);
    } catch (error) {
      console.error("Broker dashboard error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  if (loading) {
    return (
      <BrokerLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="animate-spin text-slate-500" size={34} />
        </div>
      </BrokerLayout>
    );
  }

  if (!dashboard) {
    return (
      <BrokerLayout>
        <div className="bg-white border rounded-2xl p-8 text-center">
          <h2 className="text-xl font-bold">Unable to load dashboard</h2>
          <button
            onClick={loadDashboard}
            className="mt-4 px-5 py-2 rounded-xl bg-slate-900 text-white"
          >
            Retry
          </button>
        </div>
      </BrokerLayout>
    );
  }

  const { profile, stats } = dashboard;

  return (
    <BrokerLayout>
      <div className="space-y-8">

        {/* WELCOME */}
        <section className="bg-slate-900 rounded-3xl p-8 text-white shadow-xl">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <p className="text-slate-300 text-sm">Broker Dashboard</p>
              <h1 className="text-3xl md:text-4xl font-bold mt-2">
                Welcome, {profile?.agency_name || profile?.first_name || "Broker"}
              </h1>
              <p className="text-slate-300 mt-2 max-w-2xl">
                Manage unlisted stays, track client bookings, monitor commissions,
                and handle broker connections from one place.
              </p>

              <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/15 text-green-300 text-sm font-medium">
                Verified Status: {profile?.verification_status}
              </div>
            </div>

            <button
              onClick={() => navigate("/broker/profile")}
              className="flex items-center justify-center gap-2 bg-white text-slate-900 px-5 py-3 rounded-2xl font-semibold hover:bg-slate-100 transition"
            >
              <UserRound size={18} />
              Go to Profile
            </button>
          </div>
        </section>

        {/* STATS */}
        <QuickAction
        icon={Users}
        title="View Chats"
        text="Reply to traveler broker chat messages."
        onClick={() => navigate("/broker/chats")}
/>
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <StatCard
            icon={Building2}
            title="Unlisted Properties"
            value={stats?.total_properties || 0}
            subtitle={`${stats?.active_properties || 0} active`}
          />

          <StatCard
            icon={Users}
            title="Connections"
            value={stats?.total_connections || 0}
            subtitle={`${stats?.pending_sent || 0} pending sent`}
          />

          <StatCard
            icon={Star}
            title="Reviews"
            value={stats?.total_reviews || 0}
            subtitle={`Avg rating: ${stats?.average_rating || "No rating"}`}
          />

          <StatCard
            icon={CalendarCheck}
            title="Bookings Tracked"
            value={stats?.total_bookings || 0}
            subtitle={`${stats?.completed_bookings || 0} completed`}
          />
        </section>

        {/* COMMISSION + ALERTS */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <InfoCard
            icon={IndianRupee}
            title="Commission Earned"
            value={`₹${stats?.total_commission_earned || 0}`}
            subtitle={`Pending commission: ₹${stats?.pending_commission || 0}`}
          />

          <InfoCard
            icon={Bell}
            title="Notifications"
            value={stats?.unread_notifications || 0}
            subtitle="Unread notifications"
            onClick={() => navigate("/broker/notifications")}
          />

          <InfoCard
            icon={Users}
            title="Pending Requests"
            value={stats?.pending_received || 0}
            subtitle="Incoming connection requests"
            onClick={() => navigate("/broker/connections")}
          />
        </section>

        {/* QUICK ACTIONS */}
        <section className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Quick Actions
              </h2>
              <p className="text-sm text-slate-500">
                Start your most common broker tasks quickly.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <QuickAction
              icon={Plus}
              title="Add Unlisted Property"
              text="Add offline/non-registered stay details."
              onClick={() => navigate("/broker/properties")}
            />

            <QuickAction
              icon={NotebookPen}
              title="Create Note"
              text="Save private notes about clients or bookings."
              onClick={() => navigate("/broker/notes")}
            />

            <QuickAction
              icon={Users}
              title="View Connections"
              text="Manage connected travelers and owners."
              onClick={() => navigate("/broker/connections")}
            />
          </div>
        </section>
      </div>
    </BrokerLayout>
  );
};

const StatCard = ({ icon: Icon, title, value, subtitle }) => {
  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm hover:shadow-md transition">
      <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-700">
        <Icon size={22} />
      </div>

      <p className="text-sm text-slate-500 mt-4">{title}</p>
      <h3 className="text-3xl font-bold text-slate-900 mt-1">{value}</h3>
      <p className="text-xs text-slate-400 mt-1">{subtitle}</p>
    </div>
  );
};

const InfoCard = ({ icon: Icon, title, value, subtitle, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="text-left bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-md transition"
    >
      <div className="flex items-center justify-between">
        <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-700">
          <Icon size={22} />
        </div>
        {onClick && <ArrowRight size={18} className="text-slate-400" />}
      </div>

      <p className="text-sm text-slate-500 mt-4">{title}</p>
      <h3 className="text-3xl font-bold text-slate-900 mt-1">{value}</h3>
      <p className="text-xs text-slate-400 mt-1">{subtitle}</p>
    </button>
  );
};

const QuickAction = ({ icon: Icon, title, text, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="text-left border border-slate-200 rounded-2xl p-5 hover:bg-slate-50 transition"
    >
      <div className="w-11 h-11 rounded-xl bg-slate-900 text-white flex items-center justify-center">
        <Icon size={20} />
      </div>

      <h3 className="font-bold text-slate-900 mt-4">{title}</h3>
      <p className="text-sm text-slate-500 mt-1">{text}</p>
    </button>
  );
};

export default BrokerDashboard;