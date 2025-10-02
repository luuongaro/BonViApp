import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import MainMenu from './components/MainMenu';
import ReservasPage from './pages/reservas/ReservasPage';
import NewRequestForm from './pages/reservas/NewRequestForm';
import BudgetPage from './pages/reservas/BudgetPage';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<MainMenu />} />
          <Route path="/reservas" element={<ReservasPage />} />
          <Route path="/reservas/new" element={<NewRequestForm />} />
          <Route path="/reservas/budget/:requestId" element={<BudgetPage />} />
          {/* Add more routes as we create the other sections */}
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
