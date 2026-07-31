import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

export const fetchUser = createAsyncThunk('auth/fetchUser', async (_, { rejectWithValue }) => {
  try {
    const res = await api.get('/auth/me');
    return res.data.user;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch user');
  }
});

export const loginUser = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    const res = await api.post('/auth/login', credentials);
    return res.data.user;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Login failed');
  }
});

export const signupUser = createAsyncThunk('auth/signup', async (formData, { rejectWithValue }) => {
  try {
    const res = await api.post('/auth/signup', formData);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Sign up failed');
  }
});

export const updateProfile = createAsyncThunk('auth/updateProfile', async (formData, { rejectWithValue }) => {
  try {
    const res = await api.post('/auth/profile', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
    return res.data.user;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Update failed');
  }
});

export const logoutUser = createAsyncThunk('auth/logoutUser', async (_, { rejectWithValue }) => {
  try {
    await api.post('/auth/logout');
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Logout failed');
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState: { user: null, isLoading: true, error: null },
  reducers: {
    clearAuthError: (state) => { state.error = null; }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(fetchUser.fulfilled, (state, action) => { state.user = action.payload; state.isLoading = false; })
      .addCase(fetchUser.rejected, (state, action) => { state.user = null; state.isLoading = false; state.error = action.payload; })
      
      .addCase(loginUser.fulfilled, (state, action) => { state.user = action.payload; state.isLoading = false; })
      .addCase(loginUser.rejected, (state, action) => { state.isLoading = false; state.error = action.payload; })

      .addCase(updateProfile.fulfilled, (state, action) => { state.user = action.payload; })
      
      .addCase(logoutUser.fulfilled, (state) => { state.user = null; });
  }
});

export const { clearAuthError } = authSlice.actions;
export default authSlice.reducer;