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
  ArrowRight,
  Zap,
  Download,
  Share2,
  X
} from 'lucide-react';
import { fetchFiles, searchFiles, downloadFile, deleteFile, shareFile } from '../../api';

interface CloudFile {
  filename: string;
  upload_date: string;
  size_bytes: number;
  cloud_provider: string;
  tags?: string[];
  _id?: string;
}

export default function SearchPage() {
  const [query, setQuery] = React.useState('');
  const [activeFilters, setActiveFilters] = React.useState(['Google Drive', 'Design']);
  const [role, setRole] = React.useState<string>('');

  const [allFiles, setAllFiles] = React.useState<CloudFile[]>([]);
  const [isSearching, setIsSearching] = React.useState(false);
  const [error, setError] = React.useState('');

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
        const data = await fetchFiles() as CloudFile[];
        // Sort newest first
        const sorted = data.sort((a, b) => new Date(b.upload_date).getTime() - new Date(a.upload_date).getTime());
        setAllFiles(sorted);
      } catch (err) {
        console.error("Failed to load files", err);
      }
    };
    if (query === '') {
      loadFiles();
    }
  }, [query]);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setIsSearching(true);
    setError('');
    try {
      const results = await searchFiles(query);
      setAllFiles(results);
    } catch (err) {
      console.error("Semantic search failed", err);
      setError("Semantic search is currently unavailable. Falling back to local search.");
    } finally {
      setIsSearching(false);
    }
  };

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
      setAllFiles(prev => prev.filter(f => f._id !== fileId));
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

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
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
    const options: Intl.DateTimeFormatOptions = {
      timeZone: 'Asia/Colombo',
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    };
    return date.toLocaleString('en-LK', options);
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
      
    return matchesFilters; // Ignore local query match if backend handled it, but still apply filters
  });

  const clouds = ['Google Drive', 'Dropbox', 'OneDrive'];
  const categories = ['Invoice', 'Design', 'Order', 'Compliance', 'Report'];

  const tagColors: Record<string, string> = {
    'Invoice': 'bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400',
    'Design': 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
    'Order': 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400',
    'Compliance': 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400',
    'Contract': 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
    'Inventory': 'bg-stone-100 text-stone-600 dark:bg-stone-700 dark:text-stone-300',
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in-fade">
      <div className="text-center space-y-4">
        <Typography variant="h3" className="font-black text-stone-900 dark:text-white tracking-tight">
          Unified Search
        </Typography>
        <div className="flex items-center justify-center gap-2 text-blue-600">
          <Typography variant="body1" className="text-stone-500 max-w-lg mx-auto">
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
            onKeyDown={handleKeyDown}
          />
          <Button 
            variant="contained" 
            onClick={handleSearch}
            disabled={isSearching}
            className="bg-blue-600 hover:bg-blue-700 rounded-2xl px-8 py-3 font-bold normal-case shadow-lg shadow-blue-500/20 disabled:opacity-50"
          >
            {isSearching ? 'Searching...' : 'Search'}
          </Button>
        </Paper>
        {error && (
          <Typography variant="body2" className="text-red-500 mt-2 text-center">
            {error}
          </Typography>
        )}
      </div>

      <div className="flex flex-col gap-8">
        {/* Filters Sidebar/Top Section */}
        <Box className="flex flex-wrap items-center gap-4 py-2">
          <div className="flex items-center gap-2 text-stone-400 mr-2">
            <SlidersHorizontal size={18} />
            <span className="text-xs font-bold uppercase tracking-wider">Filters</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {clouds.map(cloud => (
              <Chip 
                key={cloud} 
                label={cloud} 
                onClick={() => toggleFilter(cloud)}
                className={`rounded-xl font-bold h-9 transition-all ${activeFilters.includes(cloud) ? 'bg-blue-600 !text-white border border-blue-600 shadow-lg shadow-blue-500/20' : 'bg-stone-100 !text-stone-500 border border-stone-200 dark:bg-stone-800/50 dark:!text-stone-500 dark:border-stone-700/50 cursor-pointer hover:bg-stone-200 dark:hover:bg-stone-700'}`}
              />
            ))}
            <div className="w-[1px] h-6 bg-stone-200 dark:bg-white/10 mx-2 self-center" />
            {categories.map(cat => (
              <Chip 
                key={cat} 
                label={cat} 
                onClick={() => toggleFilter(cat)}
                className={`rounded-xl font-bold h-9 transition-all ${activeFilters.includes(cat) ? 'bg-indigo-600 !text-white border border-indigo-600 shadow-lg shadow-indigo-500/20' : 'bg-stone-100 !text-stone-500 border border-stone-200 dark:bg-stone-800/50 dark:!text-stone-500 dark:border-stone-700/50 cursor-pointer hover:bg-stone-200 dark:hover:bg-stone-700'}`}
              />
            ))}
          </div>
        </Box>

        {/* Results */}
        <div className="space-y-4">
          <Typography variant="overline" className="text-stone-400 font-black">{filteredResults.length} results found</Typography>
          
          <Grid container spacing={3}>
            {filteredResults.length === 0 ? (
              <div className="w-full text-center py-12">
                <Typography className="text-stone-500">No files found matching your search criteria.</Typography>
              </div>
            ) : (
            filteredResults.map((result, index) => (
              <Grid size={{ xs: 12 }} key={index}>
                <Paper elevation={0} className="glass-card p-5 border-stone-200/50 dark:border-white/5 hover:border-blue-500/30 transition-all flex items-center justify-between group">
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                      <FileText size={28} />
                    </div>
                    <div className="space-y-1">
                      <Typography variant="h6" className="font-bold !text-stone-900 dark:text-white leading-tight">
                        {result.filename}
                      </Typography>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1.5 text-stone-400">
                          <Calendar size={14} />
                          <span className="text-[11px] font-bold">{formatDate(result.upload_date)}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-stone-400">
                          <Cloud size={14} />
                          <span className="text-[11px] font-bold">{formatSize(result.size_bytes)}</span>
                        </div>
                        <div className="flex items-center gap-2 w-full md:w-auto mt-4 md:mt-0 md:px-0 flex-wrap max-w-[200px]">
                          {(result.tags || []).slice(0, 3).map((tag: string) => (
                            <Chip
                              key={tag}
                              label={tag}
                              size="small"
                              className={`${tagColors[tag] || 'bg-stone-100 text-stone-600 dark:bg-stone-700 dark:text-stone-200 dark:border-stone-600'} rounded-lg font-bold text-[10px] h-6 px-1`}
                            />
                          ))}
                          {(result.tags || []).length > 3 && (
                            <Chip label={`+${(result.tags || []).length - 3}`} size="small" className="bg-stone-100 text-stone-600 dark:bg-stone-700 dark:text-stone-200 dark:border-stone-600 rounded-lg font-bold text-[10px] h-6 px-1" />
                          )}
                        </div>
                        {/* @ts-ignore */}
                        {result.relevance_score && (
                          <div className="flex items-center gap-1 text-emerald-500 font-bold ml-2 bg-emerald-50 px-2 py-0.5 rounded-lg">
                            <Zap size={12} className="animate-pulse" />
                            <span className="text-[11px]">{(result as any).relevance_score.toFixed(2)}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-10">
                    <div className="flex items-center gap-3 bg-stone-50 dark:bg-white/5 px-4 py-2 rounded-2xl border border-stone-100 dark:border-white/5">
                      <div className="flex flex-col items-end">
                        <span className="text-[9px] font-black text-stone-400 uppercase tracking-tighter">Source Cloud</span>
                        <span className="text-xs font-bold text-stone-700 dark:text-stone-200">{result.cloud_provider}</span>
                      </div>
                      <Avatar className="w-8 h-8 bg-blue-600 text-[10px] font-bold shadow-lg shadow-blue-500/10">
                        {result.cloud_provider[0]}
                      </Avatar>
                    </div>
                    <div className="flex gap-1">
                      <IconButton 
                        size="small" 
                        className="text-stone-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all rounded-xl p-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (result._id) handleDownload(result._id, result.filename);
                        }}
                      >
                        <Download size={18} />
                      </IconButton>
                      <IconButton 
                        size="small" 
                        className="text-stone-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-all rounded-xl p-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (result._id) handleShare(result._id);
                        }}
                      >
                        <Share2 size={18} />
                      </IconButton>
                      {role === 'Admin' && (
                        <IconButton 
                          size="small" 
                          className="text-stone-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all rounded-xl p-2"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (result._id) handleDelete(result._id);
                          }}
                        >
                          <X size={18} />
                        </IconButton>
                      )}
                    </div>
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
