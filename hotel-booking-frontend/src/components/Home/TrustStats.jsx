import { motion } from "framer-motion";
import { Users, Building2, Star, Headphones } from "lucide-react";

const stats = [
  {
    id: 1,
    title: "Happy Guests",
    value: "50K+",
    icon: Users,
    description: "Travelers served worldwide",
  },

  {
    id: 2,
    title: "Luxury Hotels",
    value: "1200+",
    icon: Building2,
    description: "Premium verified properties",
  },

  {
    id: 3,
    title: "Guest Rating",
    value: "4.9/5",
    icon: Star,
    description: "Based on customer reviews",
  },

  {
    id: 4,
    title: "Support",
    value: "24/7",
    icon: Headphones,
    description: "Always here for you",
  },
];

const TrustStats = () => {
  return (
    <section
      className="
bg-neutral-900
py-20
px-6
lg:px-10
"
    >
      <div
        className="
max-w-7xl
mx-auto
"
      >
        <div
          className="
grid
grid-cols-1
sm:grid-cols-2
lg:grid-cols-4
gap-8
"
        >
          {stats.map((item, index) => {
            const Icon = item.icon;

            return (
              <motion.div
                key={item.id}
                initial={{
                  opacity: 0,
                  y: 30,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                viewport={{
                  once: true,
                }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.1,
                }}
                className="
text-center
text-white
border
border-white/10
rounded-3xl
p-8
hover:border-gold/40
transition
"
              >
                <div
                  className="
w-14
h-14
mx-auto
rounded-full
bg-gold/10
flex
items-center
justify-center
text-gold
mb-5
"
                >
                  <Icon size={26} />
                </div>

                <h3
                  className="
font-fraunces
text-4xl
text-gold
"
                >
                  {item.value}
                </h3>

                <p
                  className="
font-inter
text-lg
mt-2
"
                >
                  {item.title}
                </p>

                <p
                  className="
font-inter
text-sm
text-white/50
mt-2
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

export default TrustStats;
