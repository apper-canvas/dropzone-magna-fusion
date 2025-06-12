import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, FileText, HardDrive, Clock, Download } from 'lucide-react';
import { format } from 'date-fns';
import Chart from 'react-apexcharts';
import { dashboardService } from '@/services';

const DashboardPage = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('7d');

  useEffect(() => {
    loadDashboardData();
  }, [timeRange]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const data = await dashboardService.getDashboardData(timeRange);
      setDashboardData(data);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fileTypeChartOptions = {
    chart: {
      type: 'donut',
      background: 'transparent'
    },
    theme: {
      mode: 'light'
    },
    colors: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'],
    labels: dashboardData?.fileTypeBreakdown?.map(item => item.type) || [],
    legend: {
      position: 'bottom',
      fontFamily: 'Inter, sans-serif'
    },
    plotOptions: {
      pie: {
        donut: {
          size: '70%'
        }
      }
    },
    dataLabels: {
      enabled: true,
      formatter: function (val) {
        return Math.round(val) + '%';
      }
    }
  };

  const uploadTrendsChartOptions = {
    chart: {
      type: 'area',
      background: 'transparent',
      toolbar: {
        show: false
      }
    },
    theme: {
      mode: 'light'
    },
    colors: ['#3b82f6'],
    dataLabels: {
      enabled: false
    },
    stroke: {
      curve: 'smooth',
      width: 3
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.4,
        opacityTo: 0.1
      }
    },
    xaxis: {
      categories: dashboardData?.uploadTrends?.map(item => 
        format(new Date(item.date), 'MMM dd')
      ) || [],
      labels: {
        style: {
          fontFamily: 'Inter, sans-serif'
        }
      }
    },
    yaxis: {
      labels: {
        style: {
          fontFamily: 'Inter, sans-serif'
        }
      }
    },
    grid: {
      borderColor: '#e5e7eb',
      strokeDashArray: 4
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-surface-200 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-surface-200 rounded-xl"></div>
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="h-96 bg-surface-200 rounded-xl"></div>
              <div className="h-96 bg-surface-200 rounded-xl"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-4xl font-bold font-heading gradient-text mb-2">
                Dashboard
              </h1>
              <p className="text-lg text-surface-600">
                Overview of your upload activity and file management
              </p>
            </div>
            
            <div className="mt-4 sm:mt-0">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="glass border border-surface-300 rounded-lg px-4 py-2 text-surface-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Statistics Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <div className="glass p-6 rounded-xl border border-surface-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-surface-600 mb-1">Total Uploads</p>
                <p className="text-3xl font-bold text-surface-900">
                  {dashboardData?.totalUploads || 0}
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-xl">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="glass p-6 rounded-xl border border-surface-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-surface-600 mb-1">Total Size</p>
                <p className="text-3xl font-bold text-surface-900">
                  {dashboardData?.totalSize || '0 MB'}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-xl">
                <HardDrive className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="glass p-6 rounded-xl border border-surface-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-surface-600 mb-1">This Week</p>
                <p className="text-3xl font-bold text-surface-900">
                  {dashboardData?.weeklyUploads || 0}
                </p>
              </div>
              <div className="p-3 bg-amber-100 rounded-xl">
                <TrendingUp className="w-6 h-6 text-amber-600" />
              </div>
            </div>
          </div>

          <div className="glass p-6 rounded-xl border border-surface-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-surface-600 mb-1">Avg. Size</p>
                <p className="text-3xl font-bold text-surface-900">
                  {dashboardData?.averageSize || '0 MB'}
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-xl">
                <BarChart3 className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="glass p-6 rounded-xl border border-surface-200"
          >
            <h3 className="text-xl font-semibold text-surface-900 mb-6">File Type Distribution</h3>
            {dashboardData?.fileTypeBreakdown?.length > 0 ? (
              <Chart
                options={fileTypeChartOptions}
                series={dashboardData.fileTypeBreakdown.map(item => item.count)}
                type="donut"
                height={300}
              />
            ) : (
              <div className="flex items-center justify-center h-64 text-surface-500">
                No data available
              </div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="glass p-6 rounded-xl border border-surface-200"
          >
            <h3 className="text-xl font-semibold text-surface-900 mb-6">Upload Trends</h3>
            {dashboardData?.uploadTrends?.length > 0 ? (
              <Chart
                options={uploadTrendsChartOptions}
                series={[{
                  name: 'Uploads',
                  data: dashboardData.uploadTrends.map(item => item.count)
                }]}
                type="area"
                height={300}
              />
            ) : (
              <div className="flex items-center justify-center h-64 text-surface-500">
                No data available
              </div>
            )}
          </motion.div>
        </div>

        {/* Recent Uploads */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass p-6 rounded-xl border border-surface-200"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-surface-900">Recent Uploads</h3>
            <Clock className="w-5 h-5 text-surface-500" />
          </div>
          
          {dashboardData?.recentUploads?.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-surface-200">
                    <th className="text-left py-3 px-4 font-medium text-surface-600">File Name</th>
                    <th className="text-left py-3 px-4 font-medium text-surface-600">Type</th>
                    <th className="text-left py-3 px-4 font-medium text-surface-600">Size</th>
                    <th className="text-left py-3 px-4 font-medium text-surface-600">Uploaded</th>
                    <th className="text-left py-3 px-4 font-medium text-surface-600">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {dashboardData.recentUploads.map((upload, index) => (
                    <tr key={upload.id} className="border-b border-surface-100 hover:bg-surface-50">
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          <FileText className="w-4 h-4 text-surface-400 mr-3" />
                          <span className="font-medium text-surface-900">{upload.filename}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-surface-600">
                        {upload.type.split('/')[1]?.toUpperCase() || 'Unknown'}
                      </td>
                      <td className="py-3 px-4 text-surface-600">
                        {(upload.size / 1024 / 1024).toFixed(2)} MB
                      </td>
                      <td className="py-3 px-4 text-surface-600">
                        {format(new Date(upload.uploadedAt), 'MMM dd, yyyy')}
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {upload.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-surface-500">
              No recent uploads found
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardPage;