"use client";

import Image from "next/image";
import { TrashIcon, HeartIcon, MinusIcon, PlusIcon } from "@heroicons/react/24/outline";
import { useCart } from "@/context/CartContext";

export default function CartPage() {
    const { cart, updateQty, removeFromCart } = useCart();

    // totals
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    const shipping = 400.5; // example
    const tax = 50.15;
    const total = subtotal + shipping + tax;

    return (
        <div className="bg-gray-50 min-h-screen py-8">
            <div className="max-w-7xl mx-auto px-4 lg:px-8 flex flex-col lg:flex-row gap-8">
                {/* Cart Items */}
                <div className="flex-1 space-y-4">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4 bg-white p-4 rounded-xl shadow">
                        Your Cart ({cart.length})
                    </h2>

                    {cart.map((item) => (
                        <div
                            key={item.id}
                            className="bg-white rounded-lg shadow-sm flex items-center justify-between p-4"
                        >
                            {/* Product Info */}
                            <div className="flex items-center gap-4">
                                <Image
                                    src={item.image}
                                    alt={item.title}
                                    width={100}
                                    height={100}
                                    className="rounded-md object-cover"
                                />
                                <div>
                                    <h3 className="font-medium text-gray-800">{item.title}</h3>
                                    <p className="text-sm text-gray-500">{item.description}</p>
                                    <span
                                        className={`text-xs font-medium ${item.stock ? "text-green-600" : "text-red-500"
                                            }`}
                                    >
                                        {item.stock ? "In stock" : "Out of stock"}
                                    </span>

                                    {/* Quantity */}
                                    <div className="flex items-center gap-2 mt-2 text-gray-400">
                                        <button
                                            onClick={() => updateQty(item.id, item.qty - 1)}
                                            className="w-5 h-5 flex items-center justify-center rounded-full cursor-pointer bg-gray-200 text-gray-500 "
                                        >
                                            <MinusIcon className="w-3 h-3" />
                                        </button>
                                        <span className="text-sm font-medium">{item.qty}</span>
                                        <button
                                            onClick={() => updateQty(item.id, item.qty + 1)}
                                            className="w-5 h-5 flex items-center justify-center rounded-full cursor-pointer bg-gray-200 text-gray-500 "
                                        >
                                            <PlusIcon className="w-3 h-3" />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Price + Actions */}
                            <div className="flex flex-col items-end justify-between h-full">
                                <span className="text-lg font-semibold text-gray-800">
                                    ${(item.price * item.qty).toFixed(2)}
                                </span>
                                <div className="flex items-center gap-2 mt-4">
                                    <button className="p-2 hover:text-orange-500">
                                        <HeartIcon className="h-5 w-5" />
                                    </button>
                                    <button
                                        onClick={() => removeFromCart(item.id)}
                                        className="p-2 hover:text-red-500"
                                    >
                                        <TrashIcon className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Summary */}
                <div className="w-full lg:w-1/3 bg-white rounded-lg shadow-md p-6 h-fit">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Summary</h3>

                    <div className="space-y-3 text-sm text-gray-600">
                        <div className="flex justify-between">
                            <span>Subtotal</span>
                            <span>${subtotal.toFixed(2)} </span>
                        </div>
                        <div className="flex justify-between">
                            <span>Shipping Fee</span>
                            <span>${shipping.toFixed(2)} </span>
                        </div>
                        <div className="flex justify-between">
                            <span>Coupon</span>
                            <button className="text-orange-500 font-medium hover:underline">
                                Apply Coupon
                            </button>
                        </div>
                        <div className="flex justify-between">
                            <span>Tax</span>
                            <span>${tax.toFixed(2)} </span>
                        </div>
                        <div className="border-t pt-3 flex justify-between font-semibold text-gray-800">
                            <span>Total</span>
                            <span>${total.toFixed(2)} </span>
                        </div>
                    </div>

                    <button className="mt-6 w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-full font-medium">
                        Proceed to Checkout
                    </button>
                </div>
            </div>
        </div>
    );
}
