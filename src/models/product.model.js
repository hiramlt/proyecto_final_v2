import mongoose from 'mongoose';
import paginate from 'mongoose-paginate-v2';
import config from '../config/config.js';

const ProductSchema = new mongoose.Schema({
    title: { type: String, required: true, index: true },
    description: { type: String, required: true },
    code: { type: String, required: true, index: true },
    price: { type: Number, required: true },
    status: { type: String, required: true },
    stock: { type: Number, required: true },
    category: { type: String, required: true },
    thumbnails: { type: Array, default: [] },
    owner: { type: String, default: config.admin.email }
}, { timestamps: true });

ProductSchema.plugin(paginate);

export default mongoose.model('products', ProductSchema);