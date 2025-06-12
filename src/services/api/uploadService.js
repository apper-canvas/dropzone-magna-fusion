const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Simulate upload progress
const simulateUpload = async (file, onProgress) => {
  const totalChunks = 20;
  const chunkSize = file.size / totalChunks;
  
  for (let i = 0; i <= totalChunks; i++) {
    await delay(100 + Math.random() * 200); // Vary delay between 100-300ms
    
    const progress = Math.min((i / totalChunks) * 100, 100);
    onProgress(progress);
    
    // Simulate occasional network hiccups
    if (Math.random() < 0.1) {
      await delay(500);
    }
  }
};

export const uploadService = {
  uploadFile: async (file, options = {}) => {
    const { onProgress } = options;
    
    if (!file) {
      throw new Error('No file provided');
    }
    
    // Validate file size (example: 100MB limit)
    const maxSize = 100 * 1024 * 1024; // 100MB
    if (file.size > maxSize) {
      throw new Error('File size exceeds 100MB limit');
    }
    
    try {
      // Simulate the upload process
      await simulateUpload(file, onProgress || (() => {}));
      
      // Simulate final processing
      await delay(300);
      
      // Return upload result
      return {
        id: `upload_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        filename: file.name,
        size: file.size,
        type: file.type,
        url: `https://example.com/uploads/${file.name}`,
        uploadedAt: new Date().toISOString()
      };
      
    } catch (error) {
      throw new Error(`Upload failed: ${error.message}`);
    }
  },
  
  validateFile: (file, allowedTypes = []) => {
    if (!file) return { valid: false, error: 'No file provided' };
    
    // Check file size
    const maxSize = 100 * 1024 * 1024; // 100MB
    if (file.size > maxSize) {
      return { valid: false, error: 'File too large (max 100MB)' };
    }
    
    // Check file type if restrictions are set
    if (allowedTypes.length > 0) {
      const fileExtension = file.name.split('.').pop().toLowerCase();
      if (!allowedTypes.includes(fileExtension)) {
        return { valid: false, error: `File type .${fileExtension} not allowed` };
      }
    }
    
    return { valid: true };
  },
  
  getUploadHistory: async () => {
    await delay(300);
    
    // Return mock upload history
    return [
      {
        id: 'upload_1',
        filename: 'sample-image.jpg',
        size: 2048576,
        type: 'image/jpeg',
        uploadedAt: new Date(Date.now() - 3600000).toISOString(),
        status: 'completed'
      },
      {
        id: 'upload_2',
        filename: 'document.pdf',
        size: 1024000,
        type: 'application/pdf',
        uploadedAt: new Date(Date.now() - 7200000).toISOString(),
        status: 'completed'
      }
    ];
  }
};