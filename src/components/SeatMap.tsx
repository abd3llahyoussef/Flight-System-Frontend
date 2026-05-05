import { useMemo, useState } from "react";
import type { Seat } from "@/lib/flights";
import { generateSeats } from "@/lib/flights";

interface SeatMapProps {
  selected: string[];
  onChange: (ids: string[]) => void;
  count: number;
  reservedSeats?: string[];
  cabin?: string;
}

export const SeatMap = ({ selected, onChange, count, reservedSeats = [], cabin = "Economy" }: SeatMapProps) => {
  const seats = useMemo(() => generateSeats(reservedSeats), [reservedSeats]);

  const rows = useMemo(() => {
    const map = new Map<number, Seat[]>();
    seats.forEach((s) => {
      if (!map.has(s.row)) map.set(s.row, []);
      map.get(s.row)!.push(s);
    });
    return Array.from(map.entries()).sort((a, b) => a[0] - b[0]);
  }, [seats]);

  const toggle = (s: Seat) => {
    if (s.taken) return;
    
    // Check if seat matches cabin class
    const isPremiumRow = s.row <= 3;
    const wantsPremium = cabin !== "Economy";
    
    if (wantsPremium && !isPremiumRow) return;
    if (!wantsPremium && isPremiumRow) return;

    if (selected.includes(s.id)) {
      onChange(selected.filter((x) => x !== s.id));
    } else if (selected.length < count) {
      onChange([...selected, s.id]);
    } else {
      onChange([...selected.slice(1), s.id]);
    }
  };

  return (
    <div className="bg-card rounded-2xl border border-border/60 p-6 md:p-8 shadow-card">
      <div className="flex items-center justify-center gap-5 mb-6 text-xs">
        <Legend className="bg-muted border border-border" label="Available" />
        <Legend className="bg-teal/15 border border-teal" label="Premium" />
        <Legend className="bg-primary border border-primary" label="Selected" />
        <Legend className="bg-muted-foreground/30 border border-muted-foreground/30" label="Taken" />
      </div>

      <div className="mx-auto max-w-sm">
        {/* Cockpit */}
        <div className="mx-auto mb-4 h-12 w-32 rounded-t-[100%] border-2 border-b-0 border-border" />

        <div className="space-y-2">
          {/* Column labels */}
          <div className="grid grid-cols-[1.5rem_repeat(3,1fr)_0.75rem_repeat(3,1fr)] gap-1.5 text-[10px] text-muted-foreground font-medium px-1">
            <span />
            {["A", "B", "C"].map((c) => <span key={c} className="text-center">{c}</span>)}
            <span />
            {["D", "E", "F"].map((c) => <span key={c} className="text-center">{c}</span>)}
          </div>

          {rows.map(([row, rowSeats]) => (
            <div
              key={row}
              className="grid grid-cols-[1.5rem_repeat(3,1fr)_0.75rem_repeat(3,1fr)] gap-1.5 items-center"
            >
              <span className="text-[10px] text-muted-foreground font-medium">{row}</span>
              {rowSeats.slice(0, 3).map((s) => (
                <SeatBtn
                  key={s.id}
                  seat={s}
                  selected={selected.includes(s.id)}
                  onClick={() => toggle(s)}
                  disabled={cabin === "Economy" ? s.row <= 3 : s.row > 3}
                />
              ))}
              <span />
              {rowSeats.slice(3).map((s) => (
                <SeatBtn
                  key={s.id}
                  seat={s}
                  selected={selected.includes(s.id)}
                  onClick={() => toggle(s)}
                  disabled={cabin === "Economy" ? s.row <= 3 : s.row > 3}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const Legend = ({ className, label }: { className: string; label: string }) => (
  <div className="flex items-center gap-1.5">
    <span className={`h-3 w-3 rounded ${className}`} />
    <span className="text-muted-foreground">{label}</span>
  </div>
);

const SeatBtn = ({ seat, selected, onClick, disabled }: { seat: Seat; selected: boolean; onClick: () => void; disabled?: boolean }) => {
  const base = "aspect-square rounded-md text-[10px] font-semibold transition-all duration-200";
  let cls = "bg-muted hover:bg-accent/20 border border-border text-muted-foreground hover:scale-110";
  if (seat.premium) cls = "bg-teal/15 hover:bg-teal/30 border border-teal/40 text-teal hover:scale-110";
  if (seat.taken || disabled) cls = "bg-muted-foreground/20 border border-muted-foreground/20 text-muted-foreground/50 cursor-not-allowed grayscale";
  if (selected) cls = "bg-primary border border-primary text-primary-foreground scale-110 shadow-glow";

  return (
    <button
      type="button"
      disabled={seat.taken || disabled}
      onClick={onClick}
      className={`${base} ${cls}`}
      aria-label={`Seat ${seat.id}`}
    >
      {seat.col}
    </button>
  );
};
