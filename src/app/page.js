'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useEffect, useRef } from 'react';
import Stats from '@/components/Stats';
import About from '@/components/About';
import PortfolioPreview from '@/components/PortfolioPreview';

const headline = "Get Tattooed";

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
          <h1 className="flex flex-wrap justify-center gap-x-4 text-5xl font-bold tracking-[0.18em] md:text-7xl">
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
            Onide — Currently in Edmonton, AB
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.1 }}
            className="mt-8"
          >
            <Link
              href="/book"
              className="relative z-10 inline-block border border-white/20 bg-white/10 px-8 py-3 text-white backdrop-blur-md transition hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/50"
            >
              Book a free consultation
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