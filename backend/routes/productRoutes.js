import express from 'express';
import { getProducts, addProduct } from '../controllers/productController.js';
const router = express.Router();

// Get all products
router.get('/getall', getProducts);

// Add a product
router.post('/register', addProduct);

export default router;
