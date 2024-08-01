import Axios from "axios";

// let urls = {
//     test: `https://zljf0gm0-3000.inc1.devtunnels.ms/api/v1/`,
//     development: 'https://zljf0gm0-3000.inc1.devtunnels.ms/api/v1/',
//     production: 'https://zljf0gm0-3000.inc1.devtunnels.ms/api/v1/'
// }
let urls = {
  test: `http://localhost:8080`,
  development: "https://ayru-project.onrender.com/api/",

  // development: "https://7q0xhxzq-8080.inc1.devtunnels.ms/api/",
  // development: "http://localhost:8080/api/",
  production: "https://ayru-project.onrender.com/api/",
};
const api = Axios.create({
  baseURL: urls[process.env.NODE_ENV || "production"],
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

export default api;
