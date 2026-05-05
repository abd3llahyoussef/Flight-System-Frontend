import { configureStore } from "@reduxjs/toolkit";
import flightsReducer from "./features/flights/flightsSlice";
import authReducer from "./features/auth/authSlice";
import ticketsReducer from "./features/tickets/ticketsSlice";
import adminReducer from "./features/admin/adminSlice";

export const store = configureStore({
  reducer: {
    flights: flightsReducer,
    auth: authReducer,
    tickets: ticketsReducer,
    admin: adminReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
