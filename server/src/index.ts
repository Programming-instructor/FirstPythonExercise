import type { Request, Response } from 'express';

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose')
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || '';

// Middleware
app.use(cors()); // allows all origins by default
app.use(express.json());

// MongoDB connection
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB');
  })
  .catch((err: any) => {
    console.error('❌ MongoDB connection error:', err);
  });

// Routes
app.get('/', (req: Request, res: Response) => {
  res.send('Hello from TypeScript backend with MongoDB 🚀');
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});