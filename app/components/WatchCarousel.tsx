'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ListElements {
  id: number;
  src: string;
  alt: string;
  color: string | null;
  size: string | null;
}

interface WatchCarouselProps {
  fixedElement: string | null;
  listElements: ListElements[] | [];
  onElementSelect?: (element: ListElements) => void;
  currentStep?: string;
}

export default function WatchCarousel({ fixedElement, listElements, onElementSelect, currentStep }: WatchCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    if (currentIndex < listElements.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleElementClick = (index: number) => {
    setCurrentIndex(index);
    onElementSelect?.(listElements[index]);
  };

  return (
    <div className="relative w-full min-h-[200px]">
      {/* Fixed Element in Center */}
      
      <div className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] ${currentStep === 'case' ? 'z-5' : 'z-50'} ${currentStep === 'size' ? 'hidden' : ''}`}>
        <Image
          src={fixedElement || '/images/watch-case-46-aluminum.png'}
          alt="Fixed Element"
          fill
          className="object-contain"
          priority
        />
      </div>

      {/* Elements Carousel */}
      <div className="relative flex items-center justify-center h-[300px] overflow-hidden">
        <AnimatePresence mode="popLayout">
          {listElements.map((element, index) => {
            const position = index - currentIndex;
            const isCenter = position === 0;

            return (
              <motion.div
                key={element.id}
                className={`absolute w-[300px] h-[300px] cursor-pointer
                  ${isCenter ? 'z-40' : 'z-10'}
                  `}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{
                  scale: isCenter ? 1 : 1,
                  opacity: 1,
                  x: `${position * 300}px`,
                }}
                transition={{ duration: 0.5 }}
                onClick={() => handleElementClick(index)}
              >
                {
                  currentStep === 'size' &&
                  <div className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] z-0`}>
                    <Image
                      src={fixedElement || '/images/band-black.png'}
                      alt="Fixed Element"
                      fill
                      className="object-contain"
                      priority
                    />
                  </div>
                }
                <div className="relative w-full h-full p-4">
                  <Image
                    src={element.src || '/placeholder.png'}
                    alt={element.alt || 'Element'}
                    fill
                    className="object-contain"
                    priority={isCenter}
                  />
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Navigation Arrows */}
      {currentIndex > 0 && (
        <button
          onClick={handlePrev}
          className="absolute left-8 top-1/2 -translate-y-1/2 z-30 bg-white/80 p-1 rounded-full shadow-lg hover:bg-white/95 transition-colors"
          aria-label="Previous element"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      )}
      {currentIndex < listElements.length - 1 && (
        <button
          onClick={handleNext}
          className="absolute right-8 top-1/2 -translate-y-1/2 z-30 bg-white/80 p-1 rounded-full shadow-lg hover:bg-white transition-colors"
          aria-label="Next element"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      )}
    </div>
  );
}
