//imageUpload.js
import axios from "axios";
import { BASE_URL } from "./backendUrl";

export const imageUpload = async (formData) => {
  try {
    const response = await axios.post(`${BASE_URL}/upload`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
