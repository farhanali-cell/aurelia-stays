import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Building2,
  BedDouble,
  CalendarCheck,
  Wallet,
  PieChart as PieChartIcon,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import api from "../api/axios";
import PageBanner from "../components/PageBanner";

// Consistent color mapping per status, echoing the same palette used
// elsewhere in the app (gold for confirmed, muted ink for pending, etc.)
const STATUS_COLORS = {
  pending: "#9C9284",
  confirmed: "#C9A227",
  completed: "#4B4237",
  cancelled: "#B94A48",
};

const StatCard = ({ icon: Icon, label, value, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay }}
    className="bg-surface rounded-2xl border border-gold/10 shadow-sm p-6 flex items-center gap-4"
  >
    <div className="bg-gold/10 rounded-xl p-3">
      <Icon size={22} className="text-gold-dark" />
    </div>
    <div>
      <p className="text-2xl font-display text-ink">{value}</p>
      <p className="text-xs font-inter text-muted uppercase tracking-wide mt-0.5">
        {label}
      </p>
    </div>
  </motion.div>
);

const SkeletonBlock = ({ className }) => (
  <div className={`bg-ink/10 rounded-2xl animate-pulse ${className}`} />
);

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get("/bookings/admin/stats/");
        setStats(res.data);
      } catch (err) {
        if (err.response?.status === 403) {
          setError("You don't have permission to view this dashboard.");
        } else {
          setError("Failed to load dashboard statistics. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const pieData =
    stats?.bookings_by_status?.map((entry) => ({
      name: entry.status.charAt(0).toUpperCase() + entry.status.slice(1),
      value: entry.count,
      status: entry.status,
    })) || [];

  return (
    <div className="min-h-screen bg-parchment">
      <PageBanner
        subtitle="Overview"
        title="Admin Dashboard"
        image="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1920&auto=format&fit=crop"
      />

      <div className="max-w-6xl mx-auto px-4 py-16">
        {error && (
          <div className="bg-danger/10 border border-danger/20 rounded-2xl p-6 text-center text-danger font-inter text-sm">
            {error}
          </div>
        )}

        {loading && !error && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {Array.from({ length: 4 }).map((_, i) => (
                <SkeletonBlock key={i} className="h-24" />
              ))}
            </div>
            <SkeletonBlock className="h-96" />
          </>
        )}

        {!loading && !error && stats && (
          <>
            {/* Stat cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
              <StatCard
                icon={Building2}
                label="Total Hotels"
                value={stats.total_hotels}
                delay={0}
              />
              <StatCard
                icon={BedDouble}
                label="Total Rooms"
                value={stats.total_rooms}
                delay={0.06}
              />
              <StatCard
                icon={CalendarCheck}
                label="Total Bookings"
                value={stats.total_bookings}
                delay={0.12}
              />
              <StatCard
                icon={Wallet}
                label="Total Revenue"
                value={`PKR ${Number(stats.total_revenue).toLocaleString()}`}
                delay={0.18}
              />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Pie chart: bookings by status */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.24 }}
                className="bg-surface rounded-2xl border border-gold/10 shadow-sm p-6"
              >
                <div className="flex items-center gap-2 mb-6">
                  <PieChartIcon size={18} className="text-gold-dark" />
                  <h3 className="font-display text-lg text-ink">
                    Bookings by Status
                  </h3>
                </div>

                {pieData.length === 0 ? (
                  <p className="text-sm text-muted text-center py-16">
                    No bookings yet.
                  </p>
                ) : (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={pieData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={3}
                      >
                        {pieData.map((entry) => (
                          <Cell
                            key={entry.status}
                            fill={STATUS_COLORS[entry.status] || "#C9A227"}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          borderRadius: "12px",
                          border: "1px solid rgba(201,162,39,0.2)",
                          fontFamily: "Inter, sans-serif",
                          fontSize: "13px",
                        }}
                      />
                      <Legend
                        wrapperStyle={{
                          fontFamily: "Inter, sans-serif",
                          fontSize: "13px",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </motion.div>

              {/* Bar chart: same data, absolute counts (clearer for small differences) */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 }}
                className="bg-surface rounded-2xl border border-gold/10 shadow-sm p-6"
              >
                <h3 className="font-display text-lg text-ink mb-6">
                  Booking Counts
                </h3>

                {pieData.length === 0 ? (
                  <p className="text-sm text-muted text-center py-16">
                    No bookings yet.
                  </p>
                ) : (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={pieData}>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="rgba(0,0,0,0.05)"
                      />
                      <XAxis
                        dataKey="name"
                        tick={{ fontFamily: "Inter, sans-serif", fontSize: 12 }}
                      />
                      <YAxis
                        allowDecimals={false}
                        tick={{ fontFamily: "Inter, sans-serif", fontSize: 12 }}
                      />
                      <Tooltip
                        contentStyle={{
                          borderRadius: "12px",
                          border: "1px solid rgba(201,162,39,0.2)",
                          fontFamily: "Inter, sans-serif",
                          fontSize: "13px",
                        }}
                      />
                      <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                        {pieData.map((entry) => (
                          <Cell
                            key={entry.status}
                            fill={STATUS_COLORS[entry.status] || "#C9A227"}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </motion.div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
