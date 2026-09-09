'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useEffect, useRef } from 'react';
import Stats from '@/components/Stats';
import About from '@/components/About';
import PortfolioPreview from '@/components/PortfolioPreview';

const headline = "Bold Ink. Precise Detail.";

export default function Home() {
  const words = headline.split(' ');
  const videoRef = useRef(null);

  useEffect(() => {
  if (videoRef.current) {
    videoRef.current.muted = true;
    videoRef.current.setAttribute('muted', '');
    videoRef.current.play().catch(() => {});
  }
}, []);

  return (
    <>
      <section className="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-black text-white">
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/videos/hero-realism.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/60" />

        <div className="relative z-10 text-center px-6">
          <h1 className="text-4xl md:text-7xl font-bold uppercase tracking-tight flex flex-wrap justify-center gap-x-4">
            {words.map((word, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.15 }}
              >
                {word}
              </motion.span>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="mt-6 text-lg md:text-xl text-gray-300"
          >
            Onide — Tattoo Artist in Edmonton, AB
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.1 }}
            className="mt-8"
          >
            <Link
              href="/book"
              className="inline-block border border-white px-8 py-3 uppercase tracking-widest hover:bg-white hover:text-black transition"
            >
              Book a Consultation
            </Link>
          </motion.div>
        </div>

        <motion.div
          className="absolute bottom-8 text-sm tracking-widest uppercase text-gray-400"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          Scroll
        </motion.div>
      </section>

      <Stats />
      <About />
      <PortfolioPreview />
    </>
  );
}