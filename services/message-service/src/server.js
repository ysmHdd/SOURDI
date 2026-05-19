require("dotenv").config();

const app = require("./app");
const connecterBaseDeDonnees = require("./configuration/baseDeDonnees");

const PORT = process.env.PORT || 5006;

const demarrerServeur = async () => {
  await connecterBaseDeDonnees();

  app.listen(PORT, () => {
    console.log(`Message-service lancé sur http://localhost:${PORT}`);
  });
};

demarrerServeur();