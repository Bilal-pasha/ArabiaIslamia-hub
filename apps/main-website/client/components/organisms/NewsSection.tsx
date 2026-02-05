'use client';

import { motion } from 'framer-motion';
import { NewsCard } from '@/client/components/molecules';

const POSTS = [
  {
    img: '/images/NewsImage.png',
    title: 'Siri brings hands-free',
    desc: "Siri's latest trick is offering a hands-free TV viewing experience, that will allow consumers",
  },
  {
    img: '/images/NewsImage.png',
    title: 'More Comfort',
    desc: "Siri's latest trick is offering a hands-free TV viewing experience, that will allow consumers",
  },
  {
    img: '/images/NewsImage.png',
    title: 'Train Your Brain',
    desc: "Siri's latest trick is offering a hands-free TV viewing experience, that will allow consumers",
  },
  {
    img: '/images/NewsImage.png',
    title: 'Grow Your Business',
    desc: "Siri's latest trick is offering a hands-free TV viewing experience, that will allow consumers",
  },
];

export function NewsSection() {
  return (
    <section className="px-4 py-8 lg:container lg:mx-auto lg:py-28">
      <div className="mb-10 space-y-4 text-center lg:mb-20">
        <h2 className="font-[Poppins] text-4xl font-bold text-foreground lg:text-5xl">
          Latest news
        </h2>
        <blockquote className="text-xl italic text-slate-700 lg:text-2xl">
          Welcome to a world where tradition meets innovation, and faith meets
          knowledge. At{' '}
          <span className="bg-amber-500 px-1 py-0.5 text-white">
            Jamia Arabia Islamia
          </span>
          , we are not just an institution; we are a timeless journey of
          discovery, enlightenment, and transformation.
        </blockquote>
      </div>
      <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
        {POSTS.map((post, i) => (
          <NewsCard
            key={post.title}
            img={post.img}
            title={post.title}
            description={post.desc}
            index={i}
          />
        ))}
      </div>
    </section>
  );
}
