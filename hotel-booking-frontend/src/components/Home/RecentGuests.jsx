// src/components/RecentGuests.jsx
import { motion } from 'framer-motion';
import { BadgeCheck } from 'lucide-react';

const guests = [
  {
    id: 1,
    name: 'Hamza Tariq',
    location: 'Lahore, Pakistan',
    room: 'Business Suite',
    image: 'https://i.pravatar.cc/150?img=12',
  },
  {
    id: 2,
    name: 'Emily Carter',
    location: 'London, UK',
    room: 'Royal Suite',
    image: 'https://i.pravatar.cc/150?img=21',
  },
  {
    id: 3,
    name: 'Omar Farouk',
    location: 'Dubai, UAE',
    room: 'Family Suite',
    image: 'https://i.pravatar.cc/150?img=45',
  },
  {
    id: 4,
    name: 'Sophia Lee',
    location: 'Singapore',
    room: 'Ocean View Room',
    image: 'https://i.pravatar.cc/150?img=56',
  },
  {
    id: 5,
    name: 'Ali Raza',
    location: 'Karachi, Pakistan',
    room: 'Junior Suite',
    image: 'https://i.pravatar.cc/150?img=32',
  },
  {
    id: 6,
    name: 'Grace Thompson',
    location: 'New York, USA',
    room: 'Presidential Suite',
    image: 'https://i.pravatar.cc/150?img=48',
  },
];

const RecentGuests = () => {
  return (
    <section className="bg-parchment py-24 px-6 lg:px-10">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="font-inter text-sm tracking-[0.3em] text-gold uppercase">
            Trusted By Travelers
          </span>
          <h2 className="font-fraunces text-4xl md:text-5xl text-neutral-900 mt-4">
            Recently Booked By
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {guests.map((guest, i) => (
            <motion.div
              key={guest.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="bg-white rounded-2xl p-5 text-center shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
            >
              <div className="relative w-16 h-16 mx-auto mb-4">
                <img
                  src={guest.image}
                  alt={guest.name}
                  className="w-16 h-16 rounded-full object-cover border-2 border-gold/30"
                />
                <BadgeCheck
                  size={18}
                  className="absolute -bottom-1 -right-1 text-gold bg-white rounded-full"
                />
              </div>
              <h3 className="font-fraunces text-sm text-neutral-900">{guest.name}</h3>
              <p className="font-inter text-xs text-neutral-500 mt-1">{guest.location}</p>
              <p className="font-inter text-[11px] text-gold mt-2 tracking-wide uppercase">
                Booked {guest.room}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RecentGuests;