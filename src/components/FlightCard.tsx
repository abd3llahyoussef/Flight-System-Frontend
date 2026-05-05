import { Plane, ArrowRight } from "lucide-react";
import type { Flight } from "@/lib/flights";
import { Button } from "@/components/ui/button";

interface FlightCardProps {
  flight: Flight;
  onSelect: (f: Flight) => void;
}

export const FlightCard = ({ flight, onSelect }: FlightCardProps) => {
  return (
    <div className="group bg-card border border-border/60 rounded-2xl p-5 md:p-6 shadow-card hover:shadow-elegant hover:border-accent/40 transition-all duration-300 animate-fade-up">
      <div className="flex flex-col md:flex-row md:items-center gap-5">
        {/* Airline */}
        <div className="flex items-center gap-3 md:w-44">
          <div className="h-11 w-11 rounded-xl bg-secondary flex items-center justify-center">
            <Plane className="h-5 w-5 text-accent -rotate-45" />
          </div>
          <div>
            <div className="font-semibold text-sm">{flight.airline}</div>
            <div className="text-xs text-muted-foreground">{flight.code} · {flight.aircraft}</div>
            <div className="text-xs text-muted-foreground">{flight.departDate}</div>
          </div>
        </div>

        {/* Times */}
        <div className="flex-1 flex items-center gap-4">
          <div className="text-center">
            <div className="font-display text-2xl md:text-3xl font-semibold tracking-tight">{flight.depart}</div>
            <div className="text-xs text-muted-foreground font-medium mt-0.5">{flight.from}</div>
          </div>

          <div className="flex-1 flex flex-col items-center gap-1.5">
            <div className="text-xs text-muted-foreground font-medium">{flight.duration}</div>
            <div className="relative w-full flex items-center">
              <div className="h-px bg-border flex-1" />
              <div className={`h-2 w-2 rounded-full ${flight.stops === 0 ? "bg-teal" : "bg-muted-foreground/40"}`} />
              <div className="h-px bg-border flex-1" />
              <Plane className="h-3.5 w-3.5 text-accent ml-1" />
            </div>
            <div className="text-xs font-medium">
              {flight.stops === 0 ? (
                <span className="text-teal">Nonstop</span>
              ) : (
                <span className="text-muted-foreground">1 stop · {flight.stopCity}</span>
              )}
            </div>
          </div>

          <div className="text-center">
            <div className="font-display text-2xl md:text-3xl font-semibold tracking-tight">{flight.arrive}</div>
            <div className="text-xs text-muted-foreground font-medium mt-0.5">{flight.to}</div>
          </div>
        </div>

        {/* Price */}
        <div className="flex md:flex-col items-center md:items-end justify-between md:justify-center gap-2 md:w-32 md:border-l md:border-border md:pl-5">
          <div>
            <div className="text-xs text-muted-foreground">from</div>
            <div className="font-display text-2xl font-semibold text-primary">${flight.price}</div>
          </div>
          <Button type="button" variant="ocean" size="sm" onClick={() => onSelect(flight)} className="rounded-lg">
            Select <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
