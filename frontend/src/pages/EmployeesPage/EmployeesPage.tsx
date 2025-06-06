import React, { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Container, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Button, CircularProgress, Alert, IconButton
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { EmployeesService, EmployeeInDB } from '../../services/api';

const EmployeesPage: React.FC = () => {
  const [employees, setEmployees] = useState<EmployeeInDB[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEmployees = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await EmployeesService.readEmployeesApiV1EmployeesGet(0, 100); // Default skip 0, limit 100
        setEmployees(response);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch employees');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

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
                  >
                    <EditIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default EmployeesPage;
