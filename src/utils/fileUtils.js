import ApperIcon from '@/components/ApperIcon'; // Assuming ApperIcon remains here

export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const getStatusIconName = (status) => {
  switch (status) {
    case 'pending': return 'Clock';
    case 'uploading': return 'Upload';
    case 'completed': return 'CheckCircle2';
    case 'error': return 'AlertCircle';
    default: return 'File';
  }
};

export const getStatusColorClass = (status) => {
  switch (status) {
    case 'pending': return 'text-surface-500';
    case 'uploading': return 'text-primary';
    case 'completed': return 'text-green-500';
    case 'error': return 'text-red-500';
    default: return 'text-surface-500';
  }
};

export const getFileTypeIconName = (type) => {
  if (type.startsWith('image/')) return 'Image';
  if (type.startsWith('video/')) return 'Video';
  if (type.startsWith('audio/')) return 'Music';
  if (type.includes('pdf')) return 'FileText';
  if (type.includes('word') || type.includes('document')) return 'FileText';
  if (type.includes('sheet') || type.includes('excel')) return 'FileSpreadsheet';
  return 'File';
};

export const generateThumbnail = (file) => {
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

export const formatSpeed = (bytesPerSecond) => {
  if (bytesPerSecond === 0) return '0 B/s';
  const k = 1024;
  const sizes = ['B/s', 'KB/s', 'MB/s', 'GB/s'];
  const i = Math.floor(Math.log(bytesPerSecond) / Math.log(k));
  return parseFloat((bytesPerSecond / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};

export const getEstimatedTime = (totalSize, uploadedSize, startTime) => {
  const elapsed = (new Date() - startTime) / 1000; // seconds
  if (elapsed === 0) return 'Calculating...';

  const speed = uploadedSize / elapsed; // bytes per second
  if (speed === 0) return 'Calculating...';

  const remainingBytes = totalSize - uploadedSize;
  const remainingSeconds = remainingBytes / speed;

  if (remainingSeconds < 60) {
    return `${Math.ceil(remainingSeconds)}s remaining`;
  } else if (remainingSeconds < 3600) {
    return `${Math.ceil(remainingSeconds / 60)}m remaining`;
  } else {
    return `${Math.ceil(remainingSeconds / 3600)}h remaining`;
  }
};