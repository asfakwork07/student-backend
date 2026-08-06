require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();
const authRoutes = require("./routes/authRoutes");
require("./config/db");

app.use(cors());
app.use(express.json());

const studentRoutes = require("./routes/studentRoutes");
const courseRoutes = require("./routes/courseRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/courses", courseRoutes);

app.get("/", (req, res) => {
  res.send("Student Registration API Running...");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
