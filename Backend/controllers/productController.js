// controllers/productController.js
const Product = require('../models/Product');

// GET all products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products', error });
  }
};

exports.getAllProductsAcc = async (req, res) => {
  try {
    const products = await Product.find()
      .sort({ createdAt: -1 })  // Sort by createdAt in descending order
      .limit(3);  // Limit to 3 products
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch products' });
  }
};

exports.getLatestProducts = async (req, res) => {
  try {
    const latestProducts = await Product.find()
      .sort({ createdAt: -1 })  // Sort by newest first
      .limit(10);               // Change the limit as needed
    res.json(latestProducts);
  } catch (error) {
    console.error('Error fetching latest products:', error);
    res.status(500).json({ message: 'Failed to fetch latest products' });
  }
};


// GET a single product by ID
exports.getProductById = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findOne({ id });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching product', error });
  }
};

// POST a new product
exports.addProduct = async (req, res) => {
  const { id, name, price, description, category, images, sizes, colors, quantity, status } = req.body;

  try {
    const newProduct = new Product({
      id,
      name,
      price,
      description,
      category,
      images,
      sizes,
      colors,
      quantity,
      status,
    });

    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(400).json({ message: 'Error adding product', error });
  }
};

// PUT (update) a product by ID
exports.updateProduct = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    const product = await Product.findOneAndUpdate({ id }, updates, { new: true });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(400).json({ message: 'Error updating product', error });
  }
};

// DELETE a product by ID
exports.deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await Product.findOneAndDelete({ id });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting product', error });
  }
};
