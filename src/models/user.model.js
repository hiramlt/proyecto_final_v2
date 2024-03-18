import mongoose, { Schema } from 'mongoose';

const DocumentItemShema = new mongoose.Schema({
  name: { type: String, required: true },
  reference: { type: String, required: true },
}, { _id: false });

const UserSchema = new Schema({
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  age: { type: Number, required: false },
  cart: { type: mongoose.Schema.Types.ObjectId, ref: 'carts', required: false },
  role: { type: String, default: 'user' },
  documents: { type: [DocumentItemShema], default: [] },
  last_connection: { type: String, default: null }
}, { timestamps: true });

export default mongoose.model('users', UserSchema);