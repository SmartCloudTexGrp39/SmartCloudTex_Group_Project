'use client';

import * as React from 'react';
import { Typography, Box, Paper, Button, Grid } from '@mui/material';
import { CloudUpload, FileText, Info } from 'lucide-react';

export default function UploadPage() {
    const [dragActive, setDragActive] = React.useState(false);

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    return (
        <Box>
            <Typography variant="h4" className="font-bold text-slate-800 mb-2">
                Upload Files
            </Typography>
            <Typography variant="body1" className="text-slate-500 mb-8">
                Upload your textile documents. AI will automatically tag and route them to the best cloud storage.
            </Typography>

            <Grid container spacing={4}>
                <Grid item xs={12} md={8}>
                    <Paper
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        elevation={0}
                        className={`border-2 border-dashed rounded-3xl p-12 transition-all flex flex-col items-center justify-center min-h-[400px] ${dragActive
                                ? 'border-blue-500 bg-blue-50/50'
                                : 'border-slate-200 bg-white hover:border-blue-300'
                            }`}
                    >
                        <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                            <CloudUpload className="text-blue-600" size={40} />
                        </div>
                        <Typography variant="h5" className="font-bold text-slate-800 mb-2">
                            Drag & Drop your files here
                        </Typography>
                        <Typography variant="body1" className="text-slate-500 mb-8 text-center max-w-sm">
                            Support for invoices, designs, and contracts. AI will analyze content for automatic organization.
                        </Typography>
                        <Button
                            variant="contained"
                            size="large"
                            className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-8 py-3 capitalize font-semibold shadow-lg shadow-blue-500/30"
                        >
                            Browse Files
                        </Button>
                        <input type="file" className="hidden" multiple />
                    </Paper>
                </Grid>

                <Grid item xs={12} md={4}>
                    <Paper elevation={0} className="p-6 rounded-3xl border border-slate-200 bg-white">
                        <Typography variant="h6" className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <Info size={20} className="text-blue-500" />
                            Upload Guidelines
                        </Typography>
                        <ul className="space-y-4 text-slate-600">
                            <li className="flex gap-3">
                                <FileText size={18} className="text-slate-400 shrink-0 mt-1" />
                                <Typography variant="body2">
                                    Files under 15MB are stored on Google Drive for high accessibility.
                                </Typography>
                            </li>
                            <li className="flex gap-3">
                                <FileText size={18} className="text-slate-400 shrink-0 mt-1" />
                                <Typography variant="body2">
                                    Medium files up to 100MB are routed to Dropbox.
                                </Typography>
                            </li>
                            <li className="flex gap-3">
                                <FileText size={18} className="text-slate-400 shrink-0 mt-1" />
                                <Typography variant="body2">
                                    Large design files over 100MB go to OneDrive.
                                </Typography>
                            </li>
                        </ul>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
}
