'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import Drawer from '@mui/material/Drawer';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';
import {
  FolderOpen,
  CloudUpload,
  Search,
  BarChart,
  Settings,
  LogOut,
  Moon,
  Sun,
  Menu as MenuIcon
} from 'lucide-react';

const drawerWidth = 280;

type UserRole = 'Admin' | 'Supervisor' | 'Staff';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [isClosing, setIsClosing] = React.useState(false);
  const [role, setRole] = React.useState<UserRole>('Staff');
  const [username, setUsername] = React.useState('Loading...');

  const router = useRouter();

  React.useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        if (user.role) setRole(user.role as UserRole);
        if (user.username) setUsername(user.username);
      } catch (e) { }
    } else {
      router.push('/');
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/');
  };

  const handleDrawerClose = () => {
    setIsClosing(true);
    setMobileOpen(false);
  };

  const handleDrawerTransitionEnd = () => {
    setIsClosing(false);
  };

  const pathname = usePathname();

  const handleDrawerToggle = () => {
    if (!isClosing) {
      setMobileOpen(!mobileOpen);
    }
  };

  const menuItems = [
    { title: 'My Files', icon: <FolderOpen size={20} />, path: '/dashboard', roles: ['Admin', 'Supervisor', 'Staff'] },
    { title: 'Upload', icon: <CloudUpload size={20} />, path: '/dashboard/upload', roles: ['Admin', 'Supervisor', 'Staff'] },
    { title: 'Semantic Search', icon: <Search size={20} />, path: '/dashboard/search', roles: ['Admin', 'Supervisor', 'Staff'] },
    { title: 'Analytics', icon: <BarChart size={20} />, path: '/dashboard/analytics', roles: ['Admin', 'Supervisor'] },
    { title: 'Settings', icon: <Settings size={20} />, path: '/dashboard/settings', roles: ['Admin'] },
  ];

  const filteredMenuItems = menuItems.filter(item => item.roles.includes(role));

  const drawer = (
    <div className="h-full flex flex-col bg-slate-950/90 backdrop-blur-xl border-r border-white/5 text-white">
      <Toolbar className="flex items-center justify-start px-8 py-10">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center shadow-lg shadow-blue-500/20 overflow-hidden">
            <img src="/logo.png" alt="SmartCloudTex Logo" className="w-10 h-10 object-contain" />
          </div>
          <Typography variant="h5" className="font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-rose-500 tracking-tight">
            SmartCloudTex
          </Typography>
        </div>
      </Toolbar>

      <List className="px-4 py-2 flex-1 space-y-1">
        {filteredMenuItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <ListItem key={item.title} disablePadding>
              <Link href={item.path} passHref className="w-full">
                <ListItemButton
                  className={`rounded-xl transition-all duration-300 py-3 group ${isActive
                    ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/20'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                >
                  <ListItemIcon sx={{ minWidth: '40px', color: 'inherit' }}>
                    <div className={isActive ? 'text-white' : 'group-hover:text-white transition-colors'}>
                      {item.icon}
                    </div>
                  </ListItemIcon>
                  <ListItemText
                    primary={item.title}
                    primaryTypographyProps={{
                      className: `font-semibold text-sm`
                    }}
                  />
                </ListItemButton>
              </Link>
            </ListItem>
          );
        })}
      </List>

      <Box className="p-6 mt-auto">
        <div className="glass-card bg-white/5 p-4 mb-4 border border-white/10">
          <div className="flex items-center gap-3 mb-3">
            <Avatar className="w-10 h-10 border-2 border-blue-500/50 uppercase">{username[0]}</Avatar>
            <div className="overflow-hidden">
              <Typography variant="subtitle2" className="font-bold truncate">{username}</Typography>
              <Typography variant="caption" className="text-blue-400 block">{role}</Typography>
            </div>
          </div>
        </div>
        <Divider className="bg-white/5 mb-4" />
        <ListItemButton onClick={handleLogout} className="rounded-xl text-rose-400 hover:bg-rose-500/10 transition-all py-3">
          <ListItemIcon className="text-rose-400 min-w-[40px]">
            <LogOut size={20} />
          </ListItemIcon>
          <ListItemText primary="Logout" primaryTypographyProps={{ className: 'font-semibold text-sm' }} />
        </ListItemButton>
      </Box>
    </div>
  );

  return (
    <Box sx={{ display: 'flex' }} className="min-h-screen bg-slate-50 dark:bg-gray-950">
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          bgcolor: 'transparent',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
        className="dark:border-slate-800/50"
      >
        <Toolbar className="justify-between px-6">
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
            className="text-slate-700 dark:text-slate-300"
          >
            <MenuIcon />
          </IconButton>

          <div className="flex-1 max-w-md hidden md:block">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
              <input
                type="text"
                placeholder="Search across all clouds..."
                className="w-full bg-slate-100 dark:bg-slate-900 border-none rounded-xl py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-blue-500/50 outline-none transition-all"
              />
            </div>
          </div>

          <Box className="flex items-center gap-2">
            <IconButton className="text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800">
              <Sun size={20} />
            </IconButton>
            <div className="h-6 w-[1px] bg-slate-200 dark:bg-slate-800 mx-2" />
            <div className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity">
              <div className="text-right hidden sm:block">
                <Typography variant="body2" className="font-bold text-slate-700 dark:text-slate-200 leading-none mb-1">{username}</Typography>
                <Typography variant="caption" className="text-slate-400">{role}</Typography>
              </div>
              <Avatar className="w-9 h-9 bg-blue-600 text-sm font-semibold shadow-lg shadow-blue-500/20 uppercase">{username[0]}</Avatar>
            </div>
          </Box>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onTransitionEnd={handleDrawerTransitionEnd}
          onClose={handleDrawerClose}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, border: 'none' },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, border: 'none' },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{ flexGrow: 1, p: { xs: 2, md: 4 }, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
        className="animate-in-fade"
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
}
