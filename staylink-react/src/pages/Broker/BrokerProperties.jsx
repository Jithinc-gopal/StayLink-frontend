import { useEffect, useState } from "react";
import BrokerLayout from "../../components/BrokerComponents/BrokerLayout";
import {
  getBrokerProperties,
  createBrokerProperty,
  updateBrokerProperty,
  deleteBrokerProperty,
} from "../../services/brokerService";
import {
  Loader2,
  Plus,
  Building2,
  MapPin,
  Pencil,
  Trash2,
  IndianRupee,
  Users,
  X,
} from "lucide-react";

const emptyForm = {
  name: "",
  property_type: "room",
  description: "",
  rules: "",
  address: "",
  city: "",
  district: "",
  state: "",
  price: "",
  price_unit: "night",
  owner_name: "",
  owner_phone: "",
  owner_email: "",
  commission_percentage: "",
  private_notes: "",
  bedrooms: 1,
  bathrooms: 1,
  max_guests: 1,
  is_active: true,
};

const BrokerProperties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadProperties();
  }, []);

  const loadProperties = async () => {
    try {
      setLoading(true);
      const res = await getBrokerProperties();
      setProperties(res.data);
    } catch (error) {
      console.error("Broker properties error:", error);
    } finally {
      setLoading(false);
    }
  };

  const openCreate = () => {
    setEditingProperty(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (property) => {
    setEditingProperty(property);
    setForm({
      ...emptyForm,
      ...property,
    });
    setModalOpen(true);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      const payload = {
        ...form,
        price: Number(form.price),
        commission_percentage: Number(form.commission_percentage),
        bedrooms: Number(form.bedrooms),
        bathrooms: Number(form.bathrooms),
        max_guests: Number(form.max_guests),
      };

      if (editingProperty) {
        await updateBrokerProperty(editingProperty.id, payload);
      } else {
        await createBrokerProperty(payload);
      }

      setModalOpen(false);
      await loadProperties();
    } catch (error) {
      console.error("Save property error:", error);
      alert("Failed to save property");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this property?")) return;

    try {
      await deleteBrokerProperty(id);
      await loadProperties();
    } catch (error) {
      console.error("Delete property error:", error);
      alert("Failed to delete property");
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
      <div className="space-y-6">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              Unlisted Properties
            </h1>
            <p className="text-slate-500 mt-1">
              Manage offline/non-registered stays handled by you.
            </p>
          </div>

          <button
            onClick={openCreate}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-slate-900 text-white font-semibold hover:bg-slate-800"
          >
            <Plus size={18} />
            Add Property
          </button>
        </div>

        {/* EMPTY */}
        {properties.length === 0 && (
          <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center">
            <Building2 size={48} className="mx-auto text-slate-300" />
            <h2 className="text-xl font-bold mt-4">
              No properties added yet
            </h2>
            <p className="text-slate-500 mt-1">
              Add your first unlisted stay to start tracking bookings.
            </p>
          </div>
        )}

        {/* LIST */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {properties.map((property) => (
            <div
              key={property.id}
              className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-md transition"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    {property.name}
                  </h2>
                  <p className="text-sm text-slate-500 capitalize mt-1">
                    {property.property_type}
                  </p>
                </div>

                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    property.is_active
                      ? "bg-green-50 text-green-700"
                      : "bg-red-50 text-red-700"
                  }`}
                >
                  {property.is_active ? "Active" : "Inactive"}
                </span>
              </div>

              <p className="text-sm text-slate-600 mt-4 line-clamp-2">
                {property.description || "No description"}
              </p>

              <div className="grid grid-cols-2 gap-3 mt-5 text-sm">
                <Info icon={MapPin} label={`${property.city}, ${property.state}`} />
                <Info icon={IndianRupee} label={`₹${property.price}/${property.price_unit}`} />
                <Info icon={Users} label={`${property.max_guests} Guests`} />
                <Info icon={Building2} label={`${property.booking_count || 0} Bookings`} />
              </div>

              <div className="mt-5 border-t pt-4 text-sm text-slate-500">
                <p>Owner: {property.owner_name || "Not provided"}</p>
                <p>Commission: {property.commission_percentage}%</p>
                <p>Earned: ₹{property.total_commission_earned || 0}</p>
              </div>

              <div className="flex gap-3 mt-5">
                <button
                  onClick={() => openEdit(property)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-slate-100 text-slate-700 font-semibold hover:bg-slate-200"
                >
                  <Pencil size={16} />
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(property.id)}
                  className="flex items-center justify-center px-4 py-3 rounded-xl bg-red-50 text-red-600 hover:bg-red-100"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* MODAL */}
        {modalOpen && (
          <div className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl">
              <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
                <h2 className="text-xl font-bold">
                  {editingProperty ? "Edit Property" : "Add Unlisted Property"}
                </h2>

                <button
                  onClick={() => setModalOpen(false)}
                  className="p-2 rounded-xl hover:bg-slate-100"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input name="name" label="Property Name" value={form.name} onChange={handleChange} required />

                <Select name="property_type" label="Property Type" value={form.property_type} onChange={handleChange}>
                  <option value="room">Room</option>
                  <option value="apartment">Apartment</option>
                  <option value="villa">Villa</option>
                  <option value="hostel">Hostel</option>
                  <option value="pg">PG</option>
                </Select>

                <Input name="price" label="Price" type="number" value={form.price} onChange={handleChange} required />

                <Select name="price_unit" label="Price Unit" value={form.price_unit} onChange={handleChange}>
                  <option value="night">Per Night</option>
                  <option value="day">Per Day</option>
                  <option value="month">Per Month</option>
                </Select>

                <Input name="city" label="City" value={form.city} onChange={handleChange} required />
                <Input name="district" label="District" value={form.district} onChange={handleChange} />
                <Input name="state" label="State" value={form.state} onChange={handleChange} required />
                <Input name="address" label="Address" value={form.address} onChange={handleChange} required />

                <Input name="owner_name" label="Owner Name" value={form.owner_name} onChange={handleChange} />
                <Input name="owner_phone" label="Owner Phone" value={form.owner_phone} onChange={handleChange} />
                <Input name="owner_email" label="Owner Email" value={form.owner_email} onChange={handleChange} />
                <Input name="commission_percentage" label="Commission %" type="number" value={form.commission_percentage} onChange={handleChange} required />

                <Input name="bedrooms" label="Bedrooms" type="number" value={form.bedrooms} onChange={handleChange} />
                <Input name="bathrooms" label="Bathrooms" type="number" value={form.bathrooms} onChange={handleChange} />
                <Input name="max_guests" label="Max Guests" type="number" value={form.max_guests} onChange={handleChange} />

                <div className="md:col-span-2">
                  <Textarea name="description" label="Description" value={form.description} onChange={handleChange} />
                </div>

                <div className="md:col-span-2">
                  <Textarea name="rules" label="Rules" value={form.rules} onChange={handleChange} />
                </div>

                <div className="md:col-span-2">
                  <Textarea name="private_notes" label="Private Notes" value={form.private_notes} onChange={handleChange} />
                </div>

                <label className="flex items-center gap-3 text-sm font-semibold text-slate-700">
                  <input
                    type="checkbox"
                    name="is_active"
                    checked={form.is_active}
                    onChange={handleChange}
                  />
                  Property is active
                </label>

                <div className="md:col-span-2 flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-5 py-3 rounded-xl border font-semibold"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={saving}
                    className="px-6 py-3 rounded-xl bg-slate-900 text-white font-semibold disabled:opacity-50"
                  >
                    {saving ? "Saving..." : "Save Property"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </BrokerLayout>
  );
};

const Input = ({ label, ...props }) => (
  <div>
    <label className="text-sm font-semibold text-slate-700">{label}</label>
    <input
      {...props}
      className="mt-2 w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
    />
  </div>
);

const Select = ({ label, children, ...props }) => (
  <div>
    <label className="text-sm font-semibold text-slate-700">{label}</label>
    <select
      {...props}
      className="mt-2 w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
    >
      {children}
    </select>
  </div>
);

const Textarea = ({ label, ...props }) => (
  <div>
    <label className="text-sm font-semibold text-slate-700">{label}</label>
    <textarea
      {...props}
      rows={3}
      className="mt-2 w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
    />
  </div>
);

const Info = ({ icon: Icon, label }) => (
  <div className="flex items-center gap-2 text-slate-600">
    <Icon size={16} />
    <span>{label}</span>
  </div>
);

export default BrokerProperties;