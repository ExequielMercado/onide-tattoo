'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

export default function About() {
  return (
    <section className="bg-black text-white py-24 px-6">
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative aspect-[4/5] w-full max-w-sm mx-auto"
        >
          <Image
            src="/images/about/onide-portrait.png"
            alt="Onide, tattoo artist in Edmonton, AB"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 400px"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl uppercase tracking-widest mb-6">
            About Onide
          </h2>
          <p className="text-gray-400 leading-relaxed mb-4">
            Based in Edmonton, Alberta, Onide is a tattoo artist specializing
            in Black &amp; Grey, Realism, and Bio-Organic work. Every piece
            starts as a conversation — translating your idea into a design
            that&apos;s built to last and true to your vision.
          </p>
          <p className="text-gray-400 leading-relaxed">
            Currently tattooing at Phantom Avenue, Edmonton&apos;s Whyte Ave
            tattoo studio.
          </p>
        </motion.div>
      </div>
    </section>
  );
}