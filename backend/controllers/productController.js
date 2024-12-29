import Product from "../models/Product.js";

// @desc    Get all products
// @route   GET /api/products/getall
// @access  Public
const getProducts = async (_, res) => {
  const products = await Product.find();
  res.json(products);
};

// @desc    Register a new user
// @route   POST /api/products/register
// @access  Public
const addProduct = async (req, res) => {
  const newProduct = new Product(req.body);
  await newProduct.save();
  res.json(newProduct);
};

export { getProducts, addProduct };
