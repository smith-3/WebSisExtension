import * as React from 'react';
import { useState } from 'react';
import { Button, TextField, Box, Avatar, Typography, Container, CssBaseline } from '@mui/material';
import browser from 'webextension-polyfill';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { WebSisProp } from '../interfaces/WebSis';

const WebSis: React.FC<{ initialData: WebSisProp }> = ({ initialData }) => {
  const [sisCode, setSisCode] = useState(initialData.sisCode);
  const [password, setPassword] = useState(initialData.password);
  const [showPassword, setShowPassword] = useState(false);
  const [day, setDay] = useState(initialData.day);
  const [month, setMonth] = useState(initialData.month);
  const [year, setYear] = useState(initialData.year);

  const handleApply = () => {
    try {
      // Enviar mensaje al fondo con los datos actualizados
      browser.runtime.sendMessage({
        action: 'openWebSis',
        sisCode: sisCode,
        password: password,
        day: day,
        month: month,
        year: year
      });
    } catch (error) {
      console.error('Error al intentar enviar mensaje al fondo:', error);
    }
  };
  

  const formatDate = (day: string, month: string, year: string) => {
    return `${year}-${month}-${day}`;
  };

  const handleDateChange = (date: string) => {
    // El formato esperado es YYYY-MM-DD
    const [newYear, newMonth, newDay] = date.split('-');
    setDay(newDay);
    setMonth(newMonth);
    setYear(newYear);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Web Sis
        </Typography>
        <Box component="form" onSubmit={handleApply} noValidate sx={{ mt: 1, width: '100%' }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="sisCode"
            label="SIS Code"
            name="sisCode"
            autoComplete="off"
            autoFocus
            value={sisCode}
            onChange={(e) => setSisCode(e.target.value)}
            variant="outlined"
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type={showPassword ? 'text' : 'password'}
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            variant="outlined"
            InputProps={{
              endAdornment: (
                <Button
                  onClick={togglePasswordVisibility}
                  sx={{ color: 'rgba(0, 0, 0, 0.54)', '&:hover': { backgroundColor: 'transparent' } }}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </Button>
              ),
            }}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="dateOfBirth"
            label="Date of Birth"
            type="date"
            InputLabelProps={{
              shrink: true,
            }}
            variant="outlined"
            value={formatDate(day, month, year)}
            onChange={(e) => handleDateChange(e.target.value)}
          />
          <Button
            type="button"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2, backgroundColor: '#1976d2', '&:hover': { backgroundColor: '#1565c0' } }}
            onClick={handleApply}
          >
            Apply
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default WebSis;
