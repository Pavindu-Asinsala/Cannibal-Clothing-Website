import React from "react";
import { motion } from "framer-motion";
import StatusBadge from "./StatusBadge";

interface OrderListProps {
  orders: any[];
  onSelectOrder: (order: any) => void;
}

const OrderList: React.FC<OrderListProps> = ({ orders, onSelectOrder }) => {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800">Order List</h1>
      {orders.length === 0 ? (
        <p className="text-gray-600">No orders available.</p>
      ) : (
        orders.map((order) => (
          <motion.div
            key={order.id}
            className="mb-4 p-4 rounded-lg shadow-md cursor-pointer border-l-4"
            onClick={() => onSelectOrder(order)}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold text-gray-800">{order.name}</h2>
                <p className="text-gray-600">Phone: {order.phone1}</p>
                <p className="text-gray-600">Address: {order.address}</p>
              </div>
              <StatusBadge status={order.status} />
            </div>
          </motion.div>
        ))
      )}
    </div>
  );
};

export default OrderList;
