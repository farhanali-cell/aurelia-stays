// src/components/DiningSection.jsx
import { motion } from "framer-motion";
import { UtensilsCrossed } from "lucide-react";

const dishes = [
  {
    id: 1,
    name: "Grilled Salmon",
    category: "Main Course",
    price: 28,
    image:
      "https://images.unsplash.com/photo-1467003909585-2f8a72700288?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: 2,
    name: "Truffle Risotto",
    category: "Chef's Special",
    price: 24,
    image:
      "https://images.unsplash.com/photo-1476124369491-e7addf5db371?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: 3,
    name: "Signature Dessert Platter",
    category: "Dessert",
    price: 16,
    image:
      "https://images.unsplash.com/photo-1551024506-0bccd828d307?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: 4,
    name: "Wood-Fired Pizza",
    category: "Main Course",
    price: 20,
    image:'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 5,
    name: "Seafood Platter",
    category: "Chef's Special",
    price: 45,
    image:
      "https://images.unsplash.com/photo-1559847844-5315695dadae?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: 6,
    name: "Classic Breakfast Bowl",
    category: "Breakfast",
    price: 14,
    image:
      "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?q=80&w=800&auto=format&fit=crop",
  },
];

const DiningSection = () => {
  return (
    <section className="bg-neutral-900 py-24 px-6 lg:px-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-16 gap-4">
          <div>
            <span className="font-inter text-sm tracking-[0.3em] text-gold uppercase">
              Dine With Us
            </span>
            <h2 className="font-fraunces text-4xl md:text-5xl text-white mt-4">
              Culinary Delights
            </h2>
          </div>
          <p className="font-inter text-white/60 text-sm max-w-sm">
            From locally sourced ingredients to globally inspired recipes, our
            chefs craft an experience for every palate.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {dishes.map((dish, i) => (
            <motion.div
              key={dish.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              className="group relative rounded-2xl overflow-hidden h-105"
            >
              <img
                src={dish.image}
                alt={dish.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/20 to-transparent" />

              <div className="absolute bottom-0 left-0 right-0 p-6">
                <span className="flex items-center gap-2 text-gold font-inter text-xs uppercase tracking-widest mb-2">
                  <UtensilsCrossed size={14} /> {dish.category}
                </span>
                <h3 className="font-fraunces text-2xl text-white">
                  {dish.name}
                </h3>
                <p className="font-inter text-white/70 text-sm mt-1">
                  ${dish.price}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DiningSection;
