import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { customerService, equipmentService } from '../../../services/api.service';
import Layout from '../../../components/layout/Layout';
import {
  Box,
  Typography,
  Paper,
  Stack,
  Button,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Inventory as InventoryIcon,
  Business as BusinessIcon,
  Clear as ClearIcon,
} from '@mui/icons-material';

export default function AdminDashboard() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState(0);
  const [customers, setCustomers] = useState([]);
  const [equipments, setEquipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [generateType, setGenerateType] = useState('Champagne');
  const [generateQuantity, setGenerateQuantity] = useState(10);

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
      
      setCustomers(customersData);
      setEquipments(equipmentsData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateEquipments = async (e) => {
    e.preventDefault();
    
    try {
      console.log('Generating equipments:', { type: generateType, quantity: generateQuantity, eventId: 'evt-001' });
      const generated = await equipmentService.generate(generateType, generateQuantity, 'evt-001');
      console.log('Generated equipments:', generated);
      alert(`${generated.length} equipamentos gerados com sucesso!`);
      setShowGenerateModal(false);
      setGenerateType('Champagne');
      setGenerateQuantity(10);
      loadData();
    } catch (error) {
      console.error('Error generating equipments:', error);
      console.error('Error response:', error.response);
      alert(`Erro ao gerar equipamentos: ${error.response?.data?.message || error.response?.data || error.message}`);
    }
  };

  const handleGenerateMockCustomers = async () => {
    try {
      const generated = await customerService.generateMock();
      alert(`${generated.length} clientes gerados com sucesso!`);
      loadData();
    } catch (error) {
      console.error('Error generating customers:', error);
      alert(`Erro ao gerar clientes: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleClearCustomers = async () => {
    if (!confirm('Tem certeza que deseja remover TODOS os clientes? Esta ação não pode ser desfeita.')) {
      return;
    }
    
    try {
      const result = await customerService.clearAll();
      alert(result.message);
      loadData();
    } catch (error) {
      console.error('Error clearing customers:', error);
      alert(`Erro ao limpar clientes: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleClearEquipments = async () => {
    if (!confirm('Tem certeza que deseja remover TODOS os equipamentos? Esta ação não pode ser desfeita.')) {
      return;
    }
    
    try {
      const result = await equipmentService.clearAll();
      alert(result.message);
      loadData();
    } catch (error) {
      console.error('Error clearing equipments:', error);
      alert(`Erro ao limpar equipamentos: ${error.response?.data?.message || error.message}`);
    }
  };

  const availableEquipments = equipments.filter(e => e.status === 'Available');
  const pickedUpEquipments = equipments.filter(e => e.status === 'PickedUp');

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
        <Typography variant="h4" fontWeight={700} sx={{ mb: 4 }}>
          {t('admin.dashboard')}
        </Typography>

        {/* Tabs */}
        <Paper elevation={2} sx={{ mb: 3 }}>
          <Tabs
            value={activeTab}
            onChange={(e, newValue) => setActiveTab(newValue)}
            sx={{ borderBottom: 1, borderColor: 'divider' }}
          >
            <Tab
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <BusinessIcon />
                  {t('admin.customers')} ({customers.length})
                </Box>
              }
            />
            <Tab
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <InventoryIcon />
                  {t('admin.equipments')} ({equipments.length})
                </Box>
              }
            />
          </Tabs>
        </Paper>

        {/* Customers Tab */}
        {activeTab === 0 && (
          <Paper elevation={2}>
            <Box sx={{ p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: 1, borderColor: 'divider' }}>
              <Typography variant="h6" fontWeight={600}>
                {t('admin.customers')}
              </Typography>
              <Stack direction="row" spacing={2}>
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<ClearIcon />}
                  onClick={handleClearCustomers}
                  disabled={customers.length === 0}
                >
                  Limpar Todos
                </Button>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={handleGenerateMockCustomers}
                >
                  Gerar 3 Clientes
                </Button>
              </Stack>
            </Box>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell><strong>{t('admin.companyName')}</strong></TableCell>
                    <TableCell><strong>CNPJ</strong></TableCell>
                    <TableCell><strong>Stand</strong></TableCell>
                    <TableCell><strong>Kits</strong></TableCell>
                    <TableCell align="right"><strong>Ações</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {customers.map((customer) => (
                    <TableRow
                      key={customer.id}
                      hover
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      <TableCell>
                        <Typography variant="body2" fontWeight={600}>
                          {customer.companyName}
                        </Typography>
                      </TableCell>
                      <TableCell>{customer.cnpj}</TableCell>
                      <TableCell>{customer.standNumber}</TableCell>
                      <TableCell>
                        <Chip label={customer.purchasedKitsQuantity} color="primary" size="small" />
                      </TableCell>
                      <TableCell align="right">
                        <IconButton size="small" color="primary">
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton size="small" color="error">
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        )}

        {/* Equipments Tab */}
        {activeTab === 1 && (
          <Box>
            {/* Stats */}
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3, mb: 3 }}>
              <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 33.333%' } }}>
                <Paper
                  elevation={2}
                  sx={{
                    p: 3,
                    borderLeft: 4,
                    borderColor: 'primary.main',
                  }}
                >
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    Total
                  </Typography>
                  <Typography variant="h3" fontWeight={700}>
                    {equipments.length}
                  </Typography>
                </Paper>
              </Box>
              <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 33.333%' } }}>
                <Paper
                  elevation={2}
                  sx={{
                    p: 3,
                    borderLeft: 4,
                    borderColor: 'success.main',
                  }}
                >
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    Disponíveis
                  </Typography>
                  <Typography variant="h3" fontWeight={700} color="success.main">
                    {availableEquipments.length}
                  </Typography>
                </Paper>
              </Box>
              <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 33.333%' } }}>
                <Paper
                  elevation={2}
                  sx={{
                    p: 3,
                    borderLeft: 4,
                    borderColor: 'info.main',
                  }}
                >
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    Retirados
                  </Typography>
                  <Typography variant="h3" fontWeight={700} color="info.main">
                    {pickedUpEquipments.length}
                  </Typography>
                </Paper>
              </Box>
            </Box>

            <Paper elevation={2}>
              <Box sx={{ p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: 1, borderColor: 'divider' }}>
                <Typography variant="h6" fontWeight={600}>
                  {t('admin.equipments')}
                </Typography>
                <Stack direction="row" spacing={2}>
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<ClearIcon />}
                    onClick={handleClearEquipments}
                    disabled={equipments.length === 0}
                  >
                    Limpar Todos
                  </Button>
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => setShowGenerateModal(true)}
                  >
                    {t('admin.generateEquipments')}
                  </Button>
                </Stack>
              </Box>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell><strong>Número</strong></TableCell>
                      <TableCell><strong>Tipo</strong></TableCell>
                      <TableCell><strong>QR Code</strong></TableCell>
                      <TableCell><strong>Status</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {equipments.map((equipment) => (
                      <TableRow
                        key={equipment.id}
                        hover
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                      >
                        <TableCell>
                          <Typography variant="body2" fontWeight={600}>
                            {equipment.equipmentNumber}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          {equipment.type === 'Champagne' ? 'Champanheira' : 'Cuspideira'}
                        </TableCell>
                        <TableCell>
                          <Typography variant="caption" sx={{ fontFamily: 'monospace' }}>
                            {equipment.qrCode}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={
                              equipment.status === 'Available' ? 'Disponível' :
                              equipment.status === 'PickedUp' ? 'Retirado' :
                              'Devolvido'
                            }
                            color={
                              equipment.status === 'Available' ? 'success' :
                              equipment.status === 'PickedUp' ? 'info' :
                              'default'
                            }
                            size="small"
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Box>
        )}
      </Box>

      {/* Generate Equipments Modal */}
      <Dialog
        open={showGenerateModal}
        onClose={() => setShowGenerateModal(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h5" fontWeight={700}>
            {t('admin.generateEquipments')}
          </Typography>
        </DialogTitle>
        <form onSubmit={handleGenerateEquipments}>
          <DialogContent>
            <Stack spacing={3}>
              <TextField
                select
                fullWidth
                label={t('admin.equipmentType')}
                value={generateType}
                onChange={(e) => setGenerateType(e.target.value)}
              >
                <MenuItem value="Champagne">Champanheira</MenuItem>
                <MenuItem value="Spittoon">Cuspideira</MenuItem>
              </TextField>

              <TextField
                fullWidth
                type="number"
                label="Quantidade"
                value={generateQuantity}
                onChange={(e) => setGenerateQuantity(Number(e.target.value))}
                inputProps={{ min: 1, max: 100 }}
              />
            </Stack>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3 }}>
            <Button
              onClick={() => setShowGenerateModal(false)}
              variant="outlined"
            >
              {t('common.cancel')}
            </Button>
            <Button
              type="submit"
              variant="contained"
            >
              {t('common.confirm')}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Layout>
  );
}
