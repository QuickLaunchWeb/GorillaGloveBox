import React, { useState } from 'react';
import type { MouseEvent, ChangeEvent } from 'react';
import { useSnackbar } from 'notistack';
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  FormControlLabel,
  Switch,
  Menu,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Divider
} from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { useGatewayStore, type AuthType } from '../store/useGatewayStore';
import { testKongConnection } from '@/utils/kongConnection';

type GatewayFormState = {
  name: string;
  adminUrl: string;
  authType: AuthType;
  username?: string;
  password?: string;
  token?: string;
  skipTlsVerify: boolean;
};

export const GatewaySelector = () => {
  const { gateways, activeGatewayId, addGateway, removeGateway, setActiveGateway } = useGatewayStore();
  const { enqueueSnackbar } = useSnackbar();
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [newGateway, setNewGateway] = useState<GatewayFormState>({
    name: '',
    adminUrl: '',
    authType: 'none',
    skipTlsVerify: true,
  });
  
  const [loading, setLoading] = useState(false);

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleOpenDialog = () => {
    setDialogOpen(true);
    handleClose();
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const handleFormChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setNewGateway((prev: GatewayFormState) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleAuthTypeChange = (e: ChangeEvent<{ value: unknown }>) => {
    setNewGateway((prev: GatewayFormState) => ({
      ...prev,
      authType: e.target.value as AuthType,
    }));
  };

  const handleSelectGateway = (id: string) => {
    setActiveGateway(id);
    handleClose();
  };

  const handleAddGateway = () => {
    addGateway(newGateway);
    handleCloseDialog();
    setNewGateway({
      name: '',
      adminUrl: '',
      authType: 'none',
      skipTlsVerify: true,
    });
  };

  const handleTestAndSave = async () => {
    console.log('Test & Save clicked'); // Debug log
    if (!newGateway.name || !newGateway.adminUrl) {
      console.log('Validation failed - missing name or URL');
      return;
    }
    
    setLoading(true);
    try {
      console.log('Testing connection to:', newGateway.adminUrl);
      const result = await testKongConnection(
        newGateway.adminUrl,
        newGateway.skipTlsVerify
      );
      console.log('Connection result:', result);
      
      if (result.success) {
        enqueueSnackbar('Connection test successful!', { variant: 'success' });
        console.log('Adding gateway:', newGateway);
        handleAddGateway();
      } else {
        enqueueSnackbar(`Connection failed: ${result.message}`, { variant: 'error' });
      }
    } catch (error) {
      console.error('Test connection error:', error);
      enqueueSnackbar('An unexpected error occurred', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveGateway = (id: string, e: MouseEvent) => {
    e.stopPropagation();
    removeGateway(id);
  };

  const renderAuthFields = () => {
    switch(newGateway.authType) {
      case 'basic-auth':
        return (
          <>
            <TextField
              label="Username"
              name="username"
              value={newGateway.username || ''}
              onChange={handleFormChange}
              fullWidth
              required
            />
            <TextField
              label="Password"
              name="password"
              type="password"
              value={newGateway.password || ''}
              onChange={handleFormChange}
              fullWidth
              required
            />
          </>
        );
      case 'key-auth':
        return (
          <TextField
            label="API Key"
            name="token"
            value={newGateway.token || ''}
            onChange={handleFormChange}
            fullWidth
            required
          />
        );
      default:
        return null;
    }
  };

  const activeGateway = gateways.find(g => g.id === activeGatewayId);

  return (
    <>
      <Button
        onClick={handleClick}
        endIcon={<ArrowDropDownIcon />}
        color="inherit"
        sx={{ textTransform: 'none' }}
      >
        {activeGateway?.name || 'Select Gateway'}
      </Button>
      
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {gateways.map((gateway) => (
          <MenuItem 
            key={gateway.id} 
            onClick={() => handleSelectGateway(gateway.id)}
            selected={gateway.id === activeGatewayId}
          >
            {gateway.name} ({gateway.adminUrl})
            <DeleteIcon 
              sx={{ ml: 1, fontSize: 16, cursor: 'pointer' }} 
              onClick={(e: MouseEvent) => handleRemoveGateway(gateway.id, e)} 
            />
          </MenuItem>
        ))}
        {gateways.length > 0 && <Divider />}
        <MenuItem onClick={handleOpenDialog}>
          <AddIcon fontSize="small" sx={{ mr: 1 }} />
          Add New Gateway
        </MenuItem>
      </Menu>
      
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Gateway</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              label="Gateway Name"
              name="name"
              value={newGateway.name}
              onChange={handleFormChange}
              fullWidth
              required
            />
            <TextField
              label="Admin API URL"
              name="adminUrl"
              value={newGateway.adminUrl}
              onChange={handleFormChange}
              placeholder="http://localhost:8001 or https://kong-admin.example.com:8444"
              fullWidth
              required
            />
            
            <FormControl fullWidth>
              <InputLabel id="auth-type-label">Authentication Type</InputLabel>
              <Select
                labelId="auth-type-label"
                id="auth-type-select"
                value={newGateway.authType}
                onChange={handleAuthTypeChange}
                label="Authentication Type"
              >
                <MenuItem value="none">None</MenuItem>
                <MenuItem value="basic-auth">Basic Auth</MenuItem>
                <MenuItem value="key-auth">Key Auth</MenuItem>
              </Select>
            </FormControl>
            
            {renderAuthFields()}
            
            <FormControlLabel
              control={
                <Switch 
                  checked={newGateway.skipTlsVerify}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => 
                    setNewGateway({...newGateway, skipTlsVerify: e.target.checked})
                  }
                />
              }
              label="Skip TLS Verification"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          {loading && <CircularProgress size={24} sx={{ mr: 2 }} />}
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button 
            variant="contained" 
            onClick={handleAddGateway}
            disabled={!newGateway.name || !newGateway.adminUrl || loading}
          >
            Save Connection
          </Button>
          <Button 
            variant="contained" 
            color="success"
            onClick={handleTestAndSave}
            disabled={!newGateway.name || !newGateway.adminUrl || loading}
          >
            Test & Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
