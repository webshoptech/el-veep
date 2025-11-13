"use client";

import CartItem from "@/interfaces/cart";
import { checkoutStripe } from "@/lib/api/checkout";
import { formatAmount } from "@/utils/formatCurrency";
import Image from "next/image";

interface OrderSummaryProps {
  email: string;
  cart: CartItem[];
  subtotal: number;
  shippingFee?: number;
  discount?: number;
  total: number;
}

export default function OrderSummary({
  email,
  cart,
  subtotal,
  shippingFee = 0,
  discount = 0,
  total,
}: OrderSummaryProps) {
  const handleCheckout = async () => {
    try {
      const items = cart.map((item) => ({
        id: item.id,
        qty: item.qty,
      }));

      const res = await checkoutStripe(email, items, total);
      if (res?.checkout_url) {
        window.location.href = res.checkout_url;
      }
    } catch (err) {
      console.error("Checkout error:", err);
    }
  };
  return (
    <div className="w-full lg:w-1/3 bg-white rounded-lg shadow-md p-6 h-fit lg:sticky lg:top-8">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Summary</h3>

      <div className="space-y-4 max-h-60 overflow-y-auto border-b pb-4">
        {cart.map((item) => (
          <div key={item.id} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Image
                src={item.image}
                alt={item.title}
                width={50}
                height={50}
                className="rounded-md object-cover"
              />
              <div>
                <p className="text-sm text-gray-700">{item.title}</p>
                <p className="text-xs text-gray-400">x{item.qty}</p>
              </div>
            </div>
            <span className="text-sm font-medium text-gray-800">
              {formatAmount(item.price * item.qty)}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-4 space-y-2 text-sm text-gray-600">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>{formatAmount(subtotal)}</span>
        </div>

        {shippingFee > 0 && (
          <div className="flex justify-between">
            <span>Shipping Fee</span>
            <span>{formatAmount(shippingFee)}</span>
          </div>
        )}

        {discount > 0 && (
          <div className="flex justify-between text-green-600 font-medium">
            <span>Discount</span>
            <span>- {formatAmount(discount)}</span>
          </div>
        )}

        <div className="border-t border-gray-300 pt-3 flex justify-between font-semibold text-gray-800">
          <span>Total</span>
          <span>{formatAmount(total)}</span>
        </div>
      </div>

      <div className="mt-4 flex items-start gap-2">
        <input type="checkbox" required />
        <span className="text-xs text-gray-500">
          I have read and agree to the website terms and conditions
        </span>
      </div>

      {shippingFee > 0 && (
        <button
          onClick={handleCheckout}
          className="mt-6 w-full bg-[#1B412C] hover:bg-green-600 text-white py-3 rounded-full font-medium cursor-pointer"
        >
          Checkout
        </button>
      )}
    </div>
  );
}
