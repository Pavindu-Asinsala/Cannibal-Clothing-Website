import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

import Dashbord from '../components/admincom/Dashboard';
import ItemManage from '../components/admincom/ItemManage';
import PhotosManage from '../components/admincom/ManagePhotos';
import OrderManage from '../components/admincom/OrderManage';
import Messages from '../components/admincom/ManageMessages';
import AddUserComponent from '../components/admincom/AddUserComponent';
import ProfileUpdatePage from '../components/admincom/components/ProfileUpdatePage';
import ViewUsersPage from '../components/admincom/components/ViewUsersPage';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('Dashboard');
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const isAdmin = localStorage.getItem('isAdmin');
    const token = localStorage.getItem('token');

    if (!isAdmin || !token) {
      navigate('/admin'); // Redirect to login if not admin or token is missing
    }

    fetchUserData(); // Fetch user data for the sidebar
    fetchProducts(); // Fetch product data
  }, [navigate]);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        "http://localhost:5000/api/users/viewusers",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log(response.data);  // Log the response data for debugging
      console.log(response.data);  

      // Assuming that you need the first user or filter by a specific criteria (e.g., email, id)
      const loggedInUser = response.data[0];  // You can adjust this based on your logic

      if (loggedInUser) {
        setUserData(loggedInUser);
      } else {
        setError('User not found');
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      setError('Error fetching user details');
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await axios.get('/api/products');
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
      setError('Error fetching products');
    }
  };

  const handleSectionClick = (section) => {
    setActiveSection(section);
  };

  const handleLogout = () => {
    const confirmLogout = window.confirm('Are you sure you want to log out?');
    if (confirmLogout) {
      localStorage.removeItem('token');
      localStorage.removeItem('isAdmin');
      navigate('/admin'); // Redirect to the admin login page
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen text-gray-500">Loading...</div>;
  }

  if (error) {
    return <div className="flex items-center justify-center h-screen text-red-500">{error}</div>;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <motion.div
        className="w-64 bg-gray-800 text-white flex flex-col p-6 h-full"
        initial={{ x: -300 }}
        animate={{ x: 0 }}
        transition={{ type: 'spring', stiffness: 200 }}
      >
        <div className="mb-6">
        <img
                src={''}
                alt="Admin"
                className="w-16 h-16 rounded-full"
              />
          {/* {userData ? (
            <div className="flex items-center">
              <img
                src={userData.profileImage || 'https://img.icons8.com/?size=100&id=enhXU0wuHL8s&format=png&color=000000'}
                alt="Admin"
                className="w-16 h-16 rounded-full"
              />
              <div className="ml-4">
                <p className="text-lg font-bold">{userData.name|| 'Invalid login'}</p>
                <p className="text-sm text-gray-400">{userData.role || 'Invalid login'}</p>
              </div>
            </div>
          ) : (
            <div>Loading user data...</div>  // Fallback while loading
          )} */}
        </div>

        {/* Sidebar Menu */}
        {['Dashboard','Item-management', 'Photos-management', 'Order-management', 'Messages', 'User Management','View users' ,'Profile'].map((section) => (
          <motion.button
            key={section}
            onClick={() => handleSectionClick(section)}
            className={`py-2 px-4 text-left rounded-lg w-full mb-2 ${activeSection === section ? 'bg-gray-700' : 'hover:bg-gray-600'}`}
            whileHover={{ scale: 1.05 }}
          >
            {section.replace('-', ' ')}
          </motion.button>
        ))}

        {/* Logout Button */}
        <motion.button
          onClick={handleLogout}
          className="py-2 px-4 bg-red-600 hover:bg-red-700 rounded-lg w-full mt-auto"
          whileHover={{ scale: 1.05 }}
        >
          Log Out
        </motion.button>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 p-12">
        <AnimatePresence>
        {activeSection === 'Dashboard' && (
            <motion.div
              key="Dashboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Dashbord />
            </motion.div>
          )}
          {activeSection === 'Item-management' && (
            <motion.div
              key="Item-management"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <ItemManage />
            </motion.div>
          )}
          {activeSection === 'Photos-management' && (
            <motion.div
              key="Photos-management"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <PhotosManage />
            </motion.div>
          )}
          {activeSection === 'Order-management' && (
            <motion.div
              key="Order-management"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <OrderManage />
            </motion.div>
          )}
          {activeSection === 'Messages' && (
            <motion.div
              key="Messages"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Messages />
            </motion.div>
          )}
          {activeSection === 'User Management' && (
            <motion.div
              key="User Management"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <AddUserComponent />
            </motion.div>
          )}

          {activeSection === 'Profile' && (
            <motion.div
              key="Profile"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <ProfileUpdatePage />
            </motion.div>
          )}
          {activeSection === 'View users' && (
            <motion.div
              key="View users"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <ViewUsersPage />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
