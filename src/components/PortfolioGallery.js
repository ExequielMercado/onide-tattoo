'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

export default function PortfolioGallery({ title, images }) {
  const [selectedIndex, setSelectedIndex] = useState(null);

  const close = () => setSelectedIndex(null);
  const showPrev = (e) => {
    e.stopPropagation();
    setSelectedIndex((i) => (i === 0 ? images.length - 1 : i - 1));
  };
  const showNext = (e) => {
    e.stopPropagation();
    setSelectedIndex((i) => (i === images.length - 1 ? 0 : i + 1));
  };

  return (
    <section className="bg-black text-white min-h-screen px-6 py-24">
      <h1 className="text-4xl md:text-5xl text-center uppercase tracking-widest mb-16">
        {title}
      </h1>

      <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-3 gap-4">
        {images.map((src, i) => (
          <motion.div
            key={src}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: (i % 6) * 0.08 }}
            className="relative aspect-square overflow-hidden cursor-pointer"
            onClick={() => setSelectedIndex(i)}
          >
            <Image
              src={src}
              alt={`Onide Tattoo — ${title} tattoo in Edmonton, AB`}
              fill
              className="object-cover hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 768px) 50vw, 33vw"
            />
          </motion.div>
        ))}
      </div>

      {images.length === 0 && (
        <p className="text-center text-gray-400">More work coming soon.</p>
      )}

      <AnimatePresence>
        {selectedIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
            onClick={close}
          >
            <button onClick={close} className="absolute top-6 right-6 text-white text-3xl" aria-label="Close">
              ✕
            </button>

            <button onClick={showPrev} className="absolute left-4 md:left-8 text-white text-4xl" aria-label="Previous image">
              ‹
            </button>

            <motion.div
              key={selectedIndex}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.25 }}
              className="relative w-full max-w-3xl h-[80vh] mx-16"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={images[selectedIndex]}
                alt={`Onide Tattoo — ${title} tattoo in Edmonton, AB`}
                fill
                className="object-contain"
                sizes="90vw"
              />
            </motion.div>

            <button onClick={showNext} className="absolute right-4 md:right-8 text-white text-4xl" aria-label="Next image">
              ›
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}