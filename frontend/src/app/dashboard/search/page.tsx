'use client';

import * as React from 'react';
import { 
  Typography, 
  Paper, 
  Box, 
  Button, 
  InputBase,
  Chip,
  Grid,
  IconButton,
  Avatar
} from '@mui/material';
import { 
  Search, 
  SlidersHorizontal, 
  Cloud, 
  Filter,
  FileText,
  Calendar,
  Tag,
  ArrowRight
} from 'lucide-react';
import { fetchFiles } from '../../api';

export default function SearchPage() {
  const [query, setQuery] = React.useState('');
  const [activeFilters, setActiveFilters] = React.useState(['Google Drive', 'Design']);

  const [allFiles, setAllFiles] = React.useState<any[]>([]);

  React.useEffect(() => {
    const loadFiles = async () => {
      try {
        const data = await fetchFiles();
        // Sort newest first
        const sorted = data.sort((a: any, b: any) => new Date(b.upload_date).getTime() - new Date(a.upload_date).getTime());
        setAllFiles(sorted);
      } catch (err) {
        console.error("Failed to load files", err);
      }
    };
    loadFiles();
  }, []);

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
    return date.toLocaleDateString();
  };

  const toggleFilter = (filter: string) => {
    setActiveFilters(prev => 
      prev.includes(filter) ? prev.filter(f => f !== filter) : [...prev, filter]
    );
  };

  const filteredResults = allFiles.filter(file => {
    // Search query matching
    const matchesQuery = query === '' || 
      file.filename.toLowerCase().includes(query.toLowerCase()) || 
      (file.tags && file.tags.some((t: string) => t.toLowerCase().includes(query.toLowerCase())));
      
    // Active filters matching (if no filters are active, show all)
    // Filters contain both Cloud Providers and Tags
    const matchesFilters = activeFilters.length === 0 || 
      activeFilters.some(filter => 
        file.cloud_provider === filter || 
        (file.tags && file.tags.map((t: string) => t.toLowerCase()).includes(filter.toLowerCase()))
      );
      
    return matchesQuery && matchesFilters;
  });

  const clouds = ['Google Drive', 'Dropbox', 'OneDrive'];
  const categories = ['Invoice', 'Design', 'Order', 'Compliance', 'Report'];

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in-fade">
      <div className="text-center space-y-4">
        <Typography variant="h3" className="font-black text-slate-900 dark:text-white tracking-tight">
          Unified Search
        </Typography>
        <div className="flex items-center justify-center gap-2 text-blue-600">
          <Typography variant="body1" className="text-slate-500 max-w-lg mx-auto">
            Search across Google Drive, Dropbox and OneDrive with natural language and AI tagging.
          </Typography>
        </div>
      </div>

      <div className="relative max-w-2xl mx-auto">
        <Paper 
          elevation={0} 
          className="glass-card flex items-center p-2 border-blue-500/30 shadow-2xl shadow-blue-500/10 focus-within:border-blue-500/60 transition-all"
        >
          <div className="p-3 text-blue-500">
            <Search size={24} />
          </div>
          <InputBase
            placeholder="Search for 'cotton invoices from last month'..."
            className="flex-1 px-2 font-medium text-lg dark:text-white"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <Button 
            variant="contained" 
            className="bg-blue-600 hover:bg-blue-700 rounded-2xl px-8 py-3 font-bold normal-case shadow-lg shadow-blue-500/20"
          >
            Search
          </Button>
        </Paper>
      </div>

      <div className="flex flex-col gap-8">
        {/* Filters Sidebar/Top Section */}
        <Box className="flex flex-wrap items-center gap-4 py-2">
          <div className="flex items-center gap-2 text-slate-400 mr-2">
            <SlidersHorizontal size={18} />
            <span className="text-xs font-bold uppercase tracking-wider">Filters</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {clouds.map(cloud => (
              <Chip 
                key={cloud} 
                label={cloud} 
                onClick={() => toggleFilter(cloud)}
                className={`rounded-xl font-bold h-9 transition-all border border-transparent ${activeFilters.includes(cloud) ? 'bg-blue-600 !text-white shadow-lg shadow-blue-500/20' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700 cursor-pointer hover:bg-blue-100 dark:hover:bg-slate-700'}`}
              />
            ))}
            <div className="w-[1px] h-6 bg-slate-200 dark:bg-white/10 mx-2 self-center" />
            {categories.map(cat => (
              <Chip 
                key={cat} 
                label={cat} 
                onClick={() => toggleFilter(cat)}
                className={`rounded-xl font-bold h-9 transition-all border border-transparent ${activeFilters.includes(cat) ? 'bg-indigo-600 !text-white shadow-lg shadow-indigo-500/20' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700 cursor-pointer hover:bg-indigo-100 dark:hover:bg-slate-700'}`}
              />
            ))}
          </div>
        </Box>

        {/* Results */}
        <div className="space-y-4">
          <Typography variant="overline" className="text-slate-400 font-black">{filteredResults.length} results found</Typography>
          
          <Grid container spacing={3}>
            {filteredResults.length === 0 ? (
              <div className="w-full text-center py-12">
                <Typography className="text-slate-500">No files found matching your search criteria.</Typography>
              </div>
            ) : (
            filteredResults.map((result, index) => (
              <Grid size={{ xs: 12 }} key={index}>
                <Paper elevation={0} className="glass-card p-5 border-slate-200/50 dark:border-white/5 hover:border-blue-500/30 transition-all flex items-center justify-between group">
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                      <FileText size={28} />
                    </div>
                    <div className="space-y-1">
                      <Typography variant="h6" className="font-bold !text-black dark:text-white leading-tight">
                        {result.filename}
                      </Typography>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1.5 text-slate-400">
                          <Calendar size={14} />
                          <span className="text-[11px] font-bold">{formatDate(result.upload_date)}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-400">
                          <Cloud size={14} />
                          <span className="text-[11px] font-bold">{formatSize(result.size_bytes)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {(result.tags || []).slice(0, 4).map((tag: string) => (
                            <Chip 
                              key={tag} 
                              label={tag} 
                              size="small" 
                              className="bg-slate-600 !text-white rounded-lg font-bold text-[10px] h-6 px-1" 
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-10">
                    <div className="flex items-center gap-3 bg-slate-50 dark:bg-white/5 px-4 py-2 rounded-2xl border border-slate-100 dark:border-white/5">
                      <div className="flex flex-col items-end">
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">Source Cloud</span>
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-200">{result.cloud_provider}</span>
                      </div>
                      <Avatar className="w-8 h-8 bg-blue-600 text-[10px] font-bold shadow-lg shadow-blue-500/10">
                        {result.cloud_provider[0]}
                      </Avatar>
                    </div>
                    <IconButton className="bg-slate-100 dark:bg-white/5 hover:bg-blue-600 hover:text-white transition-all rounded-xl p-3">
                      <ArrowRight size={20} />
                    </IconButton>
                  </div>
                </Paper>
              </Grid>
            ))
            )}
          </Grid>
        </div>
      </div>
    </div>
  );
}
