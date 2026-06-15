'use client';

import * as React from 'react';
import { 
  Typography, 
  Grid, 
  Paper, 
  Button, 
  Chip
} from '@mui/material';
import { 
  Cloud, 
  HardDrive, 
  Server, 
  CheckCircle2, 
  XCircle, 
  Terminal,
  Info
} from 'lucide-react';
import { fetchIntegrations, disconnectIntegration } from '../../api';

interface Integration {
  id: string;
  status: string;
  has_credentials?: boolean;
}

export default function SettingsPage() {
  const [integrations, setIntegrations] = React.useState<Integration[]>([]);

  const loadData = async () => {
    const data = await fetchIntegrations();
    setIntegrations(data);
  };

  React.useEffect(() => {
    loadData();
  }, []);

  const handleDisconnect = async (id: string) => {
    try {
      await disconnectIntegration(id);
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const icons: Record<string, React.ReactNode> = {
    'Google Drive': <Cloud size={28} className="text-blue-500" />,
    'Dropbox': <HardDrive size={28} className="text-sky-500" />,
    'OneDrive': <Server size={28} className="text-indigo-500" />
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in-fade pb-10">
      <div>
        <Typography variant="h4" className="font-extrabold text-stone-900 dark:text-white mb-2 tracking-tight">
          Integration Settings
        </Typography>
        <Typography variant="body1" className="text-stone-500 dark:text-stone-400 font-medium">
          Manage your connections to external cloud providers for seamless file routing.
        </Typography>
      </div>

      <Grid container spacing={4}>
        {integrations.length === 0 ? (
          <div className="w-full text-center py-12">
            <Typography className="text-stone-500">Loading integrations...</Typography>
          </div>
        ) : (
          integrations.map((integration, idx) => (
            <Grid size={{ xs: 12 }} key={idx}>
              <Paper elevation={0} className="glass-card p-6 border-stone-200/50 dark:border-white/5 relative overflow-hidden group">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                  <div className="flex items-center gap-6">
                    <div className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-100 dark:border-white/10 shadow-sm">
                      {icons[integration.id]}
                    </div>
                    <div>
                      <Typography variant="h6" className="font-bold text-stone-900 dark:text-white mb-1">
                        {integration.id}
                      </Typography>
                      <div className="flex items-center gap-2">
                        {integration.status === 'Connected' ? (
                          <Chip icon={<CheckCircle2 size={14} className="!text-emerald-500" />} label="Connected" size="small" className="bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-900/50 font-bold" />
                        ) : integration.status === 'Pending Authentication' ? (
                          <Chip icon={<Terminal size={14} className="!text-amber-500" />} label="Pending Authentication" size="small" className="bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-900/50 font-bold" />
                        ) : (
                          <Chip icon={<XCircle size={14} className="!text-stone-400" />} label="Not Configured" size="small" className="bg-stone-100 text-stone-600 border border-stone-200 dark:bg-stone-800 dark:text-stone-400 dark:border-stone-700 font-bold" />
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="w-full md:w-auto flex flex-col items-start md:items-end gap-2">
                    {integration.status === 'Connected' ? (
                      <Button 
                        variant="outlined" 
                        color="error"
                        className="rounded-xl font-bold border-rose-200 dark:border-rose-900/50 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 normal-case px-6 py-2"
                        onClick={() => handleDisconnect(integration.id)}
                      >
                        Disconnect Account
                      </Button>
                    ) : (
                      <div className="bg-stone-900 rounded-xl p-3 text-left w-full max-w-sm border border-stone-800 shadow-inner">
                        <Typography variant="caption" className="text-stone-400 font-mono block mb-1">
                          Run locally to authenticate:
                        </Typography>
                        <code className="text-emerald-400 font-mono text-sm block font-bold">
                          {integration.id === 'Google Drive' ? 'python setup_gdrive.py' :
                           integration.id === 'Dropbox' ? 'python setup_dropbox.py' :
                           'python setup_onedrive.py'}
                        </code>
                      </div>
                    )}
                  </div>
                </div>
              </Paper>
            </Grid>
          ))
        )}
      </Grid>
      
      <Paper elevation={0} className="glass-card p-6 border-blue-500/20 bg-blue-50/50 dark:bg-blue-900/10 mt-8">
        <div className="flex gap-4">
          <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl text-blue-600 self-start">
            <Info size={24} />
          </div>
          <div>
            <Typography variant="h6" className="font-bold text-stone-800 dark:text-white mb-1">
              Smart Storage Routing
            </Typography>
            <Typography variant="body2" className="text-stone-600 dark:text-stone-400 leading-relaxed">
              SmartCloud automatically routes files to the most optimal cloud based on size, frequency, and remaining quota. By connecting multiple free accounts, you can create a massive unified storage pool.
            </Typography>
          </div>
        </div>
      </Paper>
    </div>
  );
}
