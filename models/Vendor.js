// models/Vendor.js
import mongoose from 'mongoose';

const vendorSchema = new mongoose.Schema({
  vendorId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  mobile: { type: String, required: true },
  email: { type: String, default: '' },
  address: { type: String, default: '' },
  designation: { type: String, default: '' },
  
  // Routes assigned to this vendor
  routes: [{
    routeId: { type: String },
    routeName: { type: String },
    customerCount: { type: Number, default: 0 }
  }],
  
  // Financial
  totalPurchases: { type: Number, default: 0 },
  dueAmount: { type: Number, default: 0 },
  paidAmount: { type: Number, default: 0 },
  
  // Status
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model('Vendor', vendorSchema);