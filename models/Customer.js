import mongoose from 'mongoose';

const customerSchema = new mongoose.Schema({
  customerId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  mobile: { type: String, required: true },
  address: { type: String },
  route: { type: String },
  prevDue: { type: Number, default: 0 },
  totalDue: { type: Number, default: 0 },
  totalPaid: { type: Number, default: 0 },
  waterDispenser: { type: Boolean, default: false },
  waterDispenserCollect: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model('Customer', customerSchema);