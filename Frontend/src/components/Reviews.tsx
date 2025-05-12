import React from 'react';
import { reviews } from '../data/review';
import { Star } from 'lucide-react';

const Reviews = () => {
  return (
    <div className="py-16 bg-gray-50">
      <div className="max-w-screen-xl mx-auto px-6">
        <h2 className="text-4xl font-bold text-center mb-10">What Our Customers Are Saying</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="p-6 bg-white rounded-lg shadow-lg transform transition-all hover:scale-105 hover:shadow-xl duration-300"
            >
              <div className="flex items-center space-x-4 mb-4">
                <img
                  src={review.avatar}
                  alt={review.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div>
                  <p className="font-semibold text-lg">{review.name}</p>
                  <div className="flex items-center space-x-1">
                    {[...Array(review.rating)].map((_, index) => (
                      <Star key={index} className="w-4 h-4 text-yellow-400" />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-gray-600">{review.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Reviews;
