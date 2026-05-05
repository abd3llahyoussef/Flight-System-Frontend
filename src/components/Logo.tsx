import { Plane } from "lucide-react";

export const Logo = ({ className = "" }: { className?: string }) => (
  <div className={`flex items-center gap-2 ${className}`}>
    <div className="relative">
      <div className="h-9 w-9 rounded-xl bg-teal-gradient flex items-center justify-center shadow-glow">
        <Plane className="h-4 w-4 text-primary-foreground -rotate-45" strokeWidth={2.5} />
      </div>
    </div>
    <div className="font-display text-xl font-semibold tracking-tight">
      Aerway
    </div>
  </div>
);
