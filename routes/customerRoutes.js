import express from 'express';
import {
  getAllCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer
} from '../controllers/customerController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// PUBLIC - No authentication needed
router.get('/', getAllCustomers);
router.get('/:id', getCustomerById);
router.post('/', createCustomer);
router.put('/:id', updateCustomer); // Make this public

// PROTECTED - Admin only
router.delete('/:id', authMiddleware, deleteCustomer);

export default router;