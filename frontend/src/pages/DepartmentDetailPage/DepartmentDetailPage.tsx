import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container, Typography, CircularProgress, Alert, Paper, Box, Button, Grid, List, ListItem, ListItemText
} from '@mui/material';
import { DepartmentsService, Department } from '../../services/api';

const DepartmentDetailPage: React.FC = () => {
  const { department_id } = useParams<{ department_id: string }>();
  const navigate = useNavigate();
  const [department, setDepartment] = useState<Department | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (department_id) {
      const fetchDepartment = async () => {
        setLoading(true);
        setError(null);
        try {
          const numericId = parseInt(department_id, 10);
          if (isNaN(numericId)) {
            setError("Invalid department ID.");
            setLoading(false);
            return;
          }
          const response = await DepartmentsService.getDepartmentApiV1DepartmentsDepartmentIdGet(numericId);
          setDepartment(response);
        } catch (err: any) {
          setError(err.message || 'Failed to fetch department data.');
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
      fetchDepartment();
    } else {
        setError("No department ID provided.");
        setLoading(false);
    }
  }, [department_id]);

  if (loading) {
    return <Container sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Container>;
  }

  if (error) {
    return <Container sx={{ mt: 4 }}><Alert severity="error">{error}</Alert></Container>;
  }

  if (!department) {
    return <Container sx={{ mt: 4 }}><Alert severity="info">No department data found.</Alert></Container>;
  }

  // Helper to display potentially null/undefined values
  const displayValue = (value: string | number | boolean | null | undefined) => {
    if (value === null || value === undefined) return 'N/A';
    if (typeof value === 'boolean') return value ? 'Yes' : 'No';
    return String(value);
  };

  return (
    <Container sx={{ mt: 2 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Department: {department.dept_name}
        </Typography>
        <Button variant="outlined" onClick={() => navigate(-1)} sx={{ mb: 2 }}>
          Back
        </Button>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <List dense>
              <ListItem>
                <ListItemText primary="Department ID" secondary={displayValue(department.id)} />
              </ListItem>
              <ListItem>
                <ListItemText primary="Department Code" secondary={displayValue(department.dept_code)} />
              </ListItem>
              <ListItem>
                <ListItemText primary="Department Name" secondary={displayValue(department.dept_name)} />
              </ListItem>
              <ListItem>
                <ListItemText primary="Parent Department Code" secondary={displayValue(department.dept_parentcode)} />
              </ListItem>
            </List>
          </Grid>
          <Grid item xs={12} md={6}>
            <List dense>
              <ListItem>
                <ListItemText primary="Company ID" secondary={displayValue(department.company_id)} />
              </ListItem>
               <ListItem>
                <ListItemText primary="Description" secondary={displayValue(department.description)} />
              </ListItem>
              <ListItem>
                <ListItemText primary="Use Code" secondary={displayValue(department.useCode)} />
              </ListItem>
              <ListItem>
                <ListItemText primary="Operation Mode" secondary={displayValue(department.dept_operationmode)} />
              </ListItem>
               <ListItem>
                <ListItemText primary="Middleware ID" secondary={displayValue(department.middleware_id)} />
              </ListItem>
               <ListItem>
                <ListItemText primary="Default Department" secondary={displayValue(department.defaultDepartment)} />
              </ListItem>
               <ListItem>
                <ListItemText primary="Line Token" secondary={displayValue(department.lineToken)} />
              </ListItem>
            </List>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default DepartmentDetailPage;
