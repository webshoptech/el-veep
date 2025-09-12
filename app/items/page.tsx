"use client";

import { useEffect, useState, FC, Fragment } from "react";
import Image from "next/image";
import {
  ShoppingBagIcon,
  HeartIcon,
  FunnelIcon,
  CheckIcon,
  ChevronUpDownIcon,
  MagnifyingGlassIcon,
  StarIcon,
} from "@heroicons/react/24/outline";
import Product from "@/interfaces/items";
import { useRouter, useSearchParams } from "next/navigation";
import Skeleton from "react-loading-skeleton";
import { listItems } from "@/lib/api/items";
import {
  Dialog,
  DialogPanel,
  Transition,
  TransitionChild,
  Listbox,
  RadioGroup,
} from "@headlessui/react";
import { listCategories } from "@/lib/api/category";

interface CategoryPageProps {
  params: { slug: string };
}

const Items: FC<CategoryPageProps> = ({ }) => {
  const searchParams = useSearchParams();
  const router = useRouter();

  // ✅ get type from query, default to "products"
  const queryType = searchParams.get("type") || "products";
  const queryCategory = searchParams.get("category") || "";

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    limit: 12,
    offset: 0,
    search: "",
    type: queryType,
    status: "active",
    category: queryCategory, // ✅ now from query
    sort: "latest",
    max_price: undefined as number | undefined,
    availability: undefined as string | undefined,
    rating: undefined as number | undefined,
  });

  const [showFilters, setShowFilters] = useState(false);

  // Fetch products
  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoading(true);

        const res = await listItems(
          filters.limit,
          filters.offset,
          filters.search,
          filters.type,
          filters.status,
          filters.category,
          filters.sort,
          filters.max_price,
          filters.availability
        );

        setProducts(res.data || []);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [filters]);

  // ✅ update filters when query param changes
  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      type: queryType,
      category: queryCategory,
    }));
  }, [queryType, queryCategory]);


  // Skeleton UI while loading
  const renderSkeletons = () =>
    Array.from({ length: 12 }).map((_, idx) => (
      <div key={idx} className="bg-white rounded-xl overflow-hidden shadow relative">
        <Skeleton height={224} className="w-full h-56" />
        <div className="p-3">
          <Skeleton width={80} height={16} className="mb-2" />
          <Skeleton height={16} className="mb-2" />
          <Skeleton height={16} width={60} />
        </div>
      </div>
    ));
  const sortOptions = [
    { value: "latest", label: "Latest" },
    { value: "price_low", label: "Price: Low to High" },
    { value: "price_high", label: "Price: High to Low" },
  ];

  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await listCategories(
          20, 0, "", "products", "active"
        );
        setCategories(res.data || []);
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };
    fetchCategories();
  }, []);
  return (
    <div className="p-4 bg-red-50">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        {/* Filters Drawer Button */}
        <button
          className="flex items-center gap-2 text-red-500   cursor-default rounded border bg-white py-2 pl-3 pr-10 text-left shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
          onClick={() => setShowFilters(true)}
        >
          <FunnelIcon className="h-5 w-5" />
          Filters
        </button>
        {/* Sort Dropdown */}
        <div className="flex items-center gap-4">
          <Listbox
            value={filters.sort}
            onChange={(value) => setFilters({ ...filters, sort: value })}
          >
            <div className="relative z-50">
              <Listbox.Button className="relative w-38 text-red-500 cursor-default rounded border bg-white py-2 pl-3 pr-10 text-left shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-red-500">
                <span className="block truncate">
                  {sortOptions.find((opt) => opt.value === filters.sort)?.label}
                </span>
                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                  <ChevronUpDownIcon className="h-5 w-5 text-gray-400" />
                </span>
              </Listbox.Button>
              <Transition
                as={Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-xs shadow-lg ring-1 ring-black/5 focus:outline-none">
                  {sortOptions.map((option) => (
                    <Listbox.Option
                      key={option.value}
                      value={option.value}
                      className={({ active }) =>
                        `relative cursor-default select-none py-2 pl-8 pr-4 ${active ? "bg-red-100 text-red-900" : "text-gray-900"
                        }`
                      }
                    >
                      {({ selected }) => (
                        <>
                          <span
                            className={`block truncate ${selected ? "font-medium" : "font-normal"
                              }`}
                          >
                            {option.label}
                          </span>
                          {selected && (
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-red-600">
                              <CheckIcon className="h-4 w-4" aria-hidden="true" />
                            </span>
                          )}
                        </>
                      )}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </Transition>
            </div>
          </Listbox>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Drawer (Headless UI Dialog) */}
        <Transition show={showFilters} as={Fragment}>
          <Dialog as="div" className="relative z-50" onClose={setShowFilters}>
            {/* Backdrop */}
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-black/40" />
            </TransitionChild>

            {/* Drawer Panel */}
            <div className="fixed inset-0 flex">
              <TransitionChild
                as={Fragment}
                enter="transform transition ease-in-out duration-300"
                enterFrom="-translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-300"
                leaveFrom="translate-x-0"
                leaveTo="-translate-x-full"
              >
                <DialogPanel className="relative w-60 max-w-sm bg-red-50 shadow-xl h-screen rounded-r-4xl p-4">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="flex items-center gap-2 font-semibold">
                      <FunnelIcon className="h-5 w-5" /> Filters
                    </h2>
                    <button onClick={() => setShowFilters(false)}>✕</button>
                  </div>

                  {/* Filter Content */}
                  <div className="space-y-6">
                    {/* 🔎 Search */}
                    <div>
                      <h3 className="mb-2 font-normal">Search</h3>
                      <div className="relative">
                        <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Search products..."
                          value={filters.search}
                          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                          className="w-full text-black focus:outline-none rounded  shadow-sm bg-white pl-10 pr-3 py-2 text-sm focus:ring-1 focus:ring-red-500 focus:border-red-500"
                        />
                      </div>
                    </div>

                    {/*  Categories */}
                    <div>
                      <h3 className="mb-2 font-normal">Categories</h3>
                      <Listbox
                        value={filters.category}
                        onChange={(value) => setFilters({ ...filters, category: value })}
                      >
                        <div className="relative">
                          <Listbox.Button className="relative w-full cursor-default rounded  bg-white py-2 pl-3 pr-10 text-left text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-red-500">
                            <span className="block truncate text-black">
                              {categories.find((c) => c.id === filters.category)?.name ||
                                "All Categories"}
                            </span>
                            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                              <ChevronUpDownIcon className="h-5 w-5 text-gray-400" />
                            </span>
                          </Listbox.Button>
                          <Listbox.Options className="absolute text-black z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-sm shadow-lg ring-1 ring-black/5 focus:outline-none">
                            {categories.map((cat) => (
                              <Listbox.Option key={cat.id} value={cat.id}>
                                {({ selected }) => (
                                  <span
                                    className={`block truncate px-3 py-2 cursor-pointer ${selected ? "bg-red-500 text-white" : "hover:bg-gray-100"
                                      }`}
                                  >
                                    {cat.name}
                                  </span>
                                )}
                              </Listbox.Option>
                            ))}
                          </Listbox.Options>
                        </div>
                      </Listbox>
                    </div>

                    {/* ⭐ Rating */}
                    <div>
                      <h3 className="mb-2 font-normal">Rating</h3>
                      <RadioGroup
                        value={filters.rating}
                        onChange={(value) => setFilters({ ...filters, rating: value })}
                        className="space-y-2"
                      >
                        {[5, 4, 3, 2, 1].map((star) => (
                          <RadioGroup.Option key={star} value={star} as={Fragment}>
                            {({ checked }) => (
                              <label className="flex items-center gap-2 cursor-pointer">
                                <div className="flex">
                                  {Array.from({ length: 5 }).map((_, i) => (
                                    <StarIcon
                                      key={i}
                                      className={`h-5 w-5 ${i < star
                                        ? "text-yellow-400"
                                        : "text-gray-300"
                                        }`}
                                    />
                                  ))}
                                </div>
                                <span className={`${checked ? "text-red-500 font-medium" : ""}`}>
                                  {star}
                                </span>
                              </label>
                            )}
                          </RadioGroup.Option>
                        ))}
                      </RadioGroup>
                    </div>

                    {/* 💰 Price */}
                    <div>
                      <h3 className="mb-2 font-normal ">Price</h3>
                      <input
                        type="range"
                        min="10"
                        max="1000"
                        value={filters.max_price || 1000}
                        className="w-full accent-red-500 text-red-500"
                        onChange={(e) =>
                          setFilters({ ...filters, max_price: parseInt(e.target.value) })
                        }
                      />
                      {filters.max_price && (
                        <p className="mt-1 inline-block rounded bg-red-100 px-2 py-1 text-xs text-red-500">
                          Up to ${filters.max_price}
                        </p>
                      )}
                    </div>
                  </div>
                </DialogPanel>
              </TransitionChild>
            </div>
          </Dialog>
        </Transition>

        {/* Product Grid */}
        <main className="col-span-12 lg:col-span-9">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {loading
              ? renderSkeletons()
              : products.map((product) => (
                <div
                  onClick={() => router.push(`/items/${product.slug}`)}
                  key={product.id}
                  className="bg-white rounded-xl overflow-hidden shadow relative group cursor-pointer"
                >
                  {/* Image */}
                  <div className="relative">
                    <Image
                      src={product.images[0] || "/placeholder.png"}
                      alt={product.title}
                      width={400}
                      height={400}
                      className="w-full h-56 object-cover"
                    />
                    {/* Floating Buttons */}
                    <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition">
                      <button className="bg-white rounded-full p-2 shadow hover:bg-red-100">
                        <ShoppingBagIcon className="w-5 h-5 text-black" />
                      </button>
                      <button className="bg-white rounded-full p-2 shadow hover:bg-red-100">
                        <HeartIcon className="w-5 h-5 text-black" />
                      </button>
                    </div>
                  </div>

                  {/* Info */}
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
                      ${product.sales_price}
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Items;
