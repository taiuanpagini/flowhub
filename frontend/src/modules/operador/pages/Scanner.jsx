import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { customerService, equipmentService } from '../../../services/api.service';
import Layout from '../../../components/layout/Layout';
import { Html5QrcodeScanner } from 'html5-qrcode';
import {
  Box,
  Typography,
  Button,
  Paper,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Chip,
  Divider,
  Alert,
} from '@mui/material';
import {
  QrCodeScanner as ScannerIcon,
  CheckCircle as CheckIcon,
  Inventory as InventoryIcon,
  Assignment as AssignmentIcon,
  ArrowBack as BackIcon,
  CameraAlt as CameraIcon,
} from '@mui/icons-material';

export default function OperadorScanner() {
  const { t } = useTranslation();
  const [customers, setCustomers] = useState([]);
  const [equipments, setEquipments] = useState([]);
  const [currentFlow, setCurrentFlow] = useState(null); // 'pickup' ou 'return'
  const [scanStep, setScanStep] = useState(null); // 'badge', 'equipment'
  const [scannedCustomer, setScannedCustomer] = useState(null);
  const [scannedEquipment, setScannedEquipment] = useState(null);
  const [showCamera, setShowCamera] = useState(false);
  const [scanError, setScanError] = useState('');
  const scannerRef = useRef(null);
  const qrScannerRef = useRef(null);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (showCamera && scannerRef.current && !qrScannerRef.current) {
      initScanner();
    }
    
    return () => {
      if (qrScannerRef.current) {
        qrScannerRef.current.clear().catch(console.error);
        qrScannerRef.current = null;
      }
    };
  }, [showCamera]);

  const loadData = async () => {
    try {
      const [customersData, equipmentsData] = await Promise.all([
        customerService.getAll(),
        equipmentService.getAll()
      ]);
      setCustomers(customersData || []);
      setEquipments(equipmentsData || []);
    } catch (error) {
      console.error('Error loading data:', error);
      setCustomers([]);
      setEquipments([]);
    }
  };

  const initScanner = () => {
    const scanner = new Html5QrcodeScanner(
      "qr-reader",
      { 
        fps: 10, 
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0,
      },
      false
    );

    scanner.render(onScanSuccess, onScanError);
    qrScannerRef.current = scanner;
  };

  const onScanSuccess = (decodedText) => {
    console.log('QR Code scanned:', decodedText);
    setScanError('');
    
    if (scanStep === 'badge') {
      handleBadgeScan(decodedText);
    } else if (scanStep === 'equipment') {
      handleEquipmentScan(decodedText);
    }
  };

  const onScanError = (error) => {
    // Ignora erros de scan contínuos
    if (error.includes('NotFoundException')) return;
    console.warn('Scan error:', error);
  };

  const handleBadgeScan = (qrCode) => {
    const customer = customers.find(c => c.qrCode === qrCode);
    
    if (!customer) {
      setScanError('Cliente não encontrado! Verifique o QR Code.');
      return;
    }

    setScannedCustomer(customer);
    stopCamera();

    if (currentFlow === 'pickup') {
      // Fluxo de retirada: agora escaneia o equipamento
      setScanStep('equipment');
      setShowCamera(true);
    } else if (currentFlow === 'return') {
      // Fluxo de devolução: mostra equipamentos do cliente
      setScanStep('select-return');
    }
  };

  const handleEquipmentScan = (qrCode) => {
    const equipment = equipments.find(e => e.qrCode === qrCode);
    
    if (!equipment) {
      setScanError('Equipamento não encontrado! Verifique o QR Code.');
      return;
    }

    if (currentFlow === 'pickup') {
      if (equipment.status !== 'Available') {
        setScanError('Este equipamento não está disponível!');
        return;
      }
      setScannedEquipment(equipment);
      stopCamera();
      setScanStep('confirm-pickup');
    } else if (currentFlow === 'return') {
      if (equipment.currentCustomerId !== scannedCustomer.id) {
        setScanError('Este equipamento não pertence a este cliente!');
        return;
      }
      setScannedEquipment(equipment);
      stopCamera();
      setScanStep('confirm-return');
    }
  };

  const stopCamera = () => {
    if (qrScannerRef.current) {
      qrScannerRef.current.clear().catch(console.error);
      qrScannerRef.current = null;
    }
    setShowCamera(false);
  };

  const handleConfirmPickup = async () => {
    try {
      await equipmentService.pickup(scannedCustomer.id, scannedEquipment.id);
      alert('Retirada registrada com sucesso!');
      resetFlow();
      loadData();
    } catch (error) {
      alert(error.response?.data?.message || 'Erro ao registrar retirada');
    }
  };

  const handleConfirmReturn = async () => {
    try {
      const result = await equipmentService.return(scannedEquipment.id);
      alert(result.message || 'Devolução registrada com sucesso!');
      resetFlow();
      loadData();
    } catch (error) {
      alert(error.response?.data?.message || 'Erro ao registrar devolução');
    }
  };

  const resetFlow = () => {
    setCurrentFlow(null);
    setScanStep(null);
    setScannedCustomer(null);
    setScannedEquipment(null);
    setScanError('');
    stopCamera();
  };

  const startPickupFlow = () => {
    setCurrentFlow('pickup');
    setScanStep('badge');
    setShowCamera(true);
  };

  const startReturnFlow = () => {
    setCurrentFlow('return');
    setScanStep('badge');
    setShowCamera(true);
  };

  const availableEquipments = equipments.filter(e => e.status === 'Available');
  const pickedUpEquipments = equipments.filter(e => e.status === 'PickedUp');
  const customerEquipments = scannedCustomer 
    ? equipments.filter(e => e.currentCustomerId === scannedCustomer.id && e.status === 'PickedUp')
    : [];

  // Tela inicial - Escolha de ação
  if (!currentFlow) {
    return (
      <Layout>
        <Box sx={{ width: '100%', maxWidth: '100%' }}>
          <Typography variant="h4" fontWeight={700} sx={{ mb: 4 }}>
            {t('operador.scanner')}
          </Typography>

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3, mb: 4 }}>
            <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 50%' } }}>
              <Paper
                elevation={3}
                sx={{
                  p: 4,
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  background: 'linear-gradient(135deg, #B61E3F 0%, #E94B62 100%)',
                  color: 'white',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: 6,
                  },
                }}
                onClick={startPickupFlow}
              >
                <ScannerIcon sx={{ fontSize: 80, mb: 2 }} />
                <Typography variant="h5" fontWeight={600} gutterBottom>
                  Registrar Retirada
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Escanear crachá do expositor
                </Typography>
              </Paper>
            </Box>
            
            <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 50%' } }}>
              <Paper
                elevation={3}
                sx={{
                  p: 4,
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  background: 'linear-gradient(135deg, #779C65 0%, #8FB779 100%)',
                  color: 'white',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: 6,
                  },
                }}
                onClick={startReturnFlow}
              >
                <CheckIcon sx={{ fontSize: 80, mb: 2 }} />
                <Typography variant="h5" fontWeight={600} gutterBottom>
                  Registrar Devolução
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Escanear crachá do expositor
                </Typography>
              </Paper>
            </Box>
          </Box>

          {/* Stats */}
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
            <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 50%' } }}>
              <Paper elevation={2} sx={{ p: 3 }}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <InventoryIcon sx={{ fontSize: 48, color: 'success.main' }} />
                  <Box>
                    <Typography variant="h6" color="text.secondary">
                      Equipamentos Disponíveis
                    </Typography>
                    <Typography variant="h3" fontWeight={700} color="success.main">
                      {availableEquipments.length}
                    </Typography>
                  </Box>
                </Stack>
              </Paper>
            </Box>
            <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 50%' } }}>
              <Paper elevation={2} sx={{ p: 3 }}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <AssignmentIcon sx={{ fontSize: 48, color: 'info.main' }} />
                  <Box>
                    <Typography variant="h6" color="text.secondary">
                      Equipamentos Retirados
                    </Typography>
                    <Typography variant="h3" fontWeight={700} color="info.main">
                      {pickedUpEquipments.length}
                    </Typography>
                  </Box>
                </Stack>
              </Paper>
            </Box>
          </Box>
        </Box>
      </Layout>
    );
  }

  // Tela de Scanner de QR Code
  if (showCamera) {
    return (
      <Layout>
        <Box sx={{ width: '100%', maxWidth: '100%' }}>
          <Button
            startIcon={<BackIcon />}
            onClick={resetFlow}
            sx={{ mb: 3 }}
          >
            Cancelar
          </Button>

          <Paper elevation={3} sx={{ p: 3, textAlign: 'center' }}>
            <CameraIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
            <Typography variant="h5" fontWeight={700} gutterBottom>
              {scanStep === 'badge' ? 'Escaneie o Crachá do Expositor' : 'Escaneie o Equipamento'}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              {scanStep === 'badge' 
                ? 'Posicione o QR Code do crachá na frente da câmera'
                : 'Posicione o QR Code do equipamento na frente da câmera'}
            </Typography>

            {scanError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {scanError}
              </Alert>
            )}

            <Box 
              id="qr-reader" 
              ref={scannerRef}
              sx={{ 
                width: '100%', 
                maxWidth: 500, 
                margin: '0 auto',
                '& video': {
                  width: '100%',
                  borderRadius: 2,
                }
              }}
            />
          </Paper>
        </Box>
      </Layout>
    );
  }

  // Tela de seleção de equipamento para devolução
  if (scanStep === 'select-return' && scannedCustomer) {
    return (
      <Layout>
        <Box sx={{ width: '100%', maxWidth: '100%' }}>
          <Button
            startIcon={<BackIcon />}
            onClick={resetFlow}
            sx={{ mb: 3 }}
          >
            Voltar
          </Button>

          <Paper elevation={3} sx={{ p: 3, mb: 3, bgcolor: 'primary.50', borderLeft: 4, borderColor: 'primary.main' }}>
            <Typography variant="h6" fontWeight={600}>
              {scannedCustomer.companyName}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Stand: {scannedCustomer.standNumber}
            </Typography>
          </Paper>

          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Equipamentos do Cliente
            </Typography>
            <Divider sx={{ my: 2 }} />
            
            {customerEquipments.length === 0 ? (
              <Alert severity="info">
                Este cliente não possui equipamentos retirados
              </Alert>
            ) : (
              <>
                <Alert severity="info" sx={{ mb: 3 }}>
                  Clique em "Escanear Equipamento" e aponte a câmera para o QR Code do item a ser devolvido
                </Alert>
                <Button
                  variant="contained"
                  size="large"
                  fullWidth
                  startIcon={<CameraIcon />}
                  onClick={() => {
                    setScanStep('equipment');
                    setShowCamera(true);
                  }}
                  sx={{ mb: 3 }}
                >
                  Escanear Equipamento
                </Button>

                <Stack spacing={2}>
                  {customerEquipments.map((equip) => (
                    <Paper
                      key={equip.id}
                      variant="outlined"
                      sx={{ p: 2 }}
                    >
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box>
                          <Typography variant="subtitle1" fontWeight={600}>
                            {equip.equipmentNumber}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {equip.type === 'Champagne' ? 'Champanheira' : 'Cuspideira'}
                          </Typography>
                        </Box>
                        <Chip label="Retirado" color="info" size="small" />
                      </Box>
                    </Paper>
                  ))}
                </Stack>
              </>
            )}
          </Paper>
        </Box>
      </Layout>
    );
  }

  // Tela de confirmação de retirada
  if (scanStep === 'confirm-pickup' && scannedCustomer && scannedEquipment) {
    return (
      <Layout>
        <Box sx={{ width: '100%', maxWidth: '100%' }}>
          <Button
            startIcon={<BackIcon />}
            onClick={resetFlow}
            sx={{ mb: 3 }}
          >
            Cancelar
          </Button>

          <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
            <CheckIcon sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />
            <Typography variant="h5" fontWeight={700} gutterBottom color="success.main">
              Confirmar Retirada
            </Typography>

            <Stack spacing={3} sx={{ mt: 4, maxWidth: 500, margin: '0 auto' }}>
              <Paper sx={{ p: 3, bgcolor: 'primary.50', borderLeft: 4, borderColor: 'primary.main' }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  CLIENTE
                </Typography>
                <Typography variant="h6" fontWeight={600}>
                  {scannedCustomer.companyName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Stand: {scannedCustomer.standNumber}
                </Typography>
                <Divider sx={{ my: 1.5 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2">
                    Champanheiras disponíveis: <strong>{scannedCustomer.availableChampagneQuantity}</strong>
                  </Typography>
                  <Typography variant="body2">
                    Cuspideiras disponíveis: <strong>{scannedCustomer.availableSpittoonQuantity}</strong>
                  </Typography>
                </Box>
              </Paper>

              <Paper sx={{ p: 3, bgcolor: 'success.50', borderLeft: 4, borderColor: 'success.main' }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  EQUIPAMENTO
                </Typography>
                <Typography variant="h6" fontWeight={600}>
                  {scannedEquipment.equipmentNumber}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {scannedEquipment.type === 'Champagne' ? 'Champanheira' : 'Cuspideira'}
                </Typography>
              </Paper>

              <Stack direction="row" spacing={2}>
                <Button
                  variant="outlined"
                  size="large"
                  fullWidth
                  onClick={resetFlow}
                >
                  Cancelar
                </Button>
                <Button
                  variant="contained"
                  size="large"
                  fullWidth
                  color="success"
                  onClick={handleConfirmPickup}
                >
                  Confirmar Retirada
                </Button>
              </Stack>
            </Stack>
          </Paper>
        </Box>
      </Layout>
    );
  }

  // Tela de confirmação de devolução
  if (scanStep === 'confirm-return' && scannedCustomer && scannedEquipment) {
    return (
      <Layout>
        <Box sx={{ width: '100%', maxWidth: '100%' }}>
          <Button
            startIcon={<BackIcon />}
            onClick={resetFlow}
            sx={{ mb: 3 }}
          >
            Cancelar
          </Button>

          <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
            <CheckIcon sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />
            <Typography variant="h5" fontWeight={700} gutterBottom color="success.main">
              Confirmar Devolução
            </Typography>

            <Stack spacing={3} sx={{ mt: 4, maxWidth: 500, margin: '0 auto' }}>
              <Paper sx={{ p: 3, bgcolor: 'primary.50', borderLeft: 4, borderColor: 'primary.main' }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  CLIENTE
                </Typography>
                <Typography variant="h6" fontWeight={600}>
                  {scannedCustomer.companyName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Stand: {scannedCustomer.standNumber}
                </Typography>
              </Paper>

              <Paper sx={{ p: 3, bgcolor: 'success.50', borderLeft: 4, borderColor: 'success.main' }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  EQUIPAMENTO
                </Typography>
                <Typography variant="h6" fontWeight={600}>
                  {scannedEquipment.equipmentNumber}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {scannedEquipment.type === 'Champagne' ? 'Champanheira' : 'Cuspideira'}
                </Typography>
              </Paper>

              <Stack direction="row" spacing={2}>
                <Button
                  variant="outlined"
                  size="large"
                  fullWidth
                  onClick={resetFlow}
                >
                  Cancelar
                </Button>
                <Button
                  variant="contained"
                  size="large"
                  fullWidth
                  color="success"
                  onClick={handleConfirmReturn}
                >
                  Confirmar Devolução
                </Button>
              </Stack>
            </Stack>
          </Paper>
        </Box>
      </Layout>
    );
  }

  return null;
}
