import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Button,
  Box,
  Paper,
  List,
  ListItem,
  ListItemText,
  Fab,
  ListItemSecondaryAction,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab,
  ThemeProvider,
  createTheme,
  alpha,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import RefreshIcon from '@mui/icons-material/Refresh';
import AirplanemodeActiveIcon from '@mui/icons-material/AirplanemodeActive';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import FlightLandIcon from '@mui/icons-material/FlightLand';
import EventIcon from '@mui/icons-material/Event';
import PeopleIcon from '@mui/icons-material/People';
import LuggageIcon from '@mui/icons-material/Luggage';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import { useNavigate } from 'react-router-dom';

// Colores pastel personalizados
const pastelTheme = createTheme({
  palette: {
    primary: {
      main: '#90caf9', // Azul pastel
      light: '#c3fdff',
      dark: '#5d99c6',
    },
    secondary: {
      main: '#ffcc80', // Naranja pastel
      light: '#ffffb0',
      dark: '#ca9b52',
    },
    background: {
      default: '#f8f9fa',
      paper: '#ffffff',
    },
    success: {
      main: '#81c784',
      light: '#c8e6c9',
      dark: '#4caf50',
    },
    warning: {
      main: '#ffb74d',
      light: '#ffe0b2',
      dark: '#ff9800',
    },
    error: {
      main: '#e57373',
      light: '#ffcdd2',
      dark: '#f44336',
    },
  },
  typography: {
    fontFamily: '"Quicksand", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
      letterSpacing: '0.02em',
    },
    h5: {
      fontWeight: 600,
      letterSpacing: '0.01em',
    },
    h6: {
      fontWeight: 600,
      letterSpacing: '0.01em',
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 8px 24px rgba(149, 157, 165, 0.1)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '8px 16px',
        },
      },
    },
    MuiFab: {
      styleOverrides: {
        root: {
          boxShadow: '0 4px 12px rgba(144, 202, 249, 0.4)',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 6,
        },
      },
    },
  },
});

// Estilos personalizados
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

const StyledTabs = styled(Tabs)(({ theme }) => ({
  '& .MuiTab-root': {
    minHeight: 64,
    fontWeight: 600,
    transition: 'all 0.3s',
    '&:hover': {
      backgroundColor: alpha(theme.palette.primary.light, 0.1),
    },
  },
  '& .Mui-selected': {
    color: theme.palette.primary.dark,
    fontWeight: 700,
  },
  '& .MuiTabs-indicator': {
    height: 3,
    borderRadius: 3,
    backgroundColor: theme.palette.secondary.main,
  },
}));

const StyledListItem = styled(ListItem)(({ theme, color }) => ({
  position: 'relative',
  borderLeft: `4px solid ${color || theme.palette.primary.main}`,
  transition: 'all 0.2s ease',
  margin: '8px 0',
  borderRadius: '0 12px 12px 0',
  overflow: 'hidden',
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.light, 0.05),
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 0,
    backgroundColor: alpha(color || theme.palette.primary.main, 0.05),
    transition: 'height 0.3s ease',
    zIndex: 0,
  },
  '&:hover::before': {
    height: '100%',
  },
}));

const SectionHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: theme.spacing(3),
  position: 'relative',
}));

interface Request {
  id: string;
  travelDate: string;
  creationDate: string;
  passengers: number;
  nights: number;
  minors: number;
  infants: number;
  responsible: string;
}

interface ReservationCode {
  serviceType: string;
  code: string;
  date: string;
  endDate: string;
  details: string;
}

interface Reservation {
  id: string;
  requestId: string;
  budgetData: any;
  status: string;
  creationDate: string;
  travelDate: string;
  passengers: number | any[];
  passengerCount?: number;  // Added this optional property
  nights: number;
  minors: number;
  infants: number;
  responsible: string;
  totalAmount: number;
  reservationCodes: ReservationCode[];
}

// Componentes decorativos
const FloatingAirplane = styled(Box)(({ theme }) => ({
  position: 'absolute',
  right: -10,
  top: -20,
  zIndex: 0,
  transform: 'rotate(5deg)',
  opacity: 0.06,
  pointerEvents: 'none',
}));

const BackgroundDecoration = styled(Box)(({ theme }) => ({
  position: 'absolute',
  right: 30,
  bottom: 20,
  opacity: 0.03,
  zIndex: 0,
  transform: 'rotate(-10deg)',
  pointerEvents: 'none',
}));

