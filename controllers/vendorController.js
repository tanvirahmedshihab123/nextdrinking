// controllers/vendorController.js
import Vendor from '../models/Vendor.js';
import Customer from '../models/Customer.js';

const generateVendorId = () => {
  const date = new Date();
  const prefix = 'VEN';
  const timestamp = date.getTime().toString().slice(-6);
  return `${prefix}${timestamp}`;
};

export const getAllVendors = async (req, res) => {
  try {
    const vendors = await Vendor.find().sort({ createdAt: -1 });
    res.json(vendors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getVendorById = async (req, res) => {
  try {
    const vendor = await Vendor.findOne({ vendorId: req.params.id });
    if (!vendor) {
      return res.status(404).json({ message: 'Vendor not found' });
    }
    res.json(vendor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createVendor = async (req, res) => {
  try {
    const vendorData = {
      ...req.body,
      vendorId: generateVendorId()
    };
    const vendor = await Vendor.create(vendorData);
    res.status(201).json(vendor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateVendor = async (req, res) => {
  try {
    const vendor = await Vendor.findOneAndUpdate(
      { vendorId: req.params.id },
      { ...req.body, updatedAt: new Date() },
      { new: true }
    );
    if (!vendor) {
      return res.status(404).json({ message: 'Vendor not found' });
    }
    res.json(vendor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteVendor = async (req, res) => {
  try {
    const vendor = await Vendor.findOneAndDelete({ vendorId: req.params.id });
    if (!vendor) {
      return res.status(404).json({ message: 'Vendor not found' });
    }
    res.json({ message: 'Vendor deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ============================================
// GET VENDOR WITH ROUTES AND CUSTOMERS
// ============================================
export const getVendorWithDetails = async (req, res) => {
  try {
    const vendor = await Vendor.findOne({ vendorId: req.params.id });
    if (!vendor) {
      return res.status(404).json({ message: 'Vendor not found' });
    }
    
    // Get customers by route
    const customers = await Customer.find({ route: { $in: vendor.routes.map(r => r.routeId) } });
    
    res.json({
      vendor,
      customers,
      totalCustomers: customers.length
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};