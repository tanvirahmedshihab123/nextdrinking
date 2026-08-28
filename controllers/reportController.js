import Sale from '../models/Sale.js';
import Customer from '../models/Customer.js';
import Product from '../models/Product.js';
import Transaction from '../models/Transaction.js';
import Vendor from '../models/Vendor.js';

export const getDashboardStats = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const [
      totalSales,
      todaySales,
      totalCustomers,
      totalProducts,
      lowStockProducts,
      totalDue,
      totalVendors,
      todayIncome
    ] = await Promise.all([
      Sale.countDocuments(),
      Sale.countDocuments({ saleDate: { $gte: today, $lt: tomorrow } }),
      Customer.countDocuments(),
      Product.countDocuments({ isActive: true }),
      Product.countDocuments({ quantity: { $lte: 10 } }),
      Customer.aggregate([{ $group: { _id: null, total: { $sum: '$totalDue' } } }]),
      Vendor.countDocuments(),
      Transaction.aggregate([
        { $match: { type: 'income', date: { $gte: today, $lt: tomorrow } } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ])
    ]);

    res.json({
      totalSales,
      todaySales,
      totalCustomers,
      totalProducts,
      lowStockProducts: lowStockProducts || 0,
      totalDue: totalDue[0]?.total || 0,
      totalVendors,
      todayIncome: todayIncome[0]?.total || 0
    });
  } catch (error) {
    console.error('Error getting dashboard stats:', error);
    res.status(500).json({ message: error.message });
  }
};

export const getSalesReport = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const query = {};
    if (startDate && endDate) {
      query.saleDate = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const sales = await Sale.find(query).sort({ saleDate: -1 });
    const total = sales.reduce((sum, sale) => sum + (sale.totalAmount || 0), 0);
    const totalPaid = sales.reduce((sum, sale) => sum + (sale.paidAmount || 0), 0);
    const totalDue = sales.reduce((sum, sale) => sum + (sale.dueAmount || 0), 0);

    res.json({
      sales,
      summary: {
        totalSales: sales.length,
        totalAmount: total,
        totalPaid,
        totalDue
      }
    });
  } catch (error) {
    console.error('Error getting sales report:', error);
    res.status(500).json({ message: error.message });
  }
};

export const getCustomerReport = async (req, res) => {
  try {
    const customers = await Customer.find().sort({ totalDue: -1 });
    const totalDue = customers.reduce((sum, c) => sum + (c.totalDue || 0), 0);
    
    res.json({
      customers,
      summary: {
        totalCustomers: customers.length,
        totalDue,
        totalDueCustomers: customers.filter(c => (c.totalDue || 0) > 0).length
      }
    });
  } catch (error) {
    console.error('Error getting customer report:', error);
    res.status(500).json({ message: error.message });
  }
};