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
  async (loginCredentials: Pick<Body_login_for_access_token_api_v1_token_post, 'username' | 'password'> & Partial<Pick<Body_login_for_access_token_api_v1_token_post, 'grant_type' | 'scope' | 'client_id' | 'client_secret'>>, { rejectWithValue }) => {
    try {
      // Construct the payload according to Body_login_for_access_token_api_v1_token_post
      // The generated AuthService.loginForAccessTokenApiV1TokenPost expects an object
      // that matches this type for 'application/x-www-form-urlencoded'.
      // The internal 'request' function handles the actual serialization.
      const payload: Body_login_for_access_token_api_v1_token_post = {
        username: loginCredentials.username,
        password: loginCredentials.password,
        grant_type: loginCredentials.grant_type || 'password', // Default to 'password' if not provided
        scope: loginCredentials.scope || '', // Default to empty string as per schema
        // client_id and client_secret are optional and can be omitted if not provided
        ...(loginCredentials.client_id && { client_id: loginCredentials.client_id }),
        ...(loginCredentials.client_secret && { client_secret: loginCredentials.client_secret }),
      };

      const response: Token = await AuthService.loginForAccessTokenApiV1TokenPost(payload);
      localStorage.setItem('token', response.access_token);
      return response;
    } catch (error: any) {
      // Handle API errors
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      } else if (error.body && typeof error.body.detail === 'string') { // Handle ApiError from codegen
        return rejectWithValue(error.body.detail);
      } else if (error.body && Array.isArray(error.body.detail)) { // Handle FastAPI validation errors
         return rejectWithValue(error.body);
      }
      return rejectWithValue(error.message || 'An unknown login error occurred');
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
        // Improved error handling for display
        if (action.payload && (action.payload as any).detail) {
            if (Array.isArray((action.payload as any).detail)) {
                 state.error = (action.payload as any).detail.map((d: any) => `${d.loc.join('.')}: ${d.msg}`).join('; ');
            } else {
                state.error = (action.payload as any).detail;
            }
        } else if (typeof action.payload === 'string') {
            state.error = action.payload;
        }
         else {
            state.error = 'Login Failed';
        }
      });
  },
});

export const { logout, setUser, clearError } = authSlice.actions;
export default authSlice.reducer;
