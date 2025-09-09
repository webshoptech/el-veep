"use client";

import { FC, useEffect, useState } from "react";
import { Banner } from "@/interfaces/banners";
import Category from "@/interfaces/category";
import { listBanners } from "@/lib/api/banners";
import { listCategories } from "@/lib/api/category";
import { ShoppingBagIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Skeleton from "react-loading-skeleton";

const CategorySection: FC = () => {
  const router = useRouter();
  const [productCategories, setProductCategories] = useState<Category[]>([]);
  const [serviceCategories, setServiceCategories] = useState<Category[]>([]);
  const [productBanner, setProductBanner] = useState<Banner[]>([]);
  const [serviceBanner, setServiceBanner] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [productCat, serviceCat, productBan, serviceBan] =
          await Promise.all([
            listCategories(6, 0, "", "products", "active"),
            listCategories(6, 0, "", "services", "active"),
            listBanners("home_product_banner"),
            listBanners("home_service_banner"),
          ]);

        setProductCategories(productCat.data);
        setServiceCategories(serviceCat.data);
        setProductBanner(productBan.data);
        setServiceBanner(serviceBan.data);
      } catch (error) {
        console.error("Error fetching categories/banners:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const renderCategories = (categories: Category[]) =>
    loading
      ? Array.from({ length: 6 }).map((_, idx) => (
        <div
          key={idx}
          className="relative rounded-xl overflow-hidden group cursor-pointer"
        >
          <Skeleton height={224} className="w-full h-56 md:h-56" />
          <div className="absolute bottom-3 left-3 right-3">
            <Skeleton height={32} className="rounded-lg" />
          </div>
        </div>
      ))
      : categories.map((cat) => (
        <div
          onClick={() => router.push(`/items/${cat.slug}`)}
          key={cat.id}
          className="relative rounded-xl overflow-hidden group cursor-pointer"
        >
          <Image
            src={cat.image}
            alt={cat.name}
            width={400}
            height={400}
            loading="lazy"
            className="w-full h-56 md:h-56 object-cover group-hover:scale-105 transition"
          />
          <div className="absolute bottom-3 left-3 right-3">
            <div className="bg-red-500 text-white text-center py-2 rounded-lg font-semibold text-sm md:text-base">
              {cat.name}
            </div>
          </div>
        </div>
      ));

  const renderBanner = (banner?: Banner) =>
    loading ? (
      <div className="relative col-span-1 md:col-span-1 bg-white rounded-2xl overflow-hidden">
        <Skeleton height={400} className="w-full h-full" />
      </div>
    ) : banner ? (
      <div
        className="relative col-span-1 md:col-span-1 bg-white rounded-2xl overflow-hidden cursor-pointer"
        onClick={() =>
          router.push(
            `/items/${banner.type === "home_service_banner" ? "services" : "products"
            }`
          )
        }
      >
        <Image
          src={banner.banner}
          alt={banner.type || "Banner"}
          width={600}
          height={800}
          priority
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/70"></div>
          <div className="relative z-10 flex flex-col items-center text-center">
            <p className="text-3xl font-bold text-white">
              {banner.type === "home_service_banner"
                ? "Nearby Service Providers"
                : "Essential Daily Needs"}
            </p>
            <button className="mt-4 cursor-pointer bg-white text-black px-6 py-2 rounded-full text-sm font-semibold flex items-center gap-2 hover:bg-gray-200 transition">
              <ShoppingBagIcon className="w-5 h-5" /> Shop Now
            </button>
          </div>
        </div>
      </div>
    ) : null;

  return (
    <>
      {/* Product Section */}
      <section className="py-6">
        <div className="max-w-full mx-auto px-4 md:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-8">
            Products
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {renderBanner(productBanner[0])}
            <div className="col-span-1 md:col-span-2 grid grid-cols-2 md:grid-cols-3 gap-6">
              {renderCategories(productCategories)}
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-6">
        <div className="max-w-full mx-auto px-4 md:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-8">
            Services
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {renderBanner(serviceBanner[0])}
            <div className="col-span-1 md:col-span-2 grid grid-cols-2 md:grid-cols-3 gap-6">
              {renderCategories(serviceCategories)}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default CategorySection;
