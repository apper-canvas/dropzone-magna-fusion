import React from 'react';
import { motion } from 'framer-motion';
import Button from '@/components/atoms/Button';

const FileTypeFilter = ({ allowedTypes, setAllowedTypes }) => {
  const typeFilters = [
    { label: 'All Files', value: [] },
    { label: 'Images', value: ['jpg', 'jpeg', 'png', 'gif', 'webp'] },
    { label: 'Documents', value: ['pdf', 'doc', 'docx', 'txt'] },
    { label: 'Media', value: ['mp4', 'mp3', 'avi', 'mov'] },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="mb-6"
    >
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-sm font-medium text-surface-700">Filter by type:</span>
        {typeFilters.map((filter, index) => (
          <Button
            key={index}
            onClick={() => setAllowedTypes(filter.value)}
            className={`px-4 py-2 rounded-full text-sm font-medium ${
              JSON.stringify(allowedTypes) === JSON.stringify(filter.value)
                ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-md'
                : 'bg-white/60 text-surface-700 hover:bg-white/80'
            }`}
          >
            {filter.label}
          </Button>
        ))}
      </div>
    </motion.div>
  );
};

export default FileTypeFilter;