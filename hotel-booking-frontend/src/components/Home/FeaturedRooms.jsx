import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Users,
  BedDouble,
  Wifi,
  Heart,
  Star,
  MapPin,
  Coffee,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";

const FeaturedRooms = () => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [wishlist, setWishlist] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const response = await api.get("/hotels/");
        setHotels(response.data.slice(0, 4)); // sirf top 4 featured section ke liye
      } catch (error) {
        console.log("Failed to load hotels", error);
        setHotels([]);
      } finally {
        setLoading(false);
      }
    };

    fetchHotels();
  }, []);

  useEffect(() => {
    // agar user logged in hy to uski wishlist load karo taky heart icon sahi state show kare
    const fetchWishlist = async () => {
      if (!user) return;
      try {
        const res = await api.get("/wishlist/");
        setWishlist(res.data.map((item) => item.hotel));
      } catch (error) {
        console.log("Failed to load wishlist", error);
      }
    };

    fetchWishlist();
  }, [user]);

  const toggleWishlist = async (hotelId) => {
    if (!user) {
      alert("Please login to use wishlist.");
      return;
    }
    try {
      const res = await api.post(`/wishlist/toggle/${hotelId}/`);
      setWishlist((prev) =>
        res.data.wishlisted
          ? [...prev, hotelId]
          : prev.filter((id) => id !== hotelId),
      );
    } catch (error) {
      console.log("Wishlist toggle failed", error);
    }
  };

  return (
    <section className="bg-parchment py-24 px-6 lg:px-10">
      <div className="max-w-7xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-16">
          <span className="font-inter text-sm tracking-[0.3em] text-gold uppercase">
            Premium Collection
          </span>
          <h2 className="font-fraunces text-4xl md:text-5xl text-neutral-900 mt-4">
            Featured Hotels
          </h2>
          <p className="font-inter text-neutral-500 mt-4 max-w-xl mx-auto">
            Experience luxury, comfort and world-class hospitality across
            Pakistan's top cities.
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="bg-white rounded-2xl overflow-hidden animate-pulse"
              >
                <div className="h-56 bg-neutral-200"></div>
                <div className="p-5 space-y-3">
                  <div className="h-5 bg-neutral-200 rounded"></div>
                  <div className="h-4 bg-neutral-200 rounded w-2/3"></div>
                  <div className="h-10 bg-neutral-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty */}
        {!loading && hotels.length === 0 && (
          <div className="text-center py-20">
            <h3 className="font-fraunces text-3xl">No Hotels Available</h3>
            <p className="text-neutral-500 mt-3">Please check again later.</p>
          </div>
        )}

        {/* Cards */}
        {!loading && hotels.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {hotels.map((hotel, index) => {
              const firstRoom = hotel.rooms?.[0];
              const imageUrl = firstRoom?.image || null;

              return (
                <motion.div
                  key={hotel.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500"
                >
                  {/* Image */}
                  <div className="relative h-60 overflow-hidden bg-neutral-200">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={hotel.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-neutral-400 text-sm font-inter">
                        No Image
                      </div>
                    )}

                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition"></div>

                    <button
                      onClick={() => toggleWishlist(hotel.id)}
                      className="absolute top-4 right-4 bg-white/90 w-10 h-10 rounded-full flex items-center justify-center"
                    >
                      <Heart
                        size={20}
                        className={
                          wishlist.includes(hotel.id)
                            ? "fill-red-500 text-red-500"
                            : "text-neutral-700"
                        }
                      />
                    </button>

                    {firstRoom?.is_available && (
                      <span className="absolute bottom-4 left-4 bg-green-600 text-white text-xs px-3 py-1 rounded-full">
                        Available
                      </span>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-fraunces text-xl text-neutral-900">
                        {hotel.name}
                      </h3>
                      <div className="flex items-center gap-1 text-xs">
                        <Star size={14} className="fill-gold text-gold" />
                        <span className="font-inter text-neutral-700">
                          {hotel.star_rating}
                        </span>
                      </div>
                    </div>

                    {/* Location */}
                    <div className="flex items-center gap-1.5 text-neutral-500 text-sm font-inter">
                      <MapPin size={14} />
                      <span>{hotel.city}</span>
                    </div>

                    {/* Price */}
                    <div className="flex items-center gap-2 mt-4">
                      {hotel.min_price ? (
                        <span className="text-gold font-inter font-semibold">
                          Rs. {hotel.min_price}
                        </span>
                      ) : (
                        <span className="text-neutral-400 font-inter text-sm">
                          Price unavailable
                        </span>
                      )}
                      {hotel.min_price && (
                        <span className="text-neutral-500 text-xs font-inter">
                          / night
                        </span>
                      )}
                    </div>

                    <hr className="my-4 border-gold/10" />

                    {/* Amenities */}
                    <div className="grid grid-cols-2 gap-3 text-xs text-neutral-500 font-inter">
                      <span className="flex items-center gap-1.5">
                        <Users size={14} />
                        {firstRoom?.capacity
                          ? `Up to ${firstRoom.capacity} Guests`
                          : "N/A"}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <BedDouble size={14} />
                        {firstRoom?.room_type || "N/A"}
                      </span>
                      {firstRoom?.amenities
                        ?.split(",")
                        .slice(0, 2)
                        .map((amenity, i) => (
                          <span key={i} className="flex items-center gap-1.5">
                            {amenity.toLowerCase().includes("wifi") ? (
                              <Wifi size={14} />
                            ) : (
                              <Coffee size={14} />
                            )}
                            {amenity.trim()}
                          </span>
                        ))}
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-3 mt-6">
                      <Link
                        to={`/hotels/${hotel.id}`}
                        className="flex-1 text-center border border-gold/40 text-gold-dark rounded-xl py-2.5 text-sm font-inter hover:bg-gold hover:text-white transition"
                      >
                        View Details
                      </Link>

                      <Link
                        to={`/hotels/${hotel.id}`}
                        className="flex-1 flex items-center justify-center gap-1 bg-gold text-white rounded-xl py-2.5 text-sm font-inter hover:bg-gold/90 transition"
                      >
                        Book
                        <ArrowRight size={15} />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedRooms;
