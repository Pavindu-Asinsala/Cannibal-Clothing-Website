import React, { useEffect, useState } from "react";
import axios from "axios";
import { PieChart, Pie, Tooltip, Legend, ResponsiveContainer } from "recharts";


const Dashboard = () => {
  const [productCount, setProductCount] = useState(0);
  const [userCount, setUserCount] = useState(0);
  const [orderCount, setOrderCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, usersRes, ordersRes] = await Promise.all([
          axios.get("http://localhost:5000/api/products"),
          axios.get("http://localhost:5000/api/users/viewusers"),
          axios.get("http://localhost:5000/api/orders")
        ]);

        setProductCount(productsRes.data.length);
        setUserCount(usersRes.data.length);
        setOrderCount(ordersRes.data.length);
      } catch (error) {
        console.error("Error fetching dashboard data", error);
      }
    };

    fetchData();
  }, []);

  // Pie chart data
  const pieChartData = [
    { name: "Products", value: productCount, fill: "#4CAF50" },  // Green
    { name: "Users", value: userCount, fill: "#FF9800" },        // Orange
    { name: "Orders", value: orderCount, fill: "#F44336" }       // Red
  ];

  return (
    <div className="p-8 bg-gray-100">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Dashboard Performance</h1>

      {/* Rectangles with gradient background */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-r from-green-400 to-green-600 shadow rounded-2x2 p-4 text-center">
          <h2 className="text-xl font-semibold mb-2 text-white">Products</h2>
          <p className="text-4xl font-bold text-white">{productCount}</p>
        </div>

        <div className="bg-gradient-to-r from-orange-400 to-orange-600 shadow rounded-2x2 p-4 text-center">
          <h2 className="text-xl font-semibold mb-2 text-white">Users</h2>
          <p className="text-4xl font-bold text-white">{userCount}</p>
        </div>

        <div className="bg-gradient-to-r from-red-400 to-red-600 shadow rounded-2x2 p-4 text-center">
          <h2 className="text-xl font-semibold mb-2 text-white">Orders</h2>
          <p className="text-4xl font-bold text-white">{orderCount}</p>
        </div>
      </div>


      {/* Flex layout for Pie Chart and Loading Bars */}
      <div className="mt-8 flex space-x-Z">

        {/* Left Card for Pie Chart */}
        <div className="w-full sm:w-1/2 md:w-1/2 bg-white shadow rounded-2x2 p-4 text-center hover:bg-gray-200 transition-colors duration-300 cursor-pointer">

          <h2 className="text-xl font-semibold mb-5 text-Black">Product, User, Order Distribution</h2>
          <ResponsiveContainer width="100%" height={350}>
            <PieChart>
              <Pie
                data={pieChartData}
                dataKey="value"
                nameKey="name"
                cx="50%"       // Center horizontally
                cy="50%"       // Center vertically
                outerRadius={120}
                innerRadius={50}  // Optional: Adds a hole to create a donut chart
                fill="#8884d8"
                labelLine={false}  // Hides the line connecting the label to the pie slice
                label // Custom label
              />
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Right Card for Loading Bars */}
        <div className="w-full sm:w-1/2 md:w-1/2 bg-white shadow rounded-2x2 p-4 text-center hover:bg-gray-200 transition-colors duration-300 cursor-pointer">

          <h2 className="text-xl font-semibold mb-5 text-Black">Progress</h2>
          <div className="flex flex-col space-y-3">

            {/* Product Loading Bar */}
            <div>
              <h2 className="text-xl font-semibold mb-5 text-black text-left">Product</h2>
              <div className="w-full bg-gray-100 h-3">
                <div
                  className="bg-[#001F3F] h-3 " // Navy Blue
                  style={{ width: `${(productCount / 100) * 100}%` }} // Adjust percentage based on count
                ></div>
              </div>
            </div>


            {/* Users Loading Bar */}
            <div>
              <h2 className="text-xl font-semibold mb-5 text-black text-left">Users</h2>
              <div className="w-full bg-gray-100 h-3">
                <div
                  className="bg-[#001F3F] h-3 "
                  style={{ width: `${(userCount / 100) * 100}%` }} // Adjust percentage based on count
                ></div>
              </div>
            </div>

            {/* Orders Loading Bar */}
            <div>
              <h2 className="text-xl font-semibold mb-5 text-black text-left">Order</h2>
              <div className="w-full bg-gray-100 h-3">
                <div
                  className="bg-[#001F3F] h-3 "
                  style={{ width: `${(orderCount / 100) * 100}%` }} // Adjust percentage based on count
                ></div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};


export default Dashboard;
