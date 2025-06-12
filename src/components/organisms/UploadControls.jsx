import React from 'react';
import Button from '@/components/atoms/Button';

const UploadControls = ({ files, uploadSession, startUpload, clearCompleted, resetAll }) => {
  const hasPendingFiles = files.some(f => f.status === 'pending');
  const hasCompletedFiles = files.some(f => f.status === 'completed');
  const isUploading = uploadSession?.status === 'uploading';

  return (
    <div className="flex flex-wrap gap-3">
      <Button
        onClick={startUpload}
        disabled={!hasPendingFiles || isUploading}
        className="flex-1 min-w-[120px] bg-gradient-to-r from-primary to-secondary text-white hover:shadow-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
      >
        Upload Files
      </Button>
      
      <Button
        onClick={clearCompleted}
        disabled={!hasCompletedFiles}
        className="bg-accent text-white hover:shadow-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
      >
        Clear Completed
      </Button>
      
      <Button
        onClick={resetAll}
        disabled={isUploading}
        className="bg-surface-500 text-white hover:bg-surface-600 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
      >
        Reset All
      </Button>
    </div>
  );
};

export default UploadControls;