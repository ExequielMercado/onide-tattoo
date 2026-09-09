import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white text-center px-6">
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <p className="text-gray-400 mb-8">
        This page doesn&apos;t exist — but the ink is still good.
      </p>
      <Link
        href="/"
        className="inline-block border border-white px-8 py-3 uppercase tracking-widest hover:bg-white hover:text-black transition"
      >
        Back to Home
      </Link>
    </div>
  );
}