import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

interface BlurFadeProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  x?: number;
  y?: number;
}

const BlurFade: React.FC<BlurFadeProps> = ({
  children,
  className,
  delay = 0,
  duration = 0.5,
  x = 0,
  y = 10,
}) => {
  return (
    <motion.div
      initial={{ 
        opacity: 0, 
        filter: 'blur(10px)', 
        y: y, 
        x: x 
      }}
      animate={{ 
        opacity: 1, 
        filter: 'blur(0px)', 
        y: 0, 
        x: 0 
      }}
      transition={{ 
        type: 'spring', 
        stiffness: 100, 
        damping: 20, 
        delay: delay, 
        duration: duration 
      }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
};

export default BlurFade;