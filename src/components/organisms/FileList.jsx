import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import FileItem from '@/components/molecules/FileItem';

const FileList = ({ files, onRemoveFile, onPreviewFile }) => {
  return (
    <div className="glass rounded-2xl p-6 backdrop-blur-md">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold font-heading text-surface-800">
          Upload Queue
        </h3>
        <span className="text-sm text-surface-600">
          {files.length} file{files.length !== 1 ? 's' : ''}
        </span>
      </div>
      
      <div className="space-y-3 max-h-96 overflow-y-auto">
        <AnimatePresence mode="popLayout">
          {files.map((file, index) => (
            <FileItem
              key={file.id}
              file={file}
              onRemoveFile={onRemoveFile}
              onPreviewFile={onPreviewFile}
              index={index}
            />
          ))}
        </AnimatePresence>
        
        {files.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-8 text-surface-500"
          >
            <ApperIcon name="Files" className="w-8 h-8 mx-auto mb-3 opacity-50" />
            <p>No files in queue</p>
            <p className="text-xs mt-1">Add files using the drop zone above</p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default FileList;