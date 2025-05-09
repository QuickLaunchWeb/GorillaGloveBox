import { useState } from 'react';
import { Box, Drawer, AppBar, Toolbar, Typography, Divider, IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { MainNavigation } from './components/MainNavigation';
import { MainContent } from './components/MainContent';
import { GatewaySelector } from './components/GatewaySelector';

const drawerWidth = 240;

// Type definition for the entity selection
type EntityType = 'services' | 'routes' | 'consumers' | 'plugins' | 'certificates' | 'upstreams' | null;

function App() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedEntity, setSelectedEntity] = useState<EntityType>(null);
  
  const handleDrawerOpen = () => {
    setDrawerOpen(true);
  };
  
  const handleDrawerClose = () => {
    setDrawerOpen(false);
  };
  
  const handleSelectEntity = (entity: EntityType) => {
    setSelectedEntity(entity);
    
    // On mobile, close the drawer after selection
    if (window.innerWidth < 600) {
      setDrawerOpen(false);
    }
  };
  
  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      {/* Top Navigation Bar */}
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{ mr: 2, ...(drawerOpen && { display: 'none' }) }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            GorillaGloveBox
          </Typography>
          <GatewaySelector />
        </Toolbar>
      </AppBar>
      
      {/* Sidebar Navigation */}
      <Drawer
        variant="persistent"
        anchor="left"
        open={drawerOpen}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
      >
        <Toolbar sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', px: 1 }}>
          <IconButton onClick={handleDrawerClose}>
            <ChevronLeftIcon />
          </IconButton>
        </Toolbar>
        <Divider />
        <MainNavigation 
          selectedEntity={selectedEntity} 
          onSelectEntity={handleSelectEntity} 
        />
      </Drawer>
      
      {/* Main Content Area */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          mt: '64px', // Toolbar height
          transition: (theme) => theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
          ...(drawerOpen && {
            ml: `${drawerWidth}px`,
            transition: (theme) => theme.transitions.create('margin', {
              easing: theme.transitions.easing.easeOut,
              duration: theme.transitions.duration.enteringScreen,
            }),
          }),
        }}
      >
        <MainContent selectedEntity={selectedEntity} />
      </Box>
    </Box>
  );
}

export default App;
