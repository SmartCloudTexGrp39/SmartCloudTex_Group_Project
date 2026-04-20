'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  InputAdornment,
  IconButton,
  Grow,
  Alert
} from '@mui/material';
import { Mail, Lock, Eye, EyeOff, User } from 'lucide-react';
import { register } from '../api';

export default function RegisterPage() {
  const router = useRouter();

  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  
  const [username, setUsername] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [role, setRole] = React.useState('Staff');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [successMsg, setSuccessMsg] = React.useState('');

  const textFieldStyles = {
    '& .MuiOutlinedInput-root': {
      '& fieldset': { borderColor: 'rgba(148, 163, 184, 0.3)' },
      '&:hover fieldset': { borderColor: 'rgba(148, 163, 184, 0.5)' },
      '&.Mui-focused fieldset': { borderColor: '#2563eb', borderWidth: '2px' },
      '& input::placeholder': { color: '#94a3b8', opacity: 1 },
      color: 'inherit'
    },
    '& .MuiInputLabel-root': { color: '#64748b' },
    '& .MuiInputLabel-root.Mui-focused': { color: '#2563eb' }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      await register(username, email, role, password);
      setSuccessMsg('Registration successful! Redirecting to login...');
      setTimeout(() => {
        router.push('/');
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-slate-900 p-4 relative overflow-hidden">
      {/* Decorative background blobs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-rose-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-96 h-96 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

      <Grow in={true} timeout={800}>
        <Paper
          elevation={0}
          className="w-full max-w-md p-8 rounded-3xl border border-white/40 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-2xl z-10"
        >
          <Box className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-md overflow-hidden p-1 border border-slate-100 dark:border-slate-800">
              <img src="/logo.png" alt="SmartCloudTex Logo" className="w-full h-full object-contain" />
            </div>
            <Typography variant="h5" className="font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-rose-500 tracking-tight">
              SmartCloudTex
            </Typography>
          </Box>

          <Box className="mb-8">
            <Typography variant="h3" className="font-bold text-slate-800 dark:text-white mb-2 tracking-tight">
              User Registration
            </Typography>
            <Typography variant="body1" className="text-slate-500 dark:text-slate-400">
              Join the AI-Enhanced File Storage for Textile SMEs
            </Typography>
          </Box>

          <Box component="form" onSubmit={handleRegister} display="flex" flexDirection="column" gap={3}>
            {error && (
              <Alert severity="error" className="rounded-xl font-medium">
                {error}
              </Alert>
            )}
            {successMsg && (
              <Alert severity="success" className="rounded-xl font-medium">
                {successMsg}
              </Alert>
            )}

            <Box className="mb-2">
              <Typography variant="caption" className="text-slate-500 font-bold ml-2 uppercase tracking-wide">
                Select Your Role
              </Typography>
              <div className="flex bg-slate-100 dark:bg-slate-800 p-1.5 rounded-full items-center mt-2 shadow-inner border border-slate-200 dark:border-slate-700">
                {['Admin', 'Supervisor', 'Staff'].map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRole(r)}
                    className={`flex-1 text-center py-2.5 rounded-full font-bold transition-all text-sm ${
                      role === r
                        ? 'bg-blue-600 text-white shadow-md transform scale-[1.02]'
                        : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-slate-700/50'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </Box>

            <TextField
              sx={textFieldStyles}
              fullWidth
              variant="outlined"
              label="Username"
              placeholder="Create a username"
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              InputLabelProps={{ shrink: true }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <User size={20} className="text-slate-400" />
                  </InputAdornment>
                ),
                className: "rounded-xl bg-white light:bg-slate-800"
              }}
            />

            <TextField
              sx={textFieldStyles}
              fullWidth
              variant="outlined"
              label="Email Address"
              placeholder="Enter your email address"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              InputLabelProps={{ shrink: true }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Mail size={20} className="text-slate-400" />
                  </InputAdornment>
                ),
                className: "rounded-xl bg-white light:bg-slate-800"
              }}
            />

            <TextField
              sx={textFieldStyles}
              fullWidth
              variant="outlined"
              label="Create Password"
              placeholder="Create a strong password"
              type={showPassword ? 'text' : 'password'}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputLabelProps={{ shrink: true }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock size={20} className="text-slate-400" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      className="text-slate-400"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </IconButton>
                  </InputAdornment>
                ),
                className: "rounded-xl bg-white light:bg-slate-800"
              }}
            />

            <TextField
              sx={textFieldStyles}
              fullWidth
              variant="outlined"
              label="Re-enter Password"
              placeholder="Confirm your password"
              type={showConfirmPassword ? 'text' : 'password'}
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              InputLabelProps={{ shrink: true }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock size={20} className="text-slate-400" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      edge="end"
                      className="text-slate-400"
                    >
                      {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </IconButton>
                  </InputAdornment>
                ),
                className: "rounded-xl bg-white light:bg-slate-800"
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              className={`bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-3.5 shadow-lg shadow-blue-500/30 font-semibold text-base capitalize ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
              disableElevation
            >
              {loading ? 'Registering...' : 'Register'}
            </Button>
          </Box>

          <Typography variant="body2" className="text-center text-slate-500 dark:text-slate-400 mt-8">
            Already have an account?{' '}
            <span
              className="text-blue-600 dark:text-blue-400 font-medium cursor-pointer hover:underline"
              onClick={() => router.push('/')}
            >
              Sign in
            </span>
          </Typography>
        </Paper>
      </Grow>
    </div>
  );
}
