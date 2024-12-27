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
  collection?: string;
}

interface WatchSize {
  id: number;
  src: string;
  alt?: string;
  size: string;
}

const collections = [
  { id: 1, name: 'Sport' },
  { id: 2, name: 'Classic' },
  { id: 3, name: 'Luxury' },
];

const watchSizes: WatchSize[] = [
  { id: 1, src: '/images/watch-case-rose.png', size: '41mm' },
  { id: 2, src: '/images/watch-case-rose.png', size: '45mm' },
];

const watchCases: ListElements[] = [
  { id: 1, color: 'Silver', src: '/images/watch-case-46-aluminum.png', alt: 'Silver Case', collection: 'Sport' },
  { id: 2, color: 'Space Gray', src: '/images/watch-case-46-titanium-gold.png', alt: 'Space Gray Case', collection: 'Sport' },
  { id: 3, color: 'Gold', src: '/images/watch-case-46-titanium-slate.png', alt: 'Gold Case', collection: 'Classic' },
  { id: 4, color: 'Black', src: '/images/watch-case-black.png', alt: 'Black Case', collection: 'Classic' },
  { id: 5, color: 'Rose', src: '/images/watch-case-rose.png', alt: 'Rose Case', collection: 'Luxury' },
  { id: 6, color: 'Silver', src: '/images/watch-case-silver.png', alt: 'Silver Case', collection: 'Luxury' },
];

const watchBands: ListElements[] = [
  { id: 1, color: 'Black', src: '/images/band-black.png', alt: 'Black Band', collection: 'Sport' },
  { id: 2, color: 'White', src: '/images/band-blue.png', alt: 'Blue Band', collection: 'Sport' },
  { id: 3, color: 'Blue', src: '/images/band-green.png', alt: 'Green Band', collection: 'Classic' },
  { id: 4, color: 'Red', src: '/images/band-white.png', alt: 'White Band', collection: 'Classic' },
  { id: 5, color: 'Yellow', src: '/images/band-yellow.png', alt: 'Yellow Band', collection: 'Luxury' },
];

