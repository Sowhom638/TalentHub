// src/redux/slices/aiSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios"; // Adjust path to your axios instance

export const fetchAIHistory = createAsyncThunk(
  "ai/fetchHistory",
  async (jobId, { rejectWithValue }) => {
    try {
      const res = await api.get(`/ai/recruiter/history?jobId=${jobId}`);
      return res.data.history;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch history",
      );
    }
  },
);

export const analyzeJobPrompt = createAsyncThunk(
  "ai/analyze",
  async ({ jobId, prompt }, { rejectWithValue }) => {
    try {
      const res = await api.post("/ai/recruiter/analyze", { jobId, prompt });
      return { prompt, response: res.data.analysis, createdAt: new Date() };
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to get AI analysis.",
      );
    }
  },
);

export const generateInterviewPrep = createAsyncThunk(
  "ai/generateInterviewPrep",
  async (jobId, { rejectWithValue }) => {
    try {
      const res = await api.post("/ai/applicant/interview-prep", { jobId });

      // Clean up response in case Gemini still adds markdown backticks
      let rawText = res.data.preparation;
      rawText = rawText.replace(/^```json\s*/, "").replace(/\s*```$/, "");

      const parsedData = JSON.parse(rawText);
      return parsedData;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message ||
          "Failed to generate interview preparation. Please try again.",
      );
    }
  },
);

const aiSlice = createSlice({
  name: "ai",
  initialState: {
    history: [],
    currentResponse: null,
    isLoading: false,
    error: null,
    interviewPrep: null,
    isPrepLoading: false,
    prepError: null,
  },
  reducers: {
    clearAIError: (state) => {
      state.error = null;
    },
    setActiveResponse: (state, action) => {
      state.currentResponse = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAIHistory.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAIHistory.fulfilled, (state, action) => {
        state.history = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchAIHistory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      .addCase(analyzeJobPrompt.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.currentResponse = null;
      })
      .addCase(analyzeJobPrompt.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentResponse = action.payload.response;
        state.history = [action.payload, ...state.history]; // Prepend new prompt to history
      })
      .addCase(analyzeJobPrompt.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(generateInterviewPrep.pending, (state) => {
        state.isPrepLoading = true;
        state.prepError = null;
        state.interviewPrep = null;
      })
      .addCase(generateInterviewPrep.fulfilled, (state, action) => {
        state.interviewPrep = action.payload;
        state.isPrepLoading = false;
      })
      .addCase(generateInterviewPrep.rejected, (state, action) => {
        state.isPrepLoading = false;
        state.prepError = action.payload;
      });
  },
});

export const { clearAIError, setActiveResponse } = aiSlice.actions;
export default aiSlice.reducer;
