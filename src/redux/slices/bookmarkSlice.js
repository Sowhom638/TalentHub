import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

export const fetchBookmarks = createAsyncThunk('bookmarks/fetchBookmarks', async (_, { rejectWithValue }) => {
  try {
    const res = await api.get('/bookmarks');
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch bookmarks');
  }
});
export const removeBookmark = createAsyncThunk(
  'bookmarks/removeBookmark',
  async (jobId, { rejectWithValue }) => {
    try {
      await api.post(`/bookmarks/${jobId}`);
      return jobId;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to remove bookmark');
    }
  }
);

const bookmarkSlice = createSlice({
  name: 'bookmarks',
  initialState: { bookmarks: [], isLoading: false, error: null },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBookmarks.pending, (state) => { state.isLoading = true; })
      .addCase(fetchBookmarks.fulfilled, (state, action) => { state.bookmarks = action.payload; state.isLoading = false; })
      .addCase(fetchBookmarks.rejected, (state, action) => { state.isLoading = false; state.error = action.payload; });
  }
});

export default bookmarkSlice.reducer;