export default function Home() {
  const [started, setStarted] = useState(false);
  const [currentStep, setCurrentStep] = useState<ConfigStep>('size');
  const [selectedSize, setSelectedSize] = useState('41mm');
  const [selectedCase, setSelectedCase] = useState<ListElements | null>(null);
  const [selectedBand, setSelectedBand] = useState<ListElements | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCollection, setSelectedCollection] = useState('Sport');

  // Filter cases and bands based on selected collection
  const filteredCases = watchCases.filter(case_ => case_.collection === selectedCollection);
  const filteredBands = watchBands.filter(band => band.collection === selectedCollection);

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
              <div className="w-1.5/2 flex flex-col justify-center">
                <div className="max-w-[900px]">
                  <h2 className="text-xl mb-4">Apple Watch Studio</h2>
                  <div className="space-y-2">
                    <h1 className="landing-title !m-0">Choose a case.</h1>
                    <h1 className="landing-title !m-0">Pick a band.</h1>
                    <h1 className="landing-title !m-0">Create your own style.</h1>
                  </div>
                  <button
                    onClick={handleGetStarted}
                    className="mt-8 bg-blue-600 text-white px-4 py-2 rounded-full text-md hover:bg-blue-700 transition-colors"
                  >
                    Get started
                  </button>
                </div>
              </div>

              {/* Right Column */}
              <div className="w-full flex items-center justify-center">
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
            <header className="top-0 w-full bg-white z-50 mt-4">
              <nav className="max-w-[1400px] mx-auto px-6 py-3">
                <div className="grid grid-cols-3 items-center">
                  <div className="flex items-center">
                    <Image
                      src="/images/apple-logo.svg"
                      alt="WATCH"
                      width={20}
                      height={24}
                    />
                    <span className="ml-2 font-bold text-xl">WATCH</span>
                  </div>
                  <div className="flex justify-center">
                    <select
                      value={selectedCollection}
                      onChange={(e) => setSelectedCollection(e.target.value)}
                      className="px-4 py-1.5 rounded-full bg-transparent text-sm focus:outline-none cursor-pointer"
                    >
                      {collections.map((collection) => (
                        <option key={collection.id} value={collection.name}>
                          {collection.name} Collection
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex justify-end">
                    <button className="bg-blue-600 text-white px-6 py-1.5 rounded-full text-sm">
                      Save
                    </button>
                  </div>
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
                      listElements={filteredCases.map(case_ => ({
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
                      listElements={filteredBands.map(band => ({
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
                <p className="text-sm mb-1">{selectedCollection || 'APPLE WATCH SE'}</p>
                <h1 className="text-lg font-medium mb-1">
                  {selectedSize} {selectedCase?.color || 'Silver'} Aluminum Case with {selectedBand?.color || 'Star Fruit'} Solo Loop
                </h1>
                <p className="text-sm">From $279</p>
              </div>

              {/* Bottom Action Bar */}
              <div>
                <div className="max-w-[1400px] mx-auto px-6 py-4">
                  {/* Action Buttons */}
                  <div className="flex justify-center gap-4">
                    <div className="flex">
                      <motion.button
                        onClick={() => handleStepChange('size')}
                        initial={{ width: 'auto', opacity: 1 }}
                        animate={{ 
                          width: currentStep === 'size' ? 0 : 'auto',
                          opacity: currentStep === 'size' ? 0 : 1
                        }}
                        transition={{ duration: 0.3 }}
                        className={`py-2 rounded-full flex items-center gap-2 overflow-hidden bg-gray-200 ${currentStep === 'size' ? '' : 'px-4'}`}
                      >
                        <span className="text-sm font-medium whitespace-nowrap">Size</span>
                      </motion.button>

                      <motion.div 
                        initial={{ width: 0, opacity: 0 }}
                        animate={{ 
                          width: currentStep === 'size' ? 'auto' : 0,
                          opacity: currentStep === 'size' ? 1 : 0,
                          paddingLeft: currentStep === 'size' ? '1rem' : 0,
                          paddingRight: currentStep === 'size' ? '1rem' : 0,
                        }}
                        transition={{ duration: 0.3 }}
                        className={`py-2 rounded-full flex items-center gap-2 bg-gray-200 overflow-hidden`}
                      >
                        {
                          watchSizes.map(size => (
                            <span
                              key={size.id}
                              onClick={() => setSelectedSize(size.size)}
                              className={`cursor-pointer whitespace-nowrap ${
                                selectedSize === size.size ? 'text-black' : 'text-gray-800'
                              }`}
                            >
                              {size.size}
                            </span>
                          ))
                        }
                      </motion.div>
                    </div>
                    <div className="flex">
                      <motion.button
                        onClick={() => handleStepChange('case')}
                        initial={{ width: 'auto', opacity: 1 }}
                        animate={{ 
                          width: currentStep === 'case' ? 0 : 'auto',
                          opacity: currentStep === 'case' ? 0 : 1
                        }}
                        transition={{ duration: 0.3 }}
                        className={`py-2 rounded-full flex items-center gap-2 overflow-hidden bg-gray-200 ${currentStep === 'case' ? '' : 'px-4'}`}
                      >
                        <span className="text-sm font-medium whitespace-nowrap">Case</span>
                      </motion.button>

                      <motion.div 
                        initial={{ width: 0, opacity: 0 }}
                        animate={{ 
                          width: currentStep === 'case' ? 'auto' : 0,
                          opacity: currentStep === 'case' ? 1 : 0,
                          paddingLeft: currentStep === 'case' ? '1rem' : 0,
                          paddingRight: currentStep === 'case' ? '1rem' : 0,
                        }}
                        transition={{ duration: 0.3 }}
                        className={`py-2 rounded-full flex items-center gap-2 bg-gray-200 overflow-hidden`}
                      >
                        {
                          filteredCases.map(case_ => (
                            <span
                              key={case_.id}
                              onClick={() => handleElementSelect(case_)}
                              className={`cursor-pointer whitespace-nowrap ${
                                selectedCase?.id === case_.id ? 'text-black' : 'text-gray-800'
                              }`}
                            >
                              {case_.color}
                            </span>
                          ))
                        }
                      </motion.div>
                    </div>

                    <div className="flex">
                      <motion.button
                        onClick={() => handleStepChange('band')}
                        initial={{ width: 'auto', opacity: 1 }}
                        animate={{ 
                          width: currentStep === 'band' ? 0 : 'auto',
                          opacity: currentStep === 'band' ? 0 : 1
                        }}
                        transition={{ duration: 0.3 }}
                        className={`py-2 rounded-full flex items-center gap-2 overflow-hidden bg-gray-200 ${currentStep === 'band' ? '' : 'px-4'}`}
                      >
                        <span className="text-sm font-medium whitespace-nowrap">Band</span>
                      </motion.button>

                      <motion.div 
                        initial={{ width: 0, opacity: 0 }}
                        animate={{ 
                          width: currentStep === 'band' ? 'auto' : 0,
                          opacity: currentStep === 'band' ? 1 : 0,
                          paddingLeft: currentStep === 'band' ? '1rem' : 0,
                          paddingRight: currentStep === 'band' ? '1rem' : 0,
                        }}
                        transition={{ duration: 0.3 }}
                        className={`py-2 rounded-full flex items-center gap-2 bg-gray-200 overflow-hidden`}
                      >
                        {
                          filteredBands.map(band => (
                            <span
                              key={band.id}
                              onClick={() => handleElementSelect(band)}
                              className={`cursor-pointer whitespace-nowrap ${
                                selectedBand?.id === band.id ? 'text-black' : 'text-gray-800'
                              }`}
                            >
                              {band.color}
                            </span>
                          ))
                        }
                      </motion.div>
                    </div>
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
