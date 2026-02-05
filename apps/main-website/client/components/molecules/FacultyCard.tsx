'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Button } from '@/client/components/atoms';
import { Card, CardContent, CardFooter } from '@/client/components/atoms';
import { cn } from '@/lib/utils';

interface FacultyCardProps {
  title: string;
  description: string;
  btnLabel?: string;
  href?: string;
  className?: string;
}

export function FacultyCard({
  title,
  description,
  btnLabel = 'Learn more',
  href = '/faculties',
  className,
}: FacultyCardProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -24 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={cn('w-full', className)}
    >
      <Card className="h-full border-border bg-card shadow-lg transition-shadow hover:shadow-xl">
        <CardContent className="flex flex-1 flex-col gap-3 pt-6">
          <h3 className="text-lg font-semibold text-card-foreground">{title}</h3>
          <p className="flex-1 text-sm text-muted-foreground">{description}</p>
        </CardContent>
        <CardFooter className="pt-0">
          <Button variant="outline" size="sm" asChild>
            <Link href={href}>{btnLabel}</Link>
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
