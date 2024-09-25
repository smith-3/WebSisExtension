import React, { useEffect, useState } from 'react';
import { Button, Box } from '@mui/material';
import Resolution from '../components/Resolution';
import WebSis from '../components/WebSis';
import { WebSisProp } from '../interfaces/WebSis';

const Popup = () => {
  const [view, setView] = useState<'websis' | 'resolution'>('websis');
  const [formTypes, setFormTypes] = useState<string[]>([]);
  const [data, setData] = useState<WebSisProp>({
    sisCode: "202107801",
    password: "Universitariocovid19",
    day: "01",
    month: "09",
    year: "2002"
  });

  const handleViewChange = (newView: 'websis' | 'resolution') => {
    setView(newView);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 2 }}>
      <Box sx={{ display: 'flex', marginBottom: 2, width: '300px', gap: '8px' }}>
        <Button
          onClick={() => handleViewChange('websis')}
          sx={{ flex: 1, backgroundColor: '#1976d2', color: 'white', '&:hover': { backgroundColor: '#1565c0' } }}
          variant={view === 'websis' ? 'contained' : 'outlined'}
        >
          WebSis
        </Button>
        <Button
          onClick={() => handleViewChange('resolution')}
          sx={{ flex: 1, backgroundColor: '#000', color: 'white', '&:hover': { backgroundColor: '#333' } }}
          variant={view === 'resolution' ? 'contained' : 'outlined'}
        >
          Resolution
        </Button>
      </Box>
      {view === 'websis' && <WebSis initialData={data} />}
      {view === 'resolution' && <Resolution formTypes={formTypes} />}
    </Box>
  );
};

export default Popup;
