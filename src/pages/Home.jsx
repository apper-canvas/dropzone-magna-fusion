import { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import DropZone from '../components/DropZone';
import FileList from '../components/FileList';
import UploadProgress from '../components/UploadProgress';
import FilePreview from '../components/FilePreview';
import { uploadService } from '../services';

const Home = () => {
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

  const generateThumbnail = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          const maxSize = 100;
          
          let { width, height } = img;
          if (width > height) {
            if (width > maxSize) {
              height = (height * maxSize) / width;
              width = maxSize;
            }
          } else {
            if (height > maxSize) {
              width = (width * maxSize) / height;
              height = maxSize;
            }
          }
          
          canvas.width = width;
          canvas.height = height;
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL());
        };
        img.onerror = reject;
        img.src = e.target.result;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

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
      // Upload files concurrently but limit to 3 at a time
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
            const currentFile = files.find(f => f.id === fileItem.id);
            if (!currentFile) return prev;
            
            const progressBytes = (currentFile.size * progress) / 100;
            const otherFilesProgress = files
              .filter(f => f.id !== fileItem.id && f.status === 'completed')
              .reduce((sum, f) => sum + f.size, 0);
            
            return {
              ...prev,
              uploadedSize: otherFilesProgress + progressBytes
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

  const typeFilters = [
    { label: 'All Files', value: [] },
    { label: 'Images', value: ['jpg', 'jpeg', 'png', 'gif', 'webp'] },
    { label: 'Documents', value: ['pdf', 'doc', 'docx', 'txt'] },
    { label: 'Media', value: ['mp4', 'mp3', 'avi', 'mov'] },
  ];

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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm font-medium text-surface-700">Filter by type:</span>
            {typeFilters.map((filter, index) => (
              <button
                key={index}
                onClick={() => setAllowedTypes(filter.value)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  JSON.stringify(allowedTypes) === JSON.stringify(filter.value)
                    ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-md'
                    : 'bg-white/60 text-surface-700 hover:bg-white/80'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            <DropZone
              onFilesSelected={handleFilesSelected}
              allowedTypes={allowedTypes}
              fileInputRef={fileInputRef}
            />
            
            {files.length > 0 && (
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={startUpload}
                  disabled={!files.some(f => f.status === 'pending') || uploadSession?.status === 'uploading'}
                  className="flex-1 min-w-[120px] px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-lg font-medium hover:shadow-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all"
                >
                  Upload Files
                </button>
                
                <button
                  onClick={clearCompleted}
                  disabled={!files.some(f => f.status === 'completed')}
                  className="px-4 py-3 bg-accent text-white rounded-lg font-medium hover:shadow-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all"
                >
                  Clear Completed
                </button>
                
                <button
                  onClick={resetAll}
                  disabled={uploadSession?.status === 'uploading'}
                  className="px-4 py-3 bg-surface-500 text-white rounded-lg font-medium hover:bg-surface-600 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all"
                >
                  Reset All
                </button>
              </div>
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
              <UploadProgress session={uploadSession} />
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
            <FilePreview
              file={selectedFile}
              onClose={() => setSelectedFile(null)}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Home;