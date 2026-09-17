'use client';
import Link from 'next/link';
import PortfolioCard from './PortfolioCard';

const categories = [
  { 
    slug: 'black-and-grey', 
    label: 'Black & Grey', 
    thumbnail: '/images/portfolio/black-and-grey/onide-tattoo-black%20%26%20grey%2001.jpg',
    video: '/videos/portfolio/black-and-grey.mp4' 
  },
  { 
    slug: 'realism', 
    label: 'Realism', 
    thumbnail: '/images/portfolio/realism/onide-tattoo-realism-01.jpg',
    video: '/videos/portfolio/realism.mp4' 
  },
  { 
    slug: 'bio-organic', 
    label: 'Bio-Organic', 
    thumbnail: '/images/portfolio/bio-organic/onide-tattoo-bio%20organic%2001.jpg',
    video: '/videos/portfolio/bio-organic.mp4' 
  },
];

export default function PortfolioPreview() {
  return (
    <section className="bg-black text-white py-20 px-6">
      <h2 className="text-3xl md:text-4xl text-center uppercase tracking-widest mb-12">
        Featured Work
      </h2>
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        {categories.map((cat) => (
          <PortfolioCard key={cat.slug} {...cat} />
        ))}
      </div>
      <div className="text-center mt-12">
        <Link
          href="/portafolio"
          className="inline-block border border-white px-8 py-3 uppercase tracking-widest hover:bg-white hover:text-black transition"
        >
          View Full Portfolio
        </Link>
      </div>
    </section>
  );
}