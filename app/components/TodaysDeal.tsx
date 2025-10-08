"use client";

import { useEffect, useState, FC } from "react";
import Image from "next/image";
import { ShoppingBagIcon, HeartIcon, ArrowRightCircleIcon } from "@heroicons/react/24/outline";
import { listItems } from "@/lib/api/items";
import Item from "@/interfaces/items";
import { useRouter } from "next/navigation";
import Skeleton from "react-loading-skeleton";

const TodaysDeal: FC = () => {
    const [products, setProducts] = useState<Item[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchItems = async () => {
            try {
                setLoading(true);
                const res = await listItems(12, 0, "", "products", "active");
                setProducts(res.data);
            } catch (error) {
                console.error("Error fetching products:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchItems();
    }, []);

    const renderSkeletons = () =>
        Array.from({ length: 12 }).map((_, idx) => (
            <div
                key={idx}
                className="bg-white rounded-xl overflow-hidden shadow relative"
            >
                <Skeleton height={224} className="w-full h-56" />
                <div className="p-3">
                    <Skeleton width={80} height={16} className="mb-2" />
                    <Skeleton height={16} className="mb-2" />
                    <Skeleton height={16} width={60} />
                </div>
            </div>
        ));

    return (
        <section className="">
            <div className="max-w-full mx-auto px-4 md:px-6 lg:px-8 pb-8">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl md:text-xl font-bold text-white">
                        Today`s Deal for You
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
                                {/* Product Image */}
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
                                        ${product.sales_price}
                                    </p>
                                </div>
                            </div>
                        ))}
                </div>
            </div>
        </section>
    );
};

export default TodaysDeal;
