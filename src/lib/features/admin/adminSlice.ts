import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../store";

export interface AdminStats {
  kpis: {
    bookingsToday: number;
    revenue24h: number;
    activeTravelers: number;
    cancellations: number;
  };
  flights: Array<{
    code: string;
    route: string;
    dep: string;
    status: string;
    load: number;
  }>;
  bookings: Array<{
    ref: string;
    name: string;
    route: string;
    amount: number;
    status: string;
  }>;
}

interface AdminState {
  stats: AdminStats | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  airports: any[];
  airplanes: any[];
}

const initialState: AdminState = {
  stats: null,
  status: "idle",
  error: null,
  airports: [],
  airplanes: [],
};

export const fetchAdminStats = createAsyncThunk(
  "admin/fetchStats",
  async (_, { getState }) => {
    const state = getState() as RootState;
    const token = state.auth.token;
    const response = await fetch("/api/admin/stats", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error("Failed to fetch admin stats");
    }
    return response.json();
  }
);

export const fetchAirports = createAsyncThunk("admin/fetchAirports", async () => {
  const response = await fetch("/api/airports");
  if (!response.ok) throw new Error("Failed to fetch airports");
  return response.json();
});

export const fetchAirplanes = createAsyncThunk("admin/fetchAirplanes", async () => {
  const response = await fetch("/api/airplanes");
  if (!response.ok) throw new Error("Failed to fetch airplanes");
  return response.json();
});

export const createFlight = createAsyncThunk(
  "admin/createFlight",
  async (flightData: any, { getState, dispatch }) => {
    const state = getState() as RootState;
    const token = state.auth.token;
    const response = await fetch("/api/flights", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(flightData),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to create flight");
    }
    const data = await response.json();
    dispatch(fetchAdminStats());
    return data;
  }
);

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminStats.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAdminStats.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.stats = action.payload;
      })
      .addCase(fetchAdminStats.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || null;
      })
      .addCase(fetchAirports.fulfilled, (state, action) => {
        state.airports = action.payload;
      })
      .addCase(fetchAirplanes.fulfilled, (state, action) => {
        state.airplanes = action.payload;
      });
  },
});

export default adminSlice.reducer;
