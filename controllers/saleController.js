import Sale from '../models/Sale.js';
import Customer from '../models/Customer.js';
import Product from '../models/Product.js';
import Transaction from '../models/Transaction.js';

const generateSaleId = () => {
  const date = new Date();
  const prefix = 'SL';
  const timestamp = date.getTime().toString().slice(-6);
  return `${prefix}${timestamp}`;
};

export const getAllSales = async (req, res) => {
  try {
    const sales = await Sale.find().sort({ saleDate: -1 });
    res.json(sales);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getSaleById = async (req, res) => {
  try {
    const sale = await Sale.findOne({ saleId: req.params.id });
    if (!sale) {
      return res.status(404).json({ message: 'Sale not found' });
    }
    res.json(sale);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createSale = async (req, res) => {
  try {
    const saleData = {
      ...req.body,
      saleId: generateSaleId()
    };

    // Get customer details if customerId is provided but customerMobile is missing
    if (saleData.customerId && !saleData.customerMobile) {
      const customer = await Customer.findOne({ customerId: saleData.customerId });
      if (customer) {
        saleData.customerMobile = customer.mobile;
        saleData.customerName = saleData.customerName || customer.name;
      }
    }

    // Validate required fields
    if (!saleData.customerMobile) {
      return res.status(400).json({ 
        message: 'customerMobile is required. Please select a valid customer.' 
      });
    }

    // Update product quantities
    if (saleData.items && saleData.items.length > 0) {
      for (const item of saleData.items) {
        await Product.findOneAndUpdate(
          { itemNumber: item.itemNumber },
          { $inc: { quantity: -item.quantity } }
        );
      }
    }

    // Update customer due if any
    if (saleData.dueAmount > 0 && saleData.customerId) {
      await Customer.findOneAndUpdate(
        { customerId: saleData.customerId },
        { 
          $inc: { totalDue: saleData.dueAmount },
          $set: { updatedAt: new Date() }
        }
      );
    }

    const sale = await Sale.create(saleData);
    
    // Create transaction record for income
    if (saleData.paidAmount > 0) {
      await Transaction.create({
        transactionId: `TRX${Date.now().toString().slice(-6)}`,
        type: 'income',
        category: 'sale',
        amount: saleData.paidAmount,
        description: `Sale ${sale.saleId}`,
        reference: sale.saleId
      });
    }

    res.status(201).json(sale);
  } catch (error) {
    console.error('Error creating sale:', error);
    res.status(500).json({ message: error.message });
  }
};

export const getTodaySales = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const sales = await Sale.find({
      saleDate: { $gte: today, $lt: tomorrow }
    }).sort({ saleDate: -1 });

    res.json(sales);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteSale = async (req, res) => {
  try {
    const sale = await Sale.findOneAndDelete({ saleId: req.params.id });
    if (!sale) {
      return res.status(404).json({ message: 'Sale not found' });
    }
    res.json({ message: 'Sale deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};