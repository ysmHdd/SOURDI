require("dotenv").config();
const app = require("./app");
const connecterDB = require("./configuration/baseDeDonnees");

const PORT = process.env.PORT || 5004;

connecterDB().then(() => {
  app.listen(PORT, () => {
    console.log(`exercice-service démarré sur le port ${PORT}`);
  });
});