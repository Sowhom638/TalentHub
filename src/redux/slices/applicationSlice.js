import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";

export const fetchApplications = createAsyncThunk(
  "applications/fetchApplications",
  async ({ status, page, limit }, { rejectWithValue }) => {
    try {
      const query = new URLSearchParams();
      if (status && status !== "Applied") query.append("status", status);
      query.append("page", page);
      query.append("limit", limit);
      const res = await api.get(`/applicants?${query.toString()}`);
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch applications",
      );
    }
  },
);

export const withdrawApplication = createAsyncThunk(
  "applications/withdraw",
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

export const fetchAllApplicants = createAsyncThunk(
  "applications/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/jobs/applicants");
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch applicants",
      );
    }
  },
);

export const updateApplicantStatus = createAsyncThunk(
  "applications/updateStatus",
  async ({ applicationId, jobId, newStatus }, { rejectWithValue }) => {
    try {
      await api.patch(`/jobs/${jobId}/applicants/${applicationId}`, {
        status: newStatus,
      });
      return { applicationId, newStatus };
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to update status",
      );
    }
  },
);

export const fetchApplicantDashboard = createAsyncThunk(
  "applications/fetchDashboard",
  async (_, { rejectWithValue }) => {
    try {
      const [statsRes, activityRes, jobsRes] = await Promise.all([
        api.get("/applicants/stats"),
        api.get("/applicants/recent-activity?limit=5"),
        api.get("/jobs/recommended?limit=5"),
      ]);

      return {
        stats: statsRes.data,
        recentActivity: activityRes.data,
        recommendedJobs: jobsRes.data,
      };
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to load dashboard data",
      );
    }
  },
);

const applicationSlice = createSlice({
  name: "applications",
  initialState: {
    applications: [],
    allApplicants: [],
    pagination: {},
    isLoading: false,
    error: null,
    recentActivity: [],
    recommendedJobs: [],
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchApplications.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchApplications.fulfilled, (state, action) => {
        state.isLoading = false;
        state.applications = Array.isArray(action.payload)
          ? action.payload
          : action.payload.applications || [];
        state.pagination = action.payload.pagination || {};
      })
      .addCase(fetchApplications.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      .addCase(withdrawApplication.fulfilled, (state, action) => {
        state.applications = state.applications.filter(
          (app) => app.jobId !== action.payload,
        );
      })

      .addCase(fetchAllApplicants.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAllApplicants.fulfilled, (state, action) => {
        state.allApplicants = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchAllApplicants.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      .addCase(updateApplicantStatus.fulfilled, (state, action) => {
        state.allApplicants = state.allApplicants.map((app) =>
          app._id === action.payload.applicationId
            ? { ...app, status: action.payload.newStatus }
            : app,
        );
      })
      .addCase(fetchApplicantDashboard.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchApplicantDashboard.fulfilled, (state, action) => {
        state.isLoading = false;
        state.stats = action.payload.stats;
        state.recentActivity = action.payload.recentActivity;
        state.recommendedJobs = action.payload.recommendedJobs;
      })
      .addCase(fetchApplicantDashboard.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export default applicationSlice.reducer;
