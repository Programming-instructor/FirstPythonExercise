// index.js
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/", (req, res) => {
  res.send("API is running...");
});

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected successfully");
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  }
};
connectDB();

// Routes
const userRoutes = require('./routes/user.routes');
app.use('/api/user', userRoutes);

const studentRoutes = require('./routes/student.routes');
app.use('/api/student', studentRoutes);

const academicAdvisorRoutes = require('./routes/academicAdvisor.routes');
app.use('/api/academic-advisor', academicAdvisorRoutes);

const educationalDeputy = require('./routes/educationalDeputy.routes');
app.use('/api/educational-deputy', educationalDeputy);

const psychCounselor = require('./routes/psychCounselor.routes');
app.use('/api/psych-counselor', psychCounselor);


// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
