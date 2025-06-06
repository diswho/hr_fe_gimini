import React from 'react';
import { Typography, Container } from '@mui/material';

const DashboardPage: React.FC = () => {
  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        Dashboard
      </Typography>
      <Typography variant="body1">
        Welcome to the HR Management System.
      </Typography>
    </Container>
  );
};

export default DashboardPage;
