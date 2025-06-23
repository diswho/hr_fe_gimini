import React, { useEffect, useState, useCallback } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Container, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Button, CircularProgress, Alert, IconButton, Box
  Container, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Button, CircularProgress, Alert, IconButton, Box,
  Select, MenuItem, FormControl, InputLabel
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { EmployeesService, EmployeeInDB, DepartmentsService, Department } from '../../services/api';

const ROWS_PER_PAGE = 10;
const ALL_DEPARTMENTS_VALUE = ''; // Represents no filter or all departments

const EmployeesPage: React.FC = () => {
  const [employees, setEmployees] = useState<EmployeeInDB[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(0); // 0-indexed for skip calculation
  const [canGoNext, setCanGoNext] = useState<boolean>(true);

  const [departments, setDepartments] = useState<Department[]>([]);
  const [departmentLoading, setDepartmentLoading] = useState<boolean>(true);
  const [departmentError, setDepartmentError] = useState<string | null>(null);
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<string>(ALL_DEPARTMENTS_VALUE);

  // Fetch Departments
  useEffect(() => {
    const fetchDepartments = async () => {
      setDepartmentLoading(true);
      setDepartmentError(null);
      try {
        // Attempt to fetch all departments; adjust limit as necessary or implement pagination if too many
        const depts = await DepartmentsService.listDepartmentsApiV1DepartmentsGet(undefined, 1000);
        setDepartments(depts);
      } catch (err: any) {
        setDepartmentError(err.message || 'Failed to fetch departments');
        console.error(err);
      } finally {
        setDepartmentLoading(false);
      }
    };
    fetchDepartments();
  }, []);

  const fetchEmployees = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // For client-side filtering, we fetch a larger set of employees if a department is selected,
      // or use pagination if no department is selected.
      // This is a placeholder for a more robust strategy (ideally backend filtering).
      let allFetchedEmployees: EmployeeInDB[];
      if (selectedDepartmentId && selectedDepartmentId !== ALL_DEPARTMENTS_VALUE) {
        // Fetch all (or many) employees to filter by department client-side
        // This limit should be high enough, or this needs a different strategy for very large datasets
        allFetchedEmployees = await EmployeesService.readEmployeesApiV1EmployeesGet(0, 10000);
        // Client-side filter
        allFetchedEmployees = allFetchedEmployees.filter(emp => emp.department_id?.toString() === selectedDepartmentId);
      } else {
        // Standard pagination if no department filter
        const skip = currentPage * ROWS_PER_PAGE;
        allFetchedEmployees = await EmployeesService.readEmployeesApiV1EmployeesGet(skip, ROWS_PER_PAGE);
      }

      // Apply pagination to the (potentially filtered) list
      const paginatedEmployees = allFetchedEmployees.slice(
        currentPage * ROWS_PER_PAGE,
        (currentPage + 1) * ROWS_PER_PAGE
      );
      setEmployees(paginatedEmployees);

      // Determine if there's a next page based on the full filtered list
      setCanGoNext(allFetchedEmployees.length > (currentPage + 1) * ROWS_PER_PAGE);

    } catch (err: any) {
      setError(err.message || 'Failed to fetch employees');
      console.error(err);
      setCanGoNext(false);
    } finally {
      setLoading(false);
    }
  }, [currentPage, selectedDepartmentId]);

  // Reset to page 0 when department filter changes
  useEffect(() => {
    setCurrentPage(0);
  }, [selectedDepartmentId]);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]); // Will re-run if currentPage or selectedDepartmentId changes (due to fetchEmployees dependency)

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

      <Box sx={{ mb: 2 }}>
        <FormControl fullWidth disabled={departmentLoading || !!departmentError}>
          <InputLabel id="department-filter-label">Filter by Department</InputLabel>
          <Select
            labelId="department-filter-label"
            id="department-filter-select"
            value={selectedDepartmentId}
            label="Filter by Department"
            onChange={(e) => setSelectedDepartmentId(e.target.value as string)}
          >
            <MenuItem value={ALL_DEPARTMENTS_VALUE}>
              <em>All Departments</em>
            </MenuItem>
            {departments.map((dept) => (
              <MenuItem key={dept.id} value={dept.id?.toString() || ''}>
                {dept.dept_name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        {departmentLoading && <Typography sx={{mt: 1}} variant="body2">Loading departments...</Typography>}
        {departmentError && <Alert severity="error" sx={{mt: 1}}>Failed to load departments: {departmentError}</Alert>}
      </Box>

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
