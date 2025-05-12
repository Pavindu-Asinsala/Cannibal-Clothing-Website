import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import axios from 'axios';
import { CheckCircle } from 'lucide-react';

export default function Cart() {
  const { state, dispatch } = useCart();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone1: '',
    phone2: '',
    address: '',
  });
  const [formErrors, setFormErrors] = useState({
    name: '',
    phone1: '',
    phone2: '',
    address: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const total = cartItems.reduce((sum, item) => {
    return sum + (item.product?.price ?? 0) * item.quantity;
  }, 0);

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        setLoading(true);
        const productIds = state.items.map((item) => item.productId);
        const response = await axios.get('http://localhost:5000/api/products', {
          params: { ids: productIds.join(',') },
        });

        const updatedCartItems = state.items.map((item) => {
          const product = response.data.find((p) => p._id === item.productId);
          return { ...item, product };
        });
        setCartItems(updatedCartItems);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching product details:', err);
        setError('Failed to load product details.');
        setLoading(false);
      }
    };

    fetchCartItems();
  }, [state.items]);

  const validateField = (name, value) => {
    let error = '';
    
    switch (name) {
      case 'name':
        if (!value.trim()) error = 'Name is required';
        else if (value.length < 3) error = 'Name must be at least 3 characters';
        break;
      case 'phone1':
        if (!value) error = 'Primary phone is required';
        else if (!/^\d{10}$/.test(value)) error = 'Phone must be exactly 10 digits';
        break;
      case 'phone2':
        if (value && !/^\d{10}$/.test(value)) error = 'Phone must be exactly 10 digits';
        break;
      case 'address':
        if (!value.trim()) error = 'Address is required';
        else if (value.length < 10) error = 'Address must be at least 10 characters';
        break;
      default:
        break;
    }
    
    return error;
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    
    // For phone fields, only allow numbers and limit to 10 digits
    if (name === 'phone1' || name === 'phone2') {
      if (value && !/^\d*$/.test(value)) return; // Only allow numbers
      if (value.length > 10) return; // Limit to 10 digits
    }
    
    setFormData({
      ...formData,
      [name]: value,
    });
    
    // Validate the field and update errors
    setFormErrors({
      ...formErrors,
      [name]: validateField(name, value)
    });
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;
    
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key]);
      newErrors[key] = error;
      if (error) isValid = false;
    });
    
    setFormErrors(newErrors);
    return isValid;
  };

  const handleCheckout = () => {
    setShowModal(true);
    setError(null);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Validate all fields before submission
    const isValid = validateForm();
    
    if (!isValid) {
      setIsSubmitting(false);
      setError('Please fix the errors in the form');
      return;
    }
    
    try {
      const orderData = {
        ...formData,
        cartItems: cartItems.map((item) => ({
          productName: item.product?.name,
          quantity: item.quantity,
          color: item.product?.color || 'N/A',
          price: item.product?.price,
        })),
        totalAmount: total,
      };

      await axios.post('http://localhost:5000/api/orders', orderData);
      setShowModal(false);
      setShowSuccessPopup(true);
      dispatch({ type: 'CLEAR_CART' });
      
      setTimeout(() => {
        navigate('/');
      }, 5000);
    } catch (error) {
      console.error('Error placing order:', error);
      setError('Failed to place order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseSuccessPopup = () => {
    setShowSuccessPopup(false);
    navigate('/');
  };

  const handleClearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
    setCartItems([]);
  };

  const handleAddMoreItems = () => {
    navigate('/store');
  };

  if (loading) {
    return <div className="pt-20 pb-8 text-center">Loading cart...</div>;
  }

  if (error && !showModal) {
    return <div className="pt-20 pb-8 text-center text-red-500">{error}</div>;
  }

  return (
    <div className="pt-20 pb-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
        {cartItems.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">Your cart is empty</p>
            <Link
              to="/store"
              className="inline-block bg-black text-white px-6 py-2 rounded-full hover:bg-gray-800 transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.productId}
                  className="flex gap-4 bg-white p-4 rounded-lg shadow-sm"
                >
                  <img
                    src={item.product?.images[0]}
                    alt={item.product?.name}
                    className="w-24 h-24 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold">{item.product?.name}</h3>
                    <p className="text-gray-600">
                      Size: {item.size} | Color: {item.color}
                    </p>
                    <p className="font-medium">LKR {item.product?.price}</p>

                    <div className="flex items-center gap-4 mt-2">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            if (item.quantity > 1) {
                              dispatch({
                                type: 'UPDATE_QUANTITY',
                                payload: {
                                  productId: item.productId,
                                  quantity: item.quantity - 1,
                                },
                              });
                            }
                          }}
                          className="p-1 hover:bg-gray-100 rounded"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <button
                          onClick={() =>
                            dispatch({
                              type: 'UPDATE_QUANTITY',
                              payload: {
                                productId: item.productId,
                                quantity: item.quantity + 1,
                              },
                            })
                          }
                          className="p-1 hover:bg-gray-100 rounded"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      <button
                        onClick={() =>
                          dispatch({
                            type: 'REMOVE_ITEM',
                            payload: item.productId,
                          })
                        }
                        className="text-red-500 hover:text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>LKR {total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>Free</span>
                  </div>
                  <div className="border-t pt-2 font-semibold">
                    <div className="flex justify-between">
                      <span>Total</span>
                      <span>LKR {total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  className="block w-full bg-black text-white text-center py-3 rounded-full hover:bg-gray-800 transition-colors"
                >
                  Proceed to Checkout
                </button>

                <div className="mt-4 space-y-2">
                  <button
                    onClick={handleAddMoreItems}
                    className="w-full bg-blue-600 text-white py-3 rounded-full hover:bg-blue-700 transition-colors"
                  >
                    Add More Items
                  </button>
                  <button
                    onClick={handleClearCart}
                    className="w-full bg-red-600 text-white py-3 rounded-full hover:bg-red-700 transition-colors"
                  >
                    Clear Cart
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal for user input */}
        {showModal && (
          <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
              <h2 className="text-xl font-semibold mb-4">Enter Your Details</h2>
              {error && <p className="text-red-500 mb-4">{error}</p>}
              <form onSubmit={handleFormSubmit}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Full Name*</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleFormChange}
                      placeholder="Enter your full name"
                      className={`w-full p-2 border rounded ${formErrors.name ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {formErrors.name && <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Primary Phone*</label>
                    <input
                      type="tel"
                      name="phone1"
                      value={formData.phone1}
                      onChange={handleFormChange}
                      placeholder="Enter 10-digit phone number"
                      maxLength="10"
                      className={`w-full p-2 border rounded ${formErrors.phone1 ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {formErrors.phone1 && <p className="text-red-500 text-xs mt-1">{formErrors.phone1}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Secondary Phone</label>
                    <input
                      type="tel"
                      name="phone2"
                      value={formData.phone2}
                      onChange={handleFormChange}
                      placeholder="Optional 10-digit phone number"
                      maxLength="10"
                      className={`w-full p-2 border rounded ${formErrors.phone2 ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {formErrors.phone2 && <p className="text-red-500 text-xs mt-1">{formErrors.phone2}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Address*</label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleFormChange}
                      placeholder="Enter your full address"
                      rows="3"
                      className={`w-full p-2 border rounded ${formErrors.address ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {formErrors.address && <p className="text-red-500 text-xs mt-1">{formErrors.address}</p>}
                  </div>
                  
                  <div className="flex justify-between pt-2">
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="bg-gray-500 text-white py-2 px-6 rounded-full hover:bg-gray-600 transition-colors"
                      disabled={isSubmitting}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-black text-white py-2 px-6 rounded-full hover:bg-gray-800 transition-colors"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Processing...' : 'Submit Order'}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Success Popup */}
        {showSuccessPopup && (
          <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full mx-4 text-center">
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-4">Your order was confirmed successfully!</h2>
              <p className="text-gray-600 mb-4">
                Our agent will call you, and within 3 days, your order will be placed.
              </p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => navigate('/')}
                  className="bg-black text-white py-2 px-6 rounded-full hover:bg-gray-800 transition-colors"
                >
                  Home Page
                </button>
                <button
                  onClick={() => navigate('/contact-us')}
                  className="bg-black text-white py-2 px-6 rounded-full hover:bg-gray-800 transition-colors"
                >
                  Contact Us
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}