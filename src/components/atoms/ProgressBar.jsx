import React from 'react';
import { motion } from 'framer-motion';

const ProgressBar = ({ progress, status }) => {
  const gradientClass = status === 'error' ? 'bg-red-500' : 'bg-gradient-to-r from-primary via-secondary to-accent';

  return (
    <div className="w-full bg-surface-200 rounded-full h-2 overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.3 }}
        className={`h-full ${gradientClass} rounded-full relative`}
      >
        {status === 'uploading' && (
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent shimmer rounded-full"></div>
        )}
      </motion.div>
    </div>
  );
};

export default ProgressBar;