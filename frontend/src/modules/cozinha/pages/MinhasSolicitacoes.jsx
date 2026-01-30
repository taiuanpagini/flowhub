import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../../context/AuthContext';
import { serviceRequestService, customerService } from '../../../services/api.service';
import signalRService from '../../../services/signalr.service';
import Layout from '../../../components/layout/Layout';
import {
  Box,
  Typography,
  Stack,
  Paper,
  Button,
  Chip,
  CircularProgress,
  Alert,
  Divider,
} from '@mui/material';
import {
  CheckCircle as CheckIcon,
  LocalShipping as ShippingIcon,
  AccessTime as TimeIcon,
} from '@mui/icons-material';

export default function MinhasSolicitacoes() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [myRequests, setMyRequests] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
    setupSignalR();
    
    return () => {
      signalRService.off('ServiceRequestAssigned');
      signalRService.off('ServiceRequestUpdated');
      signalRService.off('ServiceRequestCompleted');
    };
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [requestsData, customersData] = await Promise.all([
        serviceRequestService.getByWaiterId(user.id),
        customerService.getAll()
      ]);
      
      setMyRequests(requestsData);
      setCustomers(customersData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const setupSignalR = async () => {
    try {
      await signalRService.start();
      
      signalRService.on('ServiceRequestAssigned', (request) => {
        if (request.assignedWaiterUserId === user.id) {
          console.log('New request assigned to me:', request);
          setMyRequests(prev => {
            // Verifica se já existe para evitar duplicação
            const exists = prev.find(r => r.id === request.id);
            if (exists) return prev;
            return [...prev, request];
          });
        }
      });
      
      signalRService.on('ServiceRequestUpdated', (request) => {
        if (request.assignedWaiterUserId === user.id) {
          console.log('Service request updated:', request);
          setMyRequests(prev => prev.map(r => r.id === request.id ? request : r));
        }
      });

      signalRService.on('ServiceRequestCompleted', (request) => {
        if (request.assignedWaiterUserId === user.id) {
          console.log('Service request completed:', request);
          setMyRequests(prev => prev.map(r => r.id === request.id ? request : r));
        }
      });
    } catch (error) {
      console.error('SignalR error:', error);
    }
  };

  const handleMarkAsPickedUp = async (requestId) => {
    try {
      const updatedRequest = await serviceRequestService.markAsPickedUp(requestId);
      // Atualiza imediatamente no estado local
      setMyRequests(prev => prev.map(r => r.id === requestId ? updatedRequest : r));
    } catch (error) {
      console.error('Error marking as picked up:', error);
      alert('Erro ao atualizar status');
    }
  };

  const handleMarkAsCompleted = async (requestId) => {
    try {
      const completedRequest = await serviceRequestService.markAsCompleted(requestId);
      // Atualiza imediatamente no estado local
      setMyRequests(prev => prev.map(r => r.id === requestId ? completedRequest : r));
    } catch (error) {
      console.error('Error marking as completed:', error);
      alert('Erro ao completar solicitação');
    }
  };

  const getCustomerName = (customerId) => {
    const customer = customers.find(c => c.id === customerId);
    return customer?.companyName || 'N/A';
  };

  const getWaitTime = (requestedAt) => {
    const minutes = Math.floor((new Date() - new Date(requestedAt)) / 60000);
    return `${minutes} min`;
  };

  const activeRequests = myRequests.filter(r => r.status !== 'Completed');
  const completedRequests = myRequests.filter(r => r.status === 'Completed');

  if (loading) {
    return (
      <Layout>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
          <CircularProgress size={60} />
        </Box>
      </Layout>
    );
  }

  return (
    <Layout>
      <Stack spacing={4}>
        {/* Header */}
        <Box>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            {t('cozinha.myRequests')}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Solicitações atribuídas para você
          </Typography>
        </Box>

        {/* Active Requests */}
        <Paper elevation={2} sx={{ p: 3 }}>
          <Typography variant="h6" fontWeight={600} gutterBottom>
            Ativas ({activeRequests.length})
          </Typography>
          <Divider sx={{ my: 2 }} />
          {activeRequests.length === 0 ? (
            <Alert severity="info">
              Nenhuma solicitação ativa no momento
            </Alert>
          ) : (
            <Stack spacing={3}>
              {activeRequests.map((request) => (
                <Paper
                  key={request.id}
                  variant="outlined"
                  sx={{
                    p: 3,
                    transition: 'all 0.2s',
                    '&:hover': {
                      boxShadow: 3,
                    },
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box>
                      <Typography variant="h6" fontWeight={600}>
                        Stand {request.standNumber}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {getCustomerName(request.customerId)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {request.requestedGlassQuantity} taças
                      </Typography>
                    </Box>
                    <Chip
                      label={request.status === 'Pending' ? 'Pendente' : 'Em Coleta'}
                      color={request.status === 'Pending' ? 'warning' : 'info'}
                      size="small"
                    />
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <TimeIcon fontSize="small" color="action" />
                    <Typography variant="caption" color="text.secondary">
                      Aguardando há {getWaitTime(request.requestedAt)}
                    </Typography>
                  </Box>

                  <Stack direction="row" spacing={2}>
                    {request.status === 'Pending' && (
                      <Button
                        variant="contained"
                        color="info"
                        startIcon={<ShippingIcon />}
                        onClick={() => handleMarkAsPickedUp(request.id)}
                        fullWidth
                      >
                        {t('cozinha.markAsPickedUp')}
                      </Button>
                    )}
                    {request.status === 'InProgress' && request.pickedUpAt && (
                      <Button
                        variant="contained"
                        color="success"
                        startIcon={<CheckIcon />}
                        onClick={() => handleMarkAsCompleted(request.id)}
                        fullWidth
                      >
                        {t('cozinha.markAsCompleted')}
                      </Button>
                    )}
                  </Stack>
                </Paper>
              ))}
            </Stack>
          )}
        </Paper>

        {/* Completed Requests */}
        <Paper elevation={2} sx={{ p: 3 }}>
          <Typography variant="h6" fontWeight={600} gutterBottom>
            Concluídas Hoje ({completedRequests.length})
          </Typography>
          <Divider sx={{ my: 2 }} />
          {completedRequests.length === 0 ? (
            <Alert severity="info">
              Nenhuma solicitação concluída ainda
            </Alert>
          ) : (
            <Stack spacing={2}>
              {completedRequests.slice(0, 5).map((request) => (
                <Paper
                  key={request.id}
                  variant="outlined"
                  sx={{
                    p: 2,
                    opacity: 0.7,
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Typography variant="subtitle2" fontWeight={600}>
                        Stand {request.standNumber}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {request.requestedGlassQuantity} taças
                      </Typography>
                    </Box>
                    <Typography variant="caption" color="text.secondary">
                      {new Date(request.completedAt).toLocaleTimeString()}
                    </Typography>
                  </Box>
                </Paper>
              ))}
            </Stack>
          )}
        </Paper>
      </Stack>
    </Layout>
  );
}
