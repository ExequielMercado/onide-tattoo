'use client';

import { motion } from 'framer-motion';

const steps = [
  {
    day: 'First 24 Hours',
    title: 'Keep it clean and covered',
    text: 'Leave the initial bandage on for 2-4 hours. Gently wash with lukewarm water and unscented soap, pat dry with a clean paper towel — never rub.',
  },
  {
    day: 'Days 1-3',
    title: 'Light moisturizing',
    text: 'Apply a thin layer of fragrance-free healing ointment 2-3 times a day. Less is more — the tattoo should never look greasy or wet.',
  },
  {
    day: 'Days 4-14',
    title: 'Switch to lotion',
    text: 'Once the skin stops feeling tight, switch to a fragrance-free lotion. Peeling and mild itching are normal — do not pick or scratch.',
  },
  {
    day: 'Weeks 2-4',
    title: 'Protect and be patient',
    text: 'Avoid direct sun, pools, and soaking (baths, hot tubs, saunas) until fully healed. Full healing can take up to 4-6 weeks.',
  },
];

const doDont = {
  do: [
    'Wash your hands before touching the area',
    'Wear loose, breathable clothing over the tattoo',
    'Use SPF once healed to protect the color long-term',
  ],
  dont: [
    "Don't pick, scratch, or peel the skin",
    "Don't expose it to direct sunlight while healing",
    "Don't swim in pools, lakes, or hot tubs until fully healed",
  ],
};

export default function Aftercare() {
  return (
    <section className="bg-black text-white min-h-screen px-6 pt-40 pb-24">
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-4xl md:text-5xl text-center uppercase tracking-widest mb-4"
      >
        Aftercare
      </motion.h1>
      <p className="text-center text-gray-400 max-w-xl mx-auto mb-20">
        Taking care of your new tattoo properly is just as important as the
        tattoo itself. Follow this guide to make sure it heals well and looks
        great for years to come.
      </p>

      {/* Timeline */}
      <div className="max-w-3xl mx-auto space-y-10 mb-24">
        {steps.map((step, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="flex flex-col md:flex-row gap-4 md:gap-8 border-l-2 border-white/20 pl-6"
          >
            <span className="text-sm uppercase tracking-widest text-gray-500 md:w-40 shrink-0">
              {step.day}
            </span>
            <div>
              <h3 className="text-xl mb-2">{step.title}</h3>
              <p className="text-gray-400 leading-relaxed">{step.text}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Do's and Don'ts */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8"
      >
        <div className="border border-green-500/30 p-6">
          <h3 className="text-lg uppercase tracking-widest mb-4 text-green-400">
            Do
          </h3>
          <ul className="space-y-2 text-gray-400">
            {doDont.do.map((item, i) => (
              <li key={i}>— {item}</li>
            ))}
          </ul>
        </div>
        <div className="border border-red-500/30 p-6">
          <h3 className="text-lg uppercase tracking-widest mb-4 text-red-400">
            Don&apos;t
          </h3>
          <ul className="space-y-2 text-gray-400">
            {doDont.dont.map((item, i) => (
              <li key={i}>— {item}</li>
            ))}
          </ul>
        </div>
      </motion.div>

      <div className="text-center mt-16">
        <p className="text-gray-500 text-sm">
          Questions about healing? Reach out anytime — better safe than sorry.
        </p>
      </div>
    </section>
  );
}