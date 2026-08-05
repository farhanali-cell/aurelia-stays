import { motion } from "framer-motion";
import { Wifi, Car, Coffee, Tv, Snowflake, BellRing } from "lucide-react";

const amenities = [
  {
    icon: Wifi,
    title: "Free WiFi",
    description:
      "High-speed internet access available in every room and hotel area.",
  },
  {
    icon: Car,
    title: "Free Parking",
    description: "Secure parking facilities available for all our guests.",
  },
  {
    icon: Coffee,
    title: "Breakfast Included",
    description: "Start your day with delicious premium breakfast options.",
  },
  {
    icon: BellRing,
    title: "24/7 Room Service",
    description:
      "Our professional staff is always available whenever you need.",
  },
  {
    icon: Snowflake,
    title: "Air Conditioning",
    description: "Enjoy perfect room temperature with modern cooling systems.",
  },
  {
    icon: Tv,
    title: "Smart Entertainment",
    description: "Relax with smart TVs and premium entertainment options.",
  },
];

const RoomAmenities = () => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Heading */}
        <motion.div
          initial={{
            opacity: 0,
            y: 40,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.7,
          }}
          viewport={{
            once: true,
          }}
          className="text-center max-w-3xl mx-auto"
        >
          <span
            className="
            inline-block
            px-4
            py-2
            rounded-full
            bg-amber-100
            text-amber-700
            text-sm
            font-semibold
            uppercase
            tracking-wider
          "
          >
            Room Facilities
          </span>

          <h2
            className="
            mt-6
            text-4xl
            md:text-5xl
            font-bold
            text-gray-900
          "
          >
            Everything You Need For A
            <span className="text-amber-500"> Perfect Stay</span>
          </h2>

          <p
            className="
            mt-5
            text-gray-600
            text-lg
            leading-8
          "
          >
            We provide modern facilities and premium services to make your stay
            comfortable and memorable.
          </p>
        </motion.div>

        {/* Cards */}
        <div
          className="
          mt-16
          grid
          sm:grid-cols-2
          lg:grid-cols-3
          gap-8
        "
        >
          {amenities.map((item, index) => {
            const Icon = item.icon;

            return (
              <motion.div
                key={item.title}
                initial={{
                  opacity: 0,
                  y: 50,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.12,
                }}
                viewport={{
                  once: true,
                }}
                whileHover={{
                  y: -10,
                }}
                className="
                  group
                  bg-gray-50
                  rounded-3xl
                  p-8
                  border
                  border-transparent
                  hover:border-amber-200
                  hover:shadow-xl
                  transition-all
                  duration-300
                "
              >
                {/* Icon */}

                <div
                  className="
                  w-16
                  h-16
                  rounded-2xl
                  bg-amber-100
                  flex
                  items-center
                  justify-center
                  group-hover:bg-amber-500
                  transition-all
                  duration-300
                "
                >
                  <Icon
                    size={30}
                    className="
                      text-amber-500
                      group-hover:text-white
                      transition
                    "
                  />
                </div>

                <h3
                  className="
                  mt-6
                  text-2xl
                  font-bold
                  text-gray-900
                "
                >
                  {item.title}
                </h3>

                <p
                  className="
                  mt-4
                  text-gray-600
                  leading-7
                "
                >
                  {item.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default RoomAmenities;
