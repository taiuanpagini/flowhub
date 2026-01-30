import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../../context/AuthContext';
import { customerService, serviceRequestService, equipmentService } from '../../../services/api.service';
import signalRService from '../../../services/signalr.service';
import Layout from '../../../components/layout/Layout';
import Card from '../../../components/shared/Card';
import {
  Box,
  Typography,
  Button,
  Paper,
  Stack,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  WineBar as WineBarIcon,
  LocalShipping as ShippingIcon,
  Assignment as AssignmentIcon,
  Add as AddIcon,
} from '@mui/icons-material';

export default function ExpositorDashboard() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [customer, setCustomer] = useState(null);
  const [serviceRequests, setServiceRequests] = useState([]);
  const [equipments, setEquipments] = useState([]);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [glassQuantity, setGlassQuantity] = useState(25);
  const [observations, setObservations] = useState('');

  useEffect(() => {
    loadData();
    setupSignalR();
    
    return () => {
      signalRService.off('NewServiceRequest');
      signalRService.off('ServiceRequestUpdated');
      signalRService.off('ServiceRequestAssigned');
      signalRService.off('ServiceRequestCompleted');
    };
  }, []);

  const setupSignalR = async () => {
    try {
      await signalRService.start();
      
      // Nova solicitação criada
      signalRService.on('NewServiceRequest', (request) => {
        if (request.customerId === user.customerId) {
          console.log('New service request:', request);
          setServiceRequests(prev => {
            // Verifica se já existe para evitar duplicação
            const exists = prev.find(r => r.id === request.id);
            if (exists) return prev;
            return [...prev, request];
          });
        }
      });
      
      signalRService.on('ServiceRequestUpdated', (request) => {
        if (request.customerId === user.customerId) {
          console.log('Service request updated:', request);
          setServiceRequests(prev => prev.map(r => r.id === request.id ? request : r));
        }
      });

      signalRService.on('ServiceRequestAssigned', (request) => {
        if (request.customerId === user.customerId) {
          console.log('Service request assigned:', request);
          setServiceRequests(prev => prev.map(r => r.id === request.id ? request : r));
        }
      });

      signalRService.on('ServiceRequestCompleted', (request) => {
        if (request.customerId === user.customerId) {
          console.log('Service request completed:', request);
          setServiceRequests(prev => prev.map(r => r.id === request.id ? request : r));
        }
      });
    } catch (error) {
      console.error('SignalR error:', error);
    }
  };

  const loadData = async () => {
    try {
      setLoading(true);
      
      const customerData = await customerService.getById(user.customerId);
      setCustomer(customerData);
      
      const requests = await serviceRequestService.getByCustomerId(user.customerId);
      setServiceRequests(requests);
      
      const equip = await equipmentService.getByCustomerId(user.customerId);
      setEquipments(equip);
      
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestService = async (e) => {
    e.preventDefault();
    
    try {
      const newRequest = await serviceRequestService.create({
        customerId: user.customerId,
        requestedGlassQuantity: glassQuantity
      });
      
      alert(t('expositor.requestSent'));
      setShowRequestModal(false);
      setGlassQuantity(25);
      setObservations('');
      
      // Adiciona a nova solicitação ao estado imediatamente
      // O SignalR vai atualizar todos os outros usuários
      setServiceRequests(prev => [...prev, newRequest]);
      
    } catch (error) {
      console.error('Error creating request:', error);
      alert('Erro ao criar solicitação');
    }
  };

  const activeRequests = serviceRequests.filter(r => r.status !== 'Completed');

  if (loading) {
    return (
      <Layout>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
          <CircularProgress size={60} />
        </Box>
      </Layout>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return 'warning';
      case 'InProgress': return 'info';
      case 'Completed': return 'success';
      default: return 'default';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'Pending': return 'Pendente';
      case 'InProgress': return 'Em Andamento';
      case 'Completed': return 'Concluído';
      default: return status;
    }
  };

  return (
    <Layout>
      <Box sx={{ width: '100%', maxWidth: '100%', overflow: 'hidden' }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2, mb: 3 }}>
          <Box>
            <Typography variant="h4" fontWeight={700} gutterBottom>
              {t('expositor.dashboard')}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {customer?.companyName} - Stand {customer?.standNumber}
            </Typography>
          </Box>
          <Chip 
            label="Tempo real" 
            color="success" 
            size="small" 
            variant="outlined"
          />
        </Box>

        {/* Stats Cards */}
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 3, mb: 3 }}>
          <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 33.333%' } }}>
            <Card
              title={t('expositor.purchasedKits')}
              value={customer?.purchasedKitsQuantity || 0}
              icon={<WineBarIcon />}
              color="primary"
            />
          </Box>
          <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 33.333%' } }}>
            <Card
              title={t('expositor.equipments')}
              value={`${equipments.length}/${customer?.purchasedKitsQuantity * 2 || 0}`}
              subtitle="Retirados / Total"
              icon={<ShippingIcon />}
              color="secondary"
            />
          </Box>
          <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 33.333%' } }}>
            <Card
              title={t('expositor.activeRequests')}
              value={activeRequests.length}
              icon={<AssignmentIcon />}
              color="warning"
            />
          </Box>
        </Box>

        {/* Request Button */}
        <Box sx={{ mb: 3 }}>
          <Button
            variant="contained"
            size="large"
            startIcon={<AddIcon />}
            onClick={() => setShowRequestModal(true)}
            fullWidth
            sx={{
              py: 2,
              fontSize: '1.1rem',
              maxWidth: 400,
            }}
          >
            🍷 {t('expositor.requestService')}
          </Button>
        </Box>

        {/* Active Requests */}
        <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" fontWeight={600} gutterBottom>
            {t('expositor.activeRequests')}
          </Typography>
          {activeRequests.length === 0 ? (
            <Alert severity="info" sx={{ mt: 2 }}>
              Nenhuma solicitação ativa
            </Alert>
          ) : (
            <Stack spacing={2} sx={{ mt: 2 }}>
              {activeRequests.map((request) => (
                <Paper
                  key={request.id}
                  variant="outlined"
                  sx={{
                    p: 2,
                    transition: 'all 0.2s',
                    '&:hover': { boxShadow: 2 },
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box>
                      <Typography variant="subtitle1" fontWeight={600}>
                        {request.requestedGlassQuantity} {t('expositor.glassQuantity')}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {t('expositor.requestedAt')}: {new Date(request.requestedAt).toLocaleString()}
                      </Typography>
                    </Box>
                    <Chip
                      label={getStatusLabel(request.status)}
                      color={getStatusColor(request.status)}
                      size="small"
                    />
                  </Box>
                </Paper>
              ))}
            </Stack>
          )}
        </Paper>

        {/* My Equipments */}
        <Paper elevation={2} sx={{ p: 3 }}>
          <Typography variant="h6" fontWeight={600} gutterBottom>
            {t('expositor.myEquipments')}
          </Typography>
          {equipments.length === 0 ? (
            <Alert severity="info" sx={{ mt: 2 }}>
              Nenhum equipamento retirado
            </Alert>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, flexWrap: 'wrap', gap: 2, mt: 2 }}>
              {equipments.map((equip) => (
                <Box key={equip.id} sx={{ flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 8px)' }, minWidth: 0 }}>
                  <Paper
                    variant="outlined"
                    sx={{
                      p: 2,
                      transition: 'all 0.2s',
                      '&:hover': { boxShadow: 2 },
                    }}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Box>
                        <Typography variant="subtitle1" fontWeight={600}>
                          {equip.equipmentNumber}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {equip.type === 'Champagne' ? 'Champanheira' : 'Cuspideira'}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Retirado: {new Date(equip.pickupDate).toLocaleDateString()}
                        </Typography>
                      </Box>
                      <Chip
                        label={t('expositor.onTime')}
                        color="success"
                        size="small"
                      />
                    </Box>
                  </Paper>
                </Box>
              ))}
            </Box>
          )}
        </Paper>
      </Box>

      {/* Request Modal */}
      <Dialog
        open={showRequestModal}
        onClose={() => setShowRequestModal(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h5" fontWeight={700}>
            {t('expositor.requestService')}
          </Typography>
        </DialogTitle>
        <form onSubmit={handleRequestService}>
          <DialogContent>
            <Stack spacing={3}>
              <TextField
                select
                fullWidth
                label={t('expositor.glassQuantity')}
                value={glassQuantity}
                onChange={(e) => setGlassQuantity(Number(e.target.value))}
              >
                <MenuItem value={25}>25 taças</MenuItem>
                <MenuItem value={50}>50 taças</MenuItem>
                <MenuItem value={75}>75 taças</MenuItem>
                <MenuItem value={100}>100 taças</MenuItem>
              </TextField>

              <TextField
                fullWidth
                multiline
                rows={3}
                label={t('expositor.observations')}
                value={observations}
                onChange={(e) => setObservations(e.target.value)}
                placeholder="Observações opcionais..."
              />
            </Stack>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3 }}>
            <Button
              onClick={() => setShowRequestModal(false)}
              variant="outlined"
            >
              {t('common.cancel')}
            </Button>
            <Button
              type="submit"
              variant="contained"
            >
              {t('expositor.submit')}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Layout>
  );
}
