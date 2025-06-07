import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container, Typography, TextField, Button, CircularProgress, Alert,
  Box, Paper, Grid, MenuItem, FormControlLabel, Switch
} from '@mui/material';
import {
  HrSalaryComponentsService,
  SalaryComponentCreate,
  SalaryComponentUpdate,
  SalaryComponentInDB,
  SalaryComponentType
} from '../../services/api';

const SalaryComponentFormPage: React.FC = () => {
  const { component_id } = useParams<{ component_id?: string }>();
  const navigate = useNavigate();
  const isEditMode = Boolean(component_id);

  const [formData, setFormData] = useState<SalaryComponentCreate | SalaryComponentUpdate>({
    name: '',
    type: Object.values(SalaryComponentType)[0], // Default to the first type
    is_earning: true,
    description: '',
  });

  const [loading, setLoading] = useState<boolean>(false); // For page load in edit mode
  const [submitting, setSubmitting] = useState<boolean>(false); // For form submission
  const [error, setError] = useState<string | null>(null); // For page load error
  const [submitError, setSubmitError] = useState<string | null>(null); // For form submission error
  const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);

  const fetchSalaryComponent = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const response: SalaryComponentInDB = await HrSalaryComponentsService.readSalaryComponentApiV1HrSalaryComponentsComponentIdGet(id);
      setFormData({
        name: response.name,
        type: response.type,
        is_earning: response.is_earning,
        description: response.description || '',
      });
    } catch (err: any) {
      setError(err.message || 'Failed to fetch salary component data.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isEditMode && component_id) {
      const numericId = parseInt(component_id, 10);
      if (!isNaN(numericId)) {
        fetchSalaryComponent(numericId);
      } else {
        setError("Invalid component ID.");
      }
    }
  }, [isEditMode, component_id, fetchSalaryComponent]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = event.target;
    if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: (event.target as HTMLInputElement).checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    if (!formData.name || !formData.type) {
        setSubmitError("Name and Type are required fields.");
        setSubmitting(false);
        return;
    }

    const payload: SalaryComponentCreate | SalaryComponentUpdate = {
        ...formData,
        description: formData.description || null, // API expects null for empty optional string
    };

    try {
      if (isEditMode && component_id) {
        await HrSalaryComponentsService.updateSalaryComponentApiV1HrSalaryComponentsComponentIdPut(parseInt(component_id, 10), payload as SalaryComponentUpdate);
      } else {
        await HrSalaryComponentsService.createSalaryComponentApiV1HrSalaryComponentsPost(payload as SalaryComponentCreate);
      }
      setSubmitSuccess(true);
      setTimeout(() => navigate('/salary'), 1500);
    } catch (err: any) {
      const errorDetail = err.body?.detail;
      if (Array.isArray(errorDetail)) {
        const messages = errorDetail.map(detail => `${detail.loc.join('.')}: ${detail.msg}`).join('; ');
        setSubmitError(messages);
      } else if (typeof errorDetail === 'string') {
        setSubmitError(errorDetail);
      } else {
        setSubmitError(err.message || (isEditMode ? 'Failed to update salary component.' : 'Failed to create salary component.'));
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
          {isEditMode ? 'Edit Salary Component' : 'Create Salary Component'}
        </Typography>
        <Button variant="outlined" onClick={() => navigate('/salary')} sx={{ mb: 2 }}>
          Back to List
        </Button>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item sx={{ width: '100%', sm: { flexBasis: '50%', maxWidth: '50%' } }}>
              <TextField
                name="name"
                label="Component Name"
                value={formData.name}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item sx={{ width: '100%', sm: { flexBasis: '50%', maxWidth: '50%' } }}>
              <TextField
                name="type"
                label="Component Type"
                select
                value={formData.type}
                onChange={handleChange}
                fullWidth
                required
              >
                {Object.values(SalaryComponentType).map((typeVal) => (
                  <MenuItem key={typeVal} value={typeVal}>
                    {typeVal}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item sx={{ width: '100%' }}>
              <FormControlLabel
                control={
                  <Switch
                    name="is_earning"
                    checked={!!formData.is_earning}
                    onChange={handleChange}
                    color="primary"
                  />
                }
                label="Is Earning Component?"
              />
            </Grid>
            <Grid item sx={{ width: '100%' }}>
              <TextField
                name="description"
                label="Description (Optional)"
                multiline
                rows={3}
                value={formData.description || ''}
                onChange={handleChange}
                fullWidth
              />
            </Grid>
          </Grid>

          {submitError && <Alert severity="error" sx={{ mt: 3, mb: 2 }}>{submitError}</Alert>}
          {submitSuccess && <Alert severity="success" sx={{ mt: 3, mb: 2 }}>{isEditMode ? 'Component updated successfully!' : 'Component created successfully!'}</Alert>}

          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
            <Button type="submit" variant="contained" color="primary" disabled={submitting}>
              {submitting ? <CircularProgress size={24} /> : (isEditMode ? 'Update Component' : 'Create Component')}
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default SalaryComponentFormPage;
