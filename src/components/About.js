'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

export default function About() {
  return (
    <section className="bg-black px-6 py-10 text-white lg:py-24">
      <div className="mx-auto grid max-w-5xl grid-cols-1 items-center gap-0 lg:grid-cols-2 lg:gap-12">
        <h2 className="col-span-1 mb-6 text-3xl uppercase tracking-widest lg:hidden">
          About Onide
        </h2>

        <div className="col-span-1 flex flex-row items-start gap-4 lg:contents lg:gap-8">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative aspect-[4/5] w-[35%] shrink-0 overflow-hidden rounded-2xl lg:mx-auto lg:w-1/2 lg:max-w-sm"
          >
            <Image
              src="/kevin-about.jpg"
              alt="Kevin, tattoo artist from Córdoba, Argentina"
              fill
              className="object-cover"
              sizes="(max-width: 1023px) 35vw, 400px"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="min-w-0 w-[65%] lg:w-1/2"
          >
            <h2 className="hidden text-3xl uppercase tracking-widest lg:mb-6 lg:block lg:text-4xl">
              About Onide
            </h2>
            <p className="text-[13px] leading-relaxed text-gray-300 lg:text-base">
              Kevin is a traveling tattoo artist from Córdoba, Argentina,
              currently based in Edmonton, Alberta, specializing in Black &amp;
              Grey Realism, Neo Tribal, Cover-ups, and Custom Projects. His work
              focuses on anatomy, natural body flow, contrast, smooth shading,
              and dynamic compositions designed to complement the movement and
              structure of the body. Each tattoo is created as a one-of-one
              piece, balancing the client&apos;s vision with clarity, longevity,
              and a natural fit to the body.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}