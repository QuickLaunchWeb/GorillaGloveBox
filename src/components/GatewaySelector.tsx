import { useState } from 'react';
import { 
  Box, 
  Button, 
  Menu, 
  MenuItem, 
  Typography, 
  TextField, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  FormControlLabel, 
  Checkbox,
  Select,
  InputLabel,
  FormControl,
  Divider,
  SelectChangeEvent
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import DeleteIcon from '@mui/icons-material/Delete';
import { useGatewayStore, Gateway } from '../store/useGatewayStore';

export const GatewaySelector = () => {
  const { gateways, activeGatewayId, addGateway, removeGateway, setActiveGateway } = useGatewayStore();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newGateway, setNewGateway] = useState<Omit<Gateway, 'id'>>({
    name: '',
    adminUrl: '',
    username: '',
    password: '',
    skipTlsVerify: true,
    type: 'oss'
  });
  
  const activeGateway = gateways.find(g => g.id === activeGatewayId);
  
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
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
  
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked } = e.target;
    setNewGateway({
      ...newGateway,
      [name]: name === 'skipTlsVerify' ? checked : value
    });
  };
  
  const handleSelectChange = (e: SelectChangeEvent) => {
    const { name, value } = e.target;
    setNewGateway({
      ...newGateway,
      [name as string]: value
    });
  };
  
  const handleAddGateway = () => {
    addGateway(newGateway);
    handleCloseDialog();
    
    // Reset form
    setNewGateway({
      name: '',
      adminUrl: '',
      username: '',
      password: '',
      skipTlsVerify: true,
      type: 'oss'
    });
  };
  
  const handleSelectGateway = (id: string) => {
    setActiveGateway(id);
    handleClose();
  };
  
  const handleRemoveGateway = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    removeGateway(id);
  };

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
          </MenuItem>
        ))}
        {gateways.length > 0 && <Divider />}
        <MenuItem onClick={handleOpenDialog}>
          <AddIcon fontSize="small" sx={{ mr: 1 }} />
          Add New Gateway
        </MenuItem>
      </Menu>
      
      {/* Add New Gateway Dialog */}
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
              <InputLabel id="gateway-type-label">Gateway Type</InputLabel>
              <Select
                labelId="gateway-type-label"
                name="type"
                value={newGateway.type}
                label="Gateway Type"
                onChange={handleSelectChange}
              >
                <MenuItem value="oss">Kong OSS</MenuItem>
                <MenuItem value="enterprise">Kong Enterprise</MenuItem>
              </Select>
            </FormControl>
            <Typography variant="body2" color="text.secondary">
              Authentication (Optional)
            </Typography>
            <TextField
              label="Username"
              name="username"
              value={newGateway.username || ''}
              onChange={handleFormChange}
              fullWidth
            />
            <TextField
              label="Password"
              name="password"
              type="password"
              value={newGateway.password || ''}
              onChange={handleFormChange}
              fullWidth
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={newGateway.skipTlsVerify}
                  onChange={handleFormChange}
                  name="skipTlsVerify"
                />
              }
              label="Skip TLS Verification (for self-signed certificates)"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button 
            onClick={handleAddGateway}
            variant="contained" 
            disabled={!newGateway.name || !newGateway.adminUrl}
          >
            Add Gateway
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
