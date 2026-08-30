// routes/vendorRoutes.js
import express from 'express';
import {
  getAllVendors,
  getVendorById,
  createVendor,
  updateVendor,
  deleteVendor,
  getVendorWithDetails
} from '../controllers/vendorController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Public
router.get('/', getAllVendors);
router.get('/:id', getVendorById);
router.get('/:id/details', getVendorWithDetails);

// Protected
router.post('/', authMiddleware, createVendor);
router.put('/:id', authMiddleware, updateVendor);
router.delete('/:id', authMiddleware, deleteVendor);

export default router;