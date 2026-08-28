import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import 'dotenv/config.js';
import { connectDB } from './config/mongodb.js';
import connectCloudinary from './config/cloudinary.js';

import authRouter from './routes/authRoutes.js';
import customerRouter from './routes/customerRoutes.js';
import productRouter from './routes/productRoutes.js';
import saleRouter from './routes/saleRoutes.js';
import orderRouter from './routes/orderRoutes.js'; // ADD THIS
import vendorRouter from './routes/vendorRoutes.js';
import transactionRouter from './routes/transactionRoutes.js';
import reportRouter from './routes/reportRoutes.js';
import { createDefaultAdmin } from './controllers/authController.js';

const app = express();
const port = process.env.PORT || 4000;

// Connect to MongoDB
connectDB();
connectCloudinary();

// Create default admin user
createDefaultAdmin();

// Middlewares
app.use(cors({
  origin: '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

app.use(express.json({ limit: '50mb' }));
app.use(morgan('dev'));

// ============ ROUTES ============
// Auth routes
app.use('/api/auth', authRouter);

// Public routes (no authentication needed)
app.use('/api/products', productRouter);
app.use('/api/customers', customerRouter);
app.use('/api/sales', saleRouter);
app.use('/api/orders', orderRouter); // ADD THIS
app.use('/api/vendors', vendorRouter);
app.use('/api/transactions', transactionRouter);

// Protected routes (authentication required)
app.use('/api/reports', reportRouter);

// Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'Drinking Water Management API',
    status: 'running',
    version: '1.0.0',
    publicEndpoints: [
      '/api/products',
      '/api/customers', 
      '/api/sales',
      '/api/orders', // ADD THIS
      '/api/vendors',
      '/api/transactions'
    ],
    protectedEndpoints: [
      '/api/reports'
    ]
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ message: err.message || 'Internal server error' });
});

app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
  console.log(`📍 API URL: http://localhost:${port}`);
  console.log(`📧 Admin Email: ${process.env.ADMIN_EMAIL}`);
  console.log(`🔓 Public routes: /api/products, /api/customers, /api/sales, /api/orders, /api/vendors, /api/transactions`);
  console.log(`🔒 Protected routes: /api/reports`);
});