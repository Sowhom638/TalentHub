import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import jobReducer from './slices/jobSlice';
import applicationReducer from './slices/applicationSlice';
import bookmarkReducer from './slices/bookmarkSlice';
import aiReducer from './slices/aiSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    jobs: jobReducer,
    applications: applicationReducer,
    bookmarks: bookmarkReducer,
    ai: aiReducer
  },
});

export default store;