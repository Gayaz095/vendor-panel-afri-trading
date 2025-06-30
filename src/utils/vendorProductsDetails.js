// vendorProductsDetails.js
import axios from "axios";

const API_URL =
  "https://auto-spare-parts-backend-gbsc.onrender.com/products/createProduct";

export const postProduct = async (productData) => {
  const response = await axios.post(API_URL, productData);
  return response.data;
};
