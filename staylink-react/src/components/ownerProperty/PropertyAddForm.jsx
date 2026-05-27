import { useEffect, useState } from "react";
import {
  addProperty,
  getAmenities,
} from "../../services/propertyService";
import {
  MapPin,
  Home,
  BedDouble,
  IndianRupee,
  ShieldCheck,
  ImagePlus,
  Loader2,
  X,
  Building2,
  FileText,
  Users,
} from "lucide-react";

const PropertyAddForm = () => {
  const [loading, setLoading] = useState(false);
  const [amenities, setAmenities] = useState([]);
  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState([]);

  const initialFormData = {
    title: "",
    description: "",
    property_type: "apartment",
    price: "",
    price_unit: "night",
    address: "",
    city: "",
    state: "",
    latitude: "",
    longitude: "",
    google_map_link: "",
    bedrooms: 0,
    bathrooms: 0,
    max_guest: 1,
    is_furnished: false,
    privacy_level: 1,
    ambience: "",
    nearby_facilities: "",
    extra_details: "",
    rules: "",
    cancellation_policy: "",
    advance_percentage: 20,
    cancellation_days: 5,
    is_available: true,
    management_name: "",
    management_phone: "",
    management_email: "",
    amenities: [],
    images: [],
  };

  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    fetchAmenities();
    return () => {
      imagePreview.forEach((img) => {
        URL.revokeObjectURL(img.url);
      });
    };
  }, []);

  const fetchAmenities = async () => {
    try {
      const res = await getAmenities();
      setAmenities(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImages = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...files],
    }));

    const previews = files.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));

    setImagePreview((prev) => [...prev, ...previews]);
  };

  const removeImage = (index) => {
    const updatedImages = [...formData.images];
    updatedImages.splice(index, 1);
    const updatedPreview = [...imagePreview];
    URL.revokeObjectURL(updatedPreview[index].url);
    updatedPreview.splice(index, 1);

    setFormData((prev) => ({ ...prev, images: updatedImages }));
    setImagePreview(updatedPreview);
  };

  const toggleAmenity = (id) => {
    setFormData((prev) => {
      const exists = prev.amenities.includes(id);
      return {
        ...prev,
        amenities: exists
          ? prev.amenities.filter((item) => item !== id)
          : [...prev.amenities, id],
      };
    });
  };

  const buildPayload = () => {
    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      if (key === "images" || key === "amenities") return;
      let value = formData[key];
      if (value === null || value === undefined) value = "";
      data.append(key, value);
    });

    formData.amenities.forEach((id) => {
      data.append("amenities", id);
    });

    formData.images.forEach((file) => {
      data.append("images", file);
    });

    return data;
  };

  const resetForm = () => {
    imagePreview.forEach((img) => {
      URL.revokeObjectURL(img.url);
    });
    setImagePreview([]);
    setErrors({});
    setFormData(initialFormData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setErrors({});
      const payload = buildPayload();
      await addProperty(payload);
      alert("Property added successfully");
      resetForm();
    } catch (err) {
      console.error(err);
      setErrors(err.response?.data || {});
      alert("Failed to add property");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = "w-full rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200";
  const sectionStyle = "bg-white rounded-2xl border border-gray-100 shadow-lg hover:shadow-xl transition-shadow duration-300 p-6";
  const errorStyle = "text-red-500 text-sm mt-1 flex items-center gap-1";

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* HEADER */}
        <div className="mb-8 text-center">
          <div className="inline-block p-3 bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl shadow-lg mb-4">
            <Home className="text-white" size={28} />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
            Add New Property
          </h1>
          <p className="text-gray-500 mt-2">Fill in the details to list your property</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* BASIC INFO */}
          <div className={sectionStyle}>
            <div className="flex items-center gap-3 mb-6 pb-3 border-b border-gray-100">
              <div className="p-2 bg-blue-50 rounded-xl">
                <Home size={20} className="text-blue-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-800">Basic Information</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">Property Title</label>
                <input type="text" name="title" value={formData.title} onChange={handleChange} className={inputStyle} placeholder="e.g., Luxury Beach Villa" />
                {errors.title && <p className={errorStyle}>⚠️ {errors.title[0]}</p>}
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">Property Type</label>
                <select name="property_type" value={formData.property_type} onChange={handleChange} className={inputStyle}>
                  <option value="apartment">🏢 Apartment</option>
                  <option value="villa">🏡 Villa</option>
                  <option value="room">🛏️ Room</option>
                  <option value="hostel">🏘️ Hostel</option>
                  <option value="pg">📚 PG</option>
                </select>
              </div>
            </div>
            <div className="mt-5">
              <label className="text-sm font-semibold text-gray-700 mb-2 block">Description</label>
              <textarea rows="4" name="description" value={formData.description} onChange={handleChange} className={inputStyle} placeholder="Describe your property's unique features..." />
              {errors.description && <p className={errorStyle}>⚠️ {errors.description[0]}</p>}
            </div>
          </div>

          {/* PRICING */}
          <div className={sectionStyle}>
            <div className="flex items-center gap-3 mb-6 pb-3 border-b border-gray-100">
              <div className="p-2 bg-green-50 rounded-xl">
                <IndianRupee size={20} className="text-green-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-800">Pricing</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">Price (₹)</label>
                <input type="number" step="0.01" name="price" value={formData.price} onChange={handleChange} className={inputStyle} placeholder="2500" />
                {errors.price && <p className={errorStyle}>⚠️ {errors.price[0]}</p>}
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">Price Unit</label>
                <select name="price_unit" value={formData.price_unit} onChange={handleChange} className={inputStyle}>
                  <option value="night">🌙 Per Night</option>
                  <option value="day">☀️ Per Day</option>
                  <option value="month">📅 Per Month</option>
                </select>
              </div>
            </div>
          </div>

          {/* LOCATION */}
          <div className={sectionStyle}>
            <div className="flex items-center gap-3 mb-6 pb-3 border-b border-gray-100">
              <div className="p-2 bg-red-50 rounded-xl">
                <MapPin size={20} className="text-red-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-800">Location Details</h2>
            </div>
            <div className="space-y-5">
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">Address</label>
                <textarea rows="2" name="address" value={formData.address} onChange={handleChange} className={inputStyle} placeholder="Full street address" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-2 block">City</label>
                  <input type="text" name="city" value={formData.city} onChange={handleChange} className={inputStyle} placeholder="City" />
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-2 block">State</label>
                  <input type="text" name="state" value={formData.state} onChange={handleChange} className={inputStyle} placeholder="State" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-2 block">Latitude</label>
                  <input type="number" step="any" name="latitude" value={formData.latitude} onChange={handleChange} className={inputStyle} placeholder="11.258753" />
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-2 block">Longitude</label>
                  <input type="number" step="any" name="longitude" value={formData.longitude} onChange={handleChange} className={inputStyle} placeholder="75.780411" />
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-2 block">Google Map Link</label>
                  <input type="url" name="google_map_link" value={formData.google_map_link} onChange={handleChange} className={inputStyle} placeholder="https://maps.google.com/" />
                </div>
              </div>
            </div>
          </div>

          {/* ROOM DETAILS */}
          <div className={sectionStyle}>
            <div className="flex items-center gap-3 mb-6 pb-3 border-b border-gray-100">
              <div className="p-2 bg-purple-50 rounded-xl">
                <BedDouble size={20} className="text-purple-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-800">Room Details</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">Bedrooms</label>
                <input type="number" name="bedrooms" value={formData.bedrooms} onChange={handleChange} className={inputStyle} />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">Bathrooms</label>
                <input type="number" name="bathrooms" value={formData.bathrooms} onChange={handleChange} className={inputStyle} />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">Max Guests</label>
                <input type="number" name="max_guest" value={formData.max_guest} onChange={handleChange} className={inputStyle} />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">Privacy Level</label>
                <select name="privacy_level" value={formData.privacy_level} onChange={handleChange} className={inputStyle}>
                  {[1,2,3,4,5].map(level => <option key={level} value={level}>{level}</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">Ambience</label>
                <input type="text" name="ambience" value={formData.ambience} onChange={handleChange} className={inputStyle} placeholder="Family, Calm..." />
              </div>
              <div className="flex items-end">
                <label className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 w-full cursor-pointer hover:bg-gray-50 transition">
                  <input type="checkbox" name="is_furnished" checked={formData.is_furnished} onChange={handleChange} className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium">Furnished</span>
                </label>
              </div>
            </div>
          </div>

          {/* PROPERTY DETAILS */}
          <div className={sectionStyle}>
            <div className="flex items-center gap-3 mb-6 pb-3 border-b border-gray-100">
              <div className="p-2 bg-orange-50 rounded-xl">
                <FileText size={20} className="text-orange-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-800">Property Details</h2>
            </div>
            <div className="space-y-5">
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">Nearby Facilities</label>
                <textarea rows="3" name="nearby_facilities" value={formData.nearby_facilities} onChange={handleChange} className={inputStyle} placeholder="Hospital, Bus stand, Metro station..." />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">Extra Details</label>
                <textarea rows="3" name="extra_details" value={formData.extra_details} onChange={handleChange} className={inputStyle} placeholder="Additional information about the property..." />
              </div>
            </div>
          </div>

          {/* RULES & POLICIES */}
          <div className={sectionStyle}>
            <div className="flex items-center gap-3 mb-6 pb-3 border-b border-gray-100">
              <div className="p-2 bg-indigo-50 rounded-xl">
                <ShieldCheck size={20} className="text-indigo-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-800">Rules & Policies</h2>
            </div>
            <div className="space-y-5">
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">House Rules</label>
                <textarea rows="3" name="rules" value={formData.rules} onChange={handleChange} className={inputStyle} placeholder="No smoking, No pets, Quiet hours..." />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">Cancellation Policy</label>
                <textarea rows="3" name="cancellation_policy" value={formData.cancellation_policy} onChange={handleChange} className={inputStyle} placeholder="Free cancellation up to 5 days before check-in..." />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-2 block">Advance Percentage</label>
                  <input type="number" name="advance_percentage" value={formData.advance_percentage} onChange={handleChange} className={inputStyle} />
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-2 block">Cancellation Days</label>
                  <input type="number" name="cancellation_days" value={formData.cancellation_days} onChange={handleChange} className={inputStyle} />
                </div>
                <div className="flex items-end">
                  <label className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 w-full cursor-pointer hover:bg-gray-50 transition">
                    <input type="checkbox" name="is_available" checked={formData.is_available} onChange={handleChange} className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium">Property Available</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* MANAGEMENT */}
          <div className={sectionStyle}>
            <div className="flex items-center gap-3 mb-6 pb-3 border-b border-gray-100">
              <div className="p-2 bg-teal-50 rounded-xl">
                <Building2 size={20} className="text-teal-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-800">Management Details</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">Manager Name</label>
                <input type="text" name="management_name" value={formData.management_name} onChange={handleChange} className={inputStyle} placeholder="John Doe" />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">Phone Number</label>
                <input type="tel" name="management_phone" value={formData.management_phone} onChange={handleChange} className={inputStyle} placeholder="9876543210" />
                {errors.management_phone && <p className={errorStyle}>⚠️ {errors.management_phone[0]}</p>}
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">Email Address</label>
                <input type="email" name="management_email" value={formData.management_email} onChange={handleChange} className={inputStyle} placeholder="manager@example.com" />
              </div>
            </div>
          </div>

          {/* AMENITIES */}
          <div className={sectionStyle}>
            <div className="flex items-center gap-3 mb-6 pb-3 border-b border-gray-100">
              <div className="p-2 bg-pink-50 rounded-xl">
                <Users size={20} className="text-pink-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-800">Amenities</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {amenities.map((amenity) => (
                <button
                  key={amenity.id}
                  type="button"
                  onClick={() => toggleAmenity(amenity.id)}
                  className={`rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
                    formData.amenities.includes(amenity.id)
                      ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md scale-[1.02]"
                      : "bg-gray-50 border border-gray-200 text-gray-700 hover:border-blue-300 hover:bg-blue-50"
                  }`}
                >
                  {amenity.name}
                </button>
              ))}
            </div>
          </div>

          {/* IMAGES */}
          <div className={sectionStyle}>
            <div className="flex items-center gap-3 mb-6 pb-3 border-b border-gray-100">
              <div className="p-2 bg-emerald-50 rounded-xl">
                <ImagePlus size={20} className="text-emerald-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-800">Property Images</h2>
            </div>
            <label className="border-2 border-dashed border-gray-300 rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 hover:bg-blue-50/50 transition-all duration-200">
              <div className="p-3 bg-gray-100 rounded-full">
                <ImagePlus size={40} className="text-gray-500" />
              </div>
              <p className="mt-4 text-base font-semibold text-gray-700">Click to upload images</p>
              <p className="text-sm text-gray-400 mt-1">PNG, JPG, JPEG (max 10MB)</p>
              <input type="file" multiple accept="image/*" onChange={handleImages} className="hidden" />
            </label>

            {imagePreview.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                {imagePreview.map((img, index) => (
                  <div key={index} className="relative group">
                    <img src={img.url} alt="" className="h-40 w-full object-cover rounded-xl shadow-md" />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 shadow-lg transition-all duration-200 opacity-90 hover:opacity-100"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* SUBMIT */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:opacity-60 text-white py-4 rounded-2xl text-lg font-bold transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={22} />
                Adding Property...
              </>
            ) : (
              "✨ Add Property"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PropertyAddForm;