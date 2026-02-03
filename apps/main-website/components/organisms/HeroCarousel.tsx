'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

const SLIDES = [
  {
    desktopBg: '/images/background.jpg',
    mobileBg: '/images/slider-image-1.jpg',
    title: 'جامعہ عربیہ اسلامیہ',
    subtitle: 'اسکاؤٹ کالونی',
  },
  {
    desktopBg: '/images/background.jpg',
    mobileBg: '/images/slider-image-3.jpg',
    title: 'جامعہ عربیہ اسلامیہ',
    subtitle: 'اسکاؤٹ کالونی',
  },
  {
    desktopBg: '/images/background.jpg',
    mobileBg: '/images/slider-image-4.jpg',
    title: 'جامعہ عربیہ اسلامیہ',
    subtitle: 'اسکاؤٹ کالونی',
  },
];

export function HeroCarousel() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % SLIDES.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const slide = SLIDES[index];

  return (
    <section className="relative hidden h-[70vh] min-h-[400px] md:block">
      <div className="absolute inset-0 bg-black/40" />
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0"
        >
          <Image
            src={slide.desktopBg}
            alt=""
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        </motion.div>
      </AnimatePresence>
      <div className="absolute inset-0 flex items-end justify-center pb-12 md:pb-24">
        <div className="urdutext text-center text-white">
          <p className="animate-pulse text-4xl md:text-5xl">{slide.title}</p>
          <p className="mt-1 text-xl text-amber-200">{slide.subtitle}</p>
        </div>
      </div>
      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setIndex(i)}
            className={`h-2 w-2 rounded-full transition-colors ${
              i === index ? 'bg-white' : 'bg-white/50'
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}

/* Mobile hero: single image with Urdu text */
export function HeroMobile() {
  return (
    <section className="relative block h-[70vh] min-h-[350px] md:hidden">
      <div className="absolute inset-0 bg-black/30" />
      <Image
        src="/images/slider-image-1.jpg"
        alt="Jamia Arabia Islamia"
        fill
        className="object-cover"
        priority
        sizes="100vw"
      />
      <div className="urdutext absolute inset-0 flex items-end justify-center pb-16">
        <div className="bg-black/40 px-6 py-4 text-center text-white">
          <p className="text-3xl">جامعہ عربیہ اسلامیہ</p>
          <p className="mt-1 text-xl text-amber-400">اسکاٹ کالونی</p>
        </div>
      </div>
    </section>
  );
}
