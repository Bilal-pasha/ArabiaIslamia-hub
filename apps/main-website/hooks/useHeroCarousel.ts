'use client';

import { useState, useEffect } from 'react';

const SLIDES = [
  { desktopBg: '/images/background.jpg', mobileBg: '/images/slider-image-1.jpg', title: 'جامعہ عربیہ اسلامیہ', subtitle: 'اسکاؤٹ کالونی' },
  { desktopBg: '/images/background.jpg', mobileBg: '/images/slider-image-3.jpg', title: 'جامعہ عربیہ اسلامیہ', subtitle: 'اسکاؤٹ کالونی' },
  { desktopBg: '/images/background.jpg', mobileBg: '/images/slider-image-4.jpg', title: 'جامعہ عربیہ اسلامیہ', subtitle: 'اسکاؤٹ کالونی' },
];

export function useHeroCarousel() {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => setIndex((prev) => (prev + 1) % SLIDES.length), 5000);
    return () => clearInterval(interval);
  }, []);
  return { index, setIndex, slide: SLIDES[index], slides: SLIDES };
}
