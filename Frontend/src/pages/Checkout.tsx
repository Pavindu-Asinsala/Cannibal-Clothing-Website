// Checkout.js
import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import axios from 'axios';

export default function Checkout() {
  const { state, dispatch } = useCart();
  const [formData, setFormData] = useState({
    name: '',
    phone1: '',
    phone2: '',
    address: '',
  });
  const [error, setError] = useState(null);
  const total = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async () => {
    try {
      const cartItems = state.items.map((item) => ({
        productName: item.productName,
        quantity: item.quantity,
        price: item.price,
      }));

      const orderData = {
        ...formData,
        cartItems,
        totalAmount: total,
      };

      await axios.post('http://localhost:5000/api/orders', orderData);

      dispatch({ type: 'CLEAR_CART' });
      alert('Order placed successfully!');
    } catch (err) {
      console.error('Error placing order:', err);
      setError('Failed to place the order.');
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow">
      <h1 className="text-2xl font-semibold mb-4">Checkout</h1>
      {error && <p className="text-red-500">{error}</p>}
      <div className="space-y-4">
        <div>
          <label className="block font-medium">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full border rounded px-4 py-2"
          />
        </div>
        <div>
          <label className="block font-medium">Primary Phone</label>
          <input
            type="text"
            name="phone1"
            value={formData.phone1}
            onChange={handleInputChange}
            className="w-full border rounded px-4 py-2"
          />
        </div>
        <div>
          <label className="block font-medium">Secondary Phone</label>
          <input
            type="text"
            name="phone2"
            value={formData.phone2}
            onChange={handleInputChange}
            className="w-full border rounded px-4 py-2"
          />
        </div>
        <div>
          <label className="block font-medium">Address</label>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            className="w-full border rounded px-4 py-2"
          />
        </div>
      </div>
      <button
        onClick={handlePlaceOrder}
        className="mt-6 w-full bg-black text-white py-2 rounded hover:bg-gray-800"
      >
        Place Order
      </button>
    </div>
  );
}
