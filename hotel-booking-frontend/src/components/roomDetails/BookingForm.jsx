import { useState } from "react";
import { motion } from "framer-motion";
import { Users, BedDouble } from "lucide-react";
import DateRangePicker from "../DateRangePicker";

const PRICE_PER_NIGHT = 180;

const BookingForm = () => {
  const [checkIn, setCheckIn] = useState(null);
  const [checkOut, setCheckOut] = useState(null);

  const nights =
    checkIn && checkOut
      ? Math.round((checkOut - checkIn) / (1000 * 60 * 60 * 24))
      : 0;
  const total = nights > 0 ? nights * PRICE_PER_NIGHT : PRICE_PER_NIGHT;

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-3 gap-10">
          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="lg:col-span-2 bg-white rounded-3xl p-8 shadow-lg"
          >
            <h2 className="text-3xl font-bold text-gray-900">
              Reserve Your Room
            </h2>
            <p className="mt-3 text-gray-600">
              Complete your details and confirm your booking.
            </p>

            <div className="mt-8 grid md:grid-cols-2 gap-6">
              {/* Date Range (spans full width) */}
              <div className="md:col-span-2">
                <label className="text-sm font-semibold text-gray-700">
                  Check In — Check Out
                </label>
                <div className="mt-2">
                  <DateRangePicker
                    checkIn={checkIn}
                    checkOut={checkOut}
                    onChange={({ checkIn, checkOut }) => {
                      setCheckIn(checkIn);
                      setCheckOut(checkOut);
                    }}
                  />
                </div>
              </div>

              {/* Guests */}
              <div>
                <label className="text-sm font-semibold text-gray-700">
                  Guests
                </label>
                <div className="mt-2 flex items-center gap-3 border rounded-xl px-4 py-3">
                  <Users size={20} className="text-amber-500" />
                  <select className="outline-none w-full text-gray-600">
                    <option>1 Guest</option>
                    <option>2 Guests</option>
                    <option>3 Guests</option>
                    <option>4 Guests</option>
                  </select>
                </div>
              </div>

              {/* Room */}
              <div>
                <label className="text-sm font-semibold text-gray-700">
                  Room Type
                </label>
                <div className="mt-2 flex items-center gap-3 border rounded-xl px-4 py-3">
                  <BedDouble size={20} className="text-amber-500" />
                  <select className="outline-none w-full text-gray-600">
                    <option>Deluxe Room</option>
                    <option>Executive Suite</option>
                    <option>Presidential Suite</option>
                  </select>
                </div>
              </div>
            </div>

            <button className="mt-8 bg-amber-500 hover:bg-amber-600 text-white font-semibold px-10 py-4 rounded-xl transition">
              Confirm Booking
            </button>
          </motion.div>

          {/* Summary Card */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="bg-gray-900 text-white rounded-3xl p-8 h-fit"
          >
            <h3 className="text-2xl font-bold">Booking Summary</h3>

            <div className="mt-8 space-y-5 text-gray-300">
              <div className="flex justify-between">
                <span>Room</span>
                <span>Deluxe Room</span>
              </div>
              <div className="flex justify-between">
                <span>Price</span>
                <span>${PRICE_PER_NIGHT} / night</span>
              </div>
              <div className="flex justify-between">
                <span>Nights</span>
                <span>{nights > 0 ? nights : "—"}</span>
              </div>
              <div className="border-t border-gray-700 pt-5 flex justify-between">
                <span className="font-bold text-white">Total</span>
                <span className="text-amber-400 font-bold text-xl">
                  ${total}
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default BookingForm;
