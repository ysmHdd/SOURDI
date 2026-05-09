require("dotenv").config();
const app = require("./app");
const connecterDB = require("./configuration/baseDeDonnees");

const PORT = process.env.PORT || 5005;

connecterDB().then(() => {
  app.listen(PORT, () => {
    console.log(`coins-service démarré sur le port ${PORT}`);
  });
});