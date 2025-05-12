// routes/orderRoutes.js
const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// GET all orders
router.get('/', orderController.getAllOrders);

// GET a single order by ID
router.get('/:id', orderController.getOrderById);

// POST a new order
router.post('/', orderController.addOrder);

// PUT (update) an order by ID
router.put('/:id', orderController.updateOrder);

// DELETE an order by ID
router.delete('/:id', orderController.deleteOrder);

module.exports = router;
