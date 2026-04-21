import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import authRoutes from './routes/authRoutes.js';
import mealRoutes from './routes/mealRoutes.js';

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// Connect Routes
app.use('/api/auth', authRoutes);
app.use('/api/meals', mealRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(process.env.PORT || 5000, () => {
      console.log('✅ Server & MongoDB connected');
    });
  })
  .catch(err => console.log('❌ Connection error:', err));