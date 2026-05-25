const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Notification-service SOURDI opérationnel" });
});

app.use("/api/notifications", require("./routes/notificationRoutes"));

module.exports = app;