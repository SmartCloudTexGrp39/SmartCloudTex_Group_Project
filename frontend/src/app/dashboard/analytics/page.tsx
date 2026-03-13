'use client';

import * as React from 'react';
import { Typography, Box, Grid, Paper, LinearProgress } from '@mui/material';
import { HardDrive, TrendingUp, Users, Box as BoxIcon } from 'lucide-react';

export default function AnalyticsPage() {
    const stats = [
        { name: 'Total Storage', value: '45.2 GB', progress: 65, icon: <HardDrive className="text-blue-600" /> },
        { name: 'Total Documents', value: '1,284', icon: <TrendingUp className="text-emerald-600" /> },
        { name: 'Active Users', value: '12', icon: <Users className="text-purple-600" /> },
        { name: 'AI Tags Generated', value: '8,421', icon: <BoxIcon className="text-orange-600" /> },
    ];

    return (
        <Box>
            <Typography variant="h4" className="font-bold text-slate-800 mb-2">
                Analytics
            </Typography>
            <Typography variant="body1" className="text-slate-500 mb-8">
                Insights into your cloud storage distribution and SME operational data.
            </Typography>

            <Grid container spacing={3} className="mb-8">
                {stats.map((stat) => (
                    <Grid item xs={12} sm={6} md={3} key={stat.name}>
                        <Paper elevation={0} className="p-6 rounded-3xl border border-slate-200 bg-white">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="p-3 rounded-2xl bg-slate-50">{stat.icon}</div>
                                <div>
                                    <Typography variant="caption" className="text-slate-400 font-bold uppercase tracking-wider">
                                        {stat.name}
                                    </Typography>
                                    <Typography variant="h5" className="font-bold text-slate-800">
                                        {stat.value}
                                    </Typography>
                                </div>
                            </div>
                            {stat.progress && (
                                <Box className="mt-4">
                                    <div className="flex justify-between mb-1">
                                        <Typography variant="caption" className="text-slate-500 font-medium">Used Capacity</Typography>
                                        <Typography variant="caption" className="text-blue-600 font-bold">{stat.progress}%</Typography>
                                    </div>
                                    <LinearProgress
                                        variant="determinate"
                                        value={stat.progress}
                                        className="h-2 rounded-full bg-slate-100"
                                        sx={{ '& .MuiLinearProgress-bar': { backgroundColor: '#2563eb' } }}
                                    />
                                </Box>
                            )}
                        </Paper>
                    </Grid>
                ))}
            </Grid>

            <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                    <Paper elevation={0} className="p-8 rounded-3xl border border-slate-200 bg-white min-h-[300px] flex items-center justify-center">
                        <Typography className="text-slate-400">Activity Chart Placeholder</Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Paper elevation={0} className="p-8 rounded-3xl border border-slate-200 bg-white min-h-[300px] flex items-center justify-center">
                        <Typography className="text-slate-400">Storage Distribution Placeholder</Typography>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
}
