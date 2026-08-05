import { motion } from "framer-motion";
import { Users, BedDouble, Maximize, Star } from "lucide-react";

const RoomInfo = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-3 gap-10">
          {/* Left Content */}

          <motion.div
            initial={{
              opacity: 0,
              x: -40,
            }}
            whileInView={{
              opacity: 1,
              x: 0,
            }}
            transition={{
              duration: 0.7,
            }}
            viewport={{
              once: true,
            }}
            className="lg:col-span-2"
          >
            {/* Rating */}

            <div
              className="
              flex
              items-center
              gap-2
              text-amber-500
            "
            >
              <Star size={20} fill="currentColor" />

              <span
                className="
                font-semibold
                text-gray-800
              "
              >
                4.9 Excellent
              </span>
            </div>

            <h1
              className="
              mt-5
              text-4xl
              md:text-5xl
              font-bold
              text-gray-900
            "
            >
              Deluxe Luxury Room
            </h1>

            <p
              className="
              mt-6
              text-gray-600
              leading-8
              text-lg
            "
            >
              Experience ultimate comfort in our beautifully designed deluxe
              room featuring elegant interiors, premium furniture, and modern
              facilities for a relaxing stay.
            </p>

            {/* Features */}

            <div
              className="
              mt-8
              grid
              sm:grid-cols-3
              gap-5
            "
            >
              <div
                className="
                bg-white
                rounded-2xl
                p-5
                shadow-sm
              "
              >
                <Users className="text-amber-500" size={28} />

                <p className="mt-3 font-semibold">2 Guests</p>
              </div>

              <div
                className="
                bg-white
                rounded-2xl
                p-5
                shadow-sm
              "
              >
                <BedDouble className="text-amber-500" size={28} />

                <p className="mt-3 font-semibold">King Bed</p>
              </div>

              <div
                className="
                bg-white
                rounded-2xl
                p-5
                shadow-sm
              "
              >
                <Maximize className="text-amber-500" size={28} />

                <p className="mt-3 font-semibold">45 m²</p>
              </div>
            </div>
          </motion.div>

          {/* Booking Card */}

          <motion.div
            initial={{
              opacity: 0,
              x: 40,
            }}
            whileInView={{
              opacity: 1,
              x: 0,
            }}
            transition={{
              duration: 0.7,
            }}
            viewport={{
              once: true,
            }}
            className="
              bg-white
              rounded-3xl
              p-8
              shadow-xl
              h-fit
            "
          >
            <p
              className="
              text-gray-500
              text-sm
            "
            >
              Starting From
            </p>

            <div
              className="
              mt-2
              text-4xl
              font-bold
              text-amber-500
            "
            >
              $180
              <span
                className="
                text-base
                text-gray-500
                font-normal
              "
              >
                /night
              </span>
            </div>

            <button
              className="
                mt-8
                w-full
                bg-amber-500
                hover:bg-amber-600
                text-white
                font-semibold
                py-4
                rounded-xl
                transition
                duration-300
              "
            >
              Book This Room
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default RoomInfo;
