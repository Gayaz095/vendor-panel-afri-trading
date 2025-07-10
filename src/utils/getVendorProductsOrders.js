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
    console.log("API response in getVendorProductsOrders:", response.data);
    return response.data;
  } catch (error) {
    throw new Error(error.message);
  }
};
