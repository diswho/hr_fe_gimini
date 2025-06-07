import React, { useEffect, useState, useCallback } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Container, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Button, CircularProgress, Alert, IconButton, Box, Tooltip,
  Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { HrPayslipsService, PayslipInDB } from '../../services/api';

const PayslipsPage: React.FC = () => {
  const [payslips, setPayslips] = useState<PayslipInDB[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [deleteSuccess, setDeleteSuccess] = useState<string | null>(null);

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [payslipToDelete, setPayslipToDelete] = useState<PayslipInDB | null>(null);

  const fetchPayslips = useCallback(async () => {
    setLoading(true);
    setError(null);
    setDeleteError(null);
    setDeleteSuccess(null);
    try {
      const response = await HrPayslipsService.readPayslipsApiV1HrPayslipsGet(0, 100);
      setPayslips(response);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch payslips');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPayslips();
  }, [fetchPayslips]);

  const handleDeleteClick = (payslip: PayslipInDB) => {
    setPayslipToDelete(payslip);
    setOpenDeleteDialog(true);
    setDeleteError(null);
    setDeleteSuccess(null);
  };

  const handleDeleteConfirm = async () => {
    if (!payslipToDelete) return;
    try {
      await HrPayslipsService.deletePayslipApiV1HrPayslipsPayslipIdDelete(payslipToDelete.id);
      setDeleteSuccess(`Payslip #${payslipToDelete.id} deleted successfully.`);
      fetchPayslips();
    } catch (err: any) {
      const errorMsg = err.body?.detail || err.message || `Failed to delete payslip #${payslipToDelete.id}`;
      setDeleteError(errorMsg);
      console.error(err);
    } finally {
      setOpenDeleteDialog(false);
      setPayslipToDelete(null);
    }
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setPayslipToDelete(null);
  };

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return <Container sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Container>;
  }

  if (error) {
    return <Container sx={{ mt: 4 }}><Alert severity="error">{error}</Alert></Container>;
  }

  return (
    <Container sx={{ mt: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4" component="h1">
          Payslips
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          component={RouterLink}
          to="/payslips/new"
        >
          Create New Payslip
        </Button>
      </Box>

      {deleteError && <Alert severity="error" sx={{ my: 2 }}>{deleteError}</Alert>}
      {deleteSuccess && <Alert severity="success" sx={{ my: 2 }}>{deleteSuccess}</Alert>}

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="payslips table">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Employee ID</TableCell>
              <TableCell>Pay Period Start</TableCell>
              <TableCell>Pay Period End</TableCell>
              <TableCell>Payment Date</TableCell>
              <TableCell>Net Pay</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {payslips.length === 0 && !loading && (
              <TableRow><TableCell colSpan={7} align="center">No payslips found.</TableCell></TableRow>
            )}
            {payslips.map((payslip) => (
              <TableRow key={payslip.id}>
                <TableCell>{payslip.id}</TableCell>
                <TableCell>{payslip.employee_id}</TableCell>
                <TableCell>{formatDate(payslip.pay_period_start_date)}</TableCell>
                <TableCell>{formatDate(payslip.pay_period_end_date)}</TableCell>
                <TableCell>{formatDate(payslip.payment_date)}</TableCell>
                <TableCell>{payslip.net_pay.toFixed(2)}</TableCell>
                <TableCell>
                  <Tooltip title="View Details">
                    <IconButton component={RouterLink} to={`/payslips/${payslip.id}`} aria-label="view payslip details" size="small">
                      <VisibilityIcon />
                    </IconButton>
                  </Tooltip>
                   <Tooltip title="Edit Payslip (Main Fields)">
                    <IconButton component={RouterLink} to={`/payslips/${payslip.id}/edit`} aria-label="edit payslip" size="small">
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete Payslip">
                    <IconButton onClick={() => handleDeleteClick(payslip)} aria-label="delete payslip" color="error" size="small">
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete payslip #{payslipToDelete?.id} for employee ID {payslipToDelete?.employee_id}?
            This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default PayslipsPage;
