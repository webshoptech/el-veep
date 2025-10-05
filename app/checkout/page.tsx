"use client";

import { useEffect, useState } from "react";
import { useCart } from "@/context/CartContext";
import OrderSummary from "../carts/components/Summary";
import AddressAutocomplete from "./components/AddressAutocomplete";
import Address from "@/interfaces/address";

export default function CheckoutPage() {
  const { cart } = useCart();
  const [userIP, setUserIP] = useState<string>("");

  const [address, setAddress] = useState<Address>({
    street: "",
    city: "",
    state: "",
    zip: "",
    country: "",
  });

  useEffect(() => {
    const fetchIP = async () => {
      try {
        const res = await fetch("/api/ip");
        const data = await res.json();
        setUserIP(data.ip);
      } catch (err) {
        console.error("Failed to fetch IP:", err);
      }
    };
    fetchIP();
  }, []);

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const shippingFee = 400.5;
  const discount = 0;
  const tax = 50.15;
  const total = subtotal + shippingFee + tax - discount;

  const handleAddressChange = (field: string, value: string) => {
    setAddress((prev: Address) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      address,
      cart,
      totals: { subtotal, shippingFee, discount, tax, total },
      ip: userIP,
    };

    console.log("Submitting payload:", payload);

    const response = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    console.log("Checkout response:", data);
  };

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="px-4 lg:px-8 flex flex-col lg:flex-row gap-8">
        {/* Shipping Form */}
        <div className="flex-1 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Shipping Information
          </h2>
          <form
            className="grid grid-cols-1 md:grid-cols-2 gap-4 !text-gray-500"
            onSubmit={handleSubmit}
          >
            <input
              type="text"
              placeholder="First Name"
              className="border border-gray-200 p-3 rounded"
              required
            />
            <input
              type="text"
              placeholder="Last Name"
              className="border border-gray-200 p-3 rounded"
              required
            />

            {/* Google Autocomplete Field */}
            <div className="md:col-span-2">
              <AddressAutocomplete
                onSelectAddress={(addr) =>
                  setAddress((prev: Address) => ({ ...prev, ...addr }))
                }
              />
            </div>

            <input
              type="text"
              value={address.street}
              onChange={(e) => handleAddressChange("street", e.target.value)}
              placeholder="Street Address"
              className="border border-gray-200 p-3 rounded md:col-span-2"
            />
            <input
              type="text"
              value={address.city}
              onChange={(e) => handleAddressChange("city", e.target.value)}
              placeholder="Town/City"
              className="border border-gray-200 p-3 rounded"
            />
            <input
              type="text"
              value={address.state}
              onChange={(e) => handleAddressChange("state", e.target.value)}
              placeholder="State"
              className="border border-gray-200 p-3 rounded"
            />
            <input
              type="text"
              value={address.zip}
              onChange={(e) => handleAddressChange("zip", e.target.value)}
              placeholder="Zip Code"
              className="border border-gray-200 p-3 rounded"
            />
            <input
              type="email"
              placeholder="Email Address"
              className="border border-gray-200 p-3 rounded"
              required
            />
            <input
              type="text"
              placeholder="Phone Number"
              className="border border-gray-200 p-3 rounded"
              required
            />

            <textarea
              placeholder="Order note (Optional)"
              className="border border-gray-200 p-3 rounded md:col-span-2"
            ></textarea>

            <button
              type="submit"
              className="bg-blue-600 text-white p-3 rounded md:col-span-2 hover:bg-blue-700"
            >
              Place Order
            </button>
          </form>

          <p className="text-sm text-gray-500 mt-3">
            Detected IP: <strong>{userIP || "Loading..."}</strong>
          </p>
        </div>

        {/* Summary */}
        <OrderSummary
          cart={cart}
          subtotal={subtotal}
          shippingFee={shippingFee}
          discount={discount}
          tax={tax}
          total={total}
        />
      </div>
    </div>
  );
}
