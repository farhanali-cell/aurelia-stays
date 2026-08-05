import { motion } from "framer-motion";
import { Users, BedDouble, CalendarDays, Star } from "lucide-react";

const stats = [
  {
    icon: Users,
    number: "500+",
    title: "Happy Guests",
    description: "Guests served with premium hospitality",
  },
  {
    icon: BedDouble,
    number: "120",
    title: "Luxury Rooms",
    description: "Beautifully designed accommodations",
  },
  {
    icon: CalendarDays,
    number: "15+",
    title: "Years Experience",
    description: "Delivering exceptional stays",
  },
  {
    icon: Star,
    number: "4.9",
    title: "Guest Rating",
    description: "Average customer satisfaction score",
  },
];

const Stats = () => {
  return (
    <section className="py-20 bg-gray-900 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute inset-0 bg-linear-to-r from-amber-500/10 via-transparent to-amber-500/10" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="inline-block px-4 py-2 rounded-full bg-amber-500/20 text-amber-400 text-sm font-semibold uppercase tracking-wider">
            Our Achievements
          </span>

          <h2 className="mt-6 text-4xl md:text-5xl font-bold text-white">
            Numbers That Define
            <span className="text-amber-400"> Excellence</span>
          </h2>

          <p className="mt-5 text-gray-300 max-w-2xl mx-auto">
            Our commitment towards luxury, comfort, and outstanding guest
            experiences speaks through our achievements.
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((item, index) => {
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
                  delay: index * 0.15,
                }}
                viewport={{
                  once: true,
                }}
                whileHover={{
                  y: -10,
                }}
                className="
                bg-white/10 
                backdrop-blur-lg
                border border-white/20
                rounded-3xl
                p-8
                text-center
                hover:bg-white/20
                transition-all
                duration-300
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
                  <Icon size={30} className="text-amber-400" />
                </div>

                {/* Number */}
                <h3
                  className="
                  mt-6
                  text-4xl
                  font-bold
                  text-white
                "
                >
                  {item.number}
                </h3>

                {/* Title */}
                <h4
                  className="
                  mt-3
                  text-xl
                  font-semibold
                  text-amber-400
                "
                >
                  {item.title}
                </h4>

                {/* Description */}
                <p
                  className="
                  mt-3
                  text-gray-300
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

export default Stats;
