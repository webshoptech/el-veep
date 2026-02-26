"use client";

import { FC, useEffect, useState, useMemo, useCallback } from "react";
import { Banner } from "@/interfaces/banners";
import Category from "@/interfaces/category";
import { listBanners } from "@/lib/api/banners";
import { listCategories } from "@/lib/api/category";
import { ShoppingBagIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Skeleton from "react-loading-skeleton";

interface CategorySectionProps {
  type: "products" | "services";
}

const CategorySection: FC<CategorySectionProps> = ({ type }) => {
  const router = useRouter();

  const [categories, setCategories] = useState<Category[]>([]);
  const [banner, setBanner] = useState<Banner | null>(null);
  const [loading, setLoading] = useState(true);

  const handleClick = useCallback(
    (slug: string) => {
      router.push(`/items?category=${slug}&type=${type}`);
    },
    [router, type],
  );

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);
        // Determine banner key based on type
        const bannerKey =
          type === "products" ? "home_product_banner" : "home_service_banner";

        const [{ categories: cats, banner: catBanner }, banners] =
          await Promise.all([
            listCategories(9, 0, "", type, "active"), // Dynamic type here
            listBanners(bannerKey), // Dynamic banner key here
          ]);

        setCategories(cats || []);
        setBanner(banners?.data?.[0] || catBanner || null);
      } catch (error) {
        console.error("Error fetching categories/banners:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [type]); // Re-fetch when type changes

  const renderCategories = useMemo(
    () =>
      loading
        ? Array.from({ length: 6 }).map((_, idx) => (
            <div key={idx} className="rounded-xl overflow-hidden">
              <Skeleton height={224} />
            </div>
          ))
        : categories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => handleClick(cat.slug)}
              className="relative rounded-xl overflow-hidden group cursor-pointer border border-green-100 bg-white"
            >
              <Image
                src={cat.image || "/placeholder.png"}
                alt={cat.name}
                width={400}
                height={400}
                loading="lazy"
                className="w-full h-48 md:h-56 object-cover group-hover:scale-105 transition duration-300"
              />
              <div className="absolute bottom-3 left-3 right-3">
                <div className="bg-[#1B412C] text-white text-center py-2 rounded-lg font-semibold text-sm md:text-base">
                  {cat.name}
                </div>
              </div>
            </div>
          )),
    [categories, loading, handleClick],
  );

  const renderBanner = useMemo(
    () =>
      loading ? (
        <Skeleton height={400} className="rounded-2xl" />
      ) : banner ? (
        <div
          className="relative h-[300px] md:h-full min-h-[350px] bg-gray-200 rounded-2xl overflow-hidden cursor-pointer group"
          onClick={() => router.push(`/items?type=${type}`)}
        >
          <Image
            src={banner.banner}
            alt={banner.type || "Banner"}
            fill
            priority
            className="object-cover group-hover:scale-105 transition duration-700"
          />
          <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center p-6 text-center">
            <h3 className="text-2xl md:text-4xl font-black text-white mb-4 drop-shadow-md">
              {type === "services" ? "Expert Services" : "Quality Products"}
            </h3>
            <button className="bg-green-600 text-white px-8 py-3 rounded-full font-bold flex items-center gap-2 hover:bg-green-700 transition-all shadow-xl">
              <ShoppingBagIcon className="w-5 h-5" />
              {type === "services" ? "Book Now" : "Shop Now"}
            </button>
          </div>
        </div>
      ) : null,
    [banner, loading, router, type],
  );

  return (
    <section className="py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-end mb-6">
          <div>
            <h2 className="text-2xl font-black text-[#1C422D] capitalize">
              Explore {type}
            </h2>
            <div className="w-12 h-1 bg-green-500 rounded-full mt-1" />
          </div>
          <button
            onClick={() => router.push(`/items?type=${type}`)}
            
            className="text-sm font-bold text-green-700 flex items-center gap-1 hover:underline"
          >
            See All <ChevronRightIcon className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">{renderBanner}</div>
          <div className="lg:col-span-2 grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {renderCategories}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
