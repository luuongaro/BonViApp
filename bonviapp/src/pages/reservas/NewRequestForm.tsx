import React, { useState } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Grid,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

interface DateRange {
  startDate: string;
  endDate: string;
}

interface MonthOnly {
  month: string;
  year: string;
}

const NewRequestForm = () => {
  const navigate = useNavigate();
  const [dateType, setDateType] = useState<'range' | 'month'>('range');
  const [dateRange, setDateRange] = useState<DateRange>({ startDate: '', endDate: '' });
  const [monthOnly, setMonthOnly] = useState<MonthOnly>({ month: '', year: '' });
  const [formData, setFormData] = useState({
    passengers: '',
    nights: '',
    minors: '',
    infants: '',
    creationDate: new Date().toISOString().split('T')[0], // Default to today
  });

  const handleDateTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDateType(event.target.value as 'range' | 'month');
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    
    console.log('Form submitted');
    
    // Validate required fields
    if (!formData.creationDate) {
      alert('Por favor seleccione una fecha de creación');
      return;
    }

    if (dateType === 'range' && (!dateRange.startDate || !dateRange.endDate)) {
      alert('Por favor seleccione las fechas de inicio y fin');
      return;
    }

    if (dateType === 'month' && (!monthOnly.year || !monthOnly.month)) {
      alert('Por favor seleccione el mes');
      return;
    }

    if (!formData.passengers) {
      alert('Por favor ingrese la cantidad de pasajeros');
      return;
    }

    // Create a new request object
    const newRequest = {
      id: Date.now().toString(),
      creationDate: formData.creationDate,
      travelDate: dateType === 'range' 
        ? `${dateRange.startDate} - ${dateRange.endDate}`
        : `${monthOnly.year}-${monthOnly.month}`,
      passengers: parseInt(formData.passengers) || 0,
      nights: parseInt(formData.nights) || 0,
      minors: parseInt(formData.minors) || 0,
      infants: parseInt(formData.infants) || 0,
    };

    console.log('Attempting to save new request:', newRequest);

    try {
      // Get existing requests from localStorage
      const existingRequestsStr = localStorage.getItem('requests');
      console.log('Raw localStorage data:', existingRequestsStr);
      
      const existingRequests = existingRequestsStr ? JSON.parse(existingRequestsStr) : [];
      console.log('Parsed existing requests:', existingRequests);
      
      // Add new request to the array
      const updatedRequests = [...existingRequests, newRequest];
      console.log('Updated requests array:', updatedRequests);
      
      // Save back to localStorage
      localStorage.setItem('requests', JSON.stringify(updatedRequests));
      console.log('Successfully saved to localStorage');

      // Verify the save
      const verifyData = localStorage.getItem('requests');
      console.log('Verification - data in localStorage:', verifyData);

      // Navigate back to the requests list
      navigate('/reservas');
    } catch (error) {
      console.error('Error saving request:', error);
      alert('Error al guardar el pedido. Por favor intente nuevamente.');
    }
  };

  // Add a direct button click handler for testing
  const handleButtonClick = () => {
    console.log('Button clicked');
    handleSubmit(new Event('submit') as any);
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Nuevo Pedido
      </Typography>

      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 4 }}>
        <Grid container spacing={2} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Fecha de Creación"
              type="date"
              name="creationDate"
              value={formData.creationDate}
              onChange={handleInputChange}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
        </Grid>

        <FormControl component="fieldset" sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Fecha del Viaje
          </Typography>
          <RadioGroup value={dateType} onChange={handleDateTypeChange}>
            <FormControlLabel
              value="range"
              control={<Radio />}
              label="Rango de fechas (Inicio - Fin)"
            />
            <FormControlLabel
              value="month"
              control={<Radio />}
              label="Solo mes"
            />
          </RadioGroup>
        </FormControl>

        {dateType === 'range' ? (
          <Grid container spacing={2} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Fecha de inicio"
                type="date"
                value={dateRange.startDate}
                onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Fecha de fin"
                type="date"
                value={dateRange.endDate}
                onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          </Grid>
        ) : (
          <Grid container spacing={2} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Mes"
                type="month"
                value={`${monthOnly.year}-${monthOnly.month}`}
                onChange={(e) => {
                  const [year, month] = e.target.value.split('-');
                  setMonthOnly({ year, month });
                }}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          </Grid>
        )}

        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Cantidad de Pasajeros"
              type="number"
              name="passengers"
              value={formData.passengers}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Cantidad de Noches"
              type="number"
              name="nights"
              value={formData.nights}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Cantidad de Menores"
              type="number"
              name="minors"
              value={formData.minors}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Cantidad de Infantes"
              type="number"
              name="infants"
              value={formData.infants}
              onChange={handleInputChange}
            />
          </Grid>
        </Grid>

        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            type="submit"
            onClick={handleButtonClick}
          >
            Crear Pedido
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default NewRequestForm; 