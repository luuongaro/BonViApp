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
  MenuItem,
  Paper,
  IconButton,
  alpha,
  Card,
  CardContent,
  useTheme,
  Divider,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import DateRangeIcon from '@mui/icons-material/DateRange';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import PeopleIcon from '@mui/icons-material/People';
import HotelIcon from '@mui/icons-material/Hotel';
import ChildCareIcon from '@mui/icons-material/ChildCare';
import PersonPinIcon from '@mui/icons-material/PersonPin';
import AirplanemodeActiveIcon from '@mui/icons-material/AirplanemodeActive';
import SaveIcon from '@mui/icons-material/Save';

interface DateRange {
  startDate: string;
  endDate: string;
}

interface MonthOnly {
  month: string;
  year: string;
}

// Componentes con estilos personalizados
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

const FormPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  position: 'relative',
  borderRadius: 16,
  overflow: 'hidden',
  boxShadow: '0 8px 24px rgba(149, 157, 165, 0.1)',
  marginBottom: theme.spacing(4),
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '4px',
    background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.light})`,
  }
}));

const StyledRadio = styled(Radio)(({ theme }) => ({
  color: theme.palette.primary.main,
  '&.Mui-checked': {
    color: theme.palette.primary.dark,
  },
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  color: theme.palette.primary.dark,
  position: 'relative',
  marginBottom: theme.spacing(2),
  marginTop: theme.spacing(2),
  '&::before': {
    content: '""',
    display: 'inline-block',
    width: 3,
    height: 20,
    backgroundColor: theme.palette.secondary.main,
    marginRight: theme.spacing(1.5),
    borderRadius: 4,
  },
}));

const NewRequestForm = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const [dateType, setDateType] = useState<'range' | 'month'>('range');
  const [dateRange, setDateRange] = useState<DateRange>({ startDate: '', endDate: '' });
  const [monthOnly, setMonthOnly] = useState<MonthOnly>({ month: '', year: '' });
  const [formData, setFormData] = useState({
    passengers: '',
    nights: '',
    minors: '',
    infants: '',
    creationDate: new Date().toISOString().split('T')[0], // Default to today
    responsible: 'Flor', // Default to Flor
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

    if (!formData.responsible) {
      alert('Por favor seleccione un responsable');
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
      responsible: formData.responsible,
    };

    try {
      // Get existing requests from localStorage
      const existingRequestsStr = localStorage.getItem('requests');
      const existingRequests = existingRequestsStr ? JSON.parse(existingRequestsStr) : [];
      
      // Add new request to the array
      const updatedRequests = [...existingRequests, newRequest];
      
      // Save back to localStorage
      localStorage.setItem('requests', JSON.stringify(updatedRequests));

      // Navigate back to the requests list
      navigate('/reservas');
    } catch (error) {
      console.error('Error saving request:', error);
      alert('Error al guardar el pedido. Por favor intente nuevamente.');
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, pb: 8, position: 'relative' }}>
      {/* Elementos decorativos */}
      <Box 
        sx={{ 
          position: 'absolute', 
          right: -50, 
          top: 100, 
          opacity: 0.03, 
          transform: 'rotate(15deg)',
          zIndex: 0,
          pointerEvents: 'none'
        }}
      >
        <AirplanemodeActiveIcon sx={{ fontSize: 250, color: 'primary.main' }} />
      </Box>
      
      <PageHeader>
        <IconButton 
          onClick={() => navigate('/reservas')} 
          sx={{ 
            mr: 2, 
            backgroundColor: 'primary.light',
            color: 'primary.dark',
            '&:hover': {
              backgroundColor: alpha(theme.palette.primary.main, 0.2),
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
          <FlightTakeoffIcon sx={{ mr: 1.5, WebkitTextFillColor: '#5d99c6' }} />
          Nuevo Pedido
        </Typography>
      </PageHeader>

      <FormPaper elevation={3}>
        <Box component="form" onSubmit={handleSubmit} sx={{ position: 'relative', zIndex: 1 }}>
          <SectionTitle variant="h6">
            <PersonPinIcon sx={{ mr: 1.5, fontSize: '1.2rem' }} />
            Información Básica
          </SectionTitle>
          
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Fecha de Creación"
                type="date"
                name="creationDate"
                value={formData.creationDate}
                onChange={handleInputChange}
                InputLabelProps={{ shrink: true }}
                InputProps={{
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
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                label="Responsable"
                name="responsible"
                value={formData.responsible}
                onChange={handleInputChange}
                InputProps={{
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
              >
                <MenuItem value="Flor">Flor</MenuItem>
                <MenuItem value="Sole">Sole</MenuItem>
              </TextField>
            </Grid>
          </Grid>

          <Divider sx={{ mb: 3, opacity: 0.6 }} />
          
          <SectionTitle variant="h6">
            <CalendarMonthIcon sx={{ mr: 1.5, fontSize: '1.2rem' }} />
            Fecha del Viaje
          </SectionTitle>

          <Card 
            variant="outlined" 
            sx={{ 
              mb: 4, 
              borderRadius: 3,
              borderColor: alpha(theme.palette.primary.main, 0.2),
              boxShadow: 'none'
            }}
          >
            <CardContent>
              <FormControl component="fieldset" sx={{ width: '100%' }}>
                <RadioGroup 
                  value={dateType} 
                  onChange={handleDateTypeChange}
                  sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    mb: 2
                  }}
                >
                  <FormControlLabel
                    value="range"
                    control={<StyledRadio />}
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <DateRangeIcon sx={{ mr: 0.5, color: theme.palette.primary.main }} />
                        <Typography>Rango de fechas</Typography>
                      </Box>
                    }
                    sx={{ mr: 4 }}
                  />
                  <FormControlLabel
                    value="month"
                    control={<StyledRadio />}
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <CalendarMonthIcon sx={{ mr: 0.5, color: theme.palette.primary.main }} />
                        <Typography>Solo mes</Typography>
                      </Box>
                    }
                  />
                </RadioGroup>

                {dateType === 'range' ? (
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Fecha de inicio"
                        type="date"
                        value={dateRange.startDate}
                        onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
                        InputLabelProps={{ shrink: true }}
                        InputProps={{
                          sx: { borderRadius: 2 }
                        }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                              borderColor: alpha(theme.palette.primary.main, 0.3),
                            },
                            '&:hover fieldset': {
                              borderColor: theme.palette.primary.main,
                            },
                          },
                        }}
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
                        InputProps={{
                          sx: { borderRadius: 2 }
                        }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                              borderColor: alpha(theme.palette.primary.main, 0.3),
                            },
                            '&:hover fieldset': {
                              borderColor: theme.palette.primary.main,
                            },
                          },
                        }}
                      />
                    </Grid>
                  </Grid>
                ) : (
                  <Grid container spacing={3}>
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
                        InputProps={{
                          sx: { borderRadius: 2 }
                        }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                              borderColor: alpha(theme.palette.primary.main, 0.3),
                            },
                            '&:hover fieldset': {
                              borderColor: theme.palette.primary.main,
                            },
                          },
                        }}
                      />
                    </Grid>
                  </Grid>
                )}
              </FormControl>
            </CardContent>
          </Card>

          <SectionTitle variant="h6">
            <PeopleIcon sx={{ mr: 1.5, fontSize: '1.2rem' }} />
            Pasajeros y Estadía
          </SectionTitle>

          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Cantidad de Pasajeros"
                type="number"
                name="passengers"
                value={formData.passengers}
                onChange={handleInputChange}
                InputProps={{
                  startAdornment: <PeopleIcon sx={{ color: 'primary.main', mr: 1 }} />,
                  sx: { borderRadius: 2 }
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: alpha(theme.palette.primary.main, 0.3),
                    },
                    '&:hover fieldset': {
                      borderColor: theme.palette.primary.main,
                    },
                  },
                }}
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
                InputProps={{
                  startAdornment: <HotelIcon sx={{ color: 'primary.main', mr: 1 }} />,
                  sx: { borderRadius: 2 }
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: alpha(theme.palette.primary.main, 0.3),
                    },
                    '&:hover fieldset': {
                      borderColor: theme.palette.primary.main,
                    },
                  },
                }}
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
                InputProps={{
                  startAdornment: <ChildCareIcon sx={{ color: 'secondary.main', mr: 1 }} />,
                  sx: { borderRadius: 2 }
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: alpha(theme.palette.secondary.main, 0.3),
                    },
                    '&:hover fieldset': {
                      borderColor: theme.palette.secondary.main,
                    },
                  },
                }}
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
                InputProps={{
                  startAdornment: <ChildCareIcon sx={{ color: 'secondary.main', mr: 1 }} />,
                  sx: { borderRadius: 2 }
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: alpha(theme.palette.secondary.main, 0.3),
                    },
                    '&:hover fieldset': {
                      borderColor: theme.palette.secondary.main,
                    },
                  },
                }}
              />
            </Grid>
          </Grid>

          <Box sx={{ mt: 5, display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="outlined"
              onClick={() => navigate('/reservas')}
              sx={{ 
                mr: 2,
                borderColor: 'primary.main',
                color: 'primary.dark',
                '&:hover': {
                  backgroundColor: 'primary.light',
                  borderColor: 'primary.dark',
                }
              }}
            >
              Cancelar
            </Button>
            <Button
              variant="contained"
              size="large"
              type="submit"
              startIcon={<SaveIcon />}
              sx={{ 
                background: 'linear-gradient(45deg, #90caf9 30%, #c3fdff 90%)',
                color: '#1a3d5c',
                boxShadow: '0 2px 6px rgba(144, 202, 249, 0.5)',
                '&:hover': {
                  boxShadow: '0 4px 10px rgba(144, 202, 249, 0.7)',
                }
              }}
            >
              Crear Pedido
            </Button>
          </Box>
        </Box>
      </FormPaper>
    </Container>
  );
};

export default NewRequestForm;