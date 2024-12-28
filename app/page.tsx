'use client';

import Image from "next/image";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import WatchDisplay from "./components/WatchDisplay";
import WatchCarousel from "./components/WatchCarousel";
import { Share2, Download, X } from 'lucide-react';
import html2canvas from 'html2canvas';
import toast, { Toaster } from 'react-hot-toast';

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
  { id: 1, color: 'Aluminum Silver', src: '/images/watch-case-46-aluminum.png', alt: 'Aluminum Silver Case', collection: 'Sport' },
  { id: 2, color: 'Titanium Gold', src: '/images/watch-case-46-titanium-gold.png', alt: 'Titanium Gold Case', collection: 'Sport' },
  { id: 3, color: 'Titanium Slate', src: '/images/watch-case-46-titanium-slate.png', alt: 'Titanium Slate Case', collection: 'Classic' },
  { id: 4, color: 'Stainless Steel Black', src: '/images/watch-case-black.png', alt: 'Stainless Steel Black Case', collection: 'Classic' },
  { id: 5, color: 'Rose Gold', src: '/images/watch-case-rose.png', alt: 'Rose Gold Case', collection: 'Luxury' },
  { id: 6, color: 'Stainless Steel Silver', src: '/images/watch-case-silver.png', alt: 'Stainless Steel Silver Case', collection: 'Luxury' },
  { id: 7, color: 'Aluminum Midnight', src: '/images/watch-case-44-aluminum-midnight.png', alt: 'Aluminum Midnight Case', collection: 'Sport' },
  { id: 8, color: 'Aluminum Space Gray', src: '/images/watch-case-44-aluminum-silver.png', alt: 'Aluminum Space Gray Case', collection: 'Sport' },
];

const watchBands: ListElements[] = [
  { id: 1, color: 'Midnight Sport Band', src: '/images/band-black.png', alt: 'Midnight Sport Band', collection: 'Sport' },
  { id: 2, color: 'Starlight Sport Band', src: '/images/band-blue.png', alt: 'Starlight Sport Band', collection: 'Sport' },
  { id: 3, color: 'Winter Blue Sport Band', src: '/images/band-green.png', alt: 'Winter Blue Sport Band', collection: 'Classic' },
  { id: 4, color: 'Product Red Sport Band', src: '/images/band-white.png', alt: 'Product Red Sport Band', collection: 'Classic' },
  { id: 5, color: 'Star Fruit Sport Band', src: '/images/band-yellow.png', alt: 'Star Fruit Sport Band', collection: 'Luxury' },
  { id: 6, color: 'Leather Link', src: '/images/MC7L4ref_SR_S10_VW_PF.jpg', alt: 'Leather Link Band', collection: 'Luxury' },
  { id: 7, color: 'Sport Band', src: '/images/MJ4W3_SR_S10_VW_PF.jpg', alt: 'Sport Band', collection: 'Luxury' },
  { id: 8, color: 'Solo Loop', src: '/images/MXWW3ref_SR_S10_VW_PF.jpg', alt: 'Solo Loop Band', collection: 'Luxury' },
  { id: 9, color: 'Sport Loop', src: '/images/MYJE3_SR_S10_VW_PF.jpg', alt: 'Sport Loop Band', collection: 'Classic' },
  { id: 10, color: 'Milanese Loop', src: '/images/MYL83ref_SR_S10_VW_PF.jpg', alt: 'Milanese Loop Band', collection: 'Classic' },
  { id: 11, color: 'Modern Buckle', src: '/images/MYLA3ref_SR_S10_VW_PF.jpg', alt: 'Modern Buckle Band', collection: 'Sport' },
  { id: 12, color: 'Link Bracelet', src: '/images/MYLD3ref_SR_S10_VW_PF.jpg', alt: 'Link Bracelet Band', collection: 'Sport' },
];

const casePrices = {
  'Aluminum Silver': 279,
  'Titanium Gold': 799,
  'Titanium Slate': 799,
  'Stainless Steel Black': 699,
  'Rose Gold': 749,
  'Stainless Steel Silver': 699,
  'Aluminum Midnight': 279,
  'Aluminum Space Gray': 279,
};

