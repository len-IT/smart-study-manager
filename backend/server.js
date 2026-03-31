import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import studyTaskRoutes from "./routes/studyTaskRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const DB_URL = process.env.DB_URL;
const APP_NAME = process.env.APP_NAME || "Smart Study Manager";

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: `${APP_NAME} backend is running`
  });
});

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.get("/about", (req, res) => {
  res.json({
    fullName: "Trương Công Lên",
    studentId: "2251220010",
    className: "22CT3"
  });
});

app.use("/api/study-tasks", studyTaskRoutes);

mongoose
  .connect(DB_URL)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`${APP_NAME} is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Database connection failed:", error.message);
    process.exit(1);
  });
