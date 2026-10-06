'use client';

import { ReactNode } from 'react';
import { motion, MotionConfig } from 'framer-motion';

export default function Template({ children }: { children: ReactNode }) {
  // reducedMotion='user' turns transform animations off when the OS asks for
  // reduced motion, while keeping server and client props identical.
  return (
    <MotionConfig reducedMotion='user'>
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ ease: 'easeInOut', duration: 1 }}
      >
        {children}
      </motion.div>
    </MotionConfig>
  );
}
