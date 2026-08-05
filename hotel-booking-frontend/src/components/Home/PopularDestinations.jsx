import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import faisalMasjid from "../../assets/destinations/faisal-masjid.jfif";
import lahoreBadshahi from "../../assets/destinations/lahore-badshahi.jfif";
import multanGhantaGhar from "../../assets/destinations/multan-ghanta-ghr.jfif";
import quaidEAzam from "../../assets/destinations/quaid-e-azam.jfif";

const destinations = [
  { id: 1, name: "Lahore", country: "Punjab, Pakistan", image: lahoreBadshahi },
  { id: 2, name: "Karachi", country: "Sindh, Pakistan", image: quaidEAzam },
  {
    id: 3,
    name: "Islamabad",
    country: "Capital, Pakistan",
    image: faisalMasjid,
  },
  {
    id: 4,
    name: "Multan",
    country: "Punjab, Pakistan",
    image: multanGhantaGhar,
  },
];

const PopularDestinations = () => {
  const navigate = useNavigate();

  return (
    <section className="bg-white py-24 px-6 lg:px-10">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="font-inter text-sm tracking-[0.3em] uppercase text-gold">
            Explore Places
          </span>
          <h2 className="font-fraunces text-4xl md:text-5xl mt-4 text-neutral-900">
            Popular Destinations
          </h2>
          <p className="font-inter text-neutral-500 mt-4 max-w-xl mx-auto">
            Discover the finest hotels across Pakistan's top cities.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {destinations.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              onClick={() => navigate(`/hotels?city=${item.name}`)}
              className="relative h-80 rounded-3xl overflow-hidden group cursor-pointer"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover transition duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-0 p-6 text-white">
                <div className="flex items-center gap-2 text-gold text-sm font-inter">
                  <MapPin size={15} />
                  {item.country}
                </div>
                <h3 className="font-fraunces text-3xl mt-2">{item.name}</h3>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PopularDestinations;
