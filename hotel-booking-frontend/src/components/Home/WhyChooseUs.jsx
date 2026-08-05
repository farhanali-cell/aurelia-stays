import { motion } from "framer-motion";
import { ShieldCheck, CreditCard, Headphones, BadgeCheck } from "lucide-react";

const features = [
  {
    id: 1,
    title: "Verified Luxury Hotels",
    description:
      "Every property is carefully selected and verified to provide a premium stay experience.",
    icon: BadgeCheck,
  },

  {
    id: 2,
    title: "Secure Payments",
    description:
      "Your payments are protected with secure and trusted payment solutions.",
    icon: CreditCard,
  },

  {
    id: 3,
    title: "24/7 Customer Support",
    description:
      "Our support team is always available whenever you need assistance.",
    icon: Headphones,
  },

  {
    id: 4,
    title: "Safe & Reliable Booking",
    description:
      "Enjoy a smooth booking process with complete transparency and confidence.",
    icon: ShieldCheck,
  },
];

const WhyChooseUs = () => {
  return (
    <section className="bg-parchment py-24 px-6 lg:px-10">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span
            className="
font-inter
text-sm
tracking-[0.3em]
uppercase
text-gold
"
          >
            Why Aurelia
          </span>

          <h2
            className="
font-fraunces
text-4xl
md:text-5xl
text-neutral-900
mt-4
"
          >
            Why Choose Us
          </h2>

          <p
            className="
font-inter
text-neutral-500
max-w-xl
mx-auto
mt-4
"
          >
            We combine luxury, comfort and technology to make every journey
            memorable.
          </p>
        </div>

        <div
          className="
grid
grid-cols-1
sm:grid-cols-2
lg:grid-cols-4
gap-8
"
        >
          {features.map((item, index) => {
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
bg-white
rounded-3xl
p-7
text-center
shadow-sm
hover:shadow-xl
hover:-translate-y-2
transition-all
duration-300
"
              >
                <div
                  className="
w-14
h-14
mx-auto
rounded-2xl
bg-gold/10
flex
items-center
justify-center
text-gold
mb-5
"
                >
                  <Icon size={28} />
                </div>

                <h3
                  className="
font-fraunces
text-xl
text-neutral-900
"
                >
                  {item.title}
                </h3>

                <p
                  className="
font-inter
text-sm
text-neutral-500
leading-relaxed
mt-3
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

export default WhyChooseUs;
