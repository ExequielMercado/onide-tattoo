'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import Script from 'next/script';
import { useEffect, useRef, useState } from 'react';
import About from '@/components/About';
import PortfolioPreview from '@/components/PortfolioPreview';

const headline = "GET TATTED";

export default function Home() {
  const words = headline.split(' ');
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

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
        <div className="absolute inset-0">
          <video
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            poster="/videos/hero-poster.jpg"
            onPlay={() => setIsPlaying(true)}
            className="absolute inset-0 h-full w-full object-cover"
          >
            <source src="/videos/hero-realism.mp4" type="video/mp4" />
          </video>
          {!isPlaying && (
            <Image
              src="/videos/hero-poster.jpg"
              alt=""
              fill
              priority
              aria-hidden="true"
              className="absolute inset-0 z-10 object-cover"
              sizes="100vw"
            />
          )}
        </div>
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

      <div className="w-full overflow-hidden flex justify-center pt-8 pb-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <div className="flex w-full max-w-[1400px] flex-col items-start justify-center gap-12 px-4 lg:gap-8 lg:flex-row lg:px-8 lg:scale-[0.75] lg:origin-top lg:-mb-[180px]">
          <div className="relative w-full max-w-[400px] h-auto touch-pan-y lg:w-[28%] lg:max-w-none">
            <div className="relative w-full">
              <div
                className="elfsight-app-774c7d2a-6ce0-464f-aa10-b17034eedb8c w-full"
                data-elfsight-app-lazy
              />
              <div className="absolute bottom-0 left-0 z-50 h-10 w-full bg-black lg:h-12" />
            </div>
          </div>

          <div className="relative w-full max-w-[400px] h-auto touch-pan-y lg:w-[80%] lg:max-w-none">
            <div className="relative w-full">
              <div
                className="elfsight-app-b66f1b85-1b37-426b-a5a8-ff6b65a31f62 w-full"
                data-elfsight-app-lazy
              />
              <div className="absolute bottom-0 left-0 z-50 h-10 w-full bg-black lg:h-12" />
            </div>
          </div>

        </div>
      </div>
      <About />
      <PortfolioPreview />
      <Script src="https://elfsightcdn.com/platform.js" strategy="lazyOnload" />
    </>
  );
}