import { motion } from "framer-motion";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";

const teamMembers = [
  {
    name: "Michael Anderson",
    role: "General Manager",
    image:
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=800&auto=format&fit=crop",
  },
  {
    name: "Sophia Williams",
    role: "Head Chef",
    image:
      "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?q=80&w=800&auto=format&fit=crop",
  },
  {
    name: "Daniel Carter",
    role: "Guest Relations Manager",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=800&auto=format&fit=crop",
  },
];

const Team = () => {
  return (
    <section className="py-20 bg-white">
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
            Our Team
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
            Meet The People Behind
            <span className="text-amber-500"> Aurelia Stays</span>
          </h2>

          <p
            className="
          mt-5
          text-gray-600
          text-lg
          leading-8
          "
          >
            Our passionate professionals work together to create memorable
            experiences and exceptional hospitality.
          </p>
        </motion.div>

        {/* Team Cards */}
        <div
          className="
        mt-16
        grid
        sm:grid-cols-2
        lg:grid-cols-3
        gap-10
        "
        >
          {teamMembers.map((member, index) => (
            <motion.div
              key={member.name}
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
              className="
              group
              rounded-3xl
              overflow-hidden
              shadow-lg
              bg-white
              "
            >
              {/* Image */}
              <div
                className="
              overflow-hidden
              h-95
              "
              >
                <img
                  src={member.image}
                  alt={member.name}
                  className="
                  w-full
                  h-full
                  object-cover
                  group-hover:scale-110
                  transition-all
                  duration-500
                  "
                />
              </div>

              {/* Content */}
              <div
                className="
              p-7
              text-center
              "
              >
                <h3
                  className="
                text-2xl
                font-bold
                text-gray-900
                "
                >
                  {member.name}
                </h3>

                <p
                  className="
                mt-2
                text-amber-500
                font-medium
                "
                >
                  {member.role}
                </p>

                {/* Social Icons */}
                <div
                  className="
                flex
                justify-center
                gap-4
                mt-5
                "
                >
                  <a
                    href="#"
                    className="
                    w-10
                    h-10
                    rounded-full
                    bg-gray-100
                    flex
                    items-center
                    justify-center
                    hover:bg-amber-500
                    hover:text-white
                    transition
                    "
                  >
                    <FaFacebookF size={18}/>
                  </a>

                  <a
                    href="#"
                    className="
                    w-10
                    h-10
                    rounded-full
                    bg-gray-100
                    flex
                    items-center
                    justify-center
                    hover:bg-amber-500
                    hover:text-white
                    transition
                    "
                  >
                    <FaInstagram size={18} />
                  </a>

                  <a
                    href="#"
                    className="
                    w-10
                    h-10
                    rounded-full
                    bg-gray-100
                    flex
                    items-center
                    justify-center
                    hover:bg-amber-500
                    hover:text-white
                    transition
                    "
                  >
                    <FaLinkedinIn size={18} />
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Team;
