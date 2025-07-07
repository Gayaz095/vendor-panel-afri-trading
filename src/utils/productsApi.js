import axios from "axios";
import { BASE_URL } from "./backendUrl";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const getVendorProducts = async (vendorId) => {
  try {
    const response = await api.post("/products/getVendorProducts", {
      vendorId,
    });
    return response.data.data;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const createProduct = async (productData) => {
  try {
    const response = await api.post("/products/createProduct", productData);
    return response.data;
  } catch (error) {
    throw new Error("Error adding product: " + error.message);
  }
};

export const updateProduct = async (vendorId, productData) => {
  try {
    const response = await api.post("/products/updateProduct", {
      ...productData,
      vendorId
    });
    return response.data;
  } catch (error) {
    throw new Error("Error updating product: " + error.message);
  }
};

export const deleteProduct = async (vendorId, productId) => {
  try {
    const response = await api.post("/products/deleteProduct", {
      id: productId,
      vendorId,
    });
    return response.data;
  } catch (error) {
    throw new Error("Error deleting product: " + error.message);
  }
};
