import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css'; 
import { FaTrashAlt, FaReply } from 'react-icons/fa'; 

const ManageMessages = () => {
  const [messages, setMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  // Fetch messages from the API
  const fetchMessages = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/contacts');
      setMessages(response.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast.error('Failed to fetch messages');
    }
  };

  // Handle deleting a message
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      try {
        await axios.delete(`http://localhost:5000/api/contacts/${id}`);
        toast.success('Message deleted successfully');
        fetchMessages();
      } catch (error) {
        console.error('Error deleting message:', error);
        toast.error('Failed to delete message');
      }
    }
  };

  // Handle viewing a single message with details
  const handleViewMessage = (message) => {
    setSelectedMessage(message);
  };

  return (
    <div className="p-8 bg-gray-100">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Manage Messages</h1>

      {/* Message List */}
      <div className="overflow-x-auto bg-white rounded-lg shadow-md">
        <table className="w-full table-auto">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="px-6 py-3">Name</th>
              <th className="px-6 py-3">Title</th>
              <th className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {messages.slice().reverse().map((message) => (
              <tr key={message._id} className="border-b hover:bg-gray-100">
                <td className="px-6 py-3">{message.name}</td>
                <td className="px-6 py-3">{message.title}</td>
                <td className="px-6 py-3 flex space-x-4">
                  <button
                    className="text-blue-500 hover:text-blue-600"
                    onClick={() => handleViewMessage(message)}
                  >
                    <FaReply className="inline-block mr-2" /> View
                  </button>
                  <button
                    className="text-red-500 hover:text-red-600"
                    onClick={() => handleDelete(message._id)}
                  >
                    <FaTrashAlt className="inline-block mr-2" /> Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Show Message Details */}
      {selectedMessage && (
        <div className="mt-6 p-6 bg-white rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-4">Message Details</h2>
          <div className="space-y-4">
            <div>
              <strong>Name:</strong> {selectedMessage.name}
            </div>
            <div>
              <strong>Email:</strong> {selectedMessage.email}
            </div>
            <div>
              <strong>Phone:</strong> {selectedMessage.phone}
            </div>
            <div>
              <strong>Title:</strong> {selectedMessage.title}
            </div>
            <div>
              <strong>Message:</strong>
              <p>{selectedMessage.message}</p>
            </div>
            <div className="mt-6 flex justify-between">
              <button
                type="button"
                className="bg-gray-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-gray-700"
                onClick={() => setSelectedMessage(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  );
};

export default ManageMessages;
