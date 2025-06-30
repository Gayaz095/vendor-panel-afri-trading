import axios from "axios";
import { BASE_URL } from "./backendUrl";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const getSubCategories = async () => {
  try {
    const response = await api.get("/categories/getSubCategories");
    return response.data; 
  } catch (error) {
    throw error.response?.data || { message: "Cannot Fetch Sub Categories" };
  }
};
