const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const exerciceRoutes = require("./routes/exerciceRoutes");

const app = express();

const uploadDir = path.join(__dirname, "../uploads/cours");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

app.use(cors());
app.use(express.json());

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.use("/api/exercices", exerciceRoutes);

app.get("/health", (req, res) => {
  res.json({ status: "ok", service: "exercice-service" });
});

module.exports = app;