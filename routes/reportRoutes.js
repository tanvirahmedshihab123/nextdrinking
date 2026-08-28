import express from 'express';
import {
  getDashboardStats,
  getSalesReport,
  getCustomerReport
} from '../controllers/reportController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// ============ ALL REPORT ROUTES ARE PROTECTED ============
router.use(authMiddleware);
router.get('/dashboard', getDashboardStats);
router.get('/sales', getSalesReport);
router.get('/customers', getCustomerReport);

export default router;