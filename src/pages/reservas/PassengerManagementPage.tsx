import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Button,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  TextField,
  useTheme,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

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

// Verificar y depurar la carga de pasajeros
const loadPassengersFromLocalStorage = (): Passenger[] => {
  try {
    const savedPassengersStr = localStorage.getItem('passengers');
    console.log('Raw localStorage passenger data:', savedPassengersStr); // Debug raw data
    
    if (!savedPassengersStr) {
      console.log('No passenger data found in localStorage, initializing empty array');
      return [];
    }
    
    const passengers = JSON.parse(savedPassengersStr);
    
    if (!Array.isArray(passengers)) {
      console.error('Passenger data is not an array!', passengers);
      return [];
    }
    
    console.log('Pasajeros cargados desde localStorage:', passengers); // Debug
    return passengers;
  } catch (error) {
    console.error('Error al cargar pasajeros desde localStorage:', error);
    // If there's an error, clear the corrupted data
    localStorage.removeItem('passengers');
    return [];
  }
};

// Asegurar el guardado de pasajeros
const savePassengersToLocalStorage = (passengers: Passenger[]) => {
  try {
    if (!Array.isArray(passengers)) {
      console.error('Attempted to save non-array passenger data:', passengers);
      return;
    }
    
    // Validate each passenger has required fields
    const validPassengers = passengers.filter(p => 
      p && p.id && typeof p.id === 'string' &&
      p.documentType && p.documentNumber && p.firstName && p.lastName
    );
    
    if (validPassengers.length !== passengers.length) {
      console.warn(`Filtered out ${passengers.length - validPassengers.length} invalid passenger(s)`);
    }
    
    const passengersJson = JSON.stringify(validPassengers);
    localStorage.setItem('passengers', passengersJson);
    
    // Verify the save was successful
    const savedData = localStorage.getItem('passengers');
    if (savedData === passengersJson) {
      console.log('Pasajeros guardados exitosamente en localStorage:', validPassengers);
    } else {
      console.error('Verification failed - saved data does not match');
    }
  } catch (error) {
    console.error('Error al guardar pasajeros en localStorage:', error);
  }
};

