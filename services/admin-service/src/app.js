const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.get("/", (req, res) => {
  res.json({ message: "Admin-service SOURDI opérationnel" });
});

app.use("/api/admin/utilisateurs", require("./routes/utilisateurRoutes"));
app.use("/api/admin/transactions", require("./routes/transactionRoutes"));
app.use("/api/admin/produits", require("./routes/produitRoutes"));

module.exports = app;