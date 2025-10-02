import React from 'react';
import { 
  Button, 
  Container, 
  Grid, 
  Typography, 
  Box, 
  Paper, 
  Card, 
  CardContent, 
  alpha,
  useTheme
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import ReceiptIcon from '@mui/icons-material/Receipt';
import DocumentScannerIcon from '@mui/icons-material/DocumentScanner';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import AirplanemodeActiveIcon from '@mui/icons-material/AirplanemodeActive';
import CloudIcon from '@mui/icons-material/Cloud';

const MainMenu = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  const menuItems = [
    { 
      title: 'Reservas', 
      path: '/reservas', 
      icon: <FlightTakeoffIcon sx={{ fontSize: 40 }} />,
      color: theme.palette.primary.main,
      lightColor: theme.palette.primary.light,
      darkColor: theme.palette.primary.dark,
      description: 'Gestione reservas y pasajeros'
    },
    { 
      title: 'Facturación', 
      path: '/facturacion', 
      icon: <ReceiptIcon sx={{ fontSize: 40 }} />,
      color: theme.palette.secondary.main,
      lightColor: theme.palette.secondary.light,
      darkColor: theme.palette.secondary.dark,
      description: 'Emita facturas y comprobantes'
    },
    { 
      title: 'Gestor de Visas', 
      path: '/visas', 
      icon: <DocumentScannerIcon sx={{ fontSize: 40 }} />,
      color: theme.palette.info.main,
      lightColor: theme.palette.info.light,
      darkColor: theme.palette.info.dark,
      description: 'Administre trámites de visas'
    },
    { 
      title: 'Caja', 
      path: '/caja', 
      icon: <AccountBalanceWalletIcon sx={{ fontSize: 40 }} />,
      color: theme.palette.success.main,
      lightColor: theme.palette.success.light,
      darkColor: theme.palette.success.dark,
      description: 'Registre pagos e ingresos'
    },
  ];

  // Elementos decorativos (nubes y aviones)
  const decorativeElements = [
    { component: <CloudIcon />, top: '15%', left: '5%', size: 60, opacity: 0.06, rotate: 0 },
    { component: <CloudIcon />, top: '40%', right: '8%', size: 80, opacity: 0.08, rotate: 0 },
    { component: <CloudIcon />, bottom: '10%', left: '12%', size: 50, opacity: 0.05, rotate: 0 },
    { component: <AirplanemodeActiveIcon />, top: '25%', right: '15%', size: 70, opacity: 0.07, rotate: 15 },
    { component: <AirplanemodeActiveIcon />, bottom: '30%', left: '20%', size: 90, opacity: 0.05, rotate: -20 },
  ];

  return (
    <Container maxWidth="lg" sx={{ 
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden',
      py: 8
    }}>
      {/* Elementos decorativos */}
      {decorativeElements.map((elem, index) => (
        <Box 
          key={index}
          sx={{
            position: 'absolute',
            top: elem.top,
            left: elem.left,
            right: elem.right,
            bottom: elem.bottom,
            transform: `rotate(${elem.rotate}deg)`,
            zIndex: 0,
            opacity: elem.opacity,
            color: theme.palette.primary.main,
            pointerEvents: 'none'
          }}
        >
          {React.cloneElement(elem.component, { sx: { fontSize: elem.size } })}
        </Box>
      ))}

      <Paper 
        elevation={0}
        sx={{ 
          p: 6, 
          borderRadius: 4,
          background: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(10px)',
          position: 'relative',
          zIndex: 1,
          overflow: 'hidden'
        }}
      >
        {/* Logo con avioncito */}
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          mb: 6,
          position: 'relative'
        }}>
          <Box sx={{ 
            position: 'relative',
            mb: 3
          }}>
            <AirplanemodeActiveIcon 
              sx={{ 
                fontSize: 70, 
                color: theme.palette.primary.main,
                filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))'
              }} 
            />
            <Box sx={{ 
              position: 'absolute',
              bottom: -10,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 120,
              height: 10,
              borderRadius: '50%',
              backgroundColor: alpha(theme.palette.primary.main, 0.1),
              filter: 'blur(5px)'
            }} />
          </Box>
          
          <Typography 
            variant="h3" 
            component="h1" 
            align="center" 
            gutterBottom
            sx={{ 
              fontWeight: 'bold',
              background: 'linear-gradient(45deg, #5d99c6 30%, #ca9b52 90%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '0.02em',
              mb: 1
            }}
          >
            BonVi App
          </Typography>
          
          <Typography 
            variant="h6" 
            align="center" 
            color="text.secondary"
            sx={{ 
              maxWidth: '600px',
              fontWeight: 'normal',
              mb: 1,
              opacity: 0.8
            }}
          >
            Sistema de gestión de agencia de viajes
          </Typography>
          
          <Box sx={{ 
            width: 60, 
            height: 4, 
            borderRadius: 2,
            background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.light})`,
            my: 3
          }} />
        </Box>

        <Grid container spacing={4} justifyContent="center">
          {menuItems.map((item) => (
            <Grid item xs={12} sm={6} md={3} key={item.title}>
              <Card 
                sx={{
                  height: '100%',
                  borderRadius: 4,
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  position: 'relative',
                  overflow: 'hidden',
                  boxShadow: '0 8px 20px rgba(0,0,0,0.05)',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 16px 30px rgba(0,0,0,0.1)',
                    '& .card-bg': {
                      opacity: 0.15,
                    },
                    '& .card-icon': {
                      transform: 'scale(1.1) rotate(5deg)',
                    }
                  },
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '5px',
                    background: `linear-gradient(90deg, ${item.color}, ${item.lightColor})`,
                  }
                }}
                onClick={() => navigate(item.path)}
              >
                {/* Fondo decorativo */}
                <Box 
                  className="card-bg"
                  sx={{ 
                    position: 'absolute',
                    bottom: -10,
                    right: -10,
                    opacity: 0.08,
                    transition: 'opacity 0.3s ease',
                    transform: 'rotate(-5deg)',
                    zIndex: 0
                  }}
                >
                  {React.cloneElement(item.icon, { sx: { fontSize: 100 } })}
                </Box>
                
                <CardContent 
                  sx={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    textAlign: 'center',
                    height: '100%',
                    padding: theme.spacing(4, 2),
                    position: 'relative',
                    zIndex: 1
                  }}
                >
                  <Box 
                    className="card-icon"
                    sx={{ 
                      bgcolor: alpha(item.color, 0.1),
                      borderRadius: '50%',
                      p: 2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mb: 2,
                      color: item.darkColor,
                      transition: 'transform 0.3s ease',
                    }}
                  >
                    {item.icon}
                  </Box>
                  
                  <Typography 
                    variant="h5" 
                    component="h2" 
                    gutterBottom
                    sx={{ 
                      fontWeight: 600,
                      color: item.darkColor,
                      letterSpacing: '0.01em'
                    }}
                  >
                    {item.title}
                  </Typography>
                  
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{ opacity: 0.8 }}
                  >
                    {item.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Paper>
    </Container>
  );
};

export default MainMenu;