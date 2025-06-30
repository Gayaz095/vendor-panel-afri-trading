import axios from "axios";
import { BASE_URL } from "./backendUrl";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const getAllCarModels = async (data) => {
  try {
    const response = await api.get("/cars/getAllCarModels", data);
    return response.data.carModels;
  } catch (error) {
    throw error.response?.data || { message: "Cannot Fetch Car Model" };
  }
};
