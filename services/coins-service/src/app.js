const express = require("express");
const cors = require("cors");
const coinsRoutes = require("./routes/coinsRoutes");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/coins", coinsRoutes);

app.get("/health", (req, res) => res.json({ status: "ok", service: "coins-service" }));

module.exports = app;