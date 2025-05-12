const express = require('express');
const router = express.Router();
const photoController = require('../controllers/photoController');
const { checkAuth } = require('../middleware/authMiddleware');  // Import checkAuth from the correct path
const { checkAdmin } = require('../middleware/adminMiddleware'); // Import checkAdmin middleware

// GET all photos
router.get('/', photoController.getAllPhotos);

// GET a single photo by ID
router.get('/:id', photoController.getPhotoById);

// POST a new photo
router.post('/', checkAuth, photoController.addPhoto);  // Only authenticated users can add a photo

// PUT (update) a photo by ID
router.put('/:id', checkAuth, photoController.updatePhoto);  // Only authenticated users can update a photo

// DELETE a photo by ID
router.delete('/:id', checkAuth, checkAdmin, photoController.deletePhoto); // Only admins can delete photos

module.exports = router;
