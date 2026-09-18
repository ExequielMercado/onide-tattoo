'use client';
import PortfolioCard from './PortfolioCard';

const categories = [
  {
    slug: 'black-grey-realism',
    title: 'BLACK & GREY REALISM',
    image: '/portfolio/black-grey-realism.jpg',
    video: '/videos/portfolio/black-grey-realism.mp4',
  },
  {
    slug: 'neo-tribal',
    title: 'NEO TRIBAL',
    image: '/portfolio/neo-tribal.jpg',
    video: '/videos/portfolio/neo-tribal.mp4',
  },
  {
    slug: 'custom-projects',
    title: 'CUSTOM PROJECTS',
    image: '/portfolio/custom-projects.jpg',
    video: '/videos/portfolio/custom-projects.mp4',
  },
];

export default function PortfolioPreview() {
  return (
    <section id="tattoos" className="bg-black px-6 py-20 text-white">
      <h2 className="text-3xl md:text-4xl text-center uppercase tracking-widest mb-12">
        Featured Work
      </h2>
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        {categories.map((cat) => (
          <PortfolioCard key={cat.slug} {...cat} />
        ))}
      </div>
    </section>
  );
}