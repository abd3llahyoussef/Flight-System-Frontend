import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../../store";

interface Ticket {
  id: number;
  ref: string;
  status: string;
  airline: string;
  code: string;
  from: string;
  to: string;
  date: string;
  depart: string;
  arrive: string;
  seat: string;
  gate: string;
  price: number;
  seatClass: string;
  dependants: any[];
}

interface TicketsState {
  items: Ticket[];
  reservedSeats: string[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  lookedUpTicket: Ticket | null;
  lookupStatus: "idle" | "loading" | "succeeded" | "failed";
  lookupError: string | null;
}

const initialState: TicketsState = {
  items: [],
  reservedSeats: [],
  status: "idle",
  error: null,
  lookedUpTicket: null,
  lookupStatus: "idle",
  lookupError: null,
};

export const fetchMyTickets = createAsyncThunk(
  "tickets/fetchMyTickets",
  async (_, { getState }) => {
    const state = getState() as RootState;
    const token = state.auth.token;
    
    const [ticketsRes, resRes] = await Promise.all([
      fetch("/api/tickets/my-tickets", {
        headers: { Authorization: `Bearer ${token}` },
      }),
      fetch("/api/reservations/my-reservations", {
        headers: { Authorization: `Bearer ${token}` },
      })
    ]);

    const ticketsData = await ticketsRes.json();
    const resData = await resRes.json();

    if (!ticketsRes.ok) throw new Error(ticketsData.message || "Failed to fetch tickets");
    if (!resRes.ok) throw new Error(resData.message || "Failed to fetch reservations");

    // Combine and sort by date/creation if possible, but for now just combine
    return [...ticketsData, ...resData] as Ticket[];
  }
);

export const bookTicket = createAsyncThunk(
  "tickets/bookTicket",
  async (bookingData: any, { getState }) => {
    const state = getState() as RootState;
    const token = state.auth.token;

    const response = await fetch("/api/tickets/book", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(bookingData),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Booking failed");
    }
    return await response.json();
  }
);

export const fetchReservedSeats = createAsyncThunk(
  "tickets/fetchReservedSeats",
  async (flightId: number) => {
    const response = await fetch(`/api/tickets/flight/${flightId}/reserved-seats`);
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch reserved seats");
    }
    return data as string[];
  }
);

export const lookupBooking = createAsyncThunk(
  "tickets/lookupBooking",
  async ({ ref, lastName }: { ref: string; lastName: string }) => {
    const params = new URLSearchParams({ ref, lastName });
    
    // Try tickets first
    let response = await fetch(`/api/tickets/lookup?${params.toString()}`);
    let data = await response.json();
    
    if (!response.ok) {
      // If not found in tickets, try reservations
      response = await fetch(`/api/reservations/lookup?${params.toString()}`);
      data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || "Booking not found");
      }
    }
    return data as Ticket;
  }
);

export const createReservation = createAsyncThunk(
  "tickets/createReservation",
  async (resData: any, { getState }) => {
    const state = getState() as RootState;
    const token = state.auth.token;

    const response = await fetch("/api/reservations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(resData),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Failed to create reservation");
    }
    return data;
  }
);

export const ticketsSlice = createSlice({
  name: "tickets",
  initialState,
  reducers: {
    clearLookup: (state) => {
      state.lookedUpTicket = null;
      state.lookupStatus = "idle";
      state.lookupError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyTickets.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchMyTickets.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchMyTickets.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to fetch tickets";
      })
      .addCase(fetchReservedSeats.fulfilled, (state, action) => {
        state.reservedSeats = action.payload;
      })
      .addCase(lookupBooking.pending, (state) => {
        state.lookupStatus = "loading";
        state.lookupError = null;
        state.lookedUpTicket = null;
      })
      .addCase(lookupBooking.fulfilled, (state, action) => {
        state.lookupStatus = "succeeded";
        state.lookedUpTicket = action.payload;
      })
      .addCase(lookupBooking.rejected, (state, action) => {
        state.lookupStatus = "failed";
        state.lookupError = action.error.message || "Booking not found";
      });
  },
});

export const { clearLookup } = ticketsSlice.actions;

export default ticketsSlice.reducer;

