import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ArrowRight, Flame, MapPin, Sparkles, TrendingDown } from "lucide-react";
import { Link } from "react-router-dom";

const deals = [
  { from: "JFK", to: "LHR", city: "London", price: 389, drop: 24, img: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&auto=format&fit=crop" },
  { from: "LAX", to: "NRT", city: "Tokyo", price: 612, drop: 18, img: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&auto=format&fit=crop" },
  { from: "JFK", to: "CDG", city: "Paris", price: 412, drop: 22, img: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&auto=format&fit=crop" },
  { from: "JFK", to: "BCN", city: "Barcelona", price: 358, drop: 31, img: "https://images.unsplash.com/photo-1583422409516-2895a77efded?w=800&auto=format&fit=crop" },
  { from: "LAX", to: "SYD", city: "Sydney", price: 798, drop: 15, img: "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=800&auto=format&fit=crop" },
  { from: "JFK", to: "DXB", city: "Dubai", price: 542, drop: 19, img: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&auto=format&fit=crop" },
];

const destinations = [
  { city: "Reykjavík", country: "Iceland", img: "https://images.unsplash.com/photo-1490650404312-a2175773bbf5?w=900&auto=format&fit=crop" },
  { city: "Kyoto", country: "Japan", img: "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=900&auto=format&fit=crop" },
  { city: "Cape Town", country: "South Africa", img: "https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=900&auto=format&fit=crop" },
  { city: "Lisbon", country: "Portugal", img: "https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=900&auto=format&fit=crop" },
];

const Deals = () => (
  <div className="min-h-screen bg-background">
    <Navbar variant="solid" />

    {/* Hero */}
    <section className="bg-hero text-primary-foreground">
      <div className="container py-16 md:py-24 max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur border border-white/15 text-xs font-medium mb-5">
          <Sparkles className="h-3.5 w-3.5 text-teal" /> Updated hourly
        </div>
        <h1 className="font-display text-5xl md:text-6xl font-light leading-tight tracking-tight">
          Today's <em className="not-italic font-semibold text-teal">best fares.</em>
        </h1>
        <p className="mt-4 text-lg text-primary-foreground/80 font-light">
          Hand-picked deals across our network — book before they fly.
        </p>
      </div>
    </section>

    {/* Deals grid */}
    <main className="container py-14">
      <div className="flex items-end justify-between mb-8">
        <div>
          <h2 className="font-display text-3xl font-semibold tracking-tight flex items-center gap-3">
            <Flame className="h-6 w-6 text-accent" /> Trending fares
          </h2>
          <p className="text-muted-foreground mt-1">Round-trip, taxes included.</p>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {deals.map((d) => (
          <article
            key={d.city}
            className="group bg-card rounded-2xl overflow-hidden border border-border/60 shadow-card hover:shadow-elegant transition-all"
          >
            <div className="relative h-44 overflow-hidden">
              <img
                src={d.img}
                alt={`${d.city} skyline`}
                className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700"
                loading="lazy"
              />
              <div className="absolute top-3 left-3 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-background/95 backdrop-blur text-xs font-semibold text-accent">
                <TrendingDown className="h-3 w-3" /> -{d.drop}%
              </div>
            </div>
            <div className="p-5">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                <MapPin className="h-3 w-3" /> {d.from} → {d.to}
              </div>
              <h3 className="font-display text-xl font-semibold mt-1">{d.city}</h3>
              <div className="flex items-center justify-between mt-4">
                <div>
                  <div className="text-xs text-muted-foreground">from</div>
                  <div className="font-display text-2xl font-semibold text-primary">${d.price}</div>
                </div>
                <Button asChild variant="ocean" size="sm">
                  <Link to="/">
                    Book <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Destinations */}
      <section id="destinations" className="mt-20">
        <h2 className="font-display text-3xl font-semibold tracking-tight mb-2">
          Trending destinations
        </h2>
        <p className="text-muted-foreground mb-8">Where Aerway travelers are headed this season.</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {destinations.map((d) => (
            <Link
              key={d.city}
              to="/"
              className="group relative h-72 rounded-2xl overflow-hidden shadow-card hover:shadow-elegant transition-shadow"
            >
              <img
                src={d.img}
                alt={`${d.city}, ${d.country}`}
                className="absolute inset-0 h-full w-full object-cover group-hover:scale-110 transition-transform duration-700"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/40 to-transparent opacity-90" />
              <div className="absolute bottom-0 left-0 right-0 p-5 text-primary-foreground">
                <div className="text-xs uppercase tracking-wider opacity-80">{d.country}</div>
                <div className="font-display text-2xl font-semibold mt-1">{d.city}</div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>

    <Footer />
  </div>
);

export default Deals;
