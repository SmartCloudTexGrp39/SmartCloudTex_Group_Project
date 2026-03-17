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
  Server
} from 'lucide-react';

export default function DashboardPage() {
  const stats = [
    {
      title: 'Google Drive',
      used: '12.4 GB',
      total: '15 GB',
      icon: <Cloud className="text-white" size={20} />,
      color: 'bg-blue-600',
      gradient: 'from-blue-600 to-blue-400',
      percentage: 82
    },
    {
      title: 'Dropbox',
      used: '1.2 GB',
      total: '2 GB',
      icon: <HardDrive className="text-white" size={20} />,
      color: 'bg-sky-500',
      gradient: 'from-sky-500 to-sky-300',
      percentage: 60
    },
    {
      title: 'OneDrive',
      used: '4.8 GB',
      total: '5 GB',
      icon: <Server className="text-white" size={20} />,
      color: 'bg-indigo-600',
      gradient: 'from-indigo-600 to-indigo-400',
      percentage: 96
    },
  ];

  const recentFiles = [
    { name: 'Supplier_Contract_2025.pdf', size: '2.4 MB', date: '2 mins ago', tags: ['Contract', 'Compliance'], location: 'Google Drive', type: 'PDF' },
    { name: 'Cotton_Inventory_Q1.xlsx', size: '1.1 MB', date: '1 hour ago', tags: ['Inventory', 'Order'], location: 'Dropbox', type: 'XLSX' },
    { name: 'Silk_Pattern_Design_v2.png', size: '18 MB', date: '3 hours ago', tags: ['Design', 'Invoice'], location: 'OneDrive', type: 'Image' },
  ];

  const tagColors: Record<string, string> = {
    'Invoice': 'bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400',
    'Design': 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
    'Order': 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400',
    'Compliance': 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400',
    'Contract': 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
    'Inventory': 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
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
          <Typography variant="caption" className="text-blue-500 font-bold cursor-pointer hover:underline">
            Manage Connections
          </Typography>
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
          <Button variant="outlined" className="border-slate-200 dark:border-white/10 rounded-xl px-4 py-2 text-slate-600 dark:text-slate-300 font-bold normal-case hover:bg-slate-50 dark:hover:bg-white/5">
            View All Files
          </Button>
        </Box>

        <Paper elevation={0} className="glass-card border-slate-200/50 dark:border-white/5 overflow-hidden">
          <div className="divide-y divide-slate-100 dark:divide-white/5">
            {recentFiles.map((file, index) => (
              <div key={index} className="flex flex-wrap md:flex-nowrap items-center justify-between p-5 hover:bg-slate-50/50 dark:hover:bg-white/5 transition-all group">
                <div className="flex items-center gap-4 min-w-[300px]">
                  <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/10 flex items-center justify-center text-blue-600 shadow-sm group-hover:scale-110 transition-transform">
                    {file.type === 'PDF' && <FileText size={24} />}
                    {file.type === 'XLSX' && <HardDrive size={24} />}
                    {file.type === 'Image' && <Server size={24} />}
                  </div>
                  <div>
                    <Typography variant="subtitle2" className="font-bold !text-black dark:text-white leading-tight">
                      {file.name}
                    </Typography>
                    <div className="flex items-center gap-2 mt-1">
                      <Typography variant="caption" className="text-slate-400 font-medium">
                        {file.size}
                      </Typography>
                      <span className="w-1 h-1 rounded-full bg-slate-300" />
                      <Typography variant="caption" className="text-slate-400 font-medium">
                        {file.date}
                      </Typography>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full md:w-auto mt-4 md:mt-0 px-16 md:px-0">
                  {file.tags.map(tag => (
                    <Chip
                      key={tag}
                      label={tag}
                      size="small"
                      className={`${tagColors[tag] || 'bg-slate-100 text-slate-600'} rounded-lg font-bold text-[10px] h-6 px-1`}
                    />
                  ))}
                </div>

                <div className="flex items-center gap-4 w-full md:w-auto mt-4 md:mt-0 justify-end">
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200/50 dark:border-white/10">
                    <Cloud size={14} className="text-blue-500" />
                    <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400">{file.location}</span>
                  </div>
                  <div className="flex gap-1">
                    <IconButton size="small" className="text-slate-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20">
                      <Download size={18} />
                    </IconButton>
                    <IconButton size="small" className="text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20">
                      <Share2 size={18} />
                    </IconButton>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Paper>
      </div>
    </div>
  );
}
