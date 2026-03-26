import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const initialState = {
  applications: [],
  loading: false,
  error: null,
};

export const fetchApplications = createAsyncThunk('apps/fetch', async () => {
  await new Promise(r => setTimeout(r, 300));
  return [];
});

export const submitApplication = createAsyncThunk('apps/submit', async (data) => {
  await new Promise(r => setTimeout(r, 300));
  return data;
});

const applicationsSlice = createSlice({
  name: 'applications',
  initialState,
  reducers: {
    updateApp_Status: (state, action) => {
      const app = state.applications.find(x => x.id === action.payload.id);
      if (app) {
        app.status = action.payload.status;
      } 
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchApplications.pending, (state) => { 
        state.loading = true; 
      })
      .addCase(fetchApplications.fulfilled, (state, action) => { 
        state.loading = false; state.applications = action.payload; 
      })
      .addCase(fetchApplications.rejected, (state) => { 
        state.loading = false; state.error = 'Failed'; 
      })
      .addCase(submitApplication.pending, (state) =>  { 
        state.loading = true; 
      })
      .addCase(submitApplication.fulfilled, (state, action) => { 
        state.loading = false; state.applications.push(action.payload); 
      })
      .addCase(submitApplication.rejected, (state) => { 
        state.loading = false; state.error = 'Failed'; 
      });
  },
});

export const { updateApp_Status } = applicationsSlice.actions;
export default applicationsSlice.reducer;