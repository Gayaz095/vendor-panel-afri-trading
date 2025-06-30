import axios from "axios";
import { BASE_URL } from "./backendUrl";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const vendorLogin = async (data) => {
  try {
    const response = await api.post("/allusers/vendorLogin", data);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Login Failed" };
  }
};
