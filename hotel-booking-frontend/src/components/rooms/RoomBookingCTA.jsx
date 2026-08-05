import { motion } from "framer-motion";
import { CalendarCheck } from "lucide-react";

const RoomBookingCTA = () => {
  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background Image */}
      <img
        src="https://images.unsplash.com/photo-1591088398332-8a7791972843?q=80&w=1920&auto=format&fit=crop"
        alt="Luxury Hotel Room"
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
        bg-black/65
      "
      />

      {/* Content */}
      <motion.div
        initial={{
          opacity: 0,
          y: 50,
        }}
        whileInView={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.8,
        }}
        viewport={{
          once: true,
        }}
        className="
          relative
          z-10
          max-w-4xl
          mx-auto
          px-6
          text-center
        "
      >
        {/* Icon */}

        <div
          className="
          mx-auto
          w-16
          h-16
          rounded-full
          bg-amber-500/20
          flex
          items-center
          justify-center
        "
        >
          <CalendarCheck size={32} className="text-amber-400" />
        </div>

        <h2
          className="
          mt-8
          text-4xl
          md:text-6xl
          font-bold
          text-white
          leading-tight
        "
        >
          Find Your Perfect Room
          <span className="text-amber-400"> Today</span>
        </h2>

        <p
          className="
          mt-6
          text-gray-200
          text-lg
          md:text-xl
          leading-8
          max-w-2xl
          mx-auto
        "
        >
          Reserve your luxury accommodation at Aurelia Stays and enjoy comfort,
          elegance, and unforgettable hospitality.
        </p>

        <motion.button
          whileHover={{
            scale: 1.05,
          }}
          whileTap={{
            scale: 0.95,
          }}
          className="
            mt-10
            bg-amber-500
            hover:bg-amber-600
            text-white
            font-semibold
            px-10
            py-4
            rounded-xl
            shadow-xl
            transition-all
            duration-300
            inline-flex
            items-center
            gap-3
          "
        >
          Book Your Room
          <CalendarCheck size={20} />
        </motion.button>
      </motion.div>
    </section>
  );
};

export default RoomBookingCTA;
