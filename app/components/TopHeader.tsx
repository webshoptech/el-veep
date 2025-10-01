"use client";

import Image from "next/image";
import {
    MagnifyingGlassIcon,
    UserIcon,
    ShoppingCartIcon,
    MinusIcon,
    PlusIcon,
    TrashIcon,
    MapPinIcon,
} from "@heroicons/react/24/outline";

import Dropdown from "./common/Dropdown";
import Link from "next/link";
import { useCart } from "@/context/CartContext";

export default function TopHeader() {
    return (
        <header className="relative w-full border-b bg-red-50 px-4 sm:px-6 py-3 flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-2">
                <Link href="/">
                    <Image
                        src="/images/logo.svg"
                        alt="African Market Hub"
                        width={140}
                        height={30}
                        priority
                    />
                </Link>
            </div>

            <div className="hidden md:flex flex-1 mx-6">
                <div className="flex items-center w-full max-w-xl border rounded-full px-4 py-2 bg-white shadow-sm">
                    <MagnifyingGlassIcon className="w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by"
                        className="flex-1 px-3 py-1 outline-none text-gray-700 font-heading"
                    />
                </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-3 sm:gap-4">
                <Dropdown
                    button={
                        <div className="md:hidden px-2 py-2 flex items-center justify-center   bg-red-200 rounded-full hover:bg-red-50 transition">
                            <MagnifyingGlassIcon className="w-3 h-3 lg:w-5 lg:h-5 text-red-900" />
                        </div>
                    }
                >
                    {/* Search Input */}
                    <div className="flex items-center border rounded-full px-3 py-2 mb-3">
                        <MagnifyingGlassIcon className="w-5 h-5 text-gray-500" />
                        <input
                            type="text"
                            placeholder="Search..."
                            className="flex-1 px-2 outline-none text-sm"
                        />
                    </div>

                    {/* Dummy Results */}
                    <ul className="space-y-2">
                        <li className="px-2 py-2 hover:bg-gray-100 rounded cursor-pointer">
                            African Rice
                        </li>
                        <li className="px-2 py-2 hover:bg-gray-100 rounded cursor-pointer">
                            Ankara Clothes
                        </li>
                    </ul>
                </Dropdown>

                {/* Sign up */}
                <button className="flex items-center gap-2 bg-red-200 text-red-900 px-2 py-2 rounded-full hover:bg-red-600 transition">
                    <UserIcon className="w-3 h-3 lg:w-5 lg:h-5" />
                    <span className="hidden sm:inline font-heading">Sign up</span>
                </button>

                {/* Track Icon */}
                <div className="px-2 py-2 flex items-center justify-center bg-red-200 rounded-full hover:bg-red-50 transition">
                    <MapPinIcon className="w-3 h-3 lg:w-5 lg:h-5 text-red-900" />
                </div>

                <CartDropdown />

            </div>
        </header>
    );
}


function CartDropdown() {
    const { cart, updateQty, removeFromCart } = useCart();

    return (
        <Dropdown align="right" width="w-[24rem]"
            button={ 
                <div className="relative flex items-center gap-2 bg-red-200 text-red-900 px-2 sm:px-4 py-2 rounded-full hover:bg-red-200 transition cursor-pointer">
                    <div className="relative">
                        <ShoppingCartIcon className="w-5 h-5" />
                        {cart.length > 0 && (
                            <span className="absolute -top-2 -right-3 bg-red-600 text-white text-[9px] font-extrabold rounded-full w-3.5 h-3.5">
                                {cart.length}
                            </span>
                        )}
                    </div>

                    <span className="hidden sm:inline font-heading">
                        Cart
                    </span>
                </div>

            }
        >
            <div className="max-h-96 overflow-y-auto space-y-4 p-2">
                {cart.length === 0 ? (
                    <p className="text-center text-gray-500 py-5">Cart is empty</p>
                ) : (
                    cart.map((item) => (
                        <div key={item.id} className="flex gap-3 border-b pb-4 last:border-b-0">
                            <Image src={item.image} alt={item.title} width={80} height={80} className="rounded-md object-cover" />
                            <div className="flex-1 flex flex-col justify-between">
                                <h4 className="text-sm font-medium line-clamp-1">{item.title}</h4>
                                <div className="flex items-center gap-3 mt-2 text-gray-400">
                                    <button onClick={() => updateQty(item.id, item.qty - 1)} className="w-5 h-5 flex items-center justify-center rounded-full cursor-pointer bg-gray-200">
                                        <MinusIcon className="w-3 h-3" />
                                    </button>
                                    <span className="text-sm font-medium">{item.qty}</span>
                                    <button onClick={() => updateQty(item.id, item.qty + 1)} className="w-5 h-5 flex items-center justify-center rounded-full cursor-pointer bg-gray-200">
                                        <PlusIcon className="w-3 h-3" />
                                    </button>
                                </div>
                            </div>
                            <div className="flex flex-col items-end justify-between text-gray-400">
                                <span className="text-sm text-gray-700 font-semibold">
                                    ${(item.price * item.qty).toFixed(2)}
                                </span>
                                <div className="flex gap-2">
                                    <button onClick={() => removeFromCart(item.id)}>
                                        <TrashIcon className="w-5 h-5 hover:text-red-500 cursor-pointer" title="Remove" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {cart.length > 0 && (
                <div className="p-3 border-t">
                    <div className="flex justify-between gap-12">
                        <Link href="/carts" className="w-full bg-gray-400 cursor-pointer text-white py-2 rounded-md hover:bg-red-600 transition font-heading text-center">
                            Cart
                        </Link>
                        <button className="w-full bg-red-400 cursor-pointer text-white py-2 rounded-md hover:bg-red-600 transition font-heading">
                            Checkout
                        </button>
                    </div>
                </div>
            )}
        </Dropdown>
    );
}
