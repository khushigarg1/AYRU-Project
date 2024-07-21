import axios, { AxiosInstance } from "axios";

// Replace 'your_key_id' and 'your_key_secret' with your actual Razorpay API key and secret
const keyId = "rzp_test_fv9kQNy0lcEfkH";
const keySecret = "EPifJZPSfPW0ZIjBHC19DEbV";

// Encode the keyId and keySecret in Base64
const authToken = Buffer.from(`${keyId}:${keySecret}`).toString("base64");

const axiosInstance: AxiosInstance = axios.create({
  baseURL: "https://api.razorpay.com/v1",
  headers: {
    Authorization: `Basic ${authToken}`,
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
