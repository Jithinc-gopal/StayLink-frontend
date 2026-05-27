import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createOwnerProfile } from "../../services/authService";
import { Phone, MapPin, Image, FileText } from "lucide-react";

const OwnerProfileSetup = () => {

  const navigate = useNavigate();

  const [form, setForm] = useState({
    phone: "",
    address: "",
    city: "",
    district: "",
    state: "Kerala",
    pincode: "",
    profile_image: null,
    id_proof: null,
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {

    const { id, value, files } = e.target;

    if (files) {

      setForm({
        ...form,
        [id]: files[0],
      });

    } else {

      setForm({
        ...form,
        [id]: value,
      });
    }
  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    if (
      !form.phone.trim() ||
      !form.address.trim() ||
      !form.city.trim() ||
      !form.district.trim() ||
      !form.state.trim() ||
      !form.pincode.trim() ||
      !form.profile_image ||
      !form.id_proof
    ) {

      alert("Please fill all required fields");

      return;
    }

    try {

      setLoading(true);

      const data = new FormData();

      data.append("phone", form.phone);
      data.append("address", form.address);
      data.append("city", form.city);
      data.append("district", form.district);
      data.append("state", form.state);
      data.append("pincode", form.pincode);
      data.append("profile_image", form.profile_image);
      data.append("id_proof", form.id_proof);

      const res = await createOwnerProfile(data);

      alert(res.data.message);

      const user = JSON.parse(
        localStorage.getItem("user")
      );

      user.profile_completed = true;

      localStorage.setItem(
        "user",
        JSON.stringify(user)
      );

      navigate("/owner/dashboard");

    } catch (err) {

      console.error(err.response?.data);

      if (err.response?.data) {

        const errors = err.response.data;

        const firstKey =
          Object.keys(errors)[0];

        const firstError =
          errors[firstKey];

        if (Array.isArray(firstError)) {

          alert(firstError[0]);

        } else {

          alert(firstError);
        }

      } else {

        alert("Something went wrong");
      }

    } finally {

      setLoading(false);
    }
  };

  return (

    <div className="bg-[#f1f3ff] font-sans text-[#041b3c] flex items-center justify-center min-h-screen p-4">

      <main className="w-full max-w-6xl flex flex-col md:flex-row bg-[#f9f9ff] rounded-[2.5rem] shadow-2xl shadow-[#003d9b]/5 overflow-hidden">

        {/* LEFT SIDE */}

        <section className="hidden md:flex md:w-[40%] relative p-10 flex-col justify-end">

          <div className="absolute inset-0 z-0">

            <img
              alt="Property setup"
              className="w-full h-full object-cover"
              src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-[#003d9b]/80 via-[#003d9b]/20 to-transparent"></div>

          </div>

          <div className="relative z-10 space-y-4">

            <h2 className="text-[#f9f9ff] text-3xl font-extrabold leading-tight">

              List Your Property,
              <br />
              Start Earning.

            </h2>

            <p className="text-[#f1f3ff] text-sm opacity-90 max-w-xs">

              Complete your profile to start listing and managing your properties.

            </p>

          </div>

        </section>

        {/* RIGHT SIDE */}

        <section className="flex-1 flex flex-col items-center p-8 lg:px-20">

          <div className="mb-6 w-full max-w-md">

            <h1 className="text-3xl font-extrabold text-[#003d9b] tracking-tight">

              Complete Profile

            </h1>

            <p className="text-sm text-[#434654]">

              Tell us more about you.

            </p>

          </div>

          <form
            onSubmit={handleSubmit}
            className="w-full max-w-md space-y-4"
          >

            {/* PHONE */}

            <div className="space-y-1.5">

              <label className="text-[10px] font-bold uppercase tracking-widest text-[#434654] ml-1">

                Phone

              </label>

              <div className="relative">

                <Phone
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[#737685]"
                  size={16}
                />

                <input
                  required
                  id="phone"
                  value={form.phone}
                  placeholder="Enter phone number"
                  className="w-full pl-11 pr-4 py-2.5 bg-[#f1f3ff] rounded-xl text-sm"
                  onChange={handleChange}
                />

              </div>

            </div>

            {/* ADDRESS */}

            <div className="space-y-1.5">

              <label className="text-[10px] font-bold uppercase tracking-widest text-[#434654] ml-1">

                Address

              </label>

              <div className="relative">

                <MapPin
                  className="absolute left-4 top-4 text-[#737685]"
                  size={16}
                />

                <textarea
                  required
                  id="address"
                  value={form.address}
                  placeholder="Enter your address"
                  className="w-full pl-11 pr-4 py-2.5 bg-[#f1f3ff] rounded-xl text-sm"
                  onChange={handleChange}
                />

              </div>

            </div>

            {/* CITY */}

            <input
              required
              id="city"
              value={form.city}
              placeholder="City"
              className="w-full pl-4 pr-4 py-2.5 bg-[#f1f3ff] rounded-xl text-sm"
              onChange={handleChange}
            />

            {/* DISTRICT */}

            <input
              required
              id="district"
              value={form.district}
              placeholder="District"
              className="w-full pl-4 pr-4 py-2.5 bg-[#f1f3ff] rounded-xl text-sm"
              onChange={handleChange}
            />

            {/* STATE */}

            <input
              required
              id="state"
              value={form.state}
              placeholder="State"
              className="w-full pl-4 pr-4 py-2.5 bg-[#f1f3ff] rounded-xl text-sm"
              onChange={handleChange}
            />

            {/* PINCODE */}

            <input
              required
              id="pincode"
              value={form.pincode}
              placeholder="Pincode"
              className="w-full pl-4 pr-4 py-2.5 bg-[#f1f3ff] rounded-xl text-sm"
              onChange={handleChange}
            />

            {/* PROFILE IMAGE */}

            <div className="space-y-1.5">

              <label className="text-[10px] font-bold uppercase tracking-widest text-[#434654] ml-1">

                Profile Image

              </label>

              <div className="relative bg-[#f1f3ff] rounded-xl p-3">

                <Image
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[#737685]"
                  size={16}
                />

                <input
                  required
                  id="profile_image"
                  type="file"
                  className="w-full pl-8 text-sm"
                  onChange={handleChange}
                />

              </div>

            </div>

            {/* ID PROOF */}

            <div className="space-y-1.5">

              <label className="text-[10px] font-bold uppercase tracking-widest text-[#434654] ml-1">

                ID Proof

              </label>

              <div className="relative bg-[#f1f3ff] rounded-xl p-3">

                <FileText
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[#737685]"
                  size={16}
                />

                <input
                  required
                  id="id_proof"
                  type="file"
                  className="w-full pl-8 text-sm"
                  onChange={handleChange}
                />

              </div>

            </div>

            {/* SUBMIT */}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-gradient-to-br from-[#003d9b] to-[#0052cc] text-white font-bold rounded-xl"
            >

              {loading
                ? "Saving..."
                : "Create Profile"}

            </button>

          </form>

          <footer className="mt-auto pt-6 text-[#737685] text-[9px] font-bold opacity-60">

            © 2024 StayLink

          </footer>

        </section>

      </main>

    </div>
  );
};

export default OwnerProfileSetup;