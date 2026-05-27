const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connecterDB = require("./config/db");
const demarrerRappelSeances = require("./jobs/rappelSeancesJob");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

connecterDB();

app.use("/api/calendrier", require("./routes/calendrierRoutes"));

const PORT = process.env.PORT || 5008;
demarrerRappelSeances();
app.listen(PORT, () => {
  console.log(`Calendrier service running on port ${PORT}`);
});