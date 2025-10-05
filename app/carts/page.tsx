"use client";

import Image from "next/image";
import {
  TrashIcon,
  HeartIcon,
  MinusIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import { useCart } from "@/context/CartContext";
import { useState } from "react";
import Modal from "../components/common/Modal";
import verifyCoupon from "@/lib/api/coupon";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import Coupon from "@/interfaces/coupon";
export default function CartPage() {
  const { cart, updateQty, removeFromCart } = useCart();
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon>(); // store coupon details

  // totals
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const total = Math.max(0, subtotal - discount); // ensure it never goes negative

  const handleApplyCoupon = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await verifyCoupon(couponCode);

      // Handle API error response
      if (res?.status === "error") {
        setError(res.message || "Invalid or expired coupon code");
        toast.error(res.message || "Invalid or expired coupon code");
        return;
      }

      if (res?.is_active && res.discount) {
        const { discount_rate, discount_type } = res.discount;

        let calculatedDiscount = 0;
        if (discount_type === "fixed") {
          calculatedDiscount = Number(discount_rate);
        } else if (discount_type === "percentage") {
          calculatedDiscount = (subtotal * Number(discount_rate)) / 100;
        }

        setDiscount(calculatedDiscount);
        setAppliedCoupon(res.discount);
        setShowCouponModal(false);
      } else {
        setError("Invalid or expired coupon code");
      }
    } catch   {
      setError("Failed to apply coupon. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  const router = useRouter();

  const handleProceedToShipping = () => {
    router.push("/checkout");
  };

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="px-4 lg:px-8 flex flex-col lg:flex-row gap-8">
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
                    className={`text-xs font-medium ${
                      item.stock ? "text-green-600" : "text-red-500"
                    }`}
                  >
                    {item.stock ? "In stock" : "Out of stock"}
                  </span>

                  {/* Quantity */}
                  <div className="flex items-center gap-2 mt-2 text-gray-400">
                    <button
                      onClick={() => updateQty(item.id, item.qty - 1)}
                      className="w-5 h-5 flex items-center justify-center rounded-full cursor-pointer bg-gray-200 text-gray-500"
                    >
                      <MinusIcon className="w-3 h-3" />
                    </button>
                    <span className="text-sm font-medium">{item.qty}</span>
                    <button
                      onClick={() => updateQty(item.id, item.qty + 1)}
                      className="w-5 h-5 flex items-center justify-center rounded-full cursor-pointer bg-gray-200 text-gray-500"
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
                  <button className="p-2 hover:text-red-500">
                    <HeartIcon className="h-5 w-5 cursor-pointer text-gray-500" />
                  </button>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="p-2 hover:text-red-500"
                  >
                    <TrashIcon className="h-5 w-5 cursor-pointer text-gray-500" />
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
              <span>${subtotal.toFixed(2)}</span>
            </div>

            {discount > 0 && appliedCoupon && (
              <div className="flex justify-between text-green-600 font-medium">
                <span>
                  Discount ({appliedCoupon.discount_code} -{" "}
                  {appliedCoupon.discount_type})
                </span>
                <span>- ${discount.toFixed(2)}</span>
              </div>
            )}

            <div className="flex justify-between items-center">
              <span>Coupon</span>
              <button
                className="text-red-500 font-medium cursor-pointer"
                onClick={() => setShowCouponModal(true)}
              >
                {discount > 0 ? "Change Coupon" : "Apply Coupon"}
              </button>
            </div>

            <div className="border-t border-gray-300 pt-3 flex justify-between font-semibold text-gray-800">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>

          <button
            onClick={handleProceedToShipping}
            className="mt-6 w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-full font-medium"
          >
            Proceed to Shipping
          </button>
        </div>
      </div>

      {/* Coupon Modal */}
      <Modal
        isOpen={showCouponModal}
        onClose={() => setShowCouponModal(false)}
        title="Apply Coupon"
        description="Enter the coupon code to apply"
      >
        <input
          type="text"
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value)}
          className="w-full p-3 mb-4 rounded-md border border-red-300 focus:outline-none text-gray-700"
          placeholder="Enter coupon code"
        />

        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

        <div className="flex justify-end gap-2">
          <button
            onClick={() => setShowCouponModal(false)}
            className="px-4 py-2 bg-gray-200 text-gray-500 rounded-md hover:bg-gray-300 cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleApplyCoupon}
            disabled={loading || !couponCode}
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 cursor-pointer disabled:opacity-50"
          >
            {loading ? "Applying..." : "Apply"}
          </button>
        </div>
      </Modal>
    </div>
  );
}
