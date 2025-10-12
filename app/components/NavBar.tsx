"use client";

import { Fragment } from "react";
import { Menu, MenuButton, MenuItems, Transition } from "@headlessui/react";
import { Bars3Icon, UserCircleIcon } from "@heroicons/react/24/outline";
import { listCategories } from "@/lib/api/category";
import { useQuery } from "@tanstack/react-query";
import Category from "@/interfaces/category";
import Skeleton from "react-loading-skeleton";
import Link from "next/link";

export default function NavBar() {
    return (
        <nav className="bg-green-700 text-white">
            <div className="container mx-auto flex items-center justify-between px-1">
                {/* Category Dropdown */}
                <Menu as="div" className="relative">
                    <MenuButton className="flex items-center gap-2 bg-green-600 px-3 py-3 text-sm font-medium rounded-full hover:bg-green-800 transition focus:outline-none">
                        <Bars3Icon className="w-5 h-5 block lg:hidden" />
                        <div className="hidden lg:flex items-center gap-2">
                            <Bars3Icon className="w-5 h-5" />
                            <span>All Categories</span>
                        </div>
                    </MenuButton>

                    <Transition
                        as={Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                    >
                        <MenuItems className="absolute left-0 mt-2 w-40 origin-top-left border border-green-100 bg-white text-gray-700 shadow-lg rounded-md focus:outline-none z-50">
                            <div className="py-1">
                                <CategoryList />
                            </div>
                        </MenuItems>
                    </Transition>
                </Menu>

                {/* Desktop Navigation */}
                <ul className="hidden md:flex items-center gap-8 text-sm font-medium">
                    <li>
                        <Link href="/" title="Home" className="hover:text-green-200 transition">
                            Home
                        </Link>
                    </li>
                    <li>
                        <Link
                            href="/items?type=products"
                            title="Products"
                            className="hover:text-green-200 transition"
                        >
                              Products
                        </Link>
                    </li>
                    <li>
                        <Link
                            href="/categories"
                            title="Products"
                            className="hover:text-green-200 transition"
                        >
                              Categories
                        </Link>
                    </li>
                    <li>
                        <Link
                            href="/about-us"
                            title="About us"
                            className="hover:text-green-200 transition"
                        >
                            About us
                        </Link>
                    </li>
                    <li>
                        <Link
                            href="/contact-us"
                            title="Contact us"
                            className="hover:text-green-200 transition"
                        >
                            Contact us
                        </Link>
                    </li>
                </ul>

                {/* Mobile Menu */}
                <div className="md:hidden flex gap-2 text-sm font-medium">
                    <Link href="/items?type=products" className="hover:text-green-200 transition">
                        Products
                    </Link>
                    <Link href="/categories" className="hover:text-green-200 transition">
                        Categories
                    </Link>
                    <Link href="/contact-us" title="Contact us" className="hover:text-green-200 transition">
                        Order to call
                    </Link>
                </div>

                {/* Register/User Button */}
                <div className="relative group">
                    <button className="flex items-center justify-center bg-green-600 text-white px-3 py-3 rounded-full font-extrabold transition hover:bg-white hover:text-green-600">
                        <UserCircleIcon className="sm:hidden w-5 h-5" />
                    </button>
                    <span className="absolute bottom-full mb-2 right-2/12 -translate-x-1/2 whitespace-nowrap rounded bg-gray-800 px-2 py-1 text-xs text-white opacity-0 group-hover:opacity-100 transition">
                        Register
                    </span>
                </div>
            </div>
        </nav>
    );
}

/* ✅ Direct category list (no nested accordion) */
function CategoryList() {
    const { data, isLoading } = useQuery({
        queryKey: ["categories", "products"],
        queryFn: () => listCategories(10, 0, undefined, "products"),
    });

    if (isLoading) {
        return (
            <div className="p-2 space-y-2">
                <Skeleton height={20} count={4} />
            </div>
        );
    }

    if (!data?.categories?.length) {
        return <p className="px-4 py-2 text-sm text-gray-500">No categories</p>;
    }

    return (
        <>
            {data.categories.map((cat: Category) => (
                <Link
                    key={cat.id}
                    href={`/items?category=${cat.slug}&type=products`}
                    className="block px-4 py-2 text-sm hover:bg-gray-100"
                >
                    {cat.name}
                </Link>
            ))}

            <Link
                href="/categories?type=products"
                className="block px-4 py-2 text-sm font-medium text-green-600 hover:bg-gray-50 border-t border-gray-200"
            >
                See more →
            </Link>
        </>
    );
}
