import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const initialState = {
  jobs: [],
  currentJob: null,
  loading: false,
  error: null,
  filters: { location: '', jobType: '', salaryRange: '', searchQuery: '' },
};

export const fetchJobs = createAsyncThunk('jobs/fetchJobs', async () => {
  await new Promise(r => setTimeout(r, 300));
  return [{ id: 1, title: 'Frontend Part' }, { id: 2, title: 'Backend Part' }];
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
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchJobs.pending, (state) => { 
        state.loading = true; 
      })
      .addCase(fetchJobs.fulfilled, (state, action) => { 
        state.loading = false; state.jobs = action.payload; 
      })
      .addCase(fetchJobs.rejected, (state) => { 
        state.loading = false; state.error = 'Failed'; 
      });
  },
});

export const { setCurrentJob, updateFilters, clearFilters } = jobsSlice.actions;
export default jobsSlice.reducer;