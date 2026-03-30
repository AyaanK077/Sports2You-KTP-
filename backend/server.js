const express = require("express");

const app = express();
const PORT = 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend running");
});

app.get("/test", (req, res) => {
  res.json({ message: "API works" });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});