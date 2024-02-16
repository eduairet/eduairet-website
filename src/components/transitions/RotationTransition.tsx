'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface IProps {
  children: ReactNode;
}

export default function RotationTransition({ children }: IProps) {
  return (
    <motion.div
      initial={{ opacity: 0, rotate: 0 }}
      animate={{ opacity: 1, rotate: 360 }}
      transition={{ duration: 2 }}
    >
      {children}
    </motion.div>
  );
}
