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
  HardDrive, 
  Server, 
  FileText, 
  MoreVertical,
  Download,
  Share2
} from 'lucide-react';

export default function DashboardPage() {
  const stats = [
    { title: 'Google Drive', used: '12.4 GB', total: '15 GB', icon: <Cloud className="text-blue-500" />, color: 'bg-blue-50 dark:bg-blue-900/20' },
    { title: 'Dropbox', used: '1.2 GB', total: '2 GB', icon: <HardDrive className="text-sky-500" />, color: 'bg-sky-50 dark:bg-sky-900/20' },
    { title: 'OneDrive', used: '3.1 GB', total: '5 GB', icon: <Server className="text-indigo-500" />, color: 'bg-indigo-50 dark:bg-indigo-900/20' },
  ];

  const recentFiles = [
    { name: 'Supplier_Contract_2025.pdf', size: '2.4 MB', date: '2 mins ago', tags: ['Contract', 'Supplier'], location: 'Google Drive' },
    { name: 'Cotton_Inventory_Q1.xlsx', size: '1.1 MB', date: '1 hour ago', tags: ['Inventory', 'Q1'], location: 'Dropbox' },
    { name: 'Silk_Pattern_Design_v2.png', size: '18 MB', date: '3 hours ago', tags: ['Design', 'Silk'], location: 'OneDrive' },
  ];

  return (
    <div className="max-w-7xl mx-auto animate-fade-in-up">
      <Box className="flex justify-between items-center mb-8">
        <div>
          <Typography variant="h4" className="font-bold text-slate-800 dark:text-white mb-1">
            Welcome back, Admin 👋
          </Typography>
          <Typography variant="body1" className="text-slate-500 dark:text-slate-400">
            Here's what's happening with your multi-cloud storage today.
          </Typography>
        </div>
        <Button 
          variant="contained" 
          className="bg-blue-600 hover:bg-blue-700 rounded-xl px-6 py-2.5 shadow-lg shadow-blue-500/30"
          startIcon={<Cloud size={20} />}
        >
          Upload File
        </Button>
      </Box>

      {/* Storage Overview */}
      <Typography variant="h6" className="font-semibold text-slate-700 dark:text-slate-200 mb-4">
        Storage Overview
      </Typography>
      <Grid container spacing={3} className="mb-8">
        {stats.map((stat, index) => (
          <Grid size={{ xs: 12, md: 4 }} key={index}>
            <Paper elevation={0} className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 dark:bg-slate-900 transition-all hover:shadow-md cursor-pointer">
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl ${stat.color}`}>
                  {stat.icon}
                </div>
                <MoreVertical className="text-slate-400" size={20} />
              </div>
              <Typography variant="h6" className="font-semibold text-slate-800 dark:text-white">
                {stat.title}
              </Typography>
              <div className="mt-4 flex items-end gap-2">
                <Typography variant="h4" className="font-bold text-slate-800 dark:text-white leading-none">
                  {stat.used}
                </Typography>
                <Typography variant="body2" className="text-slate-500 dark:text-slate-400 pb-1">
                  / {stat.total}
                </Typography>
              </div>
              {/* Progress Bar Mock */}
              <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 mt-4">
                <div 
                  className="bg-blue-500 h-1.5 rounded-full" 
                  style={{ width: `${(parseFloat(stat.used) / parseFloat(stat.total)) * 100}%` }}
                ></div>
              </div>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Recent Files */}
      <Box className="flex justify-between items-center mb-4 mt-8">
        <Typography variant="h6" className="font-semibold text-slate-700 dark:text-slate-200">
          Recent Files
        </Typography>
        <Button variant="text" className="text-blue-600 font-medium hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg">
          View All
        </Button>
      </Box>
      <Paper elevation={0} className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden dark:bg-slate-900">
        <div className="p-0">
          {recentFiles.map((file, index) => (
            <div key={index} className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600">
                  <FileText size={20} />
                </div>
                <div>
                  <Typography variant="subtitle2" className="font-semibold text-slate-800 dark:text-white">
                    {file.name}
                  </Typography>
                  <Typography variant="caption" className="text-slate-500 dark:text-slate-400">
                    {file.size} • {file.date}
                  </Typography>
                </div>
              </div>
              <div className="hidden md:flex gap-2">
                {file.tags.map(tag => (
                  <Chip 
                    key={tag} 
                    label={tag} 
                    size="small" 
                    className="bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 rounded-md font-medium text-xs" 
                  />
                ))}
              </div>
              <div className="flex items-center gap-2">
                <Chip 
                  label={file.location} 
                  size="small" 
                  variant="outlined" 
                  className="hidden sm:flex border-slate-200 text-slate-500 dark:border-slate-700 dark:text-slate-400 rounded-md" 
                />
                <IconButton size="small" className="text-slate-400 hover:text-blue-600">
                  <Download size={18} />
                </IconButton>
                <IconButton size="small" className="text-slate-400 hover:text-blue-600">
                  <Share2 size={18} />
                </IconButton>
              </div>
            </div>
          ))}
        </div>
      </Paper>
    </div>
  );
}
