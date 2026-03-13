'use client';

import * as React from 'react';
import { Typography, Box, TextField, InputAdornment, Paper, Chip } from '@mui/material';
import { Search, Sparkles, History } from 'lucide-react';

export default function SearchPage() {
    const [query, setQuery] = React.useState('');

    const recentSearches = ['Invoice #882 from Colombo Textiles', 'Silk design patterns 2024', 'Supplier contracts South Asia'];

    return (
        <Box>
            <Typography variant="h4" className="font-bold text-slate-800 mb-2">
                Semantic Search
            </Typography>
            <Typography variant="body1" className="text-slate-500 mb-8">
                Search your files using natural language. Our AI understands the context of your textile business.
            </Typography>

            <Paper
                elevation={0}
                className="p-2 pl-4 rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-200/50 mb-12 max-w-3xl"
            >
                <TextField
                    fullWidth
                    placeholder="e.g., 'Find all invoices for cotton fabric from last month'"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    variant="standard"
                    autoFocus
                    InputProps={{
                        disableUnderline: true,
                        startAdornment: (
                            <InputAdornment position="start">
                                <Search className="text-blue-500" size={24} />
                            </InputAdornment>
                        ),
                        endAdornment: (
                            <InputAdornment position="end">
                                <div className="bg-blue-600 text-white p-3 rounded-2xl cursor-pointer hover:bg-blue-700 transition-colors">
                                    <Sparkles size={20} />
                                </div>
                            </InputAdornment>
                        ),
                        className: "py-2"
                    }}
                />
            </Paper>

            <Box>
                <Typography variant="subtitle2" className="text-slate-400 uppercase tracking-widest font-bold mb-4 flex items-center gap-2">
                    <History size={16} />
                    Recent Inquiries
                </Typography>
                <Box className="flex flex-wrap gap-3">
                    {recentSearches.map((s) => (
                        <Chip
                            key={s}
                            label={s}
                            onClick={() => setQuery(s)}
                            className="bg-white border border-slate-200 hover:bg-slate-50 font-medium py-5 px-2 rounded-xl text-slate-600"
                        />
                    ))}
                </Box>
            </Box>

            {query && (
                <Box className="mt-12 py-20 flex flex-col items-center justify-center opacity-40">
                    <Sparkles size={48} className="text-blue-200 mb-4 animate-pulse" />
                    <Typography className="text-slate-400 font-medium">AI is preparing your results...</Typography>
                </Box>
            )}
        </Box>
    );
}