const bandPrices = {
  'Midnight Sport Band': 49,
  'Starlight Sport Band': 49,
  'Winter Blue Sport Band': 49,
  'Product Red Sport Band': 49,
  'Star Fruit Sport Band': 49,
  'Leather Link': 99,
  'Sport Band': 49,
  'Solo Loop': 49,
  'Sport Loop': 49,
  'Milanese Loop': 99,
  'Modern Buckle': 149,
  'Link Bracelet': 349,
};

const sizePrices = {
  '41mm': 0,
  '45mm': 30,
};

export default function Home() {
  const [started, setStarted] = useState(false);
  const [currentStep, setCurrentStep] = useState<ConfigStep>('size');
  const [selectedSize, setSelectedSize] = useState('41mm');
  const [selectedCase, setSelectedCase] = useState<ListElements | null>(null);
  const [selectedBand, setSelectedBand] = useState<ListElements | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCollection, setSelectedCollection] = useState('Sport');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showShareMenu, setShowShareMenu] = useState(false);

  // Load configuration from URL params on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const size = params.get('size');
    const caseId = params.get('case');
    const bandId = params.get('band');
    const collection = params.get('collection');

    if (size) setSelectedSize(size);
    if (collection) setSelectedCollection(collection);
    if (caseId) {
      const caseItem = watchCases.find(c => c.id === parseInt(caseId));
      if (caseItem) setSelectedCase(caseItem);
    }
    if (bandId) {
      const bandItem = watchBands.find(b => b.id === parseInt(bandId));
      if (bandItem) setSelectedBand(bandItem);
    }
  }, []);

  // Filter cases and bands based on selected collection
  const filteredCases = watchCases.filter(case_ => case_.collection === selectedCollection);
  const filteredBands = watchBands.filter(band => band.collection === selectedCollection);

  const handleGetStarted = () => {
    setStarted(true);
  };

  const handleStepChange = (step: ConfigStep) => {
    setIsLoading(true);
    setCurrentStep(step);
    setCurrentIndex(0);
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

  const handleOptionSelect = (element: ListElements, index: number) => {
    handleElementSelect(element);
    setCurrentIndex(index);
    
    // Update the selected item based on the current step
    if (currentStep === 'size') {
      setSelectedSize(element.size || '');
    } else if (currentStep === 'case') {
      setSelectedCase(element);
    } else if (currentStep === 'band') {
      setSelectedBand(element);
    }
  };

  // Get the current item based on index and step
  const getCurrentItem = () => {
    if (currentStep === 'size') {
      return watchSizes[currentIndex];
    } else if (currentStep === 'case') {
      return filteredCases[currentIndex];
    } else {
      return filteredBands[currentIndex];
    }
  };

  // Update product info based on current selection
  useEffect(() => {
    const currentItem = getCurrentItem();
    if (currentItem) {
      handleElementSelect(currentItem as ListElements);
    }
  }, [currentIndex, currentStep]);

  const calculateTotalPrice = () => {
    const basePrice = 279; // Base price for the cheapest model
    const casePrice = selectedCase?.color ? (casePrices[selectedCase.color as keyof typeof casePrices] - basePrice) : 0;
    const bandPrice = selectedBand?.color ? bandPrices[selectedBand.color as keyof typeof bandPrices] : 0;
    const sizePrice = selectedSize ? sizePrices[selectedSize as keyof typeof sizePrices] : 0;

    return basePrice + casePrice + bandPrice + sizePrice;
  };

  const generateShareableUrl = () => {
    const config = {
      size: selectedSize,
      case: selectedCase?.id,
      band: selectedBand?.id,
      collection: selectedCollection
    };
    const params = new URLSearchParams();
    Object.entries(config).forEach(([key, value]) => {
      if (value) params.append(key, value.toString());
    });
    return `${window.location.origin}?${params.toString()}`;
  };

  const handleShare = async (platform: string) => {
    const url = generateShareableUrl();
    const text = `Check out my custom Apple Watch design!`;

    switch (platform) {
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`);
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`);
        break;
      case 'copy':
        await navigator.clipboard.writeText(url);
        toast.success('Link copied to clipboard!');
        break;
    }
    setShowShareMenu(false);
  };

  const handleSave = async () => {
    const watchElement = document.querySelector('.watch-display');
    if (watchElement) {
      const canvas = await html2canvas(watchElement as HTMLElement);
      const link = document.createElement('a');
      link.download = 'my-custom-watch.png';
      link.href = canvas.toDataURL();
      link.click();
    }
  };

  return (
    <div className="min-h-screen bg-white text-black">
      <Toaster />
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

            <div className="flex flex-col items-center pt-8 px-6">
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
                >
                  {/* <div className="flex justify-end gap-2">
                    <button 
                      onClick={() => setShowShareMenu(true)}
                      className="bg-gray-100 hover:bg-gray-200 text-black px-3 py-1.5 rounded-full text-sm flex items-center gap-1"
                    >
                      <Share2 className="w-4 h-4" />
                      Share
                    </button>
                    <button 
                      onClick={handleSave}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-full text-sm flex items-center gap-1"
                    >
                      <Download className="w-4 h-4" />
                      Save
                    </button>
                  </div> */}
                </WatchDisplay>
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
                          {collection.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex justify-end gap-2">
                    <button 
                      onClick={() => setShowShareMenu(true)}
                      className="bg-gray-100 hover:bg-gray-200 text-black px-3 py-1.5 rounded-full text-sm flex items-center gap-1"
                    >
                      <Share2 className="w-4 h-4" />
                      Share
                    </button>
                    <button 
                      onClick={handleSave}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-full text-sm flex items-center gap-1"
                    >
                      <Download className="w-4 h-4" />
                      Save
                    </button>
                  </div>
                </div>
              </nav>
            </header>

            {/* Share Menu */}
            <AnimatePresence>
              {showShareMenu && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/50 z-[9999] flex items-center justify-center"
                  onClick={() => setShowShareMenu(false)}
                >
                  <motion.div
                    initial={{ scale: 0.95 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0.95 }}
                    className="bg-white rounded-lg p-6 w-full max-w-sm mx-4"
                    onClick={e => e.stopPropagation()}
                  >
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-medium">Share your design</h3>
                      <button
                        onClick={() => setShowShareMenu(false)}
                        className="text-gray-400 hover:text-gray-500"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="space-y-3">
                      <button
                        onClick={() => handleShare('twitter')}
                        className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-3"
                      >
                        <Image src="/images/twitter.svg" alt="Twitter" width={20} height={20} />
                        Share on Twitter
                      </button>
                      <button
                        onClick={() => handleShare('facebook')}
                        className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-3"
                      >
                        <Image src="/images/facebook.svg" alt="Facebook" width={20} height={20} />
                        Share on Facebook
                      </button>
                      <button
                        onClick={() => handleShare('copy')}
                        className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-3"
                      >
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M8 4v12a2 2 0 002 2h8a2 2 0 002-2V7.242a2 2 0 00-.602-1.43L16.083 2.57A2 2 0 0014.685 2H10a2 2 0 00-2 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M16 18v2a2 2 0 01-2 2H6a2 2 0 01-2-2V9a2 2 0 012-2h2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        Copy link
                      </button>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

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
                      currentIndex={currentIndex}
                      setCurrentIndex={setCurrentIndex}
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
                      currentIndex={currentIndex}
                      setCurrentIndex={setCurrentIndex}
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
                      currentIndex={currentIndex}
                      setCurrentIndex={setCurrentIndex}
                    />
                  )
                )}
              </div>

              {/* Product Info */}
              <div className="text-center mb-8">
                <p className="text-sm mb-1">{selectedCollection || 'APPLE WATCH SE'}</p>
                <h1 className="text-lg font-medium mb-1">
                  {selectedSize} {selectedCase?.color || 'Silver'} Case with {selectedBand?.color || 'Star Fruit'}
                </h1>
                <p className="text-sm">From ${calculateTotalPrice()}</p>
              </div>

              {/* Bottom Action Bar */}
              <div>
                <div className="flex justify-center px-6 py-4">
                  {/* Action Buttons */}
                  <div className="overflow-x-scroll no-scrollbar">
                    <div className="flex gap-4">
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
                          <div className="rf-designstudio-filter-icon" aria-hidden="true"><svg height="25" viewBox="0 0 19 25" width="19" xmlns="http://www.w3.org/2000/svg"><path d="m0 0h19v25h-19z" fill="none"></path><path d="m18.25 9.038v1.7427c0 .2972-.0833.5382-.25.7227-.1665.1847-.385.277-.6553.277h-.3447v5.1904c0 2.2253-1.804 4.0293-4.0293 4.0293h-2.3643c.3291-.2865.6082-.6216.8301-1h1.5342c1.6704 0 3.0293-1.3589 3.0293-3.0293v-8.9414c0-1.6704-1.3589-3.0293-3.0293-3.0293h-6.9414c-1.3074 0-2.4136.8372-2.8372 2h-.1748c-.3113 0-.6113.0437-.9026.1111.417-1.781 2.0063-3.1111 3.9146-3.1111h6.9414c2.2253 0 4.0293 1.804 4.0293 4.0293v.0225h.3447c.2703 0 .4888.0902.6553.2703.1667.1803.25.4187.25.7159zm-7.25 8.9447c0 1.6664-1.3508 3.0173-3.0173 3.0173h-4.9654c-1.6665 0-3.0173-1.351-3.0173-3.0173v-6.9653c0-1.6664 1.3508-3.0173 3.0173-3.0173h4.9653c1.6665 0 3.0173 1.351 3.0173 3.0173v.1215h.3076c.2068 0 .3738.069.5012.2067.1274.1379.1912.3202.1912.5475v1.3326c0 .2273-.0637.4116-.1912.5526-.1274.1412-.2944.2118-.5012.2118h-.3076v3.9927zm-1-6.9653c0-1.1123-.905-2.0173-2.0173-2.0173h-4.9654c-.0059 0-.0115.0017-.0173.0017-.366.0032-.7048.1096-1 .2837-.5952.3511-1 .9922-1 1.7319v6.9653c0 1.1123.905 2.0173 2.0173 2.0173h4.9653c1.1123 0 2.0173-.905 2.0173-2.0173v-6.9653z" fill="#1d1d1f"></path></svg></div>
                          <span className="text-sm whitespace-nowrap">Size</span>
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
                          className={`py-2 rounded-full flex items-center gap-3 bg-gray-200 overflow-hidden`}
                        >
                          <div className="rf-designstudio-filter-icon" aria-hidden="true"><svg height="25" viewBox="0 0 19 25" width="19" xmlns="http://www.w3.org/2000/svg"><path d="m0 0h19v25h-19z" fill="none"></path><path d="m18.25 9.038v1.7427c0 .2972-.0833.5382-.25.7227-.1665.1847-.385.277-.6553.277h-.3447v5.1904c0 2.2253-1.804 4.0293-4.0293 4.0293h-2.3643c.3291-.2865.6082-.6216.8301-1h1.5342c1.6704 0 3.0293-1.3589 3.0293-3.0293v-8.9414c0-1.6704-1.3589-3.0293-3.0293-3.0293h-6.9414c-1.3074 0-2.4136.8372-2.8372 2h-.1748c-.3113 0-.6113.0437-.9026.1111.417-1.781 2.0063-3.1111 3.9146-3.1111h6.9414c2.2253 0 4.0293 1.804 4.0293 4.0293v.0225h.3447c.2703 0 .4888.0902.6553.2703.1667.1803.25.4187.25.7159zm-7.25 8.9447c0 1.6664-1.3508 3.0173-3.0173 3.0173h-4.9654c-1.6665 0-3.0173-1.351-3.0173-3.0173v-6.9653c0-1.6664 1.3508-3.0173 3.0173-3.0173h4.9653c1.6665 0 3.0173 1.351 3.0173 3.0173v.1215h.3076c.2068 0 .3738.069.5012.2067.1274.1379.1912.3202.1912.5475v1.3326c0 .2273-.0637.4116-.1912.5526-.1274.1412-.2944.2118-.5012.2118h-.3076v3.9927zm-1-6.9653c0-1.1123-.905-2.0173-2.0173-2.0173h-4.9654c-.0059 0-.0115.0017-.0173.0017-.366.0032-.7048.1096-1 .2837-.5952.3511-1 .9922-1 1.7319v6.9653c0 1.1123.905 2.0173 2.0173 2.0173h4.9653c1.1123 0 2.0173-.905 2.0173-2.0173v-6.9653z" fill="#1d1d1f"></path></svg></div>
                          {
                            watchSizes.map((size, index) => (
                              <span
                                key={size.id}
                                onClick={() => handleOptionSelect({ id: size.id, src: size.src, alt: size.alt || '', color: null, size: size.size }, index)}
                                className={`cursor-pointer whitespace-nowrap ${selectedSize === size.size ? 'text-black font-medium' : 'text-gray-800'
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
                          <div className="rf-designstudio-filter-icon" aria-hidden="true"><svg height="25" viewBox="0 0 17 25" width="17" xmlns="http://www.w3.org/2000/svg"><path d="m0 0h17v25h-17z" fill="none"></path><path d="m16 8.2017c-.1665-.1801-.385-.2703-.6553-.2703h-.3447v-.0225c0-2.2253-1.804-4.0293-4.0293-4.0293h-6.9414c-2.2253.0001-4.0293 1.804-4.0293 4.0294v8.9414c0 2.2253 1.804 4.0293 4.0293 4.0293h6.9414c2.2253 0 4.0293-1.804 4.0293-4.0293v-5.1904h.3447c.2703 0 .4888-.0923.6553-.277.1667-.1844.25-.4254.25-.7227v-1.7427c0-.2972-.0833-.5356-.25-.7159zm-2 8.6487c0 1.6704-1.3589 3.0293-3.0293 3.0293h-6.9414c-1.6704 0-3.0293-1.3589-3.0293-3.0293v-8.9414c0-1.6704 1.3589-3.0293 3.0293-3.0293h6.9414c1.6704 0 3.0293 1.3589 3.0293 3.0293z" fill="#1d1d1f"></path></svg></div>
                          <span className="text-sm whitespace-nowrap">Case</span>
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
                          className={`py-2 rounded-full flex items-center gap-3 bg-gray-200 overflow-hidden`}
                        >
                          <div className="rf-designstudio-filter-icon" aria-hidden="true"><svg height="25" viewBox="0 0 17 25" width="17" xmlns="http://www.w3.org/2000/svg"><path d="m0 0h17v25h-17z" fill="none"></path><path d="m16 8.2017c-.1665-.1801-.385-.2703-.6553-.2703h-.3447v-.0225c0-2.2253-1.804-4.0293-4.0293-4.0293h-6.9414c-2.2253.0001-4.0293 1.804-4.0293 4.0294v8.9414c0 2.2253 1.804 4.0293 4.0293 4.0293h6.9414c2.2253 0 4.0293-1.804 4.0293-4.0293v-5.1904h.3447c.2703 0 .4888-.0923.6553-.277.1667-.1844.25-.4254.25-.7227v-1.7427c0-.2972-.0833-.5356-.25-.7159zm-2 8.6487c0 1.6704-1.3589 3.0293-3.0293 3.0293h-6.9414c-1.6704 0-3.0293-1.3589-3.0293-3.0293v-8.9414c0-1.6704 1.3589-3.0293 3.0293-3.0293h6.9414c1.6704 0 3.0293 1.3589 3.0293 3.0293z" fill="#1d1d1f"></path></svg></div>
                          {
                            filteredCases.map((case_, index) => (
                              <span
                                key={case_.id}
                                onClick={() => handleOptionSelect(case_, index)}
                                className={`cursor-pointer whitespace-nowrap ${selectedCase?.id === case_.id ? 'text-black font-medium' : 'text-gray-800'
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
                          <div className="rf-designstudio-filter-icon" aria-hidden="true"><svg height="25" viewBox="0 0 10 25" width="10" xmlns="http://www.w3.org/2000/svg"><path d="m0 0h10v25h-10z" fill="none"></path><path d="m9.5 22.5a.5.5 0 0 1 -.5.5h-8a.5.5 0 1 1 0-1h.015a.485.485 0 0 0 .485-.485v-6.2216a4.5231 4.5231 0 0 0 1 .9448v5.2768a1.4779 1.4779 0 0 1 -.0813.485h5.1627a1.4758 1.4758 0 0 1 -.0814-.485v-5.2768a4.5209 4.5209 0 0 0 1-.9448v6.2216a.4851.4851 0 0 0 .4851.485h.0149a.5.5 0 0 1 .5.5zm-1.9194-19.5h-5.1621a1.4732 1.4732 0 0 1 .0815.485v9.015a2.5 2.5 0 0 0 5 0v-9.015a1.4873 1.4873 0 0 1 .0806-.485m1.4194-1a.5.5 0 0 1 .5.5.5.5 0 0 1 -.5.5h-.015a.485.485 0 0 0 -.485.485v9.015a3.5 3.5 0 0 1 -3.5 3.5 3.5 3.5 0 0 1 -3.5-3.5v-9.015a.485.485 0 0 0 -.485-.485h-.015a.5.5 0 0 1 0-1zm-3.2179 10.5a.75.75 0 1 0 -.75.75.75.75 0 0 0 .75-.75zm0-2.5a.75.75 0 1 0 -.75.75.75.75 0 0 0 .75-.75zm0-2.5a.75.75 0 1 0 -.75.75.75.75 0 0 0 .75-.75z" fill="#1d1d1f"></path></svg></div>
                          <span className="text-sm whitespace-nowrap">Band</span>
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
                          className={`py-2 rounded-full flex items-center gap-3 bg-gray-200 overflow-hidden`}
                        >
                          <div className="rf-designstudio-filter-icon" aria-hidden="true"><svg height="25" viewBox="0 0 10 25" width="10" xmlns="http://www.w3.org/2000/svg"><path d="m0 0h10v25h-10z" fill="none"></path><path d="m9.5 22.5a.5.5 0 0 1 -.5.5h-8a.5.5 0 1 1 0-1h.015a.485.485 0 0 0 .485-.485v-6.2216a4.5231 4.5231 0 0 0 1 .9448v5.2768a1.4779 1.4779 0 0 1 -.0813.485h5.1627a1.4758 1.4758 0 0 1 -.0814-.485v-5.2768a4.5209 4.5209 0 0 0 1-.9448v6.2216a.4851.4851 0 0 0 .4851.485h.0149a.5.5 0 0 1 .5.5zm-1.9194-19.5h-5.1621a1.4732 1.4732 0 0 1 .0815.485v9.015a2.5 2.5 0 0 0 5 0v-9.015a1.4873 1.4873 0 0 1 .0806-.485m1.4194-1a.5.5 0 0 1 .5.5.5.5 0 0 1 -.5.5h-.015a.485.485 0 0 0 -.485.485v9.015a3.5 3.5 0 0 1 -3.5 3.5 3.5 3.5 0 0 1 -3.5-3.5v-9.015a.485.485 0 0 0 -.485-.485h-.015a.5.5 0 0 1 0-1zm-3.2179 10.5a.75.75 0 1 0 -.75.75.75.75 0 0 0 .75-.75zm0-2.5a.75.75 0 1 0 -.75.75.75.75 0 0 0 .75-.75zm0-2.5a.75.75 0 1 0 -.75.75.75.75 0 0 0 .75-.75z" fill="#1d1d1f"></path></svg></div>
                          {
                            filteredBands.map((band, index) => (
                              <span
                                key={band.id}
                                onClick={() => handleOptionSelect(band, index)}
                                className={`cursor-pointer whitespace-nowrap ${selectedBand?.id === band.id ? 'text-black font-medium' : 'text-gray-800'
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
              </div>
            </main>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
