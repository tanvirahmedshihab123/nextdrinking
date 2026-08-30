// models/Customer.js
import mongoose from 'mongoose';

const customerSchema = new mongoose.Schema({
  customerId: { 
    type: String, 
    required: true, 
    unique: true 
  },
  name: { 
    type: String, 
    required: true 
  },
  mobile: { 
    type: String, 
    required: true 
  },
  address: { 
    type: String 
  },
  route: { 
    type: String 
  },
  
  // ============ PRICING ============
  customPrice: {
    type: Number,
    default: null, // null = use default product price
    description: "Special rate for this customer"
  },
  priceType: {
    type: String,
    enum: ['regular', 'monthly', 'bulk', 'special'],
    default: 'regular'
  },
  
  // ============ JAR MANAGEMENT ============
  jarGiven: {
    type: Number,
    default: 0,
    description: "Total jars given to customer"
  },
  jarCollected: {
    type: Number,
    default: 0,
    description: "Total jars collected from customer"
  },
  jarBalance: {
    type: Number,
    default: 0,
    description: "jarGiven - jarCollected"
  },
  
  // ============ WATER DISPENSER ============
  waterDispenser: { 
    type: Boolean, 
    default: false,
    description: "Does customer have water dispenser?"
  },
  waterDispenserCollect: { 
    type: Boolean, 
    default: false,
    description: "Is dispenser collected?"
  },
  dispenserDue: {
    type: Number,
    default: 0,
    description: "Due for water dispenser"
  },
  
  // ============ FINANCIAL ============
  prevDue: { 
    type: Number, 
    default: 0 
  },
  totalDue: { 
    type: Number, 
    default: 0 
  },
  totalPaid: { 
    type: Number, 
    default: 0 
  },
  totalPurchases: {
    type: Number,
    default: 0
  },
  
  // ============ SUBSCRIPTION ============
  subscription: {
    type: String,
    enum: ['none', 'monthly', 'weekly'],
    default: 'none'
  },
  monthlyRate: {
    type: Number,
    default: 0
  },
  lastBillingDate: {
    type: Date
  },
  nextBillingDate: {
    type: Date
  },
  
  // ============ NOTES ============
  notes: {
    type: String,
    default: ''
  },
  
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  updatedAt: { 
    type: Date, 
    default: Date.now 
  }
});

// Auto-update jar balance
customerSchema.pre('save', function(next) {
  this.jarBalance = (this.jarGiven || 0) - (this.jarCollected || 0);
  this.updatedAt = new Date();
  next();
});

// Generate customer ID
customerSchema.statics.generateCustomerId = function() {
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const count = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `CUS${year}${month}${count}`;
};

export default mongoose.model('Customer', customerSchema);