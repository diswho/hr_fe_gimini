import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container, Typography, TextField, Button, CircularProgress, Alert,
  Box, Paper, Grid
} from '@mui/material';
import {
  HrEmployeeSalariesService,
  EmployeeSalaryCreate,
  EmployeeSalaryUpdate,
  EmployeeSalaryInDB,
  // For dropdowns - future enhancement:
  // EmployeesService, EmployeeInDB,
  // HrSalaryComponentsService, SalaryComponentInDB
} from '../../services/api';

const EmployeeSalaryFormPage: React.FC = () => {
  const { employee_salary_id } = useParams<{ employee_salary_id?: string }>();
  const navigate = useNavigate();
  const isEditMode = Boolean(employee_salary_id);

  const [formData, setFormData] = useState<Partial<EmployeeSalaryCreate | EmployeeSalaryUpdate>>({
    // Initialize with undefined or null for better type handling with Partial
    employee_id: undefined,
    component_id: undefined,
    amount: undefined,
    effective_date: '',
    end_date: null,
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);

  const fetchEmployeeSalaryRecord = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const response: EmployeeSalaryInDB = await HrEmployeeSalariesService.readEmployeeSalaryApiV1HrEmployeeSalariesEmployeeSalaryIdGet(id);
      setFormData({
        employee_id: response.employee_id,
        component_id: response.component_id,
        amount: response.amount,
        effective_date: response.effective_date.substring(0,10),
        end_date: response.end_date ? response.end_date.substring(0,10) : null,
      });
    } catch (err: any) {
      setError(err.message || 'Failed to fetch employee salary record.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isEditMode && employee_salary_id) {
      const numericId = parseInt(employee_salary_id, 10);
      if (!isNaN(numericId)) {
        fetchEmployeeSalaryRecord(numericId);
      } else {
        setError("Invalid employee salary record ID.");
      }
    }
  }, [isEditMode, employee_salary_id, fetchEmployeeSalaryRecord]);


  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    let processedValue: string | number | null | undefined = value;

    if (name === 'employee_id' || name === 'component_id' || name === 'amount') {
      processedValue = value === '' ? null : Number(value); // Store as number or null
    } else if (name === 'end_date' && value === '') {
      processedValue = null;
    }

    setFormData(prev => ({
      ...prev,
      [name]: processedValue
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    if (!formData.effective_date) {
        setSubmitError("Effective Date is required.");
        setSubmitting(false);
        return;
    }
    // Validate required number fields
    if (typeof formData.employee_id !== 'number' || formData.employee_id <= 0) {
        setSubmitError("Employee ID must be a valid positive number.");
        setSubmitting(false);
        return;
    }
    if (typeof formData.component_id !== 'number' || formData.component_id <= 0) {
        setSubmitError("Component ID must be a valid positive number.");
        setSubmitting(false);
        return;
    }
     if (typeof formData.amount !== 'number' || formData.amount < 0) { // Amount can be 0
        setSubmitError("Amount must be a valid number (0 or positive).");
        setSubmitting(false);
        return;
    }

    // Construct payload ensuring all required fields for the specific action (Create/Update) are present
    // EmployeeSalaryCreate requires: employee_id, component_id, amount, effective_date
    // EmployeeSalaryUpdate allows partials, but here we send all editable fields
    const payload: EmployeeSalaryCreate | EmployeeSalaryUpdate = {
      employee_id: formData.employee_id, // Already Number
      component_id: formData.component_id, // Already Number
      amount: formData.amount, // Already Number
      effective_date: formData.effective_date,
      end_date: formData.end_date || null,
    };

    try {
      if (isEditMode && employee_salary_id) {
        // For update, ensure you are sending a valid EmployeeSalaryUpdate object.
        // If some fields are truly optional for update and not present in formData, they won't be sent.
        await HrEmployeeSalariesService.updateEmployeeSalaryApiV1HrEmployeeSalariesEmployeeSalaryIdPut(parseInt(employee_salary_id, 10), payload as EmployeeSalaryUpdate);
      } else {
        // For create, ensure all required fields of EmployeeSalaryCreate are present.
        await HrEmployeeSalariesService.createEmployeeSalaryApiV1HrEmployeeSalariesPost(payload as EmployeeSalaryCreate);
      }
      setSubmitSuccess(true);
      setTimeout(() => navigate('/employee-salaries'), 1500);
    } catch (err: any) { // Corrected: Added opening brace
      const errorDetail = err.body?.detail;
      if (Array.isArray(errorDetail)) {
        const messages = errorDetail.map(detail => `${detail.loc.join('.')}: ${detail.msg}`).join('; ');
        setSubmitError(messages);
      } else if (typeof errorDetail === 'string') {
        setSubmitError(errorDetail);
      } else {
        setSubmitError(err.message || (isEditMode ? 'Failed to update record.' : 'Failed to create record.'));
      }
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading && isEditMode) { // loading state is defined
    return <Container sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Container>;
  }

  if (error) { // error state is defined
    return <Container sx={{ mt: 4 }}><Alert severity="error">{error}</Alert></Container>;
  }

  return (
    <Container sx={{ mt: 2 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {isEditMode ? 'Edit Employee Salary Record' : 'Create Employee Salary Record'} {/* isEditMode is defined */}
        </Typography>
        <Button variant="outlined" onClick={() => navigate('/employee-salaries')} sx={{ mb: 2 }}>
          Back to List
        </Button>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item sx={{ width: '100%', sm: { flexBasis: '50%', maxWidth: '50%' } }}>
              <TextField
                name="employee_id"
                label="Employee ID"
                type="number"
                value={formData.employee_id === undefined || formData.employee_id === null ? '' : formData.employee_id}
                onChange={handleChange}
                fullWidth
                required
                InputProps={{ inputProps: { min: 1 } }}
              />
            </Grid>
            <Grid item sx={{ width: '100%', sm: { flexBasis: '50%', maxWidth: '50%' } }}>
              <TextField
                name="component_id"
                label="Salary Component ID"
                type="number"
                value={formData.component_id === undefined || formData.component_id === null ? '' : formData.component_id}
                onChange={handleChange}
                fullWidth
                required
                InputProps={{ inputProps: { min: 1 } }}
              />
            </Grid>
            <Grid item sx={{ width: '100%', sm: { flexBasis: '50%', maxWidth: '50%' } }}>
              <TextField
                name="amount"
                label="Amount"
                type="number"
                value={formData.amount === undefined || formData.amount === null ? '' : formData.amount}
                onChange={handleChange}
                fullWidth
                required
                InputProps={{ inputProps: { step: "0.01", min:0 } }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="effective_date"
                label="Effective Date"
                type="date"
                value={formData.effective_date || ''}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="end_date"
                label="End Date (Optional)"
                type="date"
                value={formData.end_date || ''}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                fullWidth
              />
            </Grid>
          </Grid>

          {submitError && <Alert severity="error" sx={{ mt: 3, mb: 2 }}>{submitError}</Alert>}
          {submitSuccess && <Alert severity="success" sx={{ mt: 3, mb: 2 }}>{isEditMode ? 'Record updated successfully!' : 'Record created successfully!'}</Alert>}

          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
            <Button type="submit" variant="contained" color="primary" disabled={submitting}>
              {submitting ? <CircularProgress size={24} /> : (isEditMode ? 'Update Record' : 'Create Record')}
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
}; // Make sure this is the correct closing for the component

export default EmployeeSalaryFormPage;
