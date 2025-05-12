const Photo = require('../models/Photos'); 
const { v4: uuidv4 } = require('uuid');

// GET all photos
exports.getAllPhotos = async (req, res) => {
  try {
    const photos = await Photo.find(); // Changed to use Photo model
    res.status(200).json(photos);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching photos', error });
  }
};

// GET a single photo by ID
exports.getPhotoById = async (req, res) => {
  const { id } = req.params;
  try {
    const photo = await Photo.findById(id); // Changed to use Photo model
    if (!photo) {
      return res.status(404).json({ message: 'Photo not found' });
    }
    res.status(200).json(photo);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching photo', error });
  }
};

// POST a new photo
exports.addPhoto = async (req, res) => {
  const { photolink } = req.body; // Use correct field name, photolink

  try {
    const newPhoto = new Photo({
      id: uuidv4(),
      photolink, // Save the photolink to the database
    });

    await newPhoto.save();
    res.status(201).json(newPhoto);
  } catch (error) {
    res.status(400).json({ message: 'Error adding photo', error });
  }
};

// PUT (update) a photo by ID
exports.updatePhoto = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    const photo = await Photo.findByIdAndUpdate(id, updates, { new: true }); // Use Photo model
    if (!photo) {
      return res.status(404).json({ message: 'Photo not found' });
    }
    res.status(200).json(photo);
  } catch (error) {
    res.status(400).json({ message: 'Error updating photo', error });
  }
};

// DELETE a photo by ID
exports.deletePhoto = async (req, res) => {
  const { id } = req.params;

  try {
    const photo = await Photo.findByIdAndDelete(id); // Use Photo model
    if (!photo) {
      return res.status(404).json({ message: 'Photo not found' });
    }
    res.status(200).json({ message: 'Photo deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting photo', error });
  }
};
