import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { 
  FiEdit, 
  FiEye, 
  FiX, 
  FiFilter, 
  FiDollarSign, 
  FiPackage, 
  FiUser, 
  FiPhone, 
  FiMapPin, 
  FiShoppingCart,
  FiCheckCircle,
  FiClock,
  FiXCircle,
  FiFileText
} from "react-icons/fi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useNavigate } from "react-router-dom";

const OrderManage = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [formData, setFormData] = useState(null);
  const [editingOrder, setEditingOrder] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, [refresh]);

  useEffect(() => {
    let result = orders;
    
    if (filter !== "all") {
      result = result.filter(order => order.status === filter);
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(order => 
        order.name.toLowerCase().includes(query) || 
        order.phone1.includes(query) ||
        order.address.toLowerCase().includes(query)
      );
    }
    
    setFilteredOrders(result);
  }, [filter, orders, searchQuery]);

  const fetchOrders = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/orders");
      setOrders(response.data.reverse());
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Error fetching orders.");
    }
  };

  const handleUpdateOrder = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone1 || !formData.address || !formData.cartItems.length) {
      toast.error("Please fill in all the required fields.");
      return;
    }

    const finalOrderData = { ...formData };

    try {
      if (editingOrder && editingOrder.id) {
        await axios.put(
          `http://localhost:5000/api/orders/${editingOrder.id}`,
          finalOrderData
        );
        toast.success("Order updated successfully!");
        setRefresh(!refresh);
        setFormData(null);
        setEditingOrder(null);
        setSelectedOrder(null);
      }
    } catch (error) {
      console.error("Error saving order:", error);
      toast.error(
        `Error saving order: ${error.response?.data?.message || error.message}`
      );
    }
  };

  const handleSelectOrder = (order) => {
    setSelectedOrder(order);
    setFormData(order);
    setEditingOrder(order);
  };

  const resetForm = () => {
    setFormData(null);
    setEditingOrder(null);
    setSelectedOrder(null);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-amber-100 text-amber-800";
      case "completed":
        return "bg-emerald-100 text-emerald-800";
      case "cancelled":
        return "bg-rose-100 text-rose-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const countOrdersByStatus = (status) => {
    return orders.filter(order => order.status === status).length;
  };

  const generateOrderPDF = () => {
    if (!selectedOrder) return;
    
    // Create a new PDF document
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    
    // Add title
    const title = "Order Report";
    doc.setFontSize(20);
    doc.text(title, pageWidth / 2, 15, { align: 'center' });
    
    // Add order ID
    doc.setFontSize(12);
    doc.text(`Order ID: ${selectedOrder._id || selectedOrder.id || 'N/A'}`, 14, 25);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 32);
    doc.text(`Status: ${selectedOrder.status.toUpperCase()}`, 14, 39);
    
    // Customer information
    doc.setFontSize(16);
    doc.text("Customer Information", 14, 50);
    doc.setFontSize(12);
    doc.text(`Name: ${selectedOrder.name}`, 14, 58);
    doc.text(`Primary Phone: ${selectedOrder.phone1}`, 14, 65);
    doc.text(`Secondary Phone: ${selectedOrder.phone2 || "N/A"}`, 14, 72);
    doc.text(`Address: ${selectedOrder.address}`, 14, 79);
    
    // Order Summary
    doc.setFontSize(16);
    doc.text("Order Summary", 14, 95);
    
    // Summary table
    autoTable(doc, {
      startY: 100,
      head: [['Description', 'Amount']],
      body: [
        ['Subtotal', `$${selectedOrder.totalAmount?.toFixed(2) || "0.00"}`],
        ['Shipping', '$0.00'],
        ['Total', `$${selectedOrder.totalAmount?.toFixed(2) || "0.00"}`]
      ],
      headStyles: { fillColor: [59, 130, 246] },
    });
    
    // Order items
    doc.setFontSize(16);
    doc.text("Ordered Items", 14, doc.lastAutoTable.finalY + 15);
    
    // Items table
    const itemsTableData = selectedOrder.cartItems.map(item => [
      item.productName,
      item.color || "N/A",
      item.quantity,
      `$${item.price.toFixed(2)}`,
      `$${(item.price * item.quantity).toFixed(2)}`
    ]);
    
    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 20,
      head: [['Product', 'Color', 'Quantity', 'Price', 'Total']],
      body: itemsTableData,
      headStyles: { fillColor: [59, 130, 246] },
    });
    
    // Footer
    const footerText = "Thank you for your business!";
    doc.setFontSize(10);
    doc.text(footerText, pageWidth / 2, doc.internal.pageSize.getHeight() - 10, { align: 'center' });
    
    // Save the PDF
    doc.save(`Order_${selectedOrder._id || selectedOrder.id || 'Report'}.pdf`);
    
    toast.success("Order report downloaded successfully!");
  };

  const totalOrders = orders.length;
  const completedOrders = countOrdersByStatus("completed");
  const pendingOrders = countOrdersByStatus("pending");
  const cancelledOrders = countOrdersByStatus("cancelled");

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Left Panel: Order List */}
      <motion.div
        className="w-full lg:w-1/2 p-6 overflow-y-auto"
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex flex-col space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">Order Dashboard</h1>
          </div>
          
          {/* Search and Filter Bar */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search orders..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="absolute left-3 top-2.5 text-gray-400">
                <FiFilter size={18} />
              </div>
            </div>
          </div>
          
          {/* Order Stats Cards */}
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
  {/* Total Orders */}
  <div 
    onClick={() => setFilter("all")}
    className={`p-3 rounded-lg cursor-pointer transition-all ${filter === "all" ? "bg-indigo-50 border-2 border-indigo-200" : "bg-white border border-gray-100 hover:border-indigo-100 shadow-xs"}`}
  >
    <div className="flex items-center space-x-2">
      <div className="p-2 rounded-md bg-indigo-100 text-indigo-600">
        <FiPackage size={18} />
      </div>
      <div>
        <p className="text-[11px] font-medium text-gray-500 uppercase tracking-wide">Total Orders</p>
        <p className="text-xl font-bold text-gray-800">{totalOrders}</p>
      </div>
    </div>
  </div>
  
  {/* Completed Orders */}
  <div 
    onClick={() => setFilter("completed")}
    className={`p-3 rounded-lg cursor-pointer transition-all ${filter === "completed" ? "bg-green-50 border-2 border-green-200" : "bg-white border border-gray-100 hover:border-green-100 shadow-xs"}`}
  >
    <div className="flex items-center space-x-2">
      <div className="p-2 rounded-md bg-green-100 text-green-600">
        <FiCheckCircle size={18} />
      </div>
      <div>
        <p className="text-[11px] font-medium text-gray-500 uppercase tracking-wide">Completed</p>
        <p className="text-xl font-bold text-gray-800">{completedOrders}</p>
      </div>
    </div>
  </div>
  
  {/* Pending Orders */}
  <div 
    onClick={() => setFilter("pending")}
    className={`p-3 rounded-lg cursor-pointer transition-all ${filter === "pending" ? "bg-amber-50 border-2 border-amber-200" : "bg-white border border-gray-100 hover:border-amber-100 shadow-xs"}`}
  >
    <div className="flex items-center space-x-2">
      <div className="p-2 rounded-md bg-amber-100 text-amber-600">
        <FiClock size={18} />
      </div>
      <div>
        <p className="text-[11px] font-medium text-gray-500 uppercase tracking-wide">Pending</p>
        <p className="text-xl font-bold text-gray-800">{pendingOrders}</p>
      </div>
    </div>
  </div>
  
  {/* Cancelled Orders */}
  <div 
    onClick={() => setFilter("cancelled")}
    className={`p-3 rounded-lg cursor-pointer transition-all ${filter === "cancelled" ? "bg-rose-50 border-2 border-rose-200" : "bg-white border border-gray-100 hover:border-rose-100 shadow-xs"}`}
  >
    <div className="flex items-center space-x-2">
      <div className="p-2 rounded-md bg-rose-100 text-rose-600">
        <FiXCircle size={18} />
      </div>
      <div>
        <p className="text-[11px] font-medium text-gray-500 uppercase tracking-wide">Cancelled</p>
        <p className="text-xl font-bold text-gray-800">{cancelledOrders}</p>
      </div>
    </div>
  </div>
</div>
          
          {/* Order List */}
          <div className="space-y-3">
            {filteredOrders.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                <FiPackage size={48} className="mb-4" />
                <p>No orders found</p>
              </div>
            ) : (
              filteredOrders.map((order) => (
                <motion.div
                  key={order.id}
                  className={`p-4 rounded-xl cursor-pointer border-l-4 ${getStatusColor(order.status)} bg-white shadow-sm hover:shadow-md transition-all`}
                  onClick={() => handleSelectOrder(order)}
                  whileHover={{ y: -2 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                        <FiUser className="text-gray-400" />
                        {order.name}
                      </h2>
                      <p className="text-sm text-gray-600 flex items-center gap-2">
                        <FiPhone className="text-gray-400" />
                        {order.phone1}
                      </p>
                      <p className="text-sm text-gray-600 flex items-start gap-2">
                        <FiMapPin className="text-gray-400 mt-0.5" />
                        <span className="flex-1">{order.address}</span>
                      </p>
                    </div>
                    <div className="flex flex-col items-end space-y-1">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                      <span className="text-sm font-medium text-gray-700">
                        ${order.totalAmount?.toFixed(2) || "0.00"}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </motion.div>

      {/* Right Panel: Order Details */}
      <AnimatePresence>
        {selectedOrder && (
          <motion.div
            className="fixed inset-0 lg:relative lg:w-1/2 bg-white lg:bg-gray-50 z-10 lg:z-0 p-6 overflow-y-auto shadow-xl lg:shadow-none"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <div className="flex flex-col h-full">
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Order Details</h1>
                <button
                  onClick={resetForm}
                  className="p-2 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition"
                >
                  <FiX size={20} />
                </button>
              </div>
              
              <div className="flex-1 space-y-6">
                {/* Customer Info Card */}
                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <FiUser className="text-blue-500" />
                    Customer Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Name</p>
                      <p className="font-medium">{formData.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Primary Phone</p>
                      <p className="font-medium">{formData.phone1}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Secondary Phone</p>
                      <p className="font-medium">{formData.phone2 || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Order Status</p>
                      <p className={`font-medium inline-flex items-center px-2.5 py-0.5 rounded-full text-xs ${getStatusColor(formData.status)}`}>
                        {formData.status.charAt(0).toUpperCase() + formData.status.slice(1)}
                      </p>
                    </div>
                    <div className="md:col-span-2">
                      <p className="text-sm text-gray-500">Delivery Address</p>
                      <p className="font-medium">{formData.address}</p>
                    </div>
                  </div>
                </div>
                
                {/* Order Summary Card */}
                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <FiShoppingCart className="text-blue-500" />
                    Order Summary
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between border-b pb-2">
                      <p className="text-gray-600">Subtotal</p>
                      <p className="font-medium">${formData.totalAmount?.toFixed(2) || "0.00"}</p>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                      <p className="text-gray-600">Shipping</p>
                      <p className="font-medium">$0.00</p>
                    </div>
                    <div className="flex justify-between text-lg font-semibold">
                      <p>Total</p>
                      <p>${formData.totalAmount?.toFixed(2) || "0.00"}</p>
                    </div>
                  </div>
                </div>
                
                {/* Items List Card */}
                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <FiPackage className="text-blue-500" />
                    Ordered Items ({formData.cartItems.length})
                  </h3>
                  <div className="space-y-4">
                    {formData.cartItems.length > 0 ? (
                      formData.cartItems.map((item, index) => (
                        <div key={index} className="flex justify-between items-start border-b pb-4 last:border-0">
                          <div className="flex space-x-4">
                            <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                              <FiPackage className="text-gray-400" size={24} />
                            </div>
                            <div>
                              <p className="font-medium">{item.productName}</p>
                              <p className="text-sm text-gray-500">Color: {item.color}</p>
                              <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                            </div>
                          </div>
                          <p className="font-medium">
                            ${(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-center py-4">No items in this order</p>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200 mt-6">
                <button
                  onClick={resetForm}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
                >
                  Close
                </button>
                <button
                  onClick={generateOrderPDF}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition flex items-center gap-2"
                >
                  <FiFileText size={16} />
                  Report
                </button>
                <button
                  onClick={() => navigate(`/order-edit/${selectedOrder._id}`)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
                >
                  <FiEdit size={16} />
                  Edit Order
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Empty State for Right Panel */}
      {!selectedOrder && (
        <motion.div 
          className="hidden lg:flex lg:w-1/2 items-center justify-center p-6 bg-gray-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="text-center">
            <div className="mx-auto w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mb-4">
              <FiEye size={32} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-700">Select an order</h3>
            <p className="text-gray-500 mt-1">Choose an order from the list to view details</p>
          </div>
        </motion.div>
      )}

      <ToastContainer position="bottom-right" autoClose={3000} />
    </div>
  );
};

export default OrderManage;
