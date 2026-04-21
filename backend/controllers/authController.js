import mongoose from 'mongoose';
import User from '../models/user.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

// Helper: normalize state name to collection suffix
// e.g. "Uttar Pradesh" → "uttar_pradesh"
const stateToCollectionName = (state) => {
  if (!state) return null;
  return 'users_' + state.trim().toLowerCase().replace(/\s+/g, '_');
};

export const register = async (req, res) => {
  try {
    const {
      name, email, password,
      role, phone, countryCode,
      city, state, pgName, address,
      diet, notifications,
    } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    // Create via Mongoose model (saves to default 'users' collection)
    const user = await User.create({
      name, email, password,
      role:          role          || 'receiver',
      phone:         phone         || '',
      countryCode:   countryCode   || '+91',
      city:          city          || '',
      state:         state         || '',
      pgName:        pgName        || '',
      address:       address       || '',
      diet:          diet          || 'Both',
      notifications: notifications !== undefined ? notifications : true,
    });

    // Also save to state-based dynamic collection
    const collectionName = stateToCollectionName(state);
    if (collectionName) {
      try {
        const db = mongoose.connection.db;
        await db.collection(collectionName).insertOne({
          userId:      user._id,
          name:        user.name,
          email:       user.email,
          role:        user.role,
          phone:       user.phone,
          countryCode: user.countryCode,
          city:        user.city,
          state:       user.state,
          pgName:      user.pgName,
          address:     user.address,
          diet:        user.diet,
          createdAt:   user.createdAt,
        });
      } catch (stateErr) {
        // Non-fatal: log but don't fail the registration
        console.warn(`⚠ Could not write to ${collectionName}:`, stateErr.message);
      }
    }

    // Auto-issue JWT for seamless login
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.status(201).json({
      token,
      user: {
        id:    user._id,
        name:  user.name,
        email: user.email,
        role:  user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
      res.json({
        token,
        user: {
          id:    user._id,
          name:  user.name,
          email: user.email,
          role:  user.role,
        },
      });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/auth/me
export const getMe = async (req, res) => {
  res.json({
    user: {
      id:    req.user._id,
      name:  req.user.name,
      email: req.user.email,
      role:  req.user.role,
    },
  });
};