// routes/contactRoutes.js
const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');

// GET all contact messages
router.get('/', contactController.getAllContacts);

// GET a single contact message by ID
router.get('/:id', contactController.getContactById);

// POST a new contact message
router.post('/', contactController.addContact);

// PUT (update) a contact message by ID
router.put('/:id', contactController.updateContact);

// DELETE a contact message by ID
router.delete('/:id', contactController.deleteContact);

module.exports = router;
