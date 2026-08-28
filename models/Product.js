import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  itemNumber: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  category: { type: String, required: true },
  unitPrice: { type: Number, required: true },
  quantity: { type: Number, required: true, default: 0 },
  minStock: { type: Number, default: 10 },
  description: { type: String },
  image: { type: String },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model('Product', productSchema);