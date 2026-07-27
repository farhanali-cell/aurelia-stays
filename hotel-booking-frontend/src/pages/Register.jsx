import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import Divider from '../components/Divider';

const Register = () => {
  const [formData, setFormData] = useState({ username: '', email: '', password: '', phone: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(formData);
      setSuccess(true);
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      const data = err.response?.data;
      if (data && typeof data === 'object') {
        const firstKey = Object.keys(data)[0];
        setError(`${firstKey}: ${data[firstKey]}`);
      } else {
        setError('Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-parchment px-4 py-10">
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
        <h2 className="font-display text-2xl text-ink text-center mt-3">Create Account</h2>
        <div className="flex justify-center"><Divider /></div>

        {error && <div className="bg-danger/10 text-danger text-sm rounded-lg px-4 py-2 mb-4">{error}</div>}
        {success && <div className="bg-success/10 text-success text-sm rounded-lg px-4 py-2 mb-4">Account created! Redirecting to login...</div>}

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div>
            <label className="block text-sm font-medium text-muted mb-1">Username</label>
            <input type="text" name="username" value={formData.username} onChange={handleChange} required
              className="w-full px-4 py-2.5 border border-ink/10 rounded-lg bg-parchment/40 focus:outline-none focus:ring-2 focus:ring-gold focus:border-gold transition" />
          </div>
          <div>
            <label className="block text-sm font-medium text-muted mb-1">Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required
              className="w-full px-4 py-2.5 border border-ink/10 rounded-lg bg-parchment/40 focus:outline-none focus:ring-2 focus:ring-gold focus:border-gold transition" />
          </div>
          <div>
            <label className="block text-sm font-medium text-muted mb-1">Phone</label>
            <input type="text" name="phone" value={formData.phone} onChange={handleChange}
              className="w-full px-4 py-2.5 border border-ink/10 rounded-lg bg-parchment/40 focus:outline-none focus:ring-2 focus:ring-gold focus:border-gold transition" />
          </div>
          <div>
            <label className="block text-sm font-medium text-muted mb-1">Password</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} required
              className="w-full px-4 py-2.5 border border-ink/10 rounded-lg bg-parchment/40 focus:outline-none focus:ring-2 focus:ring-gold focus:border-gold transition" />
          </div>
          <button type="submit" disabled={loading}
            className="w-full bg-ink text-parchment py-2.5 rounded-lg font-medium hover:bg-gold-dark hover:text-ink transition-all active:scale-95 disabled:opacity-50">
            {loading ? 'Creating account...' : 'Register'}
          </button>
        </form>

        <p className="text-sm text-muted text-center mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-gold-dark font-medium hover:text-gold transition-colors">Login</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;