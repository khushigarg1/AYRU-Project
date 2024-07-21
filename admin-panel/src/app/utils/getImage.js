// src/utils/getImage.js
import api from "@/api";

export const getImage = async (key) => {
  console.log("key", key);
  try {
    const response = await api.get(`/image/${key}`);
    console.log("ressss", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching image:", error);
    return null;
  }
};