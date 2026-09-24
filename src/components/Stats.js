import Image from 'next/image';

const instagramImages = [
  {
    src: '/images/portfolio/bio-organic/onide-tattoo-bio organic 01.jpg',
    alt: 'Bio-organic tattoo',
  },
  {
    src: '/images/portfolio/bio-organic/onide-tattoo-bio organic 02.jpg',
    alt: 'Bio-organic tattoo detail',
  },
  {
    src: '/images/portfolio/black-and-grey/onide-tattoo-black & grey 01.jpg',
    alt: 'Black and grey tattoo',
  },
  {
    src: '/images/portfolio/realism/onide-tattoo-realism-01.jpg',
    alt: 'Realism tattoo',
  },
  {
    src: '/images/portfolio/realism/onide-tattoo-realism-02.jpg',
    alt: 'Realism tattoo detail',
  },
  {
    src: '/images/portfolio/black-and-grey/onide-tattoo-black & grey 02.jpg',
    alt: 'Black and grey tattoo detail',
  },
];

export default function Stats() {
  return (
    <section className="bg-black px-4 py-16 text-white">
      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-2">
        <article className="rounded-xl bg-white p-6 text-gray-800 shadow-xl shadow-black/30">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-500 font-semibold text-white">
                M
              </div>
              <div>
                <p className="font-semibold text-gray-900">Mike S.</p>
                <p className="text-xs text-gray-500">2 months ago</p>
              </div>
            </div>
            <svg
              aria-label="Google"
              className="h-7 w-7"
              viewBox="0 0 24 24"
              role="img"
            >
              <path fill="#4285F4" d="M21.35 12.27c0-.71-.06-1.39-.18-2.05H12v3.88h5.24a4.48 4.48 0 0 1-1.94 2.94v2.45h3.14c1.84-1.69 2.91-4.18 2.91-7.22Z" />
              <path fill="#34A853" d="M12 21.5c2.63 0 4.84-.87 6.45-2.36l-3.14-2.45c-.87.58-1.98.92-3.31.92-2.54 0-4.69-1.71-5.46-4.01H3.3v2.53A9.74 9.74 0 0 0 12 21.5Z" />
              <path fill="#FBBC05" d="M6.54 13.6a5.86 5.86 0 0 1 0-3.2V7.87H3.3a9.5 9.5 0 0 0 0 8.26l3.24-2.53Z" />
              <path fill="#EA4335" d="M12 6.39c1.43 0 2.71.49 3.72 1.46l2.79-2.79C16.84 3.48 14.63 2.5 12 2.5a9.74 9.74 0 0 0-8.7 5.37l3.24 2.53C7.31 8.1 9.46 6.39 12 6.39Z" />
            </svg>
          </div>

          <div className="mt-5 text-lg tracking-wide text-yellow-500" aria-label="5 out of 5 stars">
            ★★★★★
          </div>
          <blockquote className="mt-4 text-[15px] leading-relaxed text-gray-800">
            &quot;The best tattoo experience I’ve ever had. Incredible attention to detail.&quot;
          </blockquote>
          <a
            href="https://maps.app.goo.gl/DUng2voRdbhq2hXF8?g_st=ic"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-7 inline-block text-sm font-medium text-blue-600 transition hover:text-blue-800 hover:underline"
          >
            View on Google
          </a>
        </article>

        <article className="rounded-xl bg-zinc-900 p-6 shadow-xl shadow-black/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative h-12 w-12 overflow-hidden rounded-full ring-2 ring-pink-500 ring-offset-2 ring-offset-zinc-900">
                <Image
                  src="/kevin-about.jpg"
                  alt="Onide tattoo artist"
                  fill
                  sizes="48px"
                  className="object-cover"
                />
              </div>
              <div>
                <p className="font-semibold text-white">@onidetattoo</p>
                <p className="text-xs text-zinc-400">Tattoo Artist</p>
              </div>
            </div>
            <a
              href="https://www.instagram.com/onidetattoo/"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-md bg-blue-500 px-4 py-1 text-sm font-semibold text-white transition hover:bg-blue-600"
            >
              Follow
            </a>
          </div>
          <div className="mt-4 flex gap-5 text-xs text-zinc-400">
            <span><strong className="text-zinc-200">125</strong> posts</span>
            <span><strong className="text-zinc-200">4.5K</strong> followers</span>
          </div>
          <a
            href="https://www.instagram.com/onidetattoo/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="View Onide Tattoo on Instagram"
            className="mt-4 grid grid-cols-3 gap-1"
          >
            {instagramImages.map((image) => (
              <div key={image.src} className="relative aspect-square overflow-hidden">
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  sizes="(min-width: 768px) 140px, 30vw"
                  className="object-cover transition duration-300 hover:scale-110"
                />
              </div>
            ))}
          </a>
        </article>
      </div>
    </section>
  );
}
