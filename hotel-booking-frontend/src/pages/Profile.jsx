import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

const STATUS_STYLES = {
  confirmed: {
    bg: "bg-[#EAF1EC]",
    text: "text-[color:var(--color-success)]",
    label: "Confirmed",
  },
  pending: {
    bg: "bg-[#FBF2E2]",
    text: "text-[color:var(--color-gold-dark)]",
    label: "Pending",
  },
  cancelled: {
    bg: "bg-[#F6E7E2]",
    text: "text-[color:var(--color-danger)]",
    label: "Cancelled",
  },
};

function getHotelName(booking) {
  return (
    booking?.room?.hotel?.name ||
    booking?.room?.hotel_name ||
    booking?.hotel?.name ||
    booking?.hotel_name ||
    booking?.room_details?.hotel?.name ||
    "Hotel"
  );
}

function getRoomName(booking) {
  return (
    booking?.room?.room_type ||
    booking?.room?.name ||
    booking?.room_details?.room_type ||
    booking?.room_name ||
    null
  );
}

function formatDate(dateStr) {
  if (!dateStr) return "—";
  try {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return dateStr;
  }
}

function BookingCard({ booking }) {
  const status = (booking.status || "pending").toLowerCase();
  const style = STATUS_STYLES[status] || STATUS_STYLES.pending;
  const hotelName = getHotelName(booking);
  const roomName = getRoomName(booking);

  return (
    <div className="bg-surface border border-[#E7DFCF] rounded-2xl p-6 shadow-sm flex flex-col gap-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-display text-xl text-ink">{hotelName}</h3>
          {roomName && <p className="text-sm text-muted mt-1">{roomName}</p>}
        </div>
        <span
          className={`text-xs font-medium px-3 py-1 rounded-full whitespace-nowrap ${style.bg} ${style.text}`}
        >
          {style.label}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-muted">Check-in</p>
          <p className="text-ink font-medium">
            {formatDate(booking.check_in_date)}
          </p>
        </div>
        <div>
          <p className="text-muted">Check-out</p>
          <p className="text-ink font-medium">
            {formatDate(booking.check_out_date)}
          </p>
        </div>
      </div>

      {booking.total_price && (
        <div className="text-sm">
          <span className="text-muted">Total: </span>
          <span className="text-ink font-medium">
            PKR {Number(booking.total_price).toLocaleString()}
          </span>
        </div>
      )}

      <div className="pt-2 border-t border-[#EFE8D8] flex gap-3">
        {status === "pending" && (
          <Link
            to={`/payment/${booking.id}`}
            className="text-sm font-medium px-4 py-2 rounded-lg bg-gold text-white hover:bg-gold-dark transition"
          >
            Complete payment
          </Link>
        )}
        {status === "confirmed" && (
          <Link
            to="/reviews"
            className="text-sm font-medium px-4 py-2 rounded-lg border border-gold text-gold-dark hover:bg-[#FBF2E2] transition"
          >
            Write a review
          </Link>
        )}
      </div>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="bg-surface border border-[#E7DFCF] rounded-2xl p-6 animate-pulse space-y-4">
      <div className="h-5 w-1/2 bg-[#EFE8D8] rounded" />
      <div className="grid grid-cols-2 gap-4">
        <div className="h-4 w-full bg-[#EFE8D8] rounded" />
        <div className="h-4 w-full bg-[#EFE8D8] rounded" />
      </div>
      <div className="h-4 w-1/3 bg-[#EFE8D8] rounded" />
    </div>
  );
}

export default function Profile() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const fetchBookings = async () => {
      try {
        const res = await api.get("/bookings/");
        if (!cancelled) {
          setBookings(
            Array.isArray(res.data) ? res.data : res.data.results || [],
          );
        }
      } catch (err) {
        if (!cancelled) {
          setError("Failed to load your bookings.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchBookings();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="min-h-screen bg-parchment">
      <div className="max-w-5xl mx-auto px-6 py-16">
        <div className="mb-10">
          <h1 className="font-display text-4xl text-ink">My bookings</h1>
          {user?.email && <p className="text-muted mt-2">{user.email}</p>}
        </div>

        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        )}

        {!loading && error && (
          <div className="text-center py-16">
            <p className="text-danger">{error}</p>
          </div>
        )}

        {!loading && !error && bookings.length === 0 && (
          <div className="text-center py-24">
            <h2 className="font-display text-2xl text-ink mb-2">
              No bookings yet
            </h2>
            <p className="text-muted mb-6">
              Start exploring hotels and book your next stay.
            </p>
            <Link
              to="/hotels"
              className="inline-block text-sm font-medium px-5 py-2.5 rounded-lg bg-gold text-white hover:bg-gold-dark transition"
            >
              Browse hotels
            </Link>
          </div>
        )}

        {!loading && !error && bookings.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {bookings.map((b) => (
              <BookingCard key={b.id} booking={b} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
