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
import { ClipLoader } from "react-spinners";
import { useRouter } from "next/navigation";
import { useState, useMemo, useEffect } from "react";
import debounce from "lodash/debounce";
import { listItems } from "@/lib/api/items";
import Item from "@/interfaces/items";
import { motion } from "framer-motion";

export default function TopHeader() {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchItems = useMemo(() => {
    return debounce(async (query: string) => {
      if (!query.trim()) {
        setResults([]);
        return;
      }
      try {
        setLoading(true);
        const response = await listItems(10, 0, query);
        console.log(response.data);
        setResults(response?.data || []);
      } catch (error) {
        console.error("Error fetching items:", error);
      } finally {
        setLoading(false);
      }
    }, 400);
  }, [setResults, setLoading]);

  useEffect(() => {
    return () => {
      fetchItems.cancel();
    };
  }, [fetchItems]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    fetchItems(value);
  };

  return (
    <header className="relative w-full border-b bg-green-50 px-4 sm:px-6 py-3 flex items-center justify-between text-gray-500">
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

      {/* Search (Desktop) */}
      <div className="hidden md:flex flex-1 mx-6 relative">
        <div className="flex items-center w-full max-w-xl border rounded-full px-4 py-2 bg-white shadow-sm">
          <MagnifyingGlassIcon className="w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by"
            className="flex-1 px-3 py-1 outline-none text-gray-700 font-heading"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>

        {/* Search Results */}
        {searchTerm && (
          <div className="absolute top-full left-0 w-full mt-2 bg-white shadow-lg rounded-lg z-50 max-h-64 overflow-y-auto">
            {loading ? (
              <div className="p-4 text-center text-gray-500">Loading...</div>
            ) : results.length > 0 ? (
              <ul className="divide-y">
                {results.map((item) => (
                  <li
                    key={item.id}
                    className="p-3 hover:bg-gray-50 cursor-pointer text-gray-500"
                  >
                    <Link href={`/items/${item.slug}`}>{item.title}</Link>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="p-4 text-center text-gray-400">
                No results found
              </div>
            )}
          </div>
        )}
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-3 sm:gap-4">
        <Dropdown
          button={
            <div className="md:hidden px-2 py-2 flex items-center justify-center bg-green-200 rounded-full hover:bg-green-50 transition">
              <MagnifyingGlassIcon className="w-4 h-4 lg:w-5 lg:h-5 text-green-900" />
            </div>
          }
        >
          <div className="flex items-center border rounded-full px-3 py-2 mb-3">
            <MagnifyingGlassIcon className="w-5 h-5 text-gray-500" />
            <input
              type="text"
              placeholder="Search..."
              className="flex-1 px-2 outline-none text-sm"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>

          {loading ? (
            <div className="text-center text-gray-500 py-2">Loading...</div>
          ) : results.length > 0 ? (
            <ul className="space-y-2">
              {results.map((item) => (
                <li
                  key={item.id}
                  className="px-2 py-2 hover:bg-gray-100 rounded cursor-pointer text-gray-500"
                >
                  <Link href={`/items/${item.slug}`}>{item.title}</Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center text-gray-400 py-2">
              No results found
            </div>
          )}
        </Dropdown>
        <HeaderActions />

        <CartDropdown />
      </div>
    </header>
  );
}

function CartDropdown() {
  const { cart, updateQty, removeFromCart } = useCart();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleProceedToCart = async () => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      router.push("/carts");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleProceedToAllItems = async () => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      router.push("/items");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dropdown
      align="right"
      width="w-[21rem]"
      button={
        <div className="relative flex items-center gap-2 bg-green-200 text-green-900 px-2 sm:px-4 py-2 rounded-full hover:bg-green-200 transition cursor-pointer">
          <div className="relative">
            <ShoppingCartIcon className="w-4 h-4 lg:w-5 lg:h-5" />
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-3 bg-green-600 text-white text-[9px] font-extrabold rounded-full w-3.5 h-3.5 flex items-center justify-center">
                {cart.length}
              </span>
            )}
          </div>
          <span className="hidden sm:inline font-heading">Cart</span>
        </div>
      }
    >
      <div className="max-h-96 overflow-y-auto space-y-4 p-2">
        {cart.length === 0 ? (
          <p className="text-center text-gray-500 py-5">Cart is empty</p>
        ) : (
          cart.map((item) => (
            <div
              key={item.id}
              className="flex gap-3 border-b pb-4 last:border-b-0"
            >
              <Image
                src={item.image}
                alt={item.title}
                width={80}
                height={80}
                className="rounded-md object-cover"
              />
              <div className="flex-1 flex flex-col justify-between">
                <h4 className="text-sm font-medium line-clamp-1">
                  {item.title}
                </h4>
                <div className="flex items-center gap-3 mt-2 text-gray-400">
                  <button
                    onClick={() => updateQty(item.id, item.qty - 1)}
                    className="w-5 h-5 flex items-center justify-center rounded-full cursor-pointer bg-gray-200"
                  >
                    <MinusIcon className="w-3 h-3" />
                  </button>
                  <span className="text-sm font-medium">{item.qty}</span>
                  <button
                    onClick={() => updateQty(item.id, item.qty + 1)}
                    className="w-5 h-5 flex items-center justify-center rounded-full cursor-pointer bg-gray-200"
                  >
                    <PlusIcon className="w-3 h-3" />
                  </button>
                </div>
              </div>
              <div className="flex flex-col items-end justify-between text-gray-400">
                <span className="text-sm text-gray-700 font-semibold">
                  ${(item.price * item.qty).toFixed(2)}
                </span>
                <button onClick={() => removeFromCart(item.id)}>
                  <TrashIcon
                    className="w-5 h-5 hover:text-green-500 cursor-pointer"
                    title="Remove"
                  />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {cart.length > 0 && (
        <div className="p-3 border-t">
          <div className="flex justify-between gap-12 text-sm">
            <button
              onClick={handleProceedToCart}
              disabled={loading}
              className={`mt-6 w-full py-3 rounded-full font-medium transition ${loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gray-500 hover:bg-green-600 text-white cursor-pointer"
                }`}
            >
              {loading ? (
                <div className="flex justify-center items-center gap-2">
                  <ClipLoader size={20} color="#fff" />
                  <span>Processing...</span>
                </div>
              ) : (
                "Cart"
              )}
            </button>
            <button
              onClick={handleProceedToAllItems}
              disabled={loading}
              className={`mt-6 w-full py-3 rounded-full font-medium transition ${loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-500 hover:bg-green-600 text-white cursor-pointer"
                }`}
            >
              {loading ? (
                <div className="flex justify-center items-center gap-2">
                  <ClipLoader size={20} color="#fff" />
                  <span>Processing...</span>
                </div>
              ) : (
                "Cont. shopping"
              )}
            </button>
          </div>
        </div>
      )}
    </Dropdown>
  );
}

function HeaderActions() {
  const router = useRouter();

  return (
    <div className="flex items-center gap-3 sm:gap-4">
      <motion.button
        onClick={() => router.push("/track-order")}
        whileTap={{ scale: 0.95 }}
        whileHover={{ scale: 1.05, rotate: 5 }}
        transition={{ type: "spring", stiffness: 300, damping: 15 }}
        className="px-2 sm:px-4 py-2 flex items-center justify-center bg-green-200 rounded-full cursor-pointer
                   text-green-900 hover:bg-green-600 hover:text-white transition-all duration-300 
                   focus:outline-none focus:ring-2 focus:ring-green-400"
      >
        <MapPinIcon className="w-4 h-4 lg:w-5 lg:h-5" />
        <span className="hidden sm:inline ml-1">Track Order</span>
      </motion.button>
    </div>
  );
}