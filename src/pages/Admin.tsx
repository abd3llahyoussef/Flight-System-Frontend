import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  DollarSign,
  Plane,
  TrendingUp,
  Users,
  Plus,
  Loader2,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { fetchAdminStats, createFlight, fetchAirports, fetchAirplanes } from "@/lib/features/admin/adminSlice";

const Admin = () => {
  const dispatch = useAppDispatch();
  const { stats, status, airports, airplanes } = useAppSelector((state) => state.admin);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [flightData, setFlightData] = useState({
    flightNumber: "",
    airline: "Aurora Air",
    departureAirportId: "",
    arrivalAirportId: "",
    airplaneId: "",
    departureTime: "",
    arrivalTime: "",
    basePrice: "",
  });

  useEffect(() => {
    dispatch(fetchAdminStats());
    dispatch(fetchAirports());
    dispatch(fetchAirplanes());
  }, [dispatch]);

  const handleCreateFlight = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await dispatch(createFlight(flightData)).unwrap();
      setIsModalOpen(false);
      setFlightData({
        flightNumber: "",
        airline: "Aurora Air",
        departureAirportId: "",
        arrivalAirportId: "",
        airplaneId: "",
        departureTime: "",
        arrivalTime: "",
        basePrice: "",
      });
    } catch (err) {
      console.error("Failed to create flight", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getKpis = () => {
    if (!stats) return [];
    return [
      { label: "Bookings today", value: stats.kpis.bookingsToday, delta: "+12.4%", up: true, icon: Activity },
      { label: "Revenue (24h)", value: `$${stats.kpis.revenue24h.toLocaleString()}`, delta: "+8.1%", up: true, icon: DollarSign },
      { label: "Active travelers", value: stats.kpis.activeTravelers.toLocaleString(), delta: "+2.3%", up: true, icon: Users },
      { label: "Cancellations", value: stats.kpis.cancellations, delta: "-4.0%", up: false, icon: TrendingUp },
    ];
  };

  const kpis = getKpis();

  return (
    <div className="min-h-screen bg-background">
      <Navbar variant="solid" />

      <main className="container py-12 md:py-16">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
          <div>
            <div className="text-xs uppercase tracking-wider text-accent font-semibold mb-2">
              Operations
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-semibold tracking-tight">
              Admin Dashboard
            </h1>
            <p className="text-muted-foreground mt-2">Live overview of bookings and flights.</p>
          </div>
          <div className="flex gap-3">
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
              <DialogTrigger asChild>
                <Button variant="hero">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Flight
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Create New Flight</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleCreateFlight} className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="flightNumber">Flight Number</Label>
                      <Input
                        id="flightNumber"
                        value={flightData.flightNumber}
                        onChange={(e) => setFlightData({ ...flightData, flightNumber: e.target.value })}
                        placeholder="e.g. AA100"
                        required
                        className="mt-1.5"
                      />
                    </div>
                    <div>
                      <Label htmlFor="airline">Airline</Label>
                      <Input
                        id="airline"
                        value={flightData.airline}
                        onChange={(e) => setFlightData({ ...flightData, airline: e.target.value })}
                        required
                        className="mt-1.5"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="departureAirportId">From</Label>
                      <select
                        id="departureAirportId"
                        className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mt-1.5"
                        value={flightData.departureAirportId}
                        onChange={(e) => setFlightData({ ...flightData, departureAirportId: e.target.value })}
                        required
                      >
                        <option value="" disabled>Select airport</option>
                        {airports.map(a => (
                          <option key={a.id} value={a.id}>{a.code} - {a.city}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="arrivalAirportId">To</Label>
                      <select
                        id="arrivalAirportId"
                        className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mt-1.5"
                        value={flightData.arrivalAirportId}
                        onChange={(e) => setFlightData({ ...flightData, arrivalAirportId: e.target.value })}
                        required
                      >
                        <option value="" disabled>Select airport</option>
                        {airports.map(a => (
                          <option key={a.id} value={a.id}>{a.code} - {a.city}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="airplaneId">Airplane</Label>
                    <select
                      id="airplaneId"
                      className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mt-1.5"
                      value={flightData.airplaneId}
                      onChange={(e) => setFlightData({ ...flightData, airplaneId: e.target.value })}
                      required
                    >
                      <option value="" disabled>Select airplane</option>
                      {airplanes.map(a => (
                        <option key={a.id} value={a.id}>{a.model} ({a.totalSeats} seats)</option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="departureTime">Departure Time</Label>
                      <Input
                        id="departureTime"
                        type="datetime-local"
                        value={flightData.departureTime}
                        onChange={(e) => setFlightData({ ...flightData, departureTime: e.target.value })}
                        required
                        className="mt-1.5"
                      />
                    </div>
                    <div>
                      <Label htmlFor="arrivalTime">Arrival Time</Label>
                      <Input
                        id="arrivalTime"
                        type="datetime-local"
                        value={flightData.arrivalTime}
                        onChange={(e) => setFlightData({ ...flightData, arrivalTime: e.target.value })}
                        required
                        className="mt-1.5"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="basePrice">Base Price ($)</Label>
                    <Input
                      id="basePrice"
                      type="number"
                      step="0.01"
                      value={flightData.basePrice}
                      onChange={(e) => setFlightData({ ...flightData, basePrice: e.target.value })}
                      placeholder="499.00"
                      required
                      className="mt-1.5"
                    />
                  </div>

                  <Button type="submit" className="w-full mt-4" disabled={isSubmitting}>
                    {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                    Create Flight
                  </Button>
                </form>
              </DialogContent>
            </Dialog>

          </div>
        </div>

        {status === "loading" && !stats ? (
          <div className="py-20 text-center flex flex-col items-center">
            <Loader2 className="h-10 w-10 animate-spin text-accent mb-4" />
            <p className="text-muted-foreground">Loading dashboard data...</p>
          </div>
        ) : stats ? (
          <>
            {/* KPIs */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {kpis.map((k) => (
                <div
                  key={k.label}
                  className="bg-card border border-border/60 rounded-2xl p-5 shadow-card"
                >
                  <div className="flex items-center justify-between">
                    <div className="h-10 w-10 rounded-xl bg-secondary flex items-center justify-center">
                      <k.icon className="h-4 w-4 text-accent" />
                    </div>
                    <span
                      className={`inline-flex items-center gap-0.5 text-xs font-semibold ${k.up ? "text-teal" : "text-destructive"
                        }`}
                    >
                      {k.up ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                      {k.delta}
                    </span>
                  </div>
                  <div className="mt-4 font-display text-3xl font-semibold tracking-tight">
                    {k.value}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">{k.label}</div>
                </div>
              ))}
            </div>

            {/* Two-column */}
            <div className="grid lg:grid-cols-[1.3fr_1fr] gap-6 mt-8">
              {/* Flights table */}
              <section className="bg-card border border-border/60 rounded-2xl shadow-card overflow-hidden">
                <header className="px-6 py-5 border-b border-border flex items-center justify-between">
                  <div>
                    <h2 className="font-display text-lg font-semibold">Today's flights</h2>
                    <p className="text-xs text-muted-foreground">Live operational status</p>
                  </div>
                  <Plane className="h-4 w-4 -rotate-45 text-accent" />
                </header>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-muted/40 text-xs uppercase tracking-wider text-muted-foreground">
                      <tr>
                        <th className="text-left font-semibold px-6 py-3">Flight</th>
                        <th className="text-left font-semibold px-4 py-3">Route</th>
                        <th className="text-left font-semibold px-4 py-3">Dep</th>
                        <th className="text-left font-semibold px-4 py-3">Status</th>
                        <th className="text-left font-semibold px-6 py-3">Load</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.flights.map((f) => (
                        <tr key={f.code} className="border-t border-border hover:bg-muted/30 transition-colors">
                          <td className="px-6 py-4 font-mono font-semibold">{f.code}</td>
                          <td className="px-4 py-4">{f.route}</td>
                          <td className="px-4 py-4 text-muted-foreground">{f.dep}</td>
                          <td className="px-4 py-4">
                            <StatusPill status={f.status} />
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <div className="h-1.5 w-24 rounded-full bg-muted overflow-hidden">
                                <div
                                  className="h-full bg-teal-gradient"
                                  style={{ width: `${f.load}%` }}
                                />
                              </div>
                              <span className="text-xs font-medium text-muted-foreground w-9">{f.load}%</span>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {stats.flights.length === 0 && (
                        <tr>
                          <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                            No flights scheduled for today.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </section>

              {/* Recent bookings */}
              <section className="bg-card border border-border/60 rounded-2xl shadow-card overflow-hidden">
                <header className="px-6 py-5 border-b border-border">
                  <h2 className="font-display text-lg font-semibold">Recent bookings</h2>
                  <p className="text-xs text-muted-foreground">Latest 5 transactions</p>
                </header>
                <ul className="divide-y divide-border">
                  {stats.bookings.map((b) => (
                    <li key={b.ref} className="px-6 py-4 flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <div className="font-semibold truncate">{b.name}</div>
                        <div className="text-xs text-muted-foreground font-mono">
                          {b.ref} · {b.route}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-display font-semibold">${b.amount}</div>
                        <StatusPill status={b.status} small />
                      </div>
                    </li>
                  ))}
                  {stats.bookings.length === 0 && (
                    <li className="px-6 py-8 text-center text-muted-foreground">
                      No recent bookings found.
                    </li>
                  )}
                </ul>
              </section>
            </div>
          </>
        ) : (
          <div className="py-20 text-center text-destructive">
            <p>Failed to load dashboard data.</p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

const StatusPill = ({ status, small }: { status: string; small?: boolean }) => {
  const map: Record<string, string> = {
    "On time": "bg-teal/15 text-teal",
    Boarding: "bg-accent/15 text-accent",
    Delayed: "bg-destructive/10 text-destructive",
    Scheduled: "bg-muted text-muted-foreground",
    Confirmed: "bg-teal/15 text-teal",
    Pending: "bg-amber-500/15 text-amber-500",
    Refunded: "bg-muted text-muted-foreground",
    Cancelled: "bg-destructive/10 text-destructive",
  };
  return (
    <span
      className={`inline-flex items-center px-2.5 ${small ? "py-0.5 text-[10px]" : "py-1 text-xs"
        } rounded-full font-semibold uppercase tracking-wider ${map[status] || "bg-muted text-muted-foreground"}`}
    >
      {status}
    </span>
  );
};

export default Admin;
