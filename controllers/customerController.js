// controllers/customerController.js
import Customer from '../models/Customer.js';
import mongoose from 'mongoose';

// Generate unique customer ID
const generateCustomerId = () => {
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `CUS${year}${month}${random}`;
};

export const getAllCustomers = async (req, res) => {
  try {
    const customers = await Customer.find().sort({ createdAt: -1 });
    res.json(customers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getCustomerById = async (req, res) => {
  try {
    const customer = await Customer.findOne({ customerId: req.params.id });
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    res.json(customer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createCustomer = async (req, res) => {
  try {
    const customerData = {
      ...req.body,
      customerId: generateCustomerId()
    };
    
    // Calculate jar balance
    customerData.jarBalance = (customerData.jarGiven || 0) - (customerData.jarCollected || 0);
    
    const customer = await Customer.create(customerData);
    res.status(201).json(customer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateCustomer = async (req, res) => {
  try {
    const customer = await Customer.findOneAndUpdate(
      { customerId: req.params.id },
      { 
        ...req.body, 
        updatedAt: new Date(),
        jarBalance: (req.body.jarGiven || 0) - (req.body.jarCollected || 0)
      },
      { new: true, runValidators: true }
    );
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    res.json(customer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteCustomer = async (req, res) => {
  try {
    const customer = await Customer.findOneAndDelete({ customerId: req.params.id });
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    res.json({ message: 'Customer deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ============ JAR MANAGEMENT ============
export const updateJarStatus = async (req, res) => {
  try {
    const { action, count } = req.body; // action: 'given' or 'collected'
    const customer = await Customer.findOne({ customerId: req.params.id });
    
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    
    if (action === 'given') {
      customer.jarGiven = (customer.jarGiven || 0) + count;
    } else if (action === 'collected') {
      customer.jarCollected = (customer.jarCollected || 0) + count;
    }
    
    customer.jarBalance = customer.jarGiven - customer.jarCollected;
    customer.updatedAt = new Date();
    await customer.save();
    
    res.json(customer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ============ DISPENSER MANAGEMENT ============
export const updateDispenserStatus = async (req, res) => {
  try {
    const { hasDispenser, isCollected, dueAmount } = req.body;
    const customer = await Customer.findOne({ customerId: req.params.id });
    
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    
    customer.waterDispenser = hasDispenser !== undefined ? hasDispenser : customer.waterDispenser;
    customer.waterDispenserCollect = isCollected !== undefined ? isCollected : customer.waterDispenserCollect;
    if (dueAmount !== undefined) {
      customer.dispenserDue = dueAmount;
    }
    customer.updatedAt = new Date();
    await customer.save();
    
    res.json(customer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ============ PAYMENT ============
export const recordPayment = async (req, res) => {
  try {
    const { amount, paymentMethod, note } = req.body;
    const customer = await Customer.findOne({ customerId: req.params.id });
    
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    
    customer.totalPaid = (customer.totalPaid || 0) + amount;
    customer.totalDue = Math.max(0, (customer.totalDue || 0) - amount);
    customer.updatedAt = new Date();
    await customer.save();
    
    res.json(customer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ============ BULK UPDATE ============
export const bulkUpdateCustomers = async (req, res) => {
  try {
    const updates = req.body; // Array of { customerId, data }
    const results = [];
    
    for (const update of updates) {
      const customer = await Customer.findOneAndUpdate(
        { customerId: update.customerId },
        { ...update.data, updatedAt: new Date() },
        { new: true }
      );
      if (customer) {
        results.push(customer);
      }
    }
    
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};