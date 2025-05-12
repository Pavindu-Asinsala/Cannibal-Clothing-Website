// src/pages/Confirmation.js
import React from 'react';
import { useLocation, Link } from 'react-router-dom';

export default function Confirmation() {
  const location = useLocation();
  const { cartItems, totalAmount } = location.state || {};

  return (
    <div className="pt-20 pb-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Order Confirmation</h1>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Thank you for your order!</h2>
          <p className="text-gray-600 mb-4">Your order has been successfully placed.</p>

          <div className="mb-4">
            <h3 className="font-semibold text-lg">Order Details:</h3>
            <ul className="space-y-2 mt-2">
              {cartItems?.map((item, index) => (
                <li key={index} className="flex justify-between">
                  <span>{item.productName}</span>
                  <span>{item.quantity} x LKR {item.price}</span>
                </li>
              ))}
            </ul>
            <div className="flex justify-between mt-4 font-semibold">
              <span>Total</span>
              <span>LKR {totalAmount.toFixed(2)}</span>
            </div>
          </div>

          <div className="text-center mt-8">
            <Link
              to="/store"
              className="inline-block bg-black text-white px-6 py-2 rounded-full hover:bg-gray-800 transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
