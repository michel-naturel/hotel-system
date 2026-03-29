import axios from "axios";

const token = localStorage.getItem("authToken");

export const api = axios.create({
  baseURL: "http://localhost:3000",
  headers: token ? { Authorization: `Bearer ${token}` } : {}
});