import { motion } from "framer-motion";
import { Users, BedDouble, ArrowRight } from "lucide-react";

const rooms = [
  {
    title: "Deluxe Room",
    price: "$180",
    guests: "2 Guests",
    bed: "King Size Bed",
    image:
      "https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=900&auto=format&fit=crop",
    description:
      "A comfortable and elegant room designed for a relaxing luxury stay.",
  },

  {
    title: "Executive Suite",
    price: "$280",
    guests: "3 Guests",
    bed: "King Bed + Sofa",
    image:
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=900&auto=format&fit=crop",
    description: "Spacious suite with premium interiors and modern facilities. Luxury Stay.",
  },

  {
    title: "Presidential Suite",
    price: "$450",
    guests: "4 Guests",
    bed: "Luxury King Bed",
    image:
      "https://images.unsplash.com/photo-1601918774946-25832a4be0d6?q=80&w=900&auto=format&fit=crop",
    description:
      "Our most luxurious suite offering elegance, privacy, and comfort. Luxury Stay.",
  },

  {
    title: "Family Room",
    price: "$320",
    guests: "5 Guests",
    bed: "Two Double Beds",
    image:
      "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=900&auto=format&fit=crop",
    description:
      "Perfect accommodation for families with extra space and comfort.",
  },
];

const RoomCategories = () => {
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
            px-4
            py-2
            rounded-full
            bg-amber-100
            text-amber-700
            text-sm
            font-semibold
            uppercase
            tracking-wider
          "
          >
            Our Rooms
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
            Choose Your Perfect
            <span className="text-amber-500"> Stay</span>
          </h2>

          <p
            className="
            mt-5
            text-gray-600
            text-lg
            leading-8
          "
          >
            Experience luxury rooms designed with comfort, elegance, and modern
            amenities.
          </p>
        </motion.div>

        {/* Room Cards */}
        <div
          className="
          mt-16
          grid
          sm:grid-cols-2
          lg:grid-cols-4
          gap-8
        "
        >
          {rooms.map((room, index) => (
            <motion.div
              key={room.title}
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
                overflow-hidden
                shadow-md
                hover:shadow-2xl
                transition-all
                duration-300
              "
            >
              {/* Image */}
              <div
                className="
                h-64
                overflow-hidden
              "
              >
                <img
                  src={room.image}
                  alt={room.title}
                  className="
                    w-full
                    h-full
                    object-cover
                    hover:scale-110
                    transition-all
                    duration-500
                  "
                />
              </div>

              {/* Content */}
              <div className="p-6">
                <h3
                  className="
                  text-2xl
                  font-bold
                  text-gray-900
                "
                >
                  {room.title}
                </h3>

                <p
                  className="
                  mt-3
                  text-gray-600
                  text-sm
                  leading-6
                "
                >
                  {room.description}
                </p>

                {/* Info */}
                <div
                  className="
                  mt-5
                  space-y-3
                "
                >
                  <div
                    className="
                    flex
                    items-center
                    gap-3
                    text-gray-700
                  "
                  >
                    <Users size={18} className="text-amber-500" />
                    {room.guests}
                  </div>

                  <div
                    className="
                    flex
                    items-center
                    gap-3
                    text-gray-700
                  "
                  >
                    <BedDouble size={18} className="text-amber-500" />
                    {room.bed}
                  </div>
                </div>

                {/* Price */}
                <div
                  className="
                  mt-6
                  flex
                  items-center
                  justify-between
                "
                >
                  <div>
                    <span
                      className="
                      text-3xl
                      font-bold
                      text-amber-500
                    "
                    >
                      {room.price}
                    </span>

                    <span className="text-gray-500 text-sm">/night</span>
                  </div>

                  <button
                    className="
                    w-11
                    h-11
                    rounded-full
                    bg-amber-500
                    text-white
                    flex
                    items-center
                    justify-center
                    hover:bg-amber-600
                    transition
                  "
                  >
                    <ArrowRight size={20} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RoomCategories;
