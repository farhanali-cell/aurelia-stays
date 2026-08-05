import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";

const features = [
  "Elegant & Spacious Luxury Rooms",
  "World-Class Hospitality Services",
  "Premium Dining & Relaxation",
  "Trusted by Thousands of Happy Guests",
];

const OurStory = () => {
  return (
    <section className="bg-white py-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Image */}
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative"
          >
            <img
              src="https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=1200&auto=format&fit=crop"
              alt="Luxury Hotel Interior"
              className="rounded-3xl shadow-2xl w-full h-137.5 object-cover"
            />

            {/* Floating Badge */}
            <div className="absolute bottom-8 left-8 bg-amber-500 text-white px-6 py-4 rounded-2xl shadow-xl">
              <h3 className="text-3xl font-bold">15+</h3>
              <p className="text-sm tracking-wide">
                Years of Hospitality Excellence
              </p>
            </div>
          </motion.div>

          {/* Right Content */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <span className="inline-block bg-amber-100 text-amber-700 px-4 py-2 rounded-full text-sm font-semibold tracking-wide uppercase">
              Our Story
            </span>

            <h2 className="mt-6 text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
              Where Luxury Meets
              <span className="text-amber-500"> Unforgettable Experiences</span>
            </h2>

            <p className="mt-6 text-gray-600 leading-8 text-lg">
              At Aurelia Stays, we believe every journey deserves an exceptional
              place to stay. From thoughtfully designed interiors to
              personalized hospitality, every detail is crafted to make your
              experience relaxing, elegant, and memorable.
            </p>

            <p className="mt-5 text-gray-600 leading-8">
              Whether you're traveling for business, a family vacation, or a
              romantic getaway, our commitment to comfort, quality, and service
              ensures that every guest feels at home while enjoying world-class
              luxury.
            </p>

            {/* Features */}
            <div className="grid sm:grid-cols-2 gap-4 mt-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.15,
                  }}
                  viewport={{ once: true }}
                  className="flex items-start gap-3"
                >
                  <CheckCircle
                    size={22}
                    className="text-amber-500 mt-1 shrink-0"
                  />

                  <p className="text-gray-700">{feature}</p>
                </motion.div>
              ))}
            </div>

            {/* Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="mt-10 bg-amber-500 hover:bg-amber-600 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-300 shadow-lg"
            >
              Explore Rooms
            </motion.button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default OurStory;
