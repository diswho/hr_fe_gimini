import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { AuthService, Token, Body_login_for_access_token_api_v1_token_post } from '../../services/api';

interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  user: any | null; // Replace 'any' with a proper user type if available
  error: string | null | any; // Allow for different error types
  loading: boolean;
}

const initialState: AuthState = {
  token: localStorage.getItem('token'),
  isAuthenticated: !!localStorage.getItem('token'),
  user: null,
  error: null,
  loading: false,
};

// Async thunk for login
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (loginData: Body_login_for_access_token_api_v1_token_post, { rejectWithValue }) => {
    try {
      // The request body needs to be URLSearchParams for x-www-form-urlencoded
      const formData = new URLSearchParams();
      formData.append('username', loginData.username);
      formData.append('password', loginData.password);
      if (loginData.grant_type) formData.append('grant_type', loginData.grant_type);
      if (loginData.scope) formData.append('scope', loginData.scope);
      if (loginData.client_id) formData.append('client_id', loginData.client_id);
      if (loginData.client_secret) formData.append('client_secret', loginData.client_secret);

      // Make sure this matches the actual generated service method
      const response: Token = await AuthService.loginForAccessTokenApiV1TokenPost(formData as any);
      localStorage.setItem('token', response.access_token);
      return response;
    } catch (error: any) {
      // Handle API errors
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue(error.message);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.token = null;
      state.isAuthenticated = false;
      state.user = null;
      state.error = null;
      localStorage.removeItem('token');
    },
    setUser: (state, action: PayloadAction<any>) => { // Replace 'any' with a proper user type
      state.user = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<Token>) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.token = action.payload.access_token;
        // Potentially set user info here if returned by the token endpoint
        // For now, we can fetch user info in a separate step if needed
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.token = null;
        state.error = action.payload ? action.payload : 'Login Failed';
      });
  },
});

export const { logout, setUser, clearError } = authSlice.actions;
export default authSlice.reducer;
