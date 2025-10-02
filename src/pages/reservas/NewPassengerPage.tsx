import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  TextField,
  Button,
  IconButton,
  MenuItem,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';

interface Passenger {
  id: string;
  documentType: string;
  documentNumber: string;
  documentExpiryDate: string;
  hasVisa: boolean;
  visaNumber: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  nationality: string;
  email: string;
  phone: string;
  gender: string;
  address: string;
  emergencyContact: string;
  emergencyPhone: string;
  specialNeeds: string;
}

const NewPassengerPage = () => {
  const navigate = useNavigate();
  const [newPassenger, setNewPassenger] = useState<Partial<Passenger>>({
    documentType: '',
    documentNumber: '',
    documentExpiryDate: '',
    hasVisa: false,
    visaNumber: '',
    firstName: '',
    lastName: '',
    birthDate: '',
    nationality: '',
    email: '',
    phone: '',
    gender: '',
    address: '',
    emergencyContact: '',
    emergencyPhone: '',
    specialNeeds: '',
  });

  const handleBack = () => {
    navigate('/pasajeros');
  };

  const handleAddNewPassenger = () => {
    // Validate required fields
    if (!newPassenger.documentType || !newPassenger.documentNumber || !newPassenger.firstName || !newPassenger.lastName) {
      alert('Por favor complete los campos obligatorios: Tipo de documento, Número de documento, Nombre y Apellido');
      return;
    }

    // Generate ID based on document information
    const passengerId = `${newPassenger.documentType}_${newPassenger.documentNumber}`;

    // Load existing passengers
    const savedPassengersStr = localStorage.getItem('passengers');
    const savedPassengers = savedPassengersStr ? JSON.parse(savedPassengersStr) : [];

    // Check if passenger already exists
    const existingPassenger = savedPassengers.find((p: Passenger) => p.id === passengerId);
    if (existingPassenger) {
      alert('Ya existe un pasajero con este número de documento');
      return;
    }

    // Create complete passenger object
    const completePassenger: Passenger = {
      id: passengerId,
      documentType: newPassenger.documentType || '',
      documentNumber: newPassenger.documentNumber || '',
      documentExpiryDate: newPassenger.documentExpiryDate || '',
      hasVisa: newPassenger.hasVisa || false,
      visaNumber: newPassenger.visaNumber || '',
      firstName: newPassenger.firstName || '',
      lastName: newPassenger.lastName || '',
      birthDate: newPassenger.birthDate || '',
      nationality: newPassenger.nationality || '',
      email: newPassenger.email || '',
      phone: newPassenger.phone || '',
      gender: newPassenger.gender || '',
      address: newPassenger.address || '',
      emergencyContact: newPassenger.emergencyContact || '',
      emergencyPhone: newPassenger.emergencyPhone || '',
      specialNeeds: newPassenger.specialNeeds || '',
    };

    // Add to localStorage
    const updatedPassengers = [...savedPassengers, completePassenger];
    localStorage.setItem('passengers', JSON.stringify(updatedPassengers));

    alert('Pasajero agregado correctamente');
    navigate('/pasajeros');
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, position: 'relative', pb: 8 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <IconButton onClick={handleBack} sx={{ mr: 2 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" component="h1">
          Agregar Nuevo Pasajero
        </Typography>
      </Box>

      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              required
              label="Tipo de Documento"
              select
              value={newPassenger.documentType}
              onChange={(e) => setNewPassenger({ ...newPassenger, documentType: e.target.value })}
            >
              <MenuItem value="PASAPORTE">Pasaporte</MenuItem>
              <MenuItem value="DNI">DNI</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              required
              label="Número de Documento"
              value={newPassenger.documentNumber}
              onChange={(e) => setNewPassenger({ ...newPassenger, documentNumber: e.target.value })}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              label="Fecha de Vencimiento"
              type="date"
              value={newPassenger.documentExpiryDate}
              onChange={(e) => setNewPassenger({ ...newPassenger, documentExpiryDate: e.target.value })}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              required
              label="Nombre"
              value={newPassenger.firstName}
              onChange={(e) => setNewPassenger({ ...newPassenger, firstName: e.target.value })}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              required
              label="Apellido"
              value={newPassenger.lastName}
              onChange={(e) => setNewPassenger({ ...newPassenger, lastName: e.target.value })}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              label="VISA"
              select
              value={newPassenger.hasVisa}
              onChange={(e) => setNewPassenger({ 
                ...newPassenger, 
                hasVisa: e.target.value === 'true',
                visaNumber: e.target.value === 'false' ? '' : newPassenger.visaNumber
              })}
            >
              <MenuItem value="false">No</MenuItem>
              <MenuItem value="true">Si</MenuItem>
            </TextField>
          </Grid>
          {newPassenger.hasVisa && (
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                label="Número de VISA"
                value={newPassenger.visaNumber}
                onChange={(e) => setNewPassenger({ ...newPassenger, visaNumber: e.target.value })}
              />
            </Grid>
          )}
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              label="Género"
              select
              value={newPassenger.gender}
              onChange={(e) => setNewPassenger({ ...newPassenger, gender: e.target.value })}
            >
              <MenuItem value="Masculino">Masculino</MenuItem>
              <MenuItem value="Femenino">Femenino</MenuItem>
              <MenuItem value="Otro">Otro</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              label="Fecha de Nacimiento"
              type="date"
              value={newPassenger.birthDate}
              onChange={(e) => setNewPassenger({ ...newPassenger, birthDate: e.target.value })}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              label="Nacionalidad"
              value={newPassenger.nationality}
              onChange={(e) => setNewPassenger({ ...newPassenger, nationality: e.target.value })}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={newPassenger.email}
              onChange={(e) => setNewPassenger({ ...newPassenger, email: e.target.value })}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              label="Teléfono"
              value={newPassenger.phone}
              onChange={(e) => setNewPassenger({ ...newPassenger, phone: e.target.value })}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              label="Dirección"
              value={newPassenger.address}
              onChange={(e) => setNewPassenger({ ...newPassenger, address: e.target.value })}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              label="Contacto de Emergencia"
              value={newPassenger.emergencyContact}
              onChange={(e) => setNewPassenger({ ...newPassenger, emergencyContact: e.target.value })}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              label="Teléfono de Emergencia"
              value={newPassenger.emergencyPhone}
              onChange={(e) => setNewPassenger({ ...newPassenger, emergencyPhone: e.target.value })}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Necesidades Especiales"
              value={newPassenger.specialNeeds}
              onChange={(e) => setNewPassenger({ ...newPassenger, specialNeeds: e.target.value })}
              multiline
              rows={2}
            />
          </Grid>
        </Grid>

        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          <Button onClick={handleBack}>
            Cancelar
          </Button>
          <Button 
            variant="contained" 
            onClick={handleAddNewPassenger}
            startIcon={<AddIcon />}
          >
            Agregar Pasajero
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default NewPassengerPage;