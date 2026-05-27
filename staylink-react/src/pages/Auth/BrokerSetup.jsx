import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  createBrokerProfile,
} from "../../services/authService";

import {
  Phone,
  MapPin,
  Building,
  Image,
  FileText,
  Briefcase,
} from "lucide-react";

const BrokerSetup = () => {

  const navigate = useNavigate();

  /* =========================
      STATES
  ========================= */

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    phone: "",
    address: "",
    city: "",
    district: "",
    state: "Kerala",
    pincode: "",
    agency_name: "",
    experience: "",
    license_number: "",
    profile_image: null,
    id_proof: null,
  });

  /* =========================
      HANDLE CHANGE
  ========================= */

  const handleChange = (e) => {

    const {
      id,
      value,
      files,
    } = e.target;

    if (files) {

      setForm((prev) => ({
        ...prev,
        [id]: files[0],
      }));

    } else {

      setForm((prev) => ({
        ...prev,
        [id]: value,
      }));
    }
  };

  /* =========================
      HANDLE SUBMIT
  ========================= */

  const handleSubmit = async (e) => {

    e.preventDefault();

    if (
      !form.phone.trim() ||
      !form.address.trim() ||
      !form.city.trim() ||
      !form.district.trim() ||
      !form.state.trim() ||
      !form.pincode.trim() ||
      !form.agency_name.trim() ||
      !form.license_number.trim() ||
      form.experience === "" ||
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
      data.append("agency_name", form.agency_name);

      data.append(
        "experience",
        Number(form.experience)
      );

      data.append(
        "license_number",
        form.license_number
      );

      data.append(
        "profile_image",
        form.profile_image
      );

      data.append(
        "id_proof",
        form.id_proof
      );

      /* =========================
          CREATE PROFILE
      ========================= */

      const res =
        await createBrokerProfile(data);

      console.log(res.data);

      /* =========================
          UPDATE USER STORAGE
      ========================= */

      const user = JSON.parse(
        localStorage.getItem("user")
      );

      const updatedUser = {
        ...user,
        profile_completed: true,
      };

      localStorage.setItem(
        "user",
        JSON.stringify(updatedUser)
      );

      /* =========================
          SUCCESS
      ========================= */

      alert(
        "Profile submitted successfully"
      );

      window.location.href =
        "/broker/dashboard";

    } catch (err) {

      console.log(err.response?.data);

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

    <div className="bg-[#f1f3ff] min-h-screen flex items-center justify-center p-4">

      <main className="w-full max-w-6xl flex flex-col md:flex-row bg-[#f9f9ff] rounded-[2.5rem] shadow-2xl shadow-[#003d9b]/5 overflow-hidden">

        {/* =========================
            LEFT SIDE
        ========================= */}

        <section className="hidden md:flex md:w-[40%] relative p-10 flex-col justify-end">

          <div className="absolute inset-0 z-0">

            <img
              src="https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=80"
              alt="Broker Setup"
              className="w-full h-full object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-[#003d9b]/90 via-[#003d9b]/20 to-transparent"></div>

          </div>

          <div className="relative z-10">

            <h2 className="text-4xl font-extrabold text-white leading-tight">

              Build Your Real Estate
              <br />
              Business

            </h2>

            <p className="mt-5 text-[#dbe6ff] text-sm max-w-sm leading-relaxed">

              Complete your professional broker profile
              and start managing listings, clients
              and enquiries.

            </p>

          </div>
        </section>

        {/* =========================
            RIGHT SIDE
        ========================= */}

        <section className="flex-1 flex flex-col items-center p-8 lg:px-20 overflow-y-auto">

          {/* HEADING */}

          <div className="mb-8 w-full max-w-md">

            <h1 className="text-4xl font-extrabold text-[#041b3c]">

              Broker Setup

            </h1>

            <p className="mt-2 text-sm text-[#5c6070]">

              Complete your professional profile.

            </p>

          </div>

          {/* FORM */}

          <form
            onSubmit={handleSubmit}
            className="w-full max-w-md space-y-4"
          >

            {/* PHONE */}

            <div className="relative">

              <Phone
                size={16}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                required
                id="phone"
                type="text"
                placeholder="Phone Number"
                value={form.phone}
                onChange={handleChange}
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-[#f1f3ff] text-sm outline-none"
              />

            </div>

            {/* ADDRESS */}

            <div className="relative">

              <MapPin
                size={16}
                className="absolute left-4 top-4 text-gray-400"
              />

              <textarea
                required
                id="address"
                placeholder="Address"
                value={form.address}
                onChange={handleChange}
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-[#f1f3ff] text-sm outline-none"
              />

            </div>

            {/* CITY */}

            <input
              required
              id="city"
              type="text"
              placeholder="City"
              value={form.city}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl bg-[#f1f3ff] text-sm outline-none"
            />

            {/* DISTRICT */}

            <input
              required
              id="district"
              type="text"
              placeholder="District"
              value={form.district}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl bg-[#f1f3ff] text-sm outline-none"
            />

            {/* STATE */}

            <input
              required
              id="state"
              type="text"
              value={form.state}
              readOnly
              className="w-full px-4 py-3 rounded-xl bg-[#f1f3ff] text-sm outline-none"
            />

            {/* PINCODE */}

            <input
              required
              id="pincode"
              type="text"
              placeholder="Pincode"
              value={form.pincode}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl bg-[#f1f3ff] text-sm outline-none"
            />

            {/* AGENCY */}

            <div className="relative">

              <Building
                size={16}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                required
                id="agency_name"
                type="text"
                placeholder="Agency Name"
                value={form.agency_name}
                onChange={handleChange}
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-[#f1f3ff] text-sm outline-none"
              />

            </div>

            {/* EXPERIENCE */}

            <div className="relative">

              <Briefcase
                size={16}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                required
                id="experience"
                type="number"
                placeholder="Experience (Years)"
                value={form.experience}
                onChange={handleChange}
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-[#f1f3ff] text-sm outline-none"
              />

            </div>

            {/* LICENSE */}

            <input
              required
              id="license_number"
              type="text"
              placeholder="License Number"
              value={form.license_number}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl bg-[#f1f3ff] text-sm outline-none"
            />

            {/* PROFILE IMAGE */}

            <div className="bg-[#f1f3ff] rounded-xl p-3 relative">

              <Image
                size={16}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                required
                id="profile_image"
                type="file"
                placeholder="Profile image"
                onChange={handleChange}
                className="w-full pl-8 text-sm"
              />

            </div>

            {/* ID PROOF */}

            <div className="bg-[#f1f3ff] rounded-xl p-3 relative">

              <FileText
                size={16}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                required
                id="id_proof"
                type="file"
                placeholder="ID Proof"
                onChange={handleChange}
                className="w-full pl-8 text-sm"
              />

            </div>

            {/* BUTTON */}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#003d9b] to-[#0052cc] text-white font-bold hover:opacity-95 transition"
            >

              {loading
                ? "Creating Profile..."
                : "Create Profile"}

            </button>

          </form>

          {/* FOOTER */}

          <footer className="mt-auto pt-6 text-xs text-[#7c8195]">

            © 2026 StayLink

          </footer>

        </section>

      </main>

    </div>
  );
};

export default BrokerSetup;