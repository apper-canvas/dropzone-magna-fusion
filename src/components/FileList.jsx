import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from './ApperIcon';

const FileList = ({ files, onRemoveFile, onPreviewFile }) => {
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return 'Clock';
      case 'uploading': return 'Upload';
      case 'completed': return 'CheckCircle2';
      case 'error': return 'AlertCircle';
      default: return 'File';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'text-surface-500';
      case 'uploading': return 'text-primary';
      case 'completed': return 'text-green-500';
      case 'error': return 'text-red-500';
      default: return 'text-surface-500';
    }
  };

  const getFileTypeIcon = (type) => {
    if (type.startsWith('image/')) return 'Image';
    if (type.startsWith('video/')) return 'Video';
    if (type.startsWith('audio/')) return 'Music';
    if (type.includes('pdf')) return 'FileText';
    if (type.includes('word') || type.includes('document')) return 'FileText';
    if (type.includes('sheet') || type.includes('excel')) return 'FileSpreadsheet';
    return 'File';
  };

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
                        name={getFileTypeIcon(file.type)} 
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
                        name={getStatusIcon(file.status)} 
                        className={`w-4 h-4 ${getStatusColor(file.status)}`}
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
                      <div className="w-full bg-surface-200 rounded-full h-2 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${file.progress}%` }}
                          transition={{ duration: 0.3 }}
                          className="h-full bg-gradient-to-r from-primary to-secondary rounded-full relative"
                        >
                          {file.status === 'uploading' && (
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent shimmer rounded-full"></div>
                          )}
                        </motion.div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
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