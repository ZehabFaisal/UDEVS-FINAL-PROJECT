const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const sequelize = require("./config/db");
require("./models");

const authRoutes = require("./routes/authRoutes");
const jobRoutes = require("./routes/jobRoutes");
const applicationRoutes = require("./routes/applicationRoutes");
const interviewRoutes = require("./routes/interviewRoutes");
const adminRoutes = require("./routes/adminRoutes");
const resumeRoutes = require("./routes/resumeRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ 
  origin: "http://localhost:5173", 
  credentials: true 
}));
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/auth", authRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/interviews", interviewRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/resume", resumeRoutes);

app.get("/", (req, res) => {
  res.json({ success: true, message: "Recruiter-AI API is running" });
});

app.get("/api/health", (req, res) => {
  res.json({ success: true, message: "Recruiter-AI API is running", timestamp: new Date().toISOString() });
});

app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ success: false, message: "Internal server error" });
});

const start = async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connected");
    await sequelize.sync({ force: false });
    console.log("Models synchronized");

    app.listen(PORT, () => {
      console.log(`Congrats! Server is running on http://localhost:${PORT}`);
    });
  } 
  catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

start();