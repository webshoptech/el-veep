"use client";

import { Fragment, useState } from "react";
import { Menu, MenuButton, MenuItems, Transition } from "@headlessui/react";
import { Bars3Icon, BuildingStorefrontIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { listCategories } from "@/lib/api/category";
import { useQuery } from "@tanstack/react-query";
import Category from "@/interfaces/category";
import Skeleton from "react-loading-skeleton";

export default function NavBar() {
    return (
        <nav className="bg-red-700 text-white">
            <div className="container mx-auto flex items-center justify-between px-1">
                <Menu as="div" className="relative">
                    <MenuButton className="flex items-center gap-2 bg-red-600 px-3 py-3 text-sm font-medium rounded-full hover:bg-red-800 transition focus:outline-none">
                        <Bars3Icon className="w-5 h-5 block lg:hidden" />
                        <div className="hidden lg:flex items-center gap-2">
                            <Bars3Icon className="w-5 h-5" />
                            <span>All Category</span>
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
                        <MenuItems className="absolute left-0 mt-2 w-32 origin-top-left border border-red-100 bg-white text-gray-700 shadow-lg rounded-md focus:outline-none z-50">
                            <div className="py-1">
                                <CategoryMenus />
                            </div>
                        </MenuItems>
                    </Transition>

                </Menu>

                <ul className="hidden md:flex items-center gap-8 text-sm font-medium">
                    <li>
                        <a href="#" title="Home" className="hover:text-red-200 transition">
                            Home
                        </a>
                    </li>
                    <li>
                        <a href="#" title="Products" className="hover:text-red-200 transition">
                            Products
                        </a>
                    </li>
                    <li>
                        <a href="#" title="Services" className="hover:text-red-200 transition">
                            Services
                        </a>
                    </li>
                    <li>
                        <a href="#" title="About us" className="hover:text-red-200 transition">
                            About us
                        </a>
                    </li>
                    <li>
                        <a href="#" title="Contact us" className="hover:text-red-200 transition">
                            Contact us
                        </a>
                    </li>
                </ul>
                <div className="md:hidden">
                    <a href="#" className="hover:text-red-200 transition text-sm font-medium">
                        Products
                    </a>
                </div>
                <div className="md:hidden">
                    <a href="#" className="hover:text-red-200 transition text-sm font-medium">
                        Services
                    </a>
                </div>
                <div className="md:hidden">
                    <a href="#" className="hover:text-red-200 transition text-sm font-medium">
                        Categories
                    </a>
                </div>

                <div className="relative group">
                    <button className="flex items-center justify-center bg-red-600 text-white px-3 py-3 rounded-full font-extrabold transition hover:bg-white hover:text-red-600 border border-red-600">
                        <span className="hidden sm:inline">Become a vendor</span>
                        <BuildingStorefrontIcon className="sm:hidden w-6 h-6" />
                    </button>
                    <span className="absolute bottom-full mb-2 right-2/12 -translate-x-1/2 whitespace-nowrap rounded bg-gray-800 px-2 py-1 text-xs text-white opacity-0 group-hover:opacity-100 transition">
                        Become a vendor
                    </span>
                </div>
            </div>
        </nav>
    );
} 

function CategoryMenus() {
    const [activeType, setActiveType] = useState<string | null>(null);

    return (
        <div>
            <CategoryMenu
                type="products"
                label="Products"
                activeType={activeType}
                setActiveType={setActiveType}
            />
            <CategoryMenu
                type="services"
                label="Services"
                activeType={activeType}
                setActiveType={setActiveType}
            />
        </div>
    );
}

function CategoryMenu({
    type,
    label,
    activeType,
    setActiveType,
}: {
    type: string;
    label: string;
    activeType: string | null;
    setActiveType: (type: string | null) => void;
}) {
    const isOpen = activeType === type;

    const { data, isLoading } = useQuery({
        queryKey: ["categories", type],
        queryFn: () => listCategories(20, 0, undefined, type),
        enabled: isOpen,
    });

    return (
        <div>
            <button
                onClick={() => setActiveType(isOpen ? null : type)}
                className="flex w-full items-center justify-between px-4 py-2 text-sm hover:bg-gray-100"
            >
                {label}
                <ChevronRightIcon
                    className={`w-4 h-4 transform transition ${isOpen ? "rotate-90" : ""}`}
                />
            </button>

            <Transition
                show={isOpen}
                enter="transition ease-out duration-200"
                enterFrom="opacity-0 -translate-y-2"
                enterTo="opacity-100 translate-y-0"
                leave="transition ease-in duration-150"
                leaveFrom="opacity-100 translate-y-0"
                leaveTo="opacity-0 -translate-y-2"
            >
                <div className="absolute top-0 left-full ml-1 w-44 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                    {isLoading ? (
                        <div className="p-2 space-y-2">
                            <Skeleton height={20} count={4} />
                        </div>
                    ) : data?.data?.length > 0 ? (
                        data.data.map((cat: Category) => (
                            <a
                                key={cat.id}
                                href={`/categories/${cat.slug}`}
                                className="block px-4 py-2 text-sm hover:bg-gray-100"
                            >
                                {cat.name}
                            </a>
                        ))
                    ) : (
                        <p className="px-4 py-2 text-sm text-gray-500">No categories</p>
                    )}
                </div>
            </Transition>
        </div>
    );
}

