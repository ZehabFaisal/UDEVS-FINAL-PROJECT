import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { jobsAPI } from '../../services/api';

const initialState = {
  jobs: [],
  currentJob: null,
  loading: false,
  error: null,
  pagination: null,
  filters: { location: '', jobType: '', salaryRange: '', searchQuery: '' },
};

export const fetchJobs = createAsyncThunk('jobs/fetchJobs', async (params = {}, { rejectWithValue }) => {
  try {
    const result = await jobsAPI.getAll(params);
    return result;
  } 
  catch (error) {
    return rejectWithValue(error.message || 'Failed to fetch jobs');
  }
});

export const fetchJobById = createAsyncThunk('jobs/fetchJobById', async (id, { rejectWithValue }) => {
  try {
    const result = await jobsAPI.getById(id);
    return result.job;
  } 
  catch (error) {
    return rejectWithValue(error.message || "Error! Failed to fetch job by specific id");
  }
});

export const createJob = createAsyncThunk('jobs/create', async (data, { rejectWithValue }) => {
  try {
    const result = await jobsAPI.create(data);
    return result.job;
  } 
  catch (error) {
    return rejectWithValue(error.message || 'Failed to create job');
  }
});

export const updateJob = createAsyncThunk('jobs/update', async ({ id, data }, { rejectWithValue }) => {
  try {
    const result = await jobsAPI.update(id, data);
    return result.job;
  } 
  catch (error) {
    return rejectWithValue(error.message || 'Failed to update job');
  }
});

export const deleteJob = createAsyncThunk('jobs/delete', async (id, { rejectWithValue }) => {
  try {
    await jobsAPI.delete(id);
    return id;
  } 
  catch (error) {
    return rejectWithValue(error.message || 'Failed to delete job');
  }
});

const jobsSlice = createSlice({
  name: 'jobs',
  initialState,
  reducers: {
    setCurrentJob: (state, action) => {
      state.currentJob = action.payload;
    },
    updateFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = { location: '', jobType: '', salaryRange: '', searchQuery: '' };
    },
    clearCurrentJob: (state) => {
      state.currentJob = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchJobs.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchJobs.fulfilled, (state, action) => {
        state.loading = false;
        state.jobs = action.payload.jobs;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchJobs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch jobs';
      })
      .addCase(fetchJobById.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchJobById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentJob = action.payload;
      })
      .addCase(fetchJobById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch job';
      })
      .addCase(createJob.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(createJob.fulfilled, (state, action) => {
        state.loading = false;
        state.jobs.unshift(action.payload);
      })
      .addCase(createJob.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to create job';
      })
      .addCase(updateJob.fulfilled, (state, action) => {
        const index = state.jobs.findIndex((j) => j.id === action.payload.id);
        if (index !== -1) state.jobs[index] = action.payload;
        if (state.currentJob?.id === action.payload.id) state.currentJob = action.payload;
      })
      .addCase(deleteJob.fulfilled, (state, action) => {
        state.jobs = state.jobs.filter((j) => j.id !== action.payload);
      });
  },
});

export const { setCurrentJob, updateFilters, clearFilters, clearCurrentJob } = jobsSlice.actions;
export default jobsSlice.reducer;