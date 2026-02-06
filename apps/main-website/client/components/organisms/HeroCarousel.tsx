'use client';

import { useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useHeroCarousel } from '@/hooks/useHeroCarousel';

function HeroSlideImage({ slide }: { slide: { desktopBg: string; mobileBg: string } }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 1.05 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.02 }}
      transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="absolute inset-0 z-0"
    >
      <Image src={slide.desktopBg} alt="" fill className="hidden object-cover object-center md:block" priority sizes="100vw" />
      <Image src={slide.mobileBg} alt="" fill className="object-cover object-center md:hidden" priority sizes="100vw" />
    </motion.div>
  );
}

function HeroCarouselDots({ count, index, onSelect }: { count: number; index: number; onSelect: (i: number) => void }) {
  return (
    <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 gap-2 sm:bottom-6 md:bottom-8">
      {Array.from({ length: count }).map((_, i) => (
        <button
          key={i}
          type="button"
          onClick={() => onSelect(i)}
          className={cn('h-2 rounded-full transition-all duration-300 sm:h-2.5', i === index ? 'w-8 bg-white shadow-lg sm:w-10' : 'w-2 bg-white/50 hover:bg-white/80 sm:w-2.5')}
          aria-label={`Go to slide ${i + 1}`}
        />
      ))}
    </div>
  );
}

interface HeroCarouselProps {
  /** Optional slides from CMS API; when provided, overrides default slides */
  apiSlides?: Array<{ desktopImageUrl: string; mobileImageUrl: string; title: string; subtitle: string }> | null;
}

export function HeroCarousel({ apiSlides }: HeroCarouselProps = {}) {
  const mappedSlides = useMemo(
    () => (apiSlides && apiSlides.length > 0
      ? apiSlides.map((s) => ({
        desktopBg: s.desktopImageUrl,
        mobileBg: s.mobileImageUrl,
        title: s.title ?? '',
        subtitle: s.subtitle ?? '',
      }))
      : null),
    [apiSlides],
  );
  const { index, setIndex, slide, slides } = useHeroCarousel(mappedSlides);
  return (
    <section className="relative w-full overflow-hidden" style={{ minHeight: 'clamp(320px, 72vh, 680px)', height: 'clamp(320px, 72vh, 680px)' }}>
      <AnimatePresence mode="wait">
        <HeroSlideImage key={index} slide={slide} />
      </AnimatePresence>
      <div className="absolute inset-0 z-[1]" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.35) 40%, rgba(0,0,0,0.6) 100%)' }} aria-hidden />
      <div className="absolute inset-0 z-10 flex flex-col justify-between px-4 py-8 sm:px-6 sm:py-10 md:px-8 md:py-12">
        <div className="urdutext mx-auto flex w-full max-w-4xl flex-col items-center gap-4 text-center sm:gap-5 md:gap-6">
          <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.5 }} className="text-sm font-medium uppercase tracking-[0.2em] text-amber-200/95 sm:text-base">Welcome to</motion.p>
        </div>
        <div className="flex flex-1 flex-col items-center justify-center">
          <motion.div
            key={`logo-${index}`}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="relative mx-auto w-full max-w-[min(90vw,28rem)] sm:max-w-[32rem] md:max-w-[36rem]"
            style={{ aspectRatio: 'auto' }}
          >
            <Image
              src="/images/JamiaArabiaLogo.png"
              alt="Jamia Arabia Islamia – اسکاؤٹ کالونی"
              width={576}
              height={240}
              className="h-auto w-full object-contain drop-shadow-[0_2px_20px_rgba(0,0,0,0.5)] [filter:brightness(0)_invert(1)]"
              priority
              sizes="(max-width: 640px) 90vw, (max-width: 768px) 32rem, 36rem"
            />
          </motion.div>
        </div>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35, duration: 0.5 }} className="mb-14 flex flex-wrap items-center justify-center gap-3 sm:mb-16 sm:gap-4 md:mb-20">
          <Link href="/faculties" className="flex min-w-[10rem] items-center justify-center rounded-lg bg-amber-500 px-6 py-3 text-center text-sm font-semibold text-amber-950 shadow-lg transition-all hover:bg-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-300 focus:ring-offset-2 focus:ring-offset-black/30 sm:px-8 sm:py-3.5 sm:text-base">Explore Faculties</Link>
          <Link href="/contact" className="flex min-w-[10rem] items-center justify-center rounded-lg border-2 border-white/80 bg-white/10 px-6 py-3 text-center text-sm font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black/30 sm:px-8 sm:py-3.5 sm:text-base">Contact Us</Link>
        </motion.div>
      </div>
      <HeroCarouselDots count={slides.length} index={index} onSelect={setIndex} />
    </section>
  );
}

export function HeroMobile() {
  return (
    <section className="relative block w-full overflow-hidden md:hidden" style={{ minHeight: 'clamp(280px, 65vh, 500px)' }}>
      <div className="absolute inset-0 z-0 bg-black/30" />
      <Image src="/images/slider-image-1.jpg" alt="Jamia Arabia Islamia" fill className="object-cover object-center" priority sizes="100vw" />
      <div className="urdutext absolute inset-0 z-10 flex flex-col items-center justify-end pb-12">
        <div className="w-full max-w-md bg-black/40 px-6 py-4 text-center text-white">
          <p className="text-2xl font-bold sm:text-3xl">جامعہ عربیہ اسلامیہ</p>
          <p className="mt-1 text-lg text-amber-400 sm:text-xl">اسکاٹ کالونی</p>
        </div>
      </div>
    </section>
  );
}
