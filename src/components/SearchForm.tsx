import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeftRight, CalendarDays, MapPin, Search, Users } from "lucide-react";
import type { CabinClass, SearchQuery, Trip } from "@/lib/flights";
import { AIRPORTS } from "@/lib/flights";

interface SearchFormProps {
  onSearch: (q: SearchQuery) => void;
  compact?: boolean;
  initial?: Partial<SearchQuery>;
}

export const SearchForm = ({ onSearch, compact, initial }: SearchFormProps) => {
  const [trip, setTrip] = useState<Trip>(initial?.trip ?? "roundtrip");
  const [from, setFrom] = useState(initial?.from ?? "JFK");
  const [to, setTo] = useState(initial?.to ?? "LAX");
  const [depart, setDepart] = useState(initial?.depart ?? "2026-05-12");
  const [ret, setRet] = useState(initial?.return ?? "2026-05-19");
  const [passengers, setPassengers] = useState(initial?.passengers ?? 1);
  const [cabin, setCabin] = useState<CabinClass>(initial?.cabin ?? "Economy");

  const swap = () => {
    setFrom(to);
    setTo(from);
  };

  const submit = () => {
    onSearch({ trip, from, to, depart, return: ret, passengers, cabin });
  };

  return (
    <div className={`bg-card rounded-2xl shadow-elegant border border-border/50 ${compact ? "p-4" : "p-6 md:p-8"}`}>
      {!compact && (
        <div className="flex gap-1 mb-6 bg-muted/60 p-1 rounded-lg w-fit">
          {(["roundtrip", "oneway"] as Trip[]).map((t) => (
            <button
              key={t}
              onClick={() => setTrip(t)}
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
                trip === t ? "bg-card shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t === "roundtrip" ? "Round trip" : "One way"}
            </button>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
        {/* From / To */}
        <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-3 relative">
          <FieldSelect label="From" icon={<MapPin className="h-4 w-4" />} value={from} onChange={setFrom} />
          <FieldSelect label="To" icon={<MapPin className="h-4 w-4" />} value={to} onChange={setTo} />
          <button
            onClick={swap}
            className="hidden sm:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-card border border-border items-center justify-center hover:bg-muted hover:border-accent transition-all z-10"
            aria-label="Swap"
          >
            <ArrowLeftRight className="h-4 w-4 text-accent" />
          </button>
        </div>

        {/* Dates */}
        <div className="lg:col-span-4 grid grid-cols-2 gap-3">
          <FieldDate label="Depart" value={depart} onChange={setDepart} />
          <FieldDate label="Return" value={ret} onChange={setRet} disabled={trip === "oneway"} />
        </div>

        {/* Passengers + Cabin */}
        <div className="lg:col-span-3">
          <div className="h-full rounded-xl border border-input bg-background hover:border-accent transition-colors px-4 py-2.5">
            <Label className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium flex items-center gap-1.5">
              <Users className="h-3 w-3" /> Travelers
            </Label>
            <div className="flex items-center gap-2 mt-1">
              <Input
                type="number"
                min={1}
                max={9}
                value={passengers}
                onChange={(e) => setPassengers(parseInt(e.target.value) || 1)}
                className="w-12 h-7 border-0 px-0 text-base font-semibold focus-visible:ring-0"
              />
              <Select value={cabin} onValueChange={(v) => setCabin(v as CabinClass)}>
                <SelectTrigger className="border-0 h-7 px-0 text-sm font-medium focus:ring-0 bg-transparent">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Economy">Economy</SelectItem>
                  <SelectItem value="Premium">Premium</SelectItem>
                  <SelectItem value="Business">Business</SelectItem>
                  <SelectItem value="First">First</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      <Button type="button" onClick={submit} variant="hero" size={compact ? "lg" : "xl"} className="w-full mt-5 font-semibold">
        <Search className="h-5 w-5" />
        Search flights
      </Button>
    </div>
  );
};

const FieldSelect = ({
  label,
  icon,
  value,
  onChange,
}: {
  label: string;
  icon: React.ReactNode;
  value: string;
  onChange: (v: string) => void;
}) => (
  <div className="rounded-xl border border-input bg-background hover:border-accent transition-colors px-4 py-2.5">
    <Label className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium flex items-center gap-1.5">
      {icon} {label}
    </Label>
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="border-0 h-8 px-0 text-base font-semibold focus:ring-0 bg-transparent mt-0.5">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {AIRPORTS.map((a) => (
          <SelectItem key={a.code} value={a.code}>
            <span className="font-semibold">{a.code}</span>
            <span className="text-muted-foreground ml-2">{a.city}</span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>
);

const FieldDate = ({
  label,
  value,
  onChange,
  disabled,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
}) => (
  <div
    className={`rounded-xl border border-input bg-background hover:border-accent transition-colors px-4 py-2.5 ${
      disabled ? "opacity-50" : ""
    }`}
  >
    <Label className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium flex items-center gap-1.5">
      <CalendarDays className="h-3 w-3" /> {label}
    </Label>
    <Input
      type="date"
      value={value}
      disabled={disabled}
      onChange={(e) => onChange(e.target.value)}
      className="border-0 h-8 px-0 text-base font-semibold focus-visible:ring-0 bg-transparent mt-0.5"
    />
  </div>
);
