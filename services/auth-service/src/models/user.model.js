import mongoose from 'mongoose';
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    image: { type: String, required: true },
    role: { type: String, enum: ['customer', 'rider', 'seller'], default: 'null' },
  },
  { timestamps: true },
);
export default mongoose.model('User', userSchema);
