const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Admin-service SOURDI opérationnel" });
});

// Routes (on les ajoutera au fur et à mesure)
app.use("/api/admin/utilisateurs", require("./routes/utilisateurRoutes"));
app.use("/api/admin/transactions", require("./routes/transactionRoutes"));
app.use("/api/admin/produits", require("./routes/produitRoutes")); 

module.exports = app;