"use client";

import Image from "next/image";
import { MagnifyingGlassIcon, MapPinIcon, UserIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { ClipLoader } from "react-spinners";
import { useState, useMemo } from "react";
import debounce from "lodash/debounce";
import { listItems } from "@/lib/api/items";
import Item from "@/interfaces/items";
import { motion, AnimatePresence } from "framer-motion";

export default function TopHeader() {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchItems = useMemo(() => {
    return debounce(async (query: string) => {
      if (!query.trim()) { setResults([]); return; }
      try {
        setLoading(true);
        const response = await listItems(10, 0, query);
        setResults(response?.data || []);
      } catch (error) { console.error(error); } finally { setLoading(false); }
    }, 400);
  }, []);

  return (
    <header className="sticky top-0 z-[60] w-full bg-white border-b border-gray-100 px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        
        {/* Brand Logo */}
        <Link href="/" className="shrink-0">
          <Image src="/images/logo.svg" alt="El Veep" width={130} height={35} priority className="w-auto h-8 md:h-10" />
        </Link>

        {/* Desktop Search */}
        <div className="hidden md:flex flex-1 max-w-2xl relative group">
          <div className="flex items-center w-full bg-gray-100 border border-transparent focus-within:border-green-600 focus-within:bg-white rounded-xl px-4 py-2 transition-all shadow-sm">
            <MagnifyingGlassIcon className="w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search products, groceries, events..."
              className="flex-1 px-3 bg-transparent outline-none text-gray-700 text-sm"
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); fetchItems(e.target.value); }}
            />
          </div>
          
          {/* Search Results Dropdown */}
          <AnimatePresence>
            {searchTerm && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="absolute top-full left-0 w-full mt-2 bg-white shadow-2xl rounded-xl border border-gray-100 z-50 max-h-80 overflow-y-auto"
              >
                {loading ? (
                  <div className="p-6 text-center"><ClipLoader size={20} color="#1B412C" /></div>
                ) : results.length > 0 ? (
                  <div className="py-2">
                    {results.map((item) => (
                      <Link key={item.id} href={`/items/${item.slug}`} className="flex items-center gap-3 px-4 py-3 hover:bg-green-50 transition border-b border-gray-50 last:border-0">
                        <div className="w-10 h-10 bg-gray-100 rounded overflow-hidden">
                           <Image src={item.images[0] || '/images/placeholder.png'} alt="" width={40} height={40} className="object-cover" />
                        </div>
                        <span className="text-sm font-medium text-gray-700">{item.title}</span>
                      </Link>
                    ))}
                  </div>
                ) : <div className="p-6 text-center text-gray-400 text-sm">No items found</div>}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Actions */}
        <div hidden className="flex items-center gap-2 sm:gap-4">
          <button className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-full">
            <MagnifyingGlassIcon className="w-6 h-6" />
          </button>
          
          <Link href="/track-order" className="hidden sm:flex items-center gap-2 text-sm font-semibold text-green-800 bg-green-50 px-4 py-2 rounded-full hover:bg-green-100 transition">
            <MapPinIcon className="w-4 h-4" />
            <span>Track</span>
          </Link>

          {/* <CartDropdown /> */}

          <Link href="/profile" className="p-2 text-gray-600 hover:bg-gray-100 rounded-full border border-gray-100">
            <UserIcon className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </header>
  );
}