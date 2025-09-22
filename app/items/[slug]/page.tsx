import { getItemDetail } from "@/lib/api/items";
import ItemDetail from "../components/ItemDetail";
import Item from "@/interfaces/items";

export default async function ItemDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = params;
  const response = await getItemDetail(slug);
  const product: Item = response.data.product;
  return <ItemDetail product={product} />;
}