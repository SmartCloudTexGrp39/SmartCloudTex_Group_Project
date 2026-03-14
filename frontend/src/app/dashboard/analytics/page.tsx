'use client';

import * as React from 'react';
import { Typography, Box, Grid, Paper, LinearProgress } from '@mui/material';
import { HardDrive, TrendingUp, Users, Box as BoxIcon } from 'lucide-react';

export default function AnalyticsPage() {
    const stats = [
        { name: 'Total Storage', value: '45.2 GB', progress: 65, icon: <HardDrive size={24} />, color: 'blue' },
        { name: 'Total Documents', value: '1,284', icon: <TrendingUp size={24} />, color: 'emerald' },
        { name: 'Active Users', value: '12', icon: <Users size={24} />, color: 'purple' },
        { name: 'AI Tags Generated', value: '8,421', icon: <BoxIcon size={24} />, color: 'orange' },
    ];

    const colorClasses: Record<string, string> = {
        blue: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20',
        emerald: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20',
        purple: 'text-purple-600 bg-purple-50 dark:bg-purple-900/20',
        orange: 'text-orange-600 bg-orange-50 dark:bg-orange-900/20',
    };

    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-in-fade">
            <div>
                <Typography variant="h3" className="font-black text-slate-900 dark:text-white mb-2 tracking-tight">
                    Analytics
                </Typography>
                <Typography variant="body1" className="text-slate-500 dark:text-slate-400 font-medium max-w-2xl">
                    Real-time insights into your multi-cloud storage distribution and SME operational metrics.
                </Typography>
            </div>

            <Grid container spacing={3}>
                {stats.map((stat) => (
                    <Grid size={{ xs: 12, sm: 6, md: 3 }} key={stat.name}>
                        <Paper elevation={0} className="glass-card p-6 border-slate-200/50 dark:border-white/5 hover:border-blue-500/30 transition-all group">
                            <div className="flex items-center gap-4 mb-4">
                                <div className={`p-3 rounded-2xl shadow-sm transition-transform group-hover:scale-110 ${colorClasses[stat.color]}`}>
                                    {stat.icon}
                                </div>
                                <div>
                                    <Typography variant="caption" className="text-slate-400 font-black uppercase tracking-tighter">
                                        {stat.name}
                                    </Typography>
                                    <Typography variant="h5" className="font-bold !text-black dark:text-white leading-tight">
                                        {stat.value}
                                    </Typography>
                                </div>
                            </div>
                            {stat.progress && (
                                <Box className="mt-6">
                                    <div className="flex justify-between mb-2">
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Used Capacity</span>
                                        <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">{stat.progress}%</span>
                                    </div>
                                    <LinearProgress
                                        variant="determinate"
                                        value={stat.progress}
                                        className="h-2 rounded-full bg-slate-100 dark:bg-white/5"
                                        sx={{ 
                                            '& .MuiLinearProgress-bar': { 
                                                backgroundColor: '#2563eb',
                                                borderRadius: '999px',
                                                boxShadow: '0 0 10px rgba(37, 99, 235, 0.3)'
                                            } 
                                        }}
                                    />
                                </Box>
                            )}
                        </Paper>
                    </Grid>
                ))}
            </Grid>

            <Grid container spacing={4}>
                <Grid size={{ xs: 12, md: 8 }}>
                    <Paper elevation={0} className="glass-card p-8 border-slate-200/50 dark:border-white/5 min-h-[400px] flex flex-col">
                        <div className="flex justify-between items-center mb-10">
                            <Typography variant="h6" className="font-bold !text-black dark:text-white">Storage Usage Timeline</Typography>
                            <div className="flex gap-2">
                                <div className="w-3 h-3 rounded-full bg-blue-500 shadow-lg shadow-blue-500/20" />
                                <div className="w-3 h-3 rounded-full bg-slate-200 dark:bg-white/10" />
                            </div>
                        </div>
                        <Box className="flex-1 border-t border-dashed border-slate-100 dark:border-white/5 flex items-center justify-center">
                            <Typography className="text-slate-400 font-medium italic">Activity Visualization Engine Initializing...</Typography>
                        </Box>
                    </Paper>
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                    <Paper elevation={0} className="glass-card p-8 border-slate-200/50 dark:border-white/5 min-h-[400px] flex flex-col">
                        <Typography variant="h6" className="font-bold !text-black dark:text-white mb-6">Distribution by Cloud</Typography>
                        <Box className="space-y-6 flex-1">
                            {['Google Drive', 'Dropbox', 'OneDrive'].map(cloud => (
                                <div key={cloud} className="space-y-2">
                                    <div className="flex justify-between text-[11px] font-bold uppercase tracking-wider text-slate-500">
                                        <span>{cloud}</span>
                                        <span>{cloud === 'Google Drive' ? '65%' : cloud === 'Dropbox' ? '20%' : '15%'}</span>
                                    </div>
                                    <div className="w-full h-1.5 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                                        <div 
                                            className={`h-full rounded-full ${cloud === 'Google Drive' ? 'bg-blue-500' : cloud === 'Dropbox' ? 'bg-sky-400' : 'bg-indigo-500'}`}
                                            style={{ width: cloud === 'Google Drive' ? '65%' : cloud === 'Dropbox' ? '20%' : '15%' }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </Box>
                        <div className="mt-8 pt-6 border-t border-slate-100 dark:border-white/5 text-center">
                            <Typography variant="caption" className="text-blue-500 font-bold cursor-pointer hover:underline">
                                Extract Detailed Report
                            </Typography>
                        </div>
                    </Paper>
                </Grid>
            </Grid>
        </div>
    );
}
