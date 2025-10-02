import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme, alpha } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import MainMenu from './components/MainMenu';
import ReservasPage from './pages/reservas/ReservasPage';
import NewRequestForm from './pages/reservas/NewRequestForm';
import BudgetPage from './pages/reservas/BudgetPage';
import PaymentFormPage from './pages/reservas/PaymentFormPage';
import PassengerFormPage from './pages/reservas/PassengerFormPage';
import ReservationDetailsPage from './pages/reservas/ReservationDetailsPage';
import PassengerManagementPage from './pages/reservas/PassengerManagementPage';
import NewPassengerPage from './pages/reservas/NewPassengerPage';

// Tema personalizado con colores pastel
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
    info: {
      main: '#64b5f6',
      light: '#bbdefb',
      dark: '#2196f3',
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
        contained: {
          boxShadow: '0 4px 14px 0 rgba(144, 202, 249, 0.3)',
        },
        outlined: {
          borderWidth: 1.5,
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
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          overflow: 'hidden',
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 16,
          overflow: 'hidden',
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          borderRadius: '8px 8px 0 0',
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={pastelTheme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<MainMenu />} />
          <Route path="/reservas" element={<ReservasPage />} />
          <Route path="/reservas/new" element={<NewRequestForm />} />
          <Route path="/reservas/budget/:requestId" element={<BudgetPage />} />
          <Route path="/reservas/details/:reservationId" element={<ReservationDetailsPage />} />
          <Route path="/reservas/payment/:reservationId" element={<PaymentFormPage />} />
          <Route path="/reservas/passengers/:reservationId" element={<PassengerFormPage />} />
          <Route path="/pasajeros" element={<PassengerManagementPage />} />
          <Route path="/pasajeros/nuevo" element={<NewPassengerPage />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;