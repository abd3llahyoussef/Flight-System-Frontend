import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  Download,
  Luggage,
  Plane,
  QrCode,
  Search,
  Loader2,
  AlertCircle,
  X,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { fetchMyTickets, lookupBooking, clearLookup } from "@/lib/features/tickets/ticketsSlice";
import { Link } from "react-router-dom";

const Trips = () => {
  const [tab, setTab] = useState<"past" | "upcoming" | "lookup">("upcoming");
  const [refInput, setRefInput] = useState("");
  const [lastNameInput, setLastNameInput] = useState("");
  const dispatch = useAppDispatch();
  const { items: tickets, status, lookedUpTicket, lookupStatus, lookupError } = useAppSelector((state) => state.tickets);

  const { user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (user) {
      dispatch(fetchMyTickets());
    }
  }, [dispatch, user]);

  // Clear lookup state when switching away from the lookup tab
  useEffect(() => {
    if (tab !== "lookup") {
      dispatch(clearLookup());
      setRefInput("");
      setLastNameInput("");
    }
  }, [tab, dispatch]);

  const filtered = tickets.filter((t) => {
    return tab === "past" ? new Date(t.date) < new Date() : new Date(t.date) >= new Date()
  }
  );

  const handleLookup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!refInput.trim() || !lastNameInput.trim()) return;
    dispatch(lookupBooking({ ref: refInput.trim(), lastName: lastNameInput.trim() }));
  };

  const handleClearLookup = () => {
    dispatch(clearLookup());
    setRefInput("");
    setLastNameInput("");
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar variant="solid" />
        <main className="flex-1 container flex flex-col items-center justify-center py-20 text-center">
          <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center mb-6">
            <Lock className="h-8 w-8 text-muted-foreground" />
          </div>
          <h1 className="font-display text-3xl font-semibold mb-2">Sign in to view your trips</h1>
          <p className="text-muted-foreground max-w-sm mb-8">
            Manage your bookings, check in online, and access your boarding passes in one place.
          </p>
          <div className="flex gap-4">
            <Link to="/signin">
              <Button variant="hero" size="lg">Sign In</Button>
            </Link>
            <Link to="/signup">
              <Button variant="outline" size="lg">Create Account</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar variant="solid" />

      <main className="container py-12 md:py-16">
        <div className="max-w-2xl">
          <h1 className="font-display text-4xl md:text-5xl font-semibold tracking-tight">
            My Trips
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">
            Manage bookings, check in, and download your boarding pass.
          </p>
        </div>

        <div className="mt-8 inline-flex p-1 rounded-xl bg-muted">
          {(["upcoming", "past", "lookup"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${tab === t ? "bg-background text-foreground shadow-card" : "text-muted-foreground hover:text-foreground"
                }`}
            >
              {t === "lookup" ? "Find a booking" : t}
            </button>
          ))}
        </div>

        {tab === "lookup" ? (
          <div className="mt-8 max-w">
            {/* Search form */}
            {lookupStatus !== "succeeded" && (
              <form onSubmit={handleLookup} className="bg-card border border-border/60 rounded-2xl p-6 md:p-8 shadow-card w-1/2">
                <h2 className="font-display text-2xl font-semibold mb-1">Find your booking</h2>
                <p className="text-sm text-muted-foreground mb-6">
                  Enter your reference and last name to retrieve your trip.
                </p>
                <div className="grid gap-4">
                  <div>
                    <Label className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
                      Booking reference
                    </Label>
                    <Input
                      placeholder="AW-123456"
                      className="h-11 mt-1.5 font-mono"
                      value={refInput}
                      onChange={(e) => setRefInput(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
                      Last name
                    </Label>
                    <Input
                      placeholder="Morgan"
                      className="h-11 mt-1.5"
                      value={lastNameInput}
                      onChange={(e) => setLastNameInput(e.target.value)}
                      required
                    />
                  </div>

                  {/* Error message */}
                  {lookupStatus === "failed" && (
                    <div className="flex items-center gap-2 text-sm text-red-500 bg-red-500/10 rounded-lg px-4 py-3">
                      <AlertCircle className="h-4 w-4 shrink-0" />
                      <span>{lookupError || "Booking not found. Please check your reference and last name."}</span>
                    </div>
                  )}

                  <Button
                    type="submit"
                    variant="hero"
                    size="lg"
                    className="mt-2"
                    disabled={lookupStatus === "loading"}
                  >
                    {lookupStatus === "loading" ? (
                      <><Loader2 className="h-4 w-4 animate-spin" /> Searching...</>
                    ) : (
                      <><Search className="h-4 w-4" /> Find booking</>
                    )}
                  </Button>
                </div>
              </form>
            )}

            {/* Result card */}
            {lookupStatus === "succeeded" && lookedUpTicket && (
              <div className="animate-fade-up">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-display text-2xl font-semibold">Booking found</h2>
                  <Button variant="ghost" size="sm" onClick={handleClearLookup}>
                    <X className="h-4 w-4" /> New search
                  </Button>
                </div>
                <article className="bg-card border  rounded-2xl p-6 shadow-card">
                  <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
                    <div className="flex items-center gap-3">
                      <div className="h-11 w-11 rounded-xl bg-secondary flex items-center justify-center">
                        <Plane className="h-5 w-5 -rotate-45 text-accent" />
                      </div>
                      <div>
                        <div className="font-semibold">{lookedUpTicket.airline}</div>
                        <div className="text-xs text-muted-foreground">
                          {lookedUpTicket.code} · Ref <span className="font-mono">{lookedUpTicket.ref}</span>
                        </div>
                      </div>
                    </div>
                    <span
                      className={`text-xs uppercase tracking-wider px-3 py-1 rounded-full font-semibold ${lookedUpTicket.status === "Upcoming"
                        ? "bg-teal/15 text-teal"
                        : lookedUpTicket.status === "Pending"
                          ? "bg-amber-500/15 text-amber-500"
                          : "bg-muted text-muted-foreground"
                        }`}
                    >
                      {lookedUpTicket.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 items-center text-center bg-muted/40 rounded-xl py-5">
                    <div>
                      <div className="font-display text-3xl font-semibold">{lookedUpTicket.depart}</div>
                      <div className="text-xs text-muted-foreground mt-1">{lookedUpTicket.from}</div>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      <Clock className="h-3.5 w-3.5 mx-auto mb-1" />
                      <div className="my-1 mx-auto w-12 h-px bg-border" />
                      <div>{lookedUpTicket.date}</div>
                    </div>
                    <div>
                      <div className="font-display text-3xl font-semibold">{lookedUpTicket.arrive}</div>
                      <div className="text-xs text-muted-foreground mt-1">{lookedUpTicket.to}</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-5 text-sm">
                    <Info label="Seat" value={[lookedUpTicket.seat, ...(lookedUpTicket.dependants || []).map((d: any) => d.seatNumber || "Held")].join(", ")} />
                    <Info label="Gate" value={lookedUpTicket.gate} />
                    <Info label="Price" value={`$${lookedUpTicket.price}`} />
                    <Info label="Status" value={lookedUpTicket.status} />
                  </div>
                </article>
              </div>
            )}
          </div>
        ) : (
          <div className="mt-8 grid gap-4">
            {status === "loading" && (
              <div className="py-20 text-center">
                <Loader2 className="h-10 w-10 animate-spin mx-auto text-accent mb-4" />
                <p className="text-muted-foreground">Loading your trips...</p>
              </div>
            )}
            {status !== "loading" && filtered.length === 0 && (
              <div className="bg-card border border-border/60 rounded-2xl p-10 text-center shadow-card">
                <p className="text-muted-foreground">No {tab} trips yet.</p>
                <Link to="/">
                  <Button variant="link" className="mt-2 text-accent">Book a flight now</Button>
                </Link>
              </div>
            )}
            {status !== "loading" && filtered.map((t) => (
              <article
                key={t.ref}
                className="bg-card border border-border/60 rounded-2xl p-6 shadow-card hover:shadow-elegant transition-shadow"
              >
                <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
                  <div className="flex items-center gap-3">
                    <div className="h-11 w-11 rounded-xl bg-secondary flex items-center justify-center">
                      <Plane className="h-5 w-5 -rotate-45 text-accent" />
                    </div>
                    <div>
                      <div className="font-semibold">{t.airline}</div>
                      <div className="text-xs text-muted-foreground">
                        {t.code} · Ref <span className="font-mono">{t.ref}</span>
                      </div>
                    </div>
                  </div>
                  <span
                    className={`text-xs uppercase tracking-wider px-3 py-1 rounded-full font-semibold ${t.status === "Upcoming"
                      ? "bg-teal/15 text-teal"
                      : "bg-muted text-muted-foreground"
                      }`}
                  >
                    {t.status}
                  </span>
                </div>

                <div className="grid grid-cols-3 items-center text-center bg-muted/40 rounded-xl py-5">
                  <div>
                    <div className="font-display text-3xl font-semibold">{t.depart}</div>
                    <div className="text-xs text-muted-foreground mt-1">{t.from}</div>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    <Clock className="h-3.5 w-3.5 mx-auto mb-1" />
                    <div className="my-1 mx-auto w-12 h-px bg-border" />
                    <div>{t.date}</div>
                  </div>
                  <div>
                    <div className="font-display text-3xl font-semibold">{t.arrive}</div>
                    <div className="text-xs text-muted-foreground mt-1">{t.to}</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-5 text-sm">
                  <Info label="Seat" value={[t.seat, ...(t.dependants || []).map((d: any) => d.seatNumber || "Held")].join(", ")} />
                  <Info label="Gate" value={t.gate} />
                  <Info label="Cabin" value={t.seatClass} />
                  <Info label="Bags" value="1 checked" icon={<Luggage className="h-3.5 w-3.5" />} />
                </div>

                {t.status === "Upcoming" && (
                  <div className="flex flex-wrap gap-2 mt-6 pt-5 border-t border-border">
                    <Button variant="hero" size="sm">
                      <CheckCircle2 className="h-4 w-4" /> Check in
                    </Button>
                    <Button variant="outline" size="sm">
                      <QrCode className="h-4 w-4" /> Boarding pass
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4" /> Receipt
                    </Button>
                    <Button variant="ghost" size="sm" className="ml-auto">
                      Manage <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </article>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

const Info = ({ label, value, icon }: { label: string; value: string; icon?: React.ReactNode }) => (
  <div>
    <div className="text-xs uppercase tracking-wider text-muted-foreground font-medium flex items-center gap-1">
      {icon} {label}
    </div>
    <div className="font-semibold mt-1">{value}</div>
  </div>
);

const Lock = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

export default Trips;
