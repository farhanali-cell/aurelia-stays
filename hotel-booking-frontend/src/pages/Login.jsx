import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import Divider from "../components/Divider";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const loggedInUser = await login(username, password);
      if (loggedInUser.is_superuser || loggedInUser.is_staff) {
        navigate("/admin/dashboard");
      } else {
        navigate("/");
      }
    } catch (err) {
      setError(
        err.response?.data?.detail || "Login failed. Check your credentials.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-parchment px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-surface rounded-2xl shadow-lg shadow-ink/5 border border-gold/10 p-8 w-full max-w-md"
      >
        <div className="text-center mb-2">
          <span className="w-12 h-12 mx-auto rounded-full border border-gold/50 flex items-center justify-center font-display text-gold text-xl">
            A
          </span>
        </div>
        <h2 className="font-display text-2xl text-ink text-center mt-3">
          Welcome Back
        </h2>
        <div className="flex justify-center">
          <Divider />
        </div>

        {error && (
          <div className="bg-danger/10 text-danger text-sm rounded-lg px-4 py-2 mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div>
            <label className="block text-sm font-medium text-muted mb-1">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full px-4 py-2.5 border border-ink/10 rounded-lg bg-parchment/40 focus:outline-none focus:ring-2 focus:ring-gold focus:border-gold transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-muted mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2.5 border border-ink/10 rounded-lg bg-parchment/40 focus:outline-none focus:ring-2 focus:ring-gold focus:border-gold transition"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-ink text-parchment py-2.5 rounded-lg font-medium hover:bg-gold-dark hover:text-ink transition-all active:scale-95 disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-sm text-muted text-center mt-6">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-gold-dark font-medium hover:text-gold transition-colors"
          >
            Register
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
