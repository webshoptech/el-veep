"use client";

import { useEffect, useState, FC } from "react";
import Image from "next/image";
import {
  ShoppingBagIcon,
  HeartIcon,
  ArrowRightCircleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";
import { listItems } from "@/lib/api/items";
import Item from "@/interfaces/items";
import { useRouter } from "next/navigation";
import Skeleton from "react-loading-skeleton";
import { formatAmount } from "@/utils/formatCurrency";

const RecommendedProducts: FC = () => {
  const [products, setProducts] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Pagination State
  const [offset, setOffset] = useState(0);
  const limit = 12; 

  const router = useRouter();

  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoading(true); 
        const res = await listItems(limit, offset, "", "products", "active");
        const allProducts = Array.isArray(res.data) ? res.data : [];
        setProducts(allProducts);
         
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [offset]); // Re-run when offset changes

  const handleNext = () => setOffset((prev) => prev + limit);
  const handlePrevious = () => setOffset((prev) => Math.max(0, prev - limit));

  const renderSkeletons = () =>
    Array.from({ length: limit }).map((_, idx) => (
      <div key={idx} className="bg-white rounded-xl overflow-hidden shadow relative">
        <Skeleton height={224} className="w-full h-56" />
        <div className="p-3">
          <Skeleton width={80} height={16} className="mb-2" />
          <Skeleton height={16} className="mb-2" />
          <Skeleton height={16} width={60} />
        </div>
      </div>
    ));

  return (
    <section className="mb-4">
      <div className="max-w-full mx-auto px-4 md:px-6 lg:px-8 pb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl md:text-xl font-bold text-[#1C422D]">
            Latest products
          </h2>
          <ArrowRightCircleIcon
            className="w-6 h-6 text-green-500 cursor-pointer"
            onClick={() => router.push("/items")}
          />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6">
          {loading
            ? renderSkeletons()
            : products.map((product) => (
                <div
                  onClick={() => router.push(`/items/${product.slug}`)}
                  key={product.id}
                  className="bg-white rounded-xl overflow-hidden shadow relative group cursor-pointer"
                >
                  <div className="relative">
                    <Image
                      src={product.images?.[0] || "/placeholder.png"}
                      alt={product.title}
                      width={400}
                      height={400}
                      className="w-full h-56 object-cover"
                    />
                    <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition">
                      <button className="bg-white rounded-full p-2 shadow hover:bg-green-100">
                        <ShoppingBagIcon className="w-5 h-5 text-black" />
                      </button>
                      <button className="bg-white rounded-full p-2 shadow hover:bg-green-100">
                        <HeartIcon className="w-5 h-5 text-black" />
                      </button>
                    </div>
                  </div>

                  <div className="p-3">
                    <div className="flex items-center gap-1 text-yellow-400 mb-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span key={i}>
                          {i < product.average_rating ? "★" : "☆"}
                        </span>
                      ))}
                    </div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-1 line-clamp-2">
                      {product.title}
                    </h3>
                    <p className="text-sm font-semibold text-gray-800">
                      {formatAmount(product.sales_price)}
                    </p>
                  </div>
                </div>
              ))}
        </div>

        {/* --- Fancy Pagination Buttons --- */}
        <div className="mt-12 flex items-center justify-center gap-4">
          <button
            onClick={handlePrevious}
            disabled={offset === 0 || loading}
            className={`flex cursor-pointer items-center gap-2 px-5 py-2.5 rounded-full font-medium transition-all duration-200 
              ${offset === 0 
                ? "bg-gray-100 text-gray-400 cursor-not-allowed" 
                : "bg-white text-gray-700 shadow-sm border border-gray-200 hover:border-green-500 hover:text-green-600"
              }`}
          >
            <ChevronLeftIcon className="w-5 h-5" />
            Previous
          </button>

          <div className="text-sm font-medium text-gray-500">
            Page {Math.floor(offset / limit) + 1}
          </div>

          <button
            onClick={handleNext}
            disabled={products.length < limit || loading}
            className={`flex cursor-pointer items-center gap-2 px-5 py-2.5 rounded-full font-medium transition-all duration-200 
              ${products.length < limit 
                ? "bg-gray-100 text-gray-400 cursor-not-allowed" 
                : "bg-[#1C422D] text-white hover:bg-green-800 shadow-md active:scale-95"
              }`}
          >
            Next
            <ChevronRightIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default RecommendedProducts;