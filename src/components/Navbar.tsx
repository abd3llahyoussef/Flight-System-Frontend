import { Link, NavLink } from "react-router-dom";
import { Logo } from "./Logo";
import { Button } from "@/components/ui/button";
import { Globe, User, LogOut } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { logout } from "@/lib/features/auth/authSlice";

interface NavbarProps {
  variant?: "transparent" | "solid";
}

const links = [
  { to: "/", label: "Flights" },
  { to: "/reserve", label: "Reserve" },
  { to: "/deals", label: "Deals" },
  { to: "/trips", label: "My Trips" },
  { to: "/admin", label: "Admin" },
];

export const Navbar = ({ variant = "transparent" }: NavbarProps) => {
  const onDark = variant === "transparent";
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  return (
    <header
      className={`${variant === "solid"
          ? "bg-background/80 backdrop-blur border-b border-border relative"
          : "absolute top-0 left-0 right-0 z-30"
        }`}
    >
      <div className="container flex h-20 items-center justify-between">
        <Link to="/" className={onDark ? "text-primary-foreground" : "text-foreground"}>
          <Logo />
        </Link>
        <nav
          className={`hidden md:flex items-center gap-8 text-sm font-medium ${onDark ? "text-primary-foreground/80" : "text-muted-foreground"
            }`}
        >
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === "/"}
              className={({ isActive }) =>
                `transition-colors hover:text-teal ${isActive ? "text-teal" : ""}`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Button variant={onDark ? "soft" : "ghost"} size="sm" className="hidden sm:inline-flex">
            <Globe className="h-4 w-4" /> EN
          </Button>
          {user ? (
            <div className="flex items-center gap-4">
              <span className={`text-sm font-medium ${onDark ? "text-primary-foreground" : "text-foreground"}`}>
                {user.name}
              </span>
              <Button 
                variant={onDark ? "soft" : "outline"} 
                size="sm"
                onClick={() => dispatch(logout())}
              >
                <LogOut className="h-4 w-4" /> Logout
              </Button>
            </div>
          ) : (
            <Button asChild variant={onDark ? "soft" : "outline"} size="sm">
              <Link to="/signin">
                <User className="h-4 w-4" /> Sign in
              </Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};
