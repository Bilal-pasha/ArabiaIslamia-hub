'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { Button } from '@/components/atoms';
import { Card, CardContent, CardFooter } from '@/components/atoms';
import { fadeInUp } from '@arabiaaislamia/animations';

interface NewsCardProps {
  img: string;
  title: string;
  description: string;
  index?: number;
}

export function NewsCard({ img, title, description, index = 0 }: NewsCardProps) {
  return (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
    >
      <Card className="overflow-hidden shadow-lg transition-shadow hover:shadow-xl">
        <div className="relative aspect-[4/3] w-full overflow-hidden">
          <Image
            src={img}
            alt={title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          />
        </div>
        <CardContent className="space-y-2 p-4 text-center">
          <h3 className="font-semibold text-card-foreground">{title}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
        </CardContent>
        <CardFooter className="justify-center pb-4 pt-0">
          <Button variant="outline" size="sm">
            View all News
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
