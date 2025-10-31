export interface ProductItem {
  id: number;
  quantity: number;
}

export interface ShippingRatePayload {
  street?: string;
  city?: string;
  state?: string;
  zip?: string;
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  country: string;
  ip: string;
  products: ProductItem[];
  note?: string;
  preferred_date?: string;
  type?: string;
}
