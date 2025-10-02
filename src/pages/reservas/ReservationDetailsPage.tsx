import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
  Chip,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PaymentIcon from '@mui/icons-material/Payment';
import PeopleIcon from '@mui/icons-material/People';
import PrintIcon from '@mui/icons-material/Print';

interface ReservationCode {
  serviceType: string;
  code: string;
  date: string;
  endDate: string;
  details: string;
  rate: number;
  rateCurrency: string;
  expenses: number;
  expensesCurrency: string;
  finalPrice: number;
  finalPriceCurrency: string;
}

interface Reservation {
  id: string;
  requestId: string;
  budgetData: any;
  status: string;
  creationDate: string;
  travelDate: string;
  passengers: number | any[];  // Updated to match the ReservasPage interface
  passengerCount?: number;     // Added to support the new property
  nights: number;
  minors: number;
  infants: number;
  responsible: string;
  totalAmount: number;
  reservationCodes: ReservationCode[];
}

const ReservationDetailsPage = () => {
  const navigate = useNavigate();
  const { reservationId } = useParams<{ reservationId: string }>();
  const [reservation, setReservation] = useState<Reservation | null>(null);

  useEffect(() => {
    if (reservationId) {
      const savedReservationsStr = localStorage.getItem('reservations');
      if (savedReservationsStr) {
        const savedReservations = JSON.parse(savedReservationsStr);
        const foundReservation = savedReservations.find(
          (r: Reservation) => r.id === reservationId
        );
        if (foundReservation) {
          setReservation(foundReservation);
        }
      }
    }
  }, [reservationId]);

  const handleBack = () => {
    navigate('/reservas');
  };

  const handlePrint = () => {
    window.print();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatCurrency = (amount: number, currency: string = 'ARS') => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  if (!reservation) {
    return (
      <Container>
        <Typography>No se encontró la reserva</Typography>
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
          Detalles de la Reserva #{reservation.id}
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Información General */}
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Información General
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <Typography><strong>Fecha de Creación:</strong> {formatDate(reservation.creationDate)}</Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Typography><strong>Fecha de Viaje:</strong> {formatDate(reservation.travelDate)}</Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Typography><strong>Responsable:</strong> {reservation.responsible}</Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Typography><strong>Estado:</strong> 
                  <Chip 
                    label={reservation.status} 
                    color={reservation.status === 'active' ? 'success' : 'default'}
                    size="small"
                    sx={{ ml: 1 }}
                  />
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Typography><strong>Pasajeros:</strong> {reservation.passengerCount || (Array.isArray(reservation.passengers) ? reservation.passengers.length : reservation.passengers || 0)}</Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Typography><strong>Noches:</strong> {reservation.nights}</Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Typography><strong>Menores:</strong> {reservation.minors}</Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Typography><strong>Infantes:</strong> {reservation.infants}</Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Servicios Incluidos */}
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Servicios Incluidos
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Tipo de Servicio</TableCell>
                    <TableCell>Código</TableCell>
                    <TableCell>Detalles</TableCell>
                    <TableCell>Fecha</TableCell>
                    <TableCell>Tarifa</TableCell>
                    <TableCell>Gastos</TableCell>
                    <TableCell>Total</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {reservation.reservationCodes.map((code, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Chip 
                          label={code.serviceType} 
                          color="primary" 
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{code.code}</TableCell>
                      <TableCell>{code.details}</TableCell>
                      <TableCell>
                        {formatDate(code.date)}
                        {code.endDate && ` - ${formatDate(code.endDate)}`}
                      </TableCell>
                      <TableCell>{formatCurrency(code.rate, code.rateCurrency)}</TableCell>
                      <TableCell>{formatCurrency(code.expenses, code.expensesCurrency)}</TableCell>
                      <TableCell>{formatCurrency(code.finalPrice, code.finalPriceCurrency)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        {/* Acciones */}
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6">
                Monto Total: {formatCurrency(reservation.totalAmount)}
              </Typography>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  variant="contained"
                  startIcon={<PeopleIcon />}
                  onClick={() => navigate(`/reservas/passengers/${reservationId}`)}
                >
                  Ficha de Pasajeros
                </Button>
                <Button
                  variant="contained"
                  startIcon={<PaymentIcon />}
                  onClick={() => navigate(`/reservas/payment/${reservationId}`)}
                >
                  Ficha de Pago
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<PrintIcon />}
                  onClick={handlePrint}
                >
                  Imprimir
                </Button>
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ReservationDetailsPage;