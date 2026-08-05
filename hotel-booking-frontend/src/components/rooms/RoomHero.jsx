import { motion } from "framer-motion";

const RoomHero = () => {
  return (
    <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
      {/* Background */}
      <img
        src="https://images.unsplash.com/photo-1618773928121-c32242e63f39?q=80&w=1920&auto=format&fit=crop"
        alt="Luxury Room"
        className="absolute top-0 left-0 w-full h-full object-cover"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Content */}
      <motion.div
        initial={{
          opacity: 0,
          y: 40,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.8,
        }}
        className="
        relative
        z-10
        text-center
        px-6
        "
      >
        <h1
          className="
          text-5xl
          md:text-6xl
          font-bold
          text-white
        "
        >
          Our Luxury Rooms
        </h1>

        <p
          className="
          mt-5
          max-w-2xl
          mx-auto
          text-gray-200
          text-lg
        "
        >
          Discover beautifully designed rooms and suites created for comfort,
          relaxation, and unforgettable stays.
        </p>

        <div
          className="
          mt-6
          text-amber-400
          font-medium
          tracking-wide
        "
        >
          Home / Rooms
        </div>
      </motion.div>
    </section>
  );
};

export default RoomHero;
