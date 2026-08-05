import { motion } from "framer-motion";
import { BedDouble, UtensilsCrossed, Waves, Wifi } from "lucide-react";

const features = [
  {
    icon: BedDouble,
    title: "Luxury Rooms",
    description:
      "Experience spacious suites with elegant interiors, premium bedding, and breathtaking views.",
  },
  {
    icon: UtensilsCrossed,
    title: "Fine Dining",
    description:
      "Enjoy delicious international cuisine prepared by expert chefs in a luxurious atmosphere.",
  },
  {
    icon: Waves,
    title: "Infinity Pool",
    description:
      "Relax in our stunning swimming pool designed for ultimate comfort and unforgettable moments.",
  },
  {
    icon: Wifi,
    title: "Free High-Speed WiFi",
    description:
      "Stay connected with complimentary high-speed internet available throughout the property.",
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: (index) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      delay: index * 0.15,
    },
  }),
};

const WhyChooseUs = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto"
        >
          <span className="inline-block px-4 py-2 rounded-full bg-amber-100 text-amber-700 font-semibold uppercase tracking-wider text-sm">
            Why Choose Us
          </span>

          <h2 className="mt-6 text-4xl lg:text-5xl font-bold text-gray-900">
            Luxury Hospitality
            <span className="text-amber-500"> Beyond Expectations</span>
          </h2>

          <p className="mt-6 text-lg text-gray-600 leading-8">
            Every detail at Aurelia Stays is designed to provide comfort,
            elegance, and unforgettable experiences for every guest.
          </p>
        </motion.div>

        {/* Feature Cards */}
        <div className="grid gap-8 mt-16 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <motion.div
                key={feature.title}
                custom={index}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                whileHover={{
                  y: -10,
                  scale: 1.03,
                }}
                className="group bg-white rounded-3xl p-8 shadow-md hover:shadow-2xl transition-all duration-300 border border-transparent hover:border-amber-200 cursor-pointer"
              >
                {/* Icon */}
                <div className="w-16 h-16 rounded-2xl bg-amber-100 flex items-center justify-center transition-all duration-300 group-hover:bg-gradient-to-br group-hover:from-amber-500 group-hover:to-yellow-400">
                  <Icon
                    size={30}
                    className="text-amber-600 transition-colors duration-300 group-hover:text-white"
                  />
                </div>

                {/* Title */}
                <h3 className="mt-6 text-2xl font-semibold text-gray-900">
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="mt-4 text-gray-600 leading-7">
                  {feature.description}
                </p>

                {/* Decorative Line */}
                <div className="mt-8 h-1 w-12 rounded-full bg-amber-400 transition-all duration-300 group-hover:w-20" />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
