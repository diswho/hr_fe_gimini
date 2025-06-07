import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container, Typography, TextField, Button, CircularProgress, Alert,
  Box, Paper, Grid, IconButton, MenuItem, Chip, Divider, List, ListItem, ListItemText
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import {
  HrPayslipsService, PayslipCreate, PayslipUpdate, PayslipInDB, PayslipDetailCreate,
  SalaryComponentType, HrSalaryComponentsService, SalaryComponentInDB
} from '../../services/api';

// Helper to get all enum values for SalaryComponentType
const allSalaryComponentTypes = Object.values(SalaryComponentType);

const PayslipFormPage: React.FC = () => {
  const { payslip_id } = useParams<{ payslip_id?: string }>();
  const navigate = useNavigate();
  const isEditMode = Boolean(payslip_id);

  const [mainFormData, setMainFormData] = useState<Partial<PayslipCreate | PayslipUpdate>>({
    employee_id: undefined,
    pay_period_start_date: '',
    pay_period_end_date: '',
    payment_date: '',
    bank_account_number: '',
    notes: '',
    total_earnings: 0,
    total_deductions: 0,
    net_pay: 0,
  });

  const [details, setDetails] = useState<Partial<PayslipDetailCreate>[]>([]);
  const [salaryComponents, setSalaryComponents] = useState<SalaryComponentInDB[]>([]);

  const [loading, setLoading] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);

  // Fetch salary components for dropdown
  useEffect(() => {
    HrSalaryComponentsService.readSalaryComponentsApiV1HrSalaryComponentsGet(0, 1000) // Fetch a good number for selection
      .then(setSalaryComponents)
      .catch(() => setError('Failed to load salary components for selection.'));
  }, []);

  // Fetch existing payslip for edit mode
  const fetchPayslip = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const response: PayslipInDB = await HrPayslipsService.readPayslipApiV1HrPayslipsPayslipIdGet(id);
      setMainFormData({
        employee_id: response.employee_id,
        pay_period_start_date: response.pay_period_start_date.substring(0,10),
        pay_period_end_date: response.pay_period_end_date.substring(0,10),
        payment_date: response.payment_date.substring(0,10),
        bank_account_number: response.bank_account_number || '',
        notes: response.notes || '',
        total_earnings: response.total_earnings,
        total_deductions: response.total_deductions,
        net_pay: response.net_pay,
      });
      // In edit mode, details are typically read-only from PayslipInDB, not for PayslipUpdate.
      // So, we map PayslipDetail (from PayslipInDB) to PayslipDetailCreate structure for display if needed.
      if (response.details) {
        setDetails(response.details.map(d => ({ ...d }))); // Assuming PayslipDetail is compatible enough
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch payslip data.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isEditMode && payslip_id) {
      fetchPayslip(parseInt(payslip_id, 10));
    }
  }, [isEditMode, payslip_id, fetchPayslip]);

  // Calculate totals whenever details change
  useEffect(() => {
    if (isEditMode) return; // In edit mode, totals are from fetched data and not recalculated from details

    let earnings = 0;
    let deductions = 0;
    details.forEach(detail => {
      if (detail.amount && typeof detail.amount === 'number') {
        if (detail.is_earning) {
          earnings += detail.amount;
        } else {
          deductions += detail.amount;
        }
      }
    });
    setMainFormData(prev => ({
      ...prev,
      total_earnings: earnings,
      total_deductions: deductions,
      net_pay: earnings - deductions,
    }));
  }, [details, isEditMode]);


  const handleMainFormChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    let processedValue: string | number | null | undefined = value; // Allow undefined for initial assignment
    if (['employee_id', 'total_earnings', 'total_deductions', 'net_pay'].includes(name)) {
        processedValue = value === '' ? null : Number(value); // Change undefined to null
    }
    setMainFormData(prev => ({ ...prev, [name]: processedValue as any })); // Cast to any to handle potential intermediate type mismatch
  };

  const handleDetailChange = (index: number, field: keyof PayslipDetailCreate, value: any) => {
    const newDetails = [...details];
    const detailToUpdate = { ...newDetails[index] };

    if (field === 'component_id') {
        const selectedComponent = salaryComponents.find(sc => sc.id === Number(value));
        if (selectedComponent) {
            detailToUpdate.component_id = selectedComponent.id;
            detailToUpdate.component_name = selectedComponent.name;
            detailToUpdate.component_type = selectedComponent.type;
            detailToUpdate.is_earning = selectedComponent.is_earning;
        } else {
            // Clear related fields if component selection is invalid or cleared
            detailToUpdate.component_id = undefined;
            detailToUpdate.component_name = '';
            // Keep existing type/is_earning or clear them too
        }
    } else if (field === 'amount') {
        detailToUpdate[field] = value === '' ? undefined : Number(value);
    } else if (field === 'is_earning') {
        detailToUpdate[field] = value as boolean; // Comes from Switch/Checkbox
    }
     else {
        detailToUpdate[field] = value;
    }
    newDetails[index] = detailToUpdate;
    setDetails(newDetails);
  };

  const addDetailRow = () => {
    setDetails([...details, { component_id: undefined, component_name: '', component_type: allSalaryComponentTypes[0], is_earning: true, amount: 0 }]);
  };

  const removeDetailRow = (index: number) => {
    const newDetails = details.filter((_, i) => i !== index);
    setDetails(newDetails);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    // Validate main form data
    if (!mainFormData.employee_id || !mainFormData.pay_period_start_date || !mainFormData.pay_period_end_date || !mainFormData.payment_date) {
      setSubmitError("Employee ID and all date fields are required.");
      setSubmitting(false);
      return;
    }

    // Validate details (for create mode)
    if (!isEditMode) {
        for (const detail of details) {
            if (!detail.component_id || !detail.component_name || detail.amount === undefined || detail.amount < 0) {
                setSubmitError("All payslip detail lines must have a selected component and a valid non-negative amount.");
                setSubmitting(false);
                return;
            }
        }
    }

    const payload: PayslipCreate | PayslipUpdate = {
      ...mainFormData,
      employee_id: Number(mainFormData.employee_id),
      total_earnings: Number(mainFormData.total_earnings),
      total_deductions: Number(mainFormData.total_deductions),
      net_pay: Number(mainFormData.net_pay),
      details: isEditMode ? undefined : (details.filter(d => d.component_id && d.amount !== undefined) as PayslipDetailCreate[]), // Details only for create
    };

    try {
      if (isEditMode && payslip_id) {
        await HrPayslipsService.updatePayslipApiV1HrPayslipsPayslipIdPut(parseInt(payslip_id, 10), payload as PayslipUpdate);
      } else {
        await HrPayslipsService.createPayslipApiV1HrPayslipsPost(payload as PayslipCreate);
      }
      setSubmitSuccess(true);
      setTimeout(() => navigate('/payslips'), 1500);
    } catch (err: any) {
      const errorDetail = err.body?.detail;
      if (Array.isArray(errorDetail)) {
        setSubmitError(errorDetail.map(d => `${d.loc.join('.')}: ${d.msg}`).join('; '));
      } else {
        setSubmitError(err.message || (isEditMode ? 'Failed to update payslip.' : 'Failed to create payslip.'));
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading && isEditMode) return <Container sx={{display: 'flex', justifyContent: 'center', mt: 4}}><CircularProgress /></Container>;
  if (error) return <Container sx={{mt: 4}}><Alert severity="error">{error}</Alert></Container>;

  return (
    <Container sx={{ mt: 2 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {isEditMode ? `Edit Payslip #${payslip_id}` : 'Create New Payslip'}
        </Typography>
        <Button variant="outlined" onClick={() => navigate('/payslips')} sx={{ mb: 2 }}>
          Back to List
        </Button>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            {/* Main Payslip Fields */}
            <Grid item xs={12} sm={6} md={4}><TextField name="employee_id" label="Employee ID" type="number" value={mainFormData.employee_id || ''} onChange={handleMainFormChange} fullWidth required /></Grid>
            <Grid item xs={12} sm={6} md={4}><TextField name="pay_period_start_date" label="Pay Period Start" type="date" value={mainFormData.pay_period_start_date} onChange={handleMainFormChange} InputLabelProps={{ shrink: true }} fullWidth required /></Grid>
            <Grid item xs={12} sm={6} md={4}><TextField name="pay_period_end_date" label="Pay Period End" type="date" value={mainFormData.pay_period_end_date} onChange={handleMainFormChange} InputLabelProps={{ shrink: true }} fullWidth required /></Grid>
            <Grid item xs={12} sm={6} md={4}><TextField name="payment_date" label="Payment Date" type="date" value={mainFormData.payment_date} onChange={handleMainFormChange} InputLabelProps={{ shrink: true }} fullWidth required /></Grid>
            <Grid item xs={12} sm={6} md={4}><TextField name="bank_account_number" label="Bank Account (Optional)" value={mainFormData.bank_account_number || ''} onChange={handleMainFormChange} fullWidth /></Grid>
            <Grid item xs={12}><TextField name="notes" label="Notes (Optional)" multiline rows={2} value={mainFormData.notes || ''} onChange={handleMainFormChange} fullWidth /></Grid>
          </Grid>

          <Divider sx={{ my: 3 }}><Chip label="Payslip Details" /></Divider>

          {isEditMode && (
            <Box mb={2}>
              <Typography variant="subtitle2" color="text.secondary">
                Payslip details are read-only in edit mode. To change details, please delete this payslip and create a new one.
              </Typography>
            </Box>
          )}

          {/* Payslip Details Section - editable only in create mode */}
          {details.map((detail, index) => (
            <Grid container spacing={1} key={index} alignItems="center" sx={{ mb: 1 }}>
              <Grid item xs={12} sm={3}>
                <TextField
                  label="Salary Component"
                  select
                  value={detail.component_id || ''}
                  onChange={(e) => handleDetailChange(index, 'component_id', e.target.value)}
                  fullWidth
                  required
                  disabled={isEditMode}
                >
                  <MenuItem value=""><em>Select Component</em></MenuItem>
                  {salaryComponents.map(sc => (
                    <MenuItem key={sc.id} value={sc.id}>{sc.name} ({sc.is_earning ? "Earning" : "Deduction"}, Type: {sc.type})</MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={3}><TextField label="Component Name" value={detail.component_name || ''} fullWidth disabled InputLabelProps={{ shrink: true }}/></Grid>
              <Grid item xs={12} sm={2}><TextField label="Type" value={detail.component_type || ''} fullWidth disabled InputLabelProps={{ shrink: true }} /></Grid>
              <Grid item xs={12} sm={2}><TextField label="Earning?" value={detail.is_earning ? "Yes" : "No"} fullWidth disabled InputLabelProps={{ shrink: true }} /></Grid>
              <Grid item xs={12} sm={1.5}><TextField label="Amount" type="number" value={detail.amount === undefined ? '' : detail.amount} onChange={(e) => handleDetailChange(index, 'amount', e.target.value)} fullWidth required disabled={isEditMode} InputProps={{ inputProps: { step: "0.01" }}} /></Grid>
              <Grid item xs={12} sm={0.5}>
                {!isEditMode && (
                  <IconButton onClick={() => removeDetailRow(index)} color="error" aria-label="remove detail">
                    <RemoveCircleOutlineIcon />
                  </IconButton>
                )}
              </Grid>
            </Grid>
          ))}
          {!isEditMode && (
            <Button startIcon={<AddCircleOutlineIcon />} onClick={addDetailRow} sx={{ mt: 1 }}>
              Add Detail Line
            </Button>
          )}

          <Divider sx={{ my: 3 }}><Chip label="Totals" /></Divider>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}><TextField InputProps={{readOnly: isEditMode}} name="total_earnings" label="Total Earnings" type="number" value={mainFormData.total_earnings === null || mainFormData.total_earnings === undefined ? '' : mainFormData.total_earnings} onChange={handleMainFormChange} fullWidth required /></Grid>
            <Grid item xs={12} sm={4}><TextField InputProps={{readOnly: isEditMode}} name="total_deductions" label="Total Deductions" type="number" value={mainFormData.total_deductions === null || mainFormData.total_deductions === undefined ? '' : mainFormData.total_deductions} onChange={handleMainFormChange} fullWidth required /></Grid>
            <Grid item xs={12} sm={4}><TextField InputProps={{readOnly: true}} name="net_pay" label="Net Pay" type="number" value={mainFormData.net_pay === null || mainFormData.net_pay === undefined ? '' : mainFormData.net_pay.toFixed(2)} fullWidth required /></Grid> {/* Net pay can still use toFixed(2) as it's readOnly */}
          </Grid>

          {submitError && <Alert severity="error" sx={{ mt: 3, mb: 2 }}>{submitError}</Alert>}
          {submitSuccess && <Alert severity="success" sx={{ mt: 3, mb: 2 }}>{isEditMode ? 'Payslip updated successfully!' : 'Payslip created successfully!'}</Alert>}

          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
            <Button type="submit" variant="contained" color="primary" disabled={submitting}>
              {submitting ? <CircularProgress size={24} /> : (isEditMode ? 'Update Payslip' : 'Create Payslip')}
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default PayslipFormPage;
