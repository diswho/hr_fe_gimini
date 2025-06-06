import React, { useEffect, useState, useCallback } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Container, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Button, CircularProgress, Alert, IconButton, Box, Tooltip
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { LeaveService, LeaveInDB, LeaveStatus } from '../../services/api'; // Assuming LeaveStatus is exported

const LeavePage: React.FC = () => {
  const [leaves, setLeaves] = useState<LeaveInDB[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [approveError, setApproveError] = useState<string | null>(null);
  const [approveSuccess, setApproveSuccess] = useState<string | null>(null);

  const fetchLeaves = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // TODO: Add filtering options for employeeId and status if needed
      const response = await LeaveService.readLeavesApiV1LeaveGet(0, 100, undefined, undefined);
      setLeaves(response);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch leave requests');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLeaves();
  }, [fetchLeaves]);

  const handleApprove = async (leaveId: number) => {
    setApproveError(null);
    setApproveSuccess(null);
    try {
      await LeaveService.approveLeaveApiV1LeaveLeaveIdApprovePost(leaveId);
      setApproveSuccess(`Leave request ID ${leaveId} approved successfully.`);
      // Refresh the list to show updated status
      fetchLeaves();
    } catch (err: any) {
      const errorMsg = err.body?.detail || err.message || `Failed to approve leave request ID ${leaveId}`;
      setApproveError(errorMsg);
      console.error(err);
    }
  };

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container sx={{ mt: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4" component="h1">
          Leave Management
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          component={RouterLink}
          to="/leave/new"
        >
          Create Leave Request
        </Button>
      </Box>

      {approveError && <Alert severity="error" sx={{ mb: 2 }}>{approveError}</Alert>}
      {approveSuccess && <Alert severity="success" sx={{ mb: 2 }}>{approveSuccess}</Alert>}

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="leave requests table">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Employee ID</TableCell>
              <TableCell>Start Date</TableCell>
              <TableCell>End Date</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Approver ID</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {leaves.length === 0 && !loading && (
                <TableRow>
                    <TableCell colSpan={8} align="center">
                    No leave requests found.
                    </TableCell>
                </TableRow>
            )}
            {leaves.map((leave) => (
              <TableRow key={leave.id}>
                <TableCell>{leave.id}</TableCell>
                <TableCell>{leave.employee_id}</TableCell>
                <TableCell>{new Date(leave.start_date).toLocaleDateString()}</TableCell>
                <TableCell>{new Date(leave.end_date).toLocaleDateString()}</TableCell>
                <TableCell>{leave.leave_type}</TableCell>
                <TableCell>{leave.status}</TableCell>
                <TableCell>{leave.approver_id ?? 'N/A'}</TableCell>
                <TableCell>
                  <Tooltip title="Edit Leave Request">
                    <IconButton
                      component={RouterLink}
                      to={`/leave/${leave.id}/edit`}
                      aria-label="edit leave request"
                    >
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  {leave.status === LeaveStatus.PENDING && ( // Only show approve for pending
                    <Tooltip title="Approve Leave Request">
                      <IconButton
                        onClick={() => handleApprove(leave.id)}
                        aria-label="approve leave request"
                        color="success"
                      >
                        <CheckCircleOutlineIcon />
                      </IconButton>
                    </Tooltip>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default LeavePage;
