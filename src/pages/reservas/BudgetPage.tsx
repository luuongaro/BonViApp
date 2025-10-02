import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Paper,
  Button,
  Grid,
  TextField,
  MenuItem,
  List,
  ListItem,
  IconButton,
  Divider,
  Collapse,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PrintIcon from '@mui/icons-material/Print';

interface BudgetOption {
  id: string;
  items: BudgetItem[];
}

interface BudgetItem {
  date: string;
  endDate: string;
  serviceType: 'aereo' | 'hotel' | 'excursion' | 'traslado' | null;
  details: string;
  rate: number;
  rateCurrency: 'ARS' | 'USD' | 'EUR';
  expenses: number;
  expensesCurrency: 'ARS' | 'USD' | 'EUR';
  finalPrice: number;
  finalPriceCurrency: 'ARS' | 'USD' | 'EUR';
  showEndDate: boolean;
  reservationCode: string;
}

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

const BudgetPage = () => {
  const navigate = useNavigate();
  const { requestId } = useParams<{ requestId: string }>();
  const [budgetOptions, setBudgetOptions] = useState<BudgetOption[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [requestDetails, setRequestDetails] = useState<Request | null>(null);
  const [isPrintMode, setIsPrintMode] = useState(false);

  useEffect(() => {
    if (requestId) {
      // Cargar detalles de la solicitud
      const savedRequestsStr = localStorage.getItem('requests');
      if (savedRequestsStr) {
        const savedRequests = JSON.parse(savedRequestsStr);
        const request = savedRequests.find((r: Request) => r.id === requestId);
        if (request) {
          setRequestDetails(request);
        }
      }
      
      // Cargar presupuesto existente si existe
      const savedBudgetStr = localStorage.getItem(`budget_${requestId}`);
      if (savedBudgetStr) {
        try {
          const savedBudget = JSON.parse(savedBudgetStr);
          if (savedBudget.budgetOptions) {
            setBudgetOptions(savedBudget.budgetOptions);
          }
        } catch (error) {
          console.error('Error al cargar el presupuesto guardado:', error);
        }
      }
    }
  }, [requestId]);

  const handleAddOption = () => {
    const newOption: BudgetOption = {
      id: `option-${budgetOptions.length + 1}`,
      items: [],
    };
    setBudgetOptions([...budgetOptions, newOption]);
    setSelectedOption(newOption.id);
  };

  const handleAddItem = (optionId: string) => {
    setBudgetOptions(options =>
      options.map(option =>
        option.id === optionId
          ? {
              ...option,
              items: [
                ...option.items,
                {
                  date: '',
                  endDate: '',
                  serviceType: null,
                  details: '',
                  rate: 0,
                  rateCurrency: 'ARS',
                  expenses: 0,
                  expensesCurrency: 'ARS',
                  finalPrice: 0,
                  finalPriceCurrency: 'ARS',
                  showEndDate: false,
                  reservationCode: '',
                },
              ],
            }
          : option
      )
    );
  };

  const handleItemChange = (optionId: string, itemIndex: number, field: keyof BudgetItem, value: string | number | boolean) => {
    setBudgetOptions(options =>
      options.map(option =>
        option.id === optionId
          ? {
              ...option,
              items: option.items.map((item, index) =>
                index === itemIndex
                  ? {
                      ...item,
                      [field]: value,
                      finalPrice: field === 'rate' || field === 'expenses'
                        ? Number(value) + (field === 'rate' ? item.expenses : item.rate)
                        : item.finalPrice,
                    }
                  : item
              ),
            }
          : option
      )
    );
  };

  const handleDeleteItem = (optionId: string, itemIndex: number) => {
    setBudgetOptions(options =>
      options.map(option =>
        option.id === optionId
          ? {
              ...option,
              items: option.items.filter((_, index) => index !== itemIndex),
            }
          : option
      )
    );
  };

  const handleDeleteOption = (optionId: string) => {
    setBudgetOptions(options => options.filter(option => option.id !== optionId));
    if (selectedOption === optionId) {
      setSelectedOption(null);
    }
  };

  const handleToggleEndDate = (optionId: string, itemIndex: number) => {
    setBudgetOptions(options =>
      options.map(option =>
        option.id === optionId
          ? {
              ...option,
              items: option.items.map((item, index) =>
                index === itemIndex
                  ? {
                      ...item,
                      showEndDate: !item.showEndDate,
                    }
                  : item
              ),
            }
          : option
      )
    );
  };

  const handleBack = () => {
    navigate('/reservas');
  };

  const handleApproveBudget = () => {
    // Guardar toda la información del presupuesto
    try {
      if (!requestDetails) {
        alert('No se encontraron los detalles del pedido');
        return;
      }

      const budgetData = {
        requestId,
        requestDetails,
        budgetOptions,
        approvalDate: new Date().toISOString(),
      };
      
      // Guardar el presupuesto en localStorage
      localStorage.setItem(`budget_${requestId}`, JSON.stringify(budgetData));
      
      // Crear la reserva a partir del presupuesto
      const reservation = {
        id: `res_${requestId}`,
        requestId,
        budgetData,
        status: 'active',
        creationDate: new Date().toISOString(),
        travelDate: requestDetails.travelDate,
        passengers: [], // Initialize with empty array for passengers, not a number
        passengerCount: requestDetails.passengers, // Store the count separately
        nights: requestDetails.nights,
        minors: requestDetails.minors,
        infants: requestDetails.infants,
        responsible: requestDetails.responsible,
        totalAmount: budgetOptions.reduce((total, option) => 
          total + option.items.reduce((optionTotal, item) => 
            optionTotal + item.finalPrice, 0
          ), 0
        ),
        reservationCodes: budgetOptions.flatMap(option => 
          option.items.map(item => ({
            serviceType: item.serviceType || 'otro',
            code: item.reservationCode || '',
            date: item.date,
            endDate: item.endDate,
            details: item.details,
            rate: item.rate,
            rateCurrency: item.rateCurrency,
            expenses: item.expenses,
            expensesCurrency: item.expensesCurrency,
            finalPrice: item.finalPrice,
            finalPriceCurrency: item.finalPriceCurrency
          }))
        ),
        payments: []
      };

      // Guardar la reserva en localStorage
      const existingReservations = JSON.parse(localStorage.getItem('reservations') || '[]');
      existingReservations.push(reservation);
      localStorage.setItem('reservations', JSON.stringify(existingReservations));
      
      // Eliminar el pedido original ya que se ha convertido en reserva
      const existingRequests = JSON.parse(localStorage.getItem('requests') || '[]');
      const updatedRequests = existingRequests.filter((req: any) => req.id !== requestId);
      localStorage.setItem('requests', JSON.stringify(updatedRequests));
      
      alert('Presupuesto aprobado y reserva creada correctamente');
      
      // Navegar a la página de reservas
      navigate('/reservas');
    } catch (error) {
      console.error('Error al guardar el presupuesto y crear la reserva:', error);
      alert('Error al procesar la operación. Por favor intente nuevamente.');
    }
  };

  const handlePrintBudget = () => {
    setIsPrintMode(true);
    setTimeout(() => {
      window.print();
      setIsPrintMode(false);
    }, 100);
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  const handleSaveBudget = () => {
    try {
      if (!requestId || !requestDetails) {
        alert('No se puede guardar el presupuesto: falta información de la solicitud');
        return;
      }
      
      const budgetData = {
        requestId,
        requestDetails: {
          id: requestDetails.id,
          travelDate: requestDetails.travelDate,
          creationDate: requestDetails.creationDate,
          passengers: requestDetails.passengers,
          nights: requestDetails.nights,
          minors: requestDetails.minors,
          infants: requestDetails.infants,
          responsible: requestDetails.responsible
        },
        budgetOptions,
        lastModified: new Date().toISOString(),
      };
      
      // Guardar el presupuesto en localStorage
      localStorage.setItem(`budget_${requestId}`, JSON.stringify(budgetData));
      
      alert('Presupuesto guardado correctamente');
      
      // Navegar a la página de reservas
      navigate('/reservas');
    } catch (error) {
      console.error('Error al guardar el presupuesto:', error);
      alert('Error al guardar el presupuesto. Por favor intente nuevamente.');
    }
  };

  if (!requestDetails) {
    return (
      <Container>
        <Typography>No se encontró el pedido</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <IconButton onClick={handleBack} sx={{ mr: 2 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" component="h1">
          Presupuesto para Pedido #{requestId}
        </Typography>
      </Box>

      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Detalles del Pedido
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography><strong>Fecha de Creación:</strong> {requestDetails.creationDate}</Typography>
            <Typography><strong>Fecha de Viaje:</strong> {requestDetails.travelDate}</Typography>
            <Typography><strong>Responsable:</strong> {requestDetails.responsible}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography><strong>Pasajeros:</strong> {requestDetails.passengers}</Typography>
            <Typography><strong>Noches:</strong> {requestDetails.nights}</Typography>
            <Typography><strong>Menores:</strong> {requestDetails.minors}</Typography>
            <Typography><strong>Infantes:</strong> {requestDetails.infants}</Typography>
          </Grid>
        </Grid>
      </Paper>

      <Box sx={{ mb: 4 }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddOption}
        >
          Agregar Opción
        </Button>
      </Box>

      {budgetOptions.map((option) => (
        <Paper key={option.id} elevation={3} sx={{ p: 3, mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">
              Opción {option.id.split('-')[1]}
            </Typography>
            <Box>
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={() => handleAddItem(option.id)}
                sx={{ mr: 1 }}
              >
                Agregar Item
              </Button>
              <IconButton
                color="error"
                onClick={() => handleDeleteOption(option.id)}
              >
                <DeleteIcon />
              </IconButton>
            </Box>
          </Box>

          <List>
            {option.items.map((item, index) => (
              <React.Fragment key={index}>
                <ListItem>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} md={2}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <TextField
                          fullWidth
                          label="Fecha de Inicio"
                          type="date"
                          value={item.date}
                          onChange={(e) => handleItemChange(option.id, index, 'date', e.target.value)}
                          InputLabelProps={{ shrink: true }}
                        />
                        <IconButton 
                          size="small" 
                          onClick={() => handleToggleEndDate(option.id, index)}
                          sx={{ ml: 1 }}
                        >
                          <AddIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={6} md={2}>
                      <Collapse in={item.showEndDate}>
                        <TextField
                          fullWidth
                          label="Fecha de Fin"
                          type="date"
                          value={item.endDate}
                          onChange={(e) => handleItemChange(option.id, index, 'endDate', e.target.value)}
                          InputLabelProps={{ shrink: true }}
                        />
                      </Collapse>
                    </Grid>
                    <Grid item xs={12} sm={6} md={2}>
                      <TextField
                        fullWidth
                        select
                        label="Tipo de Servicio"
                        value={item.serviceType || ''}
                        onChange={(e) => handleItemChange(option.id, index, 'serviceType', e.target.value as any)}
                      >
                        <MenuItem value="aereo">Aéreo</MenuItem>
                        <MenuItem value="hotel">Hotel</MenuItem>
                        <MenuItem value="excursion">Excursión</MenuItem>
                        <MenuItem value="traslado">Traslado</MenuItem>
                      </TextField>
                    </Grid>
                    <Grid item xs={12} sm={6} md={2}>
                      <TextField
                        fullWidth
                        label="Código de Reserva"
                        value={item.reservationCode || ''}
                        onChange={(e) => handleItemChange(option.id, index, 'reservationCode', e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <TextField
                        fullWidth
                        label="Detalles"
                        value={item.details}
                        onChange={(e) => handleItemChange(option.id, index, 'details', e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3} sx={{ display: isPrintMode ? 'none' : 'block' }}>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <TextField
                          fullWidth
                          label="Tarifa"
                          type="number"
                          value={item.rate}
                          onChange={(e) => handleItemChange(option.id, index, 'rate', Number(e.target.value))}
                          sx={{ flexGrow: 1 }}
                        />
                        <TextField
                          select
                          value={item.rateCurrency}
                          onChange={(e) => handleItemChange(option.id, index, 'rateCurrency', e.target.value)}
                          sx={{ width: '80px' }}
                        >
                          <MenuItem value="ARS">ARS</MenuItem>
                          <MenuItem value="USD">USD</MenuItem>
                          <MenuItem value="EUR">EUR</MenuItem>
                        </TextField>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3} sx={{ display: isPrintMode ? 'none' : 'block' }}>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <TextField
                          fullWidth
                          label="Gastos"
                          type="number"
                          value={item.expenses}
                          onChange={(e) => handleItemChange(option.id, index, 'expenses', Number(e.target.value))}
                          sx={{ flexGrow: 1 }}
                        />
                        <TextField
                          select
                          value={item.expensesCurrency}
                          onChange={(e) => handleItemChange(option.id, index, 'expensesCurrency', e.target.value)}
                          sx={{ width: '80px' }}
                        >
                          <MenuItem value="ARS">ARS</MenuItem>
                          <MenuItem value="USD">USD</MenuItem>
                          <MenuItem value="EUR">EUR</MenuItem>
                        </TextField>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <TextField
                          fullWidth
                          label="Total"
                          value={formatCurrency(item.finalPrice, item.finalPriceCurrency)}
                          InputProps={{ 
                            readOnly: true,
                            sx: { 
                              fontSize: '1.2rem',
                              fontWeight: 'bold',
                              color: 'primary.main',
                              '& .MuiInputBase-input': {
                                textAlign: 'center',
                                padding: '12px 8px',
                              }
                            }
                          }}
                          sx={{
                            flexGrow: 1,
                            '& .MuiOutlinedInput-root': {
                              backgroundColor: 'rgba(25, 118, 210, 0.04)',
                              '&:hover .MuiOutlinedInput-notchedOutline': {
                                borderColor: 'primary.main',
                              },
                            },
                            '& .MuiInputLabel-root': {
                              fontWeight: 'bold',
                            }
                          }}
                        />
                        <TextField
                          select
                          value={item.finalPriceCurrency}
                          onChange={(e) => handleItemChange(option.id, index, 'finalPriceCurrency', e.target.value)}
                          sx={{ width: '80px', display: isPrintMode ? 'none' : 'block' }}
                        >
                          <MenuItem value="ARS">ARS</MenuItem>
                          <MenuItem value="USD">USD</MenuItem>
                          <MenuItem value="EUR">EUR</MenuItem>
                        </TextField>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={6} md={1} sx={{ display: isPrintMode ? 'none' : 'block' }}>
                      <IconButton
                        color="error"
                        onClick={() => handleDeleteItem(option.id, index)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Grid>
                  </Grid>
                </ListItem>
                {index < option.items.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        </Paper>
      ))}

      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
        <Button
          variant="outlined"
          onClick={handleSaveBudget}
          size="large"
        >
          Guardar
        </Button>
        <Button
          variant="contained"
          color="success"
          startIcon={<CheckCircleIcon />}
          onClick={handleApproveBudget}
          size="large"
        >
          Presupuesto Aprobado
        </Button>
        <Button
          variant="outlined"
          startIcon={<PrintIcon />}
          onClick={handlePrintBudget}
          size="large"
        >
          Imprimir Presupuesto
        </Button>
      </Box>
    </Container>
  );
};

export default BudgetPage;