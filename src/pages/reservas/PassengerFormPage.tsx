import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  TextField,
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
  Chip,
  MenuItem,
  alpha,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import PeopleIcon from '@mui/icons-material/People';
import CloseIcon from '@mui/icons-material/Close';
import AirplanemodeActiveIcon from '@mui/icons-material/AirplanemodeActive';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import FlightLandIcon from '@mui/icons-material/FlightLand';


// Estilos personalizados
const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  '& .MuiTableHead-root': {
    backgroundColor: alpha(theme.palette.primary.light, 0.3),
  },
  '& .MuiTableHead-root .MuiTableCell-head': {
    fontWeight: 600,
    fontSize: '0.875rem',
    color: theme.palette.primary.dark,
  },
  '& .MuiTableRow-root:nth-of-type(odd)': {
    backgroundColor: alpha(theme.palette.primary.light, 0.05),
  },
  '& .MuiTableRow-root:hover': {
    backgroundColor: alpha(theme.palette.primary.light, 0.1),
  },
}));

const PageHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginBottom: theme.spacing(4),
  position: 'relative',
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: -10,
    left: 0,
    right: 0,
    height: 2,
    background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.light})`,
    borderRadius: 2,
  },
}));

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

interface Reservation {
  id: string;
  passengers: Passenger[];
  creationDate: string;
  status: string;
  requestId: string;
  travelDate: string;
  nights: number;
  minors: number;
  infants: number;
  responsible: string;
  totalAmount: number;
  reservationCodes: any[];
  payments: any[];
}

const PassengerFormPage = () => {
  const navigate = useNavigate();
  const { reservationId } = useParams<{ reservationId: string }>();
  const [reservation, setReservation] = useState<Reservation | null>(null);
  const [passengers, setPassengers] = useState<Passenger[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Passenger[]>([]);
  const [isSearchDialogOpen, setIsSearchDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentPassenger, setCurrentPassenger] = useState<Passenger | null>(null);

  useEffect(() => {
    if (reservationId) {
      // Cargar la reserva
      const savedReservationsStr = localStorage.getItem('reservations');
      if (savedReservationsStr) {
        try {
          const savedReservations = JSON.parse(savedReservationsStr);
          const foundReservation = savedReservations.find(
            (r: Reservation) => r.id === reservationId
          );
          if (foundReservation) {
            console.log('Reserva encontrada:', foundReservation);
            setReservation(foundReservation);
            // Asegurar que passengers sea siempre un array
            setPassengers(foundReservation.passengers || []);
          } else {
            console.error('No se encontró la reserva con ID:', reservationId);
            alert('No se encontró la reserva especificada');
            navigate('/reservas');
          }
        } catch (error) {
          console.error('Error al cargar la reserva:', error);
          alert('Error al cargar la reserva');
          navigate('/reservas');
        }
      } else {
        console.error('No hay reservas guardadas');
        alert('No hay reservas guardadas');
        navigate('/reservas');
      }
    }
  }, [reservationId, navigate]);

  const handleBack = () => {
    navigate(`/reservas/details/${reservationId}`);
  };

  const handleSearchPassenger = () => {
    const savedPassengersStr = localStorage.getItem('passengers');
    if (savedPassengersStr) {
      try {
        const savedPassengers = JSON.parse(savedPassengersStr);
        const results = savedPassengers.filter((p: Passenger) =>
          p.documentNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.lastName.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setSearchResults(results);
        setIsSearchDialogOpen(true);
      } catch (error) {
        console.error('Error al buscar pasajeros:', error);
        setSearchResults([]);
      }
    } else {
      console.log('No hay pasajeros guardados');
      setSearchResults([]);
      setIsSearchDialogOpen(true);
    }
  };

  const handleAddExistingPassenger = (passenger: Passenger) => {
    try {
      console.log('Agregando pasajero existente:', passenger);
      
      if (!reservation) {
        console.error('No hay reserva activa');
        alert('Error: No hay reserva activa');
        return;
      }

      // Asegurar que passengers sea un array
      const currentPassengers = Array.isArray(passengers) ? passengers : [];
      
      // Verificar si el pasajero ya está en la lista
      const isAlreadyAdded = currentPassengers.some(p => p.id === passenger.id);
      if (isAlreadyAdded) {
        alert('Este pasajero ya está agregado a la reserva.');
        return;
      }

      // Crear una copia del pasajero y agregarlo a la lista
      const updatedPassengers = [...currentPassengers, { ...passenger }];
      
      // Actualizar el estado local
      setPassengers(updatedPassengers);
      
      // Actualizar la reserva en localStorage
      const savedReservationsStr = localStorage.getItem('reservations');
      if (savedReservationsStr) {
        const savedReservations = JSON.parse(savedReservationsStr);
        const updatedReservations = savedReservations.map((r: Reservation) => {
          if (r.id === reservationId) {
            // Mantener todos los campos existentes de la reserva
            return {
              ...r,
              passengers: updatedPassengers,
              // Asegurar que los campos requeridos estén presentes
              id: r.id,
              creationDate: r.creationDate,
              status: r.status,
              requestId: r.requestId
            };
          }
          return r;
        });

        // Guardar las reservas actualizadas
        localStorage.setItem('reservations', JSON.stringify(updatedReservations));
        
        // Actualizar el estado de la reserva actual
        const updatedReservation = updatedReservations.find((r: Reservation) => r.id === reservationId);
        if (updatedReservation) {
          setReservation(updatedReservation);
          console.log('Reserva actualizada:', updatedReservation);
        }
      }

      // Limpiar el estado de búsqueda
      setIsSearchDialogOpen(false);
      setSearchQuery('');
      setSearchResults([]);
      
      alert('Pasajero agregado correctamente a la reserva');
    } catch (error) {
      console.error('Error al agregar pasajero:', error);
      alert('Error al agregar el pasajero. Por favor, intente nuevamente.');
    }
  };

  const handleEditPassenger = (passenger: Passenger) => {
    setCurrentPassenger(passenger);
    setIsEditDialogOpen(true);
  };

  const handleUpdatePassenger = () => {
    if (!currentPassenger) return;

    // Actualizar en la base de datos de pasajeros
    const savedPassengersStr = localStorage.getItem('passengers');
    if (savedPassengersStr) {
      const savedPassengers = JSON.parse(savedPassengersStr);
      const updatedPassengers = savedPassengers.map((p: Passenger) =>
        p.id === currentPassenger.id ? currentPassenger : p
      );
      localStorage.setItem('passengers', JSON.stringify(updatedPassengers));
    }

    // Actualizar en la reserva
    const updatedPassengers = passengers.map(p =>
      p.id === currentPassenger.id ? currentPassenger : p
    );
    setPassengers(updatedPassengers);
    updateReservation(updatedPassengers);

    setIsEditDialogOpen(false);
    setCurrentPassenger(null);
  };

  const handleDeletePassenger = (passengerId: string) => {
    const updatedPassengers = passengers.filter(p => p.id !== passengerId);
    setPassengers(updatedPassengers);
    updateReservation(updatedPassengers);
  };

  const updateReservation = (updatedPassengers: Passenger[]) => {
    if (!reservation) {
      console.error('No hay reserva para actualizar');
      return;
    }

    try {
      console.log('Actualizando reserva con pasajeros:', updatedPassengers);
      
      // Crear una copia de la reserva actualizada
      const updatedReservation = {
        ...reservation,
        passengers: updatedPassengers,
      };

      // Obtener todas las reservas
      const savedReservationsStr = localStorage.getItem('reservations');
      if (savedReservationsStr) {
        const savedReservations = JSON.parse(savedReservationsStr);
        
        // Actualizar la reserva específica
        const updatedReservations = savedReservations.map((r: Reservation) =>
          r.id === reservationId ? updatedReservation : r
        );
        
        // Guardar las reservas actualizadas
        localStorage.setItem('reservations', JSON.stringify(updatedReservations));
        console.log('Reserva actualizada correctamente');
      } else {
        console.error('No se encontraron reservas en localStorage');
      }
    } catch (error) {
      console.error('Error al actualizar la reserva:', error);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, pb: 8, position: 'relative' }}>
      <Box sx={{ position: 'absolute', right: 30, top: 20, opacity: 0.06 }}>
        <FlightTakeoffIcon sx={{ fontSize: 120, color: 'secondary.main', transform: 'rotate(-10deg)' }} />
      </Box>
      
      <PageHeader>
        <IconButton 
          onClick={handleBack} 
          sx={{ 
            mr: 2, 
            backgroundColor: 'primary.light',
            '&:hover': {
              backgroundColor: 'primary.main',
            }
          }}
        >
          <ArrowBackIcon />
        </IconButton>
        <Typography 
          variant="h4" 
          component="h1" 
          sx={{ 
            background: 'linear-gradient(45deg, #5d99c6 30%, #ca9b52 90%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: 'bold',
            position: 'relative',
            zIndex: 1
          }}
        >
          Ficha de Pasajeros
          <Typography 
            component="span" 
            sx={{ 
              ml: 2,
              color: 'secondary.main',
              fontWeight: 'normal',
              fontSize: '1rem',
              opacity: 0.8
            }}
          >
            Reserva #{reservationId}
          </Typography>
        </Typography>
      </PageHeader>

      <Paper 
        elevation={3} 
        sx={{ 
          p: 3, 
          mb: 4, 
          borderTop: '4px solid',
          borderColor: 'primary.main',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Box 
          sx={{ 
            position: 'absolute', 
            bottom: -20, 
            right: -20, 
            opacity: 0.07,
            transform: 'rotate(15deg)',
            zIndex: 0
          }}
        >
          <AirplanemodeActiveIcon sx={{ fontSize: 150, color: 'secondary.main' }} />
        </Box>
        
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          mb: 3,
          position: 'relative',
          zIndex: 1
        }}>
          <Typography 
            variant="h6" 
            sx={{ 
              display: 'flex',
              alignItems: 'center',
              color: 'primary.dark',
              '&::before': {
                content: '""',
                display: 'inline-block',
                width: 4,
                height: 24,
                backgroundColor: 'secondary.main',
                marginRight: 2,
                borderRadius: 4
              }
            }}
          >
            <PeopleIcon sx={{ mr: 1, fontSize: '1.2rem' }} />
            Pasajeros ({passengers.length})
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={<SearchIcon />}
              onClick={handleSearchPassenger}
              sx={{ 
                borderColor: 'primary.main',
                color: 'primary.dark',
                '&:hover': {
                  backgroundColor: 'primary.light',
                  borderColor: 'primary.dark',
                }
              }}
            >
              Buscar Pasajero Existente
            </Button>
            <Button
              variant="outlined"
              startIcon={<PeopleIcon />}
              onClick={() => navigate('/pasajeros')}
              sx={{ 
                borderColor: 'secondary.main',
                color: 'secondary.dark',
                '&:hover': {
                  backgroundColor: 'secondary.light',
                  borderColor: 'secondary.dark',
                }
              }}
            >
              Gestionar Pasajeros
            </Button>
          </Box>
        </Box>

        <StyledTableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Documento</TableCell>
                <TableCell>Nombre Completo</TableCell>
                <TableCell>Nacionalidad</TableCell>
                <TableCell>Fecha Nac.</TableCell>
                <TableCell>Contacto</TableCell>
                <TableCell>Necesidades Especiales</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {passengers.length > 0 ? (
                passengers.map((passenger) => (
                  <TableRow key={passenger.id}>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {passenger.documentType}: {passenger.documentNumber}
                      </Typography>
                      {passenger.hasVisa && (
                        <Typography variant="caption" color="secondary.dark" sx={{ display: 'flex', alignItems: 'center' }}>
                          <FlightLandIcon sx={{ fontSize: '0.8rem', mr: 0.5 }} />
                          Visa: {passenger.visaNumber}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
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
                      {passenger.specialNeeds && (
                        <Chip 
                          label={passenger.specialNeeds} 
                          color="secondary" 
                          size="small"
                          sx={{ borderRadius: '4px' }}
                        />
                      )}
                    </TableCell>
                    <TableCell>
                      <IconButton
                        size="small"
                        sx={{ 
                          color: 'primary.main',
                          '&:hover': { backgroundColor: alpha('#90caf9', 0.2) }
                        }}
                        onClick={() => handleEditPassenger(passenger)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        sx={{ 
                          color: 'secondary.main',
                          '&:hover': { backgroundColor: alpha('#ffcc80', 0.2) }
                        }}
                        onClick={() => handleDeletePassenger(passenger.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                    <Typography variant="body1" color="textSecondary" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                      <AirplanemodeActiveIcon sx={{ fontSize: 40, color: 'primary.main', opacity: 0.6 }} />
                      No hay pasajeros registrados para esta reserva.
                      <br />
                      Utilice el botón "Buscar Pasajero Existente" para agregar pasajeros.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </StyledTableContainer>
      </Paper>

      {/* Diálogo de búsqueda */}
      <Dialog
        open={isSearchDialogOpen}
        onClose={() => setIsSearchDialogOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            background: 'linear-gradient(to bottom, #ffffff, #f8f9fa)',
          }
        }}
      >
        <DialogTitle sx={{ 
          backgroundImage: 'linear-gradient(90deg, #90caf9 0%, #c3fdff 100%)', 
          color: 'primary.dark',
          display: 'flex',
          alignItems: 'center'
        }}>
          <SearchIcon sx={{ mr: 1 }} />
          Buscar Pasajero Existente
          <IconButton
            aria-label="close"
            onClick={() => setIsSearchDialogOpen(false)}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: 'primary.dark',
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 2, mt: 2 }}>
            <TextField
              fullWidth
              label="Buscar por documento, nombre o apellido"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                // Realizar búsqueda en tiempo real
                const savedPassengersStr = localStorage.getItem('passengers');
                if (savedPassengersStr && e.target.value) {
                  const savedPassengers = JSON.parse(savedPassengersStr);
                  const searchTerm = e.target.value.toLowerCase();
                  const results = savedPassengers.filter((p: Passenger) =>
                    p.documentNumber.toLowerCase().includes(searchTerm) ||
                    p.firstName.toLowerCase().includes(searchTerm) ||
                    p.lastName.toLowerCase().includes(searchTerm)
                  );
                  setSearchResults(results);
                } else {
                  setSearchResults([]);
                }
              }}
              InputProps={{
                startAdornment: <SearchIcon sx={{ color: 'primary.main', mr: 1 }} />,
                sx: { borderRadius: 2 }
              }}
              sx={{ 
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: 'primary.light',
                  },
                  '&:hover fieldset': {
                    borderColor: 'primary.main',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'primary.dark',
                  },
                },
              }}
            />
          </Box>
          <StyledTableContainer sx={{ maxHeight: 400 }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>Documento</TableCell>
                  <TableCell>Nombre Completo</TableCell>
                  <TableCell>Nacionalidad</TableCell>
                  <TableCell>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {searchResults.length > 0 ? (
                  searchResults.map((passenger) => (
                    <TableRow key={passenger.id}>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {passenger.documentType}: {passenger.documentNumber}
                        </Typography>
                        {passenger.hasVisa && (
                          <Typography variant="caption" color="secondary.dark" sx={{ display: 'flex', alignItems: 'center' }}>
                            <FlightLandIcon sx={{ fontSize: '0.8rem', mr: 0.5 }} />
                            Visa: {passenger.visaNumber}
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {passenger.firstName} {passenger.lastName}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          {passenger.gender}
                        </Typography>
                      </TableCell>
                      <TableCell>{passenger.nationality}</TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          size="small"
                          onClick={() => {
                            console.log('Seleccionando pasajero:', passenger);
                            handleAddExistingPassenger(passenger);
                          }}
                          startIcon={<AddIcon />}
                          sx={{ 
                            background: 'linear-gradient(45deg, #90caf9 30%, #c3fdff 90%)',
                            color: '#1a3d5c',
                            boxShadow: '0 2px 6px rgba(144, 202, 249, 0.5)',
                            '&:hover': {
                              boxShadow: '0 4px 10px rgba(144, 202, 249, 0.7)',
                            }
                          }}
                        >
                          Seleccionar
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      <Typography variant="body1" color="textSecondary" sx={{ py: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                        <SearchIcon sx={{ fontSize: 40, color: 'primary.main', opacity: 0.6 }} />
                        {searchQuery
                          ? 'No se encontraron pasajeros con ese criterio de búsqueda.'
                          : 'Ingrese un término para buscar pasajeros.'}
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </StyledTableContainer>
        </DialogContent>
        <DialogActions sx={{ p: 2, backgroundColor: alpha('#f8f9fa', 0.7) }}>
          <Button 
            onClick={() => setIsSearchDialogOpen(false)}
            sx={{ 
              color: 'primary.dark',
              borderRadius: 2,
              px: 3
            }}
          >
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo de edición */}
      <Dialog
        open={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            background: 'linear-gradient(to bottom, #ffffff, #f8f9fa)',
            overflow: 'hidden'
          }
        }}
      >
        <DialogTitle sx={{ 
          backgroundImage: 'linear-gradient(90deg, #ffcc80 0%, #ffffb0 100%)', 
          color: 'secondary.dark',
          display: 'flex',
          alignItems: 'center',
          position: 'relative'
        }}>
          <EditIcon sx={{ mr: 1 }} />
          Editar Pasajero
          <Box sx={{ position: 'absolute', right: 40, opacity: 0.2 }}>
            <FlightTakeoffIcon sx={{ fontSize: 30 }} />
          </Box>
        </DialogTitle>
        <DialogContent>
          {currentPassenger && (
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  fullWidth
                  label="Tipo de Documento"
                  select
                  value={currentPassenger.documentType}
                  onChange={(e) => {
                    const newType = e.target.value;
                    setCurrentPassenger({
                      ...currentPassenger,
                      documentType: newType,
                      documentNumber: '' // Limpiar el número al cambiar el tipo
                    });
                  }}
                  sx={{ 
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      '& fieldset': {
                        borderColor: 'primary.light',
                      },
                      '&:hover fieldset': {
                        borderColor: 'primary.main',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: 'primary.dark',
                      },
                    },
                  }}
                >
                  <MenuItem value="DNI">DNI</MenuItem>
                  <MenuItem value="PASAPORTE">Pasaporte</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  fullWidth
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
                  label="¿Requiere Visa?"
                  select
                  value={currentPassenger.hasVisa}
                  onChange={(e) => setCurrentPassenger({
                    ...currentPassenger,
                    hasVisa: e.target.value === 'true'
                  })}
                >
                  <MenuItem value="false">No</MenuItem>
                  <MenuItem value="true">Sí</MenuItem>
                </TextField>
              </Grid>
              {currentPassenger.hasVisa && (
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    fullWidth
                    label="Número de Visa"
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
            </Grid>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2, backgroundColor: alpha('#f8f9fa', 0.7) }}>
          <Button 
            onClick={() => setIsEditDialogOpen(false)}
            sx={{ 
              color: 'primary.dark',
              borderRadius: 2,
              px: 3
            }}
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleUpdatePassenger} 
            variant="contained"
            sx={{ 
              background: 'linear-gradient(45deg, #ffcc80 30%, #ffffb0 90%)',
              color: '#7f4f24',
              borderRadius: 2,
              px: 3,
              boxShadow: '0 2px 6px rgba(255, 204, 128, 0.5)',
              '&:hover': {
                boxShadow: '0 4px 10px rgba(255, 204, 128, 0.7)',
              }
            }}
          >
            Guardar Cambios
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default PassengerFormPage;