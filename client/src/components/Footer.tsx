import { Link } from "wouter";
import { Phone, Mail, MapPin } from "lucide-react";
import { SiTiktok, SiInstagram, SiFacebook } from "react-icons/si";

export function Footer() {
  return (
    <footer className="bg-black text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {/* About Section */}
          <div>
            <h3 className="text-xl font-serif font-bold text-primary mb-4">Pam_Lee's Kitchen</h3>
            <p className="text-sm text-gray-300 mb-4">
              Delighting customers with fresh, homemade baked goods and friendly service. 
              Become the leading bakery brand in the region through technology and customer experience.
            </p>
            <p className="text-xs text-gray-400">Giyani, Malamulele - Limpopo, South Africa</p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-serif font-semibold text-primary mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/menu" data-testid="footer-link-menu">
                  <span className="text-sm text-gray-300 hover:text-primary transition-colors cursor-pointer">Menu</span>
                </Link>
              </li>
              <li>
                <Link href="/specials" data-testid="footer-link-specials">
                  <span className="text-sm text-gray-300 hover:text-primary transition-colors cursor-pointer">Specials</span>
                </Link>
              </li>
              <li>
                <Link href="/order-tracking" data-testid="footer-link-tracking">
                  <span className="text-sm text-gray-300 hover:text-primary transition-colors cursor-pointer">Track Order</span>
                </Link>
              </li>
              <li>
                <Link href="/gallery" data-testid="footer-link-gallery">
                  <span className="text-sm text-gray-300 hover:text-primary transition-colors cursor-pointer">Gallery</span>
                </Link>
              </li>
              <li>
                <Link href="/contact" data-testid="footer-link-contact">
                  <span className="text-sm text-gray-300 hover:text-primary transition-colors cursor-pointer">Contact Us</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Social */}
          <div>
            <h4 className="text-lg font-serif font-semibold text-primary mb-4">Contact & Social</h4>
            <div className="space-y-3 mb-6">
              <a 
                href="tel:0730528247" 
                className="flex items-center gap-2 text-sm text-gray-300 hover:text-primary transition-colors"
                data-testid="footer-phone"
              >
                <Phone className="h-4 w-4 text-primary" />
                0730528247
              </a>
              <a 
                href="mailto:phamelamageza@gmail.com" 
                className="flex items-center gap-2 text-sm text-gray-300 hover:text-primary transition-colors"
                data-testid="footer-email"
              >
                <Mail className="h-4 w-4 text-primary" />
                phamelamageza@gmail.com
              </a>
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <MapPin className="h-4 w-4 text-primary" />
                Giyani, Malamulele, Limpopo
              </div>
            </div>

            {/* Social Media Icons */}
            <div className="flex gap-4">
              <a
                href="https://www.tiktok.com/@PhamelaShimange"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-primary/10 hover:bg-primary/20 p-3 rounded-lg transition-all hover-elevate active-elevate-2"
                data-testid="social-tiktok"
                aria-label="TikTok"
              >
                <SiTiktok className="h-5 w-5 text-primary" />
              </a>
              <a
                href="https://www.instagram.com/pamlee010"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-primary/10 hover:bg-primary/20 p-3 rounded-lg transition-all hover-elevate active-elevate-2"
                data-testid="social-instagram"
                aria-label="Instagram"
              >
                <SiInstagram className="h-5 w-5 text-primary" />
              </a>
              <a
                href="https://www.facebook.com/PamLeesConfectionary"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-primary/10 hover:bg-primary/20 p-3 rounded-lg transition-all hover-elevate active-elevate-2"
                data-testid="social-facebook"
                aria-label="Facebook"
              >
                <SiFacebook className="h-5 w-5 text-primary" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-12 pt-8 text-center">
          <p className="text-sm text-gray-400">
            © {new Date().getFullYear()} Pam_Lee's Kitchen. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
