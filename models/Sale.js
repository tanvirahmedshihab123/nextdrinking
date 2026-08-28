// import mongoose from 'mongoose';

// const saleSchema = new mongoose.Schema({
//   saleId: { type: String, required: true, unique: true },
//   customerId: { type: String, ref: 'Customer', required: true },
//   customerName: { type: String, required: true },
//   customerMobile: { type: String, required: true },
//   customerEmail: { type: String, default: '' },
//   deliveryAddress: { type: String, default: '' },
//   deliveryTime: { type: String, default: 'asap' },
//   items: [{
//     itemNumber: { type: String },
//     productName: { type: String },
//     quantity: { type: Number, required: true },
//     unitPrice: { type: Number, required: true },
//     total: { type: Number, required: true }
//   }],
//   subtotal: { type: Number, required: true },
//   discount: { type: Number, default: 0 },
//   totalAmount: { type: Number, required: true },
//   paidAmount: { type: Number, default: 0 },
//   dueAmount: { type: Number, default: 0 },
//   paymentMethod: { 
//     type: String, 
//     enum: ['cash', 'card', 'mobile_banking', 'due'], 
//     default: 'due' 
//   },
//   saleDate: { type: Date, default: Date.now },
//   saleType: { type: String, enum: ['rapid', 'regular', 'online'], default: 'regular' },
//   status: {
//     type: String,
//     enum: ['pending', 'confirmed', 'processing', 'delivered', 'cancelled'],
//     default: 'pending'
//   },
//   note: { type: String },
//   createdAt: { type: Date, default: Date.now },
//   updatedAt: { type: Date, default: Date.now }
// });

// export default mongoose.model('Sale', saleSchema);

import mongoose from 'mongoose';

const saleSchema = new mongoose.Schema({
  saleId: { type: String, required: true, unique: true },
  customerId: { type: String, ref: 'Customer', required: true },
  customerName: { type: String, required: true },
  customerMobile: { type: String, required: true },
  customerEmail: { type: String, default: '' },
  deliveryAddress: { type: String, default: '' },
  deliveryTime: { type: String, default: 'asap' },
  items: [{
    itemNumber: { type: String },
    productName: { type: String },
    quantity: { type: Number, required: true },
    unitPrice: { type: Number, required: true },
    total: { type: Number, required: true }
  }],
  subtotal: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  totalAmount: { type: Number, required: true },
  paidAmount: { type: Number, default: 0 },
  dueAmount: { type: Number, default: 0 },
  paymentMethod: { 
    type: String, 
    enum: ['cash', 'card', 'mobile_banking', 'due'], 
    default: 'due' 
  },
  saleDate: { type: Date, default: Date.now },
  saleType: { type: String, enum: ['rapid', 'regular', 'online'], default: 'regular' },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'processing', 'delivered', 'cancelled'],
    default: 'pending'
  },
  note: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model('Sale', saleSchema);