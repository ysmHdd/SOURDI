const coinsService = require("../services/coinsService");

const recompenseQuiz = async (req, res) => {
  try {
    const eleveId = req.utilisateur.id;
    const token = req.headers.authorization.split(" ")[1];
    const result = await coinsService.recompenseQuiz(eleveId, req.body, token);
    res.json(result);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

const recompenseLecon = async (req, res) => {
  try {
    const eleveId = req.utilisateur.id;
    const token = req.headers.authorization.split(" ")[1];
    const result = await coinsService.recompenseLecon(eleveId, req.body, token);
    res.json(result);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

const recompenseConnexion = async (req, res) => {
  try {
    const eleveId = req.utilisateur.id;
    const token = req.headers.authorization.split(" ")[1];
    const result = await coinsService.recompenseConnexion(eleveId, token);
    res.json(result);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

const recompenseAutoEvaluation = async (req, res) => {
  try {
    const eleveId = req.utilisateur.id;
    const token = req.headers.authorization.split(" ")[1];
    const result = await coinsService.recompenseAutoEvaluation(eleveId, req.body, token);
    res.json(result);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

const recompenseTemps = async (req, res) => {
  try {
    const eleveId = req.utilisateur.id;
    const token = req.headers.authorization.split(" ")[1];
    const result = await coinsService.recompenseTemps(eleveId, req.body, token);
    res.json(result);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

const getHistorique = async (req, res) => {
  try {
    const eleveId = req.utilisateur.id;
    const historique = await coinsService.getHistorique(eleveId);
    res.json(historique);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

const getStats = async (req, res) => {
  try {
    const eleveId = req.utilisateur.id;
    const stats = await coinsService.getStats(eleveId);
    res.json(stats);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

module.exports = {
  recompenseQuiz,
  recompenseLecon,
  recompenseConnexion,
  recompenseAutoEvaluation,
  recompenseTemps,
  getHistorique,
  getStats,
};