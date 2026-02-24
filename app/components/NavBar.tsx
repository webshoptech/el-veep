"use client";

import { Fragment } from "react";
import { Menu, MenuButton, MenuItems, Transition } from "@headlessui/react";
import { Bars3Icon, ChevronRightIcon, HomeIcon, CubeIcon, InformationCircleIcon, PhoneIcon, SparklesIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavBar() {
  const pathname = usePathname();

  const navLinks = [
    { label: "Home", href: "/", icon: <HomeIcon className="w-4 h-4" /> },
    { label: "Products", href: "/items?type=products", icon: <CubeIcon className="w-4 h-4" /> },
    // { label: "Events", href: "/events", icon: <SparklesIcon className="w-4 h-4" /> },
    { label: "About Us", href: "/about-us", icon: <InformationCircleIcon className="w-4 h-4" /> },
    { label: "Contact", href: "/contact-us", icon: <PhoneIcon className="w-4 h-4" /> },
  ];

  return (
    <nav className="bg-[#1B412C] text-white shadow-inner">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 h-14">
        
        {/* Categories Menu */}
        <Menu as="div" className="relative">
          <MenuButton className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg text-sm font-bold transition-all border border-white/5">
            <Bars3Icon className="w-5 h-5" />
            <span className="hidden lg:block uppercase tracking-wider">Browse Categories</span>
            <span className="lg:hidden">Categories</span>
          </MenuButton>

          <Transition
            as={Fragment}
            enter="transition ease-out duration-200"
            enterFrom="opacity-0 translate-y-2"
            enterTo="opacity-100 translate-y-0"
          >
            <MenuItems className="absolute left-0 mt-3 w-64 bg-white text-gray-800 shadow-2xl rounded-xl z-[70] py-2 border border-gray-100 overflow-hidden">
              <div className="px-4 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Store Departments</div>
              {/* Note: Map your CategoryList here as before */}
              <Link href="/categories" className="flex items-center justify-between px-4 py-3 text-sm font-semibold text-green-700 bg-green-50 hover:bg-green-100 transition">
                View All Categories <ChevronRightIcon className="w-4 h-4" />
              </Link>
            </MenuItems>
          </Transition>
        </Menu>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  isActive ? "bg-white/10 text-green-300" : "hover:bg-white/5 text-gray-100"
                }`}
              >
                {link.icon}
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Mobile: Quick Contact Action */}
        <div className="md:hidden">
          <Link href="https://wa.me/254113951376" className="flex items-center gap-2 text-xs font-bold bg-green-500 text-white px-3 py-1.5 rounded-full animate-pulse">
            <PhoneIcon className="w-3 h-3" />
            Call to Order
          </Link>
        </div>
      </div>
    </nav>
  );
}