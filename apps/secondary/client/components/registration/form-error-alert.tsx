'use client';

import { motion } from 'framer-motion';

interface FormErrorAlertProps {
  message: string;
}

export function FormErrorAlert({ message }: FormErrorAlertProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="mb-6 rounded-lg border border-red-400/50 bg-red-500/10 px-4 py-3 text-sm text-red-200"
    >
      {message}
    </motion.div>
  );
}
