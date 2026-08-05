import { motion } from "framer-motion";
import {
  Wifi,
  Tv,
  Snowflake,
  Coffee,
  Bath,
  Dumbbell,
  Car,
  ShieldCheck,
} from "lucide-react";

const amenities = [
  {
    icon: Wifi,
    title: "High Speed WiFi",
    description:
      "Enjoy fast and reliable internet access throughout your stay.",
  },

  {
    icon: Tv,
    title: "Smart TV",
    description: "Relax with premium entertainment and streaming options.",
  },

  {
    icon: Snowflake,
    title: "Air Conditioning",
    description: "Maintain your perfect room temperature with modern AC.",
  },

  {
    icon: Coffee,
    title: "Breakfast Included",
    description: "Start your morning with delicious complimentary breakfast.",
  },

  {
    icon: Bath,
    title: "Luxury Bathroom",
    description: "Modern bathroom with premium toiletries and facilities.",
  },

  {
    icon: Dumbbell,
    title: "Fitness Center",
    description: "Access our fully equipped gym during your stay.",
  },

  {
    icon: Car,
    title: "Parking",
    description: "Secure parking space available for hotel guests.",
  },

  {
    icon: ShieldCheck,
    title: "24/7 Security",
    description: "Your comfort and safety are our top priorities.",
  },
];

const RoomDetailAmenities = () => {
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
            Room Amenities
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
            Everything For A
            <span className="text-amber-500"> Comfortable Stay</span>
          </h2>

          <p
            className="
            mt-5
            text-gray-600
            text-lg
            leading-8
          "
          >
            Our rooms are equipped with modern facilities designed to provide
            maximum comfort and luxury.
          </p>
        </motion.div>

        {/* Amenities Cards */}

        <div
          className="
          mt-16
          grid
          sm:grid-cols-2
          lg:grid-cols-4
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
                  y: 40,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.1,
                }}
                viewport={{
                  once: true,
                }}
                whileHover={{
                  y: -8,
                }}
                className="
                  group
                  bg-gray-50
                  rounded-3xl
                  p-7
                  hover:shadow-xl
                  border
                  border-transparent
                  hover:border-amber-200
                  transition-all
                  duration-300
                "
              >
                {/* Icon */}

                <div
                  className="
                  w-14
                  h-14
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
                    size={28}
                    className="
                      text-amber-500
                      group-hover:text-white
                      transition
                    "
                  />
                </div>

                <h3
                  className="
                  mt-5
                  text-xl
                  font-bold
                  text-gray-900
                "
                >
                  {item.title}
                </h3>

                <p
                  className="
                  mt-3
                  text-gray-600
                  text-sm
                  leading-6
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

export default RoomDetailAmenities;
