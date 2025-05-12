import { ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Hero() {
  return (
    <div className="relative h-screen">
      <video
        autoPlay
        muted
        loop
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source
          src="https://videos.pexels.com/video-files/7677807/7677807-hd_1080_1920_25fps.mp4"
          type="video/mp4"
        />
      </video>
      
      <div className="absolute inset-0 bg-black/50" />
      
      <div className="relative h-full flex items-center justify-center text-white">
        <div className="text-center space-y-8">
          <h1 className="text-6xl md:text-8xl font-bold tracking-tighter">
            CANNIBAL
          </h1>
          <p className="text-xl md:text-2xl tracking-wide">
          Welcome to Cannibal Clothing – where bold meets unique.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/store"
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20
                hover:bg-white/20 hover:border-white/30 text-white px-8 py-3 rounded-full
                transition-all duration-300 hover:gap-3 group"
            >
              Shop Now 
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              to="/ai-item-finder"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-blue-500
                hover:from-purple-600 hover:to-blue-600 text-white px-8 py-3 rounded-full
                transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
            >
              <Sparkles className="w-5 h-5 animate-pulse" />
              AI Item Finder
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}