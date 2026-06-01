import axios from "./axios";

const API_AI = "http://localhost:5007/api/ai";

export const envoyerMessageIA = (data) => {
  return axios.post(`${API_AI}/chat`, data);
};

export const envoyerDevoirIA = (formData) => {
  return axios.post(`${API_AI}/homework`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};