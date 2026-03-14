'use client';

import * as React from 'react';
import { 
  Typography, 
  Grid, 
  Paper, 
  Box, 
  Button, 
  Switch,
  Avatar,
  Chip
} from '@mui/material';
import { 
  Cloud, 
  Check, 
  Plus, 
  AlertTriangle,
  Info
} from 'lucide-react';

export default function SettingsPage() {
  const [accounts, setAccounts] = React.useState([
    { 
      id: 'gdrive', 
      name: 'Google Drive', 
      email: 'tex.admin@gmail.com', 
      connected: true, 
      quota: { used: '12.4 GB', total: '15 GB', percentage: 82 },
      color: 'blue'
    },
    { 
      id: 'dropbox', 
      name: 'Dropbox', 
      email: 'abishai.s@dropbox.com', 
      connected: true, 
      quota: { used: '1.2 GB', total: '2 GB', percentage: 60 },
      color: 'sky'
    },
    { 
      id: 'onedrive', 
      name: 'OneDrive', 
      email: 'not connected', 
      connected: false, 
      quota: { used: '0 GB', total: '5 GB', percentage: 0 },
      color: 'indigo'
    },
  ]);

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in-slide-up">
      <div>
        <Typography variant="h4" className="font-extrabold text-slate-900 dark:text-white mb-2">
          Cloud Accounts
        </Typography>
        <Typography variant="body1" className="text-slate-500 dark:text-slate-400">
          Connect and manage your cloud storage providers to expand your available quota.
        </Typography>
      </div>

      <Grid container spacing={4}>
        {accounts.map((account) => (
          <Grid size={{ xs: 12 }} key={account.id}>
            <Paper elevation={0} className="glass-card p-6 border-slate-200/50 dark:border-white/5 overflow-hidden relative">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-2xl bg-${account.color}-500 flex items-center justify-center shadow-lg shadow-${account.color}-500/20`}>
                    <Cloud className="text-white" size={28} />
                  </div>
                  <div>
                    <Typography variant="h6" className="font-bold !text-black dark:text-white leading-tight">
                      {account.name}
                    </Typography>
                    <Typography variant="body2" className="text-slate-500 font-medium">
                      {account.connected ? account.email : 'Click "Connect" to link your account'}
                    </Typography>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  {account.connected ? (
                    <div className="text-right hidden sm:block mr-4">
                      <div className="flex items-center gap-2 justify-end mb-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Usage</span>
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-200">{account.quota.used} / {account.quota.total}</span>
                      </div>
                      <div className="w-32 bg-slate-100 dark:bg-white/5 rounded-full h-1.5 overflow-hidden">
                        <div 
                          className={`h-1.5 rounded-full bg-${account.color}-500`}
                          style={{ width: `${account.quota.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  ) : null}
                  
                  {account.connected ? (
                    <Button 
                      variant="outlined" 
                      className="border-rose-100 text-rose-500 hover:bg-rose-50 dark:border-rose-900/30 dark:hover:bg-rose-900/20 rounded-xl px-6 py-2 normal-case font-bold"
                    >
                      Disconnect
                    </Button>
                  ) : (
                    <Button 
                      variant="contained" 
                      className={`bg-${account.color}-600 hover:bg-${account.color}-700 rounded-xl px-8 py-2.5 shadow-lg shadow-${account.color}-500/20 normal-case font-bold`}
                      startIcon={<Plus size={18} />}
                    >
                      Connect Account
                    </Button>
                  )}
                </div>
              </div>

              {account.connected && account.quota.percentage > 90 && (
                <div className="mt-6 p-4 bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/30 rounded-xl flex items-start gap-3">
                  <AlertTriangle className="text-amber-500 mt-0.5" size={18} />
                  <div>
                    <Typography variant="subtitle2" className="font-bold text-amber-800 dark:text-amber-300">Storage almost full</Typography>
                    <Typography variant="caption" className="text-amber-700/70 dark:text-amber-400/70 block">
                      You've used {account.quota.percentage}% of your {account.name} storage. Consider cleaning up files or connecting another account.
                    </Typography>
                  </div>
                </div>
              )}
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Paper elevation={0} className="glass-card p-6 border-blue-500/20 bg-blue-50/50 dark:bg-blue-900/10">
        <div className="flex gap-4">
          <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl text-blue-600 self-start">
            <Info size={24} />
          </div>
          <div>
            <Typography variant="h6" className="font-bold text-slate-800 dark:text-white mb-1">
              Smart Storage Routing
            </Typography>
            <Typography variant="body2" className="text-slate-600 dark:text-slate-400 leading-relaxed">
              SmartCloud automatically routes files to the most optimal cloud based on size, frequency, and remaining quota. By connecting multiple free accounts, you can create a massive unified storage pool.
            </Typography>
            <Button className="mt-4 text-blue-600 font-bold normal-case p-0 hover:bg-transparent">
              Learn how routing works →
            </Button>
          </div>
        </div>
      </Paper>
    </div>
  );
}
