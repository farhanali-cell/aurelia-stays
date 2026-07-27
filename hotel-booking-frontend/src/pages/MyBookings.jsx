import { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CalendarDays,
  MapPin,
  BedDouble,
  Moon,
  Ban,
  CheckCircle2,
  Clock,
  XCircle,
  SearchX,
} from 'lucide-react';
import api from '../api/axios';
import PageBanner from '../components/PageBanner';

const PAGE_SIZE = 6;

const fallbackImage =
  'https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=800&auto=format&fit=crop';

const statusConfig = {
  pending: { label: 'Pending', icon: Clock, classes: 'bg-ink/10 text-ink' },
  confirmed: { label: 'Confirmed', icon: CheckCircle2, classes: 'bg-gold/15 text-gold-dark' },
  completed: { label: 'Completed', icon: CheckCircle2, classes: 'bg-ink/5 text-muted' },
  cancelled: { label: 'Cancelled', icon: XCircle, classes: 'bg-danger/10 text-danger' },
};

const formatDate = (d) =>
  new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

const SkeletonCard = () => (
  <div className="bg-surface rounded-2xl border border-gold/10 overflow-hidden animate-pulse">
    <div className="h-40 bg-ink/10" />
    <div className="p-5 space-y-3">
      <div className="h-4 bg-ink/10 rounded w-2/3" />
      <div className="h-3 bg-ink/10 rounded w-1/2" />
      <div className="h-3 bg-ink/10 rounded w-full" />
    </div>
  </div>
);

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [confirmCancelId, setConfirmCancelId] = useState(null);
  const [cancellingId, setCancellingId] = useState(null);

  const fetchBookings = async () => {
    try {
      const res = await api.get('/bookings/');
      setBookings(res.data);
    } catch (err) {
      setError('Failed to load your bookings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const filters = ['All', 'pending', 'confirmed', 'completed', 'cancelled'];

  const filteredBookings = useMemo(() => {
    let result =
      statusFilter === 'All' ? bookings : bookings.filter((b) => b.status === statusFilter);
    result = [...result].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    return result;
  }, [bookings, statusFilter]);

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [statusFilter]);

  const visibleBookings = filteredBookings.slice(0, visibleCount);
  const hasMore = visibleCount < filteredBookings.length;

  const handleCancel = async (id) => {
    setCancellingId(id);
    try {
      await api.patch(`/bookings/${id}/cancel/`);
      setBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status: 'cancelled' } : b))
      );
    } catch (err) {
      setError('Failed to cancel booking. Please try again.');
    } finally {
      setCancellingId(null);
      setConfirmCancelId(null);
    }
  };

  return (
    <div className="min-h-screen bg-parchment">
      <PageBanner
        subtitle="Your Stays"
        title="My Bookings"
        image="https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1920&auto=format&fit=crop"
      />

      <div className="max-w-6xl mx-auto px-4 py-16">
        {/* Status filter tabs */}
        <div className="flex flex-wrap gap-2 mb-3 bg-surface p-3 rounded-2xl border border-gold/10 shadow-sm">
          {filters.map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 rounded-xl text-sm font-inter capitalize transition-all duration-300 ${
                statusFilter === status
                  ? 'bg-gold text-white'
                  : 'bg-parchment text-ink hover:bg-gold/10 border border-gold/10'
              }`}
            >
              {status === 'All' ? 'All Bookings' : status}
            </button>
          ))}
        </div>

        {!loading && !error && (
          <p className="text-sm font-inter text-muted mb-8">
            {filteredBookings.length} booking{filteredBookings.length !== 1 ? 's' : ''} found
          </p>
        )}

        {error && <p className="text-danger text-center py-10">{error}</p>}

        {/* Loading */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && filteredBookings.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="bg-gold/10 rounded-full p-5 mb-5">
              <SearchX size={36} className="text-gold-dark" />
            </div>
            <h3 className="font-display text-xl text-ink mb-2">No bookings found</h3>
            <p className="text-sm text-muted max-w-sm">
              {statusFilter === 'All'
                ? "You haven't made any bookings yet. Explore hotels and book your first stay."
                : `You don't have any ${statusFilter} bookings.`}
            </p>
          </div>
        )}

        {/* Bookings grid */}
        {!loading && !error && filteredBookings.length > 0 && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
              {visibleBookings.map((booking, i) => {
                const status = statusConfig[booking.status] || statusConfig.pending;
                const StatusIcon = status.icon;
                const canCancel = ['pending', 'confirmed'].includes(booking.status);
                const isConfirming = confirmCancelId === booking.id;

                return (
                  <motion.div
                    key={booking.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: (i % PAGE_SIZE) * 0.06 }}
                    whileHover={{ y: -4 }}
                    className="bg-surface rounded-2xl border border-gold/10 shadow-sm hover:shadow-xl hover:border-gold/30 transition-all duration-300 overflow-hidden"
                  >
                    <div className="h-40 relative overflow-hidden">
                      <img
                        src={booking.room_image || fallbackImage}
                        alt={booking.hotel_name}
                        className="w-full h-full object-cover"
                      />
                      <div
                        className={`absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-inter font-semibold backdrop-blur-sm ${status.classes}`}
                      >
                        <StatusIcon size={13} />
                        {status.label}
                      </div>
                      <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full p-2">
                        <BedDouble size={16} className="text-gold-dark" />
                      </div>
                    </div>

                    <div className="p-5">
                      <h2 className="font-display text-lg text-ink">{booking.hotel_name}</h2>
                      <p className="flex items-center gap-1 text-sm text-muted mt-1.5">
                        <MapPin size={14} className="text-gold-dark" />
                        {booking.hotel_city}
                      </p>
                      <p className="text-xs text-gold-dark font-inter font-semibold uppercase tracking-wide mt-2">
                        {booking.room_type} Room
                      </p>

                      <div className="flex items-center justify-between mt-4 pt-4 border-t border-ink/5">
                        <div className="flex items-center gap-1.5 text-xs text-muted">
                          <CalendarDays size={14} className="text-gold-dark" />
                          {formatDate(booking.check_in_date)} → {formatDate(booking.check_out_date)}
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-1.5 text-xs text-muted">
                          <Moon size={14} className="text-gold-dark" />
                          {booking.nights} night{booking.nights !== 1 ? 's' : ''}
                        </div>
                        <span className="font-inter font-semibold text-sm text-ink">
                          PKR {Number(booking.total_price).toLocaleString()}
                        </span>
                      </div>

                      {canCancel && (
                        <div className="mt-4 pt-4 border-t border-ink/5">
                          {isConfirming ? (
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleCancel(booking.id)}
                                disabled={cancellingId === booking.id}
                                className="flex-1 text-xs font-inter font-semibold text-white bg-danger px-3 py-2 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-60"
                              >
                                {cancellingId === booking.id ? 'Cancelling...' : 'Confirm Cancel'}
                              </button>
                              <button
                                onClick={() => setConfirmCancelId(null)}
                                className="flex-1 text-xs font-inter text-ink px-3 py-2 rounded-xl border border-ink/10 hover:bg-ink/5 transition-colors"
                              >
                                Keep Booking
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setConfirmCancelId(booking.id)}
                              className="w-full flex items-center justify-center gap-2 text-xs font-inter font-semibold text-danger px-3 py-2 rounded-xl border border-danger/20 hover:bg-danger/10 transition-colors"
                            >
                              <Ban size={13} />
                              Cancel Booking
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {hasMore && (
              <div className="flex justify-center mt-12">
                <button
                  onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
                  className="px-8 py-3 rounded-full border border-gold/30 text-gold-dark font-inter text-sm hover:bg-gold hover:text-white hover:border-gold transition-all duration-300"
                >
                  Load More Bookings
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default MyBookings;