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
  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("search") || "",
  );

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
    [updateQuery],
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
        <h3 className="mb-3 text-xs font-bold tracking-widest text-gray-900 uppercase">
          Item Type
        </h3>
        <div className="flex flex-col gap-3">
          {["products", "services"].map((t) => (
            <label
              key={t}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <input
                type="radio"
                checked={(searchParams.get("type") || "products") === t}
                onChange={() => updateQuery({ type: t, page: 1 })}
                className="w-5 h-5 border-gray-300 accent-green-600"
              />
              <span className="text-sm text-gray-600 capitalize transition-colors group-hover:text-green-600">
                {t}
              </span>
            </label>
          ))}
        </div>
      </div>

      <hr className="border-gray-100" />

      {/* Max Price Filter */}
      <div>
        <h3 className="mb-3 text-xs font-bold tracking-widest text-gray-900 uppercase">
          Max Price
        </h3>
        <input
          type="range"
          min="0"
          max="100000"
          step="1000"
          value={searchParams.get("max_price") || 100000}
          onChange={(e) => updateQuery({ max_price: e.target.value, page: 1 })}
          className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
        />
        <div className="flex justify-between mt-2 text-xs font-bold text-gray-500">
          <span>{formatAmount(0)}</span>
          <span className="font-black text-green-700">
            {formatAmount(Number(searchParams.get("max_price") || 100000))}
          </span>
        </div>
      </div>

      <hr className="border-gray-100" />

      {/* Availability Filter using SelectDropdown */}
      <div>
        <h3 className="mb-3 text-xs font-bold tracking-widest text-gray-900 uppercase">
          Availability
        </h3>
        <SelectDropdown
          className="w-full"
          options={availabilityOptions}
          value={
            availabilityOptions.find(
              (o) => o.value === (searchParams.get("availability") || ""),
            ) || availabilityOptions[0]
          }
          onChange={(opt) => updateQuery({ availability: opt.value, page: 1 })}
        />
      </div>

      <button
        onClick={() => router.push(pathname)}
        className="w-full py-3 text-xs font-bold text-red-500 transition-colors border border-red-100 rounded-xl hover:bg-red-50"
      >
        CLEAR ALL FILTERS
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 1. TOP HEADER (Search & Sort) - MAINTAINED STICKY */}
      <div className="sticky top-0 z-40 px-4 py-4 bg-white border-b border-gray-200 shadow-sm">
        <div className="flex flex-col items-end gap-4 mx-auto max-w-7xl md:flex-row">
          <div className="w-full md:flex-1">
            <Input
              label=""
              id="main-search"
              placeholder="Search products, brands and categories"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>

          <div className="flex items-end w-full gap-2 md:w-auto">
            <button
              onClick={() => setIsMobileFilterOpen(true)}
              className="flex-1 md:hidden h-[46px] flex items-center justify-center gap-2 bg-white border border-gray-300 rounded-lg text-sm font-bold shadow-sm"
            >
              <AdjustmentsHorizontalIcon className="w-5 h-5 text-green-600" />
              FILTERS
            </button>
            <div className="flex-1 md:w-64">
              <SelectDropdown
                className="w-full"
                options={sortOptions}
                value={
                  sortOptions.find(
                    (o) => o.value === (searchParams.get("sort") || "latest"),
                  ) || sortOptions[0]
                }
                onChange={(opt) => updateQuery({ sort: opt.value, page: 1 })}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6 px-4 py-6 mx-auto max-w-7xl">
        {/* 2. DESKTOP SIDEBAR - MAINTAINED */}
        <aside className="hidden col-span-3 md:block">
          <div className="sticky p-5 bg-white border border-gray-100 rounded-lg shadow-sm h-fit top-28">
            <FilterContent />
          </div>
        </aside>

        {/* 3. MAIN CONTENT AREA (Header + Grid) */}
        <main className="col-span-12 space-y-6 md:col-span-9">
          {/* CATEGORY INFO HEADER - RE-LAYOUTED FOR FLEXIBILITY */}
          {loading ? (
            <div className="p-6 bg-white border border-gray-100 shadow-sm rounded-xl">
              <div className="flex flex-col items-center gap-6 md:flex-row">
                <Skeleton circle width={120} height={120} />
                <div className="flex-1 w-full">
                  <Skeleton height={30} width="60%" className="mb-2" />
                  <Skeleton count={2} />
                </div>
              </div>
            </div>
          ) : (
            categoryInfo && (
              <div className="overflow-hidden bg-white border border-gray-100 shadow-sm rounded-xl">
                <div className="flex flex-col items-center gap-6 p-6 md:p-8 md:flex-row md:items-start">
                  {categoryInfo.image && (
                    <div className="flex-shrink-0">
                      <Image
                        src={categoryInfo.image}
                        alt={categoryInfo.name}
                        width={140}
                        height={140}
                        className="object-cover border-4 rounded-full shadow-sm w-28 h-28 md:w-36 md:h-36 border-green-50"
                      />
                    </div>
                  )}
                  <div className="flex-1 text-center md:text-left">
                    <h1 className="mb-2 text-2xl font-black text-gray-900 md:text-3xl">
                      {categoryInfo.name}
                    </h1>
                    {categoryInfo.description && (
                      <div
                        className="text-sm prose text-gray-600 md:text-base prose-green max-w-none line-clamp-3 md:line-clamp-none"
                        dangerouslySetInnerHTML={{
                          __html: categoryInfo.description,
                        }}
                      />
                    )}
                    <p className="mt-4 text-xs font-bold tracking-widest text-green-600 uppercase">
                      {totalItems} Items Available
                    </p>
                  </div>
                </div>
              </div>
            )
          )}

          {/* PRODUCT GRID - MAINTAINED */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 md:gap-4">
            {loading
              ? Array.from({ length: 8 }).map((_, i) => (
                  <Skeleton key={i} height={300} className="rounded-lg" />
                ))
              : products.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => router.push(`/items/${product.slug}`)}
                    className="overflow-hidden transition-shadow bg-white border border-gray-100 rounded-md shadow-sm cursor-pointer hover:shadow-md group"
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
                      <h3 className="h-10 text-sm text-gray-700 line-clamp-2">
                        {product.title
                          .toLowerCase()
                          .split(" ")
                          .map(
                            (word) =>
                              word.charAt(0).toUpperCase() + word.slice(1),
                          )
                          .join(" ")}
                      </h3>
                      <p className="mt-1 text-lg font-bold text-gray-900">
                        {formatAmount(product.sales_price)}
                      </p>
                      <div hidden className="flex items-center gap-1 mt-1">
                        <span className="text-xs font-bold text-yellow-500">
                          ★ {product.average_rating}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
          </div>

          {/* PAGINATION - MAINTAINED */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-1 pt-6 border-t border-gray-200">
              <button
                disabled={currentPage === 1}
                onClick={() => updateQuery({ page: currentPage - 1 })}
                className="p-2 rounded-full disabled:opacity-30 hover:bg-gray-100"
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
                className="p-2 rounded-full disabled:opacity-30 hover:bg-gray-100"
              >
                <ChevronRightIcon className="w-5 h-5" />
              </button>
            </div>
          )}
        </main>
      </div>

      {/* 5. MOBILE FILTER DRAWER - MAINTAINED */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsMobileFilterOpen(false)}
          />
          <div className="absolute bottom-0 w-full bg-white rounded-t-3xl p-6 shadow-2xl animate-in slide-in-from-bottom duration-300 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
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
              className="w-full py-4 mt-6 font-bold text-white bg-green-600 shadow-lg rounded-xl shadow-green-200"
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
