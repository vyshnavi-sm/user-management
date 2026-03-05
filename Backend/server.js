const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();

app.use(express.json());
app.use(cors());
app.use("/uploads", express.static("uploads")); // For profile images

// Test route
app.get("/", (req, res) => res.send("Backend Working"));

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/users", require("./routes/userRoutes")); // <-- Add this

app.listen(9000, () => console.log("Server running on port 9000"));