// src/components/Hero.jsx
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section className="relative h-[92vh] w-full overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1920&auto=format&fit=crop')",
        }}
      />
      {/* Dark gradient overlay for text readability */}
      <div className="absolute inset-0 bg-linear-to-b from-black/50 via-black/40 to-black/70" />

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
        <motion.span
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="font-inter text-sm tracking-[0.3em] text-gold uppercase mb-4"
        >
          Welcome to Aurelia Stays
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="font-fraunces text-5xl md:text-7xl text-white leading-tight max-w-3xl"
        >
          Where Luxury Meets <span className="italic text-gold">Serenity</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="font-inter text-white/80 mt-6 max-w-xl text-base md:text-lg"
        >
          Handpicked hotels, curated stays, and an experience crafted just for you.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.45 }}
          className="mt-10 flex gap-4"
        >
          <Link
            to="/hotels"
            className="px-8 py-3.5 rounded-full bg-gold text-white font-inter text-sm tracking-wide hover:bg-gold/90 hover:shadow-lg hover:shadow-gold/30 transition-all duration-300"
          >
            Explore Hotels
          </Link>
          <Link
            to="/register"
            className="px-8 py-3.5 rounded-full border border-white/40 text-white font-inter text-sm tracking-wide hover:bg-white/10 transition-all duration-300"
          >
            Get Started
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;