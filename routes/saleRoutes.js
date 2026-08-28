import express from 'express';
import {
  getAllSales,
  getSaleById,
  createSale,
  getTodaySales,
  deleteSale
} from '../controllers/saleController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// PUBLIC - No authentication needed
router.get('/', getAllSales);
router.get('/today', getTodaySales);
router.get('/:id', getSaleById);
router.post('/', createSale);

// PROTECTED - Admin only
router.delete('/:id', authMiddleware, deleteSale);

export default router;