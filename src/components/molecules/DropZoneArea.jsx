import React, { useState, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const DropZoneArea = ({ onFilesSelected, allowedTypes, fileInputRef }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragCounter, setDragCounter] = useState(0);

  const handleDragEnter = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragCounter(prev => prev + 1);
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true);
    }
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragCounter(prev => {
      const newCounter = prev - 1;
      if (newCounter === 0) {
        setIsDragging(false);
      }
      return newCounter;
    });
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    setDragCounter(0);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      onFilesSelected(files);
    }
  }, [onFilesSelected]);

  const handleFileInput = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      onFilesSelected(files);
    }
    // Reset input value to allow selecting the same file again
    e.target.value = '';
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const formatAllowedTypes = () => {
    if (allowedTypes.length === 0) return 'All file types';
    return allowedTypes.map(type => `.${type}`).join(', ');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative"
    >
      <input
        ref={fileInputRef}
        type="file"
        multiple
        className="hidden"
        onChange={handleFileInput}
        accept={allowedTypes.length > 0 ? allowedTypes.map(type => `.${type}`).join(',') : '*/*'}
      />
      
      <motion.div
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={openFileDialog}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={`
          relative p-12 rounded-2xl border-2 border-dashed cursor-pointer transition-all duration-200
          ${isDragging 
            ? 'border-primary bg-gradient-to-br from-primary/10 to-secondary/10 scale-105' 
            : 'border-surface-300 hover:border-primary/50 hover:bg-gradient-to-br hover:from-primary/5 hover:to-secondary/5'
          }
        `}
      >
        {/* Background gradient overlay */}
        <div className={`
          absolute inset-0 rounded-2xl transition-opacity duration-200
          ${isDragging 
            ? 'bg-gradient-to-br from-primary/20 to-secondary/20 opacity-100' 
            : 'opacity-0'
          }
        `} />
        
        <div className="relative z-10 text-center space-y-6">
          <motion.div
            animate={isDragging ? { 
              scale: [1, 1.2, 1],
              rotate: [0, 5, -5, 0]
            } : {}}
            transition={{ duration: 0.3 }}
            className="flex justify-center"
          >
            <div className="p-4 bg-gradient-to-br from-primary to-secondary rounded-full">
              <ApperIcon 
                name={isDragging ? "FileUp" : "Upload"} 
                className="w-12 h-12 text-white"
              />
            </div>
          </motion.div>
          
          <div className="space-y-2">
            <h3 className="text-xl font-semibold font-heading text-surface-800">
              {isDragging ? 'Drop files here' : 'Upload your files'}
            </h3>
            <p className="text-surface-600">
              {isDragging 
                ? 'Release to add files to the upload queue'
                : 'Drag and drop files here, or click to browse'
              }
            </p>
          </div>
          
          <div className="space-y-3">
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-white/60 backdrop-blur-sm rounded-full text-sm text-surface-600">
              <ApperIcon name="Info" className="w-4 h-4" />
              <span>Accepted types: {formatAllowedTypes()}</span>
            </div>
            
            <div className="flex items-center justify-center space-x-6 text-sm text-surface-500">
              <div className="flex items-center space-x-1">
                <ApperIcon name="Files" className="w-4 h-4" />
                <span>Multiple files</span>
              </div>
              <div className="flex items-center space-x-1">
                <ApperIcon name="Zap" className="w-4 h-4" />
                <span>Real-time progress</span>
              </div>
              <div className="flex items-center space-x-1">
                <ApperIcon name="Eye" className="w-4 h-4" />
                <span>Image previews</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Animated border for drag state */}
        <motion.div
          className={`
            absolute inset-0 rounded-2xl pointer-events-none
            ${isDragging ? 'border-2 border-primary' : 'border-2 border-transparent'}
          `}
          animate={isDragging ? {
            borderColor: ['#6366f1', '#8b5cf6', '#6366f1']
          } : {}}
          transition={{ duration: 1, repeat: Infinity }}
        />
      </motion.div>
    </motion.div>
  );
};

export default DropZoneArea;