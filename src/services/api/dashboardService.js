import uploadsData from '@/services/mockData/uploads.json';
import { subDays, format, isAfter } from 'date-fns';

// Helper function to simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Helper function to format file size
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 MB';
  const mb = bytes / 1024 / 1024;
  return mb.toFixed(1) + ' MB';
};

// Helper function to get file type from mime type
const getFileTypeFromMime = (mimeType) => {
  if (mimeType.startsWith('image/')) return 'Images';
  if (mimeType.startsWith('video/')) return 'Videos';
  if (mimeType.startsWith('audio/')) return 'Audio';
  if (mimeType.includes('pdf')) return 'PDFs';
  if (mimeType.includes('word') || mimeType.includes('document')) return 'Documents';
  if (mimeType.includes('sheet') || mimeType.includes('excel')) return 'Spreadsheets';
  if (mimeType.includes('presentation') || mimeType.includes('powerpoint')) return 'Presentations';
  return 'Other';
};

// Helper function to filter uploads by time range
const filterUploadsByTimeRange = (uploads, timeRange) => {
  const now = new Date();
  let cutoffDate;
  
  switch (timeRange) {
    case '7d':
      cutoffDate = subDays(now, 7);
      break;
    case '30d':
      cutoffDate = subDays(now, 30);
      break;
    case '90d':
      cutoffDate = subDays(now, 90);
      break;
    default:
      cutoffDate = subDays(now, 7);
  }
  
  return uploads.filter(upload => 
    isAfter(new Date(upload.uploadedAt), cutoffDate)
  );
};

// Generate upload trends data
const generateUploadTrends = (uploads, timeRange) => {
  const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
  const trends = [];
  
  for (let i = days - 1; i >= 0; i--) {
    const date = subDays(new Date(), i);
    const dateStr = format(date, 'yyyy-MM-dd');
    
    const uploadsOnDate = uploads.filter(upload => 
      format(new Date(upload.uploadedAt), 'yyyy-MM-dd') === dateStr
    );
    
    trends.push({
      date: dateStr,
      count: uploadsOnDate.length
    });
  }
  
  return trends;
};

// Generate file type breakdown
const generateFileTypeBreakdown = (uploads) => {
  const typeCount = {};
  
  uploads.forEach(upload => {
    const type = getFileTypeFromMime(upload.type);
    typeCount[type] = (typeCount[type] || 0) + 1;
  });
  
  return Object.entries(typeCount).map(([type, count]) => ({
    type,
    count
  }));
};

export const dashboardService = {
  async getDashboardData(timeRange = '7d') {
    await delay(300);
    
    try {
      // Filter uploads based on time range
      const filteredUploads = filterUploadsByTimeRange(uploadsData, timeRange);
      const allUploads = uploadsData; // For total stats
      
      // Calculate statistics
      const totalUploads = allUploads.length;
      const totalSizeBytes = allUploads.reduce((sum, upload) => sum + upload.size, 0);
      const totalSize = formatFileSize(totalSizeBytes);
      const averageSize = formatFileSize(totalSizeBytes / totalUploads);
      const weeklyUploads = filterUploadsByTimeRange(uploadsData, '7d').length;
      
      // Generate charts data
      const uploadTrends = generateUploadTrends(filteredUploads, timeRange);
      const fileTypeBreakdown = generateFileTypeBreakdown(allUploads);
      
      // Get recent uploads (last 10)
      const recentUploads = [...allUploads]
        .sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt))
        .slice(0, 10);
      
      return {
        totalUploads,
        totalSize,
        averageSize,
        weeklyUploads,
        uploadTrends,
        fileTypeBreakdown,
        recentUploads
      };
    } catch (error) {
      console.error('Dashboard service error:', error);
      throw new Error('Failed to load dashboard data');
    }
  },

  async getUploadStatistics() {
    await delay(200);
    
    try {
      const totalFiles = uploadsData.length;
      const totalSize = uploadsData.reduce((sum, upload) => sum + upload.size, 0);
      const completedUploads = uploadsData.filter(upload => upload.status === 'completed').length;
      
      return {
        totalFiles,
        totalSize: formatFileSize(totalSize),
        completedUploads,
        successRate: Math.round((completedUploads / totalFiles) * 100)
      };
    } catch (error) {
      console.error('Statistics service error:', error);
      throw new Error('Failed to load statistics');
    }
  },

  async getFileTypeAnalytics() {
    await delay(250);
    
    try {
      const fileTypes = generateFileTypeBreakdown(uploadsData);
      const totalFiles = uploadsData.length;
      
      return fileTypes.map(type => ({
        ...type,
        percentage: Math.round((type.count / totalFiles) * 100)
      }));
    } catch (error) {
      console.error('File type analytics error:', error);
      throw new Error('Failed to load file type analytics');
    }
  }
};