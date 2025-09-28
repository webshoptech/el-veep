"use client";

import { useState } from "react";
import Image from "next/image";
import { StarIcon, HeartIcon, MinusIcon, PlusIcon } from "@heroicons/react/24/outline";
import Item from "@/interfaces/items";

export default function ItemDetail({ product }: { product: Item }) {
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isInCart, setIsInCart] = useState(false);

  const increaseQty = () => setQuantity((q) => q + 1);
  const decreaseQty = () => setQuantity((q) => (q > 1 ? q - 1 : 1));

  // convert prices from string → number for calculations
  const salesPrice = parseFloat(product.sales_price);
  const regularPrice = parseFloat(product.regular_price);

  const discount =
    regularPrice > salesPrice
      ? Math.round(((regularPrice - salesPrice) / regularPrice) * 100)
      : 0;

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Product Image */}
        <div className="lg:col-span-2">
          <Image
            src={product.images?.[0] || "/placeholder.png"}
            alt={product.title}
            width={600}
            height={600}
            className="rounded-lg shadow-md w-full object-cover"
          />
        </div>

        {/* Product Details */}
        <div className="flex flex-col">
          <h1 className="text-2xl font-semibold mb-2">{product.title}</h1>

          {/* Ratings */}
          <div className="flex items-center mb-3">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <StarIcon
                  key={i}
                  className={`h-5 w-5 ${
                    i < product.average_rating ? "text-yellow-400" : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="ml-2 text-gray-500">
              ({product.reviews?.length || 0} customer reviews)
            </span>
          </div>

          {/* Price */}
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xl font-bold text-gray-900">
              {salesPrice} USD
            </span>
            {regularPrice > salesPrice && (
              <>
                <span className="line-through text-gray-400">
                  {regularPrice} USD
                </span>
                <span className="text-red-500 font-semibold">-{discount}%</span>
              </>
            )}
          </div>

          {/* Description */}
          <p className="text-gray-600 mb-4">{product.description}</p>

          {/* Quantity & Cart */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center border rounded-md">
              <button onClick={decreaseQty} className="p-2">
                <MinusIcon className="h-4 w-4" />
              </button>
              <span className="px-4">{quantity}</span>
              <button onClick={increaseQty} className="p-2">
                <PlusIcon className="h-4 w-4" />
              </button>
            </div>
            <button
              onClick={() => setIsInCart(!isInCart)}
              className={`px-6 py-3 rounded-md font-medium ${
                isInCart
                  ? "bg-green-500 hover:bg-green-600 text-white"
                  : "bg-orange-500 hover:bg-orange-600 text-white"
              }`}
            >
              {isInCart ? "In Cart" : "Add to Cart"}
            </button>
            <button
              onClick={() => setIsFavorite(!isFavorite)}
              className={`p-3 border rounded-md hover:bg-gray-100 ${
                isFavorite ? "bg-red-100" : ""
              }`}
            >
              <HeartIcon
                className={`h-6 w-6 ${isFavorite ? "text-red-500" : "text-gray-600"}`}
              />
            </button>
          </div>

          {/* Category / Shop */}
          <div className="text-sm text-gray-500">
            <p>Category: {product.category?.name}</p>
            <p>Sold by: {product.shop?.name}</p>
          </div>
        </div>
      </div>
    </div>
  );
}