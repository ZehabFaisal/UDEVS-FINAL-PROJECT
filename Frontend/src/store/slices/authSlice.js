import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authAPI } from '../../services/api';

const initialState = {
  user: JSON.parse(localStorage.getItem('user') || 'null'),
  isAuthenticated: localStorage.getItem('isAuth') === 'true',
  loading: false,
  error: null,
};

export const loginUser = createAsyncThunk('auth/login', async (data, { rejectWithValue }) => {
  try {
    const result = await authAPI.login(data);
    localStorage.setItem('token', result.token);
    localStorage.setItem('isAuth', 'true');
    localStorage.setItem('user', JSON.stringify(result.user));
    return result.user;
  } 
  catch (error) {
    return rejectWithValue(error.message || 'Login failed');
  }
});

export const signupUser = createAsyncThunk('auth/signup', async (data, { rejectWithValue }) => {
  try {
    const result = await authAPI.register(data);
    localStorage.setItem('token', result.token);
    localStorage.setItem('isAuth', 'true');
    localStorage.setItem('user', JSON.stringify(result.user));
    return result.user;
  } 
  catch (error) {
    return rejectWithValue(error.message || 'Signup failed');
  }
});

export const verifyAuth = createAsyncThunk('auth/verify', async (_, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) return rejectWithValue('No token');
    const result = await authAPI.verify();
    localStorage.setItem('user', JSON.stringify(result.user));
    return result.user;
  } 
  catch (error) {
    localStorage.removeItem('token');
    localStorage.removeItem('isAuth');
    localStorage.removeItem('user');
    return rejectWithValue(error.message || 'Token invalid');
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
      localStorage.removeItem('token');
      localStorage.removeItem('isAuth');
      localStorage.removeItem('user');
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Login failed';
      })
      .addCase(signupUser.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Signup failed';
      })
      .addCase(verifyAuth.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(verifyAuth.rejected, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;