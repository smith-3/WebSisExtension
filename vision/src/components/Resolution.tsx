import React, { useState } from 'react';
import { Button, FormControl, InputLabel, Select, MenuItem, Box } from '@mui/material';
import browser from 'webextension-polyfill';

interface ResolutionProps {
  formTypes: string[];
}

const Resolution: React.FC<ResolutionProps> = ({ formTypes }) => {
  const [selectedForm, setSelectedForm] = useState('');

  const handleApply = () => {
    try {
      // Enviar mensaje al fondo con el tipo de formulario seleccionado
      browser.runtime.sendMessage({
        action: 'updateResolutionForm',
        formType: selectedForm,
      });
    } catch (error) {
      console.error('Error al intentar enviar mensaje al fondo:', error);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 2 }}>
      <FormControl variant="outlined" sx={{ marginBottom: 1, width: '80%' }}>
        <InputLabel id="form-type-label">Form Type</InputLabel>
        <Select
          labelId="form-type-label"
          value={selectedForm}
          onChange={(e) => setSelectedForm(e.target.value as string)}
          label="Form Type"
        >
          {formTypes.map((type, index) => (
            <MenuItem key={index} value={type}>{type}</MenuItem>
          ))}
        </Select>
      </FormControl>
      <Button onClick={handleApply} sx={{ backgroundColor: '#000', color: 'white', '&:hover': { backgroundColor: '#333' } }} variant="contained">
        Apply
      </Button>
    </Box>
  );
};

export default Resolution;
