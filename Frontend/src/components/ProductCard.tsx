import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../data/products';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-lg bg-white">
      <Link to={`/product/${product.id}`}>
        <div className="aspect-square overflow-hidden">
          <img
            src={product.images[0]}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
          <p className="mt-1 text-gray-700">LKR {product.price}</p>
          
          <div className="mt-2 flex gap-1">
            {product.colors.map((color) => (
              <div
                key={color}
                className="h-4 w-4 rounded-full border border-gray-300"
                style={{
                  backgroundColor: color.toLowerCase(),
                  border: color.toLowerCase() === 'white' ? '1px solid #e5e7eb' : 'none'
                }}
              />
            ))}
          </div>
          
          <div className="mt-2 flex gap-2">
            {product.sizes.map((size) => (
              <span key={size} className="text-sm text-gray-600">
                {size}
              </span>
            ))}
          </div>
        </div>
      </Link>
      
      <button
        className={`absolute bottom-4 right-4 rounded-full bg-black px-4 py-2 text-sm text-white 
          transition-all duration-300 ${
            product.status === 'sold-out'
              ? 'cursor-not-allowed bg-gray-400'
              : 'hover:bg-gray-800'
          }`}
        disabled={product.status === 'sold-out'}
      >
        {product.status === 'sold-out' ? 'Sold Out' : 'Add to Cart'}
      </button>
    </div>
  );
}