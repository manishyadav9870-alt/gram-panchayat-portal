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
              className="w-full h-full object-cover"
              onError={(e) => {
                console.error(`Failed to load image: ${image}`);
                e.currentTarget.src = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070';
              }}
            />
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

      {/* Image Counter */}
      <div className="absolute bottom-8 right-8 z-20 bg-black/60 backdrop-blur-md px-4 py-2 rounded-full border border-white/20">
        <p className="text-white text-sm font-semibold">
          {currentImage + 1} / {images.length}
        </p>
      </div>

    </div>
  );
}
