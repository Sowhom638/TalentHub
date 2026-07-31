import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";

export const fetchJobs = createAsyncThunk(
  "jobs/fetchJobs",
  async (queryParams, { rejectWithValue }) => {
    try {
      const res = await api.get(`/jobs?${queryParams}`);
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch jobs",
      );
    }
  },
);

export const fetchJobById = createAsyncThunk(
  "jobs/fetchJobById",
  async (jobId, { rejectWithValue }) => {
    try {
      const res = await api.get(`/jobs/${jobId}`);
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch job",
      );
    }
  },
);

export const fetchLandingJobs = createAsyncThunk(
  "jobs/fetchLandingJobs",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/jobs?limit=6&sort=-createdAt");
      return res.data.jobs || [];
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch landing jobs",
      );
    }
  },
);

export const createJob = createAsyncThunk(
  "jobs/createJob",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await api.post("/jobs", payload);
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to create job",
      );
    }
  },
);

export const updateJob = createAsyncThunk(
  "jobs/updateJob",
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      const res = await api.put(`/jobs/${id}`, payload);
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to update job",
      );
    }
  },
);

export const toggleBookmark = createAsyncThunk(
  "jobs/toggleBookmark",
  async (jobId, { rejectWithValue }) => {
    try {
      const res = await api.post(`/bookmarks/${jobId}`);
      return { jobId, isBookmarked: res.data.isBookmarked };
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to update bookmark",
      );
    }
  },
);

export const applyToJob = createAsyncThunk(
  "jobs/apply",
  async (jobId, { rejectWithValue }) => {
    try {
      await api.post(`/jobs/${jobId}/apply`);
      return jobId;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to apply");
    }
  },
);

export const withdrawFromJob = createAsyncThunk(
  "jobs/withdraw",
  async (jobId, { rejectWithValue }) => {
    try {
      await api.delete(`/jobs/${jobId}/apply`);
      return jobId;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to withdraw",
      );
    }
  },
);

export const toggleArchiveJob = createAsyncThunk(
  "jobs/toggleArchive",
  async (jobId, { rejectWithValue }) => {
    try {
      const res = await api.patch(`/jobs/${jobId}/archive`);
      return { jobId, isActive: res.data.isActive };
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to update job status",
      );
    }
  },
);

export const fetchRecruiterDashboard = createAsyncThunk(
  "jobs/fetchRecruiterDashboard",
  async (_, { rejectWithValue }) => {
    try {
      const [statsRes, appsRes] = await Promise.all([
        api.get("/jobs/stats"),
        api.get("/jobs/recent-applications?limit=5"),
      ]);
      return { stats: statsRes.data, recentApplications: appsRes.data };
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch dashboard data",
      );
    }
  },
);

const jobSlice = createSlice({
  name: "jobs",
  initialState: {
    jobs: [],
    pagination: {},
    currentJob: null,
    landingJobs: [],
    stats: {},
    recentApplications: [],
    isLoading: false,
    isLandingLoading: false,
    error: null,
    isSubmitting: false,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchJobs.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchJobs.fulfilled, (state, action) => {
        state.isLoading = false;
        state.jobs = action.payload.jobs || [];
        state.pagination = action.payload.pagination || {};
      })
      .addCase(fetchJobs.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      .addCase(fetchJobById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchJobById.fulfilled, (state, action) => {
        state.currentJob = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchJobById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      .addCase(fetchLandingJobs.pending, (state) => {
        state.isLandingLoading = true;
      })
      .addCase(fetchLandingJobs.fulfilled, (state, action) => {
        state.landingJobs = action.payload;
        state.isLandingLoading = false;
      })
      .addCase(fetchLandingJobs.rejected, (state) => {
        state.isLandingLoading = false;
      })

      .addCase(toggleBookmark.fulfilled, (state, action) => {
        if (state.currentJob && state.currentJob._id === action.payload.jobId) {
          state.currentJob.isBookmarked = action.payload.isBookmarked;
        }
      })
      .addCase(applyToJob.fulfilled, (state, action) => {
        if (state.currentJob && state.currentJob._id === action.payload) {
          state.currentJob.hasApplied = true;
          state.currentJob.applicationStatus = "Applied";
        }
      })
      .addCase(withdrawFromJob.fulfilled, (state, action) => {
        if (state.currentJob && state.currentJob._id === action.payload) {
          state.currentJob.hasApplied = false;
          state.currentJob.applicationStatus = null;
        }
      })
      .addCase(toggleArchiveJob.fulfilled, (state, action) => {
        if (state.currentJob && state.currentJob._id === action.payload.jobId) {
          state.currentJob.isActive = action.payload.isActive;
        }
      })
      .addCase(fetchRecruiterDashboard.fulfilled, (state, action) => {
        state.stats = action.payload.stats;
        state.recentApplications = action.payload.recentApplications;
        state.isLoading = false;
      })
      .addCase(createJob.pending, (state) => {
        state.isSubmitting = true;
        state.error = null;
      })
      .addCase(createJob.fulfilled, (state) => {
        state.isSubmitting = false;
      })
      .addCase(createJob.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.payload;
      })
      .addCase(updateJob.pending, (state) => {
        state.isSubmitting = true;
        state.error = null;
      })
      .addCase(updateJob.fulfilled, (state, action) => {
        state.isSubmitting = false;
        state.currentJob = action.payload; // Update the current job in state
      })
      .addCase(updateJob.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.payload;
      });
  },
});

export default jobSlice.reducer;
