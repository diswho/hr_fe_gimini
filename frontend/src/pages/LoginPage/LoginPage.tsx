import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, TextField, Container, Typography, Box, CircularProgress } from '@mui/material';
import { loginUser, clearError } from '../../store/auth/authSlice';
import { RootState, AppDispatch } from '../../store/store';
import { useNavigate, useLocation } from 'react-router-dom';

const LoginPage: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { isAuthenticated, error, loading } = useSelector((state: RootState) => state.auth);

  // Determine where to redirect after login
  const from = location.state?.from?.pathname || "/dashboard";

  useEffect(() => {
    // Clear any previous errors when the component mounts or when username/password changes
    dispatch(clearError());
  }, [dispatch, username, password]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    dispatch(loginUser({ username, password }));
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            autoComplete="username"
            autoFocus
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={loading}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
          />
          {error && (
            <Typography color="error" sx={{ mt: 2 }} variant="body2" align="center">
              {typeof error === 'string' ? error : (error.detail ?
                (typeof error.detail === 'string' ? error.detail : JSON.stringify(error.detail))
                : 'Login failed. Please check your credentials.')}
            </Typography>
          )}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default LoginPage;
