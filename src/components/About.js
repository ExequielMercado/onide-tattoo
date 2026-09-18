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
            src="/kevin-about.jpg"
            alt="Kevin, tattoo artist from Córdoba, Argentina"
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
          <p className="text-gray-400 leading-relaxed">
            Kevin is a traveling tattoo artist from Córdoba, Argentina,
            currently based in Edmonton, Alberta, specializing in Black &amp;
            Grey Realism, Neo Tribal, Cover-ups, and Custom Projects.
          </p>
        </motion.div>
      </div>
    </section>
  );
}