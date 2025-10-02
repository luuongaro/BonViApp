import React from 'react';
import { Button, Container, Grid, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const MainMenu = () => {
  const navigate = useNavigate();

  const menuItems = [
    { title: 'Reservas', path: '/reservas' },
    { title: 'Facturación', path: '/facturacion' },
    { title: 'Gestor de Visas', path: '/visas' },
    { title: 'Caja', path: '/caja' },
  ];

  return (
    <Container maxWidth="md" sx={{ mt: 8 }}>
      <Typography variant="h3" component="h1" align="center" gutterBottom>
        BonVi App
      </Typography>
      <Grid container spacing={3} justifyContent="center" sx={{ mt: 4 }}>
        {menuItems.map((item) => (
          <Grid item xs={12} sm={6} key={item.title}>
            <Button
              variant="contained"
              size="large"
              fullWidth
              sx={{
                height: '100px',
                fontSize: '1.5rem',
                backgroundColor: '#1976d2',
                '&:hover': {
                  backgroundColor: '#1565c0',
                },
              }}
              onClick={() => navigate(item.path)}
            >
              {item.title}
            </Button>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default MainMenu; 