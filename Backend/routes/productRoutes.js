// routes/productRoutes.js
const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// GET all products
router.get('/', productController.getAllProducts);

router.get('/new', productController.getLatestProducts);

router.get('/', productController.getAllProductsAcc);

// GET a single product by ID
router.get('/:id', productController.getProductById);

// POST a new product
router.post('/', productController.addProduct);

// PUT (update) a product by ID
router.put('/:id', productController.updateProduct);

// DELETE a product by ID
router.delete('/:id', productController.deleteProduct);

module.exports = router;
