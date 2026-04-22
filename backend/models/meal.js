import mongoose from 'mongoose';

const mealSchema = new mongoose.Schema({
  donor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  location: { type: String, required: true },
  quantity: { type: String, required: true },
  expiryTime: { type: String, default: null },

  status:    { type: String, default: 'available' }, // available, claimed
  claimedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
}, { timestamps: true });

export default mongoose.model('Meal', mealSchema);