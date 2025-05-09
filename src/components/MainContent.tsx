import { useState } from 'react';
import { Box, Typography, Paper, Card, CardContent, Grid, Alert, CircularProgress } from '@mui/material';
import { useGatewayStore } from '../store/useGatewayStore';
import { useKongApi } from '../hooks/useKongApi';

type EntityType = 'services' | 'routes' | 'consumers' | 'plugins' | 'certificates' | 'upstreams' | null;

interface MainContentProps {
  selectedEntity?: EntityType;
}

export const MainContent = ({ selectedEntity }: MainContentProps) => {
  const { gateways, activeGatewayId } = useGatewayStore();
  const { isConnected, error } = useKongApi();
  const [loading, setLoading] = useState(false);
  
  // Check if we have any gateways configured yet
  const hasGateways = gateways.length > 0;
  
  // Check if we have an active gateway selected
  const hasActiveGateway = Boolean(activeGatewayId);
  
  // If no entity is selected, show the welcome screen
  if (!selectedEntity) {
    return (
      <Box sx={{ paddingTop: 2 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Welcome to GorillaGloveBox
        </Typography>
        <Typography variant="body1" gutterBottom color="text.secondary">
          A GUI for Kong Admin API with all the bells and whistles
        </Typography>
        
        {!hasGateways && (
          <Alert severity="info" sx={{ mt: 2 }}>
            To begin, add a Kong Gateway connection using the dropdown in the top-right corner.
          </Alert>
        )}
        
        {hasGateways && !hasActiveGateway && (
          <Alert severity="info" sx={{ mt: 2 }}>
            Select a gateway from the dropdown in the top-right corner to connect.
          </Alert>
        )}
        
        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
        
        <Paper sx={{ p: 3, mt: 4, backgroundColor: 'rgba(63, 81, 181, 0.05)' }}>
          <Typography variant="h6" gutterBottom>
            Getting Started
          </Typography>
          <Typography variant="body2" paragraph>
            To begin using GorillaGloveBox, add a Kong Gateway connection using the dropdown in the top-right corner.
          </Typography>
          <Typography variant="body2" paragraph>
            Once connected, you can browse and manage your Kong entities from the sidebar navigation.
          </Typography>
        </Paper>
        
        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Services
                </Typography>
                <Typography variant="body2">
                  Configure upstream services that Kong will proxy to.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Routes
                </Typography>
                <Typography variant="body2">
                  Define how requests are routed to your services.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Plugins
                </Typography>
                <Typography variant="body2">
                  Add features to your services like authentication, rate limiting, and more.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    );
  }
  
  // If entity is selected but we're not connected to a gateway, show message
  if (!isConnected) {
    return (
      <Box sx={{ paddingTop: 2 }}>
        <Alert severity="warning">
          Please connect to a Kong Gateway to manage {selectedEntity}.
        </Alert>
      </Box>
    );
  }
  
  // Show loading state if we're loading data
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }
  
  // Placeholder for actual entity management screens
  return (
    <Box sx={{ paddingTop: 2 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        {selectedEntity.charAt(0).toUpperCase() + selectedEntity.slice(1)}
      </Typography>
      <Paper sx={{ p: 3, mt: 2 }}>
        <Typography variant="body1">
          This is a placeholder for the {selectedEntity} management screen. In a complete implementation, 
          this would show a list of {selectedEntity} and allow you to create, edit, and delete them.
        </Typography>
      </Paper>
    </Box>
  );
};
