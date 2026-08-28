import express from 'express';
import {
  getAllTransactions,
  createTransaction,
  getTransactionSummary
} from '../controllers/transactionController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// PUBLIC - No authentication needed
router.get('/', getAllTransactions);
router.get('/summary', getTransactionSummary);

// PROTECTED - Admin only
router.post('/', authMiddleware, createTransaction);

export default router;