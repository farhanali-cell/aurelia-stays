import { motion } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Emily Johnson",
    role: "Business Traveler",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=800&auto=format&fit=crop",
    review:
      "Aurelia Stays provided an amazing experience. The rooms were beautiful, staff was professional, and everything exceeded my expectations.",
  },

  {
    name: "James Wilson",
    role: "Frequent Guest",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop",
    review:
      "The perfect combination of luxury and comfort. Every visit feels special because of their excellent hospitality.Every visit feels special.",
  },

  {
    name: "Sophia Miller",
    role: "Holiday Traveler",
    image:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=800&auto=format&fit=crop",
    review:
      "Beautiful interiors, delicious food, and outstanding service. Highly recommended for a relaxing stay.Every visit feels special because of their excellent.",
  },
];

const TestimonialsPreview = () => {
  return (
    <section className="py-20 bg-gray-50">
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
          bg-amber-100
          text-amber-700
          px-4
          py-2
          rounded-full
          text-sm
          font-semibold
          uppercase
          tracking-wider
          "
          >
            Guest Reviews
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
            What Our Guests
            <span className="text-amber-500"> Say About Us</span>
          </h2>

          <p
            className="
          mt-5
          text-gray-600
          text-lg
          leading-8
          "
          >
            Discover why thousands of guests choose Aurelia Stays for their
            unforgettable experiences.
          </p>
        </motion.div>

        {/* Cards */}

        <div
          className="
        mt-16
        grid
        md:grid-cols-3
        gap-8
        "
        >
          {testimonials.map((item, index) => (
            <motion.div
              key={item.name}
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
              bg-white
              rounded-3xl
              p-8
              shadow-md
              hover:shadow-2xl
              transition-all
              duration-300
              "
            >
              {/* Stars */}

              <div
                className="
              flex
              gap-1
              text-amber-400
              "
              >
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} size={18} fill="currentColor" />
                ))}
              </div>

              {/* Review */}

              <p
                className="
              mt-6
              text-gray-600
              leading-7
              "
              >
                "{item.review}"
              </p>

              {/* User */}

              <div
                className="
              flex
              items-center
              gap-4
              mt-8
              "
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="
                  w-14
                  h-14
                  rounded-full
                  object-cover
                  "
                />

                <div>
                  <h3
                    className="
                  font-bold
                  text-gray-900
                  "
                  >
                    {item.name}
                  </h3>

                  <p
                    className="
                  text-sm
                  text-amber-500
                  "
                  >
                    {item.role}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsPreview;
