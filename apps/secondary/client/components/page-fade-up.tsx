'use client';

import { motion } from 'framer-motion';
import { fadeInUp, defaultTransition } from '@arabiaaislamia/animations';

interface PageFadeUpProps {
  children: React.ReactNode;
  className?: string;
}

export function PageFadeUp({ children, className = '' }: PageFadeUpProps) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeInUp}
      transition={defaultTransition}
      className={className}
    >
      {children}
    </motion.div>
  );
}
