"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import OrderSummary from "../carts/components/Summary";
import AddressAutocomplete from "./components/AddressAutocomplete";
import Address from "@/interfaces/address";
import { processOrder } from "@/lib/api/processOrder";

export default function CheckoutPage() {
  const { cart } = useCart();
  const [userIP] = useState<string>("102.0.14.104");
  const [loading, setLoading] = useState(false);

  const [address, setAddress] = useState<Address>({
    street: "",
    city: "",
    state: "",
    zip: "",
    country: "",
  });

  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");


  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const discount = 0;
  const total = subtotal - discount;

  const handleAddressChange = (field: string, value: string) => {
    setAddress((prev: Address) => ({ ...prev, [field]: value }));
  };

  const { clearCart } = useCart();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      street: address.street,
      city: address.city,
      state: address.state,
      zip: address.zip,
      firstname,
      lastname,
      email,
      phone,
      country: address.country || "NG",
      ip: userIP,
      products: cart.map((item) => ({
        id: item.id,
        quantity: item.qty,
      })),
    };

    try {
      setLoading(true);
      const result = await processOrder(payload);
      if (result?.redirect_whatsapp_link) {
        clearCart();
        window.location.href = result.redirect_whatsapp_link;
        return;
      }

    } catch (error) {
      console.error("Checkout failed:", error);
    } finally {
      setLoading(false);
    }

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
              value={firstname}
              onChange={(e) => setFirstname(e.target.value)}
              className="border border-gray-200 p-3 rounded focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 transition duration-150"
              required
            />
            <input
              type="text"
              placeholder="Last Name"
              value={lastname}
              onChange={(e) => setLastname(e.target.value)}
              className="border border-gray-200 p-3 rounded focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 transition duration-150"
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
              className="border border-gray-200 p-3 rounded focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 transition duration-150 md:col-span-2"
            />
            <input
              type="text"
              value={address.city}
              onChange={(e) => handleAddressChange("city", e.target.value)}
              placeholder="Town/City"
              className="border border-gray-200 p-3 rounded focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 transition duration-150"
            />
            <input
              type="text"
              value={address.state}
              onChange={(e) => handleAddressChange("state", e.target.value)}
              placeholder="State"
              className="border border-gray-200 p-3 rounded focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 transition duration-150"
            />
            <input
              type="text"
              value={address.zip}
              onChange={(e) => handleAddressChange("zip", e.target.value)}
              placeholder="Zip Code"
              className="border border-gray-200 p-3 rounded focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 transition duration-150"
            />
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border border-gray-200 p-3 rounded focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 transition duration-150"
              required
            />
            <input
              type="text"
              placeholder="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="border border-gray-200 p-3 rounded focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 transition duration-150"
              required
            />

            <button
              type="submit"
              disabled={loading}
              className={`mt-2 w-full py-3 rounded-full font-medium transition ${loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-500 hover:bg-green-600 text-white cursor-pointer"
                } md:col-span-2`}
            >
              {loading ? "Processing..." : "Proceed to Shipping"}
            </button>

          </form>
        </div>

        <OrderSummary
          email={email}
          cart={cart}
          subtotal={subtotal}
          discount={discount}
          total={total}
        />
      </div>
    </div>
  );
}
