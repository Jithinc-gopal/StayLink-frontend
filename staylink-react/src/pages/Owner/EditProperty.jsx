import { useEffect, useState } from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  updateProperty,
  getSingleProperty,
  getAmenities,
} from "../../services/propertyService";

import {
  MapPin,
  Home,
  BedDouble,
  IndianRupee,
  ImagePlus,
  Loader2,
  X,
  ShieldCheck,
} from "lucide-react";

const EditProperty = () => {

  // =====================================
  // ROUTER
  // =====================================

  const navigate = useNavigate();

  const { propertyId } =
    useParams();

  // =====================================
  // STATES
  // =====================================

  const [loading, setLoading] =
    useState(false);

  const [pageLoading, setPageLoading] =
    useState(true);

  const [amenities, setAmenities] =
    useState([]);

  const [errors, setErrors] =
    useState({});

  // Existing backend images

  const [
    existingImages,
    setExistingImages,
  ] = useState([]);

  // Newly selected images

  const [
    newImages,
    setNewImages,
  ] = useState([]);

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
  };

  const [formData, setFormData] =
    useState(initialFormData);

  // =====================================
  // FETCH INITIAL DATA
  // =====================================

  useEffect(() => {

    fetchAmenities();

    fetchProperty();

    return () => {

      newImages.forEach((img) => {

        URL.revokeObjectURL(
          img.preview
        );

      });

    };

  }, []);

  // =====================================
  // FETCH AMENITIES
  // =====================================

  const fetchAmenities = async () => {

    try {

      const res =
        await getAmenities();

      setAmenities(res.data);

    } catch (error) {

      console.log(error);

    }
  };

  // =====================================
  // FETCH PROPERTY
  // =====================================

  const fetchProperty = async () => {

    try {

      const res =
        await getSingleProperty(
          propertyId
        );

      const property =
        res.data;

      setFormData({

        title:
          property.title || "",

        description:
          property.description || "",

        property_type:
          property.property_type ||
          "apartment",

        price:
          property.price || "",

        price_unit:
          property.price_unit ||
          "night",

        address:
          property.address || "",

        city:
          property.city || "",

        state:
          property.state || "",

        latitude:
          property.latitude || "",

        longitude:
          property.longitude || "",

        google_map_link:
          property.google_map_link || "",

        bedrooms:
          property.bedrooms || 0,

        bathrooms:
          property.bathrooms || 0,

        max_guest:
          property.max_guest || 1,

        is_furnished:
          property.is_furnished || false,

        privacy_level:
          property.privacy_level || 1,

        ambience:
          property.ambience || "",

        nearby_facilities:
          property.nearby_facilities || "",

        extra_details:
          property.extra_details || "",

        rules:
          property.rules || "",

        cancellation_policy:
          property.cancellation_policy || "",

        advance_percentage:
          property.advance_percentage || 20,

        cancellation_days:
          property.cancellation_days || 5,

        is_available:
          property.is_available,

        management_name:
          property.management_name || "",

        management_phone:
          property.management_phone || "",

        management_email:
          property.management_email || "",

        amenities:
          property.property_amenities?.map(
            (item) => item.id
          ) || [],
      });

      // =====================================
      // EXISTING IMAGES
      // =====================================

      if (property.images) {

        const formattedImages =
          property.images.map(
            (img) => ({

              id: img.id,

              image: img.image,

            })
          );

        setExistingImages(
          formattedImages
        );
      }

    } catch (error) {

      console.log(error);

    } finally {

      setPageLoading(false);

    }
  };

  // =====================================
  // HANDLE INPUT CHANGE
  // =====================================

  const handleChange = (e) => {

    const {
      name,
      value,
      type,
      checked,
    } = e.target;

    setFormData((prev) => ({

      ...prev,

      [name]:
        type === "checkbox"
          ? checked
          : value,

    }));
  };

  // =====================================
  // HANDLE NEW IMAGES
  // =====================================

  const handleImages = (e) => {

    const files = Array.from(
      e.target.files
    );

    if (!files.length) return;

    const formattedFiles =
      files.map((file) => ({

        file,

        preview:
          URL.createObjectURL(
            file
          ),

      }));

    setNewImages((prev) => [
      ...prev,
      ...formattedFiles,
    ]);
  };

  // =====================================
  // REMOVE EXISTING IMAGE
  // =====================================

  const removeExistingImage = (
    imageId
  ) => {

    setExistingImages((prev) =>
      prev.filter(
        (img) => img.id !== imageId
      )
    );
  };

  // =====================================
  // REMOVE NEW IMAGE
  // =====================================

  const removeNewImage = (
    index
  ) => {

    setNewImages((prev) => {

      const updated = [...prev];

      URL.revokeObjectURL(
        updated[index].preview
      );

      updated.splice(index, 1);

      return updated;

    });
  };

  // =====================================
  // TOGGLE AMENITY
  // =====================================

  const toggleAmenity = (id) => {

    setFormData((prev) => {

      const exists =
        prev.amenities.includes(id);

      return {

        ...prev,

        amenities: exists
          ? prev.amenities.filter(
              (a) => a !== id
            )
          : [
              ...prev.amenities,
              id,
            ],
      };
    });
  };

  // =====================================
  // BUILD PAYLOAD
  // =====================================

  const buildPayload = () => {

    const data =
      new FormData();

    // =====================================
    // NORMAL FIELDS
    // =====================================

    Object.keys(formData).forEach(
      (key) => {

        if (key === "amenities") {
          return;
        }

        let value =
          formData[key];

        if (
          value === null ||
          value === undefined
        ) {
          value = "";
        }

        data.append(key, value);
      }
    );

    // =====================================
    // AMENITIES
    // =====================================

    formData.amenities.forEach(
      (id) => {

        data.append(
          "amenities",
          id
        );
      }
    );

    // =====================================
    // KEEP EXISTING IMAGES
    // =====================================

    existingImages.forEach(
      (img) => {

        data.append(
          "existing_images",
          img.id
        );
      }
    );

    // =====================================
    // NEW IMAGES
    // =====================================

    newImages.forEach(
      (img) => {

        data.append(
          "images",
          img.file
        );
      }
    );

    return data;
  };

  // =====================================
  // SUBMIT
  // =====================================

  const handleSubmit = async (
    e
  ) => {

    e.preventDefault();

    try {

      setLoading(true);

      setErrors({});

      const payload =
        buildPayload();

      await updateProperty(
        propertyId,
        payload
      );

      alert(
        "Property updated successfully"
      );

      navigate(
        "/owner/my-properties"
      );

    } catch (err) {

      console.log(err);

      setErrors(
        err.response?.data || {}
      );

      alert(
        "Failed to update property"
      );

    } finally {

      setLoading(false);

    }
  };

  // =====================================
  // STYLES
  // =====================================

  const inputStyle =
    "w-full rounded-2xl border border-gray-300 bg-gray-50 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition";

  const sectionStyle =
    "bg-white rounded-3xl border border-gray-200 shadow-sm p-6";

  // =====================================
  // PAGE LOADING
  // =====================================

  if (pageLoading) {

    return (

      <div className="min-h-screen flex items-center justify-center">

        <Loader2 className="animate-spin" />

      </div>
    );
  }

  return (

    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 py-10 px-4">

      <div className="max-w-7xl mx-auto">

        {/* HEADER */}

        <div className="mb-8">

          <h1 className="text-4xl font-black text-gray-800">

            Edit Property

          </h1>

          <p className="text-gray-500 mt-2">

            Update your property details

          </p>

        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-8"
        >

          {/* BASIC INFO */}

          <div className={sectionStyle}>

            <div className="flex items-center gap-3 mb-6">

              <Home size={24} />

              <h2 className="text-2xl font-bold">

                Basic Information

              </h2>

            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={inputStyle}
                placeholder="Property Title"
              />

              <select
                name="property_type"
                value={formData.property_type}
                onChange={handleChange}
                className={inputStyle}
              >

                <option value="apartment">
                  Apartment
                </option>

                <option value="villa">
                  Villa
                </option>

                <option value="room">
                  Room
                </option>

                <option value="hostel">
                  Hostel
                </option>

                <option value="pg">
                  PG
                </option>

              </select>

            </div>

            <textarea
              rows="5"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className={`${inputStyle} mt-6`}
              placeholder="Description"
            />

          </div>

          {/* PRICE */}

          <div className={sectionStyle}>

            <div className="flex items-center gap-3 mb-6">

              <IndianRupee size={24} />

              <h2 className="text-2xl font-bold">

                Pricing

              </h2>

            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className={inputStyle}
                placeholder="Price"
              />

              <select
                name="price_unit"
                value={formData.price_unit}
                onChange={handleChange}
                className={inputStyle}
              >

                <option value="night">
                  Per Night
                </option>

                <option value="day">
                  Per Day
                </option>

                <option value="month">
                  Per Month
                </option>

              </select>

            </div>

          </div>

          {/* LOCATION */}

          <div className={sectionStyle}>

            <div className="flex items-center gap-3 mb-6">

              <MapPin size={24} />

              <h2 className="text-2xl font-bold">

                Location

              </h2>

            </div>

            <div className="space-y-6">

              <textarea
                rows="3"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className={inputStyle}
                placeholder="Address"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className={inputStyle}
                  placeholder="City"
                />

                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className={inputStyle}
                  placeholder="State"
                />

              </div>

            </div>

          </div>

          {/* ROOM DETAILS */}

          <div className={sectionStyle}>

            <div className="flex items-center gap-3 mb-6">

              <BedDouble size={24} />

              <h2 className="text-2xl font-bold">

                Room Details

              </h2>

            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-6">

              <input
                type="number"
                name="bedrooms"
                value={formData.bedrooms}
                onChange={handleChange}
                className={inputStyle}
                placeholder="Bedrooms"
              />

              <input
                type="number"
                name="bathrooms"
                value={formData.bathrooms}
                onChange={handleChange}
                className={inputStyle}
                placeholder="Bathrooms"
              />

              <input
                type="number"
                name="max_guest"
                value={formData.max_guest}
                onChange={handleChange}
                className={inputStyle}
                placeholder="Guests"
              />

              <select
                name="privacy_level"
                value={formData.privacy_level}
                onChange={handleChange}
                className={inputStyle}
              >

                <option value={1}>
                  Privacy 1
                </option>

                <option value={2}>
                  Privacy 2
                </option>

                <option value={3}>
                  Privacy 3
                </option>

                <option value={4}>
                  Privacy 4
                </option>

                <option value={5}>
                  Privacy 5
                </option>

              </select>

              <label className="flex items-center justify-center gap-3 rounded-2xl border border-gray-300 bg-gray-50 px-4">

                <input
                  type="checkbox"
                  name="is_furnished"
                  checked={formData.is_furnished}
                  onChange={handleChange}
                />

                Furnished

              </label>

            </div>

          </div>

          {/* RULES */}

          <div className={sectionStyle}>

            <div className="flex items-center gap-3 mb-6">

              <ShieldCheck size={24} />

              <h2 className="text-2xl font-bold">

                Rules & Policies

              </h2>

            </div>

            <div className="space-y-6">

              <textarea
                rows="4"
                name="rules"
                value={formData.rules}
                onChange={handleChange}
                className={inputStyle}
                placeholder="Rules"
              />

              <textarea
                rows="4"
                name="cancellation_policy"
                value={formData.cancellation_policy}
                onChange={handleChange}
                className={inputStyle}
                placeholder="Cancellation policy"
              />

            </div>

          </div>

          {/* AMENITIES */}

          <div className={sectionStyle}>

            <h2 className="text-2xl font-bold mb-6">

              Amenities

            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">

              {amenities.map(
                (amenity) => (

                  <button
                    key={amenity.id}
                    type="button"
                    onClick={() =>
                      toggleAmenity(
                        amenity.id
                      )
                    }
                    className={`rounded-2xl border px-4 py-3 font-medium transition
                    ${
                      formData.amenities.includes(
                        amenity.id
                      )
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-white border-gray-300 hover:border-blue-500"
                    }`}
                  >

                    {amenity.name}

                  </button>
                )
              )}

            </div>

          </div>

          {/* IMAGES */}

          <div className={sectionStyle}>

            <div className="flex items-center gap-3 mb-6">

              <ImagePlus size={24} />

              <h2 className="text-2xl font-bold">

                Property Images

              </h2>

            </div>

            {/* UPLOAD */}

            <label className="border-2 border-dashed border-gray-300 rounded-3xl p-10 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 transition">

              <ImagePlus
                size={50}
                className="text-gray-400"
              />

              <p className="mt-4 text-lg font-medium">

                Upload More Images

              </p>

              <p className="text-sm text-gray-500">

                PNG, JPG, JPEG

              </p>

              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImages}
                className="hidden"
              />

            </label>

            {/* ALL IMAGES */}

            {(existingImages.length >
              0 ||
              newImages.length >
                0) && (

              <div className="mt-8">

                <h3 className="font-bold text-lg mb-4">

                  Property Images

                </h3>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

                  {/* EXISTING */}

                  {existingImages.map(
                    (img) => (

                      <div
                        key={img.id}
                        className="relative group"
                      >

                        <img
                          src={img.image}
                          alt=""
                          className="h-40 w-full object-cover rounded-2xl"
                        />

                        <button
                          type="button"
                          onClick={() =>
                            removeExistingImage(
                              img.id
                            )
                          }
                          className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-2"
                        >

                          <X size={16} />

                        </button>

                      </div>
                    )
                  )}

                  {/* NEW */}

                  {newImages.map(
                    (
                      img,
                      index
                    ) => (

                      <div
                        key={index}
                        className="relative group"
                      >

                        <img
                          src={img.preview}
                          alt=""
                          className="h-40 w-full object-cover rounded-2xl border-4 border-blue-500"
                        />

                        <button
                          type="button"
                          onClick={() =>
                            removeNewImage(
                              index
                            )
                          }
                          className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-2"
                        >

                          <X size={16} />

                        </button>

                        <div className="absolute bottom-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full">

                          NEW

                        </div>

                      </div>
                    )
                  )}

                </div>

              </div>
            )}

          </div>

          {/* SUBMIT */}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white py-5 rounded-3xl text-xl font-bold transition shadow-lg flex items-center justify-center gap-3"
          >

            {loading ? (
              <>
                <Loader2 className="animate-spin" />

                Updating Property...
              </>
            ) : (
              "Update Property"
            )}

          </button>

        </form>

      </div>

    </div>
  );
};

export default EditProperty;