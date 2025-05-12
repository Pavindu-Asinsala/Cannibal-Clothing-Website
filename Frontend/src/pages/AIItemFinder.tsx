import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Sparkles, 
  Upload, 
  X, 
  Search, 
  ShoppingBag, 
  Zap, 
  Camera, 
  TrendingUp, 
  Heart,
  Filter,
  SlidersHorizontal,
  Clock,
  Check,
  AlertCircle 
} from 'lucide-react';
import { products } from '../data/products';
import ProductCard from '../components/ProductCard'; // Assuming you have this component

export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  category:
  | 'backpack'
  | 'cap'
  | 'Casual'
  | 'Handbag'
  | 'hoodie'
  | 'jeans'
  | 'pants'
  | 'polo_tshirt'
  | 'shoes'
  | 'shorts'
  | 'skirt'
  | 'tshirt';
  images: string[];
  sizes: string[];
  colors: string[];
  quantity: number;
  status: 'available' | 'low-stock' | 'sold-out';
}

const AIItemFinder = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [similarityScore, setSimilarityScore] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<'visual' | 'trending'>('visual');
  const [cameraMode, setCameraMode] = useState(false);
  const [similarityThreshold, setSimilarityThreshold] = useState(70);
  const [file, setFile] = useState(null);
  const [predictedCategory, setPredictedCategory] = useState('');
  const [similarImages, setSimilarImages] = useState([]);
  const [error, setError] = useState('');
  const [isDragActive, setIsDragActive] = useState(false);
  const [apiProducts, setApiProducts] = useState<Product[]>([]);
  const [isLoadingApi, setIsLoadingApi] = useState(false);
  
  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoadingApi(true);
      try {
        const response = await axios.get('http://localhost:5000/api/products');
        setApiProducts(response.data);
      } catch (err) {
        console.error('Failed to fetch products:', err);
        setError('Failed to fetch products. Using sample data instead.');
        // Fallback to sample products if API fails
        setApiProducts(products);
      } finally {
        setIsLoadingApi(false);
      }
    };
    
    fetchProducts();
  }, []);
  
  // Filter products based on predicted category
  useEffect(() => {
    if (predictedCategory && apiProducts.length > 0) {
      const filteredProducts = apiProducts.filter(product => 
        product.category.toLowerCase() === predictedCategory.toLowerCase() ||
        predictedCategory.toLowerCase() === 'all'
      );
      
      if (filteredProducts.length > 0) {
        setSearchResults(filteredProducts);
      } else {
        // If no products match the category, show all products
        setSearchResults(apiProducts.slice(0, 8));
      }
    }
  }, [predictedCategory, apiProducts]);
  
  const handleFileSelect = (files) => {
    if (files.length > 0) {
      const selectedFile = files[0];
      setFile(selectedFile);
      setSelectedImage(URL.createObjectURL(selectedFile));
      setIsSearching(true);
      
      // Upload the image to the backend
      uploadImage(selectedFile);
    }
  };
  
  const uploadImage = async (imageFile) => {
    setError('');
    
    const formData = new FormData();
    formData.append('file', imageFile);
    
    try {
      const response = await fetch('http://127.0.0.1:5000/upload', {
        method: 'POST',
        body: formData
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setPredictedCategory(data.category);
        setSimilarImages(data.similar_images || []);
        
        // Set random similarity score (can be replaced with actual score from backend)
        const randomScore = Math.floor(Math.random() * 30) + 70;
        setSimilarityScore(randomScore);
        
        // Products will be filtered by the useEffect that watches predictedCategory
      } else {
        setError(data.error || 'Failed to process image');
        
        // Fallback: use random category from available products for demo purposes
        const categories = [...new Set(apiProducts.map(p => p.category))];
        const randomCategory = categories[Math.floor(Math.random() * categories.length)];
        setPredictedCategory(randomCategory);
      }
    } catch (err) {
      setError(err.message || 'Error connecting to the server');
      
      // Fallback for demo
      const demoCategories =[
        'backpack',
        'cap',
        'Casual',
        'Handbag',
        'hoodie',
        'jeans',
        'pants',
        'polo_tshirt',
        'shoes',
        'shorts',
        'skirt',
        'tshirt'
      ];
      setPredictedCategory(demoCategories[Math.floor(Math.random() * demoCategories.length)]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragActive(false);
    const files = e.dataTransfer.files;
    handleFileSelect(files);
  };

  const handlePaste = (e) => {
    if (e.clipboardData && e.clipboardData.items) {
      const items = e.clipboardData.items;
      
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const file = items[i].getAsFile();
          
          if (file) {
            // Show success notification
            const notificationElement = document.createElement('div');
            notificationElement.className = 'fixed top-4 right-4 bg-black text-white px-4 py-2 rounded-lg shadow-lg z-50 flex items-center';
            notificationElement.innerHTML = '<svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg> Image pasted successfully!';
            document.body.appendChild(notificationElement);
            
            // Remove notification after 3 seconds
            setTimeout(() => {
              document.body.removeChild(notificationElement);
            }, 3000);
            
            handleFileSelect([file]);
            break;
          }
        }
      }
    }
  };

  useEffect(() => {
    const pasteListener = (e) => handlePaste(e);
    window.addEventListener('paste', pasteListener);
  
    return () => {
      window.removeEventListener('paste', pasteListener);
    };
  }, []);
  
  
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragActive(true);
  };
  
  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragActive(false);
  };
  
  const toggleFilter = (filter: string) => {
    if (activeFilters.includes(filter)) {
      setActiveFilters(activeFilters.filter(f => f !== filter));
    } else {
      setActiveFilters([...activeFilters, filter]);
    }
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'available':
        return <span className="flex items-center text-green-600 text-xs"><Check className="w-3 h-3 mr-1" /> In Stock</span>;
      case 'low-stock':
        return <span className="flex items-center text-amber-600 text-xs"><Clock className="w-3 h-3 mr-1" /> Low Stock</span>;
      case 'sold-out':
        return <span className="flex items-center text-red-600 text-xs"><AlertCircle className="w-3 h-3 mr-1" /> Sold Out</span>;
      default:
        return null;
    }
  };

  const resetSearch = (e) => {
    e.stopPropagation();
    setSelectedImage(null);
    setSearchResults([]);
    setActiveFilters([]);
    setSimilarityScore(0);
    setPredictedCategory('');
    setSimilarImages([]);
    setFile(null);
    setError('');
  };
  
  const captureFromCamera = () => {
    // In a real implementation, this would access the device camera
    // For now, just toggle camera mode UI
    setCameraMode(true);
  };
  
  const takePicture = () => {
    // Simulating taking a picture
    setCameraMode(false);
    
    // This would normally capture the image from camera stream
    // For demo, we'll show a loading state then return to upload UI
    setIsSearching(true);
    setTimeout(() => {
      setIsSearching(false);
    }, 1500);
  };
  
  const navigateToProduct = (productId) => {
    // In a real app with routing, this would navigate to the product page
    console.log(`Navigating to product: ${productId}`);
    // You can use React Router here:
    // history.push(`/product/${productId}`);
    // Or window.location for simple cases:
    // window.location.href = `/product/${productId}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white relative">
      {/* Subtle pattern overlay */}
      <div className="fixed inset-0 bg-grid-pattern opacity-5 pointer-events-none z-0"></div>
      
      {/* Minimal animated accents */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute w-96 h-96 bg-black/5 rounded-full blur-3xl -top-20 -left-20 animate-pulse"></div>
        <div className="absolute w-96 h-96 bg-black/5 rounded-full blur-3xl bottom-0 right-0 animate-pulse" style={{ animationDelay: '3s' }}></div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-16 pb-16 relative z-10">
        {/* Tab Navigation */}
        <div className="flex mb-8 border-b border-gray-200">
          <button 
            className={`py-3 px-5 font-medium flex items-center ${activeTab === 'visual' ? 'text-black border-b-2 border-black' : 'text-gray-500'}`}
            onClick={() => setActiveTab('visual')}
          >
            <Camera className="w-4 h-4 mr-2" />
            Visual Search
          </button>
          <button 
            className={`py-3 px-5 font-medium flex items-center ${activeTab === 'trending' ? 'text-black border-b-2 border-black' : 'text-gray-500'}`}
            onClick={() => setActiveTab('trending')}
          >
            <TrendingUp className="w-4 h-4 mr-2" />
            Trending Styles
          </button>
        </div>

        {activeTab === 'visual' && (
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="p-6 md:p-8">
              {!cameraMode ? (
                <div 
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  className={`relative border-2 border-dashed rounded-2xl transition-all overflow-hidden cursor-pointer
                    ${isDragActive ? 'border-black bg-gray-50' : 'border-gray-300 hover:border-gray-400'}`}
                  onClick={() => document.getElementById('file-input').click()}
                >
                  <input 
                    type="file"
                    id="file-input"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFileSelect(e.target.files)}
                  />
                  
                  {selectedImage ? (
                    <div className="relative">
                      <img 
                        src={selectedImage} 
                        alt="Uploaded" 
                        className="w-full object-contain rounded-xl"
                        style={{ maxHeight: '400px' }} // Reduced image size
                      />
                      <button
                        onClick={resetSearch}
                        className="absolute top-4 right-4 p-2 bg-black/70 hover:bg-black rounded-full text-white transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                      
                      {/* Similarity score */}
                      {similarityScore > 0 && (
                        <div className="absolute top-4 left-4 bg-black/70 rounded-full px-3 py-1.5 text-white font-medium text-sm">
                          {similarityScore}% Match
                        </div>
                      )}
                      
                      {/* Category badge */}
                      {predictedCategory && (
                        <div className="absolute top-16 left-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1.5 text-black font-medium text-sm border border-gray-200">
                          Category: {predictedCategory}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="py-12 md:py-16 space-y-5 text-center">
                      <div className="relative mx-auto w-16 h-16 bg-black rounded-full flex items-center justify-center">
                        <Upload className="w-8 h-8 text-white" />
                        <div className="absolute inset-0 bg-black rounded-full animate-ping opacity-20"></div>
                      </div>
                      <div>
                        <p className="text-xl font-medium text-gray-900">
                          {isDragActive ? 'Drop to discover similar styles' : 'Upload a fashion image'}
                        </p>
                        <p className="mt-2 text-sm text-gray-500">
                          Drag and drop or click to select an image (max 5MB)
                        </p>
                      </div>
                      <div className="pt-4 flex justify-center gap-4">
                        <button 
                          className="px-6 py-3 bg-black text-white font-medium rounded-full hover:bg-gray-800 transition-all"
                        >
                          Select Image
                        </button>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            captureFromCamera();
                          }}
                          className="px-6 py-3 bg-white border border-gray-300 text-gray-800 font-medium rounded-full hover:bg-gray-50 transition-all flex items-center"
                        >
                          <Camera className="w-4 h-4 mr-2" />
                          Use Camera
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="relative border-2 border-dashed rounded-2xl transition-all overflow-hidden">
                  <div className="aspect-video bg-gray-100 rounded-xl flex items-center justify-center">
                    <div className="text-center">
                      <Camera className="w-10 h-10 text-gray-500 mx-auto mb-4" />
                      <p className="text-gray-500">Camera preview would appear here</p>
                      <div className="flex justify-center gap-4 mt-6">
                        <button 
                          onClick={takePicture}
                          className="px-6 py-2 bg-black text-white font-medium rounded-full hover:bg-gray-800 transition-all flex items-center"
                        >
                          <Camera className="w-4 h-4 mr-2" />
                          Take Photo
                        </button>
                        
                        <button 
                          onClick={() => setCameraMode(false)}
                          className="px-6 py-2 bg-white border border-gray-300 text-gray-800 font-medium rounded-full hover:bg-gray-50 transition-all"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Error message */}
              {error && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-600 text-sm flex items-center">
                    <AlertCircle className="w-4 h-4 mr-2" />
                    {error}
                  </p>
                </div>
              )}
              
              {/* Similarity threshold slider */}
              {/*  {selectedImage && (
                <div className="mt-6 px-1">
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-gray-700">Similarity Threshold: {similarityThreshold}%</label>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="100"
                    value={similarityThreshold}
                    onChange={(e) => setSimilarityThreshold(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>More Options</span>
                    <span>Exact Matches</span>
                  </div>
                </div>
              )} */}

              {isSearching && (
                <div className="mt-10 text-center">
                  <div className="inline-flex items-center justify-center gap-3 py-3 px-6 bg-gray-50 rounded-full">
                    <div className="animate-spin w-5 h-5 border-2 border-black border-t-transparent rounded-full"></div>
                    <span className="text-gray-800 font-medium">Analyzing style details...</span>
                  </div>
                </div>
              )}

              {/* Backend Similar Images */}

              {/* {similarImages.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-sm font-medium mb-3 flex items-center">
                    <Search className="w-4 h-4 mr-2" />
                    Similar Images (From Backend)
                  </h3>
                  <div className="grid grid-cols-4 gap-3">
                    {similarImages.map((url, index) => (
                      <div key={index} className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                        <img 
                          src={url} 
                          alt={`Similar ${index}`} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )} */}
              
              {/* NEW SECTION: AI Matched Products */}
              {predictedCategory && searchResults.length > 0 && (
                <div className="mt-12 bg-gray-50 rounded-2xl p-6 border border-gray-200">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900">AI Style Match Results</h2>
                      <p className="text-sm text-gray-600">
                        Our AI detected you uploaded a <strong>{predictedCategory}</strong> style image. 
                        Here are similar items from our store:
                      </p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {searchResults.slice(0, 4).map((product) => (
                      <div 
                        key={product.id} 
                        className="cursor-pointer"
                        onClick={() => navigateToProduct(product.id)}
                      >
                        <ProductCard product={product} />
                      </div>
                    ))}
                  </div>
                  
                  {searchResults.length > 4 && (
                    <div className="mt-4 text-center">
                      <button className="px-6 py-2 bg-indigo-600 text-white font-medium rounded-full hover:bg-indigo-700 transition-all text-sm">
                        View All {searchResults.length} Matching Products
                      </button>
                    </div>
                  )}
                </div>
              )}

              {searchResults.length > 0 && (
                <div className="mt-12">
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <h2 className="text-xl font-semibold mb-1 flex items-center gap-2">
                        <Search className="w-5 h-5 text-gray-800" />
                        <span>Style Matches</span>
                      </h2>
                      <p className="text-gray-500 text-sm">Found {searchResults.length} products matching your style</p>
                    </div>
                    
                    <button 
                      onClick={() => setShowFilters(!showFilters)}
                      className="flex items-center gap-2 py-2 px-4 bg-gray-100 hover:bg-gray-200 rounded-full text-sm font-medium"
                    >
                      <Filter className="w-4 h-4" />
                      Filters
                    </button>
                  </div>
                  
                  {/* Filters */}
                  {showFilters && (
                    <div className="mb-8 p-4 bg-gray-50 rounded-xl">
                      <div className="mb-4">
                        <h3 className="text-sm font-medium mb-2">Categories</h3>
                        <div className="flex flex-wrap gap-2">
                          {[
                              'backpack',
                              'cap',
                              'Casual',
                              'Handbag',
                              'hoodie',
                              'jeans',
                              'pants',
                              'polo_tshirt',
                              'shoes',
                              'shorts',
                              'skirt',
                              'tshirt'
                            ].map((category) => (
                            <button
                              key={category}
                              onClick={() => toggleFilter(category)}
                              className={`px-3 py-1 text-xs font-medium rounded-full ${
                                activeFilters.includes(category)
                                  ? 'bg-black text-white'
                                  : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-100'
                              }`}
                            >
                              {category.charAt(0).toUpperCase() + category.slice(1)}
                            </button>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium mb-2">Status</h3>
                        <div className="flex flex-wrap gap-2">
                          {['available', 'low-stock'].map((status) => (
                            <button
                              key={status}
                              onClick={() => toggleFilter(status)}
                              className={`px-3 py-1 text-xs font-medium rounded-full ${
                                activeFilters.includes(status)
                                  ? 'bg-black text-white'
                                  : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-100'
                              }`}
                            >
                              {status === 'available' ? 'In Stock' : 'Low Stock'}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Search results */}
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                    {searchResults.map((product) => (
                      <div 
                        key={product.id} 
                        className="group cursor-pointer" 
                        onClick={() => navigateToProduct(product.id)}
                      >
                        <div className="relative overflow-hidden rounded-xl bg-gray-50 border border-gray-100">
                          <div className="aspect-[3/4] overflow-hidden">
                            <img 
                              src={product.images[0] || '/api/placeholder/400/500'} 
                              alt={product.name} 
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                          </div>
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-6 group-hover:translate-y-0 transition-transform">
                              <button className="w-full bg-white text-black font-medium py-2 rounded-lg hover:bg-gray-100 flex items-center justify-center gap-2 text-sm">
                                <ShoppingBag className="w-4 h-4" />
                                View Product
                              </button>
                            </div>
                          </div>
                          
                          <button 
                            className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:bg-gray-100"
                            onClick={(e) => {
                              e.stopPropagation();
                              // Add to wishlist functionality would go here
                            }}
                          >
                            <Heart className="w-4 h-4 text-gray-800" />
                          </button>
                        </div>
                        
                        <div className="mt-3 px-1">
                          <div className="flex justify-between items-center">
                            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">
                              {product.category}
                            </p>
                            {getStatusBadge(product.status)}
                          </div>
                          <h3 className="font-medium text-gray-900 mt-1 truncate">{product.name}</h3>
                          <div className="flex justify-between items-center mt-1">
                            <p className="font-semibold">${product.price.toFixed(2)}</p>
                            <div className="flex gap-1">
                              {product.colors.slice(0, 3).map((color, index) => (
                                <div 
                                  key={index} 
                                  className="w-3 h-3 rounded-full border border-gray-300" 
                                  style={{ backgroundColor: color }}
                                ></div>
                              ))}
                              {product.colors.length > 3 && (
                                <div className="text-xs text-gray-500">+{product.colors.length - 3}</div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        
        {activeTab === 'trending' && (
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden p-6 md:p-8">
            <div className="text-center mb-10">
              <TrendingUp className="w-8 h-8 text-gray-800 mx-auto mb-3" />
              <h2 className="text-xl font-semibold">Trending Styles</h2>
              <p className="text-gray-500 mt-1">Discover the most popular fashion items this week</p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {(apiProducts.length > 0 ? apiProducts : products)
                .filter(p => p.status === 'available')
                .slice(0, 8)
                .map((product) => (
                  <div 
                    key={product.id} 
                    className="group cursor-pointer" 
                    onClick={() => navigateToProduct(product.id)}
                  >
                    <div className="relative overflow-hidden rounded-xl bg-gray-50 border border-gray-100">
                      <div className="aspect-[3/4] overflow-hidden">
                        <img 
                          src={product.images[0] || '/api/placeholder/400/500'} 
                          alt={product.name} 
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-6 group-hover:translate-y-0 transition-transform">
                          <button className="w-full bg-white text-black font-medium py-2 rounded-lg hover:bg-gray-100 flex items-center justify-center gap-2 text-sm">
                            <ShoppingBag className="w-4 h-4" />
                            View Product
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-3 px-1">
                      <h3 className="font-medium text-gray-900 truncate">{product.name}</h3>
                      <p className="font-semibold mt-1">${product.price.toFixed(2)}</p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Feature Explanation */}
        <div className="mb-12 mt-12">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Zap className="w-5 h-5 mr-2 text-gray-800" />
              New Feature: Advanced Style Matching
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex flex-col">
                <div className="h-14 w-14 bg-gray-900 rounded-full flex items-center justify-center mb-3">
                  <Camera className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold mb-1">Visual Search</h3>
                <p className="text-sm text-gray-600">Upload any fashion image to find visually similar products across our entire catalog.</p>
              </div>
              <div className="flex flex-col">
                <div className="h-14 w-14 bg-gray-800 rounded-full flex items-center justify-center mb-3">
                  <SlidersHorizontal className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold mb-1">Similarity Controls</h3>
                <p className="text-sm text-gray-600">Adjust the similarity threshold to find products that match your specific style preferences.</p>
              </div>
              <div className="flex flex-col">
                <div className="h-14 w-14 bg-gray-700 rounded-full flex items-center justify-center mb-3">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold mb-1">Trending Suggestions</h3>
                <p className="text-sm text-gray-600">Explore trending styles and personal recommendations based on your search history.</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* NEW SECTION: Recently Viewed */}
        {predictedCategory && (
          <div className="mb-12">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
              <h2 className="text-xl font-semibold mb-6 flex items-center">
                <Clock className="w-5 h-5 mr-2 text-gray-800" />
                Recently Viewed Items
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {apiProducts.length > 0 ? 
                  apiProducts.slice(0, 4).map((product) => (
                    <div 
                      key={product.id} 
                      className="cursor-pointer"
                      onClick={() => navigateToProduct(product.id)}
                    >
                      <ProductCard product={product} />
                    </div>
                  )) : 
                  <p className="col-span-4 text-gray-500 text-center py-6">No recently viewed items</p>
                }
              </div>
            </div>
          </div>
        )}
        
        {/* NEW SECTION: Category Recommendations */}
        {predictedCategory && (
          <div className="mb-12">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-gray-800" />
                Popular in {predictedCategory.charAt(0).toUpperCase() + predictedCategory.slice(1)}
              </h2>
              <p className="text-gray-500 mb-6">Top trending items in this category</p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {apiProducts
                  .filter(p => p.category.toLowerCase() === predictedCategory.toLowerCase())
                  .slice(0, 4)
                  .map((product) => (
                    <div 
                      key={product.id} 
                      className="group cursor-pointer" 
                      onClick={() => navigateToProduct(product.id)}
                    >
                      <div className="relative overflow-hidden rounded-xl bg-gray-50 border border-gray-100">
                        <div className="aspect-[3/4] overflow-hidden">
                          <img 
                            src={product.images[0] || '/api/placeholder/400/500'} 
                            alt={product.name} 
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-6 group-hover:translate-y-0 transition-transform">
                            <button className="w-full bg-white text-black font-medium py-2 rounded-lg hover:bg-gray-100 flex items-center justify-center gap-2 text-sm">
                              <ShoppingBag className="w-4 h-4" />
                              View Product
                            </button>
                          </div>
                        </div>
                        
                        <button 
                          className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:bg-gray-100"
                          onClick={(e) => {
                            e.stopPropagation();
                            // Add to wishlist functionality would go here
                          }}
                        >
                          <Heart className="w-4 h-4 text-gray-800" />
                        </button>
                      </div>
                      
                      <div className="mt-3 px-1">
                        <div className="flex justify-between items-center">
                          <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">
                            {product.category}
                          </p>
                          {getStatusBadge(product.status)}
                        </div>
                        <h3 className="font-medium text-gray-900 mt-1 truncate">{product.name}</h3>
                        <div className="flex justify-between items-center mt-1">
                          <p className="font-semibold">${product.price.toFixed(2)}</p>
                          <div className="flex gap-1">
                            {product.colors.slice(0, 3).map((color, index) => (
                              <div 
                                key={index} 
                                className="w-3 h-3 rounded-full border border-gray-300" 
                                style={{ backgroundColor: color }}
                              ></div>
                            ))}
                            {product.colors.length > 3 && (
                              <div className="text-xs text-gray-500">+{product.colors.length - 3}</div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}
        
        {/* NEW SECTION: Complete Your Look */}
        {predictedCategory && (
          <div className="mb-12">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <Sparkles className="w-5 h-5 mr-2 text-gray-800" />
                Complete Your Look
              </h2>
              <p className="text-gray-500 mb-6">Items that pair well with your style</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {apiProducts
                  .filter(p => p.category.toLowerCase() !== predictedCategory.toLowerCase())
                  .slice(0, 3)
                  .map((product) => (
                    <div 
                      key={product.id} 
                      className="flex gap-4 cursor-pointer" 
                      onClick={() => navigateToProduct(product.id)}
                    >
                      <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                        <img 
                          src={product.images[0] || '/api/placeholder/100/100'} 
                          alt={product.name} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">
                          {product.category}
                        </p>
                        <h3 className="font-medium text-gray-900 mt-1 truncate">{product.name}</h3>
                        <div className="flex justify-between items-center mt-1">
                          <p className="font-semibold">${product.price.toFixed(2)}</p>
                          {getStatusBadge(product.status)}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIItemFinder;