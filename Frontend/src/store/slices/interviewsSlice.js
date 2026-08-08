import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { interviewsAPI } from '../../services/api';

const initialState = {
  interviews: [],
  loading: false,
  error: null,
};

export const fetchInterviews = createAsyncThunk('interviews/fetch', async (_, { rejectWithValue }) => {
  try {
    const result = await interviewsAPI.getAll();
    return result.interviews;
  } catch (error) {
    return rejectWithValue(error.message || 'Failed to fetch interviews');
  }
});

export const scheduleInterview = createAsyncThunk('interviews/schedule', async (data, { rejectWithValue }) => {
    try {
      const result = await interviewsAPI.schedule(data);
      return result.interview;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to schedule interview');
    }
  }
);

const interviewsSlice = createSlice({
  name: 'interviews',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchInterviews.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchInterviews.fulfilled, (state, action) => {
        state.loading = false;
        state.interviews = action.payload;
      })
      .addCase(fetchInterviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch interviews';
      })
      .addCase(scheduleInterview.fulfilled, (state, action) => {
        state.interviews.push(action.payload);
      })
      .addCase(scheduleInterview.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export default interviewsSlice.reducer;