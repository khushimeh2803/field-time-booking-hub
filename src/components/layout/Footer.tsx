
import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-foreground text-white pt-12 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-bold mb-4">Pitch Perfect Booking</h3>
            <p className="text-gray-300 mb-4">
              Your one-stop destination for booking sports facilities. Play your favorite sports at the best venues.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-white hover:text-accent transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-white hover:text-accent transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-white hover:text-accent transition-colors">
                <Instagram size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/sports" className="text-gray-300 hover:text-accent transition-colors">Sports</Link>
              </li>
              <li>
                <Link to="/grounds" className="text-gray-300 hover:text-accent transition-colors">Grounds</Link>
              </li>
              <li>
                <Link to="/membership" className="text-gray-300 hover:text-accent transition-colors">Membership</Link>
              </li>
              <li>
                <Link to="/my-bookings" className="text-gray-300 hover:text-accent transition-colors">My Bookings</Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-xl font-bold mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-gray-300 hover:text-accent transition-colors">About Us</Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-accent transition-colors">Contact Us</Link>
              </li>
              <li>
                <Link to="/faq" className="text-gray-300 hover:text-accent transition-colors">FAQ</Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-300 hover:text-accent transition-colors">Terms & Conditions</Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-bold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <MapPin size={20} className="text-accent flex-shrink-0 mt-1" />
                <span className="text-gray-300">123 Sports Avenue, Stadium District, NY 10001</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone size={20} className="text-accent flex-shrink-0" />
                <span className="text-gray-300">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail size={20} className="text-accent flex-shrink-0" />
                <span className="text-gray-300">info@pitchperfect.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} Pitch Perfect Booking. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
