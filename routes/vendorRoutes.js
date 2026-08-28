import express from 'express';
import {
  getAllVendors,
  getVendorById,
  createVendor,
  updateVendor,
  deleteVendor
} from '../controllers/vendorController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// PUBLIC - No authentication needed
router.get('/', getAllVendors);
router.get('/:id', getVendorById);

// PROTECTED - Admin only
router.post('/', authMiddleware, createVendor);
router.put('/:id', authMiddleware, updateVendor);
router.delete('/:id', authMiddleware, deleteVendor);

export default router;