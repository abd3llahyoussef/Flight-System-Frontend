import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { LifeBuoy, MessageCircle, Phone, Search } from "lucide-react";

const faqs = [
  { q: "How do I check in for my flight?", a: "Online check-in opens 24 hours before departure. Head to My Trips, find your booking, and tap Check in." },
  { q: "What's your baggage policy?", a: "Economy includes 1 personal item + 1 carry-on (10kg). Checked bags can be added during booking or in My Trips." },
  { q: "Can I cancel for free?", a: "Yes — all bookings include free cancellation within 24 hours of purchase, no questions asked." },
  { q: "How do I earn miles?", a: "Sign in before booking and you'll automatically earn 1 mile per dollar spent. Premium cabins earn 2x." },
  { q: "What if my flight is delayed?", a: "We'll notify you immediately and re-book you on the next available flight at no extra cost." },
];

const Help = () => (
  <div className="min-h-screen bg-background">
    <Navbar variant="solid" />

    <section className="bg-hero text-primary-foreground">
      <div className="container py-16 md:py-20 max-w-3xl">
        <h1 className="font-display text-5xl md:text-6xl font-light tracking-tight">
          How can we <em className="not-italic font-semibold text-teal">help</em>?
        </h1>
        <p className="mt-4 text-lg text-primary-foreground/80">
          Search our help center or reach our team 24/7.
        </p>
        <div className="mt-8 relative max-w-xl">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search for 'baggage', 'refunds'..."
            className="h-14 pl-11 bg-background text-foreground rounded-xl"
          />
        </div>
      </div>
    </section>

    <main className="container py-14 grid lg:grid-cols-[1fr_320px] gap-10">
      <div>
        <h2 className="font-display text-3xl font-semibold tracking-tight mb-6">
          Frequently asked
        </h2>
        <Accordion type="single" collapsible className="bg-card border border-border/60 rounded-2xl shadow-card divide-y divide-border">
          {faqs.map((f, i) => (
            <AccordionItem key={i} value={`item-${i}`} className="border-0 px-6">
              <AccordionTrigger className="text-left font-display font-semibold hover:no-underline">
                {f.q}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      <aside className="space-y-4 h-fit">
        <ContactCard
          icon={<MessageCircle className="h-5 w-5" />}
          title="Live chat"
          desc="Average reply in 2 min"
          cta="Start chat"
        />
        <ContactCard
          icon={<Phone className="h-5 w-5" />}
          title="Call us"
          desc="+1 (800) AERWAY · 24/7"
          cta="Call now"
        />
        <ContactCard
          icon={<LifeBuoy className="h-5 w-5" />}
          title="Email support"
          desc="help@aerway.com"
          cta="Send email"
        />
      </aside>
    </main>

    <Footer />
  </div>
);

const ContactCard = ({
  icon,
  title,
  desc,
  cta,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  cta: string;
}) => (
  <div className="bg-card border border-border/60 rounded-2xl p-5 shadow-card">
    <div className="h-11 w-11 rounded-xl bg-secondary flex items-center justify-center text-accent mb-4">
      {icon}
    </div>
    <h3 className="font-display font-semibold">{title}</h3>
    <p className="text-sm text-muted-foreground mt-1">{desc}</p>
    <Button variant="ocean" size="sm" className="mt-4 w-full">
      {cta}
    </Button>
  </div>
);

export default Help;