const PassengerManagementPage = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const [passengers, setPassengers] = useState<Passenger[]>([]);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentPassenger, setCurrentPassenger] = useState<Passenger | null>(null);

  useEffect(() => {
    const savedPassengers = loadPassengersFromLocalStorage();
    setPassengers(savedPassengers);
  }, []);

  const handleBack = () => {
    navigate(-1);
  };

  const handleAddNewPassenger = () => {
    navigate('/pasajeros/nuevo');
  };

  const handleEditPassenger = (passenger: Passenger) => {
    setCurrentPassenger(passenger);
    setIsEditDialogOpen(true);
  };

  const handleUpdatePassenger = () => {
    if (!currentPassenger) return;

    // Validate required fields
    if (!currentPassenger.documentType || !currentPassenger.documentNumber || !currentPassenger.firstName || !currentPassenger.lastName) {
      alert('Por favor complete los campos obligatorios: Tipo de documento, Número de documento, Nombre y Apellido');
      return;
    }

    const updatedPassengers = passengers.map(p =>
      p.id === currentPassenger.id ? currentPassenger : p
    );
    setPassengers(updatedPassengers);
    savePassengersToLocalStorage(updatedPassengers);

    setIsEditDialogOpen(false);
    setCurrentPassenger(null);
    alert('Pasajero actualizado correctamente');
  };

  const handleDeletePassenger = (passengerId: string) => {
    if (window.confirm('¿Está seguro de que desea eliminar este pasajero?')) {
      const updatedPassengers = passengers.filter(p => p.id !== passengerId);
      setPassengers(updatedPassengers);
      savePassengersToLocalStorage(updatedPassengers);
      alert('Pasajero eliminado correctamente');
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, position: 'relative', pb: 8 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <IconButton onClick={handleBack} sx={{ mr: 2 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" component="h1">
          Gestión de Pasajeros
        </Typography>
      </Box>

      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Lista de Pasajeros
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddNewPassenger}
            color="primary"
          >
            Agregar Pasajero
          </Button>
        </Box>

        {passengers.length === 0 ? (
          <Box sx={{ 
            py: 6, 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.02)',
            borderRadius: 1
          }}>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
              No hay pasajeros registrados
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAddNewPassenger}
              color="primary"
            >
              Agregar Pasajero
            </Button>
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Documento</TableCell>
                  <TableCell>Nombre Completo</TableCell>
                  <TableCell>Nacionalidad</TableCell>
                  <TableCell>Fecha Nac.</TableCell>
                  <TableCell>Contacto</TableCell>
                  <TableCell>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {passengers.map((passenger) => (
                  <TableRow key={passenger.id}>
                    <TableCell>
                      <Typography variant="body2">
                        {passenger.documentType}: {passenger.documentNumber}
                      </Typography>
                      {passenger.hasVisa && (
                        <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                          VISA: {passenger.visaNumber}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {passenger.firstName} {passenger.lastName}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        {passenger.gender}
                      </Typography>
                    </TableCell>
                    <TableCell>{passenger.nationality}</TableCell>
                    <TableCell>{passenger.birthDate}</TableCell>
                    <TableCell>
                      <Typography variant="body2">{passenger.phone}</Typography>
                      <Typography variant="caption" color="textSecondary">
                        {passenger.email}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <IconButton
                        size="small"
                        onClick={() => handleEditPassenger(passenger)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDeletePassenger(passenger.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      {/* Diálogo de edición */}
      <Dialog
        open={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Editar Pasajero</DialogTitle>
        <DialogContent>
          {currentPassenger && (
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  fullWidth
                  required
                  label="Tipo de Documento"
                  select
                  value={currentPassenger.documentType}
                  onChange={(e) => setCurrentPassenger({
                    ...currentPassenger,
                    documentType: e.target.value
                  })}
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
                  value={currentPassenger.documentNumber}
                  onChange={(e) => setCurrentPassenger({
                    ...currentPassenger,
                    documentNumber: e.target.value
                  })}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  fullWidth
                  label="Fecha de Vencimiento"
                  type="date"
                  value={currentPassenger.documentExpiryDate}
                  onChange={(e) => setCurrentPassenger({
                    ...currentPassenger,
                    documentExpiryDate: e.target.value
                  })}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  fullWidth
                  required
                  label="Nombre"
                  value={currentPassenger.firstName}
                  onChange={(e) => setCurrentPassenger({
                    ...currentPassenger,
                    firstName: e.target.value
                  })}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  fullWidth
                  required
                  label="Apellido"
                  value={currentPassenger.lastName}
                  onChange={(e) => setCurrentPassenger({
                    ...currentPassenger,
                    lastName: e.target.value
                  })}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  fullWidth
                  label="VISA"
                  select
                  value={currentPassenger.hasVisa}
                  onChange={(e) => setCurrentPassenger({
                    ...currentPassenger,
                    hasVisa: e.target.value === 'true',
                    visaNumber: e.target.value === 'false' ? '' : currentPassenger.visaNumber
                  })}
                >
                  <MenuItem value="false">No</MenuItem>
                  <MenuItem value="true">Si</MenuItem>
                </TextField>
              </Grid>
              {currentPassenger.hasVisa && (
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    fullWidth
                    label="Número de VISA"
                    value={currentPassenger.visaNumber}
                    onChange={(e) => setCurrentPassenger({
                      ...currentPassenger,
                      visaNumber: e.target.value
                    })}
                  />
                </Grid>
              )}
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  fullWidth
                  label="Género"
                  select
                  value={currentPassenger.gender}
                  onChange={(e) => setCurrentPassenger({
                    ...currentPassenger,
                    gender: e.target.value
                  })}
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
                  value={currentPassenger.birthDate}
                  onChange={(e) => setCurrentPassenger({
                    ...currentPassenger,
                    birthDate: e.target.value
                  })}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  fullWidth
                  label="Nacionalidad"
                  value={currentPassenger.nationality}
                  onChange={(e) => setCurrentPassenger({
                    ...currentPassenger,
                    nationality: e.target.value
                  })}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={currentPassenger.email}
                  onChange={(e) => setCurrentPassenger({
                    ...currentPassenger,
                    email: e.target.value
                  })}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  fullWidth
                  label="Teléfono"
                  value={currentPassenger.phone}
                  onChange={(e) => setCurrentPassenger({
                    ...currentPassenger,
                    phone: e.target.value
                  })}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  fullWidth
                  label="Dirección"
                  value={currentPassenger.address}
                  onChange={(e) => setCurrentPassenger({
                    ...currentPassenger,
                    address: e.target.value
                  })}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  fullWidth
                  label="Contacto de Emergencia"
                  value={currentPassenger.emergencyContact}
                  onChange={(e) => setCurrentPassenger({
                    ...currentPassenger,
                    emergencyContact: e.target.value
                  })}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  fullWidth
                  label="Teléfono de Emergencia"
                  value={currentPassenger.emergencyPhone}
                  onChange={(e) => setCurrentPassenger({
                    ...currentPassenger,
                    emergencyPhone: e.target.value
                  })}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Necesidades Especiales"
                  value={currentPassenger.specialNeeds}
                  onChange={(e) => setCurrentPassenger({
                    ...currentPassenger,
                    specialNeeds: e.target.value
                  })}
                  multiline
                  rows={2}
                />
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsEditDialogOpen(false)}>Cancelar</Button>
          <Button onClick={handleUpdatePassenger} variant="contained">
            Guardar Cambios
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default PassengerManagementPage;