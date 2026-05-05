export type Trip = "oneway" | "roundtrip";
export type CabinClass = "Economy" | "Premium" | "Business" | "First";

export interface SearchQuery {
  from: string;
  to: string;
  depart: string;
  return: string;
  passengers: number;
  cabin: CabinClass;
  trip: Trip;
}

export interface Flight {
  id: string;
  airline: string;
  code: string;
  depart: string;
  arrive: string;
  departDate: string;
  arriveDate: string;
  duration: string;
  stops: number;
  stopCity?: string;
  price: number;
  aircraft: string;
  from: string;
  to: string;
}
export interface Seat {
  id: string;
  row: number;
  col: string;
  taken: boolean;
  premium: boolean;
}

export const AIRPORTS = [
  { code: "JFK", city: "New York" },
  { code: "LAX", city: "Los Angeles" },
  { code: "LHR", city: "London" },
  { code: "CDG", city: "Paris" },
  { code: "NRT", city: "Tokyo" },
  { code: "DXB", city: "Dubai" },
  { code: "SIN", city: "Singapore" },
  { code: "SYD", city: "Sydney" },
  { code: "BCN", city: "Barcelona" },
  { code: "AMS", city: "Amsterdam" },
];


export function generateSeats(reservedIds: string[] = []): Seat[] {
  const cols = ["A", "B", "C", "D", "E", "F"];
  const rows = 14;
  const seats: Seat[] = [];
  for (let r = 1; r <= rows; r++) {
    for (const c of cols) {
      const id = `${r}${c}`;
      seats.push({
        id,
        row: r,
        col: c,
        taken: reservedIds.includes(id),
        premium: r <= 3, // Rows 1-3 are Premium/Business/First
      });
    }
  }
  return seats;
}
