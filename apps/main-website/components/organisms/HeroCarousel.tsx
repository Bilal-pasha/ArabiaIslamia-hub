'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

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
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const slide = SLIDES[index];

  return (
    <section
      className="relative w-full overflow-hidden"
      style={{
        minHeight: 'clamp(320px, 72vh, 680px)',
        height: 'clamp(320px, 72vh, 680px)',
      }}
    >
      {/* Background images with subtle zoom on change */}
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="absolute inset-0 z-0"
        >
          <Image
            src={slide.desktopBg}
            alt=""
            fill
            className="hidden object-cover object-center md:block"
            priority
            sizes="100vw"
          />
          <Image
            src={slide.mobileBg}
            alt=""
            fill
            className="object-cover object-center md:hidden"
            priority
            sizes="100vw"
          />
        </motion.div>
      </AnimatePresence>

      {/* Gradient overlay: light at top, darker at bottom for text contrast */}
      <div
        className="absolute inset-0 z-[1]"
        style={{
          background:
            'linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.35) 40%, rgba(0,0,0,0.6) 100%)',
        }}
        aria-hidden
      />

      {/* Content: heading at top, buttons at bottom */}
      <div className="absolute inset-0 z-10 flex flex-col justify-between px-4 py-8 sm:px-6 sm:py-10 md:px-8 md:py-12">
        {/* Top: heading */}
        <div className="urdutext mx-auto flex w-full max-w-4xl flex-col items-center gap-4 text-center sm:gap-5 md:gap-6">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-sm font-medium uppercase tracking-[0.2em] text-amber-200/95 sm:text-base"
          >
            Welcome to
          </motion.p>
        </div>
        <div className="flex flex-col flex-wrap items-center justify-center gap-12"
        >
          <motion.p
            key={`title-${index}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="text-3xl font-bold leading-tight text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.4)] min-[400px]:text-4xl sm:text-5xl md:text-6xl lg:text-7xl"
          >
            {slide.title}
          </motion.p>
          <motion.p
            key={`subtitle-${index}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15, duration: 0.5 }}
            className="text-lg text-amber-200/95 drop-shadow-md sm:text-xl md:text-2xl lg:text-3xl"
          >
            {slide.subtitle}
          </motion.p>
        </div>

        {/* Bottom: buttons (centered text) */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.5 }}
          className="mb-14 flex flex-wrap items-center justify-center gap-3 sm:mb-16 sm:gap-4 md:mb-20"
        >
          <Link
            href="/faculties"
            className="flex min-w-[10rem] items-center justify-center rounded-lg bg-amber-500 px-6 py-3 text-center text-sm font-semibold text-amber-950 shadow-lg transition-all hover:bg-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-300 focus:ring-offset-2 focus:ring-offset-black/30 sm:px-8 sm:py-3.5 sm:text-base"
          >
            Explore Faculties
          </Link>
          <Link
            href="/contact"
            className="flex min-w-[10rem] items-center justify-center rounded-lg border-2 border-white/80 bg-white/10 px-6 py-3 text-center text-sm font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black/30 sm:px-8 sm:py-3.5 sm:text-base"
          >
            Contact Us
          </Link>
        </motion.div>
      </div>

      {/* Slide indicators */}
      <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 gap-2 sm:bottom-6 md:bottom-8">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setIndex(i)}
            className={cn(
              'h-2 rounded-full transition-all duration-300 sm:h-2.5',
              i === index
                ? 'w-8 bg-white shadow-lg sm:w-10'
                : 'w-2 bg-white/50 hover:bg-white/80 sm:w-2.5'
            )}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}

/* Kept for backwards compatibility */
export function HeroMobile() {
  return (
    <section
      className="relative block w-full overflow-hidden md:hidden"
      style={{ minHeight: 'clamp(280px, 65vh, 500px)' }}
    >
      <div className="absolute inset-0 z-0 bg-black/30" />
      <Image
        src="/images/slider-image-1.jpg"
        alt="Jamia Arabia Islamia"
        fill
        className="object-cover object-center"
        priority
        sizes="100vw"
      />
      <div className="urdutext absolute inset-0 z-10 flex flex-col items-center justify-end pb-12">
        <div className="w-full max-w-md bg-black/40 px-6 py-4 text-center text-white">
          <p className="text-2xl font-bold sm:text-3xl">جامعہ عربیہ اسلامیہ</p>
          <p className="mt-1 text-lg text-amber-400 sm:text-xl">اسکاٹ کالونی</p>
        </div>
      </div>
    </section>
  );
}
