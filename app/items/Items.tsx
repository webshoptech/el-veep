"use client";

import { useEffect, useState, FC, useMemo, useCallback } from "react";
import Image from "next/image";
import {
  ShoppingBagIcon,
  HeartIcon,
  AdjustmentsHorizontalIcon,
  XMarkIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";
import Product, { Category } from "@/interfaces/items";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import Skeleton from "react-loading-skeleton";
import { listItems } from "@/lib/api/items";
import debounce from "lodash.debounce";
import { formatAmount } from "@/utils/formatCurrency";
import Input from "../components/common/Input";
import SelectDropdown from "../components/common/SelectDropdown";

interface ItemsProps {
  params: { slug: string };
}

interface ApiResponse {
  category_info: Category | null;
  data: Product[];
  total: number;
}



const Items: FC<ItemsProps> = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  // --- State ---
  const [products, setProducts] = useState<Product[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);
  const [categoryInfo, setCategoryInfo] = useState<Category | null>(null);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");

  const LIMIT = 24;
  const currentPage = Number(searchParams.get("page")) || 1;

  const availabilityOptions = [
    { label: "All Items", value: "" },
    { label: "In Stock", value: "in_stock" },
    { label: "Out of Stock", value: "out_of_stock" },
  ];

  const sortOptions = [
    { label: "Newest Arrivals", value: "latest" },
    { label: "Price: Low to High", value: "price_low" },
    { label: "Price: High to Low", value: "price_high" },
    { label: "Best Rated", value: "rating" },
  ];

  // --- URL Management ---
  const updateQuery = useCallback(
    (updates: Record<string, any>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([key, value]) => {
        if (value === undefined || value === "" || value === null)
          params.delete(key);
        else params.set(key, String(value));
      });
      router.push(`${pathname}?${params.toString()}`);
    },
    [searchParams, pathname, router],
  );

  // --- Fetch Logic ---
  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoading(true);
        const res: ApiResponse = await listItems(
          LIMIT,
          (currentPage - 1) * LIMIT,
          searchParams.get("search") || "",
          searchParams.get("type") || "products",
          "active",
          searchParams.get("category") || "",
          searchParams.get("sort") || "latest",
          searchParams.get("max_price")
            ? Number(searchParams.get("max_price"))
            : undefined,
          searchParams.get("availability") || undefined,
        );
        setProducts(res.data || []);
        setTotalItems(res.total || 0);
        setCategoryInfo(res.category_info || null);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, [searchParams, currentPage]);

  const totalPages = Math.ceil(totalItems / LIMIT);

  const debouncedUpdateQuery = useMemo(
    () => debounce((val: string) => updateQuery({ search: val, page: 1 }), 500),
    [updateQuery]
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchTerm(val); // Immediate UI update
    debouncedUpdateQuery(val); // Debounced URL update
  };
  // --- Components ---
 const FilterContent = () => (
    <div className="space-y-6">
      {/* Type Filter */}
      <div>
        <h3 className="font-bold text-gray-900 mb-3 text-xs uppercase tracking-widest">Service Type</h3>
        <div className="flex flex-col gap-3">
          {["products", "services"].map((t) => (
            <label key={t} className="flex items-center gap-3 cursor-pointer group">
              <input
                type="radio"
                checked={(searchParams.get("type") || "products") === t}
                onChange={() => updateQuery({ type: t, page: 1 })}
                className="w-5 h-5 accent-green-600 border-gray-300"
              />
              <span className="text-sm capitalize text-gray-600 group-hover:text-green-600 transition-colors">
                {t}
              </span>
            </label>
          ))}
        </div>
      </div>

      <hr className="border-gray-100" />

      {/* Max Price Filter */}
      <div>
        <h3 className="font-bold text-gray-900 mb-3 text-xs uppercase tracking-widest">Max Price</h3>
        <input
          type="range" min="0" max="100000" step="1000"
          value={searchParams.get("max_price") || 100000}
          onChange={(e) => updateQuery({ max_price: e.target.value, page: 1 })}
          className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-2 font-bold">
          <span>{formatAmount(0)}</span>
          <span className="text-green-700 font-black">
            {formatAmount(Number(searchParams.get("max_price") || 100000))}
          </span>
        </div>
      </div>

      <hr className="border-gray-100" />

      {/* Availability Filter using SelectDropdown */}
      <div>
        <h3 className="font-bold text-gray-900 mb-3 text-xs uppercase tracking-widest">Availability</h3>
        <SelectDropdown
          className="w-full"
          options={availabilityOptions}
          value={
            availabilityOptions.find((o) => o.value === (searchParams.get("availability") || "")) ||
            availabilityOptions[0]
          }
          onChange={(opt) => updateQuery({ availability: opt.value, page: 1 })}
        />
      </div>

      <button
        onClick={() => router.push(pathname)}
        className="w-full py-3 text-xs font-bold text-red-500 border border-red-100 rounded-xl hover:bg-red-50 transition-colors"
      >
        CLEAR ALL FILTERS
      </button>
    </div>
  );

  return (
    <div className="bg-gray-50 min-h-screen">
    {/* 1. TOP HEADER (Search & Sort) */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200 px-4 py-4 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-4 items-end">
          <div className="w-full md:flex-1">
            <Input
              label="Search"
              id="main-search"
              placeholder="Search products, brands and categories"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>

          <div className="flex w-full md:w-auto gap-2 items-end">
            <button
              onClick={() => setIsMobileFilterOpen(true)}
              className="flex-1 md:hidden h-[46px] flex items-center justify-center gap-2 bg-white border border-gray-300 rounded-lg text-sm font-bold shadow-sm"
            >
              <AdjustmentsHorizontalIcon className="w-5 h-5 text-green-600" />
              FILTERS
            </button>
            <div className="flex-1 md:w-64">
              <span className="text-[10px] font-bold text-gray-400 uppercase mb-1 block ml-1">Sort By</span>
              <SelectDropdown
                className="w-full"
                options={sortOptions}
                value={
                  sortOptions.find((o) => o.value === (searchParams.get("sort") || "latest")) ||
                  sortOptions[0]
                }
                onChange={(opt) => updateQuery({ sort: opt.value, page: 1 })}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-12 gap-6">
        {/* 2. DESKTOP SIDEBAR */}
        <aside className="hidden md:block col-span-3 bg-white p-5 rounded-lg shadow-sm h-fit sticky top-24 border border-gray-100">
          <FilterContent />
        </aside>

        {loading ? (
          // Skeleton for the header
          <div className="mb-6 bg-white p-6 rounded-lg shadow-md">
            <Skeleton circle width={144} height={144} className="mb-4" />
            <Skeleton height={36} width={250} className="mb-2" />
            <Skeleton count={2} />
          </div>
        ) : (
          categoryInfo && (
            // The actual header content
            <div className="mb-6 bg-white p-6 rounded-lg shadow-md flex flex-col md:flex-row items-center gap-6">
              {categoryInfo.image && (
                <Image
                  src={categoryInfo.image}
                  alt={categoryInfo.name}
                  width={150}
                  height={150}
                  className="w-36 h-36 rounded-full object-cover border-4 border-green-100 flex-shrink-0"
                />
              )}
              <div className="text-center md:text-left">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {categoryInfo.name}
                </h1>
                <div
                  className="text-gray-600 prose"
                  dangerouslySetInnerHTML={{ __html: categoryInfo.description }}
                />
              </div>
            </div>
          )
        )}
        {/* 3. PRODUCT GRID */}
        <main className="col-span-12 md:col-span-9 space-y-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
            {loading
              ? Array.from({ length: 8 }).map((_, i) => (
                  <Skeleton key={i} height={300} className="rounded-lg" />
                ))
              : products.map((product) => (
                  <div
                    key={product.id}
                       onClick={() => router.push(`/items/${product.slug}`)}
                    className="bg-white rounded-md overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer group border border-gray-100"
                  >
                    <div className="relative aspect-square">
                      <Image
                        src={product.images[0] || "/placeholder.png"}
                        alt={product.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="p-3">
                      <h3 className="text-sm text-gray-700 line-clamp-2 h-10">
                        {product.title}
                      </h3>
                      <p className="text-lg font-bold text-gray-900 mt-1">
                        {formatAmount(product.sales_price)}
                      </p>
                      <div className="flex items-center gap-1 mt-1">
                        <span className="text-xs text-yellow-500 font-bold">
                          ★ {product.average_rating}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
          </div>

          {/* 4. FANCY PAGINATION */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-1 pt-6 border-t border-gray-200">
              <button
                disabled={currentPage === 1}
                onClick={() => updateQuery({ page: currentPage - 1 })}
                className="p-2 disabled:opacity-30 hover:bg-gray-100 rounded-full"
              >
                <ChevronLeftIcon className="w-5 h-5" />
              </button>
              {Array.from({ length: totalPages }).map((_, i) => {
                const p = i + 1;
                return (
                  <button
                    key={p}
                    onClick={() => updateQuery({ page: p })}
                    className={`w-9 h-9 rounded-md text-sm font-bold transition-colors ${
                      currentPage === p
                        ? "bg-green-600 text-white"
                        : "hover:bg-gray-100 text-gray-600"
                    }`}
                  >
                    {p}
                  </button>
                );
              })}
              <button
                disabled={currentPage === totalPages}
                onClick={() => updateQuery({ page: currentPage + 1 })}
                className="p-2 disabled:opacity-30 hover:bg-gray-100 rounded-full"
              >
                <ChevronRightIcon className="w-5 h-5" />
              </button>
            </div>
          )}
        </main>
      </div>

      {/* 5. MOBILE FILTER SLIDE-UP DRAWER */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsMobileFilterOpen(false)}
          />
          <div className="absolute bottom-0 w-full bg-white rounded-t-3xl p-6 shadow-2xl animate-in slide-in-from-bottom duration-300 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-black">Filters</h2>
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="p-2 bg-gray-100 rounded-full"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
            <FilterContent />
            <button
              onClick={() => setIsMobileFilterOpen(false)}
              className="w-full mt-6 py-4 bg-green-600 text-white font-bold rounded-xl shadow-lg shadow-green-200"
            >
              SHOW RESULTS ({totalItems})
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Items;
