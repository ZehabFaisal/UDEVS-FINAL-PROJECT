import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

export const loginUser = createAsyncThunk('auth/login', async (data) => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return { 
    email: data.email
  };
});

export const signupUser = createAsyncThunk('auth/signup', async (data) => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return { 
    email: data.email, 
    name: data.name 
  };
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => { state.loading = true; })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state) => { 
        state.loading = false; state.error = 'Login failed'; 
      })
      .addCase(signupUser.pending, (state) => { 
        state.loading = true; 
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(signupUser.rejected, (state) => { 
        state.loading = false; state.error = 'Signup failed';
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;