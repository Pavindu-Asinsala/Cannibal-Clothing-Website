const mongoose = require('mongoose');

// Define the schema for an image
const imageSchema = new mongoose.Schema(
  {
    
      id: {
        type: String,
        unique: true,
        required: false, // Optional now
      },

    photolink: {
      type: String,
      required: true,
      unique :true 
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

// Mongoose automatically generates the '_id' field for each document
const Photo = mongoose.model('Photo', imageSchema);
module.exports = Photo;
