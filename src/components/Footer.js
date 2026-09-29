'use client';

export default function Footer() {
  return (
    <footer className="bg-black text-white py-10 border-t border-white/10">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-sm text-gray-400">
          © {new Date().getFullYear()} Onide Tattoo — Edmonton, AB
        </p>
        <div className="flex items-center gap-6 text-white">
          <a
            href="https://www.instagram.com/onidetattoo"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="transition-colors hover:text-gray-400"
          >
            <svg
              aria-hidden="true"
              className="h-6 w-6"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="3" width="18" height="18" rx="5" />
              <circle cx="12" cy="12" r="4" />
              <circle cx="18" cy="6" r="0.8" fill="currentColor" stroke="none" />
            </svg>
          </a>
          <a
            href="https://www.tiktok.com/@onidetattoo"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="TikTok"
            className="transition-colors hover:text-gray-400"
          >
            <svg
              aria-hidden="true"
              className="h-6 w-6"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M19.6 7.2a5.7 5.7 0 0 1-3.5-1.2v7.1a5.7 5.7 0 1 1-5-5.65v3.1a2.7 2.7 0 1 0 2 2.6V2h3a5.7 5.7 0 0 0 3.5 5.2v0Z" />
            </svg>
          </a>
          <a
            href="mailto:onidetattoo@gmail.com"
            onClick={() => {
              navigator.clipboard.writeText('onidetattoo@gmail.com');
              alert('Correo copiado: onidetattoo@gmail.com');
            }}
            aria-label="Email Onide Tattoo"
            className="transition-colors hover:text-gray-400"
          >
            <svg
              aria-hidden="true"
              className="h-6 w-6"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="5" width="18" height="14" rx="2" />
              <path d="m3 7 9 6 9-6" />
            </svg>
          </a>
        </div>
      </div>
    </footer>
  );
}