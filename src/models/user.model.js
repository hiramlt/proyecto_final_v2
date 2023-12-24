import mongoose, { Schema } from 'mongoose';

const UserSchema = new Schema({
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  age: { type: Number, required: false },
  cart: { type: mongoose.Schema.Types.ObjectId, ref: 'carts', required: false },
  role: { type: String, default: 'user' },
}, { timestamps: true });

export default mongoose.model('users', UserSchema);