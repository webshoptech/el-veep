import api from "./axios";
 
interface CheckoutItem {
  id: number;
  qty: number;
}

export const checkoutStripe = async (
  email: string,
  items: CheckoutItem[],
  total: number
) => {
  const params = new URLSearchParams();
  params.append("email", email);
  params.append("items", JSON.stringify(items));
  params.append("total", String(total));

  const res = await api.get(`/checkout/stripe?${params.toString()}`);
  return res.data; // expects { checkout_url: "https://checkout.stripe.com/..." }
};