import { Mail, Phone, MapPin } from "lucide-react";

import { FaFacebookF, FaInstagram, FaTwitter } from "react-icons/fa";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer
      className="
bg-neutral-950
text-white
pt-20
px-6
lg:px-10
"
    >
      <div
        className="
max-w-7xl
mx-auto
"
      >
        <div
          className="
grid
grid-cols-1
md:grid-cols-2
lg:grid-cols-4
gap-12
pb-14
"
        >
          {/* Brand */}

          <div>
            <h2
              className="
font-fraunces
text-3xl
"
            >
              Aurelia
              <span className="text-gold italic">Stays</span>
            </h2>

            <p
              className="
font-inter
text-sm
text-white/60
leading-relaxed
mt-5
"
            >
              Luxury hotels, unforgettable journeys and premium experiences
              crafted for every traveler.
            </p>

            <div
              className="
flex
gap-4
mt-6
"
            >
              <a
                className="
w-10
h-10
rounded-full
border
border-white/20
flex
items-center
justify-center
hover:bg-gold
transition
"
              >
                <FaFacebookF size={16} />
              </a>

              <a
                className="
w-10
h-10
rounded-full
border
border-white/20
flex
items-center
justify-center
hover:bg-gold
transition
"
              >
                <FaInstagram size={16} />
              </a>

              <a
                className="
w-10
h-10
rounded-full
border
border-white/20
flex
items-center
justify-center
hover:bg-gold
transition
"
              >
                <FaTwitter size={16} />
              </a>
            </div>
          </div>

          {/* Links */}

          <div>
            <h3
              className="
font-fraunces
text-xl
mb-5
"
            >
              Quick Links
            </h3>

            <ul
              className="
space-y-3
font-inter
text-sm
text-white/60
"
            >
              <li className="hover:text-gold cursor-pointer"><Link to={"/"}>Home</Link></li>

              <li className="hover:text-gold cursor-pointer"><Link to={"/hotels"}>Hotels</Link></li>

              <li className="hover:text-gold cursor-pointer"><Link to={"/reviews"}>Reviews</Link></li>

              <li className="hover:text-gold cursor-pointer"><Link to={"/mybooking"}>My Booking</Link></li>
            </ul>
          </div>

          {/* Services */}

          <div>
            <h3
              className="
font-fraunces
text-xl
mb-5
"
            >
              Services
            </h3>

            <ul
              className="
space-y-3
font-inter
text-sm
text-white/60
"
            >
              <li>Luxury Rooms</li>

              <li>Restaurant & Dining</li>

              <li>Airport Transfer</li>

              <li>24/7 Support</li>
            </ul>
          </div>

          {/* Contact */}

          <div>
            <h3
              className="
font-fraunces
text-xl
mb-5
"
            >
              Contact
            </h3>

            <div
              className="
space-y-4
font-inter
text-sm
text-white/60
"
            >
              <p
                className="
flex
gap-3
items-center
"
              >
                <MapPin size={16} className="text-gold" />
                Dubai, UAE
              </p>

              <p
                className="
flex
gap-3
items-center
"
              >
                <Phone size={16} className="text-gold" />
                +971 000 0000
              </p>

              <p
                className="
flex
gap-3
items-center
"
              >
                <Mail size={16} className="text-gold" />
                support@aureliastays.com
              </p>
            </div>
          </div>
        </div>

        {/* Newsletter */}

        <div
          className="
border-t
border-white/10
py-10
flex
flex-col
md:flex-row
items-center
justify-between
gap-5
"
        >
          <div>
            <h3
              className="
font-fraunces
text-xl
"
            >
              Subscribe Newsletter
            </h3>

            <p
              className="
text-white/50
font-inter
text-sm
mt-2
"
            >
              Get latest offers and travel updates.
            </p>
          </div>

          <div
            className="
flex
w-full
md:w-auto
"
          >
            <input
              type="email"
              placeholder="Enter your email"
              className="
bg-white/10
border
border-white/20
px-5
py-3
rounded-l-full
outline-none
text-sm
font-inter
w-full
md:w-72
"
            />

            <button
              className="
bg-gold
px-6
rounded-r-full
font-inter
text-sm
hover:bg-gold/90
transition
"
            >
              Subscribe
            </button>
          </div>
        </div>

        {/* Bottom */}

        <div
          className="
border-t
border-white/10
py-6
text-center
text-white/40
text-sm
font-inter
"
        >
          © {new Date().getFullYear()} Aurelia Stays. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
