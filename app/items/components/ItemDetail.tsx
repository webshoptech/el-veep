"use client";
import { useState, useMemo } from "react";
import Image from "next/image";
import {
    StarIcon,
    HeartIcon,
    MinusIcon,
    PlusIcon,
    CheckIcon,
} from "@heroicons/react/24/outline";
import Item from "@/interfaces/items";
import ItemTabs from "./ItemTabs";
import { useCart } from "@/context/CartContext";
import { formatAmount } from "@/utils/formatCurrency";
import truncate from 'html-truncate';
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";


const reviews = [
    {
        id: 1,
        name: "Kristin Watson",
        avatar: "/images/icon.png",
        rating: 5,
        comment: "Duis at ullamcorper nulla, eu dictum eros.",
        date: "2 min ago",
    },
    {
        id: 2,
        name: "Jane Cooper",
        avatar: "/images/icon.png",
        rating: 4,
        comment:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.",
        date: "30 Apr, 2024",
    },
];

export default function ItemDetail({ product }: { product: Item }) {
    const [quantity, setQuantity] = useState(1);
    const [isFavorite, setIsFavorite] = useState(false);
    const [selectedImage, setSelectedImage] = useState(
        product.images?.[0] || "/placeholder.png"
    );

    const { addToCart, cart } = useCart();

    const isInCart = useMemo(
        () => cart?.some((item) => item.id === product.id),
        [cart, product.id]
    );

    const increaseQty = () => setQuantity((q) => q + 1);
    const decreaseQty = () => setQuantity((q) => (q > 1 ? q - 1 : 1));
    const salesPrice = parseFloat(product.sales_price);
    const regularPrice = parseFloat(product.regular_price);

    const limit = 155;
    const rawDescription = product.description;

    const truncatedHtml = truncate(rawDescription, limit, {
        ellipsis: '...'
    });

    const discount =
        regularPrice > salesPrice
            ? Math.round(((regularPrice - salesPrice) / regularPrice) * 100)
            : 0;

    const router = useRouter();

    const [added, setAdded] = useState(false);

    const handleAddToCart = () => {
        if (!isInCart) {
            addToCart({
                id: product.id,
                title: product.title,
                price: salesPrice,
                image: selectedImage,
                qty: quantity,
                stock: true,
            });

            toast.success("Item added to cart!");
            setAdded(true);

            // Show animation briefly before showing View Cart
            setTimeout(() => {
                setAdded(false);
            }, 1000);
        } else {
            router.push("/carts");
        }
    };
    return (
        <>
            <div className="bg-white">
                <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-10">
                    {/* Left: Image */}
                    <div className="flex gap-4 lg:col-span-1">
                        <div className="flex flex-col gap-3">
                            {product.images?.map((img, i) => (
                                <Image
                                    key={i}
                                    src={img}
                                    alt={`${product.title} ${i}`}
                                    width={80}
                                    height={80}
                                    className={`rounded-md cursor-pointer border ${selectedImage === img
                                        ? "border-green-500"
                                        : "border-gray-200"
                                        }`}
                                    onClick={() => setSelectedImage(img)}
                                />
                            ))}
                        </div>

                        <div className="flex-1">

                            <Image
                                src={selectedImage}
                                alt={product.title}
                                width={700}
                                height={700}
                                className="rounded-lg shadow-md w-full object-cover"
                            />

                        </div>

                    </div>

                    <div className="flex flex-col space-y-4">
                        <h1 className="text-2xl font-semibold">{product.title}</h1>

                        <div className="flex items-center">
                            <div className="flex text-yellow-400">
                                {[...Array(5)].map((_, i) => (
                                    <StarIcon
                                        key={i}
                                        className={`h-5 w-5 ${i < product.average_rating
                                            ? "text-yellow-400"
                                            : "text-gray-300"
                                            }`}
                                    />
                                ))}
                            </div>
                            <span className="ml-2 text-gray-500">
                                {product.average_rating.toFixed(1)} •{" "}
                                {product.reviews?.length || 0} reviews
                            </span>
                        </div>

                        <div className="flex items-center gap-2">
                            <span className="text-xl font-bold text-gray-900">
                                {formatAmount(salesPrice)}
                            </span>
                            {regularPrice > salesPrice && (
                                <>
                                    <span className="line-through text-gray-400">
                                        {formatAmount(regularPrice)}
                                    </span>
                                    <span className="text-green-500 font-semibold">
                                        -{discount}%
                                    </span>
                                </>
                            )}
                        </div>

                        <p className="text-gray-600">
                            <span
                                dangerouslySetInnerHTML={{ __html: truncatedHtml }}
                            />
                        </p>

                        <div className="flex items-center gap-4 mt-5">
                            <div className="flex items-center rounded-md">
                                <button
                                    onClick={decreaseQty}
                                    className="p-2 bg-gray-200 text-gray-500 hover:text-white hover:bg-green-400 rounded-full cursor-pointer"
                                >
                                    <MinusIcon className="h-4 w-4" />
                                </button>
                                <span className="px-4 text-gray-500 font-semibold">
                                    {quantity}
                                </span>
                                <button
                                    onClick={increaseQty}
                                    className="p-2 bg-gray-200 text-gray-500 hover:text-white hover:bg-green-400 rounded-full cursor-pointer"
                                >
                                    <PlusIcon className="h-4 w-4" />
                                </button>
                            </div>

                            <button
                                onClick={handleAddToCart}
                                className={`px-6 py-2 rounded-full font-medium text-sm flex items-center justify-center gap-2 transition-all duration-300 cursor-pointer ${added
                                        ? "bg-green-600 text-white scale-105"
                                        : isInCart
                                            ? "bg-green-600 text-white hover:bg-green-700"
                                            : "bg-green-400 text-white hover:bg-green-600"
                                    }`}
                            >
                                {added ? (
                                    <>
                                        <CheckIcon className="h-5 w-5 text-white animate-bounce" />
                                        Added!
                                    </>
                                ) : isInCart ? (
                                    "View Cart"
                                ) : (
                                    "Add to Cart"
                                )}
                            </button>

                            <button
                                onClick={() => setIsFavorite(!isFavorite)}
                                className={`p-1.5 border rounded-full hover:bg-gray-100 cursor-pointer ${isFavorite ? "bg-green-100" : ""
                                    }`}
                            >
                                <HeartIcon
                                    className={`h-5 w-5 ${isFavorite ? "text-green-500" : "text-gray-600"
                                        }`}
                                />
                            </button>
                        </div>

                        <div className="text-sm text-gray-500 space-y-1">
                            <p>Category: {product.category?.name}</p>
                        </div>
                    </div>
                </div>
            </div>
            <ItemTabs description={product.description} reviews={reviews} />
        </>
    );
}
