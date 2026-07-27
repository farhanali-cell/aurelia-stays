// src/components/Footer.jsx
import { Link } from "react-router-dom";
import { MapPin, Phone, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-neutral-900 text-white/70 pt-20 pb-8 px-6 lg:px-10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <span className="font-fraunces text-2xl text-white">Aurelia</span>
            <span className="font-fraunces italic text-2xl text-gold">
              Stays
            </span>
          </div>
          <p className="font-inter text-sm leading-relaxed">
            Curated luxury stays around the world — booked simply, experienced
            fully.
          </p>
          <div className="flex gap-4 mt-6">
            <a href="#" className="hover:text-gold transition-colors">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5 3.66 9.15 8.44 9.94v-7.03H7.9v-2.9h2.54V9.85c0-2.5 1.49-3.89 3.78-3.89 1.09 0 2.24.2 2.24.2v2.47h-1.26c-1.24 0-1.63.77-1.63 1.56v1.87h2.78l-.44 2.9h-2.34V22c4.78-.79 8.44-4.94 8.44-9.94Z" />
              </svg>
            </a>
            <a href="#" className="hover:text-gold transition-colors">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.06 1.8.25 2.22.42.56.21.96.47 1.38.89.42.42.68.82.89 1.38.17.42.36 1.05.42 2.22.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.06 1.17-.25 1.8-.42 2.22-.21.56-.47.96-.89 1.38-.42.42-.82.68-1.38.89-.42.17-1.05.36-2.22.42-1.27.06-1.64.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.06-1.8-.25-2.22-.42a3.7 3.7 0 0 1-1.38-.89 3.7 3.7 0 0 1-.89-1.38c-.17-.42-.36-1.05-.42-2.22-.06-1.27-.07-1.65-.07-4.85s.01-3.58.07-4.85c.06-1.17.25-1.8.42-2.22.21-.56.47-.96.89-1.38.42-.42.82-.68 1.38-.89.42-.17 1.05-.36 2.22-.42 1.27-.06 1.65-.07 4.85-.07ZM12 0C8.74 0 8.33.01 7.05.07 5.78.13 4.9.34 4.14.63c-.79.3-1.46.71-2.13 1.38S.94 3.34.64 4.14c-.29.76-.5 1.64-.56 2.91C.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.06 1.27.27 2.15.56 2.91.3.79.71 1.46 1.38 2.13s1.34 1.08 2.13 1.38c.76.29 1.64.5 2.91.56C8.33 23.99 8.74 24 12 24s3.67-.01 4.95-.07c1.27-.06 2.15-.27 2.91-.56.79-.3 1.46-.71 2.13-1.38s1.08-1.34 1.38-2.13c.29-.76.5-1.64.56-2.91.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.06-1.27-.27-2.15-.56-2.91a5.6 5.6 0 0 0-1.38-2.13A5.6 5.6 0 0 0 19.86.63c-.76-.29-1.64-.5-2.91-.56C15.67.01 15.26 0 12 0Zm0 5.84a6.16 6.16 0 1 0 0 12.32 6.16 6.16 0 0 0 0-12.32Zm0 10.16a4 4 0 1 1 0-8 4 4 0 0 1 0 8Zm6.4-10.4a1.44 1.44 0 1 1-2.88 0 1.44 1.44 0 0 1 2.88 0Z" />
              </svg>
            </a>
            <a href="#" className="hover:text-gold transition-colors">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.49-1.75.85-2.72 1.05a3.85 3.85 0 0 0-6.56 3.5c-3.2-.16-6.03-1.68-7.93-3.97a3.85 3.85 0 0 0 1.19 5.13 3.83 3.83 0 0 1-1.74-.48v.05a3.85 3.85 0 0 0 3.08 3.77c-.55.15-1.15.19-1.73.07a3.85 3.85 0 0 0 3.59 2.67A7.72 7.72 0 0 1 2 18.57 10.9 10.9 0 0 0 7.9 20.3c7.1 0 10.98-5.88 10.98-10.98 0-.17 0-.33-.01-.5A7.7 7.7 0 0 0 22.46 6Z" />
              </svg>
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-fraunces text-lg text-white mb-5">Quick Links</h4>
          <ul className="space-y-3 font-inter text-sm">
            <li>
              <Link to="/" className="hover:text-gold transition-colors">
                Home
              </Link>
            </li>
            <li>
              <Link to="/hotels" className="hover:text-gold transition-colors">
                Hotels
              </Link>
            </li>
            <li>
              <Link
                to="/register"
                className="hover:text-gold transition-colors"
              >
                Register
              </Link>
            </li>
            <li>
              <Link to="/login" className="hover:text-gold transition-colors">
                Login
              </Link>
            </li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h4 className="font-fraunces text-lg text-white mb-5">Support</h4>
          <ul className="space-y-3 font-inter text-sm">
            <li>
              <a href="#" className="hover:text-gold transition-colors">
                FAQs
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-gold transition-colors">
                Cancellation Policy
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-gold transition-colors">
                Terms & Conditions
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-gold transition-colors">
                Privacy Policy
              </a>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="font-fraunces text-lg text-white mb-5">Contact</h4>
          <ul className="space-y-3 font-inter text-sm">
            <li className="flex items-center gap-2">
              <MapPin size={16} /> Bahawalpur, Pakistan
            </li>
            <li className="flex items-center gap-2">
              <Phone size={16} /> +92 300 0000000
            </li>
            <li className="flex items-center gap-2">
              <Mail size={16} /> hello@aureliastays.com
            </li>
          </ul>
        </div>
      </div>

      <hr className="border-white/10 my-10 max-w-7xl mx-auto" />

      <p className="text-center font-inter text-xs text-white/40">
        © {new Date().getFullYear()} Aurelia Stays. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;
