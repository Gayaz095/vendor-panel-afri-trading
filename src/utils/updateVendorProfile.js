import { BASE_URL } from "./backendUrl";
import axios from "axios";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const updateVendorProfile = async (payload) => {
  try {
    const response = await api.post("/allusers/updateVendorProfile", payload);
    return response.data;
  } catch (error) {
    console.error("Error updating vendor profile:", error);
    throw (
      error.response?.data || { message: "Failed to update vendor profile" }
    );
  }
};
