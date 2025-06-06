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

  const [formData, setFormData] = useState<EmployeeSalaryCreate | EmployeeSalaryUpdate>({
    employee_id: 0,
    component_id: 0,
    amount: 0,
    effective_date: '',
    end_date: null, // Optional
  });

  // States for future enhancement (dropdowns)
  // const [employees, setEmployees] = useState<EmployeeInDB[]>([]);
  // const [salaryComponents, setSalaryComponents] = useState<SalaryComponentInDB[]>([]);

  const [loading, setLoading] = useState<boolean>(false); // For page load in edit mode
  const [submitting, setSubmitting] = useState<boolean>(false); // For form submission
  const [error, setError] = useState<string | null>(null); // For page load error
  const [submitError, setSubmitError] = useState<string | null>(null); // For form submission error
  const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);

  // Fetch existing record for edit mode
  const fetchEmployeeSalaryRecord = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const response: EmployeeSalaryInDB = await HrEmployeeSalariesService.readEmployeeSalaryApiV1HrEmployeeSalariesEmployeeSalaryIdGet(id);
      setFormData({
        employee_id: response.employee_id,
        component_id: response.component_id,
        amount: response.amount,
        effective_date: response.effective_date.substring(0,10), // Format YYYY-MM-DD for date input
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
    // Future: Fetch employees and salary components for dropdowns here
    // fetchEmployeesForDropdown();
    // fetchSalaryComponentsForDropdown();
  }, [isEditMode, employee_salary_id, fetchEmployeeSalaryRecord]);


  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setFormData(prev => ({
      ...prev,
      [name]: value === '' && (name === 'employee_id' || name === 'component_id' || name === 'amount')
              ? 0 // Or handle as per validation needs, perhaps '' and parse later
              : (name === 'end_date' && value === '' ? null : value)
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
    if (formData.employee_id <= 0 || formData.component_id <= 0) {
        setSubmitError("Employee ID and Component ID must be valid positive numbers.");
        setSubmitting(false);
        return;
    }

    const payload: EmployeeSalaryCreate | EmployeeSalaryUpdate = {
      ...formData,
      employee_id: Number(formData.employee_id),
      component_id: Number(formData.component_id),
      amount: Number(formData.amount),
      // Ensure dates are in the correct format if API is strict (YYYY-MM-DD is usually fine for date types)
      effective_date: formData.effective_date, // Already YYYY-MM-DD
      end_date: formData.end_date || null, // API expects null for empty optional date
    };

    try {
      if (isEditMode && employee_salary_id) {
        await HrEmployeeSalariesService.updateEmployeeSalaryApiV1HrEmployeeSalariesEmployeeSalaryIdPut(parseInt(employee_salary_id, 10), payload as EmployeeSalaryUpdate);
      } else {
        await HrEmployeeSalariesService.createEmployeeSalaryApiV1HrEmployeeSalariesPost(payload as EmployeeSalaryCreate);
      }
      setSubmitSuccess(true);
      setTimeout(() => navigate('/employee-salaries'), 1500);
    } catch (err: any)      const errorDetail = err.body?.detail;
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

  if (loading && isEditMode) {
    return <Container sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Container>;
  }

  if (error) {
    return <Container sx={{ mt: 4 }}><Alert severity="error">{error}</Alert></Container>;
  }

  return (
    <Container sx={{ mt: 2 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {isEditMode ? 'Edit Employee Salary Record' : 'Create Employee Salary Record'}
        </Typography>
        <Button variant="outlined" onClick={() => navigate('/employee-salaries')} sx={{ mb: 2 }}>
          Back to List
        </Button>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                name="employee_id"
                label="Employee ID"
                type="number"
                value={formData.employee_id || ''}
                onChange={handleChange}
                fullWidth
                required
                InputProps={{ inputProps: { min: 1 } }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="component_id"
                label="Salary Component ID"
                type="number"
                value={formData.component_id || ''}
                onChange={handleChange}
                fullWidth
                required
                InputProps={{ inputProps: { min: 1 } }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="amount"
                label="Amount"
                type="number"
                value={formData.amount || ''}
                onChange={handleChange}
                fullWidth
                required
                InputProps={{ inputProps: { step: "0.01" }}}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="effective_date"
                label="Effective Date"
                type="date"
                value={formData.effective_date}
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
};

export default EmployeeSalaryFormPage;
