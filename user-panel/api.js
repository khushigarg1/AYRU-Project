import Axios from "axios";
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

import { setupCache } from 'axios-cache-interceptor';

// let urls = {
//     test: `https://zljf0gm0-3000.inc1.devtunnels.ms/api/v1/`,
//     development: 'https://zljf0gm0-3000.inc1.devtunnels.ms/api/v1/',
//     production: 'https://zljf0gm0-3000.inc1.devtunnels.ms/api/v1/'
// }
let urls = {
  test: `https://ayru-project.onrender.com/`,
  // development: "https://7q0xhxzq-8080.inc1.devtunnels.ms/api/",
  development: "http://[::1]:8080/api/",
  // development: "https://ayru-project.onrender.com/api/",
  // production: "https://ayru-project.onrender.com/api/",
};
const api = Axios.create({
  baseURL: urls[process.env.NODE_ENV || "production"],
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

// const cacheConfig = {
//   ttl: 1000 * 60 * 5,
//   interpretHeader: true,
// };

// setupCache(api, cacheConfig);
// axios.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem('token');
//     if (token) {
//       config.headers['Authorization'] = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

export default api;