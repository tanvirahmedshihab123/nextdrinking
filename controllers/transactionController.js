import Transaction from '../models/Transaction.js';

const generateTransactionId = () => {
  const date = new Date();
  const prefix = 'TRX';
  const timestamp = date.getTime().toString().slice(-6);
  return `${prefix}${timestamp}`;
};

export const getAllTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find().sort({ date: -1 });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createTransaction = async (req, res) => {
  try {
    const transactionData = {
      ...req.body,
      transactionId: generateTransactionId()
    };
    const transaction = await Transaction.create(transactionData);
    res.status(201).json(transaction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTransactionSummary = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const [todayIncome, todayExpense] = await Promise.all([
      Transaction.aggregate([
        { $match: { type: 'income', date: { $gte: today, $lt: tomorrow } } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]),
      Transaction.aggregate([
        { $match: { type: 'expense', date: { $gte: today, $lt: tomorrow } } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ])
    ]);

    res.json({
      todayIncome: todayIncome[0]?.total || 0,
      todayExpense: todayExpense[0]?.total || 0,
      netProfit: (todayIncome[0]?.total || 0) - (todayExpense[0]?.total || 0)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};