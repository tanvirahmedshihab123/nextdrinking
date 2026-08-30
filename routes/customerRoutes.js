// routes/customerRoutes.js
import express from 'express';
import {
  getAllCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  updateJarStatus,
  updateDispenserStatus,
  recordPayment,
  bulkUpdateCustomers
} from '../controllers/customerController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// PUBLIC ROUTES (No auth needed for now)
router.get('/', getAllCustomers);
router.get('/:id', getCustomerById);
router.post('/', createCustomer);
router.put('/:id', updateCustomer);

// JAR MANAGEMENT
router.put('/:id/jar', updateJarStatus);

// DISPENSER MANAGEMENT
router.put('/:id/dispenser', updateDispenserStatus);

// PAYMENT
router.put('/:id/payment', recordPayment);

// BULK UPDATE
router.post('/bulk', bulkUpdateCustomers);

// PROTECTED ROUTES (Admin only)
router.delete('/:id',  deleteCustomer);

export default router;