import React, { useState, useEffect } from 'react';
import { ArrowRight, Heart, Globe, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';

// Image gallery component with animations
const ImageGallery = () => {
  const images = [
    "https://i.ibb.co/F4gsp42/DSC07639.png",
    "https://i.ibb.co/GMTnJZj/DSC07679.png",
    "https://i.ibb.co/6J7CCBd/DSC07714.png",
    "https://i.ibb.co/XDQ3xZ3/DSC07719.png",
    "https://i.ibb.co/Jq2HMP0/DSC07724.png",
    "https://i.ibb.co/R9CxSjw/DSC07733.png",
    "https://i.ibb.co/NW7C2X7/DSC07737.png",
    "https://i.ibb.co/Xk1X75N/DSC04626.png",
    "https://i.ibb.co/GkQXfb7/DSC04633.png",
    "https://i.ibb.co/J5T2tWG/DSC04655.png",
    "https://i.ibb.co/9rYqr4w/DSC04663.png",
    "https://i.ibb.co/9bn63ZM/DSC04695.png",
    "https://i.ibb.co/mRrXVgx/DSC04713.png",
    "https://i.ibb.co/Jr49Jdf/DSC04736.png",
    "https://i.ibb.co/B4YXFv6/DSC04747.png"
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000);
    
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="w-full h-full relative overflow-hidden rounded-xl">
      {images.map((image, index) => (
        <div
          key={index}
          className="absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out"
          style={{ 
            opacity: index === currentIndex ? 1 : 0,
            zIndex: index === currentIndex ? 10 : 0
          }}
        >
          <img
            src={image}
            alt={`Fashion ${index + 1}`}
            className="w-full h-full object-cover"
          />
        </div>
      ))}
    </div>
  );
};

// Animated section component
const AnimatedSection = ({ children, delay = 0 }) => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);
    
    return () => clearTimeout(timer);
  }, [delay]);
  
  return (
    <div 
      className={`transform transition-all duration-1000 ease-out ${
        isVisible 
          ? 'translate-y-0 opacity-100' 
          : 'translate-y-16 opacity-0'
      }`}
    >
      {children}
    </div>
  );
};

// Stats counter component
const StatsCounter = ({ end, label, duration = 2000 }) => {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    let startTime;
    let animationFrame;
    
    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      
      const percentage = Math.min(progress / duration, 1);
      setCount(Math.floor(percentage * end));
      
      if (progress < duration) {
        animationFrame = requestAnimationFrame(animate);
      }
    };
    
    animationFrame = requestAnimationFrame(animate);
    
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration]);
  
  return (
    <div className="text-center">
      <h3 className="text-5xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
        {count}+
      </h3>
      <p className="text-gray-600 font-medium">{label}</p>
    </div>
  );
};

