import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const Payment = () => {
  const navigate = useNavigate();

  const [paymentMethod, setPaymentMethod] = useState("card");

  const handlePayment = () => {
    // later backend API call

    navigate("/booking-confirmation");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-5xl mx-auto p-6"
    >
      <h2 className="text-3xl font-semibold text-center mb-8">Payment</h2>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Booking Summary */}

        <div
          className="
            bg-white
            shadow-lg
            rounded-xl
            p-6
            "
        >
          <h3 className="text-xl font-semibold mb-5">Booking Summary</h3>

          <div className="space-y-3 text-gray-600">
            <p>
              Room:
              <span className="font-semibold">Deluxe Suite</span>
            </p>

            <p>
              Check In:
              <span className="font-semibold">20 Aug 2026</span>
            </p>

            <p>
              Check Out:
              <span className="font-semibold">25 Aug 2026</span>
            </p>

            <p>
              Guests:
              <span className="font-semibold">2 Adults</span>
            </p>
          </div>

          <hr className="my-5" />

          <div className="flex justify-between text-lg">
            <span>Total</span>

            <span className="font-bold">$750</span>
          </div>
        </div>

        {/* Payment Options */}

        <div
          className="
            bg-white
            shadow-lg
            rounded-xl
            p-6
            "
        >
          <h3 className="text-xl font-semibold mb-5">Select Payment Method</h3>

          <div className="space-y-4">
            <label className="flex gap-3">
              <input
                type="radio"
                value="card"
                checked={paymentMethod === "card"}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              Credit / Debit Card
            </label>

            <label className="flex gap-3">
              <input
                type="radio"
                value="paypal"
                checked={paymentMethod === "paypal"}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              PayPal
            </label>

            <label className="flex gap-3">
              <input
                type="radio"
                value="cash"
                checked={paymentMethod === "cash"}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              Pay At Hotel
            </label>
          </div>

          <button
            onClick={handlePayment}
            className="
            mt-8
            w-full
            bg-yellow-600
            text-white
            py-3
            rounded-lg
            hover:bg-yellow-700
            transition
            "
          >
            Confirm Booking
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default Payment;
