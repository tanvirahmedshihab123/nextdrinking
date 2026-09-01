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

// ============ PUBLIC ROUTES ============
router.get('/', getAllCustomers);
router.get('/:id', getCustomerById);

// ============ CREATE CUSTOMER ============
// Customer ID is auto-generated if not provided
router.post('/', createCustomer);

// ============ UPDATE CUSTOMER ============
router.put('/:id', updateCustomer);

// ============ JAR MANAGEMENT ============
router.put('/:id/jar', updateJarStatus);

// ============ DISPENSER MANAGEMENT ============
router.put('/:id/dispenser', updateDispenserStatus);

// ============ PAYMENT ============
router.put('/:id/payment', recordPayment);

// ============ BULK UPDATE ============
router.post('/bulk', bulkUpdateCustomers);

// ============ DELETE (Admin only) ============
router.delete('/:id', deleteCustomer);

export default router;