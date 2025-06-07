import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container, Typography, TextField, Button, CircularProgress, Alert,
  Box, Paper, Grid, MenuItem
} from '@mui/material';
// For date pickers, assuming you might add @mui/x-date-pickers and an adapter later
// For now, using TextField type="date"
// import { DatePicker } from '@mui/x-date-pickers/DatePicker';
// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'; // or AdapterDayjs, etc.

import { LeaveService, LeaveCreate, LeaveUpdate, LeaveInDB, LeaveStatus } from '../../services/api';

const leaveTypes = ["ANNUAL", "SICK", "UNPAID", "MATERNITY", "PATERNITY", "OTHER"]; // Example leave types

const LeaveFormPage: React.FC = () => {
  const { leave_id } = useParams<{ leave_id?: string }>();
  const navigate = useNavigate();
  const isEditMode = Boolean(leave_id);

  const [leaveData, setLeaveData] = useState<LeaveCreate | LeaveUpdate>({
    employee_id: 0, // Default or fetch from logged in user context later
    start_date: '',
    end_date: '',
    leave_type: leaveTypes[0], // Default to first type
    reason: '',
    status: LeaveStatus.PENDING, // Default status for new requests
    approver_id: undefined, // Or pre-fill if applicable
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);

  const fetchLeaveRequest = useCallback(async (id: number) => {
    setLoading(true);
    try {
      const response: LeaveInDB = await LeaveService.readLeavesApiV1LeaveGet(undefined, undefined, undefined, undefined) // This is wrong, need specific get by ID if available
                                      .then(leaves => leaves.find(l => l.id === id) as LeaveInDB); // Temporary workaround
      // The generated client does not have a getLeaveById, so we filter from all. This is inefficient.
      // Ideally, the backend would provide a /api/v1/leave/{leave_id} GET endpoint.
      if (response) {
        setLeaveData({
          ...response,
          start_date: response.start_date.substring(0,10), // Assuming YYYY-MM-DD
          end_date: response.end_date.substring(0,10), // Assuming YYYY-MM-DD
        });
      } else {
        setSubmitError(`Leave request with ID ${id} not found.`);
      }
    } catch (err: any) {
      setSubmitError(err.message || 'Failed to fetch leave request data.');
    } finally {
      setLoading(false);
    }
  }, []);


  useEffect(() => {
    if (isEditMode && leave_id) {
      const numericId = parseInt(leave_id, 10);
      if (!isNaN(numericId)) {
        // For now, there's no direct getLeaveById in LeaveService.ts
        // This is a placeholder for that logic.
        // A real app would need a specific endpoint or adjust `readLeavesApiV1LeaveGet`
        console.warn("Attempting to edit, but no direct getLeaveById method. Fetching all and filtering.");
        fetchLeaveRequest(numericId);
      } else {
        setSubmitError("Invalid leave ID for editing.");
      }
    }
  }, [isEditMode, leave_id, fetchLeaveRequest]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setLeaveData(prev => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (name: string, date: Date | null) => {
    if (date) {
      // Format date to YYYY-MM-DD for TextField type="date"
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      setLeaveData(prev => ({ ...prev, [name]: `${year}-${month}-${day}` }));
    } else {
      setLeaveData(prev => ({ ...prev, [name]: ''}));
    }
  };


  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    // Basic validation
    if (!leaveData.employee_id || !leaveData.start_date || !leaveData.end_date || !leaveData.leave_type) {
        setSubmitError("Please fill in all required fields (Employee ID, Start Date, End Date, Leave Type).");
        setLoading(false);
        return;
    }

    // Ensure dates are in ISO format if API expects full datetime, otherwise YYYY-MM-DD is fine
    const payload = {
        ...leaveData,
        employee_id: Number(leaveData.employee_id), // Ensure employee_id is number
        approver_id: leaveData.approver_id ? Number(leaveData.approver_id) : undefined,
        // start_date: new Date(leaveData.start_date).toISOString(), // If API needs full ISO
        // end_date: new Date(leaveData.end_date).toISOString(), // If API needs full ISO
    };

    try {
      if (isEditMode && leave_id) {
        await LeaveService.updateLeaveApiV1LeaveLeaveIdPut(parseInt(leave_id, 10), payload as LeaveUpdate);
      } else {
        await LeaveService.createLeaveApiV1LeavePost(payload as LeaveCreate);
      }
      setSubmitSuccess(true);
      setTimeout(() => navigate('/leave'), 1500); // Redirect after a short delay
    } catch (err: any) {
      const errorDetail = err.body?.detail;
      if (Array.isArray(errorDetail)) { // FastAPI validation errors
        const messages = errorDetail.map(detail => `${detail.loc.join('.')}: ${detail.msg}`).join('; ');
        setSubmitError(messages);
      } else if (typeof errorDetail === 'string') {
        setSubmitError(errorDetail);
      }
      else {
        setSubmitError(err.message || (isEditMode ? 'Failed to update leave request.' : 'Failed to create leave request.'));
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // If using @mui/x-date-pickers
  // return (
  //   <LocalizationProvider dateAdapter={AdapterDateFns}>
  //     ... form content ...
  //   </LocalizationProvider>
  // );

  return (
    <Container sx={{ mt: 2 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {isEditMode ? 'Edit Leave Request' : 'Create Leave Request'}
        </Typography>
        <Button variant="outlined" onClick={() => navigate('/leave')} sx={{ mb: 2 }}>
          Back to List
        </Button>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item sx={{ width: '100%', sm: { flexBasis: '50%', maxWidth: '50%' } }}>
              <TextField
                name="employee_id"
                label="Employee ID"
                type="number"
                value={leaveData.employee_id || ''}
                onChange={handleChange}
                fullWidth
                required
                disabled={isEditMode} // Usually Employee ID is not editable
              />
            </Grid>
            <Grid item sx={{ width: '100%', sm: { flexBasis: '50%', maxWidth: '50%' } }}>
              <TextField
                name="leave_type"
                label="Leave Type"
                select
                value={leaveData.leave_type}
                onChange={handleChange}
                fullWidth
                required
              >
                {leaveTypes.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item sx={{ width: '100%', sm: { flexBasis: '50%', maxWidth: '50%' } }}>
              <TextField
                name="start_date"
                label="Start Date"
                type="date"
                value={leaveData.start_date}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                fullWidth
                required
              />
            </Grid>
            <Grid item sx={{ width: '100%', sm: { flexBasis: '50%', maxWidth: '50%' } }}>
              <TextField
                name="end_date"
                label="End Date"
                type="date"
                value={leaveData.end_date}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                fullWidth
                required
              />
            </Grid>
            <Grid item sx={{ width: '100%' }}>
              <TextField
                name="reason"
                label="Reason"
                multiline
                rows={3}
                value={leaveData.reason || ''}
                onChange={handleChange}
                fullWidth
              />
            </Grid>
            <Grid item sx={{ width: '100%', sm: { flexBasis: '50%', maxWidth: '50%' } }}>
               <TextField
                name="status"
                label="Status"
                select
                value={leaveData.status}
                onChange={handleChange}
                fullWidth
                // Consider making this read-only or conditionally disabled based on workflow/permissions
                // disabled={isEditMode} // Example: disable status editing for existing requests
              >
                {Object.values(LeaveStatus).map((statusVal) => (
                  <MenuItem key={statusVal} value={statusVal}>
                    {statusVal}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item sx={{ width: '100%', sm: { flexBasis: '50%', maxWidth: '50%' } }}>
              <TextField
                name="approver_id"
                label="Approver ID (Optional)"
                type="number"
                value={leaveData.approver_id || ''}
                onChange={handleChange}
                fullWidth
              />
            </Grid>
          </Grid>

          {submitError && <Alert severity="error" sx={{ mt: 3, mb: 2 }}>{submitError}</Alert>}
          {submitSuccess && <Alert severity="success" sx={{ mt: 3, mb: 2 }}>{isEditMode ? 'Leave request updated successfully!' : 'Leave request created successfully!'}</Alert>}

          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
            <Button type="submit" variant="contained" color="primary" disabled={loading}>
              {loading ? <CircularProgress size={24} /> : (isEditMode ? 'Update Request' : 'Create Request')}
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default LeaveFormPage;
