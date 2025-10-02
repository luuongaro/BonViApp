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
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';

interface Request {
  id: string;
  travelDate: string;
  creationDate: string;
  passengers: number;
  nights: number;
  minors: number;
  infants: number;
}

const ReservasPage = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState<Request[]>([]);

  const loadRequests = () => {
    try {
      const savedRequestsStr = localStorage.getItem('requests');
      console.log('Raw localStorage data in ReservasPage:', savedRequestsStr);
      
      if (savedRequestsStr) {
        const savedRequests = JSON.parse(savedRequestsStr);
        console.log('Parsed requests in ReservasPage:', savedRequests);
        setRequests(savedRequests);
      } else {
        console.log('No requests found in localStorage');
        setRequests([]);
      }
    } catch (error) {
      console.error('Error loading requests:', error);
      setRequests([]);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const handleNewRequest = () => {
    navigate('/reservas/new');
  };

  const handleStartBudget = (requestId: string) => {
    navigate(`/reservas/budget/${requestId}`);
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

  console.log('Current requests state in ReservasPage:', requests);

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1">
          Administrador de Pedidos
        </Typography>
        <Box>
          <Button 
            variant="outlined" 
            onClick={loadRequests} 
            sx={{ mr: 2 }}
          >
            Actualizar
          </Button>
          <Fab
            color="primary"
            aria-label="add"
            onClick={handleNewRequest}
          >
            <AddIcon />
          </Fab>
        </Box>
      </Box>

      <Paper elevation={3}>
        <List>
          {requests.length === 0 ? (
            <ListItem>
              <ListItemText
                primary="No hay pedidos"
                secondary="Haga clic en el botón '+' para crear un nuevo pedido"
              />
            </ListItem>
          ) : (
            requests.map((request) => {
              const age = getRequestAge(request.creationDate);
              const color = getRequestColor(age);
              
              return (
                <ListItem 
                  key={request.id} 
                  divider
                  sx={{
                    borderLeft: `4px solid ${
                      color === 'success' ? '#4caf50' : 
                      color === 'warning' ? '#ff9800' : '#f44336'
                    }`,
                  }}
                >
                  <ListItemText
                    primary={`Pedido #${request.id}`}
                    secondary={
                      <>
                        <Typography component="span" variant="body2" color="text.primary">
                          Fecha de viaje: {request.travelDate} | Pasajeros: {request.passengers}
                        </Typography>
                        <br />
                        <Typography component="span" variant="body2" color="text.secondary">
                          Creado: {request.creationDate} | Edad: {age} días
                        </Typography>
                      </>
                    }
                  />
                  <ListItemSecondaryAction>
                    <Chip 
                      label={`${age} días`} 
                      color={color} 
                      size="small" 
                      sx={{ mr: 2 }}
                    />
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleStartBudget(request.id)}
                    >
                      Empezar Presupuesto
                    </Button>
                  </ListItemSecondaryAction>
                </ListItem>
              );
            })
          )}
        </List>
      </Paper>
    </Container>
  );
};

export default ReservasPage; 