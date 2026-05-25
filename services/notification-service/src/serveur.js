require("dotenv").config();

const app = require("./app");
const connecterBaseDonnees = require("./config/db");

const PORT = process.env.PORT || 5009;

connecterBaseDonnees();

app.listen(PORT, () => {
  console.log(`Notification service running on port ${PORT}`);
});