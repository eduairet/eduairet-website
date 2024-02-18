'use client';

import { ReactNode, memo } from 'react';
import { motion } from 'framer-motion';

interface IProps {
  children: ReactNode;
}

function FadeTransition({ children }: IProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 2 }}
    >
      {children}
    </motion.div>
  );
}

export default memo(FadeTransition);
