import { useState, useEffect } from 'react';
import { customerService, equipmentService } from '../../../services/api.service';
import Layout from '../../../components/layout/Layout';
import QRCode from 'react-qr-code';
import {
  Box,
  Typography,
  Paper,
  Stack,
  Tabs,
  Tab,
  Divider,
  Chip,
  Button,
} from '@mui/material';
import {
  Business as BusinessIcon,
  Inventory as InventoryIcon,
  Print as PrintIcon,
} from '@mui/icons-material';

export default function QRCodeGenerator() {
  const [customers, setCustomers] = useState([]);
  const [equipments, setEquipments] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <Layout>
        <Box sx={{ width: '100%', textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary">
            Carregando QR Codes...
          </Typography>
        </Box>
      </Layout>
    );
  }

  return (
    <Layout>
      <Box sx={{ width: '100%', maxWidth: '100%' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" fontWeight={700}>
            QR Codes para Teste
          </Typography>
          <Button
            variant="contained"
            startIcon={<PrintIcon />}
            onClick={handlePrint}
            className="no-print"
          >
            Imprimir
          </Button>
        </Box>

        <Paper elevation={2} sx={{ mb: 3 }} className="no-print">
          <Tabs value={activeTab} onChange={(e, v) => setActiveTab(v)} variant="fullWidth">
            <Tab icon={<BusinessIcon />} label="Crachás dos Clientes" />
            <Tab icon={<InventoryIcon />} label="Equipamentos" />
          </Tabs>
        </Paper>

        {/* Tab: Crachás dos Clientes */}
        {activeTab === 0 && (
          <Box>
            <Paper elevation={2} sx={{ p: 2, mb: 3, bgcolor: 'primary.50' }} className="no-print">
              <Typography variant="body2" color="text.secondary">
                📱 <strong>Como usar:</strong> Abra esta página no celular e escaneie os QR Codes com o Scanner do Operador, 
                ou imprima esta página e escaneie com o dispositivo de leitura.
              </Typography>
            </Paper>

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
              {customers.length === 0 ? (
                <Box sx={{ width: '100%' }}>
                  <Paper sx={{ p: 4, textAlign: 'center' }}>
                    <Typography variant="body1" color="text.secondary">
                      Nenhum cliente cadastrado
                    </Typography>
                  </Paper>
                </Box>
              ) : (
                customers.map((customer) => (
                <Box key={customer.id} sx={{ flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 12px)', md: '1 1 calc(33.333% - 16px)' }, minWidth: 0 }}>
                  <Paper
                    elevation={3}
                    sx={{
                      p: 3,
                      textAlign: 'center',
                      border: '2px solid',
                      borderColor: 'primary.main',
                      pageBreakInside: 'avoid',
                      width: '100%',
                      boxSizing: 'border-box',
                    }}
                  >
                    <Chip
                      label="CRACHÁ DO EXPOSITOR"
                      color="primary"
                      size="small"
                      sx={{ mb: 2 }}
                    />
                    
                    <Box
                      sx={{
                        bgcolor: 'white',
                        p: 2,
                        borderRadius: 2,
                        display: 'inline-block',
                        mb: 2,
                      }}
                    >
                      {customer.qrCode ? (
                        <QRCode
                          value={String(customer.qrCode)}
                          size={180}
                          level="H"
                        />
                      ) : (
                        <Box sx={{ width: 180, height: 180, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'grey.200' }}>
                          <Typography variant="caption" color="text.secondary">
                            Sem QR Code
                          </Typography>
                        </Box>
                      )}
                    </Box>

                    <Divider sx={{ my: 2 }} />

                    <Typography variant="h6" fontWeight={700} gutterBottom>
                      {customer.companyName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Stand: {customer.standNumber}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ fontFamily: 'monospace' }}>
                      ID: {customer.qrCode}
                    </Typography>

                    <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center', gap: 1 }}>
                      <Chip 
                        label={`🍾 ${customer.availableChampagneQuantity}`}
                        size="small"
                        color="success"
                      />
                      <Chip 
                        label={`🥂 ${customer.availableSpittoonQuantity}`}
                        size="small"
                        color="info"
                      />
                    </Box>
                  </Paper>
                </Box>
              )))}
            </Box>
          </Box>
        )}

        {/* Tab: Equipamentos */}
        {activeTab === 1 && (
          <Box>
            <Paper elevation={2} sx={{ p: 2, mb: 3, bgcolor: 'success.50' }} className="no-print">
              <Typography variant="body2" color="text.secondary">
                📦 <strong>Como usar:</strong> Escaneie estes QR Codes após escanear o crachá do cliente para 
                registrar retiradas ou devoluções de equipamentos.
              </Typography>
            </Paper>

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
              {equipments.length === 0 ? (
                <Box sx={{ width: '100%' }}>
                  <Paper sx={{ p: 4, textAlign: 'center' }}>
                    <Typography variant="body1" color="text.secondary">
                      Nenhum equipamento cadastrado
                    </Typography>
                  </Paper>
                </Box>
              ) : (
                equipments.map((equipment) => (
                <Box key={equipment.id} sx={{ flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 12px)', md: '1 1 calc(33.333% - 16px)' }, minWidth: 0 }}>
                  <Paper
                    elevation={3}
                    sx={{
                      p: 3,
                      textAlign: 'center',
                      border: '2px solid',
                      borderColor: equipment.type === 'Champagne' ? 'success.main' : 'info.main',
                      pageBreakInside: 'avoid',
                      width: '100%',
                      boxSizing: 'border-box',
                    }}
                  >
                    <Chip
                      label={equipment.type === 'Champagne' ? 'CHAMPANHEIRA' : 'CUSPIDEIRA'}
                      color={equipment.type === 'Champagne' ? 'success' : 'info'}
                      size="small"
                      sx={{ mb: 2 }}
                    />
                    
                    <Box
                      sx={{
                        bgcolor: 'white',
                        p: 2,
                        borderRadius: 2,
                        display: 'inline-block',
                        mb: 2,
                      }}
                    >
                      {equipment.qrCode ? (
                        <QRCode
                          value={String(equipment.qrCode)}
                          size={180}
                          level="H"
                        />
                      ) : (
                        <Box sx={{ width: 180, height: 180, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'grey.200' }}>
                          <Typography variant="caption" color="text.secondary">
                            Sem QR Code
                          </Typography>
                        </Box>
                      )}
                    </Box>

                    <Divider sx={{ my: 2 }} />

                    <Typography variant="h6" fontWeight={700} gutterBottom>
                      {equipment.equipmentNumber}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {equipment.type === 'Champagne' ? '🍾 Champanheira' : '🥂 Cuspideira'}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ fontFamily: 'monospace' }}>
                      ID: {equipment.qrCode}
                    </Typography>

                    <Box sx={{ mt: 2 }}>
                      <Chip 
                        label={equipment.status === 'Available' ? 'Disponível' : 'Retirado'}
                        size="small"
                        color={equipment.status === 'Available' ? 'success' : 'warning'}
                      />
                    </Box>

                    {equipment.currentCustomerId && (
                      <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                        Cliente: {customers.find(c => c.id === equipment.currentCustomerId)?.companyName || 'N/A'}
                      </Typography>
                    )}
                  </Paper>
                </Box>
              )))}
            </Box>
          </Box>
        )}
      </Box>

      {/* Print styles */}
      <style>{`
        @media print {
          .no-print {
            display: none !important;
          }
          body {
            background: white;
          }
          @page {
            margin: 1cm;
          }
        }
      `}</style>
    </Layout>
  );
}
