import express from 'express';
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  updateStock,
  deleteProduct
} from '../controllers/productController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// PUBLIC - No authentication needed
router.get('/', getAllProducts);
router.get('/:id', getProductById);

// PROTECTED - Admin only
router.post('/', authMiddleware, createProduct);
router.put('/:id', authMiddleware, updateProduct);
router.patch('/:id/stock', authMiddleware, updateStock);
router.delete('/:id', authMiddleware, deleteProduct);

export default router;