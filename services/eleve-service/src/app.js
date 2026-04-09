const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Eleve-service SOURDI opérationnel" });
});

app.use("/api/eleve/profil", require("./routes/profilRoutes"));
app.use("/api/eleve/coins", require("./routes/coinsRoutes"));
app.use("/api/eleve/marketplace", require("./routes/marketplaceRoutes"));

module.exports = app;