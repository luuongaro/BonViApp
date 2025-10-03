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
  TextField,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  Chip,
  Divider,
  FormControlLabel,
  Radio,
  RadioGroup,
  FormLabel,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import PrintIcon from '@mui/icons-material/Print';
import ReceiptIcon from '@mui/icons-material/Receipt';

interface Payment {
  id: string;
  date: string;
  amount: number;
  currency: 'ARS' | 'USD';
  paymentMethod: 'efectivo' | 'transferencia';
  paymentType: 'parcial' | 'total';
  description: string;
  receiptNumber: string;
  type: 'cobro' | 'pago';
}

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
  passengers: number;
  nights: number;
  minors: number;
  infants: number;
  responsible: string;
  totalAmount: number;
  reservationCodes: ReservationCode[];
  payments: Payment[];
}

const PaymentFormPage = () => {
  const navigate = useNavigate();
  const { reservationId } = useParams<{ reservationId: string }>();
  const [reservation, setReservation] = useState<Reservation | null>(null);
  const [openPaymentDialog, setOpenPaymentDialog] = useState(false);
  const [openReceiptDialog, setOpenReceiptDialog] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [newPayment, setNewPayment] = useState<Partial<Payment>>({
    date: new Date().toISOString().split('T')[0],
    amount: 0,
    currency: 'ARS',
    paymentMethod: 'efectivo',
    paymentType: 'parcial',
    description: '',
    receiptNumber: '',
    type: 'cobro'
  });

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
    navigate(`/reservas/details/${reservationId}`);
  };

  const handleOpenPaymentDialog = () => {
    setOpenPaymentDialog(true);
  };

  const handleClosePaymentDialog = () => {
    setOpenPaymentDialog(false);
    setNewPayment({
      date: new Date().toISOString().split('T')[0],
      amount: 0,
      currency: 'ARS',
      paymentMethod: 'efectivo',
      paymentType: 'parcial',
      description: '',
      receiptNumber: '',
      type: 'cobro'
    });
  };

  const handleOpenReceiptDialog = (payment: Payment) => {
    setSelectedPayment(payment);
    setOpenReceiptDialog(true);
  };

  const handleCloseReceiptDialog = () => {
    setOpenReceiptDialog(false);
    setSelectedPayment(null);
  };

  const handleAddPayment = () => {
    if (!reservation) return;

    const payment: Payment = {
      id: `payment_${Date.now()}`,
      date: newPayment.date || new Date().toISOString().split('T')[0],
      amount: newPayment.amount || 0,
      currency: newPayment.currency || 'ARS',
      paymentMethod: newPayment.paymentMethod || 'efectivo',
      paymentType: newPayment.paymentType || 'parcial',
      description: newPayment.description || '',
      receiptNumber: newPayment.receiptNumber || `REC-${Date.now()}`,
      type: newPayment.type || 'cobro'
    };

    const updatedReservation = {
      ...reservation,
      payments: [...(reservation.payments || []), payment],
    };

    // Actualizar en localStorage
    const savedReservationsStr = localStorage.getItem('reservations');
    if (savedReservationsStr) {
      const savedReservations = JSON.parse(savedReservationsStr);
      const updatedReservations = savedReservations.map((r: Reservation) =>
        r.id === reservationId ? updatedReservation : r
      );
      localStorage.setItem('reservations', JSON.stringify(updatedReservations));
    }

    setReservation(updatedReservation);
    handleClosePaymentDialog();
  };

  const handleDeletePayment = (paymentId: string) => {
    if (!reservation) return;

    const updatedReservation = {
      ...reservation,
      payments: reservation.payments.filter((p) => p.id !== paymentId),
    };

    // Actualizar en localStorage
    const savedReservationsStr = localStorage.getItem('reservations');
    if (savedReservationsStr) {
      const savedReservations = JSON.parse(savedReservationsStr);
      const updatedReservations = savedReservations.map((r: Reservation) =>
        r.id === reservationId ? updatedReservation : r
      );
      localStorage.setItem('reservations', JSON.stringify(updatedReservations));
    }

    setReservation(updatedReservation);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatCurrency = (amount: any, currency: string = 'ARS') => {
    // Verificar si el valor es nulo, indefinido o no es un número
    if (amount === undefined || amount === null || isNaN(Number(amount))) {
      return '-';
    }
    
    // Convertir a número para asegurar que sea un valor válido
    const numericAmount = Number(amount);
    
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: currency
    }).format(numericAmount);
  };

  const calculateTotalPaid = () => {
    if (!reservation || !reservation.payments) return 0;
    return reservation.payments
      .filter(payment => payment.type === 'cobro')
      .reduce((total, payment) => total + payment.amount, 0);
  };

  const calculateRemainingAmount = () => {
    if (!reservation) return 0;
    return reservation.totalAmount - calculateTotalPaid();
  };

  const handlePrintReceipt = () => {
    window.print();
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
          Ficha de Pago - Reserva #{reservation.id}
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
            </Grid>
          </Paper>
        </Grid>

        {/* Resumen de Pagos */}
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Resumen de Pagos
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={4}>
                <Typography variant="subtitle1"><strong>Monto Total:</strong> {formatCurrency(reservation.totalAmount)}</Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Typography variant="subtitle1"><strong>Total Pagado:</strong> {formatCurrency(calculateTotalPaid())}</Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Typography variant="subtitle1"><strong>Monto Pendiente:</strong> {formatCurrency(calculateRemainingAmount())}</Typography>
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

        {/* Cobros Realizados */}
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                Cobros Realizados
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => {
                  setNewPayment({...newPayment, type: 'cobro'});
                  handleOpenPaymentDialog();
                }}
              >
                Agregar Cobro
              </Button>
            </Box>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Fecha</TableCell>
                    <TableCell>Monto</TableCell>
                    <TableCell>Moneda</TableCell>
                    <TableCell>Método</TableCell>
                    <TableCell>Tipo</TableCell>
                    <TableCell>Descripción</TableCell>
                    <TableCell>N° Recibo</TableCell>
                    <TableCell>Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {reservation.payments && reservation.payments.filter(p => p.type === 'cobro').length > 0 ? (
                    reservation.payments.filter(p => p.type === 'cobro').map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell>{formatDate(payment.date)}</TableCell>
                        <TableCell>{formatCurrency(payment.amount, payment.currency)}</TableCell>
                        <TableCell>{payment.currency}</TableCell>
                        <TableCell>
                          <Chip 
                            label={payment.paymentMethod === 'efectivo' ? 'Efectivo' : 'Transferencia'} 
                            color={payment.paymentMethod === 'efectivo' ? 'success' : 'info'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={payment.paymentType === 'parcial' ? 'Parcial' : 'Total'} 
                            color={payment.paymentType === 'parcial' ? 'warning' : 'primary'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>{payment.description}</TableCell>
                        <TableCell>{payment.receiptNumber}</TableCell>
                        <TableCell>
                          <IconButton
                            color="primary"
                            onClick={() => handleOpenReceiptDialog(payment)}
                          >
                            <ReceiptIcon />
                          </IconButton>
                          <IconButton
                            color="error"
                            onClick={() => handleDeletePayment(payment.id)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} align="center">
                        No hay cobros registrados
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        {/* Pagos a Proveedores */}
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                Pagos a Proveedores
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => {
                  setNewPayment({...newPayment, type: 'pago'});
                  handleOpenPaymentDialog();
                }}
              >
                Agregar Pago
              </Button>
            </Box>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Fecha</TableCell>
                    <TableCell>Monto</TableCell>
                    <TableCell>Moneda</TableCell>
                    <TableCell>Método</TableCell>
                    <TableCell>Tipo</TableCell>
                    <TableCell>Descripción</TableCell>
                    <TableCell>N° Recibo</TableCell>
                    <TableCell>Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {reservation.payments && reservation.payments.filter(p => p.type === 'pago').length > 0 ? (
                    reservation.payments.filter(p => p.type === 'pago').map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell>{formatDate(payment.date)}</TableCell>
                        <TableCell>{formatCurrency(payment.amount, payment.currency)}</TableCell>
                        <TableCell>{payment.currency}</TableCell>
                        <TableCell>
                          <Chip 
                            label={payment.paymentMethod === 'efectivo' ? 'Efectivo' : 'Transferencia'} 
                            color={payment.paymentMethod === 'efectivo' ? 'success' : 'info'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={payment.paymentType === 'parcial' ? 'Parcial' : 'Total'} 
                            color={payment.paymentType === 'parcial' ? 'warning' : 'primary'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>{payment.description}</TableCell>
                        <TableCell>{payment.receiptNumber}</TableCell>
                        <TableCell>
                          <IconButton
                            color="primary"
                            onClick={() => handleOpenReceiptDialog(payment)}
                          >
                            <ReceiptIcon />
                          </IconButton>
                          <IconButton
                            color="error"
                            onClick={() => handleDeletePayment(payment.id)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} align="center">
                        No hay pagos a proveedores registrados
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>

      {/* Diálogo para agregar pago/cobro */}
      <Dialog open={openPaymentDialog} onClose={handleClosePaymentDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {newPayment.type === 'cobro' ? 'Agregar Cobro' : 'Agregar Pago a Proveedor'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Fecha"
                type="date"
                value={newPayment.date}
                onChange={(e) => setNewPayment({ ...newPayment, date: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Monto"
                type="number"
                value={newPayment.amount}
                onChange={(e) => setNewPayment({ ...newPayment, amount: Number(e.target.value) })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Moneda</InputLabel>
                <Select
                  value={newPayment.currency}
                  label="Moneda"
                  onChange={(e) => setNewPayment({ ...newPayment, currency: e.target.value as 'ARS' | 'USD' })}
                >
                  <MenuItem value="ARS">ARS - Peso Argentino</MenuItem>
                  <MenuItem value="USD">USD - Dólar Estadounidense</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Método de Pago</InputLabel>
                <Select
                  value={newPayment.paymentMethod}
                  label="Método de Pago"
                  onChange={(e) => setNewPayment({ ...newPayment, paymentMethod: e.target.value as 'efectivo' | 'transferencia' })}
                >
                  <MenuItem value="efectivo">Efectivo</MenuItem>
                  <MenuItem value="transferencia">Transferencia</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl component="fieldset">
                <FormLabel component="legend">Tipo de Pago</FormLabel>
                <RadioGroup
                  row
                  value={newPayment.paymentType}
                  onChange={(e) => setNewPayment({ ...newPayment, paymentType: e.target.value as 'parcial' | 'total' })}
                >
                  <FormControlLabel value="parcial" control={<Radio />} label="Parcial" />
                  <FormControlLabel value="total" control={<Radio />} label="Total" />
                </RadioGroup>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Descripción"
                multiline
                rows={2}
                value={newPayment.description}
                onChange={(e) => setNewPayment({ ...newPayment, description: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Número de Recibo"
                value={newPayment.receiptNumber}
                onChange={(e) => setNewPayment({ ...newPayment, receiptNumber: e.target.value })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePaymentDialog}>Cancelar</Button>
          <Button onClick={handleAddPayment} variant="contained" color="primary">
            {newPayment.type === 'cobro' ? 'Agregar Cobro' : 'Agregar Pago'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo para imprimir recibo */}
      <Dialog open={openReceiptDialog} onClose={handleCloseReceiptDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {selectedPayment?.type === 'cobro' ? 'Recibo de Cobro' : 'Recibo de Pago a Proveedor'}
        </DialogTitle>
        <DialogContent>
          {selectedPayment && (
            <Box sx={{ p: 2 }}>
              <Box sx={{ textAlign: 'center', mb: 3 }}>
                <Typography variant="h5" gutterBottom>
                  {selectedPayment.type === 'cobro' ? 'RECIBO DE COBRO' : 'RECIBO DE PAGO A PROVEEDOR'}
                </Typography>
                <Typography variant="subtitle1">N° {selectedPayment.receiptNumber}</Typography>
              </Box>
              <Divider sx={{ my: 2 }} />
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography><strong>Fecha:</strong> {formatDate(selectedPayment.date)}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography><strong>Reserva:</strong> #{reservation.id}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography><strong>Responsable:</strong> {reservation.responsible}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography><strong>Método de Pago:</strong> {selectedPayment.paymentMethod === 'efectivo' ? 'Efectivo' : 'Transferencia'}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography><strong>Descripción:</strong> {selectedPayment.description}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Box sx={{ mt: 2, p: 2, bgcolor: 'background.paper', borderRadius: 1, textAlign: 'center' }}>
                    <Typography variant="h6">
                      {selectedPayment.type === 'cobro' ? 'Monto Cobrado' : 'Monto Pagado'}
                    </Typography>
                    <Typography variant="h4" color="primary">
                      {formatCurrency(selectedPayment.amount, selectedPayment.currency)}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
              <Divider sx={{ my: 3 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                <Box>
                  <Typography variant="body2">Firma del Responsable</Typography>
                  <Box sx={{ mt: 4, borderTop: '1px solid #ccc', width: 200 }}></Box>
                </Box>
                <Box>
                  <Typography variant="body2">
                    {selectedPayment.type === 'cobro' ? 'Firma del Cliente' : 'Firma del Proveedor'}
                  </Typography>
                  <Box sx={{ mt: 4, borderTop: '1px solid #ccc', width: 200 }}></Box>
                </Box>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseReceiptDialog}>Cerrar</Button>
          <Button onClick={handlePrintReceipt} variant="contained" color="primary" startIcon={<PrintIcon />}>
            Imprimir
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default PaymentFormPage; 