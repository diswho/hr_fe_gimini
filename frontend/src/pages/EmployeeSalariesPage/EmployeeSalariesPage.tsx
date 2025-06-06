import React, { useEffect, useState, useCallback } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Container, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Button, CircularProgress, Alert, IconButton, Box, Tooltip,
  Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { HrEmployeeSalariesService, EmployeeSalaryInDB } from '../../services/api';

const EmployeeSalariesPage: React.FC = () => {
  const [salaries, setSalaries] = useState<EmployeeSalaryInDB[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [deleteSuccess, setDeleteSuccess] = useState<string | null>(null);

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [salaryToDelete, setSalaryToDelete] = useState<EmployeeSalaryInDB | null>(null);

  const fetchEmployeeSalaries = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await HrEmployeeSalariesService.readEmployeeSalariesApiV1HrEmployeeSalariesGet(0, 200);
      setSalaries(response);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch employee salaries');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEmployeeSalaries();
  }, [fetchEmployeeSalaries]);

  const handleDeleteClick = (salary: EmployeeSalaryInDB) => {
    setSalaryToDelete(salary);
    setOpenDeleteDialog(true);
    setDeleteError(null);
    setDeleteSuccess(null);
  };

  const handleDeleteConfirm = async () => {
    if (!salaryToDelete) return;
    try {
      await HrEmployeeSalariesService.deleteEmployeeSalaryApiV1HrEmployeeSalariesEmployeeSalaryIdDelete(salaryToDelete.id);
      setDeleteSuccess(`Employee salary record (ID: ${salaryToDelete.id}) deleted successfully.`);
      fetchEmployeeSalaries();
    } catch (err: any) {
      const errorMsg = err.body?.detail || err.message || `Failed to delete salary record ID ${salaryToDelete.id}`;
      setDeleteError(errorMsg);
      console.error(err);
    } finally {
      setOpenDeleteDialog(false);
      setSalaryToDelete(null);
    }
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setSalaryToDelete(null);
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
          Employee Salary Records
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          component={RouterLink}
          to="/employee-salaries/new"
        >
          Assign Salary Component
        </Button>
      </Box>

      {deleteError && <Alert severity="error" sx={{ mb: 2 }}>{deleteError}</Alert>}
      {deleteSuccess && <Alert severity="success" sx={{ mb: 2 }}>{deleteSuccess}</Alert>}

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="employee salaries table">
          <TableHead>
            <TableRow>
              <TableCell>Record ID</TableCell>
              <TableCell>Employee ID</TableCell>
              <TableCell>Component ID</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Effective Date</TableCell>
              <TableCell>End Date</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {salaries.length === 0 && !loading && (
              <TableRow><TableCell colSpan={7} align="center">No employee salary records found.</TableCell></TableRow>
            )}
            {salaries.map((salary) => (
              <TableRow key={salary.id}>
                <TableCell>{salary.id}</TableCell>
                <TableCell>{salary.employee_id}</TableCell>
                <TableCell>{salary.component_id}</TableCell>
                <TableCell>{salary.amount}</TableCell>
                <TableCell>{formatDate(salary.effective_date)}</TableCell>
                <TableCell>{formatDate(salary.end_date)}</TableCell>
                <TableCell>
                  <Tooltip title="Edit Record">
                    <IconButton component={RouterLink} to={`/employee-salaries/${salary.id}/edit`} aria-label="edit employee salary">
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete Record">
                    <IconButton onClick={() => handleDeleteClick(salary)} aria-label="delete employee salary" color="error">
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this employee salary record (ID: {salaryToDelete?.id})? This action cannot be undone.
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

export default EmployeeSalariesPage;
