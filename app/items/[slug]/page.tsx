import { getItemDetail } from "@/lib/api/items";
import ItemDetail from "../components/ItemDetail";
 
export default async function ItemDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const response = await getItemDetail(slug);
  const product = response.data.product;
  return <ItemDetail product={product} />;
}
