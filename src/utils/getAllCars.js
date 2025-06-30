import axios from "axios";
import { BASE_URL } from "./backendUrl";


const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json", 
  },
});

export const getAllCars = async (data) => {
  try {
    const response = await api.get("/cars/getAllCars", data);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Cannot Fetch Cars" };
  }

};
