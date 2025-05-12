import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaPhoneAlt, FaMapMarkerAlt, FaClipboardList, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { motion } from 'framer-motion'; 
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const OrderView = ({ orderId }) => {
  const [order, setOrder] = useState(null);

  useEffect(() => {
    fetchOrderDetails();
  }, [orderId]);

  const fetchOrderDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/orders/${orderId}`);
      setOrder(response.data);
    } catch (error) {
      console.error('Error fetching order details:', error);
      toast.error('Failed to fetch order details.');
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return <span className="bg-yellow-200 text-yellow-700 px-3 py-1 rounded-full">Pending</span>;
      case 'completed':
        return <span className="bg-green-200 text-green-700 px-3 py-1 rounded-full">Completed</span>;
      case 'cancelled':
        return <span className="bg-red-200 text-red-700 px-3 py-1 rounded-full">Cancelled</span>;
      default:
        return null;
    }
  };

  const handleEditOrder = () => {
    // Redirect to order edit page or show form to edit order
    toast.info('Edit functionality can be implemented here');
  };

  if (!order) {
    return (
      <motion.div className="p-8 bg-gray-100" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
        <h2 className="text-2xl font-bold text-gray-800">Loading order details...</h2>
      </motion.div>
    );
  }

  return (
    <motion.div className="p-8 bg-gray-100" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Order Details</h1>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-700">Customer Information</h2>
        <div className="mt-4 space-y-2">
          <div className="flex items-center">
            <FaClipboardList className="text-blue-600 mr-2" />
            <span className="text-gray-600">{order.name}</span>
          </div>
          <div className="flex items-center">
            <FaPhoneAlt className="text-blue-600 mr-2" />
            <span className="text-gray-600">Phone: {order.phone1}</span>
          </div>
          {order.phone2 && (
            <div className="flex items-center">
              <FaPhoneAlt className="text-blue-600 mr-2" />
              <span className="text-gray-600">Phone 2: {order.phone2}</span>
            </div>
          )}
          <div className="flex items-center">
            <FaMapMarkerAlt className="text-blue-600 mr-2" />
            <span className="text-gray-600">Address: {order.address}</span>
          </div>
        </div>

        <div className="mt-6">
          <h2 className="text-xl font-semibold text-gray-700">Cart Items</h2>
          <div className="mt-4 space-y-4">
            {order.cartItems.map((item, index) => (
              <div key={index} className="flex justify-between items-center py-2 border-b">
                <span className="text-gray-600">{item.productName}</span>
                <span className="text-gray-600">Qty: {item.quantity}</span>
                <span className="text-gray-600">LKR {item.price.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6">
          <div className="flex justify-between items-center">
            <span className="text-xl font-semibold text-gray-700">Total Amount</span>
            <span className="text-xl text-gray-800">LKR {order.totalAmount.toFixed(2)}</span>
          </div>
        </div>

        <div className="mt-6">
          <h2 className="text-xl font-semibold text-gray-700">Order Status</h2>
          <div className="mt-2">{getStatusBadge(order.status)}</div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={handleEditOrder}
            className="bg-yellow-500 text-white px-6 py-2 rounded-lg hover:bg-yellow-600 transition-all duration-300"
          >
            Edit Order
          </button>
        </div>
      </div>

      <ToastContainer />
    </motion.div>
  );
};

export default OrderView;
