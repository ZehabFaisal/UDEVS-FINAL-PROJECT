import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { adminAPI } from '../../services/api';

const initialState = {
  recruiters: [],
  candidates: [],
  stats: {
    totalRecruiters: 0,
    totalCandidates: 0,
    pendingRecruiters: 0,
    totalApplications: 0,
  },
  loading: false,
};
export const fetchAdminStats = createAsyncThunk('admin/fetchStats', async (_, { rejectWithValue }) => {
  try {
    const result = await adminAPI.getStats();
    return result.stats;
  } catch (error) {
    return rejectWithValue(error.message || 'Failed to fetch stats');
  }
});

export const fetchRecruiters = createAsyncThunk('admin/fetchRecruiters', async (_, { rejectWithValue }) => {
  try {
    const result = await adminAPI.getRecruiters();
    return result.recruiters;
  } catch (error) {
    return rejectWithValue(error.message || 'Failed to fetch recruiters');
  }
});

export const fetchCandidates = createAsyncThunk('admin/fetchCandidates', async (_, { rejectWithValue }) => {
  try {
    const result = await adminAPI.getCandidates();
    return result.candidates;
  } catch (error) {
    return rejectWithValue(error.message || 'Failed to fetch candidates');
  }
});

export const updateRecruiterStatus = createAsyncThunk(
  'admin/updateRecruiterStatus',
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const result = await adminAPI.updateRecruiterStatus(id, status);
      return result.recruiter;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to update recruiter status');
    }
  }
);

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminStats.fulfilled, (state, action) => {
        state.stats = action.payload;
      })
      .addCase(fetchRecruiters.fulfilled, (state, action) => {
        state.recruiters = action.payload;
      })
      .addCase(fetchCandidates.fulfilled, (state, action) => {
        state.candidates = action.payload;
      })
      .addCase(updateRecruiterStatus.fulfilled, (state, action) => {
        const index = state.recruiters.findIndex((r) => r.id === action.payload.id);
        if (index !== -1) state.recruiters[index] = action.payload;
      });
  },
});

export default adminSlice.reducer;
