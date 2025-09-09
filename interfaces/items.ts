export default interface Item {
  id: number;
  title: string;
  slug: string;
  description: string;
  sales_price: string;  
  regular_price: string;
  quantity: number;
  notify_user: boolean;
  images: string[];
  image_public_ids: string[];
  status: "active" | "inactive" | string;
  type: string;
  shop_id: number;
  category_id: number;
  views: number;
  pricing_model: string | null;
  delivery_method: string | null;
  estimated_delivery_time: string | null;
  available_days: string | null;
  available_from: string | null;
  available_to: string | null;
  created_at: string;  
  updated_at: string;  
  average_rating: number;
  variations: Variation[];
}

export interface Variation {
  id?: number;
  name?: string;
  price?: string;
  [key: string]: unknown;
}
