// models/Order.js
const mongoose = require('mongoose');

// Define the Order schema
const orderSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true, // Customer's full name is required
    },
    phone1: {
      type: String,
      required: true, // Primary phone number is required
    },
    phone2: {
      type: String // Secondary phone number is required
    },
    address: {
      type: String,
      required: true, // Delivery address is required
    },
    cartItems: [
      {
        productName: {
          type: String,
          required: true, // Product name is required
        },
        quantity: {
          type: Number,
          required: true, // Quantity is required
        },
        color: {
          type: String,
          required: true, 
        },
        price: {
          type: Number,
          required: true, // Price is required for each item
        },
      },
    ],
    totalAmount: {
      type: Number,
      required: true, // Total amount is required
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'cancelled'], // Enum for order status
      default: 'pending', // Default status is 'pending'
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

// Create and export the Order model
const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
