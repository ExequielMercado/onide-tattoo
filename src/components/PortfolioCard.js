'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function PortfolioCard({ slug, label, thumbnail, video }) {
  const videoRef = useRef(null);
  const [isHovering, setIsHovering] = useState(false);

  function handleEnter() {
    setIsHovering(true);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
    }
  }

  function handleLeave() {
    setIsHovering(false);
    if (videoRef.current) {
      videoRef.current.pause();
    }
  }

  return (
    <Link href={`/portafolio/${slug}`}>
      <div
        className="group relative aspect-square w-full cursor-pointer overflow-hidden sm:h-80 sm:aspect-auto"
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
      >
        {thumbnail && (
          <Image
            src={thumbnail}
            alt={`${label} tattoo by Onide — Edmonton, AB`}
            fill
            className={`object-cover transition-opacity duration-500 ${
              isHovering ? 'opacity-0' : 'opacity-100'
            }`}
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        )}

        <video
          ref={videoRef}
          muted
          loop
          playsInline
          preload="none"
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
            isHovering ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <source src={video} type="video/mp4" />
        </video>

        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition" />
        <span className="absolute bottom-6 left-6 text-xl uppercase tracking-widest z-10">
          {label}
        </span>
      </div>
    </Link>
  );
}