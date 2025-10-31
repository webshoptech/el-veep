"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getItemDetail } from "@/lib/api/items";
import ItemDetail from "../components/ItemDetail";
import ItemDetailSkeleton from "../components/ItemDetailSkeleton";
import Item from "@/interfaces/items";

export default function ItemDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const [product, setProduct] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;

    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await getItemDetail(slug);
        setProduct(response.data.product);
      } catch {
        setError("Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [slug]);

  if (loading) return <ItemDetailSkeleton />;
  if (error)
    return (
      <div className="p-10 text-center text-red-500 font-medium">
        {error}
      </div>
    );
  if (!product)
    return (
      <div className="p-10 text-center text-gray-500">
        Product not found.
      </div>
    );

  return <ItemDetail product={product} />;
}
