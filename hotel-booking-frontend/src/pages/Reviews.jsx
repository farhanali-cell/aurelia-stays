// src/pages/Reviews.jsx
import { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Star,
  Search,
  ArrowUpDown,
  MessageSquareText,
  Pencil,
  Trash2,
  X,
  SearchX,
  Quote,
} from 'lucide-react';
import api from '../api/axios';
import PageBanner from '../components/PageBanner';
import { useAuth } from '../context/AuthContext';

const PAGE_SIZE = 6;

const avatarPalette = [
  'bg-gold/15 text-gold-dark',
  'bg-ink/10 text-ink',
  'bg-danger/10 text-danger',
];

const getInitials = (name = '') =>
  name
    .trim()
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join('') || 'G';

const timeAgo = (dateStr) => {
  if (!dateStr) return '';
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days <= 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 30) return `${days} days ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months} month${months > 1 ? 's' : ''} ago`;
  const years = Math.floor(months / 12);
  return `${years} year${years > 1 ? 's' : ''} ago`;
};

// Tries several possible shapes of the booking's room/hotel data
// so this works regardless of exactly how BookingSerializer nests things.
const bookingLabel = (booking) => {
  const hotelName =
    booking.room?.hotel?.name ||
    booking.room_detail?.hotel?.name ||
    booking.hotel_name ||
    'Hotel';
  const roomType =
    booking.room?.room_type ||
    booking.room_detail?.room_type ||
    booking.room_type ||
    '';
  const checkIn = booking.check_in_date;
  return `${hotelName}${roomType ? ` — ${roomType}` : ''}${checkIn ? ` (${checkIn})` : ''}`;
};

const StarRow = ({ rating = 0, size = 15 }) => (
  <div className="flex items-center gap-0.5">
    {[1, 2, 3, 4, 5].map((n) => (
      <Star
        key={n}
        size={size}
        className={n <= Math.round(rating) ? 'text-gold fill-gold' : 'text-ink/15 fill-ink/15'}
      />
    ))}
  </div>
);

const StarPicker = ({ value, onChange }) => {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          type="button"
          key={n}
          onClick={() => onChange(n)}
          onMouseEnter={() => setHovered(n)}
          onMouseLeave={() => setHovered(0)}
          className="p-0.5"
        >
          <Star
            size={26}
            className={
              n <= (hovered || value)
                ? 'text-gold fill-gold transition-colors'
                : 'text-ink/15 fill-ink/15 transition-colors'
            }
          />
        </button>
      ))}
    </div>
  );
};

const SkeletonCard = () => (
  <div className="bg-surface rounded-2xl border border-gold/10 p-5 animate-pulse">
    <div className="flex items-center gap-3 mb-4">
      <div className="h-10 w-10 rounded-full bg-ink/10" />
      <div className="space-y-2">
        <div className="h-3 bg-ink/10 rounded w-28" />
        <div className="h-2.5 bg-ink/10 rounded w-20" />
      </div>
    </div>
    <div className="h-3 bg-ink/10 rounded w-full mb-2" />
    <div className="h-3 bg-ink/10 rounded w-4/5" />
  </div>
);

const emptyForm = { booking: '', rating: 0, comment: '' };

