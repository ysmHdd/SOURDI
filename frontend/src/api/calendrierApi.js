import axios from "axios";

const API_URL = "http://localhost:5008/api/calendrier";

const getToken = () => {
  return (
    localStorage.getItem("token") ||
    localStorage.getItem("sourdi_token") ||
    localStorage.getItem("accessToken") ||
    localStorage.getItem("authToken")
  );
};

const config = () => {
  const token = getToken();

  return {
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  };
};

export const getSeancesCalendrier = () => {
  return axios.get(API_URL, config());
};

export const ajouterSeanceCalendrier = (data) => {
  return axios.post(API_URL, data, config());
};

export const modifierSeanceCalendrier = (id, data) => {
  return axios.put(`${API_URL}/${id}`, data, config());
};

export const supprimerSeanceCalendrier = (id) => {
  return axios.delete(`${API_URL}/${id}`, config());
};