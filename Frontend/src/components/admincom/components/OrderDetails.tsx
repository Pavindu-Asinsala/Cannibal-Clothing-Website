import React from "react";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import StatusBadge from "./StatusBadge";

interface OrderDetailsProps {
  order: any;
  onEdit: () => void;
  onDelete: (id: string) => void;
  onStatusChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const OrderDetails: React.FC<OrderDetailsProps> = ({
  order,
  onEdit,
  onDelete,
  onStatusChange,
}) => {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800">Order Details</h1>
      <p><strong>Name:</strong> {order.name}</p>
      <p><strong>Phone 1:</strong> {order.phone1}</p>
      <p><strong>Phone 2:</strong> {order.phone2 || "N/A"}</p>
      <p><strong>Address:</strong> {order.address}</p>
      <p><strong>Total Amount:</strong> ${order.totalAmount.toFixed(2)}</p>
      <div className="flex items-center">
        <strong>Status:</strong>
        <select value={order.status} onChange={onStatusChange} className="ml-2">
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>
      <div>
        <h2 className="text-xl font-semibold mt-4">Cart Items</h2>
        <ul>
          {order.cartItems.map((item, index) => (
            <li key={index}>{item.quantity} x {item.productName} - ${item.price.toFixed(2)}</li>
          ))}
        </ul>
      </div>
      <div className="mt-4">
        <button onClick={onEdit} className="bg-yellow-600 text-white px-4 py-2 rounded-md">
          <FaEdit /> Edit
        </button>
        <button onClick={() => onDelete(order.id)} className="bg-red-600 text-white px-4 py-2 ml-2 rounded-md">
          <FaTrashAlt /> Delete
        </button>
      </div>
    </div>
  );
};

export default OrderDetails;
