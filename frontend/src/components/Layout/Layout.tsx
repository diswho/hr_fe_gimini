import React from 'react';
import { AppBar, Toolbar, Typography, Button, Container, Box, Drawer, List, ListItem, ListItemButton, ListItemText, CssBaseline, IconButton, Divider } from '@mui/material';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import { useDispatch } from 'react-redux';
import { logout } from '../../store/auth/authSlice';
import { AppDispatch } from '../../store/store';

const drawerWidth = 240;

const mainNavItems = [
  { text: 'Dashboard', path: '/dashboard', icon: null }, // Add icons later if desired
  { text: 'Employees', path: '/employees', icon: null },
  { text: 'Leave', path: '/leave', icon: null },
  { text: 'Departments', path: '/departments', icon: null },
];

const salaryNavItems = [
  { text: 'Salary Components', path: '/salary', icon: null },
  { text: 'Employee Salaries', path: '/employee-salaries', icon: null },
];


const Layout: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const drawerContent = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        HR System
      </Typography>
      <Divider />
      <List>
        {mainNavItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton component={Link} to={item.path}>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <Typography variant="subtitle1" sx={{ my: 1, pl: 2, textAlign: 'left', color: 'text.secondary' }}>
        Payroll
      </Typography>
      <List>
        {salaryNavItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton component={Link} to={item.path}>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        <ListItem disablePadding>
          <ListItemButton onClick={handleLogout}>
            <ListItemText primary="Logout" />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar component="nav" position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
          >
            HR Management System
          </Typography>
          <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
            {mainNavItems.map((item) => (
              <Button key={item.text} sx={{ color: '#fff' }} component={Link} to={item.path}>
                {item.text}
              </Button>
            ))}
            {/* Simple dropdown for Salary for now, can be improved with Menu component */}
            <Button sx={{ color: '#fff' }} component={Link} to="/salary">Salary Components</Button>
            <Button sx={{ color: '#fff' }} component={Link} to="/employee-salaries">Employee Salaries</Button>
            <Button color="inherit" onClick={handleLogout}>
              Logout
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          <Toolbar />
          {drawerContent}
        </Drawer>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawerContent}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout;
