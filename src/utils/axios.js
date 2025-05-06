import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL ,
  withCredentials: true, // si tu utilises JWT ou cookies
});

export default api;

