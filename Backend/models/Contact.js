const mongoose = require('mongoose');

// Define the Contact schema
const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,  // Name is a required field
  },
  email: {
    type: String,
    required: true,  // Email is a required field
    match: [/\S+@\S+\.\S+/, 'Please enter a valid email address'], // Validates the email format
  },
  phone: {
    type: String,
    match: [/^\d{10,15}$/, 'Please enter a valid phone number'], // Validates phone number format (10-15 digits)
  },
  title: {
    type: String,
    required: true,  // Title is required
  },
  message: {
    type: String,
    required: true,  // Message is required
    minlength: [10, 'Message must be at least 10 characters long'], // Optional validation for message length
  },
  reply: {
    type: String,
  },
}, {
  timestamps: true, // Automatically adds createdAt and updatedAt fields
});

// Create and export the Contact model
const Contact = mongoose.model('Contact', contactSchema);
module.exports = Contact;
