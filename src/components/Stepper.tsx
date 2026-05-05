import { Check } from "lucide-react";

const STEPS = ["Search", "Select flight", "Choose seat", "Checkout"];

interface StepperProps {
  step: number; // 1-based
}

export const Stepper = ({ step }: StepperProps) => (
  <div className="flex items-center gap-2 md:gap-3">
    {STEPS.map((label, i) => {
      const idx = i + 1;
      const done = idx < step;
      const active = idx === step;
      return (
        <div key={label} className="flex items-center gap-2 md:gap-3">
          <div className="flex items-center gap-2">
            <div
              className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-semibold transition-all ${
                done
                  ? "bg-teal text-teal-foreground"
                  : active
                    ? "bg-primary text-primary-foreground ring-4 ring-primary/15"
                    : "bg-muted text-muted-foreground"
              }`}
            >
              {done ? <Check className="h-3.5 w-3.5" /> : idx}
            </div>
            <span
              className={`text-xs md:text-sm font-medium hidden sm:inline ${
                active ? "text-foreground" : "text-muted-foreground"
              }`}
            >
              {label}
            </span>
          </div>
          {idx < STEPS.length && <div className={`h-px w-6 md:w-10 ${done ? "bg-teal" : "bg-border"}`} />}
        </div>
      );
    })}
  </div>
);
