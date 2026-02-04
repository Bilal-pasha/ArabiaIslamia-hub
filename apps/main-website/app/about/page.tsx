'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/atoms';
import { NewsSection } from '@/components/organisms';
import { SEO_DEFAULTS } from '@/constants/seo';

const ABOUT_DATA = {
  intro: `Who we are | ${SEO_DEFAULTS.siteName}`,
  heading: `${SEO_DEFAULTS.siteName}`,
  paragraphs: [
    'Our mission is to kindle the flames of enlightenment and empower the upcoming generation of scholars, leaders, and visionaries. We are steadfast in our dedication to offering exceptional education in the fields of Islamic studies and the Arabic language. However, to sustain and expand our significant influence, we rely on your support.',
    "By supporting us, you're playing an instrumental role in shaping the future by providing opportunities for eager minds to grow into knowledgeable scholars, compassionate leaders, and forward-thinking visionaries. We firmly believe in the transformative power of education, particularly in the fields of Islamic studies and Arabic language, and our unwavering commitment is a testament to this belief.",
    "Your support allows us to continue delivering a world-class education that not only fosters a deep understanding of our rich Islamic heritage but also equips students with the skills and knowledge to excel in a rapidly changing global landscape. Together, we can ensure that this mission of enlightenment endures and flourishes, leaving an indelible mark on the world for generations to come. Your contribution isn't just a donation; it's an investment in a brighter, more enlightened future.",
  ],
};

export default function AboutPage() {
  return (
    <>
      <section className="section-about-hero flex min-h-[60vh] flex-col items-center justify-center px-4 text-center text-white">
        <motion.div
          className="max-w-4xl space-y-4 lg:block"
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="font-[Roboto] text-2xl font-bold md:text-4xl lg:text-6xl">
            Experience learning in a modern, comfortable environment
          </h1>
          <p className="text-base md:text-lg">
            Discover the infinite possibilities that await you – because at
            Islamic Arabic University, education transcends the ordinary and
            leads to an extraordinary future. Start your journey today!
          </p>
        </motion.div>
      </section>

      <motion.section
        className="grid items-center gap-12 bg-white px-4 py-12 lg:grid-cols-2 lg:gap-16 lg:px-32 lg:py-20"
        initial={{ opacity: 0, x: -24 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl">
          <Image
            src="/images/GridImage.png"
            alt="Jamia Arabia Islamia"
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </div>
        <div className="flex flex-col gap-4">
          <p className="text-sm font-semibold text-muted-foreground lg:text-base">
            {ABOUT_DATA.intro}
          </p>
          <h2 className="text-2xl font-bold text-foreground lg:text-3xl">
            {ABOUT_DATA.heading}
          </h2>
          {ABOUT_DATA.paragraphs.map((p, i) => (
            <p key={i} className="text-foreground/90">
              {p}
            </p>
          ))}
          <Button asChild className="mt-4 w-fit">
            <Link href="/contact">Get in Touch</Link>
          </Button>
        </div>
      </motion.section>

      <section className="relative h-[400px] w-full">
        <iframe
          title="Jamia Arabia Islamia location"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d399.4739824816341!2d67.10218866183166!3d24.940211955449435!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3eb339eebe5eee29%3A0x6424e2502692d1ba!2sJamia%20Arabia%20islamia%20scout%20colony!5e0!3m2!1sen!2s!4v1699342216478!5m2!1sen!2s"
          width="100%"
          height="100%"
          style={{ border: 0, filter: 'grayscale(1)' }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="absolute inset-0"
        />
      </section>

      <NewsSection />
    </>
  );
}
