import { BrowserRouter } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider } from './context/AuthContext';
import AppRoutes from './routes/AppRoutes';
import i18n from './i18n/i18n';
import flowhubTheme from './theme/theme';

function App() {
  return (
    <ThemeProvider theme={flowhubTheme}>
      <CssBaseline />
      <I18nextProvider i18n={i18n}>
        <BrowserRouter>
          <AuthProvider>
            <AppRoutes />
          </AuthProvider>
        </BrowserRouter>
      </I18nextProvider>
    </ThemeProvider>
  );
}

export default App;
