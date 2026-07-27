// src/pages/Hotels.jsx
import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, BedDouble, Search, ArrowUpDown, SlidersHorizontal, SearchX } from 'lucide-react';
import api from '../api/axios';
import PageBanner from '../components/PageBanner';

const fallbackImages = [
  'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1618773928121-c32242e63f39?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?q=80&w=800&auto=format&fit=crop',
];

const MAX_PRICE = 50000;
const PAGE_SIZE = 6;

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
      <div className="h-3 bg-ink/10 rounded w-full" />
      <div className="h-3 bg-ink/10 rounded w-3/4" />
    </div>
  </div>
);

const Hotels = () => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState('All');
  const [sortOrder, setSortOrder] = useState('default');
  const [maxPrice, setMaxPrice] = useState(MAX_PRICE);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const res = await api.get('/hotels/');
        setHotels(res.data);
      } catch (err) {
        setError('Failed to load hotels. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchHotels();
  }, []);

  const cities = useMemo(() => {
    const unique = [...new Set(hotels.map((h) => h.city).filter(Boolean))];
    return ['All', ...unique];
  }, [hotels]);

  const filteredHotels = useMemo(() => {
    let result = hotels.filter((hotel) => {
      const matchesCity = selectedCity === 'All' || hotel.city === selectedCity;
      const matchesSearch = hotel.name?.toLowerCase().includes(searchTerm.toLowerCase());
      const price = getLowestPrice(hotel);
      const matchesPrice = price === Infinity || price <= maxPrice;
      return matchesCity && matchesSearch && matchesPrice;
    });

    if (sortOrder === 'low-high') {
      result = [...result].sort((a, b) => getLowestPrice(a) - getLowestPrice(b));
    } else if (sortOrder === 'high-low') {
      result = [...result].sort((a, b) => getLowestPrice(b) - getLowestPrice(a));
    }

    return result;
  }, [hotels, selectedCity, searchTerm, sortOrder, maxPrice]);

  // Reset pagination whenever filters change
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [searchTerm, selectedCity, sortOrder, maxPrice]);

  const visibleHotels = filteredHotels.slice(0, visibleCount);
  const hasMore = visibleCount < filteredHotels.length;

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
                onClick={() => setSelectedCity(city)}
                className={`px-4 py-2 rounded-xl text-sm font-inter transition-all duration-300 ${
                  selectedCity === city
                    ? 'bg-gold text-white'
                    : 'bg-parchment text-ink hover:bg-gold/10 border border-gold/10'
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
        </div>

        {/* Price Range Slider */}
        <div className="flex items-center gap-4 bg-surface p-4 rounded-2xl border border-gold/10 shadow-sm mb-4">
          <SlidersHorizontal size={16} className="text-gold-dark shrink-0" />
          <span className="text-sm font-inter text-muted whitespace-nowrap">Max Price:</span>
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

        {/* Result count */}
        {!loading && !error && (
          <p className="text-sm font-inter text-muted mb-8">
            {filteredHotels.length} hotel{filteredHotels.length !== 1 ? 's' : ''} found
          </p>
        )}

        {error && <p className="text-danger text-center py-10">{error}</p>}

        {/* Loading Skeleton */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredHotels.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="bg-gold/10 rounded-full p-5 mb-5">
              <SearchX size={36} className="text-gold-dark" />
            </div>
            <h3 className="font-display text-xl text-ink mb-2">No hotels found</h3>
            <p className="text-sm text-muted max-w-sm">
              Try adjusting your search, city, or price range to find more results.
            </p>
          </div>
        )}

        {/* Hotel Grid */}
        {!loading && !error && filteredHotels.length > 0 && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
              {visibleHotels.map((hotel, i) => {
                const lowestPrice = getLowestPrice(hotel);
                return (
                  <motion.div
                    key={hotel.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: (i % PAGE_SIZE) * 0.06 }}
                    whileHover={{ y: -4 }}
                  >
                    <Link
                      to={`/hotels/${hotel.id}`}
                      className="block bg-surface rounded-2xl border border-gold/10 shadow-sm hover:shadow-xl hover:border-gold/30 transition-all duration-300 overflow-hidden group"
                    >
                      <div className="h-48 relative overflow-hidden">
                        <img
                          src={fallbackImages[hotel.id % fallbackImages.length]}
                          alt={hotel.name}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-all duration-500" />
                        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm rounded-full p-2">
                          <BedDouble size={16} className="text-gold-dark" />
                        </div>
                        {lowestPrice !== Infinity && (
                          <div className="absolute bottom-3 right-3 bg-gold text-white text-sm font-inter font-semibold px-3 py-1.5 rounded-full shadow-md">
                            PKR {lowestPrice.toLocaleString()} / night
                          </div>
                        )}
                      </div>
                      <div className="p-5">
                        <h2 className="font-display text-lg text-ink">{hotel.name}</h2>
                        <p className="flex items-center gap-1 text-sm text-muted mt-1.5">
                          <MapPin size={14} className="text-gold-dark" />
                          {hotel.city}, {hotel.address}
                        </p>
                        <p className="text-sm text-muted mt-3 line-clamp-2">
                          {hotel.description || 'No description available.'}
                        </p>
                        <div className="flex items-center justify-between mt-4 pt-3 border-t border-ink/5">
                          <span className="text-xs text-muted">{hotel.rooms?.length || 0} room type(s)</span>
                          <span className="text-xs font-medium text-gold-dark group-hover:translate-x-1 transition-transform">View details →</span>
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
      </div>
    </div>
  );
};

export default Hotels;