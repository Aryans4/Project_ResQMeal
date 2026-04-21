import express from 'express';
import Meal from '../models/meal.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// GET /api/meals — public, list all available meals
router.get('/', async (req, res) => {
  try {
    const meals = await Meal.find({ status: 'available' }).populate('donor', 'name').sort({ createdAt: -1 });
    res.json(meals);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/meals — protected, donor posts a new meal
router.post('/', protect, async (req, res) => {
  try {
    const { title, description, location, quantity, expiryTime } = req.body;
    const newMeal = await Meal.create({
      donor: req.user._id,   // set from token, never from body
      title,
      description,
      location,
      quantity,
      expiryTime,
    });
    const populated = await newMeal.populate('donor', 'name');
    res.status(201).json(populated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// PATCH /api/meals/:id/claim — protected, receiver claims a meal
router.patch('/:id/claim', protect, async (req, res) => {
  try {
    const meal = await Meal.findById(req.params.id);
    if (!meal) return res.status(404).json({ message: 'Meal not found' });
    if (meal.status === 'claimed') return res.status(400).json({ message: 'Meal already claimed' });
    if (String(meal.donor) === String(req.user._id)) {
      return res.status(400).json({ message: "You can't claim your own meal" });
    }

    meal.status    = 'claimed';
    meal.claimedBy = req.user._id;
    await meal.save();

    res.json({ message: 'Meal claimed successfully', meal });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/meals/my — protected, get meals donated by the logged-in user
router.get('/my', protect, async (req, res) => {
  try {
    const meals = await Meal.find({ donor: req.user._id }).sort({ createdAt: -1 });
    res.json(meals);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/meals/claimed — protected, get meals claimed by the logged-in user
router.get('/claimed', protect, async (req, res) => {
  try {
    const meals = await Meal.find({ claimedBy: req.user._id }).populate('donor', 'name').sort({ createdAt: -1 });
    res.json(meals);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;