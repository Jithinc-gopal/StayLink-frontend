import { useEffect, useState } from "react";
import BrokerLayout from "../../components/BrokerComponents/BrokerLayout";
import {
  getBrokerProfile,
  updateBrokerProfile,
} from "../../services/brokerService";
import {
  Loader2,
  Save,
  UserRound,
  Building2,
  MapPin,
  Phone,
  Mail,
  BadgeCheck,
} from "lucide-react";

const BrokerProfile = () => {
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({});
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const res = await getBrokerProfile();
      setProfile(res.data);
      setForm(res.data);
    } catch (error) {
      console.error("Broker profile error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      const data = new FormData();

      Object.keys(form).forEach((key) => {
        if (
          form[key] !== null &&
          form[key] !== undefined &&
          key !== "profile_image"
        ) {
          data.append(key, form[key]);
        }
      });

      if (image) {
        data.append("profile_image", image);
      }

      await updateBrokerProfile(data);
      await loadProfile();
      alert("Profile updated successfully");
    } catch (error) {
      console.error("Profile update error:", error);
      alert("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <BrokerLayout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <Loader2 className="animate-spin text-slate-500" size={34} />
        </div>
      </BrokerLayout>
    );
  }

  return (
    <BrokerLayout>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* PROFILE CARD */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm h-fit">
          <div className="flex flex-col items-center text-center">
            <div className="w-28 h-28 rounded-3xl bg-slate-100 overflow-hidden flex items-center justify-center">
              {profile?.profile_image ? (
                <img
                  src={profile.profile_image}
                  alt="Broker"
                  className="w-full h-full object-cover"
                />
              ) : (
                <UserRound size={42} className="text-slate-400" />
              )}
            </div>

            <h2 className="text-2xl font-bold mt-4">
              {profile?.agency_name || profile?.first_name || "Broker"}
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              {profile?.email}
            </p>

            <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-50 text-green-700 text-sm font-semibold">
              <BadgeCheck size={16} />
              {profile?.verification_status}
            </div>
          </div>

          <div className="mt-6 space-y-3 text-sm">
            <Info icon={Phone} label={profile?.phone || "No phone"} />
            <Info icon={MapPin} label={`${profile?.city || ""}, ${profile?.state || ""}`} />
            <Info icon={Building2} label={profile?.agency_name || "No agency"} />
            <Info icon={Mail} label={profile?.email || "No email"} />
          </div>
        </div>

        {/* FORM */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
          <h1 className="text-2xl font-bold text-slate-900">
            Edit Broker Profile
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Update your public broker information.
          </p>

          <form onSubmit={handleSubmit} className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input name="phone" label="Phone" value={form.phone} onChange={handleChange} />
            <Input name="agency_name" label="Agency Name" value={form.agency_name} onChange={handleChange} />
            <Input name="experience" label="Experience" value={form.experience} onChange={handleChange} />
            <Input name="license_number" label="License Number" value={form.license_number} onChange={handleChange} />
            <Input name="city" label="City" value={form.city} onChange={handleChange} />
            <Input name="district" label="District" value={form.district} onChange={handleChange} />
            <Input name="state" label="State" value={form.state} onChange={handleChange} />

            <div>
              <label className="text-sm font-semibold text-slate-700">
                Profile Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImage(e.target.files[0])}
                className="mt-2 w-full border border-slate-200 rounded-xl px-4 py-3 text-sm"
              />
            </div>

            <div className="md:col-span-2 flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-slate-900 text-white font-semibold hover:bg-slate-800 disabled:opacity-50"
              >
                {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </BrokerLayout>
  );
};

const Input = ({ label, name, value, onChange }) => (
  <div>
    <label className="text-sm font-semibold text-slate-700">{label}</label>
    <input
      name={name}
      value={value || ""}
      onChange={onChange}
      className="mt-2 w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
    />
  </div>
);

const Info = ({ icon: Icon, label }) => (
  <div className="flex items-center gap-3 text-slate-600">
    <Icon size={17} />
    <span>{label}</span>
  </div>
);

export default BrokerProfile;