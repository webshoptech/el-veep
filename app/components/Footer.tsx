"use client";

import Link from "next/link";
import Image from "next/image";
import {
  FaFacebookF,
  FaEnvelope,
  FaInstagram,
  FaWhatsapp,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#1B412C] text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Column 1: Brand & Bio */}
          <div className="flex flex-col gap-6">
            <Link href="/" className="inline-block">
              <Image
                src="/images/logo.svg"
                alt="El Veep Logo"
                width={140}
                height={50}
                className="brightness-0 invert" // Ensures logo shows white if it's dark
              />
            </Link>
            <p className="text-gray-300! text-sm leading-relaxed max-w-sm">
              Your No. 1 African marketplace. We bring the heart of Africa to
              your doorstep with quality products and seamless event center
              services.
            </p>
            <div className="flex gap-4 text-xl">
              <Link
                href="https://facebook.com/..."
                className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition"
              >
                <FaFacebookF size={18} />
              </Link>
              <Link
                href="#"
                className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition"
              >
                <FaXTwitter size={18} />
              </Link>
              <Link
                href="#"
                className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition"
              >
                <FaInstagram size={18} />
              </Link>
              <Link
                href="https://wa.me/254113951376"
                className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition"
              >
                <FaWhatsapp size={18} />
              </Link>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-6 border-b border-white/10 pb-2 text-white! inline-block">
              Company
            </h3>
            <ul className="flex flex-col gap-3 text-gray-300 text-sm">
              <li>
                <Link href="/about-us" className="hover:text-white transition">
                  About Our Hub
                </Link>
              </li>
              <li>
                <Link
                  href="/contact-us"
                  className="hover:text-white transition"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition">
                  Event Center
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition">
                  Join the Team
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Support */}
          <div>
            <h3 className="text-lg font-bold mb-6 border-b border-white/10 pb-2 text-white! inline-block">
              Support
            </h3>
            <ul className="flex flex-col gap-3 text-gray-300 text-sm">
              <li>
                <Link href="#" className="hover:text-white transition">
                  Help & FAQs
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition">
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Newsletter */}
          <div>
            <h3 className="text-lg font-bold mb-6 border-b border-white/10 text-white! pb-2 inline-block">
              Newsletter
            </h3>
            <p className="text-sm text-gray-300! mb-4">
              Subscribe to get updates on new arrivals and events.
            </p>
            <form className="flex flex-col gap-2">
              <input
                type="email"
                placeholder="Your email address"
                className="bg-white/5 border border-white/20 rounded-md px-4 py-2 text-sm focus:outline-none focus:border-white/50"
              />
              <button className="bg-white text-[#1B412C] font-bold py-2 rounded-md hover:bg-gray-200 transition text-sm">
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-400">
          <p>
            © {currentYear} El Veep Superstore and Event Center. All rights
            reserved.
          </p>
          <div className="flex gap-6">
            <span className="flex items-center gap-1">
              <FaEnvelope /> order@elveep.org
            </span>
            <span>Lagos, Nigeria</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
