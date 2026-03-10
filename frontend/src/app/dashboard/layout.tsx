'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
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

  const handleDrawerToggle = () => {
    if (!isClosing) {
      setMobileOpen(!mobileOpen);
    }
  };

  const menuItems = [
    { title: 'My Files', icon: <FolderOpen size={20} /> },
    { title: 'Upload', icon: <CloudUpload size={20} /> },
    { title: 'Semantic Search', icon: <Search size={20} /> },
    { title: 'Analytics', icon: <BarChart size={20} /> },
    { title: 'Settings', icon: <Settings size={20} /> },
  ];

  const drawer = (
    <div className="h-full flex flex-col bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800">
      <Toolbar className="flex items-center justify-center py-6">
        <Typography variant="h6" noWrap component="div" className="font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-rose-500">
          SmartCloudTex
        </Typography>
      </Toolbar>
      <Divider className="dark:border-slate-800" />
      <List className="px-3 py-4 flex-1">
        {menuItems.map((item, index) => (
          <ListItem key={item.title} disablePadding className="mb-2">
            <ListItemButton className="rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all">
              <ListItemIcon className="text-slate-500 dark:text-slate-400 min-w-[40px]">
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.title} 
                primaryTypographyProps={{ className: 'font-medium text-sm' }} 
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider className="dark:border-slate-800" />
      <Box className="p-4">
        <ListItem disablePadding>
          <ListItemButton className="rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-all">
            <ListItemIcon className="text-rose-500 min-w-[40px]">
              <LogOut size={20} />
            </ListItemIcon>
            <ListItemText primary="Logout" primaryTypographyProps={{ className: 'font-medium text-sm' }} />
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
