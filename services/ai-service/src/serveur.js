const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config();

const aiRoutes = require("./routes/aiRoutes");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connecté");
  })
  .catch((err) => {
    console.error("Erreur MongoDB :", err);
  });

app.use("/api/ai", aiRoutes);

const PORT = process.env.PORT || 5007;

app.listen(PORT, () => {
  console.log(`AI service running on port ${PORT}`);
});