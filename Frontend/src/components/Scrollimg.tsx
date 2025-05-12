import React, { useEffect, useRef } from "react";
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { Photolink } from '../data/imgs'; // Import the correct array

export default function FashionGallery() {
  const galleryRef = useRef(null);
  const navigate = useNavigate(); // Initialize useNavigate

  // Auto-scrolling functionality
  useEffect(() => {
    const gallery = galleryRef.current;
    let scrollAmount = 0;
    const scrollStep = 2;

    const scrollGallery = () => {
      if (gallery) {
        scrollAmount += scrollStep;
        gallery.scrollLeft = scrollAmount;
        if (gallery.scrollLeft >= gallery.scrollWidth - gallery.offsetWidth) {
          scrollAmount = 0; // Reset scroll when end is reached
        }
      }
    };

    const interval = setInterval(scrollGallery, 30); // Adjust for speed

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  const handleImageClick = (imageIndex: number) => {
    // Navigate to the fashion gallery page (you can pass the image index or other data if needed)
    navigate(`/fashiongallery`);
  };

  return (
    <div className="min-h-screen{min-height: 100vh;} bg-gray-10 py-5">
      <div className="max-w-8xl mx-1 px-0 text-center">
        <div
          ref={galleryRef}
          className="flex overflow-x-scroll scrollbar-hide gap-4 p-4 items-center"
        >
          {Photolink.map((image, index) => (
            <div
              key={index}
              className="flex-none w-100 h-80 bg-gray-200 rounded-lg shadow-lg overflow-hidden"
            >
              <img
                src={image}
                alt={`Fashion ${index + 1}`}
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105 cursor-pointer"
                onClick={() => handleImageClick(index)} // Add onClick handler
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
