// src/components/PageBanner.jsx
import { motion } from 'framer-motion';

const PageBanner = ({ subtitle, title, image }) => {
  return (
    <section className="relative h-[60vh] w-full overflow-hidden flex items-center justify-center">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url('${image}')` }}
      />
      <div className="absolute inset-0 bg-linear-to-b from-black/60 via-black/50 to-black/70" />

      <div className="relative z-10 text-center px-6">
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="font-inter text-sm tracking-[0.3em] text-gold uppercase"
        >
          {subtitle}
        </motion.span>
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-fraunces text-4xl md:text-6xl text-white mt-4"
        >
          {title}
        </motion.h1>
      </div>
    </section>
  );
};

export default PageBanner;