export default function About() {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [statsVisible, setStatsVisible] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
      
      // Check if stats section is visible
      const statsSection = document.getElementById('stats-section');
      if (statsSection) {
        const rect = statsSection.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.75) {
          setStatsVisible(true);
        }
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  return (
    <div className="pt-16 overflow-x-hidden">
      {/* Hero Section with Parallax Effect */}
      <div className="relative h-screen overflow-hidden">
        <div 
          className="absolute inset-0 w-full h-full"
          style={{ 
            transform: `translateY(${scrollPosition * 0.5}px)`,
            transition: 'transform 0.1s ease-out'
          }}
        >
          <ImageGallery />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/50" />
        </div>
        
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-4">
          <h1 className="text-6xl md:text-8xl font-bold tracking-tight mb-4 text-center">
            Our Story
          </h1>
          <p className="text-xl md:text-2xl max-w-2xl text-center text-gray-200 mb-8">
            Redefining urban fashion with minimalist design and exceptional quality
          </p>
          <div className="flex space-x-4">
            <Link
              to="/store"
              className="bg-white text-black px-8 py-3 rounded-full hover:bg-gray-200 transition-all duration-300 transform hover:scale-105 flex items-center gap-2 font-medium"
            >
              Explore Collection <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          {/* Left column: Text content */}
          <div className="space-y-16">
            <AnimatedSection>
              <h2 className="text-4xl font-bold mb-6 relative">
                Who We Are
                <span className="absolute -bottom-2 left-0 w-16 h-1 bg-gradient-to-r from-purple-600 to-pink-600"></span>
              </h2>
              <p className="text-gray-700 leading-relaxed text-lg">
                CANNIBLE.CO was born from a passion for minimalist design and urban culture. 
                Founded in 2024, we set out to create clothing that embodies both style and 
                substance, challenging the conventional boundaries of streetwear. Our vision
                is to create pieces that tell a story, that connect with people on a deeper level
                than just fashion.
              </p>
            </AnimatedSection>

            <AnimatedSection delay={200}>
              <h2 className="text-4xl font-bold mb-6 relative">
                Our Philosophy
                <span className="absolute -bottom-2 left-0 w-16 h-1 bg-gradient-to-r from-purple-600 to-pink-600"></span>
              </h2>
              <p className="text-gray-700 leading-relaxed text-lg">
                We believe in the power of simplicity. Each piece in our collection is 
                thoughtfully designed to be timeless, versatile, and built to last. Our 
                commitment to quality means we work with only the finest materials and 
                ethical manufacturing partners. We create clothing that empowers 
                self-expression while maintaining a clean, sophisticated aesthetic.
              </p>
            </AnimatedSection>

            <AnimatedSection delay={400}>
              <h2 className="text-4xl font-bold mb-6 relative">
                Sustainability
                <span className="absolute -bottom-2 left-0 w-16 h-1 bg-gradient-to-r from-purple-600 to-pink-600"></span>
              </h2>
              <p className="text-gray-700 leading-relaxed text-lg">
                Environmental responsibility is at the core of everything we do. From 
                sourcing sustainable materials to minimizing our carbon footprint in 
                production and shipping, we're committed to protecting our planet while 
                delivering exceptional fashion. Every purchase you make contributes to
                our initiatives for a more sustainable fashion industry.
              </p>
            </AnimatedSection>
          </div>
          
          {/* Right column: Image grid with animations */}
          <div className="grid grid-cols-2 gap-4 h-full">
            <div className="space-y-4">
              <AnimatedSection delay={100}>
                <div className="rounded-xl overflow-hidden h-64 shadow-lg transform transition-transform duration-500 hover:scale-105">
                  <img 
                    src="https://i.ibb.co/6J7CCBd/DSC07714.png"
                    alt="Fashion item" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </AnimatedSection>
              
              <AnimatedSection delay={300}>
                <div className="rounded-xl overflow-hidden h-80 shadow-lg transform transition-transform duration-500 hover:scale-105">
                  <img 
                    src="https://i.ibb.co/Jq2HMP0/DSC07724.png" 
                    alt="Fashion item" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </AnimatedSection>
            </div>
            
            <div className="space-y-4 mt-12">
              <AnimatedSection delay={200}>
                <div className="rounded-xl overflow-hidden h-80 shadow-lg transform transition-transform duration-500 hover:scale-105">
                  <img 
                    src="https://i.ibb.co/NW7C2X7/DSC07737.png" 
                    alt="Fashion item" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </AnimatedSection>
              
              <AnimatedSection delay={400}>
                <div className="rounded-xl overflow-hidden h-64 shadow-lg transform transition-transform duration-500 hover:scale-105">
                  <img 
                    src="https://i.ibb.co/Jr49Jdf/DSC04736.png" 
                    alt="Fashion item" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </AnimatedSection>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div id="stats-section" className="bg-gray-50 py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-64 h-64 bg-purple-500 rounded-full filter blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-pink-500 rounded-full filter blur-3xl transform translate-x-1/2 translate-y-1/2"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <h2 className="text-4xl font-bold text-center mb-16">Our Impact</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {statsVisible && (
              <>
                <StatsCounter end={100} label="Unique Designs" />
                <StatsCounter end={50} label="Thousand Happy Customers" />
                <StatsCounter end={15} label="Countries Shipped" />
              </>
            )}
          </div>
          
          <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
            <AnimatedSection delay={100}>
              <div className="bg-white p-8 rounded-xl shadow-lg text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Heart className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold mb-4">Handcrafted Care</h3>
                <p className="text-gray-600">Every piece is crafted with meticulous attention to detail and quality.</p>
              </div>
            </AnimatedSection>
            
            <AnimatedSection delay={200}>
              <div className="bg-white p-8 rounded-xl shadow-lg text-center">
                <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Globe className="w-8 h-8 text-pink-600" />
                </div>
                <h3 className="text-xl font-bold mb-4">Global Footprint</h3>
                <p className="text-gray-600">Connecting fashion enthusiasts across continents with our unique designs.</p>
              </div>
            </AnimatedSection>
            
            <AnimatedSection delay={300}>
              <div className="bg-white p-8 rounded-xl shadow-lg text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <ShoppingBag className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold mb-4">Premium Experience</h3>
                <p className="text-gray-600">From browsing to unboxing, we ensure a memorable journey with every purchase.</p>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </div>
      
      {/* CTA Section */}
      <div className="relative py-24">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://i.ibb.co/GkQXfb7/DSC04633.png" 
            alt="Background" 
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-purple-900/90 to-black/90"></div>
        </div>
        
        <div className="max-w-4xl mx-auto px-4 relative z-10 text-center">
          <AnimatedSection>
            <h2 className="text-5xl font-bold text-white mb-6">Join Our Journey</h2>
            <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
              Experience the perfect blend of style, comfort, and sustainability with our latest collection.
            </p>
            
            <Link
              to="/store"
              className="inline-flex items-center gap-2 bg-white text-black px-10 py-4 
                rounded-full hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 font-medium text-lg"
            >
              Shop Collection <ArrowRight className="w-5 h-5" />
            </Link>
          </AnimatedSection>
        </div>
      </div>
    </div>
  );
}