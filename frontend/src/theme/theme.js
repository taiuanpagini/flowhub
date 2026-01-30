import { createTheme } from '@mui/material/styles';

// Paleta de cores FlowHub
const flowhubTheme = createTheme({
  palette: {
    primary: {
      main: '#B61E3F', // Vermelho vinho principal
      light: '#E94B62',
      dark: '#530625',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#779C65', // Verde
      light: '#8FB779',
      dark: '#5A7A4D',
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#EEEEEE',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#000000',
      secondary: '#5C5C5C',
    },
    grey: {
      50: '#EEEEEE',
      100: '#E0E0E0',
      200: '#CCCCCC',
      300: '#B0B0B0',
      400: '#999999',
      500: '#5C5C5C',
      600: '#555555',
      700: '#3A3C42',
      800: '#333333',
      900: '#1A1A1A',
    },
    error: {
      main: '#E94B62',
      dark: '#B61E3F',
    },
    warning: {
      main: '#FF9800',
    },
    info: {
      main: '#2196F3',
    },
    success: {
      main: '#779C65',
    },
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
    h1: {
      fontWeight: 700,
      fontSize: '2.5rem',
      color: '#3A3C42',
    },
    h2: {
      fontWeight: 600,
      fontSize: '2rem',
      color: '#3A3C42',
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.75rem',
      color: '#3A3C42',
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.5rem',
      color: '#3A3C42',
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.25rem',
      color: '#3A3C42',
    },
    h6: {
      fontWeight: 600,
      fontSize: '1rem',
      color: '#3A3C42',
    },
    subtitle1: {
      fontSize: '1rem',
      color: '#5C5C5C',
    },
    subtitle2: {
      fontSize: '0.875rem',
      color: '#5C5C5C',
    },
    body1: {
      fontSize: '1rem',
      color: '#000000',
    },
    body2: {
      fontSize: '0.875rem',
      color: '#5C5C5C',
    },
  },
  shape: {
    borderRadius: 8,
  },
  shadows: [
    'none',
    '0px 2px 4px rgba(0,0,0,0.1)',
    '0px 4px 8px rgba(0,0,0,0.1)',
    '0px 6px 12px rgba(0,0,0,0.1)',
    '0px 8px 16px rgba(0,0,0,0.1)',
    '0px 10px 20px rgba(0,0,0,0.12)',
    '0px 12px 24px rgba(0,0,0,0.12)',
    '0px 14px 28px rgba(0,0,0,0.12)',
    '0px 16px 32px rgba(0,0,0,0.12)',
    '0px 18px 36px rgba(0,0,0,0.14)',
    '0px 20px 40px rgba(0,0,0,0.14)',
    '0px 22px 44px rgba(0,0,0,0.14)',
    '0px 24px 48px rgba(0,0,0,0.14)',
    '0px 26px 52px rgba(0,0,0,0.16)',
    '0px 28px 56px rgba(0,0,0,0.16)',
    '0px 30px 60px rgba(0,0,0,0.16)',
    '0px 32px 64px rgba(0,0,0,0.16)',
    '0px 34px 68px rgba(0,0,0,0.18)',
    '0px 36px 72px rgba(0,0,0,0.18)',
    '0px 38px 76px rgba(0,0,0,0.18)',
    '0px 40px 80px rgba(0,0,0,0.18)',
    '0px 42px 84px rgba(0,0,0,0.2)',
    '0px 44px 88px rgba(0,0,0,0.2)',
    '0px 46px 92px rgba(0,0,0,0.2)',
    '0px 48px 96px rgba(0,0,0,0.2)',
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: 8,
          padding: '10px 24px',
        },
        contained: {
          boxShadow: '0px 4px 8px rgba(0,0,0,0.1)',
          '&:hover': {
            boxShadow: '0px 6px 12px rgba(0,0,0,0.15)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0px 4px 12px rgba(0,0,0,0.08)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
        elevation1: {
          boxShadow: '0px 2px 8px rgba(0,0,0,0.08)',
        },
        elevation2: {
          boxShadow: '0px 4px 12px rgba(0,0,0,0.08)',
        },
        elevation3: {
          boxShadow: '0px 6px 16px rgba(0,0,0,0.1)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: '#CCCCCC',
            },
            '&:hover fieldset': {
              borderColor: '#B61E3F',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#B61E3F',
            },
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0px 2px 8px rgba(0,0,0,0.08)',
        },
      },
    },
  },
});

export default flowhubTheme;
