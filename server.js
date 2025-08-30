import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./src/routes/auth.js";
import rideRoutes from "./src/routes/rides.js";
import { startCronJobs } from "./cron.js";
import { connectDB } from "./src/db.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Connect MongoDB outside request handlers
connectDB()
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.get("/", (req, res) => res.send("API OK"));

startCronJobs(); // Optional cron jobs

app.use("/auth", authRoutes);
app.use("/rides", rideRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
