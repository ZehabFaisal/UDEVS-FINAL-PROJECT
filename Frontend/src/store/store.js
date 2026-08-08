import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import jobsSlice from './slices/jobsSlice';
import applicationsSlice from './slices/applicationsSlice';
import interviewsSlice from './slices/interviewsSlice';
import adminSlice from './slices/adminSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    jobs: jobsSlice,
    applications: applicationsSlice,
    interviews: interviewsSlice,
    admin: adminSlice,
  },
});