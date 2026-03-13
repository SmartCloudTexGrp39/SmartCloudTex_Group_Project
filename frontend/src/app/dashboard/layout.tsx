'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import { usePathname } from 'next/navigation';
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

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [isClosing, setIsClosing] = React.useState(false);

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
    { title: 'My Files', icon: <FolderOpen size={20} />, path: '/dashboard' },
    { title: 'Upload', icon: <CloudUpload size={20} />, path: '/dashboard/upload' },
    { title: 'Semantic Search', icon: <Search size={20} />, path: '/dashboard/search' },
    { title: 'Analytics', icon: <BarChart size={20} />, path: '/dashboard/analytics' },
    { title: 'Settings', icon: <Settings size={20} />, path: '/dashboard/settings' },
  ];

  const drawer = (
    <div className="h-full flex flex-col bg-[#0f172a] text-white">
      <Toolbar className="flex items-center justify-center py-8">
        <Typography variant="h5" noWrap component="div" className="font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-rose-400">
          SmartCloudTex
        </Typography>
      </Toolbar>

      <List className="px-4 py-2 flex-1">
        {menuItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <ListItem key={item.title} disablePadding className="mb-2">
              <Link href={item.path} passHref style={{ textDecoration: 'none', color: 'inherit', width: '100%' }}>
                <ListItemButton
                  className={`rounded-xl transition-all duration-200 py-3 ${isActive
                    ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/30'
                    : 'text-white/70 hover:text-white hover:bg-blue-400/20'
                    }`}
                >
                  <ListItemIcon sx={{ minWidth: '40px', color: 'white !important' }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.title}
                    primaryTypographyProps={{
                      className: `font-semibold text-sm ${isActive ? 'text-white' : ''}`
                    }}
                  />
                </ListItemButton>
              </Link>
            </ListItem>
          );
        })}
      </List>

      <Box className="p-4 mt-auto">
        <Divider className="bg-white/10 mb-4" />
        <ListItem disablePadding>
          <ListItemButton className="rounded-xl text-rose-400 hover:bg-rose-500/10 transition-all py-3">
            <ListItemIcon className="text-rose-400 min-w-[40px]">
              <LogOut size={20} />
            </ListItemIcon>
            <ListItemText primary="Logout" primaryTypographyProps={{ className: 'font-semibold text-sm' }} />
          </ListItemButton>
        </ListItem>
      </Box>
    </div>
  );

  return (
    <Box sx={{ display: 'flex' }} className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          bgcolor: 'background.paper',
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
        className="dark:bg-slate-900 dark:border-slate-800"
      >
        <Toolbar>
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
          <Box className="flex-1" />
          <Box className="flex items-center gap-4">
            <IconButton className="text-slate-500 dark:text-slate-400">
              <Sun size={20} />
            </IconButton>
            <Avatar className="w-8 h-8 bg-blue-600 text-sm font-semibold">SA</Avatar>
          </Box>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onTransitionEnd={handleDrawerTransitionEnd}
          onClose={handleDrawerClose}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
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
        sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
}
