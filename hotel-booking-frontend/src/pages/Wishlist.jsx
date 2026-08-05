import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { MapPin, BedDouble, Star, Heart, SearchX } from "lucide-react";
import api from "../api/axios";
import PageBanner from "../components/PageBanner";

const fallbackImages = [
  "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=800&auto=format&fit=crop",
];

const getLowestPrice = (hotel) => {
  if (!hotel.rooms || hotel.rooms.length === 0) return Infinity;
  return Math.min(...hotel.rooms.map((r) => parseFloat(r.price_per_night)));
};

const SkeletonCard = () => (
  <div className="bg-surface rounded-2xl border border-gold/10 overflow-hidden animate-pulse">
    <div className="h-48 bg-ink/10" />
    <div className="p-5 space-y-3">
      <div className="h-4 bg-ink/10 rounded w-2/3" />
      <div className="h-3 bg-ink/10 rounded w-1/2" />
    </div>
  </div>
);

const Wishlist = () => {
  const [items, setItems] = useState([]); // raw wishlist entries: {id, hotel, hotel_detail, added_at}
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [removingId, setRemovingId] = useState(null);

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const res = await api.get("/wishlist/");
        setItems(res.data);
      } catch (err) {
        setError("Failed to load your wishlist. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchWishlist();
  }, []);

  const handleRemove = async (wishlistItemId) => {
    setRemovingId(wishlistItemId);
    try {
      await api.delete(`/wishlist/${wishlistItemId}/`);
      setItems((prev) => prev.filter((item) => item.id !== wishlistItemId));
    } catch (err) {
      setError("Failed to remove item. Please try again.");
    } finally {
      setRemovingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-parchment">
      <PageBanner
        subtitle="Saved For Later"
        title="My Wishlist"
        image="https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=1920&auto=format&fit=crop"
      />

      <div className="max-w-6xl mx-auto px-4 py-16">
        {!loading && !error && (
          <p className="text-sm font-inter text-muted mb-8">
            {items.length} hotel{items.length !== 1 ? "s" : ""} saved
          </p>
        )}

        {error && <p className="text-danger text-center py-10">{error}</p>}

        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
            {Array.from({ length: 3 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        )}

        {!loading && !error && items.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="bg-gold/10 rounded-full p-5 mb-5">
              <SearchX size={36} className="text-gold-dark" />
            </div>
            <h3 className="font-display text-xl text-ink mb-2">
              Your wishlist is empty
            </h3>
            <p className="text-sm text-muted max-w-sm">
              Tap the heart icon on any hotel to save it here for later.
            </p>
            <Link
              to="/hotels"
              className="mt-6 px-6 py-2.5 rounded-full bg-gold text-white text-sm font-inter hover:opacity-90 transition-opacity"
            >
              Explore Hotels
            </Link>
          </div>
        )}

        {!loading && !error && items.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
            {items.map((item, i) => {
              const hotel = item.hotel_detail;
              const lowestPrice = getLowestPrice(hotel);

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: (i % 6) * 0.06 }}
                  whileHover={{ y: -4 }}
                  className="bg-surface rounded-2xl border border-gold/10 shadow-sm hover:shadow-xl hover:border-gold/30 transition-all duration-300 overflow-hidden"
                >
                  <div className="h-48 relative overflow-hidden">
                    <Link to={`/hotels/${hotel.id}`}>
                      <img
                        src={fallbackImages[hotel.id % fallbackImages.length]}
                        alt={hotel.name}
                        className="w-full h-full object-cover"
                      />
                    </Link>
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm rounded-full p-2">
                      <BedDouble size={16} className="text-gold-dark" />
                    </div>
                    <button
                      onClick={() => handleRemove(item.id)}
                      disabled={removingId === item.id}
                      className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full p-2 hover:bg-white transition-colors disabled:opacity-60"
                      title="Remove from wishlist"
                    >
                      <Heart
                        size={16}
                        className="text-danger"
                        fill="currentColor"
                      />
                    </button>
                    {hotel.star_rating && (
                      <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm rounded-full px-2.5 py-1 flex items-center gap-1">
                        <span className="text-xs font-inter font-semibold text-ink">
                          {hotel.star_rating}
                        </span>
                        <Star
                          size={12}
                          className="text-gold-dark"
                          fill="currentColor"
                        />
                      </div>
                    )}
                    {lowestPrice !== Infinity && (
                      <div className="absolute bottom-3 right-3 bg-gold text-white text-sm font-inter font-semibold px-3 py-1.5 rounded-full shadow-md">
                        PKR {lowestPrice.toLocaleString()} / night
                      </div>
                    )}
                  </div>

                  <div className="p-5">
                    <Link to={`/hotels/${hotel.id}`}>
                      <h2 className="font-display text-lg text-ink">
                        {hotel.name}
                      </h2>
                    </Link>
                    <p className="flex items-center gap-1 text-sm text-muted mt-1.5">
                      <MapPin size={14} className="text-gold-dark" />
                      {hotel.city}, {hotel.address}
                    </p>
                    <p className="text-sm text-muted mt-3 line-clamp-2">
                      {hotel.description || "No description available."}
                    </p>
                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-ink/5">
                      <Link
                        to={`/hotels/${hotel.id}`}
                        className="text-xs font-medium text-gold-dark hover:translate-x-1 transition-transform inline-block"
                      >
                        View details →
                      </Link>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