const ReservasPage = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState<Request[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [requestToDelete, setRequestToDelete] = useState<string | null>(null);
  const [reservationToDelete, setReservationToDelete] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState(0);

  const loadRequests = () => {
    try {
      const savedRequestsStr = localStorage.getItem('requests');
      if (savedRequestsStr) {
        const savedRequests = JSON.parse(savedRequestsStr);
        setRequests(savedRequests);
      } else {
        setRequests([]);
      }
    } catch (error) {
      console.error('Error loading requests:', error);
      setRequests([]);
    }
  };

  const loadReservations = () => {
    try {
      const savedReservationsStr = localStorage.getItem('reservations');
      if (savedReservationsStr) {
        const savedReservations: Reservation[] = JSON.parse(savedReservationsStr);
        // Don't filter by status to show all reservations
        setReservations(savedReservations);
        console.log('Loaded reservations:', savedReservations);
      } else {
        setReservations([]);
      }
    } catch (error) {
      console.error('Error loading reservations:', error);
      setReservations([]);
    }
  };

  const hasSavedBudget = (requestId: string): boolean => {
    const budgetData = localStorage.getItem(`budget_${requestId}`);
    return !!budgetData;
  };

  useEffect(() => {
    loadRequests();
    loadReservations();
  }, []);

  const handleNewRequest = () => {
    navigate('/reservas/new');
  };

  const handleStartBudget = (requestId: string) => {
    navigate(`/reservas/budget/${requestId}`);
  };

  const handleDeleteClick = (requestId: string) => {
    setRequestToDelete(requestId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteReservationClick = (reservationId: string) => {
    setReservationToDelete(reservationId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (requestToDelete) {
      const updatedRequests = requests.filter(request => request.id !== requestToDelete);
      localStorage.setItem('requests', JSON.stringify(updatedRequests));
      setRequests(updatedRequests);
      setDeleteDialogOpen(false);
      setRequestToDelete(null);
    } else if (reservationToDelete) {
      const updatedReservations = reservations.filter(reservation => reservation.id !== reservationToDelete);
      localStorage.setItem('reservations', JSON.stringify(updatedReservations));
      setReservations(updatedReservations);
      setDeleteDialogOpen(false);
      setReservationToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setRequestToDelete(null);
    setReservationToDelete(null);
  };

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  const getRequestAge = (creationDate: string): number => {
    const created = new Date(creationDate);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - created.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getRequestColor = (age: number): 'success' | 'warning' | 'error' => {
    if (age <= 3) return 'success';
    if (age <= 5) return 'warning';
    return 'error';
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'confirmada':
        return pastelTheme.palette.success.main;
      case 'pendiente':
        return pastelTheme.palette.warning.main;
      case 'pagada':
        return pastelTheme.palette.success.dark;
      default:
        return pastelTheme.palette.primary.main;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(amount);
  };

  return (
    <ThemeProvider theme={pastelTheme}>
      <Container maxWidth="lg" sx={{ mt: 4, pb: 6, position: 'relative' }}>
        <FloatingAirplane>
          <AirplanemodeActiveIcon sx={{ fontSize: 180, color: 'primary.light' }} />
        </FloatingAirplane>

        <PageHeader>
          <IconButton 
            onClick={handleBackToHome} 
            sx={{ 
              mr: 2, 
              backgroundColor: 'primary.light',
              color: 'primary.dark',
              '&:hover': {
                backgroundColor: alpha(pastelTheme.palette.primary.main, 0.2),
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
              zIndex: 1,
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <LuggageIcon sx={{ mr: 1.5, WebkitTextFillColor: '#5d99c6' }} />
            Gestión de Reservas
          </Typography>
        </PageHeader>

        <Paper sx={{ mb: 4, overflow: 'hidden', position: 'relative' }}>
          <StyledTabs 
            value={activeTab} 
            onChange={handleTabChange}
            variant="fullWidth"
          >
            <Tab 
              label="Administrador de Pedidos" 
              icon={<FlightTakeoffIcon />} 
              iconPosition="start"
            />
            <Tab 
              label="Reservas Activas" 
              icon={<ConfirmationNumberIcon />} 
              iconPosition="start"
            />
          </StyledTabs>
        </Paper>

        {activeTab === 0 && (
          <>
            <SectionHeader>
              <Typography 
                variant="h5" 
                component="h2" 
                sx={{ 
                  color: 'primary.dark',
                  display: 'flex',
                  alignItems: 'center',
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
                <FlightTakeoffIcon sx={{ mr: 1.5 }} />
                Administrador de Pedidos
              </Typography>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button 
                  variant="outlined" 
                  onClick={loadRequests} 
                  startIcon={<RefreshIcon />}
                  sx={{ 
                    borderColor: 'primary.main',
                    color: 'primary.dark',
                    '&:hover': {
                      backgroundColor: 'primary.light',
                      borderColor: 'primary.dark',
                    }
                  }}
                >
                  Actualizar
                </Button>
                <Fab
                  color="primary"
                  aria-label="add"
                  onClick={handleNewRequest}
                  sx={{ 
                    background: 'linear-gradient(45deg, #90caf9 30%, #c3fdff 90%)',
                    color: '#1a3d5c',
                    '&:hover': {
                      boxShadow: '0 6px 16px rgba(144, 202, 249, 0.6)',
                    }
                  }}
                >
                  <AddIcon />
                </Fab>
              </Box>
            </SectionHeader>

            <Paper 
              elevation={3} 
              sx={{ 
                position: 'relative', 
                overflow: 'hidden',
                borderTop: '4px solid',
                borderColor: 'primary.main',
              }}
            >
              <BackgroundDecoration>
                <FlightTakeoffIcon sx={{ fontSize: 180, color: 'primary.main' }} />
              </BackgroundDecoration>
              
              <List sx={{ position: 'relative', zIndex: 1 }}>
                {requests.length === 0 ? (
                  <ListItem sx={{ py: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <AirplanemodeActiveIcon sx={{ fontSize: 60, color: 'primary.light', mb: 2 }} />
                    <ListItemText
                      primary={
                        <Typography variant="h6" align="center" sx={{ mb: 1 }}>
                          No hay pedidos
                        </Typography>
                      }
                      secondary={
                        <Typography variant="body1" align="center" color="textSecondary">
                          Haga clic en el botón '+' para crear un nuevo pedido
                        </Typography>
                      }
                    />
                  </ListItem>
                ) : (
                  requests.map((request) => {
                    const age = getRequestAge(request.creationDate);
                    const color = getRequestColor(age);
                    const borderColor = 
                      color === 'success' ? pastelTheme.palette.success.main : 
                      color === 'warning' ? pastelTheme.palette.warning.main : 
                      pastelTheme.palette.error.main;
                    
                    return (
                      <StyledListItem 
                        key={request.id}
                        color={borderColor}
                        sx={{ px: 3, py: 2 }}
                      >
                        <ListItemText
                          primary={
                            <Typography 
                              variant="h6" 
                              sx={{ 
                                fontWeight: 600, 
                                color: 'primary.dark',
                                display: 'flex',
                                alignItems: 'center'
                              }}
                            >
                              Pedido #{request.id}
                            </Typography>
                          }
                          secondary={
                            <Box sx={{ mt: 1 }}>
                              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 1 }}>
                                <Chip 
                                  icon={<EventIcon />} 
                                  label={`Viaje: ${request.travelDate}`} 
                                  size="small"
                                  sx={{ 
                                    backgroundColor: alpha(pastelTheme.palette.primary.light, 0.2),
                                    color: 'primary.dark'
                                  }}
                                />
                                <Chip 
                                  icon={<PeopleIcon />} 
                                  label={`Pasajeros: ${request.passengers}`} 
                                  size="small"
                                  sx={{ 
                                    backgroundColor: alpha(pastelTheme.palette.secondary.light, 0.2),
                                    color: 'secondary.dark'
                                  }}
                                />
                              </Box>
                              <Typography component="div" variant="body2" color="text.secondary" sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                                <span>Creado: {formatDate(request.creationDate)}</span>
                                <span>Responsable: {request.responsible}</span>
                              </Typography>
                            </Box>
                          }
                        />
                        <ListItemSecondaryAction sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <IconButton 
                            edge="end" 
                            aria-label="delete" 
                            onClick={() => handleDeleteClick(request.id)}
                            sx={{ 
                              color: 'error.main',
                              '&:hover': { backgroundColor: alpha(pastelTheme.palette.error.light, 0.2) }
                            }}
                          >
                            <DeleteIcon />
                          </IconButton>
                          <Chip 
                            label={`${age} días`} 
                            color={color} 
                            size="small" 
                            sx={{ 
                              fontWeight: 600,
                              px: 1
                            }}
                          />
                          <Button
                            variant="contained"
                            onClick={() => handleStartBudget(request.id)}
                            sx={{ 
                              background: hasSavedBudget(request.id) 
                                ? 'linear-gradient(45deg, #ffcc80 30%, #ffffb0 90%)'
                                : 'linear-gradient(45deg, #90caf9 30%, #c3fdff 90%)',
                              color: hasSavedBudget(request.id) ? '#7f4f24' : '#1a3d5c',
                              boxShadow: hasSavedBudget(request.id)
                                ? '0 2px 6px rgba(255, 204, 128, 0.5)'
                                : '0 2px 6px rgba(144, 202, 249, 0.5)',
                              '&:hover': {
                                boxShadow: hasSavedBudget(request.id)
                                  ? '0 4px 10px rgba(255, 204, 128, 0.7)'
                                  : '0 4px 10px rgba(144, 202, 249, 0.7)',
                              }
                            }}
                          >
                            {hasSavedBudget(request.id) ? 'Revisar' : 'Empezar Presupuesto'}
                          </Button>
                        </ListItemSecondaryAction>
                      </StyledListItem>
                    );
                  })
                )}
              </List>
            </Paper>
          </>
        )}

        {activeTab === 1 && (
          <>
            <SectionHeader>
              <Typography 
                variant="h5" 
                component="h2" 
                sx={{ 
                  color: 'secondary.dark',
                  display: 'flex',
                  alignItems: 'center',
                  '&::before': {
                    content: '""',
                    display: 'inline-block',
                    width: 4,
                    height: 24,
                    backgroundColor: 'primary.main',
                    marginRight: 2,
                    borderRadius: 4
                  }
                }}
              >
                <ConfirmationNumberIcon sx={{ mr: 1.5 }} />
                Reservas Activas
              </Typography>
              <Button 
                variant="outlined" 
                onClick={loadReservations} 
                startIcon={<RefreshIcon />}
                sx={{ 
                  borderColor: 'secondary.main',
                  color: 'secondary.dark',
                  '&:hover': {
                    backgroundColor: 'secondary.light',
                    borderColor: 'secondary.dark',
                  }
                }}
              >
                Actualizar
              </Button>
            </SectionHeader>

            <Paper 
              elevation={3} 
              sx={{ 
                position: 'relative', 
                overflow: 'hidden',
                borderTop: '4px solid',
                borderColor: 'secondary.main',
              }}
            >
              <BackgroundDecoration>
                <FlightLandIcon sx={{ fontSize: 180, color: 'secondary.main' }} />
              </BackgroundDecoration>
              
              <List sx={{ position: 'relative', zIndex: 1 }}>
                {reservations.length === 0 ? (
                  <ListItem sx={{ py: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <AirplanemodeActiveIcon sx={{ fontSize: 60, color: 'secondary.light', mb: 2 }} />
                    <ListItemText
                      primary={
                        <Typography variant="h6" align="center" sx={{ mb: 1 }}>
                          No hay reservas activas
                        </Typography>
                      }
                      secondary={
                        <Typography variant="body1" align="center" color="textSecondary">
                          Las reservas aparecerán aquí cuando se aprueben los presupuestos
                        </Typography>
                      }
                    />
                  </ListItem>
                ) : (
                  reservations.map((reservation) => (
                    <StyledListItem 
                      key={reservation.id} 
                      color={getStatusColor(reservation.status)}
                      sx={{ px: 3, py: 2 }}
                    >
                      <ListItemText
                        primary={
                          <Typography 
                            variant="h6" 
                            sx={{ 
                              fontWeight: 600, 
                              color: 'secondary.dark',
                              display: 'flex',
                              alignItems: 'center'
                            }}
                          >
                            Reserva #{reservation.id}
                            <Chip 
                              label={reservation.status || 'Nueva'} 
                              size="small"
                              sx={{ 
                                ml: 2,
                                backgroundColor: alpha(getStatusColor(reservation.status), 0.2),
                                color: getStatusColor(reservation.status),
                                fontWeight: 600,
                                textTransform: 'capitalize'
                              }}
                            />
                          </Typography>
                        }
                        secondary={
                          <Box sx={{ mt: 1 }}>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 1 }}>
                              <Chip 
                                icon={<EventIcon />} 
                                label={`Viaje: ${formatDate(reservation.travelDate) || 'No especificada'}`} 
                                size="small"
                                sx={{ 
                                  backgroundColor: alpha(pastelTheme.palette.primary.light, 0.2),
                                  color: 'primary.dark'
                                }}
                              />
                              <Chip 
                                icon={<PeopleIcon />} 
                                label={`Pasajeros: ${reservation.passengerCount || (Array.isArray(reservation.passengers) ? reservation.passengers.length : 0)}`} 
                                size="small"
                                sx={{ 
                                  backgroundColor: alpha(pastelTheme.palette.secondary.light, 0.2),
                                  color: 'secondary.dark'
                                }}
                              />
                              <Chip 
                                icon={<MonetizationOnIcon />} 
                                label={`Total: ${formatCurrency(reservation.totalAmount || 0)}`} 
                                size="small"
                                sx={{ 
                                  backgroundColor: alpha(pastelTheme.palette.success.light, 0.2),
                                  color: 'success.dark',
                                  fontWeight: 600
                                }}
                              />
                            </Box>
                            <Typography component="div" variant="body2" color="text.secondary" sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                              <span>Creado: {formatDate(reservation.creationDate)}</span>
                              <span>Responsable: {reservation.responsible || 'No asignado'}</span>
                            </Typography>
                            
                            {reservation.reservationCodes && reservation.reservationCodes.length > 0 && (
                              <Box sx={{ mt: 1 }}>
                                <Typography variant="body2" color="text.secondary" component="div" sx={{ mb: 0.5 }}>
                                  Códigos de reserva:
                                </Typography>
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                  {reservation.reservationCodes.map((code, index) => (
                                    <Chip
                                      key={index}
                                      label={`${code.serviceType}: ${code.code}`}
                                      size="small"
                                      sx={{ 
                                        backgroundColor: alpha(pastelTheme.palette.info.light, 0.2),
                                        color: 'info.dark'
                                      }}
                                    />
                                  ))}
                                </Box>
                              </Box>
                            )}
                          </Box>
                        }
                      />
                      <ListItemSecondaryAction sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <IconButton 
                          edge="end" 
                          aria-label="delete" 
                          onClick={() => handleDeleteReservationClick(reservation.id)}
                          sx={{ 
                            color: 'error.main',
                            '&:hover': { backgroundColor: alpha(pastelTheme.palette.error.light, 0.2) }
                          }}
                        >
                          <DeleteIcon />
                        </IconButton>
                        <Button
                          variant="contained"
                          onClick={() => navigate(`/reservas/details/${reservation.id}`)}
                          sx={{ 
                            background: 'linear-gradient(45deg, #ffcc80 30%, #ffffb0 90%)',
                            color: '#7f4f24',
                            boxShadow: '0 2px 6px rgba(255, 204, 128, 0.5)',
                            '&:hover': {
                              boxShadow: '0 4px 10px rgba(255, 204, 128, 0.7)',
                            }
                          }}
                        >
                          Ver Detalles
                        </Button>
                      </ListItemSecondaryAction>
                    </StyledListItem>
                  ))
                )}
              </List>
            </Paper>
          </>
        )}

        <Dialog
          open={deleteDialogOpen}
          onClose={handleDeleteCancel}
          PaperProps={{
            sx: {
              borderRadius: 3,
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              overflow: 'hidden'
            }
          }}
        >
          <DialogTitle sx={{ 
            backgroundImage: 'linear-gradient(90deg, #ffcdd2 0%, #ffebee 100%)', 
            color: 'error.dark',
            display: 'flex',
            alignItems: 'center',
          }}>
            <DeleteIcon sx={{ mr: 1 }} />
            Confirmar eliminación
          </DialogTitle>
          <DialogContent sx={{ mt: 2, minWidth: 400 }}>
            <Typography variant="body1">
              {requestToDelete 
                ? "¿Está seguro que desea eliminar este pedido?" 
                : "¿Está seguro que desea eliminar esta reserva?"}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Esta acción no se puede deshacer.
            </Typography>
          </DialogContent>
          <DialogActions sx={{ p: 2, backgroundColor: alpha('#f8f9fa', 0.7) }}>
            <Button 
              onClick={handleDeleteCancel}
              sx={{ 
                color: 'text.primary',
                borderRadius: 2,
                px: 3
              }}
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleDeleteConfirm} 
              variant="contained"
              color="error"
              sx={{ 
                borderRadius: 2,
                px: 3,
              }}
            >
              Eliminar
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </ThemeProvider>
  );
};

export default ReservasPage;