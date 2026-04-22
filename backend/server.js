import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import authRoutes from './routes/authRoutes.js';
import mealRoutes from './routes/mealRoutes.js';

dotenv.config();
const app  = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth',  authRoutes);
app.use('/api/meals', mealRoutes);

// Health check
app.get('/api/health', (_, res) =>
  res.json({ status: 'ok', db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected' })
);

// ── MongoDB ────────────────────────────────────────────────────

const CONNECT_OPTS = {
  serverSelectionTimeoutMS: 30000,  // 30 s to pick a server
  connectTimeoutMS:         30000,  // 30 s for initial handshake
  socketTimeoutMS:          60000,  // 60 s idle socket
  family: 4,                        // Force IPv4 (avoids IPv6 SRV issues on Windows)
};

let attempt = 0;
const MAX   = 5;

async function connect() {
  attempt++;
  console.log(`⏳ Connecting to MongoDB… (attempt ${attempt}/${MAX})`);
  try {
    await mongoose.connect(process.env.MONGO_URI, CONNECT_OPTS);
    console.log('✅ MongoDB connected');
    app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
  } catch (err) {
    console.error(`❌ MongoDB failed: ${err.message}`);
    if (attempt < MAX) {
      const delay = attempt * 4000;
      console.log(`🔁 Retry in ${delay / 1000}s…`);
      setTimeout(connect, delay);
    } else {
      console.error('💀 Could not reach MongoDB. Server starting without DB.');
      app.listen(PORT, () => console.log(`⚠️  Server on port ${PORT} (no DB)`));
    }
  }
}

mongoose.connection.on('disconnected', () => console.warn('⚠️  MongoDB disconnected'));
mongoose.connection.on('reconnected',  () => console.log('✅ MongoDB reconnected'));

connect();