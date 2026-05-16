import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5007/api/ai",
});

export const envoyerMessageIA = async (data) => {
  return API.post("/chat", data);
};