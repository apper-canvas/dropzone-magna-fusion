import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import ProgressBar from '@/components/atoms/ProgressBar';
import { formatFileSize, getStatusIconName, getStatusColorClass, getFileTypeIconName } from '@/utils/fileUtils';

const FileItem = ({ file, onRemoveFile, onPreviewFile, index }) => {
  return (
    <motion.div
      key={file.id}
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ 
        delay: index * 0.05,
        duration: 0.2 
      }}
      layout
      className="group bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:bg-white/80 transition-all"
    >
      <div className="flex items-center space-x-4">
        {/* File thumbnail or icon */}
        <div className="flex-shrink-0">
          {file.thumbnail ? (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onPreviewFile(file)}
              className="relative w-12 h-12 rounded-lg overflow-hidden border-2 border-white shadow-sm hover:shadow-md transition-all"
            >
              <img
                src={file.thumbnail}
                alt={file.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                <ApperIcon name="ZoomIn" className="w-4 h-4 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </motion.button>
          ) : (
            <div className="w-12 h-12 bg-gradient-to-br from-surface-100 to-surface-200 rounded-lg flex items-center justify-center">
              <ApperIcon 
                name={getFileTypeIconName(file.type)} 
                className="w-6 h-6 text-surface-600"
              />
            </div>
          )}
        </div>
        
        {/* File info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <p className="text-sm font-medium text-surface-800 truncate pr-2">
              {file.name}
            </p>
            <div className="flex items-center space-x-2">
              <ApperIcon 
                name={getStatusIconName(file.status)} 
                className={`w-4 h-4 ${getStatusColorClass(file.status)}`}
              />
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => onRemoveFile(file.id)}
                className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-100 rounded-full text-red-500 hover:text-red-600 transition-all"
                disabled={file.status === 'uploading'}
              >
                <ApperIcon name="X" className="w-4 h-4" />
              </motion.button>
            </div>
          </div>
          
          <div className="flex items-center justify-between text-xs text-surface-600">
            <span>{formatFileSize(file.size)}</span>
            <span className="capitalize">{file.status}</span>
          </div>
          
          {/* Progress bar */}
          {(file.status === 'uploading' || file.status === 'completed') && (
            <div className="mt-2">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-surface-600">
                  {file.status === 'uploading' ? 'Uploading...' : 'Completed'}
                </span>
                <span className="font-medium text-surface-700">
                  {file.progress}%
                </span>
              </div>
              <ProgressBar progress={file.progress} status={file.status} />
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default FileItem;