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

// @desc    Search for products based on query
// @route   GET /api/products/search?query=<search_query>
// @access  Public
const searchProducts = async (req, res) => {
  const { query } = req.query; // Get the search query from the query parameters

  if (!query || query.trim() === "") {
    return res.status(400).json({ message: "Search query is required." });
  }

  try {
    // Use regex to match any product where the query is part of the name or team
    const products = await Product.find({
      $or: [
        { name: { $regex: query, $options: "i" } }, // Case-insensitive match for product name
        { team: { $regex: query, $options: "i" } }, // Case-insensitive match for team name
      ],
    });

    if (products.length === 0) {
      return res.status(404).json({ message: "No products found matching your query." });
    }

    res.json(products);
  } catch (error) {
    console.error("Error searching for products:", error);
    res.status(500).json({ message: "Server error" });
  }
};



export { getProducts, addProduct, searchProducts };