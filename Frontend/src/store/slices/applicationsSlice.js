import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { applicationsAPI } from '../../services/api';

const initialState = {
  applications: [],
  loading: false,
  error: null,
};

export const fetchApplications = createAsyncThunk('apps/fetch', async (_, { rejectWithValue }) => {
  try {
    const result = await applicationsAPI.getAll();
    return result.applications;
  } 
  catch (error) {
    return rejectWithValue(error.message || 'Failed to fetch applications');
  }
});

export const submitApplication = createAsyncThunk('apps/submit', async (data, { rejectWithValue }) => {
  try {
    const result = await applicationsAPI.submit(data);
    return result.application;
  } 
  catch (error) {
    return rejectWithValue(error.message || 'Failed to submit application');
  }
});

export const updateApplicationStatus = createAsyncThunk(
  'apps/updateStatus',
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const result = await applicationsAPI.updateStatus(id, status);
      return result.application;
    } 
    catch (error) {
      return rejectWithValue(error.message || 'Failed to update status');
    }
  }
);

const applicationsSlice = createSlice({
  name: 'applications',
  initialState,
  reducers: {
    updateApp_Status: (state, action) => {
      const app = state.applications.find((x) => x.id === action.payload.id);
      if (app) {
        app.status = action.payload.status;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchApplications.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchApplications.fulfilled, (state, action) => {
        state.loading = false;
        state.applications = action.payload;
      })
      .addCase(fetchApplications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch applications';
      })
      .addCase(submitApplication.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(submitApplication.fulfilled, (state, action) => {
        state.loading = false;
        state.applications.push(action.payload);
      })
      .addCase(submitApplication.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to submit application';
      })
      .addCase(updateApplicationStatus.fulfilled, (state, action) => {
        const index = state.applications.findIndex((a) => a.id === action.payload.id);
        if (index !== -1) state.applications[index] = action.payload;
      });
  },
});

export const { updateApp_Status } = applicationsSlice.actions;
export default applicationsSlice.reducer;
