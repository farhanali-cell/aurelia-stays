import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Hotels from './pages/Hotels';
import HotelDetail from './pages/HotelDetail';
import Payment from './pages/Payment';
import BookingConfirmation from './pages/BookingConfirmation';
import Footer from './components/Footer';
import Reviews from './pages/Reviews';
import Profile from './pages/Profile';
import MyBookings from './pages/MyBookings';

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/hotels" element={<Hotels />} />
        <Route path="/hotels/:id" element={<HotelDetail />} />
        <Route path="/payment/:bookingId" element={<Payment />} />
        <Route path="/booking-confirmation/:bookingId" element={<BookingConfirmation />} />
        <Route path="/reviews" element={<Reviews />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/my-bookings" element={<MyBookings />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;