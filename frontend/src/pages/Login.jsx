import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  IconButton,
  Collapse,
  Card,
  CardContent,
  Stack,
  Chip,
} from '@mui/material';
import { Language as LanguageIcon, Visibility, VisibilityOff } from '@mui/icons-material';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showCredentials, setShowCredentials] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { t, i18n } = useTranslation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    const result = await login(username, password);
    
    setLoading(false);
    
    if (!result.success) {
      setError(result.message);
    }
  };

  const credentials = [
    { username: 'expositor', role: 'Expositor', redirect: '/expositor/dashboard', color: 'primary' },
    { username: 'operador', role: 'Operador', redirect: '/operador/scanner', color: 'secondary' },
    { username: 'supervisor', role: 'Supervisor', redirect: '/cozinha/painel', color: 'info' },
    { username: 'garcom', role: 'Garçom', redirect: '/cozinha/minhas-solicitacoes', color: 'success' },
    { username: 'admin', role: 'Admin', redirect: '/admin/dashboard', color: 'warning' },
  ];

  const toggleLanguage = () => {
    const newLang = i18n.language === 'pt-BR' ? 'en-US' : 'pt-BR';
    i18n.changeLanguage(newLang);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #530625 0%, #B61E3F 50%, #E94B62 100%)',
        py: 4,
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={6}
          sx={{
            p: 4,
            borderRadius: 3,
            position: 'relative',
            background: '#FFFFFF',
          }}
        >
          {/* Language Toggle */}
          <IconButton
            onClick={toggleLanguage}
            sx={{
              position: 'absolute',
              top: 16,
              right: 16,
              color: 'primary.main',
            }}
          >
            <LanguageIcon />
          </IconButton>

          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: 4, mt: 2 }}>
            <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 700, color: 'primary.main' }}>
              🚀 {t('login.title')}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              {t('login.subtitle')}
            </Typography>
          </Box>

          {/* Login Form */}
          <form onSubmit={handleSubmit}>
            <Stack spacing={3}>
              <TextField
                fullWidth
                label={t('login.username')}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoFocus
                variant="outlined"
                autoComplete="username"
              />

              <TextField
                fullWidth
                label={t('login.password')}
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                variant="outlined"
                autoComplete="current-password"
                InputProps={{
                  endAdornment: (
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  ),
                }}
              />

              {error && (
                <Alert severity="error" sx={{ borderRadius: 2 }}>
                  {error}
                </Alert>
              )}

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={loading}
                sx={{
                  py: 1.5,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                }}
              >
                {loading ? t('common.loading') : t('login.submit')}
              </Button>
            </Stack>
          </form>

          {/* Test Credentials Link */}
          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Button
              onClick={() => setShowCredentials(!showCredentials)}
              variant="text"
              color="primary"
            >
              {t('login.testCredentials')}
            </Button>
          </Box>

          {/* Credentials Modal */}
          <Collapse in={showCredentials}>
            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle2" fontWeight={600} gutterBottom sx={{ mb: 2 }}>
                Credenciais de teste:
              </Typography>
              <Stack spacing={2}>
                {credentials.map((cred) => (
                  <Card
                    key={cred.username}
                    variant="outlined"
                    sx={{
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      '&:hover': {
                        boxShadow: 2,
                        borderColor: 'primary.main',
                        transform: 'translateY(-2px)',
                      },
                    }}
                    onClick={() => {
                      setUsername(cred.username);
                      setPassword('123456');
                    }}
                  >
                    <CardContent sx={{ py: 2, '&:last-child': { pb: 2 } }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box>
                          <Typography variant="body1" fontWeight={600} color="primary">
                            {cred.username}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Senha: 123456
                          </Typography>
                        </Box>
                        <Chip label={cred.role} color={cred.color} size="small" />
                      </Box>
                    </CardContent>
                  </Card>
                ))}
              </Stack>
            </Box>
          </Collapse>

          {/* Footer */}
          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Typography variant="caption" color="text.secondary">
              FlowHub © 2026
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
