import React, { useState, useEffect } from "react";
import OrderList from "./components/OrderList";
import OrderDetails from "./components/OrderDetails";
import OrderForm from "./components/OrderForm";

const OrderHandle = () => {
  const [orders, setOrders] = useState([]);
  const [formData, setFormData] = useState({});
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Fetch orders from an API or mock data
  const fetchOrders = async () => {
    try {
      // Replace with API call or mock data
      const response = [
        { id: 1, status: "pending", name: "Order 1" },
        { id: 2, status: "completed", name: "Order 2" },
      ];
      setOrders(response);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleDelete = (id) => {
    setOrders(orders.filter((order) => order.id !== id));
    setSelectedOrder(null);
  };

  const handleStatusChange = (id, status) => {
    setOrders(
      orders.map((order) =>
        order.id === id ? { ...order, status } : order
      )
    );
  };

  const handleSubmit = (data) => {
    if (data.id) {
      // Update existing order
      setOrders(
        orders.map((order) => (order.id === data.id ? data : order))
      );
    } else {
      // Add new order
      const newOrder = { ...data, id: Date.now() }; // Assign unique ID
      setOrders([...orders, newOrder]);
    }
    setFormData({});
  };

  return (
    <div className="flex">
      {/* Order List */}
      <OrderList
        orders={orders}
        onSelectOrder={(order) => setSelectedOrder(order)}
      />

      {/* Order Details or Form */}
      {selectedOrder ? (
        <OrderDetails
          order={selectedOrder}
          onEdit={() => setFormData(selectedOrder)}
          onDelete={(id) => handleDelete(id)}
          onStatusChange={(status) =>
            handleStatusChange(selectedOrder.id, status)
          }
        />
      ) : (
        <OrderForm
          formData={formData}
          setFormData={setFormData}
          onSubmit={(data) => handleSubmit(data)}
          onCancel={() => setFormData({})}
        />
      )}
    </div>
  );
};

export default OrderHandle;
