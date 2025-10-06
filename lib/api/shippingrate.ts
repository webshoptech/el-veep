import { ShippingRatePayload } from "@/interfaces/shippingRate";
import noAuthApi from "./noAuthApi";

export const createShippingRate = (payload: ShippingRatePayload) => {
  return noAuthApi.post("/shipping/rates", payload).then((res) => res.data);
};
