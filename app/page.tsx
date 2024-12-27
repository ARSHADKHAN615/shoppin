'use client';

import Image from "next/image";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import WatchDisplay from "./components/WatchDisplay";
import WatchCarousel from "./components/WatchCarousel";

type ConfigStep = 'size' | 'case' | 'band';

interface ListElements {
  id: number;
  src: string;
  alt: string;
  color: string | null;
  size?: string | null;
}

interface WatchSize {
  id: number;
  src: string;
  alt?: string;
  size: string;
}

const watchSizes: WatchSize[] = [
  { id: 1, src: '/images/watch-case-rose.png', size: '41mm' },
  { id: 2, src: '/images/watch-case-rose.png', size: '45mm' },
];

const watchCases: ListElements[] = [
  { id: 1, color: 'Silver', src: '/images/watch-case-46-aluminum.png' , alt: 'Silver Case' },
  { id: 2, color: 'Space Gray', src: '/images/watch-case-46-titanium-gold.png' , alt: 'Space Gray Case' },
  { id: 3, color: 'Gold', src: '/images/watch-case-46-titanium-slate.png' , alt: 'Gold Case' },
  { id: 4, color: 'Black', src: '/images/watch-case-black.png' , alt: 'Black Case' },
  { id: 5, color: 'Rose', src: '/images/watch-case-rose.png' , alt: 'Rose Case' },
  {id: 6, color: 'Silver', src: '/images/watch-case-silver.png', alt: 'Silver Case' },
];

const watchBands: ListElements[] = [
  { id: 1, color: 'Black', src: '/images/band-black.png', alt: 'Black Band' },
  { id: 2, color: 'White', src: '/images/band-blue.png', alt: 'Blue Band' },
  { id: 3, color: 'Blue', src: '/images/band-green.png', alt: 'Green Band' },
  { id: 4, color: 'Red', src: '/images/band-white.png', alt: 'White Band' },
  { id: 5, color: 'Yellow', src: '/images/band-yellow.png', alt: 'Yellow Band' },
];

