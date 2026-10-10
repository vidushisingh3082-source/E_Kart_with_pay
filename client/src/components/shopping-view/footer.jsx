import { Link } from "react-router-dom";
import { Instagram, Facebook, Twitter } from "lucide-react";

function Footer() {
  return (
    <footer className="border-t border-ink/10 bg-ivory">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link to="/shop/home" className="font-display text-2xl italic tracking-tight text-ink">
              E-Kart
            </Link>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-ink/60">
              Timeless clothing, thoughtfully sourced. Quality pieces built to last beyond a
              season.
            </p>
            <div className="mt-4 flex gap-4 text-ink/60">
              <a href="#" aria-label="Instagram" className="hover:text-ink">
                <Instagram size={18} />
              </a>
              <a href="#" aria-label="Facebook" className="hover:text-ink">
                <Facebook size={18} />
              </a>
              <a href="#" aria-label="Twitter" className="hover:text-ink">
                <Twitter size={18} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="mb-3 text-xs font-semibold uppercase tracking-widest text-ink">
              Company
            </h4>
            <ul className="space-y-2 text-sm text-ink/60">
              <li>
                <Link to="/shop/about-us" className="hover:text-ink">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/shop/contact-us" className="hover:text-ink">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/shop/listing" className="hover:text-ink">
                  All Products
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-3 text-xs font-semibold uppercase tracking-widest text-ink">
              Support
            </h4>
            <ul className="space-y-2 text-sm text-ink/60">
              <li>
                <Link to="/shop/account" className="hover:text-ink">
                  My Account
                </Link>
              </li>
              <li>
                <Link to="/shop/contact-us" className="hover:text-ink">
                  Shipping & Returns
                </Link>
              </li>
              <li>
                <Link to="/shop/contact-us" className="hover:text-ink">
                  FAQs
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-3 text-xs font-semibold uppercase tracking-widest text-ink">
              Get in Touch
            </h4>
            <ul className="space-y-2 text-sm text-ink/60">
              <li>support@ekart.com</li>
              <li>+91 98765 43210</li>
              <li>Mon - Sat, 10am - 7pm</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-ink/10 pt-6 text-center text-xs text-ink/40">
          © {new Date().getFullYear()} E-Kart. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

export default Footer;
