// src/components/Testimonials.jsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Quote, ChevronLeft, ChevronRight, Star } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: 'Ayesha Khan',
    role: 'Business Traveler',
    image: 'https://randomuser.me/api/portraits/women/44.jpg',
    rating: 5,
    text: 'The service was impeccable and the room felt like a home away from home. Booking through Aurelia Stays was seamless from start to finish.',
  },
  {
    id: 2,
    name: 'David Miller',
    role: 'Honeymoon Guest',
    image: 'https://randomuser.me/api/portraits/men/32.jpg',
    rating: 5,
    text: 'Every detail was perfect — from the check-in to the breakfast spread. We will definitely be booking our next trip here again.',
  },
  {
    id: 3,
    name: 'Sara Ahmed',
    role: 'Family Vacation',
    image: 'https://randomuser.me/api/portraits/women/68.jpg',
    rating: 4,
    text: 'A wonderful stay with the kids. The staff went out of their way to make sure everyone was comfortable and happy throughout the trip.',
  },
];

const Testimonials = () => {
  const [index, setIndex] = useState(0);

  const next = () => setIndex((i) => (i + 1) % testimonials.length);
  const prev = () => setIndex((i) => (i - 1 + testimonials.length) % testimonials.length);

  const current = testimonials[index];

  return (
    <section className="bg-white py-24 px-6 lg:px-10">
      <div className="max-w-4xl mx-auto text-center">
        <span className="font-inter text-sm tracking-[0.3em] text-gold uppercase">
          Guest Experiences
        </span>
        <h2 className="font-fraunces text-4xl md:text-5xl text-neutral-900 mt-4 mb-14">
          What Our Guests Say
        </h2>

        <div className="relative">
          <Quote className="mx-auto text-gold/30 mb-6" size={40} />

          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
            >
              <p className="font-fraunces text-xl md:text-2xl text-neutral-800 italic leading-relaxed max-w-2xl mx-auto">
                "{current.text}"
              </p>

              <div className="flex justify-center gap-1 mt-6">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className={i < current.rating ? 'fill-gold text-gold' : 'text-neutral-300'}
                  />
                ))}
              </div>

              <div className="flex items-center justify-center gap-3 mt-6">
                <img
                  src={current.image}
                  alt={current.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-gold/30"
                />
                <div className="text-left">
                  <p className="font-inter text-sm font-medium text-neutral-900">{current.name}</p>
                  <p className="font-inter text-xs text-neutral-500">{current.role}</p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Nav Arrows */}
          <div className="flex justify-center gap-4 mt-10">
            <button
              onClick={prev}
              className="w-10 h-10 rounded-full border border-gold/30 flex items-center justify-center text-gold hover:bg-gold hover:text-white transition-all duration-300"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={next}
              className="w-10 h-10 rounded-full border border-gold/30 flex items-center justify-center text-gold hover:bg-gold hover:text-white transition-all duration-300"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;