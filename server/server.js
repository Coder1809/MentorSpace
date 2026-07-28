import "./config/environment.js";
import express from "express";
import connectDB from "./config/connectDB.js";
import { seedDatabase } from "./seed.js";
import authRoutes from "./routes/authRoutes.js";
import studentRoutes from "./routes/studentRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import mentorRoutes from "./routes/mentorRoutes.js";
import appointmentRoutes from "./routes/appointmentRoutes.js";
import servicesRoutes from "./routes/servicesRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import cors from "cors";
import { fileURLToPath } from "url";
import path from "path";

const PORT = process.env.PORT || 8000;
const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/mentor", mentorRoutes);
app.use("/api/appointment", appointmentRoutes);
app.use("/api/services", servicesRoutes);
app.use("/api/payment", paymentRoutes);

if (process.env.NODE_ENV === "production") {
  const clientBuildPath = path.join(__dirname, "..", "client", "dist");
  app.use(express.static(clientBuildPath));

  app.get("/{*any}", (req, res) => {
    res.sendFile(path.join(clientBuildPath, "index.html"));
  });
}

app.listen(PORT, async () => {
  await connectDB();
  await seedDatabase();
  console.log(`MentorSpace Server started on port ${PORT}`);
});
