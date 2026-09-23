import axios from "axios";
import repo from "./repo";

const api = axios.create({
  baseURL: `${repo}api/`,
  withCredentials: true, // jika menggunakan cookie/session
});

export default api;
