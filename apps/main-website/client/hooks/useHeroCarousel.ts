'use client';

import { useState, useEffect, useMemo } from 'react';

const DEFAULT_SLIDES = [
  { desktopBg: '/images/background.jpg', mobileBg: '/images/slider-image-1.jpg', title: 'جامعہ عربیہ اسلامیہ', subtitle: 'اسکاؤٹ کالونی' },
  { desktopBg: '/images/background.jpg', mobileBg: '/images/slider-image-3.jpg', title: 'جامعہ عربیہ اسلامیہ', subtitle: 'اسکاؤٹ کالونی' },
  { desktopBg: '/images/background.jpg', mobileBg: '/images/slider-image-4.jpg', title: 'جامعہ عربیہ اسلامیہ', subtitle: 'اسکاؤٹ کالونی' },
];

export type HeroSlideItem = {
  desktopBg: string;
  mobileBg: string;
  title: string;
  subtitle: string;
};

/** Map API hero slide format to carousel format */
export function mapApiSlidesToCarousel(
  apiSlides: Array<{ desktopImageUrl: string; mobileImageUrl: string; title: string; subtitle: string }>,
): HeroSlideItem[] {
  if (!apiSlides?.length) return DEFAULT_SLIDES;
  return apiSlides.map((s) => ({
    desktopBg: s.desktopImageUrl,
    mobileBg: s.mobileImageUrl,
    title: s.title ?? '',
    subtitle: s.subtitle ?? '',
  }));
}

export function useHeroCarousel(apiSlides?: HeroSlideItem[] | null) {
  const slides = useMemo(
    () => (apiSlides && apiSlides.length > 0 ? apiSlides : DEFAULT_SLIDES),
    [apiSlides],
  );
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => setIndex((prev) => (prev + 1) % slides.length), 5000);
    return () => clearInterval(interval);
  }, [slides.length]);
  return { index, setIndex, slide: slides[index], slides };
}
