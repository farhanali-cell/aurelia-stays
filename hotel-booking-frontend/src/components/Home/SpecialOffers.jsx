import { motion } from "framer-motion";
import { ArrowRight, Percent, CalendarCheck } from "lucide-react";
import { Link } from "react-router-dom";

const offers = [
  {
    id: 1,
    title: "Summer Escape",
    discount: "20% OFF",
    description:
      "Enjoy luxury stays with exclusive summer discounts and premium services.",
    image:
      "https://images.unsplash.com/photo-1601918774946-25832a4be0d6?q=80&w=1200&auto=format&fit=crop",
    expiry: "Valid until August 31",
  },

  {
    id: 2,
    title: "Weekend Getaway",
    discount: "15% OFF",
    description: "Relax and recharge with our special weekend packages.",
    image:
      "https://images.unsplash.com/photo-1540541338287-41700207dee6?q=80&w=1200&auto=format&fit=crop",
    expiry: "Limited Time Offer",
  },

  {
    id: 3,
    title: "Luxury Honeymoon Package",
    discount: "25% OFF",
    description:
      "Create unforgettable memories with our romantic luxury stays.",
    image:
      "https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=1200&auto=format&fit=crop",
    expiry: "Special Couple Deal",
  },
];

const SpecialOffers = () => {
  return (
    <section className="bg-neutral-900 py-24 px-6 lg:px-10">
      <div className="max-w-7xl mx-auto">
        {/* Heading */}

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
            Exclusive Deals
          </span>

          <h2
            className="
font-fraunces
text-4xl
md:text-5xl
text-white
mt-4
"
          >
            Special Offers
          </h2>

          <p
            className="
font-inter
text-white/60
max-w-xl
mx-auto
mt-4
"
          >
            Save more on luxury stays with our limited time offers.
          </p>
        </div>

        <div
          className="
grid
grid-cols-1
md:grid-cols-3
gap-8
"
        >
          {offers.map((offer, index) => (
            <motion.div
              key={offer.id}
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
                delay: index * 0.15,
              }}
              className="
relative
rounded-3xl
overflow-hidden
h-[420px]
group
"
            >
              <img
                src={offer.image}
                alt={offer.title}
                className="
w-full
h-full
object-cover
transition
duration-700
group-hover:scale-110
"
              />

              <div
                className="
absolute
inset-0
bg-linear-to-t
from-black
via-black/40
to-transparent
"
              />

              <div
                className="
absolute
top-6
right-6
bg-gold
text-white
px-4
py-2
rounded-full
font-inter
text-sm
font-semibold
flex
items-center
gap-2
"
              >
                <Percent size={15} />

                {offer.discount}
              </div>

              <div
                className="
absolute
bottom-0
p-7
text-white
"
              >
                <h3
                  className="
font-fraunces
text-3xl
"
                >
                  {offer.title}
                </h3>

                <p
                  className="
font-inter
text-white/70
text-sm
mt-3
"
                >
                  {offer.description}
                </p>

                <div
                  className="
flex
items-center
gap-2
text-gold
text-xs
font-inter
mt-4
"
                >
                  <CalendarCheck size={14} />

                  {offer.expiry}
                </div>

                <Link
                  to="/hotels"
                  className="
inline-flex
items-center
gap-2
mt-6
bg-gold
px-5
py-2.5
rounded-full
text-sm
font-inter
hover:bg-gold/90
transition
"
                >
                  Book Now
                  <ArrowRight size={15} />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SpecialOffers;
