import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container, Typography, CircularProgress, Alert, Paper, Box, Button, Grid,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip
} from '@mui/material';
import { HrPayslipsService, PayslipInDB, PayslipDetail, SalaryComponentType } from '../../services/api';

const PayslipDetailPage: React.FC = () => {
  const { payslip_id } = useParams<{ payslip_id: string }>();
  const navigate = useNavigate();
  const [payslip, setPayslip] = useState<PayslipInDB | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPayslipDetails = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await HrPayslipsService.readPayslipApiV1HrPayslipsPayslipIdGet(id);
      setPayslip(response);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch payslip details.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (payslip_id) {
      const numericId = parseInt(payslip_id, 10);
      if (isNaN(numericId)) {
        setError("Invalid payslip ID.");
        setLoading(false);
        return;
      }
      fetchPayslipDetails(numericId);
    } else {
      setError("No payslip ID provided.");
      setLoading(false);
    }
  }, [payslip_id, fetchPayslipDetails]);

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  const displayValue = (value: string | number | boolean | null | undefined) => {
    if (value === null || value === undefined) return 'N/A';
    if (typeof value === 'boolean') return value ? 'Yes' : 'No';
    return String(value);
  };

  if (loading) {
    return <Container sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Container>;
  }

  if (error) {
    return <Container sx={{ mt: 4 }}><Alert severity="error">{error}</Alert></Container>;
  }

  if (!payslip) {
    return <Container sx={{ mt: 4 }}><Alert severity="info">No payslip data found.</Alert></Container>;
  }

  return (
    <Container sx={{ mt: 2 }}>
      <Button variant="outlined" onClick={() => navigate('/payslips')} sx={{ mb: 2 }}>
        Back to Payslips List
      </Button>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          Payslip #{payslip.id} - Overview
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="subtitle1">Employee ID:</Typography>
            <Typography variant="body1">{displayValue(payslip.employee_id)}</Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="subtitle1">Pay Period:</Typography>
            <Typography variant="body1">
              {formatDate(payslip.pay_period_start_date)} - {formatDate(payslip.pay_period_end_date)}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="subtitle1">Payment Date:</Typography>
            <Typography variant="body1">{formatDate(payslip.payment_date)}</Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="subtitle1">Total Earnings:</Typography>
            <Typography variant="body1" color="green">{payslip.total_earnings.toFixed(2)}</Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="subtitle1">Total Deductions:</Typography>
            <Typography variant="body1" color="red">{payslip.total_deductions.toFixed(2)}</Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="subtitle1">Net Pay:</Typography>
            <Typography variant="h6" color="primary">{payslip.net_pay.toFixed(2)}</Typography>
          </Grid>
          {payslip.bank_account_number && (
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="subtitle1">Bank Account:</Typography>
              <Typography variant="body1">{displayValue(payslip.bank_account_number)}</Typography>
            </Grid>
          )}
          {payslip.notes && (
             <Grid item xs={12}>
              <Typography variant="subtitle1">Notes:</Typography>
              <Typography variant="body2" sx={{whiteSpace: 'pre-wrap'}}>{displayValue(payslip.notes)}</Typography>
            </Grid>
          )}
        </Grid>
      </Paper>

      {payslip.details && payslip.details.length > 0 && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h5" component="h2" gutterBottom>
            Payslip Details
          </Typography>
          <TableContainer>
            <Table size="small" aria-label="payslip details table">
              <TableHead>
                <TableRow>
                  <TableCell>Component Name</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Earning/Deduction</TableCell>
                  <TableCell align="right">Amount</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {payslip.details.map((detail, index) => (
                  <TableRow key={detail.id || index}> {/* Use detail.id if available, else index */}
                    <TableCell>{detail.component_name}</TableCell>
                    <TableCell><Chip label={detail.component_type as SalaryComponentType} size="small" /></TableCell>
                    <TableCell>{detail.is_earning ? 'Earning' : 'Deduction'}</TableCell>
                    <TableCell align="right">{detail.amount.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}
    </Container>
  );
};

export default PayslipDetailPage;
