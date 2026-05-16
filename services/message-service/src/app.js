const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.get("/", (req, res) => {
  res.json({ message: "Message-service SOURDI opérationnel" });
});

app.use("/api/messages", require("./routes/messageRoutes"));

module.exports = app;