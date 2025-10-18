import { ShippingRatePayload } from "@/interfaces/shippingRate";
import api from "./axios";

export const processOrder = async (payload: ShippingRatePayload) => {
  const res = await api.get("/processing-order", {
    params: {
      ...payload,
      device_name: navigator.userAgent,
    },
  });

  return res.data;
};
