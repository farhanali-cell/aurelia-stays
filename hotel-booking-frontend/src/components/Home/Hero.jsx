import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import BookingSearch from "../BookingSearch";

const Hero = () => {
  return (
    <section className="relative min-h-[92vh] w-full overflow-hidden">

      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1920&auto=format&fit=crop')",
        }}
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-linear-to-b from-black/60 via-black/40 to-black/80" />


      {/* Content */}
      <div className="relative z-10 min-h-[92vh] flex flex-col items-center justify-center text-center px-6 pt-20">

        <motion.span
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: .6 }}
          className="font-inter text-sm tracking-[0.3em] text-gold uppercase mb-5"
        >
          Welcome to Aurelia Stays
        </motion.span>


        <motion.h1
          initial={{ opacity:0, y:30 }}
          animate={{ opacity:1, y:0 }}
          transition={{duration:.7}}
          className="font-fraunces text-5xl md:text-7xl text-white leading-tight max-w-4xl"
        >
          Where Luxury Meets{" "}
          <span className="italic text-gold">
            Serenity
          </span>
        </motion.h1>


        <motion.p
          initial={{opacity:0,y:20}}
          animate={{opacity:1,y:0}}
          transition={{duration:.7,delay:.2}}
          className="font-inter text-white/80 mt-6 max-w-xl text-base md:text-lg"
        >
          Discover handpicked luxury hotels, premium rooms and unforgettable
          experiences crafted specially for you.
        </motion.p>


        {/* Buttons */}
        <motion.div
          initial={{opacity:0,y:20}}
          animate={{opacity:1,y:0}}
          transition={{duration:.7,delay:.3}}
          className="mt-8 flex gap-4"
        >

          <Link
            to="/hotels"
            className="px-8 py-3.5 rounded-full bg-gold text-white font-inter text-sm hover:bg-gold/90 transition"
          >
            Explore Hotels
          </Link>


          <Link
            to="/register"
            className="px-8 py-3.5 rounded-full border border-white/40 text-white font-inter text-sm hover:bg-white/10 transition"
          >
            Create Account
          </Link>

        </motion.div>


        {/* Booking Search */}
        <motion.div
          initial={{opacity:0,y:40}}
          animate={{opacity:1,y:0}}
          transition={{duration:.8,delay:.5}}
          className="w-full max-w-5xl mt-14"
        >

          <BookingSearch />

        </motion.div>


      </div>

    </section>
  );
};


export default Hero;