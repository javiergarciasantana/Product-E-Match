import express from 'express';
import { getProducts, addProduct, searchProducts } from '../controllers/productController.js';
const router = express.Router();

// Get all products
router.get('/getall', getProducts);

// Add a product
router.post('/register', addProduct);

// Search for products
router.get('/search', searchProducts);

export default router;
