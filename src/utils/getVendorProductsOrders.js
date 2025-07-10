import axios from "axios";
import { BASE_URL } from "./backendUrl";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const getVendorProductsOrders = async (vendorId) => {
  try {
    const response = await api.post("/order/get-vendor-products-orders", {
      vendorId,
    });
    return response.data;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const updateVendorProductsOrdersStatus = async (
  orderId,
  vendorId,
  vendorStatus
) => {
  try {
    const response = await api.post(
      "/order/update-vendor-products-order-status",
      {
        orderId,
        vendorId,
        vendorStatus,
      }
    );

    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message);
  }
};
