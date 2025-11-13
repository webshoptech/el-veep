"use client";

import { useState, useMemo } from "react";
import { useCart } from "@/context/CartContext";
import OrderSummary from "../carts/components/Summary";
import AddressAutocomplete from "./components/AddressAutocomplete";
import Address from "@/interfaces/address";
import { processOrder } from "@/lib/api/processOrder";
import toast from "react-hot-toast";

export default function CheckoutPage() {
  const { cart, clearCart } = useCart();
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
  const [serviceNote, setServiceNote] = useState("");
  const [preferredDate, setPreferredDate] = useState("");

  // 🧠 Detect if cart has service items
  const isServiceOrder = useMemo(() => {
    return cart.some((item) => item.type === "services");
  }, [cart]);

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const total = subtotal;

  const handleAddressChange = (field: string, value: string) => {
    setAddress((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const basePayload = {
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

    const payload = isServiceOrder
      ? {
          ...basePayload,
          note: serviceNote,
          preferred_date: preferredDate,
          type: "services",
        }
      : {
          ...basePayload,
          street: address.street,
          city: address.city,
          state: address.state,
          zip: address.zip,
          type: "products",
        };

    try {
      setLoading(true);
      const result = await processOrder(payload);
      if (result?.redirect_whatsapp_link) {
        clearCart();
        window.location.href = result.redirect_whatsapp_link;
      }
    } catch (error) {
      console.error("Checkout failed:", error);
      toast.error("Something went wrong during checkout.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="px-4 lg:px-8 flex flex-col lg:flex-row gap-8">
        {/* Checkout Form */}
        <div className="flex-1 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            {isServiceOrder
              ? "Service Booking Information"
              : "Shipping Information"}
          </h2>

          <form
            className="grid grid-cols-1 md:grid-cols-2 gap-4 !text-gray-500"
            onSubmit={handleSubmit}
          >
            {/* Customer Info */}
            <input
              type="text"
              placeholder="First Name"
              value={firstname}
              onChange={(e) => setFirstname(e.target.value)}
              required
              className="border border-gray-200 p-3 rounded focus:ring-[#1B412C] focus:border-[#1B412C] transition duration-150"
            />
            <input
              type="text"
              placeholder="Last Name"
              value={lastname}
              onChange={(e) => setLastname(e.target.value)}
              required
              className="border border-gray-200 p-3 rounded focus:ring-[#1B412C] focus:border-[#1B412C] transition duration-150"
            />
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="border border-gray-200 p-3 rounded focus:ring-[#1B412C] focus:border-[#1B412C] transition duration-150"
            />
            <input
              type="text"
              placeholder="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              className="border border-gray-200 p-3 rounded focus:ring-[#1B412C] focus:border-[#1B412C] transition duration-150"
            />

            {/* 👇 Conditional Fields */}
            {!isServiceOrder ? (
              <>
                <div className="md:col-span-2">
                  <AddressAutocomplete
                    onSelectAddress={(addr) =>
                      setAddress((prev) => ({ ...prev, ...addr }))
                    }
                  />
                </div>
                <input
                  type="text"
                  placeholder="Street Address"
                  value={address.street}
                  onChange={(e) =>
                    handleAddressChange("street", e.target.value)
                  }
                  className="border border-gray-200 p-3 rounded md:col-span-2 focus:ring-[#1B412C] focus:border-[#1B412C]"
                />
                <input
                  type="text"
                  placeholder="City"
                  value={address.city}
                  onChange={(e) => handleAddressChange("city", e.target.value)}
                  className="border border-gray-200 p-3 rounded focus:ring-[#1B412C] focus:border-[#1B412C]"
                />
                <input
                  type="text"
                  placeholder="State"
                  value={address.state}
                  onChange={(e) => handleAddressChange("state", e.target.value)}
                  className="border border-gray-200 p-3 rounded focus:ring-[#1B412C] focus:border-[#1B412C]"
                />
                <input
                  type="text"
                  placeholder="Zip Code"
                  value={address.zip}
                  onChange={(e) => handleAddressChange("zip", e.target.value)}
                  className="border border-gray-200 p-3 rounded focus:ring-[#1B412C] focus:border-[#1B412C]"
                />
              </>
            ) : (
              <>
                <textarea
                  placeholder="Describe your service needs or special instructions..."
                  value={serviceNote}
                  onChange={(e) => setServiceNote(e.target.value)}
                  rows={4}
                  className="border border-gray-200 p-3 rounded md:col-span-2 focus:ring-[#1B412C] focus:border-[#1B412C]"
                  required
                />
                <input
                  type="datetime-local"
                  value={preferredDate}
                  onChange={(e) => setPreferredDate(e.target.value)}
                  className="border border-gray-200 p-3 rounded md:col-span-2 focus:ring-[#1B412C] focus:border-[#1B412C]"
                  required
                />
              </>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className={`mt-2 w-full py-3 rounded-full font-medium md:col-span-2 transition ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-[#1B412C] hover:bg-green-600 text-white"
              }`}
            >
              {loading
                ? "Processing..."
                : isServiceOrder
                ? "Book Service"
                : "Proceed to Shipping"}
            </button>
          </form>
        </div>

        {/* Order Summary */}
        <OrderSummary
          email={email}
          cart={cart}
          subtotal={subtotal}
          discount={0}
          total={total}
        />
      </div>
    </div>
  );
}
