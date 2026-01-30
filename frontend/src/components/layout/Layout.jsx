import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  IconButton,
  Chip,
} from '@mui/material';
import { 
  Logout as LogoutIcon, 
  Language as LanguageIcon,
  Person as PersonIcon,
  QrCode2 as QrCodeIcon,
} from '@mui/icons-material';

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'pt-BR' ? 'en-US' : 'pt-BR';
    i18n.changeLanguage(newLang);
  };

  const showQRCodeButton = user?.role === 'Operador' && !location.pathname.includes('/qrcodes');

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'background.default', overflow: 'hidden', maxWidth: '100vw' }}>
      {/* Header */}
      <AppBar position="static" color="default" elevation={1} sx={{ bgcolor: 'white' }}>
        <Toolbar sx={{ minHeight: { xs: 56, sm: 64 }, px: { xs: 1, sm: 2 } }}>
          <Typography 
            variant="h5" 
            component="h1" 
            sx={{ 
              flexGrow: 1, 
              fontWeight: 700,
              color: 'primary.main',
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              fontSize: { xs: '1.1rem', sm: '1.25rem', md: '1.5rem' },
            }}
          >
            🍷 {t('common.appName')}
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.5, sm: 1, md: 2 } }}>
            <Chip
              icon={<PersonIcon sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }} />}
              label={`${user?.name?.split(' ')[0]} (${user?.role?.split('_')[0]})`}
              color="primary"
              variant="outlined"
              size="small"
              sx={{ 
                display: { xs: 'none', sm: 'flex' },
                '& .MuiChip-label': { fontSize: { sm: '0.75rem', md: '0.875rem' }, px: { sm: 1, md: 2 } }
              }}
            />
            
            {showQRCodeButton && (
              <Button
                onClick={() => navigate('/operador/qrcodes')}
                variant="outlined"
                color="primary"
                startIcon={<QrCodeIcon />}
                size="small"
                sx={{
                  fontSize: { xs: '0.75rem', sm: '0.875rem' },
                  px: { xs: 1, sm: 2 },
                  py: { xs: 0.5, sm: 1 },
                  display: { xs: 'none', md: 'flex' },
                }}
              >
                QR Codes
              </Button>
            )}
            
            {showQRCodeButton && (
              <IconButton
                onClick={() => navigate('/operador/qrcodes')}
                color="primary"
                size="small"
                sx={{ display: { xs: 'inline-flex', md: 'none' } }}
                title="QR Codes para Teste"
              >
                <QrCodeIcon fontSize="small" />
              </IconButton>
            )}
            
            <IconButton
              onClick={toggleLanguage}
              color="primary"
              size="small"
              sx={{ display: { xs: 'none', sm: 'inline-flex' } }}
            >
              <LanguageIcon fontSize="small" />
            </IconButton>
            
            <Button
              onClick={logout}
              variant="contained"
              color="primary"
              startIcon={<LogoutIcon sx={{ fontSize: { xs: '1rem', md: '1.25rem' } }} />}
              size="small"
              sx={{
                fontSize: { xs: '0.75rem', sm: '0.875rem' },
                px: { xs: 1, sm: 2 },
                py: { xs: 0.5, sm: 1 },
              }}
            >
              {t('common.logout')}
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Box sx={{ 
        flexGrow: 1, 
        width: '100%', 
        maxWidth: '100vw',
        px: { xs: 2, sm: 3, md: 4 }, 
        py: { xs: 2, sm: 3, md: 4 },
        overflow: 'hidden',
        boxSizing: 'border-box',
      }}>
        {children}
      </Box>

      {/* Footer */}
      <Box
        component="footer"
        sx={{
          py: { xs: 1.5, md: 2 },
          px: 2,
          mt: 'auto',
          backgroundColor: 'grey.50',
          borderTop: '1px solid',
          borderColor: 'grey.200',
        }}
      >
        <Typography variant="body2" color="text.secondary" align="center" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
          Pro Wine POC © 2026
        </Typography>
      </Box>
    </Box>
  );
}
