import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container, Typography, TextField, Button, CircularProgress, Alert, Box, Paper, Grid
} from '@mui/material';
import { EmployeesService, EmployeeInDB, EmployeeUpdate } from '../../services/api';

const EmployeeDetailPage: React.FC = () => {
  const { employee_id } = useParams<{ employee_id: string }>();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState<EmployeeInDB | null>(null);
  const [formData, setFormData] = useState<Partial<EmployeeUpdate>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [updateSuccess, setUpdateSuccess] = useState<boolean>(false);
  const [updateError, setUpdateError] = useState<string | null>(null);

  useEffect(() => {
    if (employee_id) {
      const fetchEmployee = async () => {
        setLoading(true);
        setError(null);
        setUpdateSuccess(false);
        setUpdateError(null);
        try {
          const numericEmployeeId = parseInt(employee_id, 10);
          if (isNaN(numericEmployeeId)) {
            setError("Invalid employee ID provided.");
            setLoading(false);
            return;
          }
          const response = await EmployeesService.readEmployeeApiV1EmployeesEmployeeIdGet(numericEmployeeId);
          setEmployee(response);
          // Initialize formData with existing employee data
          // Ensure all fields from EmployeeUpdate are considered, even if optional
          setFormData({
            emp_pin: response.emp_pin || undefined,
            emp_ssn: response.emp_ssn || undefined,
            emp_role: response.emp_role || undefined,
            emp_firstname: response.emp_firstname, // Required
            emp_lastname: response.emp_lastname || undefined,
            emp_username: response.emp_username || undefined,
            emp_pwd: response.emp_pwd || undefined, // Not typically edited directly
            emp_email: response.emp_email || undefined,
            emp_timezone: response.emp_timezone || undefined,
            emp_phone: response.emp_phone || undefined,
            emp_payroll_id: response.emp_payroll_id || undefined,
            emp_payroll_type: response.emp_payroll_type || undefined,
            emp_pin2: response.emp_pin2 || undefined,
            // emp_photo: response.emp_photo, // Handle file uploads separately if needed
            emp_privilege: response.emp_privilege || undefined,
            emp_group: response.emp_group || undefined,
            emp_hiredate: response.emp_hiredate ? response.emp_hiredate.substring(0,10) : undefined, // Assuming YYYY-MM-DD
            emp_address: response.emp_address || undefined,
            emp_active: response.emp_active,
            emp_firedate: response.emp_firedate ? response.emp_firedate.substring(0,10) : undefined, // Assuming YYYY-MM-DD
            emp_firereason: response.emp_firereason || undefined,
            department_id: response.department_id !== null ? response.department_id : undefined,
            position_id: response.position_id !== null ? response.position_id : undefined,
            manager_id: response.manager_id !== null ? response.manager_id : undefined,
            status: response.status || undefined,
          });
        } catch (err: any) {
          setError(err.message || 'Failed to fetch employee data.');
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
      fetchEmployee();
    } else {
      setError("No employee ID provided.");
      setLoading(false);
    }
  }, [employee_id]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = event.target;
    // Handle checkbox type for emp_active
    const val = type === 'checkbox' ? (event.target as HTMLInputElement).checked : value;
    setFormData(prev => ({ ...prev, [name]: val === '' ? undefined : val }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!employee_id) return;

    setIsUpdating(true);
    setUpdateSuccess(false);
    setUpdateError(null);

    // Construct the EmployeeUpdate object, ensuring required fields are present
    // emp_firstname is required in EmployeeUpdate
    if (!formData.emp_firstname) {
        setUpdateError("First name is required.");
        setIsUpdating(false);
        return;
    }

    const updatePayload: EmployeeUpdate = {
        ...formData,
        emp_firstname: formData.emp_firstname, // Ensure it's passed even if unchanged
        // Convert date strings back to full ISO strings or whatever format API expects if necessary
        // For now, assuming API accepts YYYY-MM-DD for date fields if they are just dates.
        // If they are datetimes, further conversion might be needed.
         emp_hiredate: formData.emp_hiredate ? new Date(formData.emp_hiredate).toISOString() : undefined,
         emp_firedate: formData.emp_firedate ? new Date(formData.emp_firedate).toISOString() : undefined,
    };


    try {
      const numericEmployeeId = parseInt(employee_id, 10);
      await EmployeesService.updateEmployeeApiV1EmployeesEmployeeIdPut(numericEmployeeId, updatePayload);
      setUpdateSuccess(true);
      // Optionally re-fetch employee data or update local state
      // For now, just show success message. User can navigate back or page can auto-redirect.
    } catch (err: any) {
      setUpdateError(err.message || 'Failed to update employee.');
      if (err.body && err.body.detail) {
        setUpdateError(JSON.stringify(err.body.detail));
      }
      console.error(err);
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading) {
    return <Container sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Container>;
  }

  if (error) {
    return <Container sx={{ mt: 4 }}><Alert severity="error">{error}</Alert></Container>;
  }

  if (!employee) {
    return <Container sx={{ mt: 4 }}><Alert severity="info">No employee data found.</Alert></Container>;
  }

  return (
    <Container sx={{ mt: 2 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Edit Employee: {employee.emp_firstname} {employee.emp_lastname || ''}
        </Typography>
        <Button variant="outlined" onClick={() => navigate(-1)} sx={{ mb: 2 }}>
            Back to List
        </Button>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item sx={{ width: '100%', sm: { flexBasis: '50%', maxWidth: '50%' } }}>
              <TextField name="emp_firstname" label="First Name" value={formData.emp_firstname || ''} onChange={handleChange} fullWidth required />
            </Grid>
            <Grid item sx={{ width: '100%', sm: { flexBasis: '50%', maxWidth: '50%' } }}>
              <TextField name="emp_lastname" label="Last Name" value={formData.emp_lastname || ''} onChange={handleChange} fullWidth />
            </Grid>
            <Grid item sx={{ width: '100%', sm: { flexBasis: '50%', maxWidth: '50%' } }}>
              <TextField name="emp_email" label="Email" type="email" value={formData.emp_email || ''} onChange={handleChange} fullWidth />
            </Grid>
            <Grid item sx={{ width: '100%', sm: { flexBasis: '50%', maxWidth: '50%' } }}>
              <TextField name="emp_phone" label="Phone" value={formData.emp_phone || ''} onChange={handleChange} fullWidth />
            </Grid>
            <Grid item sx={{ width: '100%', sm: { flexBasis: '50%', maxWidth: '50%' } }}>
              <TextField name="emp_role" label="Role" value={formData.emp_role || ''} onChange={handleChange} fullWidth />
            </Grid>
             <Grid item sx={{ width: '100%', sm: { flexBasis: '50%', maxWidth: '50%' } }}>
              <TextField name="department_id" label="Department ID" type="number" value={formData.department_id === undefined ? '' : formData.department_id} onChange={handleChange} fullWidth
                onWheel={(e) => (e.target as HTMLElement).blur()} // Prevent scroll from changing number
              />
            </Grid>
            <Grid item sx={{ width: '100%', sm: { flexBasis: '50%', maxWidth: '50%' } }}>
              <TextField name="emp_hiredate" label="Hire Date" type="date" value={formData.emp_hiredate || ''} onChange={handleChange} fullWidth InputLabelProps={{ shrink: true }} />
            </Grid>
            <Grid item sx={{ width: '100%', sm: { flexBasis: '50%', maxWidth: '50%' } }}>
              <TextField name="emp_active" label="Active" select SelectProps={{ native: true }} value={formData.emp_active ? 'true' : 'false'} onChange={handleChange} fullWidth>
                <option value="true">Yes</option>
                <option value="false">No</option>
              </TextField>
            </Grid>
            {/* Add more fields as necessary, e.g., address, status, etc. */}
             <Grid item sx={{ width: '100%' }}>
                <TextField name="emp_address" label="Address" value={formData.emp_address || ''} onChange={handleChange} fullWidth multiline rows={3} />
            </Grid>
          </Grid>

          {updateError && <Alert severity="error" sx={{ mt: 2 }}>{updateError}</Alert>}
          {updateSuccess && <Alert severity="success" sx={{ mt: 2 }}>Employee updated successfully!</Alert>}

          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
            <Button type="submit" variant="contained" color="primary" disabled={isUpdating}>
              {isUpdating ? <CircularProgress size={24} /> : 'Update Employee'}
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default EmployeeDetailPage;
