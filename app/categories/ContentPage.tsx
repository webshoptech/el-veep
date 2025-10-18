
"use client";

import { useQuery } from "@tanstack/react-query";
import { listCategories } from "@/lib/api/category";
import Category from "@/interfaces/category";
import Image from "next/image";
import Link from "next/link";
import Skeleton from "react-loading-skeleton";
import { useSearchParams } from "next/navigation";


export default function CategoriesPageContent() {
  const searchParams = useSearchParams();
  const type = searchParams.get("type") || "products";

  const { data, isLoading } = useQuery({
    queryKey: ["categories", type],
    queryFn: () => listCategories(50, 0, undefined, type),
    enabled: !!type,
  });

  return (
    <div className="px-4 py-10 bg-green-50 h-screen">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 capitalize">
         Our Categories
      </h2>

      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {Array.from({ length: 10 }).map((_, i) => (
            <Skeleton key={i} height={180} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {data?.categories?.map((cat: Category) => (
            <Link
              key={cat.id}
              href={`/items?category=${cat.id}&type=${type}`}
              className="group relative block rounded-lg overflow-hidden shadow hover:shadow-lg transition"
            >
              <div className="relative w-full h-40">
                <Image
                  src={cat.image || "/placeholder.jpg"}
                  alt={cat.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-green-500 text-white text-sm font-medium px-3 py-1 rounded">
                {cat.name}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
