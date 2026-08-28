import express from 'express';
import {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  updatePayment,
  deleteOrder
} from '../controllers/orderController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// PUBLIC ROUTES (No authentication needed)
router.post('/', createOrder);
router.get('/', getOrders);
router.get('/:id', getOrderById);

// PROTECTED ROUTES (Admin only)
router.put('/:id/status', authMiddleware, updateOrderStatus);
router.put('/:id/payment', authMiddleware, updatePayment);
router.delete('/:id', authMiddleware, deleteOrder);

export default router;