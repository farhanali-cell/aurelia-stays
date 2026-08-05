import { motion } from "framer-motion";

const BookingHero = () => {
  return (
    <section
      className="
      relative
      h-[55vh]
      flex
      items-center
      justify-center
      overflow-hidden
    "
    >
      {/* Background */}

      <img
        src="https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1920&auto=format&fit=crop"
        alt="Hotel Booking"
        className="
          absolute
          top-0
          left-0
          w-full
          h-full
          object-cover
        "
      />

      {/* Overlay */}

      <div
        className="
        absolute
        inset-0
        bg-black/60
      "
      />

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
          Complete Your Booking
        </h1>

        <p
          className="
          mt-5
          text-gray-200
          text-lg
          max-w-2xl
          mx-auto
        "
        >
          Reserve your luxury stay at Aurelia Stays with a simple and secure
          booking process.
        </p>

        <div
          className="
          mt-6
          text-amber-400
          font-medium
        "
        >
          Home / Booking
        </div>
      </motion.div>
    </section>
  );
};

export default BookingHero;
