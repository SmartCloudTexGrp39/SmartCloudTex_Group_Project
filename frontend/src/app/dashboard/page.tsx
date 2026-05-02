'use client';

import * as React from 'react';
import {
  Typography,
  Grid,
  Paper,
  Box,
  Button,
  Chip,
  IconButton
} from '@mui/material';
import {
  Cloud,
  FileText,
  MoreVertical,
  Download,
  Share2,
  HardDrive,
  Server,
  X
} from 'lucide-react';

import { useRouter } from 'next/navigation';
import { fetchFiles, fetchMetrics, downloadFile, deleteFile, shareFile } from '../api';

export default function DashboardPage() {
  const router = useRouter();
  const [role, setRole] = React.useState<string>('');
  const [recentFiles, setRecentFiles] = React.useState<any[]>([]);
  const [storageMetrics, setStorageMetrics] = React.useState<any>(null);

  React.useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        if (user.role) setRole(user.role);
      } catch (e) { }
    }

    const loadFiles = async () => {
      try {
        const data = await fetchFiles();
        // Sort by upload_date descending and take top 5
        const sorted = data.sort((a: any, b: any) => new Date(b.upload_date).getTime() - new Date(a.upload_date).getTime());
        setRecentFiles(sorted.slice(0, 5));
        
        const metricsData = await fetchMetrics();
        if (metricsData) {
          setStorageMetrics(metricsData);
        }
      } catch (err) {
        console.error("Failed to load files", err);
      }
    };

    loadFiles();
  }, []);

  const handleDownload = async (fileId: string, filename: string) => {
    try {
      await downloadFile(fileId, filename);
    } catch (err) {
      console.error(err);
      alert("Failed to download file");
    }
  };

  const handleDelete = async (fileId: string) => {
    if (!window.confirm("Are you sure you want to delete this file from both the database and cloud storage?")) return;
    try {
      const token = localStorage.getItem('token') || '';
      await deleteFile(fileId, token);
      
      // Refresh files and metrics
      const data = await fetchFiles();
      const sorted = data.sort((a: any, b: any) => new Date(b.upload_date).getTime() - new Date(a.upload_date).getTime());
      setRecentFiles(sorted.slice(0, 5));
      
      const metricsData = await fetchMetrics();
      if (metricsData) setStorageMetrics(metricsData);
    } catch (err: any) {
      alert(err.message || "Failed to delete file");
    }
  };

  const handleShare = async (fileId: string) => {
    try {
      const result = await shareFile(fileId);
      navigator.clipboard.writeText(result.share_url);
      alert(`Share link copied to clipboard: ${result.share_url}`);
    } catch (err) {
      alert("Failed to generate share link");
    }
  };

  const formatSize = (bytes: number) => {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getDynamicStats = () => {
    const baseStats = [
      {
        id: 'Google Drive',
        title: 'Google Drive',
        icon: <Cloud className="text-white" size={20} />,
        color: 'bg-blue-600',
        gradient: 'from-blue-600 to-blue-400',
      },
      {
        id: 'Dropbox',
        title: 'Dropbox',
        icon: <HardDrive className="text-white" size={20} />,
        color: 'bg-sky-500',
        gradient: 'from-sky-500 to-sky-300',
      },
      {
        id: 'OneDrive',
        title: 'OneDrive',
        icon: <Server className="text-white" size={20} />,
        color: 'bg-indigo-600',
        gradient: 'from-indigo-600 to-indigo-400',
      },
    ];

    return baseStats.map(stat => {
      // Fallbacks if not yet loaded
      const GB = 1024 * 1024 * 1024;
      const defaultTotal = stat.id === 'Google Drive' ? 15*GB : stat.id === 'Dropbox' ? 2*GB : 5*GB;
      const providerMetrics = storageMetrics?.[stat.id] || { used: 0, total: defaultTotal };
      
      const usedFormatted = formatSize(providerMetrics.used);
      const totalFormatted = formatSize(providerMetrics.total);
      
      // Ensure percentage is between 0 and 100
      let percentage = 0;
      if (providerMetrics.total > 0) {
        percentage = Math.min(100, Math.max(0, Math.round((providerMetrics.used / providerMetrics.total) * 100)));
      }
      
      return {
        ...stat,
        used: usedFormatted,
        total: totalFormatted,
        percentage
      };
    });
  };

  const stats = getDynamicStats();



  const tagColors: Record<string, string> = {
    'Invoice': 'bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400',
    'Design': 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
    'Order': 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400',
    'Compliance': 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400',
    'Contract': 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
    'Inventory': 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300',
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-10">
      {/* Header Section */}
      <Box className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <Typography variant="h4" className="font-extrabold text-slate-900 dark:text-white mb-2 tracking-tight">
            Dashboard Overview
          </Typography>
          <Typography variant="body1" className="text-slate-500 dark:text-slate-400 font-medium">
            Manage your synchronized textile assets across multiple clouds.
          </Typography>
        </div>
        <Button
          variant="contained"
          className="bg-blue-600 hover:bg-blue-700 rounded-2xl px-8 py-3 shadow-xl shadow-blue-500/25 transition-all hover:scale-105 normal-case font-bold"
          startIcon={<Cloud size={20} />}
          onClick={() => router.push('/dashboard/upload')}
        >
          Upload New Asset
        </Button>
      </Box>

      {/* Storage Cards Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <Typography variant="h6" className="font-bold text-slate-800 dark:text-slate-100">
            Connected Storage
          </Typography>
          {role === 'Admin' && (
            <Typography 
              variant="caption" 
              className="text-blue-500 font-bold cursor-pointer hover:underline"
              onClick={() => router.push('/dashboard/settings')}
            >
              Manage Connections
            </Typography>
          )}
        </div>
        <Grid container spacing={4}>
          {stats.map((stat, index) => (
            <Grid size={{ xs: 12, md: 4 }} key={index}>
              <Paper elevation={0} className="glass-card p-6 border-slate-200/50 dark:border-white/5 hover:border-blue-500/30 transition-all group overflow-hidden relative">
                {/* Decorative Background Glow */}
                <div className={`absolute -right-10 -top-10 w-32 h-32 rounded-full opacity-10 blur-3xl ${stat.color} group-hover:opacity-20 transition-opacity`} />

                <div className="flex justify-between items-start mb-6">
                  <div className={`p-4 rounded-2xl shadow-lg bg-gradient-to-br ${stat.gradient}`}>
                    {stat.icon}
                  </div>
                  <IconButton size="small" className="text-slate-400">
                    <MoreVertical size={18} />
                  </IconButton>
                </div>

                <Typography variant="h6" className="font-bold !text-black dark:text-white mb-1">
                  {stat.title}
                </Typography>

                <div className="mt-4 flex items-baseline gap-1">
                  <Typography variant="h4" className="font-black !text-black dark:text-white">
                    {stat.used}
                  </Typography>
                  <Typography variant="body2" className="text-slate-500 font-medium">
                    / {stat.total}
                  </Typography>
                </div>

                {/* Progress Bar */}
                <div className="mt-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Usage Status</span>
                    <span className={`text-[10px] font-bold uppercase tracking-wider ${stat.percentage > 90 ? 'text-rose-500' : 'text-blue-500'}`}>
                      {stat.percentage}% Full
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-white/5 rounded-full h-2 shadow-inner">
                    <div
                      className={`h-2 rounded-full transition-all duration-1000 bg-gradient-to-r ${stat.gradient} shadow-lg shadow-blue-500/20`}
                      style={{ width: `${stat.percentage}%` }}
                    ></div>
                  </div>
                </div>

                {stat.percentage > 90 && (
                  <div className="mt-4 p-2 bg-rose-50 dark:bg-rose-900/20 rounded-lg flex items-center gap-2 border border-rose-100 dark:border-rose-900/50">
                    <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                    <span className="text-[10px] font-bold text-rose-600 dark:text-rose-400 uppercase">Critical Quota Alert</span>
                  </div>
                )}
              </Paper>
            </Grid>
          ))}
        </Grid>
      </div>

      {/* Recent Activity Section */}
      <div className="mt-10">
        <Box className="flex justify-between items-center mb-6">
          <div>
            <Typography variant="h6" className="font-bold text-slate-800 dark:text-slate-100">
              Recent Activity
            </Typography>
            <Typography variant="caption" className="text-slate-500 font-medium">
              Files classified and routed by SmartCloud Engine
            </Typography>
          </div>
          <Button 
            variant="outlined" 
            className="border-slate-200 dark:border-white/10 rounded-xl px-4 py-2 text-slate-600 dark:text-slate-300 font-bold normal-case hover:bg-slate-50 dark:hover:bg-white/5"
            onClick={() => router.push('/dashboard/search')}
          >
            View All Files
          </Button>
        </Box>

        <Paper elevation={0} className="glass-card border-slate-200/50 dark:border-white/5 overflow-hidden">
          <div className="divide-y divide-slate-100 dark:divide-white/5">
            {recentFiles.length === 0 ? (
              <div className="p-8 text-center text-slate-500">No recent files found.</div>
            ) : (
              recentFiles.map((file, index) => (
                <div key={index} className="flex flex-wrap md:flex-nowrap items-center justify-between p-5 hover:bg-slate-50/50 dark:hover:bg-white/5 transition-all group">
                  <div className="flex items-center gap-4 min-w-[300px]">
                    <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/10 flex items-center justify-center text-blue-600 shadow-sm group-hover:scale-110 transition-transform">
                      {file.mime_type?.includes('pdf') ? <FileText size={24} /> :
                       file.mime_type?.includes('spreadsheet') || file.mime_type?.includes('excel') ? <HardDrive size={24} /> :
                       <Server size={24} />}
                    </div>
                    <div>
                      <Typography variant="subtitle2" className="font-bold !text-black dark:text-white leading-tight">
                        {file.filename}
                      </Typography>
                      <div className="flex items-center gap-2 mt-1">
                        <Typography variant="caption" className="text-slate-400 font-medium">
                          {formatSize(file.size_bytes)}
                        </Typography>
                        <span className="w-1 h-1 rounded-full bg-slate-300" />
                        <Typography variant="caption" className="text-slate-400 font-medium">
                          {formatDate(file.upload_date)}
                        </Typography>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 w-full md:w-auto mt-4 md:mt-0 px-16 md:px-0 flex-wrap max-w-[200px]">
                    {(file.tags || []).slice(0, 3).map((tag: string) => (
                      <Chip
                        key={tag}
                        label={tag}
                        size="small"
                        className={`${tagColors[tag] || 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-200 dark:border-slate-600'} rounded-lg font-bold text-[10px] h-6 px-1`}
                      />
                    ))}
                    {(file.tags || []).length > 3 && (
                      <Chip label={`+${file.tags.length - 3}`} size="small" className="bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-200 dark:border-slate-600 rounded-lg font-bold text-[10px] h-6 px-1" />
                    )}
                  </div>

                  <div className="flex items-center gap-4 w-full md:w-auto mt-4 md:mt-0 justify-end">
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200/50 dark:border-white/10">
                      <Cloud size={14} className="text-blue-500" />
                      <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400">{file.cloud_provider}</span>
                    </div>
                    <div className="flex gap-1">
                      <IconButton 
                        size="small" 
                        className="text-slate-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                        onClick={() => handleDownload(file._id, file.filename)}
                      >
                        <Download size={18} />
                      </IconButton>
                      <IconButton 
                        size="small" 
                        className="text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20"
                        onClick={() => handleShare(file._id)}
                      >
                        <Share2 size={18} />
                      </IconButton>
                      {role === 'Admin' && (
                        <IconButton 
                          size="small" 
                          className="text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                          onClick={() => handleDelete(file._id)}
                        >
                          <X size={18} />
                        </IconButton>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </Paper>
      </div>
    </div>
  );
}
