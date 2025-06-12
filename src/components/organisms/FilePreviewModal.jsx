import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import { formatFileSize } from '@/utils/fileUtils';

const FilePreviewModal = ({ file, onClose }) => {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [onClose]);

  const isImage = file.type.startsWith('image/');

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
      >
        <div 
          className="glass rounded-2xl max-w-4xl max-h-[90vh] w-full overflow-hidden pointer-events-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/20">
            <div className="flex items-center space-x-4 min-w-0">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center flex-shrink-0">
                <ApperIcon name="Eye" className="w-5 h-5 text-white" />
              </div>
              <div className="min-w-0">
                <h3 className="text-lg font-semibold font-heading text-surface-800 truncate">
                  {file.name}
                </h3>
                <p className="text-sm text-surface-600">
                  {formatFileSize(file.size)} • {file.type}
                </p>
              </div>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-full text-surface-600 hover:text-surface-800 transition-all"
            >
              <ApperIcon name="X" className="w-5 h-5" />
            </motion.button>
          </div>

          {/* Content */}
          <div className="p-6 max-h-[calc(90vh-120px)] overflow-y-auto">
            {isImage && file.thumbnail ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center"
              >
                <img
                  src={file.thumbnail}
                  alt={file.name}
                  className="max-w-full max-h-[60vh] mx-auto rounded-lg shadow-lg"
                />
                <p className="text-sm text-surface-600 mt-4">
                  Click and drag to pan • Scroll to zoom
                </p>
              </motion.div>
            ) : (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gradient-to-br from-surface-100 to-surface-200 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <ApperIcon name="File" className="w-12 h-12 text-surface-600" />
                </div>
                <h4 className="text-xl font-semibold text-surface-800 mb-2">
                  Preview not available
                </h4>
                <p className="text-surface-600 max-w-md mx-auto">
                  This file type cannot be previewed in the browser. The file is ready for upload.
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-6 border-t border-white/20 bg-white/20">
            <div className="flex items-center space-x-3">
              <div className={`w-3 h-3 rounded-full ${
                file.status === 'completed' ? 'bg-green-500' :
                file.status === 'uploading' ? 'bg-primary animate-pulse' :
                file.status === 'error' ? 'bg-red-500' :
                'bg-surface-400'
              }`}></div>
              <span className="text-sm text-surface-600 capitalize">
                {file.status === 'completed' ? 'Upload completed' :
                 file.status === 'uploading' ? `Uploading... ${file.progress}%` :
                 file.status === 'error' ? 'Upload failed' :
                 'Ready for upload'}
              </span>
            </div>
            
            <div className="text-sm text-surface-600">
              {file.uploadedAt && `Added ${file.uploadedAt.toLocaleTimeString()}`}
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default FilePreviewModal;