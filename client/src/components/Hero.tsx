import { useLanguage } from '@/contexts/LanguageContext';
import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Hero() {
  const { t } = useLanguage();
  const [currentImage, setCurrentImage] = useState(0);

  // Gram Panchayat images
  const images = [
    '/images/gallery/IMG_20200730_175457007.jpg',
    '/images/gallery/IMG_20250329_175648597_HDR_1.jpg',
    '/images/gallery/IMG_20250406_065929887_AE.jpg',
    '/images/gallery/IMG_20250412_220727812_HDR_AE.jpg',
    '/images/gallery/IMG_20250517_191436237_AE.jpg',
    '/images/gallery/whatsapp_1.jpeg',
    '/images/gallery/whatsapp_2.jpeg',
    '/images/gallery/whatsapp_3.jpeg',
    '/images/gallery/whatsapp_4.jpeg',
    '/images/gallery/whatsapp_5.jpeg',
    '/images/gallery/whatsapp_6.jpeg',
    '/images/gallery/whatsapp_7.jpeg',
  ];

  // Auto-advance carousel every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [images.length]);

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="relative h-[600px] overflow-hidden">
      {/* Background Image Carousel with Overlay */}
      <div className="absolute inset-0">
        {images.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentImage ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img 
              src={image} 
              alt={`Gram Panchayat ${index + 1}`}
              className="w-full h-full object-cover scale-105 animate-slow-zoom"
              style={{ filter: 'brightness(0.5)' }}
              onError={(e) => {
                console.error(`Failed to load image: ${image}`);
                e.currentTarget.src = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-br from-orange-900/40 via-black/50 to-green-900/40"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30"></div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevImage}
        className="absolute left-6 top-1/2 -translate-y-1/2 z-20 bg-white/10 hover:bg-orange-500/80 backdrop-blur-md p-4 rounded-full transition-all duration-300 border border-white/20 hover:border-orange-500 group"
        aria-label="Previous image"
      >
        <ChevronLeft className="h-6 w-6 text-white group-hover:scale-110 transition-transform" />
      </button>
      <button
        onClick={nextImage}
        className="absolute right-6 top-1/2 -translate-y-1/2 z-20 bg-white/10 hover:bg-orange-500/80 backdrop-blur-md p-4 rounded-full transition-all duration-300 border border-white/20 hover:border-orange-500 group"
        aria-label="Next image"
      >
        <ChevronRight className="h-6 w-6 text-white group-hover:scale-110 transition-transform" />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2 bg-black/30 backdrop-blur-md px-4 py-2 rounded-full">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentImage(index)}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === currentImage 
                ? 'bg-orange-500 w-8 shadow-lg shadow-orange-500/50' 
                : 'bg-white/50 w-2 hover:bg-white/80'
            }`}
            aria-label={`Go to image ${index + 1}`}
          />
        ))}
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 h-full relative z-10 flex flex-col items-center justify-center text-center">
        {/* Logo Badge */}
        <div className="mb-8 animate-fade-in">
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-orange-500 rounded-full blur-xl opacity-50 animate-pulse"></div>
            <div className="relative w-24 h-24 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center shadow-2xl border-4 border-white/20">
              <svg className="w-14 h-14 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path>
              </svg>
            </div>
          </div>
        </div>
        
        {/* Main Heading */}
        <div className="space-y-4 animate-slide-up">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4 drop-shadow-2xl">
            <span className="bg-gradient-to-r from-white via-orange-100 to-white bg-clip-text text-transparent">
              {t('Kishore Gram Panchayat', 'किशोर ग्रामपंचायत')}
            </span>
          </h1>
          
          <div className="inline-block bg-orange-500/20 backdrop-blur-md px-6 py-3 rounded-full border border-orange-500/30">
            <p className="text-xl md:text-2xl text-orange-100 font-semibold">
              {t('Village Information Service', 'गाव माहिती सेवा')}
            </p>
          </div>
          
          <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto drop-shadow-lg mt-4">
            {t('Access all government services online - Fast, Easy & Secure', 'सर्व सरकारी सेवा ऑनलाइन मिळवा - जलद, सोपे आणि सुरक्षित')}
          </p>
        </div>

        {/* Image Counter */}
        <div className="absolute bottom-24 right-8 bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/20">
          <p className="text-white text-sm font-semibold">
            {currentImage + 1} / {images.length}
          </p>
        </div>
      </div>

      <style>{`
        @keyframes slow-zoom {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        .animate-slow-zoom {
          animation: slow-zoom 20s ease-in-out infinite;
        }
        @keyframes fade-in {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-up {
          animation: slide-up 0.8s ease-out 0.2s both;
        }
      `}</style>
    </div>
  );
}
