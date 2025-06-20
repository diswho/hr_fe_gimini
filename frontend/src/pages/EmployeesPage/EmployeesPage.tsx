import React, { useEffect, useState, useCallback } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Container, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Button, CircularProgress, Alert, IconButton, Box
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { EmployeesService, EmployeeInDB } from '../../services/api';

const ROWS_PER_PAGE = 10;

const EmployeesPage: React.FC = () => {
  const [employees, setEmployees] = useState<EmployeeInDB[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(0); // 0-indexed for skip calculation
  // We don't have total count from the API yet, so we'll disable 'Next' if fewer than ROWS_PER_PAGE are returned.
  const [canGoNext, setCanGoNext] = useState<boolean>(true);


  const fetchEmployees = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const skip = currentPage * ROWS_PER_PAGE;
      const response = await EmployeesService.readEmployeesApiV1EmployeesGet(skip, ROWS_PER_PAGE);
      setEmployees(response);
      // If the number of employees returned is less than ROWS_PER_PAGE, we're on the last page.
      setCanGoNext(response.length === ROWS_PER_PAGE);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch employees');
      console.error(err);
      setCanGoNext(false); // Disable next on error
    } finally {
      setLoading(false);
    }
  }, [currentPage]);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => Math.max(0, prevPage - 1));
  };

  if (loading && employees.length === 0) { // Show loading only on initial load or when employees are empty
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
      <Typography variant="h4" component="h1" gutterBottom>
        Employees Management
      </Typography>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="employees table">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Department ID</TableCell> {/* Assuming department_id for now */}
              <TableCell>Active</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {employees.length === 0 && !loading && (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No employees found.
                </TableCell>
              </TableRow>
            )}
            {employees.map((employee) => (
              <TableRow
                key={employee.id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {employee.emp_firstname}{employee.emp_lastname ? ` ${employee.emp_lastname}` : ''}
                </TableCell>
                <TableCell>{employee.emp_email || 'N/A'}</TableCell>
                <TableCell>{employee.emp_phone || 'N/A'}</TableCell>
                <TableCell>{employee.department_id !== null && employee.department_id !== undefined ? employee.department_id : 'N/A'}</TableCell>
                <TableCell>{employee.emp_active ? 'Yes' : 'No'}</TableCell>
                <TableCell>
                  <IconButton
                    component={RouterLink}
                    to={`/employees/${employee.id}`}
                    aria-label="edit employee"
                    size="small"
                  >
                    <EditIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
        <Button
          variant="contained"
          onClick={handlePreviousPage}
          disabled={currentPage === 0 || loading}
        >
          Previous
        </Button>
        <Typography variant="body1">
          Page {currentPage + 1}
        </Typography>
        <Button
          variant="contained"
          onClick={handleNextPage}
          disabled={!canGoNext || loading}
        >
          Next
        </Button>
      </Box>
    </Container>
  );
};

export default EmployeesPage;
