// src/pages/Hotels.jsx
import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  MapPin,
  BedDouble,
  Search,
  ArrowUpDown,
  SlidersHorizontal,
  SearchX,
  LayoutGrid,
  Map as MapIcon,
  Star,
  Heart,
} from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import api from "../api/axios";
import PageBanner from "../components/PageBanner";
import { fixLeafletIcons } from "../utils/fixLeafletIcons";
import { Link, useSearchParams } from "react-router-dom";

fixLeafletIcons();

const fallbackImages = [
  "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1618773928121-c32242e63f39?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?q=80&w=800&auto=format&fit=crop",
];

const MAX_PRICE = 50000;
const PAGE_SIZE = 6;

// Available amenity options for the filter checkboxes.
// Room.amenities is a comma-separated CharField/TextField on the backend,
// so these strings must match (case-insensitively) what's stored there.
const AMENITY_OPTIONS = ["WiFi", "Pool", "Parking", "AC", "Breakfast", "Gym"];

const STAR_OPTIONS = [5, 4, 3, 2, 1];

// Default map center (Pakistan-ish) used only when no hotel has coordinates yet
const DEFAULT_CENTER = [30.3753, 69.3451];
const DEFAULT_ZOOM = 5;

const getLowestPrice = (hotel) => {
  if (!hotel.rooms || hotel.rooms.length === 0) return Infinity;
  return Math.min(...hotel.rooms.map((r) => parseFloat(r.price_per_night)));
};

const hasCoords = (hotel) =>
  hotel.latitude !== null &&
  hotel.latitude !== undefined &&
  hotel.longitude !== null &&
  hotel.longitude !== undefined;

// Checks if a hotel has at least one room containing the given amenity
// (case-insensitive substring match against the comma-separated string).
const hotelHasAmenity = (hotel, amenity) => {
  if (!hotel.rooms || hotel.rooms.length === 0) return false;
  return hotel.rooms.some((room) =>
    (room.amenities || "").toLowerCase().includes(amenity.toLowerCase()),
  );
};

const SkeletonCard = () => (
  <div className="bg-surface rounded-2xl border border-gold/10 overflow-hidden animate-pulse">
    <div className="h-48 bg-ink/10" />
    <div className="p-5 space-y-3">
      <div className="h-4 bg-ink/10 rounded w-2/3" />
      <div className="h-3 bg-ink/10 rounded w-1/2" />
      <div className="h-3 bg-ink/10 rounded w-full" />
      <div className="h-3 bg-ink/10 rounded w-3/4" />
    </div>
  </div>
);

