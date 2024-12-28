import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

interface WatchDisplayProps {
  isStarted: boolean;
  selectedCase: string;
  selectedBand: string;
  children?: React.ReactNode;
}

export default function WatchDisplay({ isStarted, selectedCase, selectedBand, children }: WatchDisplayProps) {
  return (
    <motion.div
      className={`relative w-full max-w-full md:max-w-[700px] aspect-square mx-auto watch-display
        ${isStarted ? 'lg:max-w-[500px]' : 'lg:max-w-[700px]'}`}
      initial={false}
      animate={{
        scale: isStarted ? 0.8 : 1,
        y: isStarted ? -50 : 0,
      }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
    >
      {/* Watch Band Layer */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedBand}
          className="absolute inset-0"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ 
            opacity: 1,
            scale: isStarted ? 1 : 1,
          }}
          exit={{ opacity: 0, scale: 1.1 }}
          transition={{ 
            duration: 0.5,
            ease: "easeInOut"
          }}
        >
          <Image
            src={selectedBand}
            alt="Watch Band"
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 700px"
            className="object-contain w-full"
            priority
          />
        </motion.div>
      </AnimatePresence>

      {/* Watch Case Layer */}
      <motion.div
        className="absolute inset-0 z-10"
        initial={false}
        animate={{
          scale: isStarted ? 1 : 1,
        }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        <Image
          src={selectedCase}
          alt="Watch Case"
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 700px"
          className="object-contain w-full"
          priority
        />
      </motion.div>
      {children}
    </motion.div>
  );
}