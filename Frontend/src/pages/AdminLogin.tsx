import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User, ArrowRight, X } from 'lucide-react';
import axios from 'axios';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showForm, setShowForm] = useState(false);

  const images = [
    "https://i.ibb.co/bBsr0tH/DSC07648.png",
    "https://i.ibb.co/hWt5Ssc/DSC07653.png",
    "https://i.ibb.co/dDN5B2s/DSC07656.png",
    "https://i.ibb.co/yQ8HcsZ/DSC07600.png",
    "https://i.ibb.co/QJM0TMP/DSC07607.png",
    "https://i.ibb.co/HCjwQzC/DSC07612.png"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('http://localhost:5000/api/users/login', {
        username: email,
        password,
      });

      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('isAdmin', 'true');
        navigate('/admin/dashboard');
      } else {
        setError('Invalid credentials');
      }
    } catch (error) {
      console.error(error);
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    // Implement Google Authentication
    console.log("Google login clicked");
    // Redirect to Google Auth endpoint or use Google SDK
  };

  return (
    <div className="min-h-screen w-full flex bg-black text-white overflow-hidden relative">
      {/* Background Slideshow */}
      <div className="absolute inset-0 z-0">
        {images.map((src, index) => (
          <div 
            key={index}
            className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
            style={{ 
              opacity: index === currentImageIndex ? 0.7 : 0,
              backgroundImage: `url(${src})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              filter: 'brightness(0.5)'
            }}
          />
        ))}
        <div className="absolute inset-0 bg-black bg-opacity-40 z-10"></div>
      </div>

      {/* Left Panel - Brand Display */}
      <div className="hidden lg:flex flex-col w-1/2 items-center justify-center relative z-20">
        <div className="animate-fade-in-up">
          <h1 className="text-6xl font-bold mb-4 tracking-tight">CANNIBAL.CO</h1>
          <p className="text-xl text-gray-300 mb-8 max-w-md text-center">
            Admin portal for our exclusive clothing collection
          </p>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center relative z-20 px-4">
        <div 
          className={`bg-white/10 backdrop-blur-lg p-8 rounded-2xl w-full max-w-md transition-all duration-500 border border-white/20 ${
            showForm ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
          }`}
          style={{
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
            animation: showForm ? 'none' : 'slideIn 0.5s ease forwards'
          }}
        >
          {!showForm ? (
            <div className="text-center py-12">
              <div className="mx-auto w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mb-6">
                <Lock className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-3xl font-bold mb-6">Admin Access</h2>
              <button 
                onClick={() => setShowForm(true)}
                className="w-full bg-white text-black py-4 rounded-xl font-bold hover:bg-gray-100 transition-colors flex items-center justify-center gap-2 group"
              >
                Sign In <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          ) : (
            <>
              <button 
                onClick={() => setShowForm(false)} 
                className="absolute top-4 right-4 text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="flex justify-center mb-6">
                <div className="p-3 bg-white/20 rounded-full">
                  <User className="w-6 h-6 text-white" />
                </div>
              </div>
              
              <h1 className="text-2xl font-bold text-center mb-8">Admin Login</h1>
              
              {error && (
                <div className="bg-red-500/20 text-red-200 p-3 rounded-lg mb-4 text-center">
                  {error}
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                    Username (Email)
                  </label>
                  <input
                    type="email"
                    id="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="mt-1 block w-full rounded-lg bg-white/10 border-gray-600 text-white shadow-sm focus:border-white focus:ring-white p-3"
                    placeholder="admin@aesthetique.com"
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="mt-1 block w-full rounded-lg bg-white/10 border-gray-600 text-white shadow-sm focus:border-white focus:ring-white p-3"
                    placeholder="••••••••"
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full bg-white text-black py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors ${
                    loading ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                >
                  {loading ? 'Signing in...' : 'Sign In'}
                </button>
                
                
              </form>
            </>
          )}
        </div>
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes slideIn {
          0% { transform: translateY(20px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
        
        .animate-fade-in-up {
          animation: fadeInUp 1s ease-out forwards;
        }
        
        @keyframes fadeInUp {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}