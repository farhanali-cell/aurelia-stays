import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BedDouble, Users, Wifi, ArrowLeft } from 'lucide-react';
import api from '../api/axios';
import Divider from '../components/Divider';

const HotelDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [hotel, setHotel] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [bookingRoomId, setBookingRoomId] = useState(null);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [bookingError, setBookingError] = useState('');
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const hotelsRes = await api.get('/hotels/');
        const currentHotel = hotelsRes.data.find((h) => h.id === parseInt(id));
        setHotel(currentHotel);
        const roomsRes = await api.get(`/hotels/${id}/rooms/`);
        setRooms(roomsRes.data);
      } catch (err) {
        setError('Failed to load hotel details.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleBooking = async (roomId) => {
    setBookingError('');
    if (!checkIn || !checkOut) {
      setBookingError('Please select both check-in and check-out dates.');
      return;
    }
    setBookingLoading(true);
    try {
      const res = await api.post('/bookings/bookings/', {
        room: roomId,
        check_in_date: checkIn,
        check_out_date: checkOut,
      });
      navigate(`/payment/${res.data.id}`);
    } catch (err) {
      const data = err.response?.data;
      setBookingError(data ? JSON.stringify(data) : 'Booking failed. Please try again.');
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-parchment">
        <p className="text-center text-muted mt-10">Loading hotel details...</p>
      </div>
    );
  }

  if (error || !hotel) {
    return (
      <div className="min-h-screen bg-parchment">
        <Navbar />
        <p className="text-center text-danger mt-10">{error || 'Hotel not found.'}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-parchment">
      <div className="max-w-5xl mx-auto px-4 py-10">
        <button
          onClick={() => navigate('/hotels')}
          className="flex items-center gap-1 text-muted hover:text-gold-dark transition mb-6 text-sm"
        >
          <ArrowLeft size={16} /> Back to Hotels
        </button>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-surface rounded-2xl border border-gold/10 shadow-sm p-6 mb-8"
        >
          <p className="text-gold-dark text-xs tracking-[0.2em] uppercase font-medium">Property</p>
          <h1 className="font-display text-3xl text-ink mt-1">{hotel.name}</h1>
          <p className="flex items-center gap-1 text-muted mt-2 text-sm">{hotel.city}, {hotel.address}</p>
          <p className="text-ink/80 mt-4 leading-relaxed">{hotel.description}</p>
        </motion.div>

        <h2 className="font-display text-xl text-ink mb-1">Available Rooms</h2>
        <Divider />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          {rooms.map((room, i) => (
            <motion.div
              key={room.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              className="bg-surface rounded-2xl border border-gold/10 shadow-sm hover:shadow-lg hover:border-gold/30 transition-all p-5"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-display text-lg text-ink capitalize flex items-center gap-2">
                  <BedDouble size={18} className="text-gold-dark" /> {room.room_type}
                </h3>
                <span className="text-gold-dark font-semibold">${room.price_per_night}<span className="text-muted text-xs font-normal">/night</span></span>
              </div>

              <p className="flex items-center gap-1 text-sm text-muted mt-2">
                <Users size={14} /> Capacity: {room.capacity}
              </p>

              {room.amenities && (
                <p className="flex items-center gap-1 text-sm text-muted mt-1">
                  <Wifi size={14} /> {room.amenities}
                </p>
              )}

              {!room.is_available ? (
                <p className="text-danger text-sm mt-4 font-medium">Not available</p>
              ) : bookingRoomId === room.id ? (
                <div className="mt-4 space-y-3">
                  <div className="flex gap-2">
                    <input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)}
                      className="flex-1 border border-ink/10 rounded-lg px-2 py-1.5 text-sm bg-parchment/40 focus:outline-none focus:ring-2 focus:ring-gold" />
                    <input type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)}
                      className="flex-1 border border-ink/10 rounded-lg px-2 py-1.5 text-sm bg-parchment/40 focus:outline-none focus:ring-2 focus:ring-gold" />
                  </div>
                  {bookingError && <p className="text-danger text-xs">{bookingError}</p>}
                  <button
                    onClick={() => handleBooking(room.id)}
                    disabled={bookingLoading}
                    className="w-full bg-ink text-parchment py-2 rounded-lg text-sm font-medium hover:bg-gold-dark hover:text-ink transition-all active:scale-95 disabled:opacity-50"
                  >
                    {bookingLoading ? 'Booking...' : 'Confirm Booking'}
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setBookingRoomId(room.id)}
                  className="w-full mt-4 bg-ink text-parchment py-2 rounded-lg text-sm font-medium hover:bg-gold-dark hover:text-ink transition-all active:scale-95"
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