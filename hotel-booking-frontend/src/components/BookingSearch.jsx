import { useState } from "react";
import { Search, Users, MapPin, Calendar, Star } from "lucide-react";
import { Link } from "react-router-dom";
import api from "../api/axios"; // adjust this relative path to match where this file actually lives in your project

function todayStr() {
  return new Date().toISOString().split("T")[0];
}

/* ---------------- Main booking search bar ---------------- */
const BookingSearch = () => {
  const [destination, setDestination] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState("2 Adults");
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  function handleCheckInChange(e) {
    const val = e.target.value;
    setCheckIn(val);
    // keep check-out valid if it's now before the new check-in date
    if (checkOut && val && checkOut <= val) setCheckOut("");
  }

  async function handleSearch() {
    setLoading(true);
    setErrorMsg("");
    try {
      const response = await api.get("/hotels/");
      const all = response.data || [];
      const q = destination.trim().toLowerCase();
      const filtered = q
        ? all.filter(
            (h) =>
              h.city?.toLowerCase().includes(q) ||
              h.name?.toLowerCase().includes(q),
          )
        : all;
      setResults({ hotels: filtered, destination, checkIn, checkOut, guests });
    } catch (error) {
      console.log("Hotel search failed", error);
      setErrorMsg("Couldn't load hotels right now. Please try again.");
      setResults(null);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-3 md:p-3.5 grid grid-cols-1 md:grid-cols-4 gap-3 text-left mb-10  ">
        {/* Destination */}
        <div className="flex items-center gap-3 border border-neutral-200 rounded-xl px-4 py-2">
          <MapPin size={18} className="text-gold shrink-0" />
          <div className="min-w-0">
            <p className="text-xs text-neutral-500 font-inter">Destination</p>
            <input
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="Where are you going?"
              className="outline-none text-sm font-inter text-neutral-800 w-full bg-transparent"
            />
          </div>
        </div>

        {/* Check In / Check Out — native date inputs, same pattern already used on the site */}
        <div className="md:col-span-2 grid grid-cols-2 gap-3">
          <div className="flex items-center gap-3 border border-neutral-200 rounded-xl px-4 py-2">
            <Calendar size={18} className="text-gold shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="text-xs text-neutral-500 font-inter">Check In</p>
              <input
                type="date"
                min={todayStr()}
                value={checkIn}
                onChange={handleCheckInChange}
                className="outline-none text-sm font-inter text-neutral-800 w-full bg-transparent"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 border border-neutral-200 rounded-xl px-4 py-2">
            <Calendar size={18} className="text-gold shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="text-xs text-neutral-500 font-inter">Check Out</p>
              <input
                type="date"
                min={checkIn || todayStr()}
                value={checkOut}
                disabled={!checkIn}
                onChange={(e) => setCheckOut(e.target.value)}
                className="outline-none text-sm font-inter text-neutral-800 w-full bg-transparent disabled:text-neutral-300"
              />
            </div>
          </div>
        </div>

        {/* Guests + Search */}
        <div className="flex gap-2">
          <div className="flex items-center gap-2 border border-neutral-200 rounded-xl px-3 py-2 flex-1 min-w-0">
            <Users size={18} className="text-gold shrink-0" />
            <div className="min-w-0">
              <p className="text-xs text-neutral-500 font-inter">Guests</p>
              <select
                value={guests}
                onChange={(e) => setGuests(e.target.value)}
                className="outline-none text-sm font-inter bg-transparent w-full"
              >
                <option>1 Adult</option>
                <option>2 Adults</option>
                <option>3 Adults</option>
                <option>Family</option>
              </select>
            </div>
          </div>

          <button
            type="button"
            onClick={handleSearch}
            disabled={loading}
            className="bg-gold hover:bg-gold/90 active:scale-95 text-white rounded-xl px-4 py-2 flex items-center justify-center gap-1.5 transition-all shadow-md hover:shadow-lg font-inter text-sm font-medium whitespace-nowrap shrink-0 disabled:opacity-60"
          >
            <Search size={14} />
            <span>{loading ? "Searching..." : "Search"}</span>
          </button>
        </div>
      </div>

      {/* Error */}
      {errorMsg && (
        <p className="mt-4 text-sm text-red-500 font-inter">{errorMsg}</p>
      )}

      {/* Results */}
      {results && (
        <div className="mt-6 mb-10 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl p-5">
          <p className="text-sm text-neutral-500 font-inter mb-4">
            {results.hotels.length}{" "}
            {results.hotels.length === 1 ? "stay" : "stays"} found
            {results.destination ? ` in "${results.destination}"` : ""}
            {results.checkIn && results.checkOut
              ? ` · ${results.checkIn} – ${results.checkOut}`
              : ""}
            {" · "}
            {results.guests}
          </p>

          {results.hotels.length === 0 ? (
            <p className="text-sm text-neutral-400 font-inter">
              No hotels matched that destination.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {results.hotels.map((hotel) => {
                const firstRoom = hotel.rooms?.[0];
                const imageUrl = firstRoom?.image || null;

                return (
                  <Link
                    to={`/hotels/${hotel.id}`}
                    key={hotel.id}
                    className="rounded-xl overflow-hidden border border-neutral-100 hover:shadow-lg transition-shadow group"
                  >
                    <div className="relative h-32 overflow-hidden bg-neutral-200">
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={hotel.name}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-neutral-400 text-xs font-inter">
                          No Image
                        </div>
                      )}
                      {firstRoom?.is_available && (
                        <span className="absolute bottom-2 left-2 bg-green-600 text-white text-[10px] px-2 py-0.5 rounded-full">
                          Available
                        </span>
                      )}
                    </div>
                    <div className="p-3">
                      <p className="text-sm font-semibold text-neutral-800 font-inter">
                        {hotel.name}
                      </p>
                      <p className="text-xs text-neutral-500 font-inter">
                        {hotel.city}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        {hotel.min_price ? (
                          <span className="text-sm font-semibold text-gold font-inter">
                            Rs. {hotel.min_price}/night
                          </span>
                        ) : (
                          <span className="text-xs text-neutral-400 font-inter">
                            Price unavailable
                          </span>
                        )}
                        <span className="flex items-center gap-1 text-xs text-neutral-500 font-inter">
                          <Star size={12} className="fill-gold text-gold" />
                          {hotel.star_rating}
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BookingSearch;
