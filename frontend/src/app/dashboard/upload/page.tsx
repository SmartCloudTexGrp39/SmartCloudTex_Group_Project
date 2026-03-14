'use client';

import * as React from 'react';
import {
  Typography,
  Paper,
  Box,
  Button,
  Stepper,
  Step,
  StepLabel,
  LinearProgress,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton
} from '@mui/material';
import {
  CloudUpload,
  FileText,
  Brain,
  Zap,
  CheckCircle2,
  AlertCircle,
  X,
  RefreshCw,
  Copy,
  FolderTree,
  Cloud
} from 'lucide-react';

const steps = ['Select File', 'Smart Analysis', 'Final Routing'];

export default function UploadPage() {
  const [activeStep, setActiveStep] = React.useState(0);
  const [isUploading, setIsUploading] = React.useState(false);
  const [isAnalyzing, setIsAnalyzing] = React.useState(false);
  const [selectedFile, setSelectedFile] = React.useState<{ name: string, size: string } | null>(null);
  const [showDuplicateModal, setShowDuplicateModal] = React.useState(false);

  // Mock analysis results
  const [analysis, setAnalysis] = React.useState<{ tags: string[], route: string } | null>(null);

  const handleFileSelect = () => {
    // Mock file selection
    setSelectedFile({ name: 'Autumn_Collection_2026_v1.pdf', size: '2.8 MB' });
    setActiveStep(1);
    startAnalysis();
  };

  const startAnalysis = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setAnalysis({
        tags: ['Design', 'Silk', 'Invoice'],
        route: 'Google Drive'
      });
      setIsAnalyzing(false);
      // Simulate duplicate detection for demo
      setTimeout(() => setShowDuplicateModal(true), 500);
    }, 2000);
  };

  const handleResolveDuplicate = (option: string) => {
    setShowDuplicateModal(false);
    setActiveStep(2);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in-fade">
      <div>
        <Typography variant="h4" className="font-extrabold text-slate-900 dark:text-white mb-2">
          Smart Asset Upload
        </Typography>
        <Typography variant="body1" className="text-slate-500 dark:text-slate-400">
          Upload your textile designs and let our AI handle classification and optimal storage routing.
        </Typography>
      </div>

      <Paper elevation={0} className="glass-card p-8 border-slate-200/50 dark:border-white/5">
        <Stepper activeStep={activeStep} className="mb-12">
          {steps.map((label) => (
            <Step key={label} sx={{
              '& .MuiStepLabel-label': { fontWeight: 'bold', fontSize: '13px' },
              '& .MuiStepIcon-root.Mui-active': { color: '#2563eb' },
              '& .MuiStepIcon-root.Mui-completed': { color: '#10b981' },
            }}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <div className="min-h-[300px] flex flex-col items-center justify-center text-center">
          {activeStep === 0 && (
            <div
              onClick={handleFileSelect}
              className="w-full border-2 border-dashed border-slate-200 dark:border-white/10 rounded-3xl p-12 hover:border-blue-500/50 hover:bg-blue-50/30 dark:hover:bg-blue-900/10 transition-all cursor-pointer group"
            >
              <div className="w-20 h-20 rounded-2xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 mb-6 mx-auto group-hover:scale-110 transition-transform">
                <CloudUpload size={40} />
              </div>
              <Typography variant="h6" className="font-bold text-slate-800 dark:text-white mb-2">
                Drop your files here
              </Typography>
              <Typography variant="body2" className="text-slate-500 mb-6">
                Support PDF, DOCX, PNG, and JPG up to 50MB
              </Typography>
              <Button variant="contained" className="bg-blue-600 hover:bg-blue-700 rounded-xl px-10 py-3 font-bold normal-case shadow-lg shadow-blue-500/20">
                Browse Files
              </Button>
            </div>
          )}

          {activeStep === 1 && (
            <div className="w-full space-y-8 animate-in-fade">
              <div className="flex items-center gap-4 bg-slate-50 dark:bg-white/5 p-4 rounded-2xl border border-slate-100 dark:border-white/5 max-w-md mx-auto">
                <div className="w-12 h-12 rounded-xl bg-blue-500 flex items-center justify-center text-white">
                  <FileText size={24} />
                </div>
                <div className="text-left flex-1 overflow-hidden">
                  <Typography variant="subtitle2" className="font-bold text-slate-800 dark:text-white truncate">
                    {selectedFile?.name}
                  </Typography>
                  <Typography variant="caption" className="text-slate-500">{selectedFile?.size}</Typography>
                </div>
              </div>

              {isAnalyzing ? (
                <div className="space-y-6 max-w-sm mx-auto">
                  <div className="flex flex-col items-center">
                    <Brain className="text-blue-500 animate-pulse mb-4" size={48} />
                    <Typography variant="body1" className="font-bold text-slate-700 dark:text-slate-200">
                      AI is classifying your asset...
                    </Typography>
                  </div>
                  <LinearProgress className="h-2 rounded-full bg-blue-100 dark:bg-white/5 [&>.MuiLinearProgress-bar]:bg-blue-600" />
                  <div className="grid grid-cols-2 gap-2">
                    <div className="h-8 bg-slate-100 dark:bg-white/5 rounded-lg animate-pulse" />
                    <div className="h-8 bg-slate-100 dark:bg-white/5 rounded-lg animate-pulse" />
                  </div>
                </div>
              ) : (
                <div className="space-y-8">
                  <div className="flex flex-col items-center gap-4 animate-in-slide-up">
                    <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-full border border-emerald-100 dark:border-emerald-900/30">
                      <CheckCircle2 size={18} />
                      <span className="text-xs font-bold uppercase tracking-wider">Analysis Complete</span>
                    </div>

                    <div className="flex flex-wrap justify-center gap-2">
                      {analysis?.tags.map(tag => (
                        <Chip key={tag} label={tag} className="bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 font-bold rounded-xl h-9" />
                      ))}
                    </div>

                    <div className="p-6 bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/20 rounded-2xl max-w-sm w-full">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <Zap size={18} className="text-amber-500" />
                          <span className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-tighter italic">Smart Routing</span>
                        </div>
                      </div>
                      <Typography variant="body2" className="text-slate-600 dark:text-slate-400 mb-4 text-sm leading-relaxed">
                        Based on access frequency and file type, we recommend storing this in:
                      </Typography>
                      <div className="flex items-center gap-3 p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-white/5 shadow-sm">
                        <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center text-white">
                          <Cloud size={18} />
                        </div>
                        <Typography className="font-bold text-slate-800 dark:text-white">{analysis?.route}</Typography>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4 justify-center">
                    <Button
                      variant="outlined"
                      onClick={() => setActiveStep(0)}
                      className="border-slate-200 dark:border-white/10 rounded-xl px-8 py-3 dark:text-white"
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="contained"
                      onClick={() => setActiveStep(2)}
                      className="bg-blue-600 hover:bg-blue-700 rounded-xl px-12 py-3 font-bold shadow-lg shadow-blue-500/20"
                    >
                      Confirm Routing
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeStep === 2 && (
            <div className="text-center space-y-6 animate-in-slide-up">
              <div className="w-24 h-24 rounded-full bg-emerald-500 flex items-center justify-center text-white mx-auto shadow-xl shadow-emerald-500/20">
                <CheckCircle2 size={48} />
              </div>
              <div>
                <Typography variant="h5" className="font-bold text-slate-800 dark:text-white">File Successfully Routed</Typography>
                <Typography variant="body2" className="text-slate-500 mt-2">
                  Stored in <span className="text-blue-500 font-bold">{analysis?.route}</span> • Classified as <span className="text-emerald-500 font-bold">{analysis?.tags.join(', ')}</span>
                </Typography>
              </div>
              <div className="flex gap-4 justify-center pt-4">
                <Button
                  onClick={() => setActiveStep(0)}
                  className="text-blue-600 font-bold hover:bg-blue-50 dark:hover:bg-blue-900/20 px-8 py-3 rounded-xl"
                >
                  Upload Another
                </Button>
                <Button
                  className="bg-slate-900 dark:bg-white dark:text-slate-950 hover:bg-slate-800 dark:hover:bg-slate-100 rounded-xl px-10 py-3 font-bold"
                >
                  View in Dashboard
                </Button>
              </div>
            </div>
          )}
        </div>
      </Paper>

      {/* Duplicate Detection Modal (FR-004) */}
      <Dialog
        open={showDuplicateModal}
        onClose={() => setShowDuplicateModal(false)}
        PaperProps={{
          className: "glass-card p-4 border-white/10 dark:bg-slate-900 max-w-md w-full rounded-3xl"
        }}
      >
        <DialogTitle className="flex justify-between items-center p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-900/30 flex items-center justify-center text-amber-500">
              <AlertCircle size={24} />
            </div>
            <Typography variant="h6" className="font-bold dark:text-white">Duplicate Detected</Typography>
          </div>
          <IconButton onClick={() => setShowDuplicateModal(false)} className="text-slate-400">
            <X size={20} />
          </IconButton>
        </DialogTitle>
        <DialogContent className="p-4">
          <Typography variant="body2" className="text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
            A file with the exact same content already exists in your <span className="font-bold text-slate-800 dark:text-slate-200">Google Drive</span>. How would you like to proceed?
          </Typography>

          <div className="space-y-3">
            <button
              onClick={() => handleResolveDuplicate('replace')}
              className="w-full flex items-center justify-between p-4 rounded-2xl border border-slate-200 dark:border-white/5 hover:border-blue-500/50 hover:bg-blue-50/50 dark:hover:bg-blue-900/20 transition-all text-left group"
            >
              <div className="flex items-center gap-3">
                <RefreshCw size={20} className="text-blue-500 group-hover:rotate-180 transition-transform duration-500" />
                <div>
                  <Typography className="font-bold text-slate-800 dark:text-white text-sm">Replace Existing</Typography>
                  <Typography variant="caption" className="text-slate-500">The current version will be overwritten</Typography>
                </div>
              </div>
            </button>

            <button
              onClick={() => handleResolveDuplicate('version')}
              className="w-full flex items-center justify-between p-4 rounded-2xl border border-slate-200 dark:border-white/5 hover:border-blue-500/50 hover:bg-blue-50/50 dark:hover:bg-blue-900/20 transition-all text-left group"
            >
              <div className="flex items-center gap-3">
                <Copy size={20} className="text-purple-500" />
                <div>
                  <Typography className="font-bold text-slate-800 dark:text-white text-sm">Keep Both (Version)</Typography>
                  <Typography variant="caption" className="text-slate-500">Store as a new version: v2.0</Typography>
                </div>
              </div>
            </button>

            <button
              onClick={() => handleResolveDuplicate('skip')}
              className="w-full flex items-center justify-between p-4 rounded-2xl border border-slate-200 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/5 transition-all text-left group"
            >
              <div className="flex items-center gap-3">
                <X size={20} className="text-slate-400" />
                <div>
                  <Typography className="font-bold text-slate-800 dark:text-white text-sm">Skip Upload</Typography>
                  <Typography variant="caption" className="text-slate-500">Cancel the current upload operation</Typography>
                </div>
              </div>
            </button>
          </div>
        </DialogContent>
        <DialogActions className="p-4 pt-0">
          <Button onClick={() => setShowDuplicateModal(false)} className="w-full text-slate-500 font-bold normal-case hover:bg-transparent">
            View existing file details
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
