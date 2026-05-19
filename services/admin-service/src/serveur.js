require("dotenv").config();

const app = require("./app");
const connecterBaseDeDonnees = require("./configuration/baseDeDonnees");

const PORT = process.env.PORT || 5002;

const demarrerServeur = async () => {
  await connecterBaseDeDonnees();
  app.listen(PORT, () => {
    console.log(`Admin-service lancé sur http://localhost:${PORT}`);
  });
};

demarrerServeur();