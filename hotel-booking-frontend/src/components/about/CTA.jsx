import { motion } from "framer-motion";

const CTA = () => {
  return (
    <section className="relative py-24 overflow-x-hidden">
      {/* Background Image */}
      <img
        src="https://images.unsplash.com/photo-1601918774946-25832a4be0d6?q=80&w=1920&auto=format&fit=crop"
        alt="Luxury Hotel"
        className="absolute top-0 left-0 w-full h-full object-cover"
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
        <span
          className="
          inline-block
          px-5
          py-2
          rounded-full
          bg-amber-500/20
          text-amber-400
          font-semibold
          uppercase
          tracking-wider
          text-sm
        "
        >
          Experience Luxury
        </span>

        <h2
          className="
          mt-6
          text-4xl
          md:text-6xl
          font-bold
          text-white
          leading-tight
        "
        >
          Ready For Your
          <span className="text-amber-400"> Next Stay?</span>
        </h2>

        <p
          className="
          mt-6
          text-gray-200
          text-lg
          md:text-xl
          leading-8
        "
        >
          Book your unforgettable experience with Aurelia Stays and enjoy
          luxury, comfort, and exceptional hospitality.
        </p>

        {/* Button */}

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
          "
        >
          Book Your Stay
        </motion.button>
      </motion.div>
    </section>
  );
};

export default CTA;
