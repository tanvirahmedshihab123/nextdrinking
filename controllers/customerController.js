import Customer from '../models/Customer.js';

// ============ GET ALL CUSTOMERS ============
export const getAllCustomers = async (req, res) => {
  try {
    const customers = await Customer.find().sort({ customerId: 1 });
    res.json(customers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ============ GET CUSTOMER BY ID ============
export const getCustomerById = async (req, res) => {
  try {
    const customer = await Customer.findOne({ 
      customerId: parseInt(req.params.id) 
    });
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    res.json(customer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ============ CREATE CUSTOMER ============
export const createCustomer = async (req, res) => {
  try {
    let customerId = req.body.customerId;
    
    // If no customerId provided, auto-generate next number
    if (!customerId) {
      customerId = await Customer.getNextCustomerId();
    } else {
      // Check if the provided ID already exists
      const existing = await Customer.findOne({ customerId: parseInt(customerId) });
      if (existing) {
        return res.status(400).json({ 
          message: `Customer ID ${customerId} already exists. Please use a different ID.` 
        });
      }
      customerId = parseInt(customerId);
    }

    const customerData = {
      ...req.body,
      customerId: customerId,
      jarBalance: (req.body.jarGiven || 0) - (req.body.jarCollected || 0)
    };

    const customer = await Customer.create(customerData);
    res.status(201).json(customer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ============ UPDATE CUSTOMER ============
export const updateCustomer = async (req, res) => {
  try {
    const customer = await Customer.findOneAndUpdate(
      { customerId: parseInt(req.params.id) },
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

// ============ DELETE CUSTOMER ============
export const deleteCustomer = async (req, res) => {
  try {
    const customer = await Customer.findOneAndDelete({ 
      customerId: parseInt(req.params.id) 
    });
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
    const { action, count } = req.body;
    const customer = await Customer.findOne({ 
      customerId: parseInt(req.params.id) 
    });
    
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
    const customer = await Customer.findOne({ 
      customerId: parseInt(req.params.id) 
    });
    
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    
    if (hasDispenser !== undefined) {
      customer.waterDispenser = hasDispenser;
    }
    if (isCollected !== undefined) {
      customer.waterDispenserCollect = isCollected;
    }
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

// ============ RECORD PAYMENT ============
export const recordPayment = async (req, res) => {
  try {
    const { amount, paymentMethod, note } = req.body;
    const customer = await Customer.findOne({ 
      customerId: parseInt(req.params.id) 
    });
    
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
    const updates = req.body;
    const results = [];
    
    for (const update of updates) {
      const customer = await Customer.findOneAndUpdate(
        { customerId: parseInt(update.customerId) },
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