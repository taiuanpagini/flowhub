import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../../context/AuthContext';
import { serviceRequestService, customerService } from '../../../services/api.service';
import signalRService from '../../../services/signalr.service';
import Layout from '../../../components/layout/Layout';
import {
  Box,
  Typography,
  Paper,
  Stack,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Card as MuiCard,
  CardContent,
  CircularProgress,
  Alert,
  Divider,
} from '@mui/material';
import {
  Schedule as ScheduleIcon,
  HourglassEmpty as PendingIcon,
  DirectionsRun as ProgressIcon,
  CheckCircle as CompletedIcon,
} from '@mui/icons-material';

export default function PainelKanban() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);

  useEffect(() => {
    loadData();
    setupSignalR();
    
    return () => {
      signalRService.off('NewServiceRequest');
      signalRService.off('ServiceRequestUpdated');
    };
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [requestsData, customersData] = await Promise.all([
        serviceRequestService.getAll(),
        customerService.getAll()
      ]);
      
      setRequests(requestsData);
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
      
      signalRService.on('NewServiceRequest', (request) => {
        console.log('New service request received:', request);
        setRequests(prev => {
          // Verifica se já existe para evitar duplicação
          const exists = prev.find(r => r.id === request.id);
          if (exists) return prev;
          return [...prev, request];
        });
      });
      
      signalRService.on('ServiceRequestUpdated', (request) => {
        console.log('Service request updated:', request);
        setRequests(prev => prev.map(r => r.id === request.id ? request : r));
      });

      signalRService.on('ServiceRequestAssigned', (request) => {
        console.log('Service request assigned:', request);
        setRequests(prev => prev.map(r => r.id === request.id ? request : r));
      });

      signalRService.on('ServiceRequestCompleted', (request) => {
        console.log('Service request completed:', request);
        setRequests(prev => prev.map(r => r.id === request.id ? request : r));
      });
    } catch (error) {
      console.error('SignalR error:', error);
    }
  };

  const handleAssignWaiter = async (waiterId) => {
    if (!selectedRequest) return;
    
    try {
      const updatedRequest = await serviceRequestService.assign(selectedRequest.id, waiterId);
      setShowAssignModal(false);
      setSelectedRequest(null);
      // Atualiza imediatamente no estado local
      setRequests(prev => prev.map(r => r.id === selectedRequest.id ? updatedRequest : r));
    } catch (error) {
      console.error('Error assigning waiter:', error);
      alert('Erro ao atribuir garçom');
    }
  };

  const handleMarkAsCompleted = async (requestId) => {
    try {
      const completedRequest = await serviceRequestService.markAsCompleted(requestId);
      // Atualiza imediatamente no estado local
      setRequests(prev => prev.map(r => r.id === requestId ? completedRequest : r));
    } catch (error) {
      console.error('Error marking as completed:', error);
      alert('Erro ao marcar como concluído');
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

  const pendingRequests = requests.filter(r => r.status === 'Pending');
  const inProgressRequests = requests.filter(r => r.status === 'InProgress');
  const completedTodayRequests = requests.filter(r => {
    if (r.status !== 'Completed') return false;
    const today = new Date().toDateString();
    return new Date(r.completedAt).toDateString() === today;
  });

  const isSupervisor = user?.role === 'Supervisor_Cozinha';

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
      <Box sx={{ width: '100%', maxWidth: '100%', overflow: 'hidden' }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 1 }}>
          <Typography variant="h4" fontWeight={700} sx={{ fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2.125rem' } }}>
            {t('cozinha.panel')}
          </Typography>
          <Chip
            icon={<ScheduleIcon />}
            label="Tempo real"
            color="primary"
            variant="outlined"
          />
        </Box>

        {/* Metrics */}
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' },
          gap: { xs: 2, sm: 2, md: 3 }, 
          mb: 3,
          width: '100%',
          maxWidth: '100%',
        }}>
          <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 33.333%' }, minWidth: 0 }}>
            <Paper elevation={2} sx={{ p: 3, borderLeft: 4, borderColor: 'warning.main', height: '100%', width: '100%', boxSizing: 'border-box' }}>
              <Stack direction="row" spacing={2} alignItems="center">
                <PendingIcon sx={{ fontSize: 48, color: 'warning.main', flexShrink: 0 }} />
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography variant="body2" color="text.secondary" fontWeight={500} noWrap>
                    {t('cozinha.pending')}
                  </Typography>
                  <Typography variant="h3" fontWeight={700} color="warning.main" noWrap>
                    {pendingRequests.length}
                  </Typography>
                </Box>
              </Stack>
            </Paper>
          </Box>

          <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 33.333%' }, minWidth: 0 }}>
            <Paper elevation={2} sx={{ p: 3, borderLeft: 4, borderColor: 'info.main', height: '100%', width: '100%', boxSizing: 'border-box' }}>
              <Stack direction="row" spacing={2} alignItems="center">
                <ProgressIcon sx={{ fontSize: 48, color: 'info.main', flexShrink: 0 }} />
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography variant="body2" color="text.secondary" fontWeight={500} noWrap>
                    {t('cozinha.inProgress')}
                  </Typography>
                  <Typography variant="h3" fontWeight={700} color="info.main" noWrap>
                    {inProgressRequests.length}
                  </Typography>
                </Box>
              </Stack>
            </Paper>
          </Box>

          <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 33.333%' }, minWidth: 0 }}>
            <Paper elevation={2} sx={{ p: 3, borderLeft: 4, borderColor: 'success.main', height: '100%', width: '100%', boxSizing: 'border-box' }}>
              <Stack direction="row" spacing={2} alignItems="center">
                <CompletedIcon sx={{ fontSize: 48, color: 'success.main', flexShrink: 0 }} />
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography variant="body2" color="text.secondary" fontWeight={500} noWrap>
                    Hoje
                  </Typography>
                  <Typography variant="h3" fontWeight={700} color="success.main" noWrap>
                    {completedTodayRequests.length}
                  </Typography>
                </Box>
              </Stack>
            </Paper>
          </Box>
        </Box>

        {/* Kanban Board */}
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', md: 'row' },
          gap: 3,
          width: '100%',
          maxWidth: '100%',
          overflow: 'hidden',
        }}>
          {/* Pending Column */}
          <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 33.333%' }, minWidth: 0, width: '100%', maxWidth: '100%' }}>
            <Paper elevation={3} sx={{ bgcolor: 'warning.50', minHeight: 500, height: '100%', display: 'flex', flexDirection: 'column', width: '100%', boxSizing: 'border-box' }}>
              <Box sx={{ p: 2, bgcolor: 'warning.main', color: 'white' }}>
                <Typography variant="h6" fontWeight={600}>
                  {t('cozinha.pending')} ({pendingRequests.length})
                </Typography>
              </Box>
              <Box sx={{ p: 2, overflow: 'auto', flexGrow: 1 }}>
                <Stack spacing={2}>
                  {pendingRequests.map((request) => (
                    <MuiCard
                      key={request.id}
                      elevation={2}
                      sx={{
                        cursor: isSupervisor ? 'pointer' : 'default',
                        '&:hover': isSupervisor ? { transform: 'translateY(-2px)', boxShadow: 4 } : {},
                      }}
                      onClick={() => isSupervisor && (setSelectedRequest(request), setShowAssignModal(true))}
                    >
                      <CardContent>
                        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={1}>
                          <Typography variant="h6" fontWeight={600}>
                            {request.standNumber}
                          </Typography>
                          <Chip label={getWaitTime(request.requestedAt)} size="small" color="warning" />
                        </Stack>
                        <Typography variant="body2" color="text.secondary">
                          {request.requestedGlassQuantity} taças
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {getCustomerName(request.customerId)}
                        </Typography>
                      </CardContent>
                    </MuiCard>
                  ))}
                  {pendingRequests.length === 0 && (
                    <Alert severity="info">Nenhuma solicitação pendente</Alert>
                  )}
                </Stack>
              </Box>
            </Paper>
          </Box>

          {/* In Progress Column */}
          <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 33.333%' }, minWidth: 0 }}>
            <Paper elevation={3} sx={{ bgcolor: 'info.50', minHeight: 500, height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ p: 2, bgcolor: 'info.main', color: 'white' }}>
                <Typography variant="h6" fontWeight={600}>
                  {t('cozinha.inProgress')} ({inProgressRequests.length})
                </Typography>
              </Box>
              <Box sx={{ p: 2, overflow: 'auto', flexGrow: 1 }}>
                <Stack spacing={2}>
                  {inProgressRequests.map((request) => (
                    <MuiCard key={request.id} elevation={2}>
                      <CardContent>
                        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={1}>
                          <Typography variant="h6" fontWeight={600}>
                            {request.standNumber}
                          </Typography>
                          <Chip label={getWaitTime(request.requestedAt)} size="small" color="info" />
                        </Stack>
                        <Typography variant="body2" color="text.secondary" mb={0.5}>
                          {request.requestedGlassQuantity} taças
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {getCustomerName(request.customerId)}
                        </Typography>
                        {request.assignedWaiterUserId && (
                          <Chip label="Garçom atribuído" size="small" color="info" sx={{ mt: 1, display: 'block', width: 'fit-content' }} />
                        )}
                        {isSupervisor && (
                          <Button
                            variant="contained"
                            color="success"
                            size="small"
                            fullWidth
                            onClick={() => handleMarkAsCompleted(request.id)}
                            sx={{ mt: 2 }}
                            startIcon={<CompletedIcon />}
                          >
                            Marcar como Concluído
                          </Button>
                        )}
                      </CardContent>
                    </MuiCard>
                  ))}
                  {inProgressRequests.length === 0 && (
                    <Alert severity="info">Nenhuma solicitação em andamento</Alert>
                  )}
                </Stack>
              </Box>
            </Paper>
          </Box>

          {/* Completed Today Column */}
          <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 33.333%' }, minWidth: 0, width: '100%', maxWidth: '100%' }}>
            <Paper elevation={3} sx={{ bgcolor: 'success.50', minHeight: 500, height: '100%', display: 'flex', flexDirection: 'column', width: '100%', boxSizing: 'border-box' }}>
              <Box sx={{ p: 2, bgcolor: 'success.main', color: 'white' }}>
                <Typography variant="h6" fontWeight={600}>
                  {t('cozinha.completed')} Hoje ({completedTodayRequests.length})
                </Typography>
              </Box>
              <Box sx={{ p: 2, overflow: 'auto', flexGrow: 1 }}>
                <Stack spacing={2}>
                  {completedTodayRequests.map((request) => (
                    <MuiCard key={request.id} elevation={1} sx={{ opacity: 0.8 }}>
                      <CardContent>
                        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={1}>
                          <Typography variant="h6" fontWeight={600}>
                            {request.standNumber}
                          </Typography>
                          <CompletedIcon sx={{ color: 'success.main' }} />
                        </Stack>
                        <Typography variant="body2" color="text.secondary" mb={0.5}>
                          {request.requestedGlassQuantity} taças
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(request.completedAt).toLocaleTimeString()}
                        </Typography>
                      </CardContent>
                    </MuiCard>
                  ))}
                  {completedTodayRequests.length === 0 && (
                    <Alert severity="info">Nenhuma solicitação concluída hoje</Alert>
                  )}
                </Stack>
              </Box>
            </Paper>
          </Box>
        </Box>
      </Box>

      {/* Assign Waiter Modal */}
      <Dialog
        open={showAssignModal && selectedRequest}
        onClose={() => {
          setShowAssignModal(false);
          setSelectedRequest(null);
        }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h5" fontWeight={700}>
            {t('cozinha.assignWaiter')}
          </Typography>
        </DialogTitle>
        <DialogContent>
          {selectedRequest && (
            <>
              <Paper sx={{ p: 2, mb: 3, bgcolor: 'primary.50', borderLeft: 4, borderColor: 'primary.main' }}>
                <Typography variant="subtitle1" fontWeight={600}>
                  Stand: {selectedRequest.standNumber}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {selectedRequest.requestedGlassQuantity} taças
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Aguardando há {getWaitTime(selectedRequest.requestedAt)}
                </Typography>
              </Paper>
              
              <Stack spacing={2}>
                <MuiCard
                  variant="outlined"
                  sx={{
                    cursor: 'pointer',
                    '&:hover': { borderColor: 'primary.main', boxShadow: 2 },
                  }}
                  onClick={() => handleAssignWaiter('user-004')}
                >
                  <CardContent>
                    <Typography variant="subtitle1" fontWeight={600}>
                      Ana Costa
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Garçom
                    </Typography>
                  </CardContent>
                </MuiCard>
              </Stack>
            </>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button
            onClick={() => {
              setShowAssignModal(false);
              setSelectedRequest(null);
            }}
            variant="outlined"
          >
            {t('common.cancel')}
          </Button>
        </DialogActions>
      </Dialog>
    </Layout>
  );
}
