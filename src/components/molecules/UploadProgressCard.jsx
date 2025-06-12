import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import ProgressBar from '@/components/atoms/ProgressBar';
import { formatFileSize, formatSpeed, getEstimatedTime, getStatusIconName, getStatusColorClass } from '@/utils/fileUtils';

const UploadProgressCard = ({ session }) => {
  const getProgressPercentage = () => {
    if (session.totalSize === 0) return 0;
    return Math.round((session.uploadedSize / session.totalSize) * 100);
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
              name={getStatusIconName(session.status)} 
              className={`w-5 h-5 ${getStatusColorClass(session.status)}`}
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
        <ProgressBar progress={progressPercentage} status={session.status} />
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
            {formatSpeed(session.uploadedSize / ((new Date() - session.startTime) / 1000 || 1))}
          </div>
          <div className="text-surface-600">Upload speed</div>
        </div>
        
        <div className="text-center p-3 bg-white/40 rounded-lg">
          <div className="font-semibold text-surface-800">
            {session.status === 'uploading' ? getEstimatedTime(session.totalSize, session.uploadedSize, session.startTime) : 
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

export default UploadProgressCard;