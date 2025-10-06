import { ShippingRatePayload } from "@/interfaces/shippingRate";
import noAuthApi from "./noAuthApi";

export const getShippingRate = async (payload: ShippingRatePayload) => {
    const res = await noAuthApi.post("/get-shipping/rates", payload); 
    return res.data;
  };