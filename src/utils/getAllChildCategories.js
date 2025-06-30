import axios from "axios";
import { BASE_URL } from "./backendUrl";


const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const getAllChildCategories = async (data) => {
  try {
    const response = await api.get("/categories/getAllChildCategories", data);
    return response.data.data;
  } catch (error) {
    throw error.response?.data || { message: "Cannot Fetch Child Categories" };
  }
};
