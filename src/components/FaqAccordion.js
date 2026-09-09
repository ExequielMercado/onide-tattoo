'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const faqs = [
  {
    question: 'Do I need to book a consultation before my tattoo?',
    answer:
      'Yes. Every custom piece starts with a consultation to discuss placement, size, and design details before booking your session.',
  },
  {
    question: 'Is a deposit required?',
    answer:
      'Yes, a non-refundable deposit is required to secure your appointment. It goes toward the final cost of your tattoo.',
  },
  {
    question: 'What is the minimum age to get a tattoo?',
    answer:
      'You must be 18 years or older with valid government ID. No exceptions.',
  },
  {
    question: 'Do you accept walk-ins?',
    answer:
      'Availability for walk-ins varies. Booking a consultation in advance is recommended to guarantee your spot.',
  },
  {
    question: 'How should I prepare for my appointment?',
    answer:
      'Get a good night’s sleep, eat a proper meal beforehand, stay hydrated, and avoid alcohol for at least 24 hours prior.',
  },
  {
    question: 'How do I take care of my tattoo afterward?',
    answer:
      'Detailed aftercare instructions will be provided after your session, including cleaning routine and products to use.',
  },
];

export default function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <section className="bg-black text-white min-h-screen px-6 py-24">
      <h1 className="text-4xl md:text-5xl text-center uppercase tracking-widest mb-16">
        FAQ
      </h1>

      <div className="max-w-2xl mx-auto space-y-4">
        {faqs.map((item, i) => {
          const isOpen = openIndex === i;
          return (
            <div key={i} className="border-b border-white/20">
              <button
                onClick={() => setOpenIndex(isOpen ? null : i)}
                className="w-full flex justify-between items-center py-5 text-left"
              >
                <span className="text-lg">{item.question}</span>
                <motion.span
                  animate={{ rotate: isOpen ? 45 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="text-2xl"
                >
                  +
                </motion.span>
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <p className="pb-5 text-gray-400">{item.answer}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
}