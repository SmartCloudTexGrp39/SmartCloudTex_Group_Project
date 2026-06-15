'use client';

import * as React from 'react';
import { Typography, Box, Grid, Paper, LinearProgress, CircularProgress } from '@mui/material';
import { HardDrive, TrendingUp, Users, Box as BoxIcon } from 'lucide-react';
import { fetchMetrics, fetchFiles } from '../../api';
import { ResponsiveContainer, XAxis, YAxis, CartesianGrid, AreaChart, Area, Tooltip as RechartsTooltip, PieChart, Pie, Cell } from 'recharts';

export default function AnalyticsPage() {
    const [metrics, setMetrics] = React.useState<any>(null);
    const [files, setFiles] = React.useState<any[]>([]);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        async function loadData() {
            setLoading(true);
            try {
                const [metricsData, filesData] = await Promise.all([
                    fetchMetrics(),
                    fetchFiles()
                ]);
                setMetrics(metricsData);
                setFiles(filesData);
            } catch (error) {
                console.error("Error loading analytics data", error);
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, []);

    // Calculate totals from metrics
    const totalUsed = metrics ? Object.values(metrics).reduce((acc: number, curr: any) => acc + curr.used, 0) : 0;
    const totalCapacity = metrics ? Object.values(metrics).reduce((acc: number, curr: any) => acc + curr.total, 0) : 0;
    const usedPercentage = totalCapacity > 0 ? Math.round((totalUsed / totalCapacity) * 100) : 0;
    
    const formatBytes = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const stats = [
        { name: 'Total Storage', value: formatBytes(totalUsed), progress: usedPercentage, icon: <HardDrive size={24} />, color: 'blue' },
        { name: 'Total Documents', value: files.length.toString(), icon: <TrendingUp size={24} />, color: 'emerald' },
        { name: 'Active Users', value: '1', icon: <Users size={24} />, color: 'purple' },
        { name: 'AI Tags Generated', value: files.reduce((acc, f) => acc + (f.tags ? f.tags.length : 0), 0).toString(), icon: <BoxIcon size={24} />, color: 'orange' },
    ];

    const colorClasses: Record<string, string> = {
        blue: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20',
        emerald: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20',
        purple: 'text-purple-600 bg-purple-50 dark:bg-purple-900/20',
        orange: 'text-orange-600 bg-orange-50 dark:bg-orange-900/20',
    };

    const COLORS: Record<string, string> = {
        'Google Drive': '#3b82f6',
        'Dropbox': '#0ea5e9',
        'OneDrive': '#6366f1'
    };

    // Process metrics for Distribution
    const distributionData = metrics ? Object.keys(metrics).map(provider => {
        const used = metrics[provider].used;
        const total = metrics[provider].total;
        const percentage = total > 0 ? ((used / total) * 100).toFixed(2) : '0';
        return {
            name: provider,
            used,
            total,
            percentage,
            color: COLORS[provider] || '#94a3b8'
        };
    }) : [];

    // Process files for Timeline Chart
    const timelineData = React.useMemo(() => {
        if (!files.length) return [];
        const groups: Record<string, number> = {};
        files.forEach(f => {
            if (!f.upload_date) return;
            const date = new Date(f.upload_date).toLocaleDateString();
            groups[date] = (groups[date] || 0) + f.size_bytes;
        });
        const data = Object.entries(groups).map(([date, size]) => ({
            date,
            size: size / (1024 * 1024) // MB
        })).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        
        if (data.length === 1) {
            return [ { date: 'Start', size: 0 }, ...data ];
        }
        return data;
    }, [files]);

    const handleExtractReport = () => {
        const headers = ['Filename', 'Upload Date', 'Size (Bytes)', 'Cloud Provider', 'Tags'];
        const csvRows = [];
        csvRows.push(headers.join(','));
        
        files.forEach(f => {
            const row = [
                `"${f.filename || ''}"`,
                `"${f.upload_date ? new Date(f.upload_date).toLocaleDateString() : ''}"`,
                f.size_bytes || 0,
                `"${f.cloud_provider || ''}"`,
                `"${(f.tags || []).join('; ')}"`
            ];
            csvRows.push(row.join(','));
        });
        
        const csvString = csvRows.join('\n');
        const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'storage_report.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-in-fade">
            <div>
                <Typography variant="h3" className="font-black text-stone-900 dark:text-white mb-2 tracking-tight">
                    Analytics
                </Typography>
                <Typography variant="body1" className="text-stone-500 dark:text-stone-400 font-medium max-w-2xl">
                    Real-time insights into your multi-cloud storage distribution and SME operational metrics.
                </Typography>
            </div>

            {loading ? (
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                    <CircularProgress />
                </Box>
            ) : (
                <>
                    <Grid container spacing={3}>
                        {stats.map((stat) => (
                            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={stat.name}>
                                <Paper elevation={0} className="glass-card p-6 border-stone-200/50 dark:border-white/5 hover:border-blue-500/30 transition-all group h-full">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className={`p-3 rounded-2xl shadow-sm transition-transform group-hover:scale-110 ${colorClasses[stat.color]}`}>
                                            {stat.icon}
                                        </div>
                                        <div>
                                            <Typography variant="caption" className="text-stone-400 font-black uppercase tracking-tighter">
                                                {stat.name}
                                            </Typography>
                                            <Typography variant="h5" className="font-bold !text-stone-900 dark:text-white leading-tight">
                                                {stat.value}
                                            </Typography>
                                        </div>
                                    </div>
                                    {stat.progress !== undefined && (
                                        <Box className="mt-6">
                                            <div className="flex justify-between mb-2">
                                                <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Used Capacity</span>
                                                <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">{stat.progress}%</span>
                                            </div>
                                            <LinearProgress
                                                variant="determinate"
                                                value={stat.progress}
                                                className="h-2 rounded-full bg-stone-100 dark:bg-white/5"
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
                            <Paper elevation={0} className="glass-card p-8 border-stone-200/50 dark:border-white/5 min-h-[400px] flex flex-col">
                                <div className="flex justify-between items-center mb-10">
                                    <Typography variant="h6" className="font-bold !text-stone-900 dark:text-white">Storage Usage Timeline (MB)</Typography>
                                </div>
                                <Box className="flex-1" style={{ minHeight: 300 }}>
                                    {timelineData.length > 0 ? (
                                        <ResponsiveContainer width="100%" height={300}>
                                            <AreaChart data={timelineData}>
                                                <defs>
                                                    <linearGradient id="colorSize" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                                    </linearGradient>
                                                </defs>
                                                <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                                                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value.toFixed(1)}`} />
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.1} />
                                                <RechartsTooltip 
                                                    contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', borderRadius: '8px', border: 'none', color: '#fff' }}
                                                    itemStyle={{ color: '#fff' }}
                                                    formatter={(value: any) => [value ? Number(value).toFixed(2) + ' MB' : '0 MB', 'Storage Used']}
                                                />
                                                <Area type="monotone" dataKey="size" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorSize)" />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    ) : (
                                        <div className="h-full flex items-center justify-center">
                                            <Typography className="text-stone-400 font-medium italic">No timeline data available</Typography>
                                        </div>
                                    )}
                                </Box>
                            </Paper>
                        </Grid>
                        <Grid size={{ xs: 12, md: 4 }}>
                            <Paper elevation={0} className="glass-card p-8 border-stone-200/50 dark:border-white/5 min-h-[400px] flex flex-col">
                                <Typography variant="h6" className="font-bold !text-stone-900 dark:text-white mb-6">Distribution by Cloud</Typography>
                                <Box className="flex-1 flex flex-col justify-center items-center">
                                    {distributionData.length > 0 ? (
                                        <>
                                            <ResponsiveContainer width="100%" height={200}>
                                                <PieChart>
                                                    <Pie
                                                        data={distributionData}
                                                        cx="50%"
                                                        cy="50%"
                                                        innerRadius={60}
                                                        outerRadius={80}
                                                        paddingAngle={5}
                                                        dataKey="used"
                                                    >
                                                        {distributionData.map((entry, index) => (
                                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                                        ))}
                                                    </Pie>
                                                    <RechartsTooltip 
                                                        contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', borderRadius: '8px', border: 'none', color: '#fff' }}
                                                        itemStyle={{ color: '#fff' }}
                                                        formatter={(value: any) => [formatBytes(value), 'Used']}
                                                    />
                                                </PieChart>
                                            </ResponsiveContainer>
                                            <div className="w-full space-y-3 mt-4">
                                                {distributionData.map(cloud => (
                                                    <div key={cloud.name} className="flex justify-between text-xs font-bold uppercase tracking-wider text-stone-500">
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cloud.color }}></div>
                                                            <span>{cloud.name}</span>
                                                        </div>
                                                        <span>{formatBytes(cloud.used)} ({cloud.percentage}%)</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </>
                                    ) : (
                                        <Typography className="text-stone-400 text-center text-sm">No storage data</Typography>
                                    )}
                                </Box>
                                <div className="mt-8 pt-6 border-t border-stone-100 dark:border-white/5 text-center">
                                    <Typography 
                                        variant="caption" 
                                        className="text-blue-500 font-bold cursor-pointer hover:underline"
                                        onClick={handleExtractReport}
                                    >
                                        Extract Detailed Report
                                    </Typography>
                                </div>
                            </Paper>
                        </Grid>
                    </Grid>
                </>
            )}
        </div>
    );
}
