const express = require("express");
const cors = require("cors");
const exerciceRoutes = require("./routes/exerciceRoutes");

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/exercices", exerciceRoutes);
app.get("/health", (req, res) => res.json({ status: "ok", service: "exercice-service" }));

module.exports = app;