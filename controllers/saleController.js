// import Sale from '../models/Sale.js';
// import Customer from '../models/Customer.js';
// import Product from '../models/Product.js';
// import Transaction from '../models/Transaction.js';

// const generateSaleId = () => {
//   const date = new Date();
//   const prefix = 'SL';
//   const timestamp = date.getTime().toString().slice(-6);
//   return `${prefix}${timestamp}`;
// };

// export const getAllSales = async (req, res) => {
//   try {
//     const sales = await Sale.find().sort({ saleDate: -1 });
//     res.json(sales);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// export const getSaleById = async (req, res) => {
//   try {
//     const sale = await Sale.findOne({ saleId: req.params.id });
//     if (!sale) {
//       return res.status(404).json({ message: 'Sale not found' });
//     }
//     res.json(sale);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// export const createSale = async (req, res) => {
//   try {
//     const saleData = {
//       ...req.body,
//       saleId: generateSaleId()
//     };

//     // Get customer details if customerId is provided but customerMobile is missing
//     if (saleData.customerId && !saleData.customerMobile) {
//       const customer = await Customer.findOne({ customerId: saleData.customerId });
//       if (customer) {
//         saleData.customerMobile = customer.mobile;
//         saleData.customerName = saleData.customerName || customer.name;
//       }
//     }

//     // Validate required fields
//     if (!saleData.customerMobile) {
//       return res.status(400).json({ 
//         message: 'customerMobile is required. Please select a valid customer.' 
//       });
//     }

//     // Update product quantities
//     if (saleData.items && saleData.items.length > 0) {
//       for (const item of saleData.items) {
//         await Product.findOneAndUpdate(
//           { itemNumber: item.itemNumber },
//           { $inc: { quantity: -item.quantity } }
//         );
//       }
//     }

//     // Update customer due if any
//     if (saleData.dueAmount > 0 && saleData.customerId) {
//       await Customer.findOneAndUpdate(
//         { customerId: saleData.customerId },
//         { 
//           $inc: { totalDue: saleData.dueAmount },
//           $set: { updatedAt: new Date() }
//         }
//       );
//     }

//     const sale = await Sale.create(saleData);
    
//     // Create transaction record for income
//     if (saleData.paidAmount > 0) {
//       await Transaction.create({
//         transactionId: `TRX${Date.now().toString().slice(-6)}`,
//         type: 'income',
//         category: 'sale',
//         amount: saleData.paidAmount,
//         description: `Sale ${sale.saleId}`,
//         reference: sale.saleId
//       });
//     }

//     res.status(201).json(sale);
//   } catch (error) {
//     console.error('Error creating sale:', error);
//     res.status(500).json({ message: error.message });
//   }
// };

// export const getTodaySales = async (req, res) => {
//   try {
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);
//     const tomorrow = new Date(today);
//     tomorrow.setDate(tomorrow.getDate() + 1);

//     const sales = await Sale.find({
//       saleDate: { $gte: today, $lt: tomorrow }
//     }).sort({ saleDate: -1 });

//     res.json(sales);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// export const deleteSale = async (req, res) => {
//   try {
//     const sale = await Sale.findOneAndDelete({ saleId: req.params.id });
//     if (!sale) {
//       return res.status(404).json({ message: 'Sale not found' });
//     }
//     res.json({ message: 'Sale deleted successfully' });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

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

// ============ GET ALL SALES ============
export const getAllSales = async (req, res) => {
  try {
    const sales = await Sale.find().sort({ saleDate: -1 });
    res.json(sales);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ============ GET SALE BY ID ============
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

// ============ CREATE SALE ============
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

    // Update customer paid amount if any
    if (saleData.paidAmount > 0 && saleData.customerId) {
      await Customer.findOneAndUpdate(
        { customerId: saleData.customerId },
        {
          $inc: { totalPaid: saleData.paidAmount },
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

// ============ GET TODAY SALES ============
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

// ============ DELETE SALE (with full customer adjustment) ============
export const deleteSale = async (req, res) => {
  try {
    // ১. Sale খুঁজে বের করো (delete করার আগে data দরকার)
    const sale = await Sale.findOne({ saleId: req.params.id });
    if (!sale) {
      return res.status(404).json({ message: 'Sale not found' });
    }

    const customerId = sale.customerId;

    // ২. Product quantity ফিরিয়ে দাও (sale-এ যতটুকু কমেছিল)
    if (sale.items && sale.items.length > 0) {
      for (const item of sale.items) {
        await Product.findOneAndUpdate(
          { itemNumber: item.itemNumber },
          { $inc: { quantity: item.quantity } }   // ← + করো (বিক্রি reverse)
        );
      }
    }

    // ৩. Customer-এর due, paid, jar adjust করো
    if (customerId) {
      const customer = await Customer.findOne({ customerId });

      if (customer) {
        // ----- Due reverse -----
        const newTotalDue = Math.max(
          0,
          (customer.totalDue || 0) - (sale.dueAmount || 0)
        );

        // ----- Paid reverse -----
        const newTotalPaid = Math.max(
          0,
          (customer.totalPaid || 0) - (sale.paidAmount || 0)
        );

        // ----- Jar adjustment -----
        // Sale-এ jarGiven এবং jarCollected যা ছিল, সেটা reverse করো
        const saleJarGiven = sale.jarGiven || 0;
        const saleJarCollected = sale.jarCollected || 0;

        const newJarGiven = Math.max(
          0,
          (customer.jarGiven || 0) - saleJarGiven
        );
        const newJarCollected = Math.max(
          0,
          (customer.jarCollected || 0) - saleJarCollected
        );
        const newJarBalance = newJarGiven - newJarCollected;

        // ----- Dispenser adjustment (যদি sale-এ দেওয়া থাকে) -----
        const saleDispenserGiven = sale.dispenserGiven || 0;
        let newDispenserDue = customer.dispenserDue || 0;
        if (saleDispenserGiven > 0) {
          newDispenserDue = Math.max(
            0,
            newDispenserDue - saleDispenserGiven * 100
          );
        }

        // ----- Customer update -----
        await Customer.findOneAndUpdate(
          { customerId },
          {
            totalDue: newTotalDue,
            totalPaid: newTotalPaid,
            jarGiven: newJarGiven,
            jarCollected: newJarCollected,
            jarBalance: newJarBalance,
            dispenserDue: newDispenserDue,
            updatedAt: new Date()
          },
          { new: true }
        )

        console.log(
          `[deleteSale] Customer ${customerId} adjusted:`,
          {
            dueReduced: sale.dueAmount || 0,
            paidReduced: sale.paidAmount || 0,
            jarGivenReduced: saleJarGiven,
            jarCollectedReduced: saleJarCollected
          }
        )
      }
    }

    // ৪. Transaction record delete করো (sale-এর income entry)
    await Transaction.findOneAndDelete({ reference: req.params.id });

    // ৫. সবশেষে sale delete করো
    await Sale.findOneAndDelete({ saleId: req.params.id });

    res.json({
      message: 'Sale deleted successfully',
      customerAdjusted: !!customerId
    });
  } catch (error) {
    console.error('Error deleting sale:', error);
    res.status(500).json({ message: error.message });
  }
};
