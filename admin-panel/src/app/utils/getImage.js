// src/utils/getImage.js
import api from "@/api";

export const getImage = async (key) => {
  try {
    const response = await api.get(`/image/${key}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching image:", error);
    return null;
  }
};