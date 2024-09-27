const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");
require("dotenv").config();

// routes
const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");
const profileRoutes = require("./routes/profileRoutes");

app.use(express.json());
app.use(cors());

const mongoUrl = process.env.MONGODB_URL;
const port = process.env.PORT || 5000;

mongoose.connect(
    mongoUrl
  )
  .then(result => {
    app.listen(8080, () => {
        console.log(`Backend is running on port ${port}`);
    });
  })
  .catch(err => console.log(err));

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/profile", profileRoutes);

if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.resolve(__dirname, "../frontend/build")));
    app.get("*", (req, res) =>
        res.sendFile(path.resolve(__dirname, "../frontend/build/index.html"))
    );
}