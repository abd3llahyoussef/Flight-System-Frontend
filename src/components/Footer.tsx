import { Link } from "react-router-dom";
import { Plane } from "lucide-react";

export const Footer = () => (
  <footer className="border-t border-border bg-card mt-20">
    <div className="container py-12 grid gap-10 md:grid-cols-4">
      <div>
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-teal-gradient flex items-center justify-center">
            <Plane className="h-4 w-4 text-primary-foreground -rotate-45" />
          </div>
          <span className="font-display text-lg font-semibold">Aerway</span>
        </div>
        <p className="text-sm text-muted-foreground mt-3 max-w-xs">
          The sky, simplified. Search hundreds of airlines and book in under a minute.
        </p>
      </div>
      <FooterCol
        title="Explore"
        items={[
          { label: "Flights", to: "/" },
          { label: "Deals", to: "/deals" },
          { label: "Destinations", to: "/deals#destinations" },
        ]}
      />
      <FooterCol
        title="Manage"
        items={[
          { label: "My Trips", to: "/trips" },
          { label: "Sign in", to: "/signin" },
          { label: "Create account", to: "/signup" },
        ]}
      />
      <FooterCol
        title="Company"
        items={[
          { label: "Help Center", to: "/help" },
          { label: "Admin", to: "/admin" },
          { label: "Privacy", to: "#" },
        ]}
      />
    </div>
    <div className="border-t border-border">
      <div className="container py-5 flex flex-col md:flex-row items-center justify-between gap-3 text-sm text-muted-foreground">
        <span>© 2026 Aerway. Fly smarter.</span>
        <span>Made with care over the Atlantic.</span>
      </div>
    </div>
  </footer>
);

const FooterCol = ({
  title,
  items,
}: {
  title: string;
  items: { label: string; to: string }[];
}) => (
  <div>
    <h4 className="text-xs uppercase tracking-wider font-semibold text-foreground mb-3">{title}</h4>
    <ul className="space-y-2 text-sm text-muted-foreground">
      {items.map((i) => (
        <li key={i.label}>
          <Link to={i.to} className="hover:text-teal transition-colors">
            {i.label}
          </Link>
        </li>
      ))}
    </ul>
  </div>
);
