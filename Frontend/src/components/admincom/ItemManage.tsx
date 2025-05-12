import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { FaEdit, FaTrashAlt, FaPlus, FaTimes, FaCheck, FaTag, FaBox, FaSearch, FaFilePdf } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// Initial form data template with three states for status
const initialFormData = () => ({
  id: '',
  name: '',
  price: '',
  description: '',
  category: '',
  images: [],
  sizes: [],
  colors: [],
  quantity: 0,
  status: 'available',
});

const ItemManage = () => {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [formData, setFormData] = useState(initialFormData());
  const [editingItem, setEditingItem] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [activeTab, setActiveTab] = useState('basics'); // For form tabs
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState("");

  useEffect(() => {
    fetchItems();
  }, [refresh]);

  const handleChange = (e) => {
    const value = e.target.value;
    const numberValue = parseFloat(value);

    if (value === "" || isNaN(numberValue) || numberValue <= 0) {
      setError("💡 Please enter a valid price number (greater than 0)");
    } else {
      setError("");
    }setFormData({ ...formData, price: value });}

  // Effect to handle filtering when items or search term changes
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredItems(items);
    } else {
      const lowercasedSearch = searchTerm.toLowerCase();
      const filtered = items.filter(
        item => 
          item.name.toLowerCase().includes(lowercasedSearch) || 
          item.category.toLowerCase().includes(lowercasedSearch)
      );
      setFilteredItems(filtered);
    }
  }, [items, searchTerm]);

  // Fetch items from API - keeping this unchanged
  const fetchItems = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/products');
      setItems(response.data);
      setFilteredItems(response.data); // Initialize filtered items with all items
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  };

  // Handle adding or updating a product - keeping API logic unchanged
  const handleAddOrUpdate = async (e) => {
    e.preventDefault();

    // Basic form validation
    if (!formData.name || !formData.price || !formData.description || !formData.category) {
      toast.error('Please fill in all the required fields.');
      return;
    }

    const finalProductData = { ...formData };

    try {
      if (editingItem) {
        await axios.put(`http://localhost:5000/api/products/${editingItem.id}`, finalProductData);
        toast.success('Item updated successfully!');
      } else {
        const newProduct = { ...finalProductData, id: Date.now().toString() };
        await axios.post('http://localhost:5000/api/products', newProduct);
        toast.success('Item added successfully!');
      }
      resetForm();
      setRefresh(!refresh);
    } catch (error) {
      console.error('Error saving item:', error);
      toast.error('Error saving item.');
    }
  };

  // Handle delete product action - keeping this unchanged
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await axios.delete(`http://localhost:5000/api/products/${id}`);
        toast.success('Item deleted successfully!');
        setRefresh(!refresh);
      } catch (error) {
        console.error('Error deleting item:', error);
        toast.error('Error deleting item.');
      }
    }
  };

  // Reset form and state
  const resetForm = () => {
    setFormData(initialFormData());
    setEditingItem(null);
    setShowForm(false);
    setActiveTab('basics');
  };

  // Handle image URL change
  const handleImageChange = (e) => {
    setFormData({
      ...formData,
      images: e.target.value.split(',').map((url) => url.trim()),
    });
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Clear search
  const clearSearch = () => {
    setSearchTerm('');
  };

  // Generate and download PDF report
  const generatePDFReport = () => {
    // Create a new PDF document
    const doc = new jsPDF();
    const currentDate = new Date().toLocaleDateString();
    
    // Add title and metadata
    doc.setFontSize(18);
    doc.text('Inventory Report', 14, 22);
    
    doc.setFontSize(11);
    doc.text(`Generated: ${currentDate}`, 14, 30);
    doc.text(`Total Products: ${filteredItems.length}`, 14, 36);
    
    // Prepare the table data
    const tableData = filteredItems.map((item) => [
      item.name,
      item.category,
      `LKR ${item.price?.toFixed(2) || '0.00'}`,
      item.quantity || '0',
      item.status === 'available'
        ? 'Available'
        : item.status === 'low-stock'
        ? 'Low Stock'
        : 'Sold Out'
    ]);
    
    // Generate the table
    autoTable(doc, {
      head: [['Product Name', 'Category', 'Price', 'Quantity', 'Status']],
      body: tableData,
      startY: 45,
      styles: { 
        fontSize: 10,
        cellPadding: 3
      },
      headStyles: {
        fillColor: [79, 70, 229],
        textColor: 255
      },
      alternateRowStyles: {
        fillColor: [245, 247, 250]
      },
      columnStyles: {
        0: { fontStyle: 'bold' }
      }
    });
    
    // Save the PDF
    doc.save(`inventory-report-${currentDate.replace(/\//g, '-')}.pdf`);
    
    toast.success('PDF report generated successfully!');
  };

  // Status badge color helper
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'available':
        return 'bg-emerald-100 text-emerald-700 border border-emerald-300';
      case 'low-stock':
        return 'bg-amber-100 text-amber-700 border border-amber-300';
      case 'sold-out':
        return 'bg-rose-100 text-rose-700 border border-rose-300';
      default:
        return 'bg-gray-100 text-gray-700 border border-gray-300';
    }
  };

  return (
    <div className="p-4 lg:p-10 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="text-3xl font-bold text-gray-800 flex items-center">
            <FaBox className="mr-3 text-indigo-600" /> Inventory Management
          </h1>
          
        </motion.div>

        <div className="flex flex-col sm:flex-row gap-3 mt-4 lg:mt-0">
          {/* Export Report Button */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center font-medium px-5 py-3 rounded-lg shadow-sm transition-all bg-emerald-600 text-white hover:bg-emerald-700"
            onClick={generatePDFReport}
          >
            <FaFilePdf className="mr-2" /> Export Report
          </motion.button>
          
          {/* Add New Item Button */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className={`flex items-center font-medium px-5 py-3 rounded-lg shadow-sm transition-all ${
              showForm
                ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                : 'bg-indigo-600 text-white hover:bg-indigo-700'
            }`}
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? (
              <>
                <FaTimes className="mr-2" /> Close Form
              </>
            ) : (
              <>
                <FaPlus className="mr-2" /> Add New Item
              </>
            )}
          </motion.button>
        </div>
      </div>

      {/* Form Section */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden mb-8">
              <div className="border-b border-gray-100 p-6">
                <h2 className="text-2xl font-semibold text-gray-800">
                  {editingItem ? 'Update Item' : 'Add New Item'}
                </h2>
                <p className="text-gray-500 mt-1">
                  {editingItem
                    ? 'Edit the details of your existing product'
                    : 'Fill in the details to add a new product to your inventory'}
                </p>
              </div>

              {/* Form Tabs */}
              <div className="flex border-b border-gray-100">
                <button
                  className={`px-6 py-3 font-medium transition-colors ${
                    activeTab === 'basics'
                      ? 'text-indigo-600 border-b-2 border-indigo-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                  onClick={() => setActiveTab('basics')}
                >
                  Basic Info
                </button>
                <button
                  className={`px-6 py-3 font-medium transition-colors ${
                    activeTab === 'variants'
                      ? 'text-indigo-600 border-b-2 border-indigo-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                  onClick={() => setActiveTab('variants')}
                >
                  Variants & Images
                </button>
                <button
                  className={`px-6 py-3 font-medium transition-colors ${
                    activeTab === 'status'
                      ? 'text-indigo-600 border-b-2 border-indigo-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                  onClick={() => setActiveTab('status')}
                >
                  Status
                </button>
              </div>

              <form onSubmit={handleAddOrUpdate} className="p-6">
                {/* Basic Info Tab */}
                {activeTab === 'basics' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4 }}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                          placeholder="Enter product name"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Price (LKR)</label>
                        <div className="w-full">
      <input
        type="number"
        value={formData.price}
        onChange={handleChange}
        className={`w-full p-3 bg-gray-50 border ${
          error ? "border-red-400" : "border-gray-200"
        } rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all`}
        placeholder="Enter price"
        required
      />
      {error && (
        <p className="mt-2 text-sm text-red-500 animate-pulse">
          {error}
        </p>
      )}
    </div>
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea
                          value={formData.description}
                          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                          className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                          placeholder="Enter product description"
                          rows="4"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                        <select
                          value={formData.category}
                          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                          className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                          required
                        >
                            <option value="">Select Category</option>
                        <option value="backpack">Backpack</option>
                        <option value="caps">Caps</option>
                        <option value="Casual">Casual</option>
                        <option value="Handbag">Handbag</option>
                        <option value="hoodie">Hoodie</option>
                        <option value="jeans">Jeans</option>
                        <option value="pants">Pants</option>
                        <option value="polo_tshirt">Polo T-Shirt</option>
                        <option value="shoes">Shoes</option>
                        <option value="shorts">Shorts</option>
                        <option value="skirt">Skirt</option>
                        <option value="tshirt">T-Shirt</option>
                      </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                        <input
                          type="number"
                          value={formData.quantity}
                          onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) })}
                          className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                          placeholder="Enter stock quantity"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Variants & Images Tab */}
                {activeTab === 'variants' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4 }}
                  >
                    <div className="grid grid-cols-1 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Available Sizes</label>
                        <input
                          type="text"
                          value={formData.sizes.join(', ')}
                          onChange={(e) => setFormData({ ...formData, sizes: e.target.value.split(',').map((size) => size.trim()) })}
                          className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                          placeholder="e.g. S, M, L, XL (separate with commas)"
                        />
                        <p className="mt-1 text-sm text-gray-500">Separate each size with a comma</p>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Available Colors</label>
                        <input
                          type="text"
                          value={formData.colors.join(', ')}
                          onChange={(e) => setFormData({ ...formData, colors: e.target.value.split(',').map((color) => color.trim()) })}
                          className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                          placeholder="e.g. Red, Blue, Black (separate with commas)"
                        />
                        <p className="mt-1 text-sm text-gray-500">Separate each color with a comma</p>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Product Images</label>
                        <input
                          type="text"
                          value={formData.images.join(', ')}
                          onChange={handleImageChange}
                          className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                          placeholder="Enter image URLs separated by commas"
                        />
                        <p className="mt-1 text-sm text-gray-500">Paste full image URLs, separated by commas</p>
                      </div>
                      
                      {formData.images.length > 0 && (
                        <div className="mt-2">
                          <label className="block text-sm font-medium text-gray-700 mb-2">Image Preview</label>
                          <div className="flex flex-wrap gap-3">
                            {formData.images.map((url, index) => (
                              <div key={index} className="relative group">
                                <img
                                  src={url}
                                  alt={`Product ${index + 1}`}
                                  className="w-24 h-24 object-cover rounded-lg border border-gray-200"
                                  onError={(e) => {
                                    e.target.src = 'https://via.placeholder.com/150?text=Image+Error';
                                  }}
                                />
                                <button
                                  type="button"
                                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                  onClick={() => {
                                    const newImages = [...formData.images];
                                    newImages.splice(index, 1);
                                    setFormData({ ...formData, images: newImages });
                                  }}
                                >
                                  <FaTimes size={12} />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* Status Tab */}
                {activeTab === 'status' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4 }}
                  >
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Product Status</label>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
                          <div
                            className={`p-4 border rounded-lg cursor-pointer transition-all ${
                              formData.status === 'available'
                                ? 'border-emerald-500 bg-emerald-50'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                            onClick={() => setFormData({ ...formData, status: 'available' })}
                          >
                            <div className="flex items-center">
                              <div
                                className={`w-5 h-5 rounded-full flex items-center justify-center mr-3 ${
                                  formData.status === 'available' ? 'bg-emerald-500' : 'border border-gray-300'
                                }`}
                              >
                                {formData.status === 'available' && <FaCheck className="text-white text-xs" />}
                              </div>
                              <div>
                                <h3 className="font-medium">Available</h3>
                                <p className="text-sm text-gray-500">Product is in stock</p>
                              </div>
                            </div>
                          </div>
                          
                          <div
                            className={`p-4 border rounded-lg cursor-pointer transition-all ${
                              formData.status === 'low-stock'
                                ? 'border-amber-500 bg-amber-50'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                            onClick={() => setFormData({ ...formData, status: 'low-stock' })}
                          >
                            <div className="flex items-center">
                              <div
                                className={`w-5 h-5 rounded-full flex items-center justify-center mr-3 ${
                                  formData.status === 'low-stock' ? 'bg-amber-500' : 'border border-gray-300'
                                }`}
                              >
                                {formData.status === 'low-stock' && <FaCheck className="text-white text-xs" />}
                              </div>
                              <div>
                                <h3 className="font-medium">Low Stock</h3>
                                <p className="text-sm text-gray-500">Limited inventory</p>
                              </div>
                            </div>
                          </div>
                          
                          <div
                            className={`p-4 border rounded-lg cursor-pointer transition-all ${
                              formData.status === 'sold-out'
                                ? 'border-rose-500 bg-rose-50'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                            onClick={() => setFormData({ ...formData, status: 'sold-out' })}
                          >
                            <div className="flex items-center">
                              <div
                                className={`w-5 h-5 rounded-full flex items-center justify-center mr-3 ${
                                  formData.status === 'sold-out' ? 'bg-rose-500' : 'border border-gray-300'
                                }`}
                              >
                                {formData.status === 'sold-out' && <FaCheck className="text-white text-xs" />}
                              </div>
                              <div>
                                <h3 className="font-medium">Sold Out</h3>
                                <p className="text-sm text-gray-500">Out of stock</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Form Buttons */}
                <div className="mt-8 flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    className="px-5 py-3 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-all"
                    onClick={resetForm}
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="px-5 py-3 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-all flex items-center justify-center"
                  >
                    <FaCheck className="mr-2" />
                    {editingItem ? 'Update Item' : 'Save Item'}
                  </motion.button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search Bar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="mb-6"
      >
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <FaSearch className="w-5 h-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full p-4 pl-10 bg-white border border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            placeholder="Search by product name or category..."
          />
          {searchTerm && (
            <button
              onClick={clearSearch}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
            >
              <FaTimes className="w-5 h-5" />
            </button>
          )}
        </div>
      </motion.div>

      {/* Items Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden"
      >
        {/* Table Header with Search Results Info */}
        <div className="px-6 py-4 border-b border-gray-100">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center">
            <h2 className="text-lg font-semibold text-gray-800">Products List</h2>
            <div className="mt-2 md:mt-0 text-sm text-gray-500">
              {searchTerm ? (
                <>
                  Showing {filteredItems.length} {filteredItems.length === 1 ? 'result' : 'results'} for <span className="font-medium text-indigo-600">"{searchTerm}"</span>
                </>
              ) : (
                <>Showing all {items.length} products</>
              )}
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left text-sm font-medium text-gray-500 uppercase tracking-wider px-6 py-4">Product</th>
                <th className="text-left text-sm font-medium text-gray-500 uppercase tracking-wider px-6 py-4">Price</th>
                <th className="text-left text-sm font-medium text-gray-500 uppercase tracking-wider px-6 py-4">Status</th>
                <th className="text-right text-sm font-medium text-gray-500 uppercase tracking-wider px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                    {searchTerm ? (
                      <>
                        No products found matching "<span className="font-medium">{searchTerm}</span>". Try a different search term.
                      </>
                    ) : (
                      <>No products found. Add your first product using the form above.</>
                    )}
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => (
                  <motion.tr
                    key={item.id}
                    className="hover:bg-gray-50 transition-colors"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        {item.images && item.images.length > 0 ? (
                          <img
                            src={item.images[0]}
                            alt={item.name}
                            className="w-12 h-12 rounded-lg object-cover mr-3"
                            onError={(e) => {
                              e.target.src = 'https://via.placeholder.com/48?text=No+Image';
                            }}
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center mr-3">
                            <FaTag className="text-gray-400" />
                          </div>
                        )}
                        <div>
                          <h3 className="font-medium text-gray-800">{item.name}</h3>
                          <p className="text-sm text-gray-500 capitalize">{item.category}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium">LKR {item.price?.toFixed(2) || '0.00'}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(item.status)}`}>
                        {item.status === 'available'
                          ? 'Available'
                          : item.status === 'low-stock'
                          ? 'Low Stock'
                          : 'Sold Out'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end space-x-2">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                          onClick={() => {
                            setEditingItem(item);
                            setFormData(item);
                            setShowForm(true);
                          }}
                        >
                          <FaEdit />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          onClick={() => handleDelete(item.id)}
                        >
                          <FaTrashAlt />
                        </motion.button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      <ToastContainer position="bottom-right" />
    </div>
  );
};

export default ItemManage;