import mongoose from 'mongoose';

const vendorSchema = new mongoose.Schema({
  vendorId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  mobile: { type: String, required: true },
  email: { type: String },
  address: { type: String },
  totalPurchases: { type: Number, default: 0 },
  dueAmount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model('Vendor', vendorSchema);