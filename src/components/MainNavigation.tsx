import { List, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider, Typography, Box } from '@mui/material';
import ApiIcon from '@mui/icons-material/Api';
import RouterIcon from '@mui/icons-material/Router';
import GroupIcon from '@mui/icons-material/Group';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import SecurityIcon from '@mui/icons-material/Security';
import StorageIcon from '@mui/icons-material/Storage';
import SettingsIcon from '@mui/icons-material/Settings';

type EntityType = 'services' | 'routes' | 'consumers' | 'plugins' | 'certificates' | 'upstreams' | null;

interface MainNavigationProps {
  selectedEntity: EntityType;
  onSelectEntity: (entity: EntityType) => void;
}

export const MainNavigation = ({ selectedEntity, onSelectEntity }: MainNavigationProps) => {
  // Kong entity categories with their API endpoint names
  const entityCategories = [
    { name: 'Services', endpoint: 'services', icon: <ApiIcon /> },
    { name: 'Routes', endpoint: 'routes', icon: <RouterIcon /> },
    { name: 'Consumers', endpoint: 'consumers', icon: <GroupIcon /> },
    { name: 'Plugins', endpoint: 'plugins', icon: <SecurityIcon /> },
    { name: 'Certificates', endpoint: 'certificates', icon: <VpnKeyIcon /> },
    { name: 'Upstreams', endpoint: 'upstreams', icon: <StorageIcon /> },
  ];

  const handleSelectEntity = (endpoint: EntityType) => {
    onSelectEntity(endpoint);
  };

  return (
    <List>
      <Box sx={{ px: 2, py: 1 }}>
        <Typography variant="subtitle2" color="text.secondary">
          KONG ENTITIES
        </Typography>
      </Box>
      
      {entityCategories.map((category) => (
        <ListItem key={category.name} disablePadding>
          <ListItemButton 
            onClick={() => handleSelectEntity(category.endpoint as EntityType)}
            selected={selectedEntity === category.endpoint}
          >
            <ListItemIcon>
              {category.icon}
            </ListItemIcon>
            <ListItemText primary={category.name} />
          </ListItemButton>
        </ListItem>
      ))}
      
      <Divider sx={{ my: 2 }} />
      
      <ListItem disablePadding>
        <ListItemButton onClick={() => handleSelectEntity(null)}>
          <ListItemIcon>
            <SettingsIcon />
          </ListItemIcon>
          <ListItemText primary="Settings" />
        </ListItemButton>
      </ListItem>
    </List>
  );
};
