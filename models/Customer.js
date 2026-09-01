import mongoose from 'mongoose';

const customerSchema = new mongoose.Schema({
  customerId: { 
    type: Number, 
    required: true, 
    unique: true 
  },
  name: { 
    type: String, 
     
  },
  mobile: { 
    type: String, 
     
  },
  email: {
    type: String,
    default: ''
  },
  address: { 
    type: String,
    default: ''
  },
  route: { 
    type: String,
    default: ''
  },
  
  // ============ PRICING ============
  customPrice: {
    type: Number,
    default: null
  },
  priceType: {
    type: String,
    enum: ['regular', 'monthly', 'bulk', 'special'],
    default: 'regular'
  },
  
  // ============ JAR MANAGEMENT ============
  jarGiven: {
    type: Number,
    default: 0
  },
  jarCollected: {
    type: Number,
    default: 0
  },
  jarBalance: {
    type: Number,
    default: 0
  },
  
  // ============ WATER DISPENSER ============
  waterDispenser: { 
    type: Boolean, 
    default: false
  },
  waterDispenserCollect: { 
    type: Boolean, 
    default: false
  },
  dispenserDue: {
    type: Number,
    default: 0
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

// Get next customer ID
customerSchema.statics.getNextCustomerId = async function() {
  const lastCustomer = await this.findOne().sort({ customerId: -1 });
  if (!lastCustomer) return 1;
  return lastCustomer.customerId + 1;
};

export default mongoose.model('Customer', customerSchema);