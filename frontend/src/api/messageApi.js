import axios from "./axios";

const MESSAGE_URL = "http://localhost:5006/api/messages";

export const getConversationEleve = (marquerCommeLu = false) => {
  return axios.get(`${MESSAGE_URL}/eleve/conversation`, {
    params: {
      marquerCommeLu,
      t: Date.now(),
    },
  });
};

export const envoyerMessageEleve = (formData) => {
  return axios.post(`${MESSAGE_URL}/eleve/envoyer`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const supprimerMessagesEleve = () => {
  return axios.delete(`${MESSAGE_URL}/eleve/conversation/messages`);
};

export const signalerMessageEleve = (
  conversationId,
  messageId,
  typeHarcelement,
  details = ""
) => {
  return axios.post(
    `${MESSAGE_URL}/eleve/signaler/${conversationId}/${messageId}`,
    {
      typeHarcelement,
      details,
    }
  );
};

export const getConversationsAdmin = () => {
  return axios.get(`${MESSAGE_URL}/admin/conversations`, {
    params: {
      t: Date.now(),
    },
  });
};

export const getConversationAdmin = (conversationId) => {
  return axios.get(`${MESSAGE_URL}/admin/conversations/${conversationId}`, {
    params: {
      t: Date.now(),
    },
  });
};

export const repondreConversationAdmin = (conversationId, formData) => {
  return axios.post(
    `${MESSAGE_URL}/admin/conversations/${conversationId}/repondre`,
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  );
};

export const terminerConversationAdmin = (conversationId) => {
  return axios.patch(
    `${MESSAGE_URL}/admin/conversations/${conversationId}/terminer`
  );
};

export const getSignalementsAdmin = () => {
  return axios.get(`${MESSAGE_URL}/admin/signalements`, {
    params: {
      t: Date.now(),
    },
  });
};

export const traiterSignalementAdmin = (signalementId) => {
  return axios.patch(
    `${MESSAGE_URL}/admin/signalements/${signalementId}/traiter`
  );
};