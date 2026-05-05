import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Flight, SearchQuery } from "@/lib/flights";

interface FlightsState {
  items: Flight[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  searchQuery: SearchQuery | null;
}

const initialState: FlightsState = {
  items: [],
  status: "idle",
  error: null,
  searchQuery: null,
};

export const fetchFlights = createAsyncThunk(
  "flights/fetchFlights",
  async (query: SearchQuery) => {
    const params = new URLSearchParams();
    if (query.from) params.append("from", query.from);
    if (query.to) params.append("to", query.to);
    if (query.depart) params.append("date", query.depart);

    const response = await fetch(`/api/flights?${params.toString()}`);
    if (!response.ok) {
      throw new Error("Failed to fetch flights");
    }
    const data = await response.json();
    return data as Flight[];
  }
);

export const flightsSlice = createSlice({
  name: "flights",
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<SearchQuery>) => {
      state.searchQuery = action.payload;
    },
    clearSearchQuery: (state) => {
      state.searchQuery = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFlights.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchFlights.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchFlights.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Something went wrong";
      });
  },
});

export const { setSearchQuery, clearSearchQuery } = flightsSlice.actions;

export default flightsSlice.reducer;
