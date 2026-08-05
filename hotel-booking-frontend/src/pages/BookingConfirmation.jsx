import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import api from "../api/axios";

const BookingConfirmation = () => {
  const navigate = useNavigate();
  const { bookingId } = useParams();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const pollCountRef = useRef(0);

  useEffect(() => {
    let timeoutId;

    const fetchBooking = async () => {
      try {
        const response = await api.get(`/bookings/${bookingId}/`);
        setBooking(response.data);

        // If the Stripe webhook hasn't confirmed the booking yet, poll a
        // few times (every 2s, up to 5 tries) so the page updates itself
        // instead of permanently showing "Processing".
        if (response.data.status === "pending" && pollCountRef.current < 5) {
          pollCountRef.current += 1;
          timeoutId = setTimeout(fetchBooking, 2000);
        }
      } catch (err) {
        console.log("Booking fetch failed:", err.response?.data || err.message);
        setError("Unable to load booking details.");
      } finally {
        setLoading(false);
      }
    };

    if (bookingId) {
      fetchBooking();
    } else {
      setError("Booking ID missing.");
      setLoading(false);
    }

    return () => clearTimeout(timeoutId);
  }, [bookingId]);

  if (loading) {
    return <div className="text-center p-10">Loading booking details...</div>;
  }

  if (error || !booking) {
    return (
      <div className="text-center p-10 text-red-600">
        {error || "Booking not found."}
      </div>
    );
  }

  const isConfirmed = booking.status === "confirmed";
  const isPending = booking.status === "pending";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-3xl mx-auto p-6"
    >
      <div className="bg-white shadow-xl rounded-2xl p-8 text-center">
        <div
          className={`text-6xl mb-5 ${isConfirmed ? "text-green-600" : "text-yellow-500"}`}
        >
          {isConfirmed ? "✓" : "⏳"}
        </div>

        <h2 className="text-3xl font-bold mb-3">
          {isConfirmed ? "Booking Confirmed!" : "Payment Processing..."}
        </h2>

        <p className="text-gray-600 mb-8">
          {isConfirmed
            ? "Thank you for choosing Aurelia Stays. Your reservation has been successfully confirmed."
            : "Your payment is being confirmed. This page will update automatically — please don't close it."}
        </p>

        <div className="text-left bg-gray-50 rounded-xl p-5 space-y-3">
          <h3 className="text-xl font-semibold mb-4">Booking Details</h3>

          <p>
            Booking ID:
            <span className="font-bold ml-2">AUR-{booking.id}</span>
          </p>

          <p>
            Hotel:
            <span className="font-semibold ml-2">{booking.hotel_name}</span>
          </p>

          <p>
            City:
            <span className="font-semibold ml-2">{booking.hotel_city}</span>
          </p>

          <p>
            Room:
            <span className="font-semibold ml-2">{booking.room_type}</span>
          </p>

          <p>
            Check In:
            <span className="font-semibold ml-2">{booking.check_in_date}</span>
          </p>

          <p>
            Check Out:
            <span className="font-semibold ml-2">{booking.check_out_date}</span>
          </p>

          <p>
            Nights:
            <span className="font-semibold ml-2">{booking.nights}</span>
          </p>

          <p>
            Total Amount:
            <span className="font-semibold ml-2">
              PKR {Number(booking.total_price).toLocaleString()}
            </span>
          </p>

          <p>
            Payment:
            <span
              className={`font-semibold ml-2 ${
                isConfirmed ? "text-green-600" : "text-yellow-600"
              }`}
            >
              {isConfirmed
                ? "Paid"
                : isPending
                  ? "Processing..."
                  : booking.status}
            </span>
          </p>
        </div>

        <button
          onClick={() => navigate("/")}
          className="mt-8 bg-yellow-600 text-white px-8 py-3 rounded-lg hover:bg-yellow-700 transition"
        >
          Back To Home
        </button>
      </div>
    </motion.div>
  );
};

export default BookingConfirmation;
