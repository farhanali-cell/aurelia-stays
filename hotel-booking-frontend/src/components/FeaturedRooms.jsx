// src/components/FeaturedRooms.jsx
import { motion } from 'framer-motion';
import { Users, BedDouble, Wifi, Bath } from 'lucide-react';

const rooms = [
  {
    id: 1,
    name: 'Junior Suite',
    price: 150,
    image: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=800&auto=format&fit=crop',
    persons: '1-2',
  },
  {
    id: 2,
    name: 'Family Suite',
    price: 250,
    image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=800&auto=format&fit=crop',
    persons: '2-4',
  },
  {
    id: 3,
    name: 'Business Suite',
    price: 350,
    image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=800&auto=format&fit=crop',
    persons: '1-2',
  },
  {
    id: 4,
    name: 'Royal Suite',
    price: 550,
    image: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?q=80&w=800&auto=format&fit=crop',
    persons: '2-3',
  },
  {
    id: 5,
    name: 'Deluxe Room',
    price: 180,
    image: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=800&auto=format&fit=crop',
    persons: '1-2',
  },
  {
    id: 6,
    name: 'Presidential Suite',
    price: 750,
    image: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?q=80&w=800&auto=format&fit=crop',
    persons: '2-4',
  },
  {
    id: 7,
    name: 'Ocean View Room',
    price: 300,
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=800&auto=format&fit=crop',
    persons: '1-2',
  },
  {
    id: 8,
    name: 'Garden Villa',
    price: 420,
    image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=800&auto=format&fit=crop',
    persons: '2-4',
  },
];

const FeaturedRooms = () => {
  return (
    <section className="bg-parchment py-24 px-6 lg:px-10">
      <div className="max-w-7xl mx-auto">
        {/* Section Heading */}
        <div className="text-center mb-16">
          <span className="font-inter text-sm tracking-[0.3em] text-gold uppercase">
            What We Offer
          </span>
          <h2 className="font-fraunces text-4xl md:text-5xl text-neutral-900 mt-4">
            Our Featured Rooms
          </h2>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {rooms.map((room, i) => (
            <motion.div
              key={room.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: (i % 4) * 0.1 }}
              className="group relative rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-xl transition-shadow duration-500"
            >
              {/* Image with hover overlay */}
              <div className="relative h-56 overflow-hidden">
                <img
                  src={room.image}
                  alt={room.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-500" />
                <span className="absolute top-4 right-4 bg-gold text-white text-xs font-inter px-3 py-1 rounded-full opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-500">
                  View Details
                </span>
              </div>

              {/* Info */}
              <div className="p-5">
                <h3 className="font-fraunces text-xl text-neutral-900">{room.name}</h3>
                <p className="font-inter text-gold text-sm mt-1">${room.price} / Night</p>

                <hr className="my-4 border-gold/15" />

                <div className="flex items-center justify-between text-neutral-500 text-xs font-inter">
                  <span className="flex items-center gap-1.5">
                    <Users size={14} /> {room.persons}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <BedDouble size={14} /> King Bed
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Wifi size={14} /> WiFi
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedRooms;