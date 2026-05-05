import { useMemo, useState, useEffect } from "react";
import heroImg from "@/assets/hero-flight.jpg";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SearchForm } from "@/components/SearchForm";
import { FlightCard } from "@/components/FlightCard";
import { Stepper } from "@/components/Stepper";
import { SeatMap } from "@/components/SeatMap";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  CreditCard,
  Lock,
  Plane,
  Shield,
  Sparkles,
  Wifi,
  Zap,
  Loader2,
} from "lucide-react";
import type { Flight, SearchQuery } from "@/lib/flights";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { fetchFlights, setSearchQuery } from "@/lib/features/flights/flightsSlice";
import { bookTicket, fetchReservedSeats } from "@/lib/features/tickets/ticketsSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { NationalitySelect } from "@/components/NationalitySelect";

type Step = "search" | "results" | "seat" | "checkout" | "done";

const Index = () => {
  const [step, setStep] = useState<Step>("search");
  const [query, setQuery] = useState<SearchQuery | null>(null);
  const [flight, setFlight] = useState<Flight | null>(null);
  const [seats, setSeats] = useState<string[]>([]);
  const [dependants, setDependants] = useState<any[]>([]);
  const [sort, setSort] = useState<"price" | "duration" | "depart">("price");
  const [bookingRef, setBookingRef] = useState("");
  const [mainPassport, setMainPassport] = useState("");
  const [mainNationality, setMainNationality] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const userStr = params.get("user");

    if (token && userStr) {
      try {
        const userData = JSON.parse(decodeURIComponent(userStr));
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(userData));
        // Remove params from URL without refreshing
        window.history.replaceState({}, document.title, window.location.pathname);
        // Force a reload or handle state update
        window.location.reload();
      } catch (err) {
        console.error("Error parsing Google user data:", err);
      }
    }
  }, []);

  useEffect(() => {
    if (user) {
      setMainPassport(user.passport || "");
      setMainNationality(user.nationality || "");
    }
  }, [user]);

  const validatePassport = (p: string) => /^[A-Z]\d{8}$/.test(p);

  const handleSearch = (q: SearchQuery) => {
    dispatch(setSearchQuery(q));
    dispatch(fetchFlights(q));
    setQuery(q);
    setStep("results");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleConfirmBooking = async () => {
    if (!user) {
      toast.info("Please sign in to complete your booking");
      navigate("/signin");
      return;
    }

    const newErrors: Record<string, string> = {};
    if (!validatePassport(mainPassport)) {
      newErrors.mainPassport = "Passport must be 1 capital letter followed by 8 digits (e.g. P12345678)";
    }
    if (!mainNationality) {
      newErrors.mainNationality = "Nationality is required";
    }

    dependants.forEach((d, i) => {
      if (!validatePassport(d.passport)) {
        newErrors[`depPassport_${i}`] = "Passport must be 1 capital letter followed by 8 digits";
      }
      if (!d.nationality) {
        newErrors[`depNationality_${i}`] = "Nationality is required";
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error("Please fix validation errors before proceeding.");
      return;
    }

    try {
      // Map dependants to seats (excluding main user seat at index 0)
      const dependantData = dependants.map((d, i) => ({
        ...d,
        seatNumber: seats[i + 1],
      }));

      const resultAction = await dispatch(bookTicket({
        flightId: flight?.id,
        seatNumber: seats[0],
        seatClass: query?.cabin.toUpperCase() || "ECONOMY",
        passport: mainPassport,
        nationality: mainNationality,
        dependants: dependantData,
      }));

      if (bookTicket.fulfilled.match(resultAction)) {
        setBookingRef(resultAction.payload.paymentId || `AW-${resultAction.payload.id + 100000}`);
        setStep("done");
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        toast.error("Booking failed. Please try again.");
      }
    } catch (err) {
      toast.error("An error occurred during booking.");
    }
  };

  const stepNumber = step === "search" ? 1 : step === "results" ? 2 : step === "seat" ? 3 : 4;

  return (
    <div className="min-h-screen bg-background">
      {step === "search" ? (
        <HeroSearch onSearch={handleSearch} />
      ) : (
        <>
          <Navbar variant="solid" />
          <div className="border-b border-border bg-card/50">
            <div className="container py-5 flex flex-wrap items-center justify-between gap-4">
              <Stepper step={stepNumber} />
              {query && flight && step !== "done" && (
                <div className="text-xs md:text-sm text-muted-foreground flex items-center gap-2">
                  <Plane className="h-3.5 w-3.5 -rotate-45 text-accent" />
                  <span className="font-semibold text-foreground">{query.from}</span>
                  <ArrowRight className="h-3 w-3" />
                  <span className="font-semibold text-foreground">{query.to}</span>
                  <span>· {query.depart}</span>
                </div>
              )}
            </div>
          </div>

          <main className="container py-10 md:py-14">
            {step === "results" && query && (
              <ResultsView
                query={query}
                sort={sort}
                onSort={setSort}
                onBack={() => setStep("search")}
                onSelect={(f) => {
                  setFlight(f);
                  setSeats([]);
                  dispatch(fetchReservedSeats(Number(f.id)));
                  setStep("seat");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              />
            )}

            {step === "seat" && flight && query && (
              <SeatView
                flight={flight}
                query={query}
                seats={seats}
                onChange={setSeats}
                onBack={() => setStep("results")}
                onContinue={() => {
                  // Initialize dependants array with empty objects for extra passengers
                  const extrasCount = query.passengers - 1;
                  setDependants(Array(extrasCount).fill({ name: "", email: "", dob: "", gender: "Male", nationality: "", passport: "" }));
                  setStep("checkout");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              />
            )}

            {step === "checkout" && flight && query && (
              <CheckoutView
                flight={flight}
                query={query}
                seats={seats}
                dependants={dependants}
                onDependantChange={(idx, data) => {
                  const newDeps = [...dependants];
                  newDeps[idx] = data;
                  setDependants(newDeps);
                }}
                onBack={() => setStep("seat")}
                onConfirm={handleConfirmBooking}
                mainPassport={mainPassport}
                setMainPassport={setMainPassport}
                mainNationality={mainNationality}
                setMainNationality={setMainNationality}
                errors={errors}
              />
            )}

            {step === "done" && flight && query && (
              <ConfirmationView
                flight={flight}
                query={query}
                seats={seats}
                reference={bookingRef}
                onNew={() => {
                  setStep("search");
                  setFlight(null);
                  setSeats([]);
                }}
              />
            )}
          </main>
        </>
      )}
      <Footer />
    </div>
  );
};

const HeroSearch = ({ onSearch }: { onSearch: (q: SearchQuery) => void }) => (
  <section className="relative min-h-[760px] overflow-hidden">
    <Navbar />
    <img
      src={heroImg}
      alt="View from airplane window"
      className="absolute inset-0 h-full w-full object-cover"
    />
    <div className="absolute inset-0 bg-hero opacity-80" />
    <div className="absolute inset-0 bg-gradient-to-b from-primary/20 via-transparent to-background" />

    <div className="relative container pt-32 md:pt-40 pb-20">
      <div className="max-w-2xl text-primary-foreground animate-fade-up">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur border border-white/15 text-xs font-medium mb-6">
          <Sparkles className="h-3.5 w-3.5 text-teal" />
          Smart fares · Best price guarantee
        </div>
        <h1 className="font-display text-5xl md:text-7xl font-light leading-[1.05] tracking-tight text-balance">
          The sky, <em className="not-italic font-semibold text-teal">simplified.</em>
        </h1>
        <p className="mt-5 text-lg md:text-xl text-primary-foreground/80 max-w-xl font-light">
          Search hundreds of airlines, choose your seat, and check out in under a minute.
        </p>
      </div>

      <div className="mt-10 md:mt-14 max-w-5xl mx-auto animate-fade-up">
        <SearchForm onSearch={onSearch} />
      </div>
    </div>
  </section>
);

const ResultsView = ({
  query,
  sort,
  onSort,
  onBack,
  onSelect,
}: {
  query: SearchQuery;
  sort: "price" | "duration" | "depart";
  onSort: (s: "price" | "duration" | "depart") => void;
  onBack: () => void;
  onSelect: (f: Flight) => void;
}) => {
  const reduxFlights = useAppSelector((state) => state.flights.items);
  const status = useAppSelector((state) => state.flights.status);

  const flights = useMemo(() => {
    return [...reduxFlights].sort((a, b) => {
      if (sort === "price") return a.price - b.price;
      if (sort === "depart") return a.depart.localeCompare(b.depart);
      return parseInt(a.duration) - parseInt(b.duration);
    });
  }, [sort, reduxFlights]);

  return (
    <div className="grid lg:grid-cols-[280px_1fr] gap-8">
      <aside className="space-y-6">
        <Button variant="ghost" size="sm" onClick={onBack} className="-ml-2">
          <ArrowLeft className="h-4 w-4" /> Modify search
        </Button>
        <FilterCard title="Sort by">
          {(["price", "duration", "depart"] as const).map((s) => (
            <button
              key={s}
              onClick={() => onSort(s)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${sort === s ? "bg-primary text-primary-foreground font-medium" : "hover:bg-muted"
                }`}
            >
              {s === "price" ? "Lowest price" : s === "duration" ? "Shortest" : "Earliest depart"}
            </button>
          ))}
        </FilterCard>
      </aside>

      <section>
        <h2 className="font-display text-3xl md:text-4xl font-semibold tracking-tight mb-6">
          {flights.length} flights found
        </h2>
        <div className="space-y-3">
          {status === "loading" ? (
            <div className="py-10 text-center text-muted-foreground">Loading flights...</div>
          ) : (
            flights.map((f) => <FlightCard key={f.id} flight={f} onSelect={onSelect} />)
          )}
        </div>
      </section>
    </div>
  );
};

const FilterCard = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="bg-card rounded-xl border border-border/60 p-4 shadow-card">
    <h3 className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-3">{title}</h3>
    <div className="space-y-1">{children}</div>
  </div>
);

const SeatView = ({
  flight,
  query,
  seats,
  onChange,
  onBack,
  onContinue,
}: {
  flight: Flight;
  query: SearchQuery;
  seats: string[];
  onChange: (s: string[]) => void;
  onBack: () => void;
  onContinue: () => void;
}) => {
  const { reservedSeats } = useAppSelector((state) => state.tickets);

  return (
    <div className="grid lg:grid-cols-[1fr_360px] gap-8">
      <div>
        <Button variant="ghost" size="sm" onClick={onBack} className="-ml-2 mb-4">
          <ArrowLeft className="h-4 w-4" /> Back to flights
        </Button>
        <h2 className="font-display text-3xl md:text-4xl font-semibold tracking-tight mb-2">
          Choose your seat
        </h2>
        <SeatMap
          selected={seats}
          onChange={onChange}
          count={query.passengers}
          reservedSeats={reservedSeats}
          cabin={query.cabin}
        />
      </div>

      <SummarySidebar flight={flight} query={query} seats={seats}>
        <Button
          variant="hero"
          size="lg"
          className="w-full"
          disabled={seats.length !== query.passengers}
          onClick={onContinue}
        >
          Continue to checkout <ArrowRight className="h-4 w-4" />
        </Button>
      </SummarySidebar>
    </div>
  );
};

const CheckoutView = ({
  flight,
  query,
  seats,
  dependants,
  onDependantChange,
  onBack,
  onConfirm,
  mainPassport,
  setMainPassport,
  mainNationality,
  setMainNationality,
  errors,
}: {
  flight: Flight;
  query: SearchQuery;
  seats: string[];
  dependants: any[];
  onDependantChange: (idx: number, data: any) => void;
  onBack: () => void;
  onConfirm: () => void;
  mainPassport: string;
  setMainPassport: (v: string) => void;
  mainNationality: string;
  setMainNationality: (v: string) => void;
  errors: Record<string, string>;
}) => {
  const { user } = useAppSelector((state) => state.auth);
  const { status } = useAppSelector((state) => state.tickets);

  return (
    <div className="grid lg:grid-cols-[1fr_360px] gap-8">
      <div className="space-y-8">
        <Button variant="ghost" size="sm" onClick={onBack} className="-ml-2">
          <ArrowLeft className="h-4 w-4" /> Back to seats
        </Button>
        <h2 className="font-display text-3xl md:text-4xl font-semibold tracking-tight">
          Review and pay
        </h2>

        <Section title="Main Passenger">
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Name" value={user?.name || ""} readOnly />
            <Field label="Email" type="email" value={user?.email || ""} readOnly />
            <Field label="Seat" value={seats[0]} readOnly />
            <Field
              label="Passport Number"
              value={mainPassport}
              onChange={setMainPassport}
              required
            />
            {errors.mainPassport && <p className="text-xs text-destructive mt-1">{errors.mainPassport}</p>}
            <NationalitySelect
              value={mainNationality}
              onChange={setMainNationality}
              required
            />
            {errors.mainNationality && <p className="text-xs text-destructive mt-1">{errors.mainNationality}</p>}
          </div>
        </Section>

        {dependants.map((dep, idx) => (
          <Section key={idx} title={`Passenger ${idx + 2}`}>
            <div className="grid sm:grid-cols-2 gap-4">
              <Field
                label="Full Name"
                value={dep.name}
                onChange={(v) => onDependantChange(idx, { ...dep, name: v })}
                required
              />
              <Field
                label="Email (Optional)"
                type="email"
                value={dep.email}
                onChange={(v) => onDependantChange(idx, { ...dep, email: v })}
              />
              <Field
                label="Date of Birth"
                type="date"
                value={dep.dob}
                onChange={(v) => onDependantChange(idx, { ...dep, dob: v })}
              />
              <Field label="Seat" value={seats[idx + 1]} readOnly />
              <Field
                label="Passport Number"
                value={dep.passport}
                onChange={(v) => onDependantChange(idx, { ...dep, passport: v })}
                required
              />
              {errors[`depPassport_${idx}`] && <p className="text-xs text-destructive mt-1">{errors[`depPassport_${idx}`]}</p>}
              <NationalitySelect
                value={dep.nationality}
                onChange={(v) => onDependantChange(idx, { ...dep, nationality: v })}
                required
              />
              {errors[`depNationality_${idx}`] && <p className="text-xs text-destructive mt-1">{errors[`depNationality_${idx}`]}</p>}
            </div>
          </Section>
        ))}

        <Section title="Payment" icon={<Lock className="h-3.5 w-3.5" />}>
          <div className="grid gap-4">
            <Field label="Card number" icon={<CreditCard className="h-4 w-4" />} defaultValue="4242 4242 4242 4242" />
          </div>
        </Section>
      </div>

      <SummarySidebar flight={flight} query={query} seats={seats}>
        <Button
          variant="hero"
          size="lg"
          className="w-full"
          onClick={onConfirm}
          disabled={status === "loading" || dependants.some(d => !d.name)}
        >
          {status === "loading" ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Lock className="h-4 w-4 mr-2" />}
          Confirm & pay
        </Button>
      </SummarySidebar>
    </div>
  );
};

const Section = ({ title, icon, children }: { title: string; icon?: React.ReactNode; children: React.ReactNode }) => (
  <div className="mb-8">
    <h3 className="font-display text-lg font-semibold mb-4 flex items-center gap-2">
      {icon} {title}
    </h3>
    <div className="bg-card border border-border/60 rounded-2xl p-5 md:p-6 shadow-card">{children}</div>
  </div>
);

const Field = ({
  label,
  type = "text",
  defaultValue,
  value,
  onChange,
  icon,
  readOnly,
  required,
}: {
  label: string;
  type?: string;
  defaultValue?: string;
  value?: string;
  onChange?: (v: string) => void;
  icon?: React.ReactNode;
  readOnly?: boolean;
  required?: boolean;
}) => (
  <div>
    <Label className="text-xs uppercase tracking-wider text-muted-foreground font-medium">{label}</Label>
    <div className="relative mt-1.5">
      {icon && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">{icon}</span>}
      <Input
        type={type}
        defaultValue={defaultValue}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        readOnly={readOnly}
        required={required}
        className={`h-11 ${icon ? "pl-10" : ""}`}
      />
    </div>
  </div>
);

const SummarySidebar = ({
  flight,
  query,
  seats,
  children,
}: {
  flight: Flight;
  query: SearchQuery;
  seats: string[];
  children: React.ReactNode;
}) => {
  const subtotal = flight.price * query.passengers;
  const taxes = Math.round(subtotal * 0.12);
  const total = subtotal + taxes;

  return (
    <aside className="lg:sticky lg:top-6 h-fit">
      <div className="bg-card border border-border/60 rounded-2xl p-6 shadow-elegant">
        <div className="flex items-center gap-2 mb-4">
          <div className="font-semibold text-sm">{flight.airline}</div>
          <div className="text-xs text-muted-foreground">{flight.code}</div>
        </div>

        <div className="space-y-2 text-sm">
          <Row label="Fare" value={`$${subtotal}`} />
          <Row label="Taxes" value={`$${taxes}`} />
          <div className="h-px bg-border my-3" />
          <div className="flex items-center justify-between">
            <span className="font-semibold">Total</span>
            <span className="font-display text-2xl font-semibold text-primary">${total}</span>
          </div>
        </div>

        <div className="mt-5">{children}</div>
      </div>
    </aside>
  );
};

const Row = ({ label, value }: { label: string; value: string }) => (
  <div className="flex items-center justify-between text-muted-foreground">
    <span>{label}</span>
    <span className="text-foreground font-medium">{value}</span>
  </div>
);

const ConfirmationView = ({
  flight,
  query,
  seats,
  reference,
  onNew,
}: {
  flight: Flight;
  query: SearchQuery;
  seats: string[];
  reference: string;
  onNew: () => void;
}) => (
  <div className="max-w-2xl mx-auto text-center animate-fade-up">
    <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-teal-gradient shadow-glow mb-6">
      <CheckCircle2 className="h-8 w-8 text-primary-foreground" />
    </div>
    <h2 className="font-display text-4xl md:text-5xl font-semibold tracking-tight mb-3">
      You're all set.
    </h2>
    <p className="text-muted-foreground text-lg mb-10">
      Booking confirmed · Reference <span className="font-mono font-semibold text-foreground">{reference}</span>
    </p>
    <Button variant="ocean" size="lg" onClick={onNew} className="mt-8">
      Book another flight <ArrowRight className="h-4 w-4" />
    </Button>
  </div>
);

export default Index;
