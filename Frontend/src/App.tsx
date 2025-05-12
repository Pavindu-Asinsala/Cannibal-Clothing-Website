import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import ChatBot from './components/ChatBot';
import Home from './pages/Home';
import Store from './pages/Store';
import FashionGallery from './pages/FashionGallery';
import Contact from './pages/Contact';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import About from './pages/About';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import Confirmation from './pages/Confirmation';
import OrderEditPage from "./components/admincom/OrderEditPage"; 
import AIItemFinder from './pages/AIItemFinder';
import AddUsersPage from './components/admincom/AddUserComponent';
import AddUserComponent from './components/admincom/AddUserComponent';


function App() {
  return (
    <CartProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <ChatBot />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/store" element={<Store />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/about" element={<About />} />
            <Route path="/fashiongallery" element={<FashionGallery />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/admin" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/cart/Confirmation" element={<Confirmation />} />
            <Route path="/order-edit/:orderId" element={<OrderEditPage />} />
            <Route path="/ai-item-finder" element={<AIItemFinder />} />
            <Route path="/add-user" element={<AddUsersPage />} />
            <Route path="/admin/dashboard" element={<AddUserComponent/>} />
          </Routes>
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;
