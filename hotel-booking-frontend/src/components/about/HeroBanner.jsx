import { motion } from "framer-motion";

const HeroBanner = () => {
  return (
    <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
      {/* Background */}
      <img
        src="https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1920&auto=format&fit=crop"
        alt="Luxury Hotel"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="relative z-10 text-center px-5"
      >
        <h1 className="text-white text-5xl md:text-6xl font-bold">
          About Aurelia Stays
        </h1>

        <p className="text-gray-200 mt-5 max-w-2xl mx-auto text-lg">
          Experience luxury hospitality, elegant comfort, and unforgettable
          memories crafted with passion.
        </p>

        <div className="mt-6 text-amber-400 font-medium tracking-wider">
          Home / About
        </div>
      </motion.div>
    </section>
  );
};

export default HeroBanner;