const Reviews = () => {
  const { user } = useAuth?.() || {};

  const [reviews, setReviews] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [myBookings, setMyBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedHotel, setSelectedHotel] = useState('All');
  const [sortOrder, setSortOrder] = useState('newest');
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  const fetchData = async () => {
    try {
      const [reviewsRes, hotelsRes, bookingsRes] = await Promise.all([
        api.get('/reviews/'),
        api.get('/hotels/'),
        api.get('/bookings/bookings/'),
      ]);
      setReviews(reviewsRes.data);
      setHotels(hotelsRes.data);
      setMyBookings(bookingsRes.data);
    } catch (err) {
      setError('Failed to load reviews. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const hotelName = (review) =>
    review.hotel_name || review.hotel?.name || 'Unknown Hotel';

  const reviewerName = (review) =>
    review.user_name || review.user?.name || 'Guest';

  const hotelNames = useMemo(() => {
    const names = [...new Set(hotels.map((h) => h.name).filter(Boolean))];
    return ['All', ...names];
  }, [hotels]);

  // Bookings that are confirmed AND not already reviewed
  const reviewableBookings = useMemo(() => {
    const reviewedBookingIds = new Set(reviews.map((r) => r.booking?.id ?? r.booking));
    return myBookings.filter(
      (b) => b.status === 'confirmed' && !reviewedBookingIds.has(b.id)
    );
  }, [myBookings, reviews]);

  const filteredReviews = useMemo(() => {
    let result = reviews.filter((r) => {
      const matchesHotel = selectedHotel === 'All' || hotelName(r) === selectedHotel;
      const term = searchTerm.toLowerCase();
      const matchesSearch =
        !term ||
        r.comment?.toLowerCase().includes(term) ||
        hotelName(r).toLowerCase().includes(term) ||
        reviewerName(r).toLowerCase().includes(term);
      return matchesHotel && matchesSearch;
    });

    if (sortOrder === 'newest') {
      result = [...result].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    } else if (sortOrder === 'oldest') {
      result = [...result].sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    } else if (sortOrder === 'high-low') {
      result = [...result].sort((a, b) => b.rating - a.rating);
    } else if (sortOrder === 'low-high') {
      result = [...result].sort((a, b) => a.rating - b.rating);
    }

    return result;
  }, [reviews, selectedHotel, searchTerm, sortOrder, hotels]);

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [searchTerm, selectedHotel, sortOrder]);

  const visibleReviews = filteredReviews.slice(0, visibleCount);
  const hasMore = visibleCount < filteredReviews.length;

  const totalReviews = reviews.length;
  const averageRating = totalReviews
    ? reviews.reduce((sum, r) => sum + Number(r.rating || 0), 0) / totalReviews
    : 0;
  const breakdown = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => Math.round(r.rating) === star).length,
  }));

  const openWriteForm = () => {
    setEditingId(null);
    setForm({ booking: reviewableBookings[0]?.id || '', rating: 0, comment: '' });
    setFormError('');
    setFormOpen(true);
  };

  const openEditForm = (review) => {
    setEditingId(review.id);
    setForm({
      booking: review.booking?.id || review.booking || '',
      rating: review.rating,
      comment: review.comment,
    });
    setFormError('');
    setFormOpen(true);
  };

  const closeForm = () => {
    setFormOpen(false);
    setForm(emptyForm);
    setEditingId(null);
    setFormError('');
  };

  const submitForm = async (e) => {
    e.preventDefault();
    if (!form.booking) return setFormError('Please choose a booking to review.');
    if (!form.rating) return setFormError('Please select a star rating.');
    if (!form.comment.trim()) return setFormError('Please write a comment.');

    setSubmitting(true);
    setFormError('');
    try {
      if (editingId) {
        await api.patch(`/reviews/${editingId}/`, {
          rating: form.rating,
          comment: form.comment,
        });
      } else {
        await api.post('/reviews/', {
          booking: form.booking,
          rating: form.rating,
          comment: form.comment,
        });
      }
      await fetchData();
      closeForm();
    } catch (err) {
      const backendMsg =
        err?.response?.data &&
        Object.values(err.response.data).flat().join(' ');
      setFormError(backendMsg || 'Something went wrong while saving your review.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/reviews/${id}/`);
      setReviews((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      setError('Failed to delete review. Please try again.');
    } finally {
      setConfirmDeleteId(null);
    }
  };

  return (
    <div className="min-h-screen bg-parchment">
      <PageBanner
        subtitle="In Their Words"
        title="Guest Reviews"
        image="https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=1920&auto=format&fit=crop"
      />

      <div className="max-w-6xl mx-auto px-4 py-16">
        {!loading && !error && totalReviews > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-surface rounded-2xl border border-gold/10 shadow-sm p-6 mb-8">
            <div className="flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-ink/5 pb-6 md:pb-0">
              <span className="font-display text-5xl text-ink">{averageRating.toFixed(1)}</span>
              <StarRow rating={averageRating} size={17} />
              <span className="text-xs text-muted font-inter mt-2">
                Based on {totalReviews} review{totalReviews !== 1 ? 's' : ''}
              </span>
            </div>

            <div className="md:col-span-2 flex flex-col justify-center gap-1.5">
              {breakdown.map(({ star, count }) => (
                <div key={star} className="flex items-center gap-3 text-sm font-inter">
                  <span className="w-10 text-muted shrink-0">{star} star</span>
                  <div className="flex-1 h-2 rounded-full bg-ink/5 overflow-hidden">
                    <div
                      className="h-full bg-gold rounded-full"
                      style={{ width: totalReviews ? `${(count / totalReviews) * 100}%` : '0%' }}
                    />
                  </div>
                  <span className="w-8 text-right text-muted">{count}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-4 mb-8 bg-surface p-4 rounded-2xl border border-gold/10 shadow-sm">
          <div className="flex items-center gap-2 flex-1 bg-parchment rounded-xl px-4 py-2.5 border border-gold/10">
            <Search size={18} className="text-gold-dark" />
            <input
              type="text"
              placeholder="Search reviews, hotels or guests..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent outline-none text-sm text-ink w-full font-inter placeholder:text-muted"
            />
          </div>

          <div className="flex items-center gap-2 bg-parchment rounded-xl px-4 py-2.5 border border-gold/10">
            <select
              value={selectedHotel}
              onChange={(e) => setSelectedHotel(e.target.value)}
              className="bg-transparent outline-none text-sm text-ink font-inter cursor-pointer max-w-40"
            >
              {hotelNames.map((name) => (
                <option key={name} value={name}>
                  {name === 'All' ? 'All Hotels' : name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2 bg-parchment rounded-xl px-4 py-2.5 border border-gold/10">
            <ArrowUpDown size={16} className="text-gold-dark" />
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="bg-transparent outline-none text-sm text-ink font-inter cursor-pointer"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="high-low">Rating: High to Low</option>
              <option value="low-high">Rating: Low to High</option>
            </select>
          </div>

          <button
            onClick={openWriteForm}
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gold text-white text-sm font-inter font-semibold hover:bg-gold-dark transition-all duration-300 whitespace-nowrap"
          >
            <MessageSquareText size={16} />
            Write a Review
          </button>
        </div>

        {!loading && !error && (
          <p className="text-sm font-inter text-muted mb-8 -mt-4">
            {filteredReviews.length} review{filteredReviews.length !== 1 ? 's' : ''} shown
          </p>
        )}

        {error && <p className="text-danger text-center py-10">{error}</p>}

        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        )}

        {!loading && !error && filteredReviews.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="bg-gold/10 rounded-full p-5 mb-5">
              <SearchX size={36} className="text-gold-dark" />
            </div>
            <h3 className="font-display text-xl text-ink mb-2">No reviews found</h3>
            <p className="text-sm text-muted max-w-sm">
              Try adjusting your search, hotel filter, or be the first to share your experience.
            </p>
          </div>
        )}

        {!loading && !error && filteredReviews.length > 0 && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
              {visibleReviews.map((review, i) => {
                const mine = user && (review.user_id === user.id || review.user?.id === user.id);
                const palette = avatarPalette[review.id % avatarPalette.length];
                const isConfirming = confirmDeleteId === review.id;

                return (
                  <motion.div
                    key={review.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: (i % PAGE_SIZE) * 0.06 }}
                    whileHover={{ y: -4 }}
                    className="relative bg-surface rounded-2xl border border-gold/10 shadow-sm hover:shadow-xl hover:border-gold/30 transition-all duration-300 p-5 flex flex-col"
                  >
                    <Quote size={40} className="absolute top-4 right-4 text-gold/10" />

                    <div className="flex items-center gap-3 mb-4">
                      <div className={`h-10 w-10 rounded-full flex items-center justify-center font-display text-sm shrink-0 ${palette}`}>
                        {getInitials(reviewerName(review))}
                      </div>
                      <div className="min-w-0">
                        <p className="font-inter font-semibold text-sm text-ink truncate">
                          {reviewerName(review)}
                        </p>
                        <p className="text-xs text-muted truncate">{hotelName(review)}</p>
                      </div>
                    </div>

                    <StarRow rating={review.rating} />

                    <p className="text-sm text-ink/80 font-inter mt-3 leading-relaxed flex-1">
                      {review.comment}
                    </p>

                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-ink/5">
                      <span className="text-xs text-muted">{timeAgo(review.created_at)}</span>

                      {mine && (
                        <div className="flex items-center gap-1">
                          {isConfirming ? (
                            <>
                              <button
                                onClick={() => handleDelete(review.id)}
                                className="text-xs font-inter font-semibold text-danger px-2 py-1 rounded-lg hover:bg-danger/10 transition-colors"
                              >
                                Confirm
                              </button>
                              <button
                                onClick={() => setConfirmDeleteId(null)}
                                className="text-xs font-inter text-muted px-2 py-1 rounded-lg hover:bg-ink/5 transition-colors"
                              >
                                Cancel
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => openEditForm(review)}
                                className="p-1.5 rounded-lg text-muted hover:text-gold-dark hover:bg-gold/10 transition-colors"
                                aria-label="Edit review"
                              >
                                <Pencil size={14} />
                              </button>
                              <button
                                onClick={() => setConfirmDeleteId(review.id)}
                                className="p-1.5 rounded-lg text-muted hover:text-danger hover:bg-danger/10 transition-colors"
                                aria-label="Delete review"
                              >
                                <Trash2 size={14} />
                              </button>
                            </>
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
                  Load More Reviews
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <AnimatePresence>
        {formOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-ink/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={closeForm}
          >
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.97 }}
              transition={{ duration: 0.25 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-surface rounded-2xl border border-gold/10 shadow-xl w-full max-w-md p-6"
            >
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-display text-xl text-ink">
                  {editingId ? 'Edit Your Review' : 'Write a Review'}
                </h3>
                <button
                  onClick={closeForm}
                  className="p-1.5 rounded-lg text-muted hover:bg-ink/5 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={submitForm} className="space-y-5">
                <div>
                  <label className="text-xs font-inter font-semibold text-muted uppercase tracking-wide">
                    Booking
                  </label>
                  <select
                    value={form.booking}
                    disabled={!!editingId}
                    onChange={(e) => setForm((f) => ({ ...f, booking: e.target.value }))}
                    className="mt-1.5 w-full bg-parchment border border-gold/10 rounded-xl px-4 py-2.5 text-sm font-inter text-ink outline-none disabled:opacity-60"
                  >
                    <option value="">Select a booking</option>
                    {reviewableBookings.map((b) => (
                      <option key={b.id} value={b.id}>
                        {bookingLabel(b)}
                      </option>
                    ))}
                  </select>
                  {!editingId && reviewableBookings.length === 0 && (
                    <p className="text-xs text-muted mt-1.5">
                      No confirmed bookings available to review yet.
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-xs font-inter font-semibold text-muted uppercase tracking-wide">
                    Your Rating
                  </label>
                  <div className="mt-2">
                    <StarPicker value={form.rating} onChange={(r) => setForm((f) => ({ ...f, rating: r }))} />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-inter font-semibold text-muted uppercase tracking-wide">
                    Your Comment
                  </label>
                  <textarea
                    rows={4}
                    value={form.comment}
                    onChange={(e) => setForm((f) => ({ ...f, comment: e.target.value }))}
                    placeholder="Share details of your own experience at this hotel..."
                    className="mt-1.5 w-full bg-parchment border border-gold/10 rounded-xl px-4 py-3 text-sm font-inter text-ink outline-none resize-none placeholder:text-muted"
                  />
                </div>

                {formError && <p className="text-sm text-danger font-inter">{formError}</p>}

                <div className="flex gap-3 pt-1">
                  <button
                    type="button"
                    onClick={closeForm}
                    className="flex-1 px-5 py-2.5 rounded-xl border border-gold/20 text-ink font-inter text-sm hover:bg-ink/5 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 px-5 py-2.5 rounded-xl bg-gold text-white font-inter text-sm font-semibold hover:bg-gold-dark transition-colors disabled:opacity-60"
                  >
                    {submitting ? 'Saving...' : editingId ? 'Save Changes' : 'Submit Review'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Reviews;