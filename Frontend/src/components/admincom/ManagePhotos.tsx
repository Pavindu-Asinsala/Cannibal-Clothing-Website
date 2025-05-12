import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css'; 
import { FaTrashAlt } from 'react-icons/fa';

const ManagePhotos = () => {
  const [photos, setPhotos] = useState([]);  // State to store photos
  const [photoLink, setPhotoLink] = useState('');  // State for input (photo URL)

  // Fetch photos from the API
  useEffect(() => {
    fetchPhotos();
  }, []);

  // Fetch photos from the backend
  const fetchPhotos = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/photos');
      setPhotos(response.data);
    } catch (error) {
      console.error('Error fetching photos:', error);
      toast.error('Failed to fetch photos');
    }
  };

  // Handle adding a photo
  const handleAddPhoto = async (e) => {
    e.preventDefault();
    if (!photoLink) {
      toast.error('Please provide a photo link');
      return;
    }
    try {
      await axios.post('http://localhost:5000/api/photos', { photoLink });
      toast.success('Photo added successfully');
      setPhotoLink('');  // Clear the input after adding
      fetchPhotos();     // Refresh the photos list
    } catch (error) {
      console.error('Error adding photo:', error);
      toast.error('Failed to add photo');
    }
  };

  // Handle deleting a photo
  const handleDeletePhoto = async (id) => {
    if (window.confirm('Are you sure you want to delete this photo?')) {
      try {
        await axios.delete(`http://localhost:5000/api/photos/${id}`);
        toast.success('Photo deleted successfully');
        fetchPhotos();  // Refresh the photos list after deletion
      } catch (error) {
        console.error('Error deleting photo:', error);
        toast.error('Failed to delete photo');
      }
    }
  };

  return (
    <div className="p-8 bg-gray-100">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Manage Photos</h1>

      {/* Add Photo Form */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-2xl font-semibold mb-4">Add New Photo</h2>
        <form onSubmit={handleAddPhoto}>
          <div className="mb-4">
            <label className="block text-lg font-medium text-gray-700" htmlFor="photoLink">Photo URL</label>
            <input
              type="url"
              id="photoLink"
              value={photoLink}
              onChange={(e) => setPhotoLink(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              placeholder="Enter the photo URL"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-700"
          >
            Add Photo
          </button>
        </form>
      </div>

      {/* Display All Photos */}
      <div className="overflow-x-auto bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">All Photos</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {photos.map((photo) => (
            <div key={photo._id} className="relative bg-gray-200 rounded-lg shadow-lg overflow-hidden">
              <img
                src={photo.photoLink}
                alt="Photo"
                className="w-full h-48 object-cover rounded-t-lg"
              />
              <div className="absolute top-2 right-2">
                <button
                  className="text-red-500 hover:text-red-600"
                  onClick={() => handleDeletePhoto(photo._id)}
                >
                  <FaTrashAlt className="inline-block mr-2" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <ToastContainer />
    </div>
  );
};

export default ManagePhotos;
