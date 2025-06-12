import React, { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { uploadService } from '@/services';
import { generateThumbnail } from '@/utils/fileUtils';

import DropZoneArea from '@/components/molecules/DropZoneArea';
import UploadProgressCard from '@/components/molecules/UploadProgressCard';
import FileList from '@/components/organisms/FileList';
import FilePreviewModal from '@/components/organisms/FilePreviewModal';
import FileTypeFilter from '@/components/organisms/FileTypeFilter';
import UploadControls from '@/components/organisms/UploadControls';

const HomePage = () => {
  const [files, setFiles] = useState([]);
  const [uploadSession, setUploadSession] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [allowedTypes, setAllowedTypes] = useState([]);
  const fileInputRef = useRef(null);

  const handleFilesSelected = useCallback(async (selectedFiles) => {
    const newFiles = [];
    
    for (const file of selectedFiles) {
      // Validate file type if restrictions are set
      if (allowedTypes.length > 0) {
        const fileType = file.name.split('.').pop().toLowerCase();
        if (!allowedTypes.includes(fileType)) {
          toast.error(`File type .${fileType} is not allowed`);
          continue;
        }
      }
      
      // Create file item
      const fileItem = {
        id: `file_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: file.name,
        size: file.size,
        type: file.type,
        progress: 0,
        status: 'pending',
        file: file,
        thumbnail: null,
        uploadedAt: new Date()
      };
      
      // Generate thumbnail for images
      if (file.type.startsWith('image/')) {
        try {
          const thumbnail = await generateThumbnail(file);
          fileItem.thumbnail = thumbnail;
        } catch (error) {
          console.warn('Failed to generate thumbnail:', error);
        }
      }
      
      newFiles.push(fileItem);
    }
    
    if (newFiles.length > 0) {
      setFiles(prev => [...prev, ...newFiles]);
      toast.success(`${newFiles.length} file(s) added to upload queue`);
    }
  }, [allowedTypes]);

  const startUpload = async () => {
    const pendingFiles = files.filter(f => f.status === 'pending');
    if (pendingFiles.length === 0) {
      toast.warning('No files to upload');
      return;
    }

    const session = {
      totalFiles: pendingFiles.length,
      completedFiles: 0,
      totalSize: pendingFiles.reduce((sum, f) => sum + f.size, 0),
      uploadedSize: 0,
      startTime: new Date(),
      status: 'uploading'
    };
    
    setUploadSession(session);
    
    try {
      // Upload files concurrently but limit to 3 at a time (mock implementation detail)
      const uploadPromises = pendingFiles.map(file => uploadFile(file));
      await Promise.all(uploadPromises);
      
      setUploadSession(prev => ({ ...prev, status: 'completed' }));
      toast.success('All files uploaded successfully! 🎉');
      
      // Show confetti effect
      setTimeout(() => {
        // Reset session after celebration
        setUploadSession(null);
      }, 3000);
      
    } catch (error) {
      setUploadSession(prev => ({ ...prev, status: 'error' }));
      toast.error('Upload failed');
    }
  };

  const uploadFile = async (fileItem) => {
    // Update file status to uploading
    setFiles(prev => prev.map(f => 
      f.id === fileItem.id ? { ...f, status: 'uploading' } : f
    ));

    try {
      await uploadService.uploadFile(fileItem.file, {
        onProgress: (progress) => {
          setFiles(prev => prev.map(f => 
            f.id === fileItem.id ? { ...f, progress } : f
          ));
          
          // Update session progress
          setUploadSession(prev => {
            if (!prev) return null;
            // Recalculate uploadedSize based on all files
            const currentTotalUploadedSize = files.reduce((sum, f) => {
                if (f.id === fileItem.id) {
                    return sum + (f.size * progress) / 100;
                } else if (f.status === 'completed') {
                    return sum + f.size;
                }
                return sum;
            }, 0);
            
            return {
              ...prev,
              uploadedSize: currentTotalUploadedSize
            };
          });
        }
      });

      // Mark as completed
      setFiles(prev => prev.map(f => 
        f.id === fileItem.id ? { ...f, status: 'completed', progress: 100 } : f
      ));
      
      setUploadSession(prev => {
        if (!prev) return null;
        return {
          ...prev,
          completedFiles: prev.completedFiles + 1
        };
      });

    } catch (error) {
      setFiles(prev => prev.map(f => 
        f.id === fileItem.id ? { ...f, status: 'error' } : f
      ));
      throw error;
    }
  };

  const removeFile = (fileId) => {
    setFiles(prev => prev.filter(f => f.id !== fileId));
    toast.info('File removed from upload queue');
  };

  const clearCompleted = () => {
    setFiles(prev => prev.filter(f => f.status !== 'completed'));
    toast.success('Completed files cleared');
  };

  const resetAll = () => {
    setFiles([]);
    setUploadSession(null);
    toast.success('Upload queue cleared');
  };

  return (
    <div className="min-h-screen bg-transparent">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold font-heading gradient-text mb-4">
            Upload Your Files
          </h1>
          <p className="text-lg text-surface-600 max-w-2xl mx-auto">
            Drag and drop files or click to browse. Supports multiple files with real-time progress tracking and thumbnail previews.
          </p>
        </motion.div>

        {/* File Type Filter */}
        <FileTypeFilter allowedTypes={allowedTypes} setAllowedTypes={setAllowedTypes} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            <DropZoneArea
              onFilesSelected={handleFilesSelected}
              allowedTypes={allowedTypes}
              fileInputRef={fileInputRef}
            />
            
            {files.length > 0 && (
              <UploadControls 
                files={files}
                uploadSession={uploadSession}
                startUpload={startUpload}
                clearCompleted={clearCompleted}
                resetAll={resetAll}
              />
            )}
          </motion.div>

          {/* Progress and Files Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-6"
          >
            {uploadSession && (
              <UploadProgressCard session={uploadSession} />
            )}
            
            {files.length > 0 && (
              <FileList
                files={files}
                onRemoveFile={removeFile}
                onPreviewFile={setSelectedFile}
              />
            )}
          </motion.div>
        </div>

        {/* File Preview Modal */}
        <AnimatePresence>
          {selectedFile && (
            <FilePreviewModal
              file={selectedFile}
              onClose={() => setSelectedFile(null)}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default HomePage;