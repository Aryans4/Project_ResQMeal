import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name:        { type: String, required: true },
  email:       { type: String, required: true, unique: true },
  password:    { type: String, required: true },
  role:        { type: String, enum: ['donor', 'receiver'], default: 'receiver' },
  phone:       { type: String, default: '' },
  countryCode: { type: String, default: '+91' },
  city:        { type: String, default: '' },
  state:       { type: String, default: '' },
  pgName:      { type: String, default: '' },
  address:     { type: String, default: '' },
  diet:        { type: String, enum: ['Veg', 'Non-Veg', 'Both'], default: 'Both' },
  notifications: { type: Boolean, default: true },
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

export default mongoose.model('User', userSchema);