const Hotels = () => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedCity, setSelectedCity] = useState(
    searchParams.get("city") || "All",
  );
  const [sortOrder, setSortOrder] = useState("default");
  const [maxPrice, setMaxPrice] = useState(MAX_PRICE);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [viewMode, setViewMode] = useState("grid"); // 'grid' | 'map'

  // NEW: advanced filters
  const [starFilter, setStarFilter] = useState([]); // e.g. [5, 4]
  const [amenityFilter, setAmenityFilter] = useState([]); // e.g. ["WiFi", "Pool"]
  const [showFilters, setShowFilters] = useState(false);

  // NEW: wishlist — set of hotel IDs currently wishlisted by the logged-in guest
  const [wishlistedIds, setWishlistedIds] = useState(new Set());
  const [togglingId, setTogglingId] = useState(null);

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const res = await api.get("/wishlist/");
        const ids = new Set(res.data.map((item) => item.hotel));
        setWishlistedIds(ids);
      } catch (err) {
        // Not logged in, or no wishlist yet — fail silently, heart icons
        // just start unfilled. No need to surface an error for this.
      }
    };
    fetchWishlist();
  }, []);

  const handleToggleWishlist = async (e, hotelId) => {
    e.preventDefault(); // stop the card's <Link> from navigating
    e.stopPropagation();

    setTogglingId(hotelId);
    try {
      const res = await api.post(`/wishlist/toggle/${hotelId}/`);
      setWishlistedIds((prev) => {
        const next = new Set(prev);
        if (res.data.wishlisted) {
          next.add(hotelId);
        } else {
          next.delete(hotelId);
        }
        return next;
      });
    } catch (err) {
      // Likely not logged in as a guest — silently ignore for now.
      // Could redirect to /login here if desired.
    } finally {
      setTogglingId(null);
    }
  };

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const res = await api.get("/hotels/");
        setHotels(res.data);
      } catch (err) {
        setError("Failed to load hotels. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchHotels();
  }, []);

  const cities = useMemo(() => {
    const unique = [...new Set(hotels.map((h) => h.city).filter(Boolean))];
    return ["All", ...unique];
  }, [hotels]);

  const toggleStar = (star) => {
    setStarFilter((prev) =>
      prev.includes(star) ? prev.filter((s) => s !== star) : [...prev, star],
    );
  };

  const toggleAmenity = (amenity) => {
    setAmenityFilter((prev) =>
      prev.includes(amenity)
        ? prev.filter((a) => a !== amenity)
        : [...prev, amenity],
    );
  };

  const clearAdvancedFilters = () => {
    setStarFilter([]);
    setAmenityFilter([]);
  };

  const filteredHotels = useMemo(() => {
    let result = hotels.filter((hotel) => {
      const matchesCity = selectedCity === "All" || hotel.city === selectedCity;
      const matchesSearch = hotel.name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());
      const price = getLowestPrice(hotel);
      const matchesPrice = price === Infinity || price <= maxPrice;

      const matchesStar =
        starFilter.length === 0 || starFilter.includes(hotel.star_rating);

      const matchesAmenities =
        amenityFilter.length === 0 ||
        amenityFilter.every((amenity) => hotelHasAmenity(hotel, amenity));

      return (
        matchesCity &&
        matchesSearch &&
        matchesPrice &&
        matchesStar &&
        matchesAmenities
      );
    });

    if (sortOrder === "low-high") {
      result = [...result].sort(
        (a, b) => getLowestPrice(a) - getLowestPrice(b),
      );
    } else if (sortOrder === "high-low") {
      result = [...result].sort(
        (a, b) => getLowestPrice(b) - getLowestPrice(a),
      );
    }

    return result;
  }, [
    hotels,
    selectedCity,
    searchTerm,
    sortOrder,
    maxPrice,
    starFilter,
    amenityFilter,
  ]);

  // Reset pagination whenever filters change
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [
    searchTerm,
    selectedCity,
    sortOrder,
    maxPrice,
    starFilter,
    amenityFilter,
  ]);

  const visibleHotels = filteredHotels.slice(0, visibleCount);
  const hasMore = visibleCount < filteredHotels.length;

  // Hotels that actually have coordinates saved in backend
  const mappableHotels = useMemo(
    () => filteredHotels.filter(hasCoords),
    [filteredHotels],
  );

  const mapCenter = useMemo(() => {
    if (mappableHotels.length === 0) return DEFAULT_CENTER;
    const avgLat =
      mappableHotels.reduce((sum, h) => sum + Number(h.latitude), 0) /
      mappableHotels.length;
    const avgLng =
      mappableHotels.reduce((sum, h) => sum + Number(h.longitude), 0) /
      mappableHotels.length;
    return [avgLat, avgLng];
  }, [mappableHotels]);

  const activeAdvancedCount = starFilter.length + amenityFilter.length;

  return (
    <div className="min-h-screen bg-parchment">
      <PageBanner
        subtitle="Curated Stays"
        title="Explore Hotels"
        image="https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?q=80&w=1920&auto=format&fit=crop"
      />

      <div className="max-w-6xl mx-auto px-4 py-16">
        {/* Search + Filter Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-3 bg-surface p-4 rounded-2xl border border-gold/10 shadow-sm">
          <div className="flex items-center gap-2 flex-1 bg-parchment rounded-xl px-4 py-2.5 border border-gold/10">
            <Search size={18} className="text-gold-dark" />
            <input
              type="text"
              placeholder="Search hotel by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent outline-none text-sm text-ink w-full font-inter placeholder:text-muted"
            />
          </div>

          <div className="flex gap-2 flex-wrap">
            {cities.map((city) => (
              <button
                key={city}
                onClick={() => {
                  setSelectedCity(city);
                  if (city === "All") {
                    setSearchParams({});
                  } else {
                    setSearchParams({ city });
                  }
                }}
                className={`px-4 py-2 rounded-xl text-sm font-inter transition-all duration-300 ${
                  selectedCity === city
                    ? "bg-gold text-white"
                    : "bg-parchment text-ink hover:bg-gold/10 border border-gold/10"
                }`}
              >
                {city}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 bg-parchment rounded-xl px-4 py-2.5 border border-gold/10">
            <ArrowUpDown size={16} className="text-gold-dark" />
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="bg-transparent outline-none text-sm text-ink font-inter cursor-pointer"
            >
              <option value="default">Sort: Default</option>
              <option value="low-high">Price: Low to High</option>
              <option value="high-low">Price: High to Low</option>
            </select>
          </div>

          {/* NEW: toggle for advanced filters (star + amenities) */}
          <button
            onClick={() => setShowFilters((s) => !s)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-inter border transition-all duration-300 ${
              showFilters
                ? "bg-gold text-white border-gold"
                : "bg-parchment text-ink border-gold/10 hover:bg-gold/10"
            }`}
          >
            <SlidersHorizontal size={16} />
            Filters
            {activeAdvancedCount > 0 && (
              <span className="bg-white/30 text-xs rounded-full px-1.5">
                {activeAdvancedCount}
              </span>
            )}
          </button>
        </div>

        {/* Price Range Slider */}
        <div className="flex items-center gap-4 bg-surface p-4 rounded-2xl border border-gold/10 shadow-sm mb-4">
          <SlidersHorizontal size={16} className="text-gold-dark shrink-0" />
          <span className="text-sm font-inter text-muted whitespace-nowrap">
            Max Price:
          </span>
          <input
            type="range"
            min="1000"
            max={MAX_PRICE}
            step="500"
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            className="flex-1 accent-gold cursor-pointer"
          />
          <span className="text-sm font-inter font-semibold text-gold-dark whitespace-nowrap">
            PKR {maxPrice.toLocaleString()}
          </span>
        </div>

        {/* NEW: Advanced Filters Panel (Star Rating + Amenities) */}
        {showFilters && (
          <div className="bg-surface p-5 rounded-2xl border border-gold/10 shadow-sm mb-8">
            <div className="flex flex-col md:flex-row gap-8">
              {/* Star rating */}
              <div className="flex-1">
                <h4 className="font-inter text-sm font-semibold text-ink mb-3">
                  Star Rating
                </h4>
                <div className="flex flex-wrap gap-2">
                  {STAR_OPTIONS.map((star) => (
                    <button
                      key={star}
                      onClick={() => toggleStar(star)}
                      className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-inter border transition-all duration-200 ${
                        starFilter.includes(star)
                          ? "bg-gold text-white border-gold"
                          : "bg-parchment text-ink border-gold/10 hover:bg-gold/10"
                      }`}
                    >
                      {star}
                      <Star size={13} fill="currentColor" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Amenities */}
              <div className="flex-1">
                <h4 className="font-inter text-sm font-semibold text-ink mb-3">
                  Amenities
                </h4>
                <div className="flex flex-wrap gap-2">
                  {AMENITY_OPTIONS.map((amenity) => (
                    <button
                      key={amenity}
                      onClick={() => toggleAmenity(amenity)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-inter border transition-all duration-200 ${
                        amenityFilter.includes(amenity)
                          ? "bg-gold text-white border-gold"
                          : "bg-parchment text-ink border-gold/10 hover:bg-gold/10"
                      }`}
                    >
                      {amenity}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {activeAdvancedCount > 0 && (
              <button
                onClick={clearAdvancedFilters}
                className="mt-4 text-xs font-inter text-gold-dark underline"
              >
                Clear filters
              </button>
            )}
          </div>
        )}

        {/* Result count + View Toggle */}
        <div className="flex items-center justify-between mb-8">
          {!loading && !error && (
            <p className="text-sm font-inter text-muted">
              {filteredHotels.length} hotel
              {filteredHotels.length !== 1 ? "s" : ""} found
            </p>
          )}

          <div className="flex items-center gap-1 bg-surface border border-gold/10 rounded-xl p-1 ml-auto">
            <button
              onClick={() => setViewMode("grid")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-inter transition-all duration-200 ${
                viewMode === "grid"
                  ? "bg-gold text-white"
                  : "text-muted hover:text-ink"
              }`}
            >
              <LayoutGrid size={15} />
              Grid
            </button>
            <button
              onClick={() => setViewMode("map")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-inter transition-all duration-200 ${
                viewMode === "map"
                  ? "bg-gold text-white"
                  : "text-muted hover:text-ink"
              }`}
            >
              <MapIcon size={15} />
              Map
            </button>
          </div>
        </div>

        {error && <p className="text-danger text-center py-10">{error}</p>}

        {/* Loading Skeleton */}
        {loading && viewMode === "grid" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        )}

        {loading && viewMode === "map" && (
          <div className="h-130 rounded-2xl bg-gold/10 animate-pulse flex items-center justify-center">
            <p className="text-muted text-sm">Loading map...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredHotels.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="bg-gold/10 rounded-full p-5 mb-5">
              <SearchX size={36} className="text-gold-dark" />
            </div>
            <h3 className="font-display text-xl text-ink mb-2">
              No hotels found
            </h3>
            <p className="text-sm text-muted max-w-sm">
              Try adjusting your search, city, price range, star rating, or
              amenities to find more results.
            </p>
          </div>
        )}

        {/* GRID VIEW */}
        {!loading &&
          !error &&
          viewMode === "grid" &&
          filteredHotels.length > 0 && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
                {visibleHotels.map((hotel, i) => {
                  const lowestPrice = getLowestPrice(hotel);
                  return (
                    <motion.div
                      key={hotel.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.4,
                        delay: (i % PAGE_SIZE) * 0.06,
                      }}
                      whileHover={{ y: -4 }}
                    >
                      <Link
                        to={`/hotels/${hotel.id}`}
                        className="block bg-surface rounded-2xl border border-gold/10 shadow-sm hover:shadow-xl hover:border-gold/30 transition-all duration-300 overflow-hidden group"
                      >
                        <div className="h-48 relative overflow-hidden">
                          <img
                            src={
                              fallbackImages[hotel.id % fallbackImages.length]
                            }
                            alt={hotel.name}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-all duration-500" />
                          <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm rounded-full p-2">
                            <BedDouble size={16} className="text-gold-dark" />
                          </div>
                          {/* NEW: wishlist heart toggle */}
                          <button
                            onClick={(e) => handleToggleWishlist(e, hotel.id)}
                            disabled={togglingId === hotel.id}
                            className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full p-2 hover:bg-white transition-colors disabled:opacity-60"
                            style={{
                              // shift down if a star badge is also present, so they don't overlap
                              top: hotel.star_rating ? "3.25rem" : "0.75rem",
                            }}
                          >
                            <Heart
                              size={16}
                              className={
                                wishlistedIds.has(hotel.id)
                                  ? "text-danger"
                                  : "text-gold-dark"
                              }
                              fill={
                                wishlistedIds.has(hotel.id)
                                  ? "currentColor"
                                  : "none"
                              }
                            />
                          </button>
                          {hotel.star_rating && (
                            <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-2.5 py-1 flex items-center gap-1">
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
                          <h2 className="font-display text-lg text-ink">
                            {hotel.name}
                          </h2>
                          <p className="flex items-center gap-1 text-sm text-muted mt-1.5">
                            <MapPin size={14} className="text-gold-dark" />
                            {hotel.city}, {hotel.address}
                          </p>
                          <p className="text-sm text-muted mt-3 line-clamp-2">
                            {hotel.description || "No description available."}
                          </p>
                          <div className="flex items-center justify-between mt-4 pt-3 border-t border-ink/5">
                            <span className="text-xs text-muted">
                              {hotel.rooms?.length || 0} room type(s)
                            </span>
                            <span className="text-xs font-medium text-gold-dark group-hover:translate-x-1 transition-transform">
                              View details →
                            </span>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>

              {/* Load More */}
              {hasMore && (
                <div className="flex justify-center mt-12">
                  <button
                    onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
                    className="px-8 py-3 rounded-full border border-gold/30 text-gold-dark font-inter text-sm hover:bg-gold hover:text-white hover:border-gold transition-all duration-300"
                  >
                    Load More Hotels
                  </button>
                </div>
              )}
            </>
          )}

        {/* MAP VIEW */}
        {!loading &&
          !error &&
          viewMode === "map" &&
          filteredHotels.length > 0 && (
            <div className="rounded-2xl overflow-hidden border border-gold/10 shadow-sm">
              {mappableHotels.length === 0 ? (
                <div className="h-130 bg-gold/10 flex flex-col items-center justify-center gap-2 text-center px-6">
                  <MapIcon size={28} className="text-gold-dark" />
                  <p className="text-muted text-sm max-w-sm">
                    None of the currently filtered hotels have saved coordinates
                    yet. Once hotel locations are geocoded on the backend, pins
                    will show up here.
                  </p>
                </div>
              ) : (
                <MapContainer
                  center={mapCenter}
                  zoom={DEFAULT_ZOOM}
                  scrollWheelZoom={true}
                  style={{ height: "520px", width: "100%" }}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  {mappableHotels.map((hotel) => {
                    const lowestPrice = getLowestPrice(hotel);
                    return (
                      <Marker
                        key={hotel.id}
                        position={[
                          Number(hotel.latitude),
                          Number(hotel.longitude),
                        ]}
                      >
                        <Popup>
                          <div className="text-sm">
                            <strong>{hotel.name}</strong>
                            <br />
                            {hotel.city}
                            <br />
                            {lowestPrice !== Infinity && (
                              <span>
                                PKR {lowestPrice.toLocaleString()} / night
                              </span>
                            )}
                            <br />
                            <Link
                              to={`/hotels/${hotel.id}`}
                              className="text-gold-dark underline"
                            >
                              View details
                            </Link>
                          </div>
                        </Popup>
                      </Marker>
                    );
                  })}
                </MapContainer>
              )}
            </div>
          )}
      </div>
    </div>
  );
};

export default Hotels;
