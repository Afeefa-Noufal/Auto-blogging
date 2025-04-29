import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoutes from "./routes/auth.js";
import brandRoutes from "./routes/brandRoutes.js";
import blogRoutes from "./routes/blogRoutes.js";
import topicRoutes from "./routes/topicRoutes.js"; // New route for topics
import imageRoutes from "./routes/imageRoutes.js"; // Import image routes
import connectionRoutes from './routes/connectionRoutes.js'
import scheduleStatusRoutes from "./routes/scheduleStatusRoutes.js";
import "./cron/blogScheduler.js"; // Runs after DB connection

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true, 
}));
app.use(express.json()); // Parse JSON requests
app.use(express.urlencoded({ extended: true })); // Parse form data

// Serve uploaded images statically (optional)
app.use("/uploads", express.static("uploads"));

// Use the image routes
app.use("/api", imageRoutes);  // Ensure it matches frontend API calls


// Routes
app.use('/api/auth', authRoutes);
app.use("/api/brands", brandRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/topics", topicRoutes); // New route for managing topics
app.use('/api/connections', connectionRoutes);
app.use("/api/schedule-status", scheduleStatusRoutes);


// Connect to MongoDB and start the server
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("✅ Connected to MongoDB");

    // Start the server only after DB connection is successful
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((error) => {
    console.error("❌ MongoDB Connection Error:", error);
    process.exit(1); // Exit process if DB connection fails
  });

