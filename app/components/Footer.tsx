"use client";

import Link from "next/link";
import {
  FaFacebookF,
  FaEnvelope,
} from 'react-icons/fa';
import { FaXTwitter } from "react-icons/fa6";

import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-green-700 text-white py-10">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Logo */}
          <div className="col-span-2 flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <Image
                src="/images/logo.svg"
                alt="African Market Hub"
                className="cursor-pointer"
                width={120}
                height={120}
              />
            </div>
            <span className="text-sm text-white">
              Your No 1 African marketplace online platform.
            </span>
          </div>

          {/* About */}
          <div className="flex flex-col gap-2">
            <span className="font-extrabold mb-2 text-white">About</span>
            <Link href="/about-us">About Us</Link>
            <Link href="/contact-us">Contact Us</Link>
          </div>

          {/* Privacy */}
          <div className="flex flex-col gap-2">
            <span className="font-extrabold mb-2 text-white">Privacy</span>
            <Link href="#">Terms of Privacy</Link>
            <Link href="#">Privacy Policy</Link>
          </div>

          {/* FAQ */}
          <div className="flex flex-col gap-2">
            <span className="font-extrabold mb-2 text-white">FAQ</span>
            <Link href="#">FAQs</Link>
            <Link href="#">Shipping</Link>
          </div>
        </div>

        <div className="mt-8 flex gap-4 justify-end text-xl">
          <Link
            href="https://www.facebook.com/share/176FuM9jr2/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-600 transition duration-150 cursor-pointer"
            aria-label="Facebook link"
          >
            <FaFacebookF className="w-6 h-6" />
          </Link>
          <Link
            href="https://www.facebook.com/share/1ADHQxfRV6/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-900 transition duration-150 cursor-pointer"
            aria-label="Twitter link"
          >
            <FaXTwitter className="w-6 h-6" />
          </Link>
          <Link
            href="mailto:youremail@example.com"
            className="hover:text-red-500 transition duration-150 cursor-pointer"
            aria-label="Email link"
          >
            <FaEnvelope className="w-6 h-6" />
          </Link>
        </div>
      </div>
    </footer>
  );
}
