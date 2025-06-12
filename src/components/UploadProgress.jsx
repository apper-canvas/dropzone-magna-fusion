import { motion } from 'framer-motion';
import ApperIcon from './ApperIcon';

const UploadProgress = ({ session }) => {
  const getProgressPercentage = () => {
    if (session.totalSize === 0) return 0;
    return Math.round((session.uploadedSize / session.totalSize) * 100);
  };

  const getUploadSpeed = () => {
    const elapsed = (new Date() - session.startTime) / 1000; // seconds
    if (elapsed === 0) return 0;
    return session.uploadedSize / elapsed; // bytes per second
  };

  const formatSpeed = (bytesPerSecond) => {
    if (bytesPerSecond === 0) return '0 B/s';
    const k = 1024;
    const sizes = ['B/s', 'KB/s', 'MB/s', 'GB/s'];
    const i = Math.floor(Math.log(bytesPerSecond) / Math.log(k));
    return parseFloat((bytesPerSecond / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const getEstimatedTime = () => {
    const speed = getUploadSpeed();
    if (speed === 0) return 'Calculating...';
    
    const remainingBytes = session.totalSize - session.uploadedSize;
    const remainingSeconds = remainingBytes / speed;
    
    if (remainingSeconds < 60) {
      return `${Math.ceil(remainingSeconds)}s remaining`;
    } else if (remainingSeconds < 3600) {
      return `${Math.ceil(remainingSeconds / 60)}m remaining`;
    } else {
      return `${Math.ceil(remainingSeconds / 3600)}h remaining`;
    }
  };

  const getStatusIcon = () => {
    switch (session.status) {
      case 'uploading': return 'Upload';
      case 'completed': return 'CheckCircle2';
      case 'error': return 'AlertCircle';
      default: return 'Clock';
    }
  };

  const getStatusColor = () => {
    switch (session.status) {
      case 'uploading': return 'text-primary';
      case 'completed': return 'text-green-500';
      case 'error': return 'text-red-500';
      default: return 'text-surface-500';
    }
  };

  const progressPercentage = getProgressPercentage();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-2xl p-6 backdrop-blur-md"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-full ${session.status === 'completed' ? 'bg-green-100' : session.status === 'error' ? 'bg-red-100' : 'bg-blue-100'}`}>
            <ApperIcon 
              name={getStatusIcon()} 
              className={`w-5 h-5 ${getStatusColor()}`}
            />
          </div>
          <div>
            <h3 className="text-lg font-semibold font-heading text-surface-800">
              Upload Progress
            </h3>
            <p className="text-sm text-surface-600 capitalize">
              {session.status === 'uploading' ? 'Uploading files...' : 
               session.status === 'completed' ? 'Upload completed!' :
               session.status === 'error' ? 'Upload failed' : 'Preparing...'}
            </p>
          </div>
        </div>
        
        <div className="text-right">
          <div className="text-2xl font-bold gradient-text">
            {progressPercentage}%
          </div>
          <div className="text-xs text-surface-600">
            {session.completedFiles} of {session.totalFiles} files
          </div>
        </div>
      </div>

      {/* Main Progress Bar */}
      <div className="mb-4">
        <div className="w-full bg-surface-200 rounded-full h-3 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 0.5 }}
            className="h-full bg-gradient-to-r from-primary via-secondary to-accent rounded-full relative"
          >
            {session.status === 'uploading' && (
              <motion.div
                animate={{ x: ['-100%', '100%'] }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity, 
                  ease: 'linear' 
                }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                style={{ width: '100px' }}
              />
            )}
          </motion.div>
        </div>
      </div>

      {/* Upload Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
        <div className="text-center p-3 bg-white/40 rounded-lg">
          <div className="font-semibold text-surface-800">
            {formatFileSize(session.uploadedSize)}
          </div>
          <div className="text-surface-600">of {formatFileSize(session.totalSize)}</div>
        </div>
        
        <div className="text-center p-3 bg-white/40 rounded-lg">
          <div className="font-semibold text-surface-800">
            {formatSpeed(getUploadSpeed())}
          </div>
          <div className="text-surface-600">Upload speed</div>
        </div>
        
        <div className="text-center p-3 bg-white/40 rounded-lg">
          <div className="font-semibold text-surface-800">
            {session.status === 'uploading' ? getEstimatedTime() : 
             session.status === 'completed' ? 'Complete' : 'Stopped'}
          </div>
          <div className="text-surface-600">Time remaining</div>
        </div>
        
        <div className="text-center p-3 bg-white/40 rounded-lg">
          <div className="font-semibold text-surface-800">
            {session.completedFiles}/{session.totalFiles}
          </div>
          <div className="text-surface-600">Files done</div>
        </div>
      </div>

      {/* Completion Animation */}
      {session.status === 'completed' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-4 text-center"
        >
          <motion.div
            animate={{ 
              rotate: [0, 360],
              scale: [1, 1.2, 1]
            }}
            transition={{ 
              duration: 1,
              ease: "easeInOut"
            }}
            className="inline-block"
          >
            🎉
          </motion.div>
          <p className="text-green-600 font-medium mt-2">
            All files uploaded successfully!
          </p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default UploadProgress;