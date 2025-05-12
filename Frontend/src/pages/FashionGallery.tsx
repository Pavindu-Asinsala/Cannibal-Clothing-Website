import React, { useEffect, useRef } from "react";
import { Photolink } from '../data/imgs';
import Scrolling from '../components/Scrollimg';

export default function FashionGallery() {
  const galleryRef = useRef(null);


  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 text-center">
      <h1 className="text-4xl font-bold mb-8"> </h1>
        <h1 className="text-4xl font-bold mb-8">Fashion Gallery</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-16">
          Experience our exclusive collection through a dynamic gallery that
          brings style to life. Every piece reflects elegance and modernity.
        </p>
      </div>

      <Scrolling/>

      <div className="mt-16 px-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {Photolink.map((image, index) => (
            <div
              key={index}
              className="w-full h-60 bg-gray-200 rounded-lg shadow-lg overflow-hidden"
            >
              <img
                src={image}
                alt={`Fashion Grid ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>

          {/* Gallery from mongodb */}
      <div className="mt-16 px-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {Photolink.map((image, index) => (
            <div
              key={index}
              className="w-full h-60 bg-gray-200 rounded-lg shadow-lg overflow-hidden"
            >
              <img
                src={image}
                alt={`Fashion Grid ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>


      
      
    </div>
    
  );
}
