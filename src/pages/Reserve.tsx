import { useMemo, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Coffee,
  Luggage,
  Mail,
  Phone,
  Plane,
  Plus,
  Shield,
  Sparkles,
  Trash2,
  User,
  Users,
  Wifi,
} from "lucide-react";
import { AIRPORTS, type Flight, type SearchQuery } from "@/lib/flights";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { SearchForm } from "@/components/SearchForm";
import { FlightCard } from "@/components/FlightCard";
import { fetchFlights } from "@/lib/features/flights/flightsSlice";
import { NationalitySelect } from "@/components/NationalitySelect";
import { createReservation } from "@/lib/features/tickets/ticketsSlice";

type Extras = { bag: boolean; meal: boolean; wifi: boolean; insurance: boolean };
type Dependant = { name: string; email: string; dob: string; gender: string; passport: string; nationality: string };

const EXTRAS_PRICE = { bag: 35, meal: 18, wifi: 12, insurance: 24 };

const Reserve = () => {
  const dispatch = useAppDispatch();
  const { items: allFlights, status } = useAppSelector((state) => state.flights);
  const { user } = useAppSelector((state) => state.auth);

  const [query, setQuery] = useState<SearchQuery | null>(null);
  const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null);
  const [dependants, setDependants] = useState<Dependant[]>([]);
  const [extras, setExtras] = useState<Extras>({ bag: false, meal: false, wifi: false, insurance: true });
  const [submitted, setSubmitted] = useState(false);
  const [reference, setReference] = useState("");

  const [leadPassenger, setLeadPassenger] = useState({
    firstName: user?.name?.split(" ")[0] || "",
    lastName: user?.name?.split(" ")[1] || "",
    dob: "",
    gender: "Female",
    passport: user?.passport || "",
    nationality: user?.nationality || "",
    email: user?.email || "",
    phone: "",
  });

  useEffect(() => {
    if (user) {
      setLeadPassenger((prev) => ({
        ...prev,
        firstName: user.name?.split(" ")[0] || prev.firstName,
        lastName: user.name?.split(" ")[1] || prev.lastName,
        email: user.email || prev.email,
        passport: user.passport || prev.passport,
        nationality: user.nationality || prev.nationality,
      }));
    }
  }, [user]);

  const handleSearch = (q: SearchQuery) => {
    setQuery(q);
    dispatch(fetchFlights(q));
    setSelectedFlight(null);
  };

  const handleAddDependant = () => {
    setDependants([
      ...dependants,
      { name: "", email: "", dob: "", gender: "Female", passport: "", nationality: "" },
    ]);
  };

  const handleRemoveDependant = (index: number) => {
    setDependants(dependants.filter((_, i) => i !== index));
  };

  const updateDependant = (index: number, data: Partial<Dependant>) => {
    const newDeps = [...dependants];
    newDeps[index] = { ...newDeps[index], ...data };
    setDependants(newDeps);
  };

  const totalPassengers = 1 + dependants.length;
  const cabinMultiplier = query?.cabin === "First" ? 3.2 : query?.cabin === "Business" ? 2.4 : query?.cabin === "Premium" ? 1.5 : 1;
  const fare = selectedFlight ? Math.round(selectedFlight.price * cabinMultiplier) : 0;
  const subtotal = fare * totalPassengers;
  const extrasTotal =
    (extras.bag ? EXTRAS_PRICE.bag : 0) +
    (extras.meal ? EXTRAS_PRICE.meal : 0) +
    (extras.wifi ? EXTRAS_PRICE.wifi : 0) +
    (extras.insurance ? EXTRAS_PRICE.insurance : 0);
  const taxes = Math.round(subtotal * 0.12);
  const total = subtotal + taxes + extrasTotal * totalPassengers;

  const handleReserve = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFlight) return;

    try {
      const res = await dispatch(createReservation({
        flightId: selectedFlight.id,
        seatClass: query?.cabin.toUpperCase() || 'ECONOMY',
        totalPrice: total,
        leadFirstName: leadPassenger.firstName,
        leadLastName: leadPassenger.lastName,
        leadEmail: leadPassenger.email,
        leadPhone: leadPassenger.phone,
        passengers: dependants,
      })).unwrap();

      setReference(res.reference);
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err: any) {
      console.error("Reservation failed:", err);
      if (err.message.includes("401") || err.message.toLowerCase().includes("unauthorized")) {
        alert("Your session has expired or is invalid. Please log out and log in again.");
      } else {
        alert("Failed to create reservation. Please try again.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar variant="solid" />

      <section className="bg-hero text-primary-foreground">
        <div className="container py-14 md:py-16 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur border border-white/15 text-xs font-medium mb-5">
            <Sparkles className="h-3.5 w-3.5 text-teal" /> Hold your fare for 24 hours, free
          </div>
          <h1 className="font-display text-4xl md:text-6xl font-light tracking-tight">
            Reserve your <em className="not-italic font-semibold text-teal">flight.</em>
          </h1>
          <p className="mt-3 text-lg text-primary-foreground/80 font-light">
            Tell us where you're headed and we'll lock in your seat.
          </p>
        </div>
      </section>

      <main className="container py-12 md:py-16">
        {submitted ? (
          <Confirmation
            reference={reference}
            flight={selectedFlight}
            from={query?.from || ""}
            to={query?.to || ""}
            date={query?.depart || ""}
            total={total}
            onReset={() => setSubmitted(false)}
          />
        ) : !user ? (
          <div className="bg-card border border-border/60 rounded-2xl p-10 text-center shadow-card max-w-lg mx-auto">
            <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
              <User className="h-8 w-8 text-muted-foreground" />
            </div>
            <h2 className="font-display text-2xl font-semibold mb-2">Sign in to reserve</h2>
            <p className="text-muted-foreground mb-8">
              You need to be logged in to hold a fare and manage your bookings.
            </p>
            <div className="flex gap-4 justify-center">
              <Link to="/signin">
                <Button variant="hero">Sign In</Button>
              </Link>
              <Link to="/signup">
                <Button variant="outline">Create Account</Button>
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleReserve} className="grid lg:grid-cols-[1fr_360px] gap-8">
            <div className="space-y-8">
              {/* Trip Search */}
              <BookingSection title="Trip details" icon={<Plane className="h-3.5 w-3.5 -rotate-45" />}>
                {!selectedFlight ? (
                  <div className="space-y-6">
                    <SearchForm onSearch={handleSearch} compact initial={query || undefined} />
                    {query && (
                      <div className="pt-6 border-t border-border">
                        <h4 className="text-sm font-semibold mb-4">Available Flights</h4>
                        <div className="space-y-3">
                          {status === "loading" ? (
                            <div className="py-8 text-center text-muted-foreground animate-pulse">Searching flights...</div>
                          ) : allFlights.length > 0 ? (
                            allFlights.map((f) => (
                              <FlightCard
                                key={f.id}
                                flight={f}
                                onSelect={() => {
                                  setSelectedFlight(f);
                                  window.scrollTo({ top: 200, behavior: "smooth" });
                                }}
                              />
                            ))
                          ) : (
                            <div className="py-8 text-center text-muted-foreground">No flights found for this selection.</div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center justify-between p-4 rounded-xl bg-muted/30 border border-border">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-lg bg-white shadow-sm flex items-center justify-center">
                        <Plane className="h-5 w-5 -rotate-45 text-accent" />
                      </div>
                      <div>
                        <div className="font-semibold">{selectedFlight.airline} {selectedFlight.code}</div>
                        <div className="text-xs text-muted-foreground">
                          {query?.from} to {query?.to} · {query?.depart} · {query?.cabin}
                        </div>
                      </div>
                    </div>
                    <Button type="button" variant="ghost" size="sm" onClick={() => setSelectedFlight(null)}>
                      Change
                    </Button>
                  </div>
                )}
              </BookingSection>

              {selectedFlight && (
                <div className="space-y-8 animate-fade-up">
                  {/* Passenger */}
                  <BookingSection title="Lead passenger" icon={<User className="h-3.5 w-3.5" />}>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <Field
                        label="First name"
                        placeholder="Alex"
                        value={leadPassenger.firstName}
                        onChange={(v) => setLeadPassenger({ ...leadPassenger, firstName: v })}
                        required
                      />
                      <Field
                        label="Last name"
                        placeholder="Morgan"
                        value={leadPassenger.lastName}
                        onChange={(v) => setLeadPassenger({ ...leadPassenger, lastName: v })}
                        required
                      />
                      <Field
                        label="Date of birth"
                        type="date"
                        value={leadPassenger.dob}
                        onChange={(v) => setLeadPassenger({ ...leadPassenger, dob: v })}
                        required
                      />
                      <SelectField
                        label="Gender"
                        value={leadPassenger.gender}
                        onChange={(v) => setLeadPassenger({ ...leadPassenger, gender: v })}
                      >
                        <option value="Female">Female</option>
                        <option value="Male">Male</option>
                        <option value="Other">Other</option>
                      </SelectField>
                      <Field
                        label="Passport / ID"
                        placeholder="P12345678"
                        value={leadPassenger.passport}
                        onChange={(v) => setLeadPassenger({ ...leadPassenger, passport: v })}
                        required
                      />
                      <NationalitySelect
                        value={leadPassenger.nationality}
                        onChange={(v) => setLeadPassenger({ ...leadPassenger, nationality: v })}
                        required
                      />
                    </div>
                  </BookingSection>

                  {/* Dependants */}
                  <BookingSection
                    title="Additional passengers"
                    icon={<Users className="h-3.5 w-3.5" />}
                  >
                    <div className="space-y-6">
                      {dependants.map((dep, index) => (
                        <div key={index} className="p-5 rounded-xl border border-border bg-muted/10 relative">
                          <button
                            type="button"
                            onClick={() => handleRemoveDependant(index)}
                            className="absolute top-4 right-4 text-muted-foreground hover:text-destructive transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                          <h4 className="text-xs uppercase tracking-widest text-muted-foreground font-bold mb-4">
                            Passenger {index + 2}
                          </h4>
                          <div className="grid sm:grid-cols-2 gap-4">
                            <Field
                              label="Full Name"
                              placeholder="Jamie Doe"
                              value={dep.name}
                              onChange={(v) => updateDependant(index, { name: v })}
                              required
                            />
                            <Field
                              label="Email (Optional)"
                              type="email"
                              placeholder="jamie@example.com"
                              value={dep.email}
                              onChange={(v) => updateDependant(index, { email: v })}
                            />
                            <Field
                              label="Date of birth"
                              type="date"
                              value={dep.dob}
                              onChange={(v) => updateDependant(index, { dob: v })}
                              required
                            />
                            <SelectField
                              label="Gender"
                              value={dep.gender}
                              onChange={(v) => updateDependant(index, { gender: v })}
                            >
                              <option value="Female">Female</option>
                              <option value="Male">Male</option>
                              <option value="Other">Other</option>
                            </SelectField>
                            <Field
                              label="Passport / ID"
                              placeholder="P12345678"
                              value={dep.passport}
                              onChange={(v) => updateDependant(index, { passport: v })}
                              required
                            />
                            <NationalitySelect
                              value={dep.nationality}
                              onChange={(v) => updateDependant(index, { nationality: v })}
                              required
                            />
                          </div>
                        </div>
                      ))}

                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleAddDependant}
                        className="w-full border-dashed border-2 py-8 rounded-xl hover:border-accent hover:bg-accent/5"
                      >
                        <Plus className="h-4 w-4 mr-2" /> Add another passenger
                      </Button>
                    </div>
                  </BookingSection>

                  {/* Contact */}
                  <BookingSection title="Contact information" icon={<Mail className="h-3.5 w-3.5" />}>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <Field
                        label="Email address"
                        type="email"
                        placeholder="alex@example.com"
                        value={leadPassenger.email}
                        onChange={(v) => setLeadPassenger({ ...leadPassenger, email: v })}
                        icon={<Mail className="h-4 w-4" />}
                        required
                      />
                      <Field
                        label="Phone number"
                        type="tel"
                        placeholder="+1 555 0123"
                        value={leadPassenger.phone}
                        onChange={(v) => setLeadPassenger({ ...leadPassenger, phone: v })}
                        icon={<Phone className="h-4 w-4" />}
                        required
                      />
                    </div>
                  </BookingSection>

                  {/* Extras */}
                  <BookingSection title="Trip extras" icon={<Sparkles className="h-3.5 w-3.5" />}>
                    <div className="grid sm:grid-cols-2 gap-3">
                      <ExtraToggle
                        icon={<Luggage className="h-4 w-4" />}
                        label="Checked bag (23kg)"
                        price={EXTRAS_PRICE.bag}
                        checked={extras.bag}
                        onChange={(v) => setExtras({ ...extras, bag: v })}
                      />
                      <ExtraToggle
                        icon={<Coffee className="h-4 w-4" />}
                        label="Premium meal"
                        price={EXTRAS_PRICE.meal}
                        checked={extras.meal}
                        onChange={(v) => setExtras({ ...extras, meal: v })}
                      />
                      <ExtraToggle
                        icon={<Wifi className="h-4 w-4" />}
                        label="Onboard Wi-Fi"
                        price={EXTRAS_PRICE.wifi}
                        checked={extras.wifi}
                        onChange={(v) => setExtras({ ...extras, wifi: v })}
                      />
                      <ExtraToggle
                        icon={<Shield className="h-4 w-4" />}
                        label="Travel insurance"
                        price={EXTRAS_PRICE.insurance}
                        checked={extras.insurance}
                        onChange={(v) => setExtras({ ...extras, insurance: v })}
                      />
                    </div>
                  </BookingSection>
                </div>
              )}
            </div>

            {/* Sidebar summary */}
            <aside className="lg:sticky lg:top-6 h-fit">
              <div className="bg-card border border-border/60 rounded-2xl p-6 shadow-elegant">
                {selectedFlight ? (
                  <>
                    <div className="flex items-center gap-2 mb-4">
                      <div className="h-9 w-9 rounded-lg bg-secondary flex items-center justify-center">
                        <Plane className="h-4 w-4 -rotate-45 text-accent" />
                      </div>
                      <div>
                        <div className="font-semibold text-sm">{selectedFlight.airline}</div>
                        <div className="text-xs text-muted-foreground">{selectedFlight.code}</div>
                      </div>
                    </div>

                    <div className="bg-muted/50 rounded-xl p-4 mb-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-display text-2xl font-semibold">{selectedFlight.depart}</div>
                          <div className="text-xs text-muted-foreground font-medium">{query?.from}</div>
                        </div>
                        <div className="flex flex-col items-center text-xs text-muted-foreground">
                          <span>{selectedFlight.duration}</span>
                          <div className="w-12 h-px bg-border my-1.5" />
                          <span>{selectedFlight.stops === 0 ? "Nonstop" : `${selectedFlight.stops} stop`}</span>
                        </div>
                        <div className="text-right">
                          <div className="font-display text-2xl font-semibold">{selectedFlight.arrive}</div>
                          <div className="text-xs text-muted-foreground font-medium">{query?.to}</div>
                        </div>
                      </div>
                      <div className="mt-3 pt-3 border-t border-border text-xs text-muted-foreground">
                        {query?.depart} · {query?.cabin} · {totalPassengers} traveler{totalPassengers > 1 ? "s" : ""}
                      </div>
                    </div>

                    <div className="space-y-2 text-sm">
                      <Row label={`Fare × ${totalPassengers}`} value={`$${subtotal}`} />
                      {extrasTotal > 0 && <Row label={`Extras × ${totalPassengers}`} value={`$${extrasTotal * totalPassengers}`} />}
                      <Row label="Taxes & fees" value={`$${taxes}`} />
                      <div className="h-px bg-border my-3" />
                      <div className="flex items-center justify-between">
                        <span className="font-semibold">Total</span>
                        <span className="font-display text-2xl font-semibold text-primary">${total}</span>
                      </div>
                    </div>

                    <Button type="submit" variant="hero" size="lg" className="w-full mt-5">
                      Reserve now <ArrowRight className="h-4 w-4" />
                    </Button>
                  </>
                ) : (
                  <div className="text-center py-10 text-muted-foreground">
                    <Plane className="h-8 w-8 mx-auto mb-3 opacity-20" />
                    <p className="text-sm">Select a flight to see summary</p>
                  </div>
                )}
                <p className="text-xs text-muted-foreground mt-3 flex items-center gap-1.5 justify-center">
                  <Shield className="h-3 w-3" /> Free cancellation within 24 hours
                </p>
              </div>
            </aside>
          </form>
        )}
      </main>

      <Footer />
    </div>
  );
};

const BookingSection = ({
  title,
  icon,
  children,
}: {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) => (
  <div>
    <h3 className="font-display text-lg font-semibold mb-4 flex items-center gap-2">
      <span className="text-accent">{icon}</span> {title}
    </h3>
    <div className="bg-card border border-border/60 rounded-2xl p-5 md:p-6 shadow-card">{children}</div>
  </div>
);

const Field = ({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  icon,
  required,
}: {
  label: string;
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (v: string) => void;
  icon?: React.ReactNode;
  required?: boolean;
}) => (
  <div>
    <Label className="text-xs uppercase tracking-wider text-muted-foreground font-medium">{label}</Label>
    <div className="relative mt-1.5">
      {icon && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">{icon}</span>}
      <Input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange ? (e) => onChange(e.target.value) : undefined}
        required={required}
        className={`h-11 ${icon ? "pl-10" : ""}`}
      />
    </div>
  </div>
);

const SelectField = ({
  label,
  value,
  onChange,
  children,
}: {
  label: string;
  value?: string;
  onChange?: (v: string) => void;
  children: React.ReactNode;
}) => (
  <div>
    <Label className="text-xs uppercase tracking-wider text-muted-foreground font-medium">{label}</Label>
    <select
      value={value}
      onChange={onChange ? (e) => onChange(e.target.value) : undefined}
      className="mt-1.5 h-11 w-full rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
    >
      {children}
    </select>
  </div>
);

const ExtraToggle = ({
  icon,
  label,
  price,
  checked,
  onChange,
}: {
  icon: React.ReactNode;
  label: string;
  price: number;
  checked: boolean;
  onChange: (v: boolean) => void;
}) => (
  <button
    type="button"
    onClick={() => onChange(!checked)}
    className={`flex items-center justify-between gap-3 p-4 rounded-xl border text-left transition-all ${
      checked
        ? "border-accent bg-accent/5 shadow-card"
        : "border-border bg-background hover:border-accent/40"
    }`}
  >
    <div className="flex items-center gap-3">
      <div
        className={`h-9 w-9 rounded-lg flex items-center justify-center ${
          checked ? "bg-teal-gradient text-primary-foreground" : "bg-muted text-muted-foreground"
        }`}
      >
        {icon}
      </div>
      <div>
        <div className="font-medium text-sm">{label}</div>
        <div className="text-xs text-muted-foreground">+${price} per traveler</div>
      </div>
    </div>
    <div
      className={`h-5 w-5 rounded-full border-2 flex items-center justify-center ${
        checked ? "border-accent bg-accent" : "border-border"
      }`}
    >
      {checked && <CheckCircle2 className="h-3 w-3 text-primary-foreground" />}
    </div>
  </button>
);

const Row = ({ label, value }: { label: string; value: string }) => (
  <div className="flex items-center justify-between text-muted-foreground">
    <span>{label}</span>
    <span className="text-foreground font-medium">{value}</span>
  </div>
);

const Confirmation = ({
  reference,
  flight,
  from,
  to,
  date,
  total,
  onReset,
}: {
  reference: string;
  flight: any;
  from: string;
  to: string;
  date: string;
  total: number;
  onReset: () => void;
}) => (
  <div className="max-w-2xl mx-auto text-center animate-fade-up">
    <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-teal-gradient shadow-glow mb-6">
      <CheckCircle2 className="h-8 w-8 text-primary-foreground" />
    </div>
    <h2 className="font-display text-4xl md:text-5xl font-semibold tracking-tight mb-3">
      Reservation held.
    </h2>
    <p className="text-muted-foreground text-lg mb-10">
      We've reserved your seat for 24 hours. Reference{" "}
      <span className="font-mono font-semibold text-foreground">{reference}</span>
    </p>

    <div className="bg-card border border-border/60 rounded-2xl p-6 md:p-8 shadow-elegant text-left">
      <div className="grid grid-cols-3 items-center text-center">
        <div>
          <div className="font-display text-3xl font-semibold">{flight?.depart}</div>
          <div className="text-xs text-muted-foreground mt-1">{from}</div>
        </div>
        <div className="text-xs text-muted-foreground">
          <div>{flight?.duration}</div>
          <div className="my-2 h-px bg-border" />
          <div>{date}</div>
        </div>
        <div>
          <div className="font-display text-3xl font-semibold">{flight?.arrive}</div>
          <div className="text-xs text-muted-foreground mt-1">{to}</div>
        </div>
      </div>
      <div className="mt-6 pt-6 border-t border-border flex items-center justify-between">
        <div className="text-sm text-muted-foreground">Total due</div>
        <div className="font-display text-2xl font-semibold text-primary">${total}</div>
      </div>
    </div>

    <div className="flex flex-wrap gap-3 justify-center mt-8">
      <Button asChild variant="hero" size="lg">
        <Link to="/trips">View in My Trips <ArrowRight className="h-4 w-4" /></Link>
      </Button>
      <Button variant="outline" size="lg" onClick={onReset}>
        New reservation
      </Button>
    </div>
  </div>
);

export default Reserve;
