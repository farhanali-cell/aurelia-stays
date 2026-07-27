import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, Calendar, Home } from 'lucide-react';
import api from '../api/axios';
import Divider from '../components/Divider';

const BookingConfirmation = () => {
  const { bookingId } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const res = await api.get('/bookings/bookings/');
        const current = res.data.find((b) => b.id === parseInt(bookingId));
        setBooking(current);
      } catch (err) {
        setError('Could not load booking details.');
      } finally {
        setLoading(false);
      }
    };
    fetchBooking();
  }, [bookingId]);

  return (
    <div className="min-h-screen bg-parchment">
      <div className="max-w-md mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="bg-surface rounded-2xl border border-gold/10 shadow-lg shadow-ink/5 p-8 text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="flex justify-center mb-4"
          >
            <CheckCircle2 size={56} className="text-success" />
          </motion.div>

          <h1 className="font-display text-2xl text-ink">Booking Confirmed</h1>
          <div className="flex justify-center"><Divider /></div>
          <p className="text-muted text-sm mb-6">Your payment was successful and your stay is reserved.</p>

          {loading && <p className="text-muted text-sm">Loading details...</p>}
          {error && <p className="text-danger text-sm">{error}</p>}

          {booking && (
            <div className="bg-parchment/60 border border-gold/10 rounded-xl p-4 text-left space-y-2 mb-6">
              <p className="flex items-center gap-2 text-sm text-ink/80">
                <Calendar size={16} className="text-gold-dark" />
                Check-in: <span className="font-medium">{booking.check_in_date}</span>
              </p>
              <p className="flex items-center gap-2 text-sm text-ink/80">
                <Calendar size={16} className="text-gold-dark" />
                Check-out: <span className="font-medium">{booking.check_out_date}</span>
              </p>
              <p className="text-sm text-ink/80">
                Status: <span className="font-medium capitalize text-success">{booking.status}</span>
              </p>
            </div>
          )}

          <Link
            to="/hotels"
            className="inline-flex items-center gap-2 bg-ink text-parchment px-6 py-2.5 rounded-lg font-medium hover:bg-gold-dark hover:text-ink transition-all active:scale-95"
          >
            <Home size={16} />
            Back to Hotels
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default BookingConfirmation;