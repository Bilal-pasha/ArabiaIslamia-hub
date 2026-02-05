'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface StatCardProps {
  value: number;
  label: string;
  className?: string;
}

export function StatCard({ value, label, className }: StatCardProps) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (!started) return;
    const step = Math.ceil(value / 60);
    const interval = setInterval(() => {
      setCount((prev) => {
        if (prev >= value) {
          clearInterval(interval);
          return value;
        }
        return Math.min(prev + step, value);
      });
    }, 20);
    return () => clearInterval(interval);
  }, [value, started]);

  return (
    <motion.div
      className={cn(
        'flex flex-col items-center justify-center rounded-lg border border-border bg-white/40 px-6 py-6 shadow-lg backdrop-blur-sm',
        className
      )}
      onViewportEnter={() => setStarted(true)}
      viewport={{ once: true }}
    >
      <span className="text-3xl font-bold text-foreground md:text-4xl lg:text-5xl">
        {count}
      </span>
      <span className="mt-1 text-sm font-medium text-muted-foreground">{label}</span>
    </motion.div>
  );
}
