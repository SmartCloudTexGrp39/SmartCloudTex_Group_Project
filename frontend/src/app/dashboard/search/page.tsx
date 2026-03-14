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

export default function SearchPage() {
  const [query, setQuery] = React.useState('');
  const [activeFilters, setActiveFilters] = React.useState(['Google Drive', 'Design']);

  const mockResults = [
    { 
      name: 'Autumn_Collection_Report_2025.pdf', 
      cloud: 'Google Drive', 
      tags: ['Design', 'Report'], 
      date: 'Oct 12, 2025',
      size: '4.2 MB'
    },
    { 
      name: 'Silk_Invoice_Vendor_X.docx', 
      cloud: 'Dropbox', 
      tags: ['Invoice', 'Vendor'], 
      date: 'Nov 05, 2025',
      size: '1.2 MB'
    },
    { 
      name: 'Pattern_Library_V2.zip', 
      cloud: 'OneDrive', 
      tags: ['Design', 'Library'], 
      date: 'Dec 01, 2025',
      size: '128 MB'
    }
  ];

  const clouds = ['Google Drive', 'Dropbox', 'OneDrive'];
  const categories = ['Invoice', 'Design', 'Order', 'Compliance', 'Report'];

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in-fade">
      <div className="text-center space-y-4">
        <Typography variant="h3" className="font-black text-slate-900 dark:text-white tracking-tight">
          Unified Search
        </Typography>
        <Typography variant="body1" className="text-slate-500 max-w-lg mx-auto">
          Search across Google Drive, Dropbox, and OneDrive with natural language and AI tagging.
        </Typography>
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
                onClick={() => {}}
                className={`rounded-xl font-bold h-9 transition-all ${activeFilters.includes(cloud) ? 'bg-blue-600 !text-white shadow-lg shadow-blue-500/20' : 'bg-slate-100 dark:bg-white/5 dark:text-slate-400'}`}
              />
            ))}
            <div className="w-[1px] h-6 bg-slate-200 dark:bg-white/10 mx-2 self-center" />
            {categories.map(cat => (
              <Chip 
                key={cat} 
                label={cat} 
                onClick={() => {}}
                className={`rounded-xl font-bold h-9 transition-all ${activeFilters.includes(cat) ? 'bg-indigo-600 !text-white shadow-lg shadow-indigo-500/20' : 'bg-slate-100 dark:bg-white/5 dark:text-slate-400'}`}
              />
            ))}
          </div>
        </Box>

        {/* Results */}
        <div className="space-y-4">
          <Typography variant="overline" className="text-slate-400 font-black">3 results found across all clouds</Typography>
          
          <Grid container spacing={3}>
            {mockResults.map((result, index) => (
              <Grid size={{ xs: 12 }} key={index}>
                <Paper elevation={0} className="glass-card p-5 border-slate-200/50 dark:border-white/5 hover:border-blue-500/30 transition-all flex items-center justify-between group">
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                      <FileText size={28} />
                    </div>
                    <div className="space-y-1">
                      <Typography variant="h6" className="font-bold !text-black dark:text-white leading-tight">
                        {result.name}
                      </Typography>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1.5 text-slate-400">
                          <Calendar size={14} />
                          <span className="text-[11px] font-bold">{result.date}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {result.tags.map(tag => (
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
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-200">{result.cloud}</span>
                      </div>
                      <Avatar className="w-8 h-8 bg-blue-600 text-[10px] font-bold shadow-lg shadow-blue-500/10">
                        {result.cloud[0]}
                      </Avatar>
                    </div>
                    <IconButton className="bg-slate-100 dark:bg-white/5 hover:bg-blue-600 hover:text-white transition-all rounded-xl p-3">
                      <ArrowRight size={20} />
                    </IconButton>
                  </div>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </div>
      </div>
    </div>
  );
}
