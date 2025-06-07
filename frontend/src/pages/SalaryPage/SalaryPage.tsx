import React, { useEffect, useState, useCallback } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Container, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Button, CircularProgress, Alert, IconButton, Box, Tooltip,
  Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Chip
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { HrSalaryComponentsService, SalaryComponentInDB, SalaryComponentType } from '../../services/api';

const SalaryPage: React.FC = () => {
  const [components, setComponents] = useState<SalaryComponentInDB[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [deleteSuccess, setDeleteSuccess] = useState<string | null>(null);

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [componentToDelete, setComponentToDelete] = useState<SalaryComponentInDB | null>(null);

  const fetchSalaryComponents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await HrSalaryComponentsService.readSalaryComponentsApiV1HrSalaryComponentsGet(0, 200); // Fetch up to 200 components
      setComponents(response);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch salary components');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSalaryComponents();
  }, [fetchSalaryComponents]);

  const handleDeleteClick = (component: SalaryComponentInDB) => {
    setComponentToDelete(component);
    setOpenDeleteDialog(true);
    setDeleteError(null);
    setDeleteSuccess(null);
  };

  const handleDeleteConfirm = async () => {
    if (!componentToDelete) return;
    try {
      await HrSalaryComponentsService.deleteSalaryComponentApiV1HrSalaryComponentsComponentIdDelete(componentToDelete.id);
      setDeleteSuccess(`Component "${componentToDelete.name}" deleted successfully.`);
      fetchSalaryComponents(); // Refresh list
    } catch (err: any) {
      const errorMsg = err.body?.detail || err.message || `Failed to delete component "${componentToDelete.name}"`;
      setDeleteError(errorMsg);
      console.error(err);
    } finally {
      setOpenDeleteDialog(false);
      setComponentToDelete(null);
    }
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setComponentToDelete(null);
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
          Salary Components
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          component={RouterLink}
          to="/salary/components/new"
        >
          Create New Component
        </Button>
      </Box>

      {deleteError && <Alert severity="error" sx={{ my: 2 }}>{deleteError}</Alert>}
      {deleteSuccess && <Alert severity="success" sx={{ my: 2 }}>{deleteSuccess}</Alert>}

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="salary components table">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Is Earning?</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {components.length === 0 && !loading && (
              <TableRow><TableCell colSpan={6} align="center">No salary components found.</TableCell></TableRow>
            )}
            {components.map((component) => (
              <TableRow key={component.id}>
                <TableCell>{component.id}</TableCell>
                <TableCell>{component.name}</TableCell>
                <TableCell><Chip label={component.type} size="small" /></TableCell>
                <TableCell>{component.is_earning ? 'Yes' : 'No'}</TableCell>
                <TableCell>{component.description || 'N/A'}</TableCell>
                <TableCell>
                  <Tooltip title="Edit Component">
                    <IconButton component={RouterLink} to={`/salary/components/${component.id}/edit`} aria-label="edit salary component" size="small">
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete Component">
                    <IconButton onClick={() => handleDeleteClick(component)} aria-label="delete salary component" color="error" size="small">
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the salary component "{componentToDelete?.name}"? This action cannot be undone.
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

export default SalaryPage;
