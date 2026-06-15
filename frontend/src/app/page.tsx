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
import { login, getProfile } from './api';

export default function LoginPage() {
  const router = useRouter();

  const [showPassword, setShowPassword] = React.useState(false);
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [role, setRole] = React.useState('Staff');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');

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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const data = await login(username, password);
      localStorage.setItem('token', data.access_token);
      
      const profile = await getProfile(data.access_token);
      
      if (profile.role !== role) {
        localStorage.removeItem('token');
        throw new Error(`Account role is ${profile.role}, not ${role}. Please select the correct role.`);
      }

      localStorage.setItem('user', JSON.stringify(profile));
      
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{ 
        backgroundImage: 'url(/light_cloth_bg.png)', 
        backgroundSize: 'cover', 
        backgroundPosition: 'center' 
      }}
    >
      <div className="absolute inset-0 bg-stone-900/20 dark:bg-stone-900/60 backdrop-blur-[2px]"></div>

      <Grow in={true} timeout={800}>
        <Paper
          elevation={0}
          className="w-full max-w-md p-8 rounded-3xl border border-white/40 dark:border-stone-800 bg-white/80 dark:bg-stone-900/80 backdrop-blur-xl shadow-2xl z-10"
        >
          <Box className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-md overflow-hidden p-1 border border-stone-100 dark:border-stone-800">
              <img src="/logo.png" alt="SmartCloudTex Logo" className="w-full h-full object-contain" />
            </div>
            <Typography variant="h5" className="font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-rose-500 tracking-tight">
              SmartCloudTex
            </Typography>
          </Box>

          <Box className="mb-8">
            <Typography variant="h3" className="font-bold text-stone-800 dark:text-white mb-2 tracking-tight">
              Welcome back
            </Typography>
            <Typography variant="body1" className="text-stone-500 dark:text-stone-400">
              AI-Enhanced File Storage for Textile SMEs
            </Typography>
          </Box>

          <Box component="form" onSubmit={handleLogin} display="flex" flexDirection="column" gap={3}>
            {error && (
              <Alert severity="error" className="rounded-xl font-medium">
                {error}
              </Alert>
            )}

            <Box className="mb-2">
              <Typography variant="caption" className="text-stone-500 font-bold ml-2 uppercase tracking-wide">
                Select Your Role
              </Typography>
              <div className="flex bg-stone-100 dark:bg-stone-800 p-1.5 rounded-full items-center mt-2 shadow-inner border border-stone-200 dark:border-stone-700">
                {['Admin', 'Supervisor', 'Staff'].map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRole(r)}
                    className={`flex-1 text-center py-2.5 rounded-full font-bold transition-all text-sm ${
                      role === r
                        ? 'bg-blue-600 text-white shadow-md transform scale-[1.02]'
                        : 'text-stone-500 hover:text-stone-700 dark:text-stone-400 dark:hover:text-white hover:bg-stone-200/50 dark:hover:bg-stone-700/50'
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
              placeholder="Enter your username"
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              InputLabelProps={{ shrink: true }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <User size={20} className="text-stone-400" />
                  </InputAdornment>
                ),
                className: "rounded-xl bg-white light:bg-stone-800"
              }}
            />

            <TextField
              sx={textFieldStyles}
              fullWidth
              variant="outlined"
              label="Password"
              placeholder="Enter your password"
              type={showPassword ? 'text' : 'password'}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputLabelProps={{ shrink: true }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock size={20} className="text-stone-400" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      className="text-stone-400"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </IconButton>
                  </InputAdornment>
                ),
                className: "rounded-xl bg-white light:bg-stone-800"
              }}
            />

            <Typography
              variant="body2"
              className="text-right text-blue-600 dark:text-blue-400 font-medium cursor-pointer hover:underline"
            >
              Forgot password?
            </Typography>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              className={`bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-3.5 shadow-lg shadow-blue-500/30 font-semibold text-base capitalize ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
              disableElevation
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </Box>

          <Typography variant="body2" className="text-center text-stone-500 dark:text-stone-400 mt-8">
            Don't have an account?{' '}
            <span
              className="text-blue-600 dark:text-blue-400 font-medium cursor-pointer hover:underline"
              onClick={() => router.push('/register')}
            >
              Sign up
            </span>
          </Typography>
        </Paper>
      </Grow>
    </div>
  );
}
