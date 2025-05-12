import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import { Search, Filter, X, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type Category = 'all' | 'mens' | 'womens' | 'unisex' | 'caps' | 'bags' | 'shoes';
type Subcategory = string;

interface Product {
  id: string;
  name: string;
  price: number;
  colors: string[];
  sizes: string[];
  category: Category | Subcategory;
  status: 'available' | 'low-stock' | 'sold-out';
  images: string[];
}

export default function Store() {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category>('all');
  const [selectedSubcategory, setSelectedSubcategory] = useState<Subcategory | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const featuredImages = [
    "https://i.ibb.co/QJM0TMP/DSC07607.png",
    "https://i.ibb.co/HCjwQzC/DSC07612.png",
    "https://i.ibb.co/y03MQVW/DSC07627.png",
    "https://i.ibb.co/2Ff35RM/DSC07632.png"
  ];

  const subcategoriesMap: Record<Category, Subcategory[]> = {
    mens: ['tshirt', 'polo_tshirt', 'hoodie', 'pants'],
    womens: ['skirt'],
    unisex: ['tshirt', 'polo_tshirt', 'hoodie', 'pants', 'skirt'],
    caps: [],
    bags: [],
    shoes: [],
    all: []
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/products');
        setProducts(response.data);
      } catch (err) {
        setError('Error fetching products');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory || subcategoriesMap[selectedCategory]?.includes(product.category);
    const matchesSubcategory = !selectedSubcategory || product.category === selectedSubcategory;
    return matchesSearch && matchesCategory && matchesSubcategory;
  });

  const sortedProducts = filteredProducts.sort((a, b) => b.id.localeCompare(a.id));

  const categories: Category[] = ['all', 'mens', 'womens', 'unisex', 'caps', 'backpack', 'shoes'];

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white">
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <ShoppingBag size={48} className="text-black" />
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <X size={48} className="mx-auto text-red-500 mb-4" />
            <h2 className="text-2xl font-bold text-gray-800">{error}</h2>
            <p className="mt-2 text-gray-600">Please try again later</p>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="w-full bg-gradient-to-r from-gray-900 to-black text-white">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-8"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-4">Discover Your Style</h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Explore our latest collection of premium fashion items
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 1 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12"
          >
            {featuredImages.map((img, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -10, transition: { duration: 0.3 } }}
                className="relative overflow-hidden rounded-lg aspect-square"
              >
                <img 
                  src={img} 
                  alt="Featured product" 
                  className="w-full h-full object-cover object-center transform transition-transform duration-700 hover:scale-110"
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Product Filter */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8"
        >
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black shadow-sm"
            />
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-3 rounded-xl bg-black text-white"
            >
              <Filter size={18} />
              <span>Filter</span>
            </button>
          </div>
        </motion.div>

        {showFilters && (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="flex flex-wrap gap-2 mb-4"
          >
            {categories.map((category) => (
              <motion.button
                key={category}
                onClick={() => {
                  setSelectedCategory(category);
                  setSelectedSubcategory(null);
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors whitespace-nowrap
                  ${selectedCategory === category
                    ? 'bg-black text-white shadow-md'
                    : 'bg-white hover:bg-gray-100 border border-gray-200'
                  }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </motion.button>
            ))}
          </motion.div>
        )}

        {/* Subcategory Filter */}
        {subcategoriesMap[selectedCategory]?.length > 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-wrap gap-2 mb-6"
          >
            {subcategoriesMap[selectedCategory].map((subcat) => (
              <button
                key={subcat}
                onClick={() => setSelectedSubcategory(subcat)}
                className={`px-3 py-2 rounded-lg text-sm capitalize border transition
                  ${selectedSubcategory === subcat
                    ? 'bg-black text-white'
                    : 'bg-white border-gray-300 hover:bg-gray-100'
                  }`}
              >
                {subcat.replace('_', ' ')}
              </button>
            ))}
          </motion.div>
        )}

        {/* Product Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          <AnimatePresence>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {sortedProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ 
                    opacity: 1, 
                    y: 0,
                    transition: { delay: index * 0.1, duration: 0.5 }
                  }}
                  whileHover={{ y: -10, transition: { duration: 0.3 } }}
                  className="transform transition-all duration-300 hover:shadow-xl rounded-2xl overflow-hidden bg-white"
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>
          </AnimatePresence>

          {sortedProducts.length === 0 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <p className="text-gray-500 text-lg">No products found matching your criteria</p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
