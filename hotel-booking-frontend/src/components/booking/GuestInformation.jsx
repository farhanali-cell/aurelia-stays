import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const GuestInformation = () => {
  const navigate = useNavigate();

  const [guest, setGuest] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    country: "",
    requests: "",
  });

  const handleChange = (e) => {
    setGuest({
      ...guest,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log(guest);

    // later backend/local storage connect karenge
    localStorage.setItem("guestInformation", JSON.stringify(guest));

    navigate("/payment");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto p-6"
    >
      <h2 className="text-3xl font-semibold mb-8 text-center">
        Guest Information
      </h2>

      <form
        onSubmit={handleSubmit}
        className="grid md:grid-cols-2 gap-6 bg-white shadow-lg rounded-xl p-8"
      >
        <input
          type="text"
          name="firstName"
          placeholder="First Name"
          value={guest.firstName}
          onChange={handleChange}
          className="border p-3 rounded-lg"
          required
        />

        <input
          type="text"
          name="lastName"
          placeholder="Last Name"
          value={guest.lastName}
          onChange={handleChange}
          className="border p-3 rounded-lg"
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={guest.email}
          onChange={handleChange}
          className="border p-3 rounded-lg"
          required
        />

        <input
          type="tel"
          name="phone"
          placeholder="Phone Number"
          value={guest.phone}
          onChange={handleChange}
          className="border p-3 rounded-lg"
          required
        />

        <input
          type="text"
          name="country"
          placeholder="Country"
          value={guest.country}
          onChange={handleChange}
          className="border p-3 rounded-lg"
        />

        <textarea
          name="requests"
          placeholder="Special Requests"
          value={guest.requests}
          onChange={handleChange}
          className="border p-3 rounded-lg md:col-span-2"
          rows="4"
        />

        <button
          type="submit"
          className="
          bg-yellow-600
          text-white
          py-3
          rounded-lg
          md:col-span-2
          hover:bg-yellow-700
          transition
          "
        >
          Continue To Payment
        </button>
      </form>
    </motion.div>
  );
};

export default GuestInformation;
