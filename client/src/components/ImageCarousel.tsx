import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import img1 from '@assets/WhatsApp Image 2025-10-04 at 8.57.18 AM (2)_1760328486034.jpeg';
import img2 from '@assets/WhatsApp Image 2025-10-04 at 8.57.18 AM (1)_1760328486035.jpeg';
import img3 from '@assets/WhatsApp Image 2025-10-04 at 8.57.18 AM_1760328486036.jpeg';
import img4 from '@assets/WhatsApp Image 2025-10-04 at 8.57.17 AM_1760328486037.jpeg';

const images = [img1, img2, img3, img4];

export default function ImageCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 4000);

    return () => clearInterval(timer);
  }, []);

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  return (
    <div className="relative w-full h-[400px] md:h-[500px] overflow-hidden rounded-lg">
      <div className="relative h-full">
        {images.map((img, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-700 ${
              index === currentIndex ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img
              src={img}
              alt={`Village scene ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
      </div>

      <Button
        variant="ghost"
        size="icon"
        className="absolute left-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white"
        onClick={goToPrevious}
        data-testid="button-carousel-prev"
      >
        <ChevronLeft className="h-6 w-6" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        className="absolute right-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white"
        onClick={goToNext}
        data-testid="button-carousel-next"
      >
        <ChevronRight className="h-6 w-6" />
      </Button>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentIndex ? 'bg-white w-8' : 'bg-white/50'
            }`}
            data-testid={`button-carousel-dot-${index}`}
          />
        ))}
      </div>
    </div>
  );
}
