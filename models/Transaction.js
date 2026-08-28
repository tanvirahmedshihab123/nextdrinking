import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  transactionId: { type: String, required: true, unique: true },
  type: { 
    type: String, 
    enum: ['income', 'expense', 'customer_payment', 'vendor_payment'], 
    required: true 
  },
  category: { type: String, required: true },
  amount: { type: Number, required: true },
  description: { type: String },
  reference: { type: String }, // Sale ID, Customer ID, Vendor ID
  date: { type: Date, default: Date.now },
  paymentMethod: { 
    type: String, 
    enum: ['cash', 'card', 'mobile_banking', 'bank'], 
    default: 'cash' 
  },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Transaction', transactionSchema);