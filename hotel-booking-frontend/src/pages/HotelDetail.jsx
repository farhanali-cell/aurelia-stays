import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { BedDouble, Users, Wifi, ArrowLeft, MapPin } from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import api from "../api/axios";
import Divider from "../components/Divider";

// Fix default marker icon paths (react-leaflet + bundlers issue)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const HotelDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [hotel, setHotel] = useState(null);
  const [rooms, setRooms] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [bookingRoomId, setBookingRoomId] = useState(null);

  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");

  const [bookingError, setBookingError] = useState("");
  const [bookingLoading, setBookingLoading] = useState(false);

  // ---- MAP STATE ----
  const [coords, setCoords] = useState(null);
  const [mapLoading, setMapLoading] = useState(true);
  const [mapError, setMapError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        // NOTE: backend abhi single-hotel detail endpoint nahi deta,
        // isliye list se find kar rahe hain. Jab backend mein
        // /hotels/<id>/ (RetrieveAPIView) add ho, is line ko
        // api.get(`/hotels/${id}/`) se replace kar dena — zyada efficient hoga.
        const hotelsRes = await api.get("/hotels/");

        const currentHotel = hotelsRes.data.find(
          (hotel) => hotel.id === Number(id),
        );

        if (!currentHotel) {
          setError("Hotel not found.");
          return;
        }

        setHotel(currentHotel);

        const roomsRes = await api.get(`/hotels/${id}/rooms/`);

        setRooms(roomsRes.data);
      } catch (err) {
        console.log(err);
        setError("Failed to load hotel details.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // ---- GEOCODE hotel address -> lat/lng (prefer backend-saved coords) ----
  useEffect(() => {
    if (!hotel) return;

    if (
      hotel.latitude !== null &&
      hotel.latitude !== undefined &&
      hotel.longitude !== null &&
      hotel.longitude !== undefined
    ) {
      setCoords({
        lat: parseFloat(hotel.latitude),
        lng: parseFloat(hotel.longitude),
      });
      setMapLoading(false);
      return;
    }

    const geocodeHotel = async () => {
      setMapLoading(true);
      setMapError("");

      try {
        const query = encodeURIComponent(`${hotel.address}, ${hotel.city}`);
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${query}`,
        );
        const data = await res.json();

        if (data && data.length > 0) {
          setCoords({
            lat: parseFloat(data[0].lat),
            lng: parseFloat(data[0].lon),
          });
        } else {
          setMapError("Exact location could not be found on the map.");
        }
      } catch (err) {
        console.log("Geocoding error:", err);
        setMapError("Map is temporarily unavailable.");
      } finally {
        setMapLoading(false);
      }
    };

    geocodeHotel();
  }, [hotel]);

  const handleBooking = async (roomId) => {
    setBookingError("");

    if (!checkIn || !checkOut) {
      setBookingError("Please select both check-in and check-out dates.");
      return;
    }

    setBookingLoading(true);

    try {
      const response = await api.post("/bookings/", {
        room: roomId,
        check_in_date: checkIn,
        check_out_date: checkOut,
      });

      const bookingId = response.data.id;

      if (!bookingId) {
        throw new Error("Booking ID missing from response");
      }

      navigate(`/payment/${bookingId}`);
    } catch (err) {
      console.log("Booking Error:", err.response?.data);

      const message = err.response?.data
        ? JSON.stringify(err.response.data)
        : "Booking failed. Please try again.";

      setBookingError(message);
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-parchment">
        <p className="text-center mt-10 text-muted">Loading hotel details...</p>
      </div>
    );
  }

  if (error || !hotel) {
    return (
      <div className="min-h-screen bg-parchment">
        <p className="text-center mt-10 text-danger">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-parchment">
      <div className="max-w-5xl mx-auto px-4 py-10">
        <button
          onClick={() => navigate("/hotels")}
          className="flex items-center gap-1 text-muted hover:text-gold-dark transition mb-6 text-sm"
        >
          <ArrowLeft size={16} />
          Back to Hotels
        </button>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-surface rounded-2xl border border-gold/10 shadow-sm p-6 mb-8"
        >
          <p className="text-gold-dark text-xs tracking-[0.2em] uppercase">
            Property
          </p>

          <h1 className="font-display text-3xl text-ink mt-1">{hotel.name}</h1>

          <p className="text-muted mt-2 flex items-center gap-1">
            <MapPin size={14} />
            {hotel.city}, {hotel.address}
          </p>

          <p className="text-ink/80 mt-4">{hotel.description}</p>
        </motion.div>

        {/* ---- MAP SECTION ---- */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-surface rounded-2xl border border-gold/10 shadow-sm p-6 mb-8"
        >
          <h2 className="font-display text-xl text-ink mb-1">Location</h2>
          <p className="text-muted text-sm mb-4">
            {hotel.city}, {hotel.address}
          </p>

          {mapLoading && (
            <div className="h-72 rounded-xl bg-gold/10 animate-pulse flex items-center justify-center">
              <p className="text-muted text-sm">Loading map...</p>
            </div>
          )}

          {!mapLoading && mapError && (
            <div className="h-72 rounded-xl bg-gold/10 flex flex-col items-center justify-center gap-2">
              <MapPin size={24} className="text-gold-dark" />
              <p className="text-muted text-sm">{mapError}</p>
            </div>
          )}

          {!mapLoading && !mapError && coords && (
            <div className="h-72 rounded-xl overflow-hidden">
              <MapContainer
                center={[coords.lat, coords.lng]}
                zoom={15}
                scrollWheelZoom={false}
                style={{ height: "100%", width: "100%" }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={[coords.lat, coords.lng]}>
                  <Popup>
                    <strong>{hotel.name}</strong>
                    <br />
                    {hotel.address}, {hotel.city}
                  </Popup>
                </Marker>
              </MapContainer>
            </div>
          )}
        </motion.div>

        <h2 className="font-display text-xl text-ink">Available Rooms</h2>

        <Divider />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          {rooms.length === 0 && (
            <p className="text-muted col-span-2 text-center py-6">
              No rooms found for this hotel.
            </p>
          )}

          {rooms.map((room) => (
            <motion.div
              key={room.id}
              className="bg-surface rounded-2xl border border-gold/10 shadow-sm p-5"
            >
              <div className="flex justify-between">
                <h3 className="font-display text-lg flex items-center gap-2">
                  <BedDouble size={18} />
                  {room.room_type}
                </h3>

                <span className="text-gold-dark font-semibold">
                  Rs. {room.price_per_night}
                  <span className="text-xs">/night</span>
                </span>
              </div>

              <p className="text-muted mt-2 flex gap-1">
                <Users size={14} />
                Capacity: {room.capacity}
              </p>

              {!room.is_available && (
                <p className="text-danger text-sm mt-2 font-medium">
                  Currently unavailable
                </p>
              )}

              {room.is_available && bookingRoomId === room.id && (
                <div className="mt-4 space-y-3">
                  <input
                    type="date"
                    value={checkIn}
                    min={new Date().toISOString().split("T")[0]}
                    onChange={(e) => setCheckIn(e.target.value)}
                    className="border p-2 rounded w-full"
                  />

                  <input
                    type="date"
                    value={checkOut}
                    min={checkIn || new Date().toISOString().split("T")[0]}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="border p-2 rounded w-full"
                  />

                  {bookingError && (
                    <p className="text-danger text-sm">{bookingError}</p>
                  )}

                  <button
                    onClick={() => handleBooking(room.id)}
                    disabled={bookingLoading}
                    className="w-full bg-ink text-white py-2 rounded disabled:opacity-50"
                  >
                    {bookingLoading ? "Booking..." : "Confirm Booking"}
                  </button>
                </div>
              )}

              {room.is_available && bookingRoomId !== room.id && (
                <button
                  onClick={() => setBookingRoomId(room.id)}
                  className="w-full mt-4 bg-ink text-white py-2 rounded"
                >
                  Book Now
                </button>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HotelDetail;