export default function Home() {
  const [started, setStarted] = useState(false);
  const [currentStep, setCurrentStep] = useState<ConfigStep>('size');
  const [selectedSize, setSelectedSize] = useState('41mm');
  const [selectedCase, setSelectedCase] = useState<ListElements | null>(null);
  const [selectedBand, setSelectedBand] = useState<ListElements | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleGetStarted = () => {
    setStarted(true);
  };

  const handleStepChange = (step: ConfigStep) => {
    setIsLoading(true);
    setCurrentStep(step);
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  };

  const handleElementSelect = (element: ListElements) => {
    if (currentStep === 'size') {
      setSelectedSize(element.size || '');
    } else if (currentStep === 'case') {
      setSelectedCase(element);
    } else {
      setSelectedBand(element);
    }
  };

  return (
    <div className="min-h-screen bg-white text-black">
      <AnimatePresence mode="wait">
        {!started ? (
          <motion.div
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="min-h-screen"
          >
            {/* Landing Header */}
            <header className="top-0 w-full py-4 bg-white z-50">
              <div className="max-w-[1400px] mx-auto px-6">
                <div className="flex items-center">
                  <Image
                    src="/images/apple-logo.svg"
                    alt="WATCH"
                    width={20}
                    height={24}
                  />
                  <span className="ml-2 font-bold text-xl">WATCH</span>
                </div>
              </div>
            </header>

            <div className="flex flex-col items-center pt-8">
              {/* Left Column */}
              <div className="w-1/2 flex flex-col justify-center">
                <div className="max-w-[900px]">
                  <h2 className="text-xl mb-4">Apple Watch Studio</h2>
                  <div className="space-y-2">
                    <h1 className="landing-title">Choose a case.</h1>
                    <h1 className="landing-title">Pick a band.</h1>
                    <h1 className="landing-title">Create your own style.</h1>
                  </div>
                  <button 
                    onClick={handleGetStarted}
                    className="mt-8 bg-blue-600 text-white px-8 py-3 rounded-full text-lg font-medium hover:bg-blue-700 transition-colors"
                  >
                    Get started
                  </button>
                </div>
              </div>

              {/* Right Column */}
              <div className="w-1/2 flex items-center justify-center">
                <WatchDisplay 
                  isStarted={started}
                  selectedCase={selectedCase?.src || '/images/watch-case-46-aluminum.png'}
                  selectedBand={selectedBand?.src || '/images/watch-band.jpg'}
                />
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="configurator"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="min-h-screen flex flex-col"
          >
            {/* Configurator Header */}
            <header className="top-0 w-full bg-white z-50 border-b border-gray-200">
              <nav className="max-w-[1400px] mx-auto px-6 py-3 flex items-center justify-between">
                <div className="flex items-center">
                  <Image
                    src="/images/apple-logo.svg"
                    alt="WATCH"
                    width={20}
                    height={24}
                  />
                  <span className="ml-2 font-bold text-xl">WATCH</span>
                </div>
                <div className="flex items-center space-x-4">
                  <button className="text-gray-500">Collections</button>
                  <button className="bg-blue-600 text-white px-6 py-1.5 rounded-full text-sm">
                    Save
                  </button>
                </div>
              </nav>
            </header>

            {/* Main Content */}
            <main className="flex-1 flex flex-col">
              {/* Watch Display Section */}
              <div className="flex-1 flex items-center justify-center relative">
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                  </div>
                ) : (
                  currentStep === 'size' ? (
                    <WatchCarousel 
                      fixedElement={null} 
                      listElements={watchSizes.map(size => ({
                        id: size.id,
                        src: size.src,
                        alt: size.alt || '',
                        color: null,
                        size: size.size
                      }))} 
                      onElementSelect={handleElementSelect}
                      currentStep={currentStep}
                    />
                  ) : currentStep === 'case' ? (
                    <WatchCarousel 
                      fixedElement={'/images/band-black.png'} 
                      listElements={watchCases.map(case_ => ({
                        id: case_.id,
                        src: case_.src,
                        alt: case_.alt || '',
                        color: case_.color,
                        size: null
                      }))} 
                      onElementSelect={handleElementSelect}
                      currentStep={currentStep}
                    />
                  ) : (
                    <WatchCarousel 
                      fixedElement={'/images/watch-case-rose.png'} 
                      listElements={watchBands.map(band => ({
                        id: band.id,
                        src: band.src,
                        alt: band.alt,
                        color: null,
                        size: null
                      }))} 
                      onElementSelect={handleElementSelect}
                      currentStep={currentStep}
                    />
                  )
                )}
              </div>

              {/* Product Info */}
              <div className="text-center mb-8">
                <h1 className="text-xl font-medium">APPLE WATCH SERIES 10</h1>
                <p className="text-lg">
                  {selectedSize} {selectedCase?.color || 'Aluminum'} Case 
                  {selectedBand && ` with ${selectedBand.color} Band`}
                </p>
                <p className="text-gray-500">From $429</p>
              </div>

              {/* Bottom Action Bar */}
              <div className="border-t border-gray-200 bg-gray-50">
                <div className="max-w-[1400px] mx-auto px-6 py-4">
                  {/* Action Buttons */}
                  <div className="flex justify-center gap-4">
                    <button 
                      onClick={() => handleStepChange('size')}
                      className={`px-8 py-2 rounded-full flex items-center gap-2 ${
                        currentStep === 'size' ? 'bg-black text-white' : 'bg-gray-200'
                      }`}
                    >
                      <span className="text-sm font-medium">Size</span>
                    </button>
                    <button 
                      onClick={() => handleStepChange('case')}
                      className={`px-8 py-2 rounded-full flex items-center gap-2 ${
                        currentStep === 'case' ? 'bg-black text-white' : 'bg-gray-200'
                      }`}
                    >
                      <span className="text-sm font-medium">Case</span>
                    </button>
                    <button 
                      onClick={() => handleStepChange('band')}
                      className={`px-8 py-2 rounded-full flex items-center gap-2 ${
                        currentStep === 'band' ? 'bg-black text-white' : 'bg-gray-200'
                      }`}
                    >
                      <span className="text-sm font-medium">Band</span>
                    </button>
                  </div>
                </div>
              </div>
            </main>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
