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

export const genererImageIA = (data) => {
  return axios.post(`${API_AI}/generate-image`, data);
};

export const genererMemoryGameIA = (data) => {
  return axios.post(`${API_AI}/game/memory`, data);
};

export const genererHangmanGameIA = (data) => {
  return axios.post(`${API_AI}/game/hangman`, data);
};

export const genererSpeedGameIA = (data) => {
  return axios.post(`${API_AI}/game/speed`, data);
};