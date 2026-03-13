'use client';

import * as React from 'react';
import { Typography, Box, Paper, Switch, FormControlLabel, Avatar, Button, Divider } from '@mui/material';
import { User, Shield, Bell, Cloud, Database } from 'lucide-react';

export default function SettingsPage() {
    return (
        <Box className="max-w-4xl">
            <Typography variant="h4" className="font-bold text-slate-800 mb-2">
                Settings
            </Typography>
            <Typography variant="body1" className="text-slate-500 mb-8">
                Manage your profile, security preferences, and cloud integrations.
            </Typography>

            <Paper elevation={0} className="border border-slate-200 rounded-3xl bg-white overflow-hidden mb-8">
                <div className="p-8 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <Avatar className="w-20 h-20 bg-blue-600 text-xl font-bold">SA</Avatar>
                        <div>
                            <Typography variant="h6" className="font-bold text-slate-800">SME Admin</Typography>
                            <Typography variant="body2" className="text-slate-500">admin@smartcloudtex.com</Typography>
                            <div className="mt-2 inline-block px-3 py-1 bg-blue-100 text-blue-600 rounded-lg text-xs font-bold uppercase tracking-wider">
                                System Administrator
                            </div>
                        </div>
                    </div>
                    <Button variant="outlined" className="rounded-xl border-slate-200 text-slate-600 capitalize font-bold">
                        Edit Profile
                    </Button>
                </div>

                <div className="p-8 space-y-8">
                    <section>
                        <Typography variant="subtitle1" className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <Shield size={20} className="text-blue-500" />
                            Security & Privacy
                        </Typography>
                        <div className="space-y-4">
                            <FormControlLabel
                                control={<Switch defaultChecked />}
                                label={
                                    <div>
                                        <Typography className="font-bold text-sm text-slate-700">Multi-Factor Authentication</Typography>
                                        <Typography variant="caption" className="text-slate-400">Adds an extra layer of security to your account.</Typography>
                                    </div>
                                }
                                className="w-full flex-row-reverse justify-between ml-0 px-4 py-3 rounded-2xl bg-white border border-slate-100"
                            />
                            <FormControlLabel
                                control={<Switch defaultChecked />}
                                label={
                                    <div>
                                        <Typography className="font-bold text-sm text-slate-700">AI Metadata Indexing</Typography>
                                        <Typography variant="caption" className="text-slate-400">Allow AI to extract keywords for faster retrieval.</Typography>
                                    </div>
                                }
                                className="w-full flex-row-reverse justify-between ml-0 px-4 py-3 rounded-2xl bg-white border border-slate-100"
                            />
                        </div>
                    </section>

                    <Divider />

                    <section>
                        <Typography variant="subtitle1" className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <Cloud size={20} className="text-blue-500" />
                            Cloud Integrations
                        </Typography>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {['Google Drive', 'Dropbox', 'OneDrive'].map((c) => (
                                <div key={c} className="p-4 rounded-2xl border border-slate-100 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Cloud size={20} className="text-slate-400" />
                                        <Typography className="font-bold text-sm text-slate-700">{c}</Typography>
                                    </div>
                                    <Typography variant="caption" className="text-emerald-500 font-bold">Active</Typography>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            </Paper>
        </Box>
    );
}
