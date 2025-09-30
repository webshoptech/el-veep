"use client";
import { useState } from "react";
import Image from "next/image";
import {
  StarIcon,
  HeartIcon,
  MinusIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import Item from "@/interfaces/items";

export default function ItemDetail({ product }: { product: Item }) {
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isInCart, setIsInCart] = useState(false);
  const [selectedImage, setSelectedImage] = useState(
    product.images?.[0] || "/placeholder.png"
  );

  const increaseQty = () => setQuantity((q) => q + 1);
  const decreaseQty = () => setQuantity((q) => (q > 1 ? q - 1 : 1));
  const salesPrice = parseFloat(product.sales_price);
  const regularPrice = parseFloat(product.regular_price);

  const discount =
    regularPrice > salesPrice
      ? Math.round(((regularPrice - salesPrice) / regularPrice) * 100)
      : 0;

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-10">
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
                    ? "border-orange-500"
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
          {/* Title */}
          <h1 className="text-2xl font-semibold">{product.title}</h1>

          {/* Ratings */}
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

          {/* Price */}
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-gray-900">
              {salesPrice} USD
            </span>
            {regularPrice > salesPrice && (
              <>
                <span className="line-through text-gray-400">
                  {regularPrice} USD
                </span>
                <span className="text-red-500 font-semibold">
                  -{discount}%
                </span>
              </>
            )}
          </div>

          {/* Description */}
          <p className="text-gray-600">
            {product.description.length > 155
              ? product.description.slice(0, 155) + "..."
              : product.description}
          </p>

          {/* Colors */}
          {/* <div>
            <p className="text-sm text-gray-600 mb-2">Colour:</p>
            <div className="flex gap-3">
              {["blue", "green", "pink", "red"].map((color) => (
                <button
                  key={color}
                  className={`w-6 h-6 rounded-full border-2 ${
                    color === "blue"
                      ? "bg-blue-500"
                      : color === "green"
                      ? "bg-green-500"
                      : color === "pink"
                      ? "bg-pink-500"
                      : "bg-red-500"
                  }`}
                />
              ))}
            </div>
          </div> */}

          {/* Sizes */}
          {/* <div>
            <p className="text-sm text-gray-600 mb-2">Size:</p>
            <div className="flex gap-3">
              {["S", "M", "L", "XL", "2XL", "3XL"].map((size) => (
                <button
                  key={size}
                  className={`px-3 py-1 border rounded-md ${
                    size === "L"
                      ? "bg-orange-500 text-white border-orange-500"
                      : "border-gray-300 text-gray-700"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div> */}

          {/* Quantity + Cart + Favorite */}
          <div className="flex items-center gap-4 mt-5">
            <div className="flex items-center  rounded-md">
              <button onClick={decreaseQty} className="p-2  bg-gray-200 text-gray-500 rounded-full cursor-pointer">
                <MinusIcon className="h-4 w-4" />
              </button>
              <span className="px-4 text-gray-500 font-semibold">{quantity}</span>
              <button onClick={increaseQty} className="p-2 bg-gray-200 text-gray-500 rounded-full cursor-pointer">
                <PlusIcon className="h-4 w-4" />
              </button>
            </div>
            <button
              onClick={() => setIsInCart(!isInCart)}
              className={`p-2 rounded-full font-medium cursor-pointer ${isInCart
                  ? "bg-green-500 hover:bg-green-600 text-white"
                  : "bg-orange-500 hover:bg-orange-600 text-white"
                }`}
            >
              {isInCart ? "In Cart" : "Add to Cart"}
            </button>
            <button
              onClick={() => setIsFavorite(!isFavorite)}
              className={`p-2 border rounded-full hover:bg-gray-100 cursor-pointer ${isFavorite ? "bg-red-100" : ""
                }`}
            >
              <HeartIcon
                className={`h-6 w-6 ${isFavorite ? "text-red-500" : "text-gray-600"
                  }`}
              />
            </button>
          </div>

          {/* Category / Shop */}
          <div className="text-sm text-gray-500 space-y-1">
            <p>Category: {product.category?.name}</p>
            <p>Sold by: {product.shop?.name}</p>
          </div>
        </div>

        {/* Right: Sidebar Info */}
        <div className="space-y-4">
          {/* Delivery & Return */}
          <div className="border rounded-lg p-4 shadow-sm">
            <h3 className="font-semibold mb-2">Delivery & Return Policy</h3>
            <p className="text-sm text-gray-600">
              Estimated delivery time 1-9 business days
            </p>
            <p className="text-sm text-gray-600">
              Express Delivery Available
            </p>
          </div>

          {/* Return Policy */}
          <div className="border rounded-lg p-4 shadow-sm">
            <h3 className="font-semibold mb-2">Return Policy</h3>
            <p className="text-sm text-gray-600">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
          </div>

          {/* Seller Info */}
          <div className="border rounded-lg p-4 shadow-sm">
            <h3 className="font-semibold mb-2">Seller Information</h3>
            <p className="text-sm text-gray-600">{product.shop?.name}</p>
            <button className="text-sm text-blue-600 underline">
              View Shop
            </button>
          </div>

          {/* Reviews */}
          <div className="border rounded-lg p-4 shadow-sm">
            <h3 className="font-semibold mb-2">Reviews</h3>
            <p className="text-sm text-gray-600">
              {product.shop?.name} - {product.reviews?.length || 0} reviews
            </p>
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <StarIcon
                  key={i}
                  className={`h-5 w-5 ${i < product.average_rating
                      ? "text-yellow-400"
                      : "text-gray-300"
                    }`}
                />
              ))}
              <span className="ml-2 text-gray-600">
                {product.average_rating.toFixed(1)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
