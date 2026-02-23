'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';

const FACULTIES_DATA = [
  {
    heading: 'Tahfeez ul Quran Faculty',
    id: 'tahfeez-ul-quran-faculty',
    paragraphs: [
      'Immerse yourself in the sacred realm of Quranic memorization and recitation through our Tahfeez ul Quran faculty. Here, students embark on a deeply meaningful journey, where they wholeheartedly commit to etching the divine verses into their hearts and minds, ensuring the eternal preservation of this sacred knowledge.',
      'In this faculty, students don\'t merely learn about the Quran; they embrace a profound and transformative experience. They are guided by experienced instructors who understand the significance of preserving the divine word. Through rigorous study and heartfelt dedication, students not only memorize the Quran but also gain a profound understanding of its meanings, enabling them to carry the wisdom and guidance of this holy scripture throughout their lives.',
      "This journey of Tahfeez ul Quran is not just an educational pursuit; it's a spiritual and intellectual commitment to honor and safeguard the Quran's teachings. Students in this faculty become the custodians of this divine message, passing it on to future generations and ensuring that its light continues to shine brightly in the hearts of believers.",
    ],
    imageFirst: true,
  },
  {
    heading: 'Darse Nizami Faculty',
    id: 'darse-nizami-faculty',
    paragraphs: [
      'Embark on a profound journey of Islamic scholarship with our Darse Nizami faculty, where the timeless traditions of our faith seamlessly integrate with the demands of the modern world. In this faculty, students are immersed in a comprehensive study that delves deep into the intricate realms of Islamic theology, jurisprudence, and spirituality.',
      'Our Darse Nizami program offers a unique blend of classical wisdom and contemporary relevance. Here, students engage with the fundamental principles and intricate nuances of Islamic knowledge. They explore the rich tapestry of Islamic thought, learning to critically analyze and understand the theological aspects of their faith.',
      "Moreover, this faculty doesn't just teach theoretical knowledge; it fosters a profound sense of spirituality. Students not only acquire the academic expertise to navigate complex Islamic jurisprudence but also develop a deep connection with their faith. The curriculum encourages them to reflect on the moral and ethical dimensions of their beliefs, empowering them to be not just scholars but compassionate leaders and spiritual guides.",
    ],
    imageFirst: false,
  },
  {
    heading: 'Mahad ul Lugha tul Arabia Faculty',
    id: 'mahad-ul-lugha-tul-arabia-faculty',
    paragraphs: [
      'Mahad ul Arabia, often referred to simply as Mahad is an institution that plays a significant role in promoting the study of the Arabic language and Islamic sciences. It is typically a seminary or educational center where students, primarily from the Islamic world, come to acquire advanced knowledge in Arabic language, literature, and various aspects of Islamic studies.',
      'Mahad ul Arabia is known for its rigorous Arabic language programs. Students in Mahad engage in in-depth language courses that not only cover the fundamentals of Arabic but also delve into its literature, grammar, and linguistics. This comprehensive approach to Arabic language education is particularly valuable for understanding and interpreting Islamic texts.',
    ],
    imageFirst: true,
  },
  {
    heading: 'Schooling System',
    id: 'schooling-system-faculty',
    paragraphs: [
      'Unearth a dynamic and all-encompassing educational approach within our Schooling System faculty, tailored to cultivate the young minds of today. Our curriculum is a carefully crafted blend of secular and Islamic studies, meticulously designed to mold well-rounded individuals, poised to confidently embrace the challenges and opportunities that the future holds.',
      'In our Schooling System, education goes beyond traditional boundaries. We prioritize innovation, not just in our teaching methods but also in the curriculum itself. Students benefit from a well-balanced education that not only equips them with the knowledge and skills needed to excel in contemporary fields but also nurtures their spiritual and moral development through the study of Islamic values.',
      'Our faculty provides a unique opportunity for students to explore a harmonious synergy between worldly knowledge and spiritual growth. They are encouraged to think critically, solve problems, and engage with the broader world, all while retaining a deep-rooted connection to their faith.',
    ],
    imageFirst: false,
  },
];

export default function FacultiesPage() {
  return (
    <>
      <section className="section-about-hero flex min-h-[60vh] flex-col items-center justify-center px-4 text-center text-white">
        <motion.div
          className="max-w-4xl space-y-4 lg:block"
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className=" text-2xl font-bold md:text-4xl lg:text-6xl">
            Our Faculties
          </h1>
          <p className="text-base md:text-lg">
            Our faculties are dedicated to providing a comprehensive education that is both academically rigorous and spiritually enriching.
          </p>
        </motion.div>
      </section>

      <section className="mx-auto max-w-6xl space-y-24 px-4 py-16 lg:px-16 lg:py-24">
        {FACULTIES_DATA.map((faculty, index) => (
          <motion.article
            key={faculty.id}
            className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            id={faculty.id}
          >
            <div
              className={
                faculty.imageFirst ? 'order-2 lg:order-1' : 'order-2 lg:order-2'
              }
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl">
                <Image
                  src="/images/GridImage.png"
                  alt={faculty.heading}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            </div>
            <div
              className={
                faculty.imageFirst ? 'order-1 lg:order-2' : 'order-1 lg:order-1'
              }
            >
              <h2 className="text-2xl font-bold text-foreground lg:text-3xl">
                {faculty.heading}
              </h2>
              <div className="mt-6 space-y-4">
                {faculty.paragraphs.map((p, i) => (
                  <p key={i} className="text-muted-foreground">
                    {p}
                  </p>
                ))}
              </div>
            </div>
          </motion.article>
        ))}
      </section>
    </>
  );
}
