import { motion } from "framer-motion";

const images = [
  "https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=1200&auto=format&fit=crop",

  "https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=800&auto=format&fit=crop",

  "https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=800&auto=format&fit=crop",

  "https://images.unsplash.com/photo-1601918774946-25832a4be0d6?q=80&w=800&auto=format&fit=crop",
];

const RoomGallery = () => {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-4 gap-5">
          {/* Main Image */}

          <motion.div
            initial={{
              opacity: 0,
              x: -50,
            }}
            whileInView={{
              opacity: 1,
              x: 0,
            }}
            transition={{
              duration: 0.7,
            }}
            viewport={{
              once: true,
            }}
            className="
              lg:col-span-3
              h-125
              overflow-hidden
              rounded-3xl
            "
          >
            <img
              src={images[0]}
              alt="Luxury Room"
              className="
                w-full
                h-full
                object-cover
                hover:scale-105
                transition-all
                duration-500
              "
            />
          </motion.div>

          {/* Thumbnails */}

          <div
            className="
            grid
            grid-cols-1
            md:grid-cols-2
            lg:grid-cols-1
            gap-5
          "
          >
            {images.slice(1).map((image, index) => (
              <motion.div
                key={index}
                initial={{
                  opacity: 0,
                  y: 30,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.15,
                }}
                viewport={{
                  once: true,
                }}
                className="
                  h-38.75
                  overflow-hidden
                  rounded-2xl
                  cursor-pointer
                "
              >
                <img
                  src={image}
                  alt="Room Preview"
                  className="
                    w-full
                    h-full
                    object-cover
                    hover:scale-110
                    transition-all
                    duration-500
                  "
                />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default RoomGallery;
