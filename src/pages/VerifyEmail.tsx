import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, Loader2, ArrowRight } from "lucide-react";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const verify = async () => {
      if (!token) {
        setStatus("error");
        setMessage("Missing verification token.");
        return;
      }

      try {
        const response = await fetch(`/api/auth/verify-email?token=${token}`);
        const data = await response.json();

        if (response.ok) {
          setStatus("success");
          setMessage(data.message || "Email verified successfully!");
        } else {
          setStatus("error");
          setMessage(data.message || "Verification failed.");
        }
      } catch (err) {
        setStatus("error");
        setMessage("An error occurred during verification.");
      }
    };

    verify();
  }, [token]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar variant="solid" />
      <main className="flex-1 container flex items-center justify-center py-20">
        <div className="max-w-md w-full bg-card border border-border/60 rounded-3xl p-10 text-center shadow-elegant animate-fade-up">
          {status === "loading" && (
            <div className="py-10">
              <Loader2 className="h-12 w-12 animate-spin text-accent mx-auto mb-6" />
              <h1 className="font-display text-2xl font-semibold mb-2">Verifying your email</h1>
              <p className="text-muted-foreground text-sm">Just a moment while we confirm your account...</p>
            </div>
          )}

          {status === "success" && (
            <div className="py-10">
              <div className="h-16 w-16 rounded-full bg-teal/15 flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="h-8 w-8 text-teal" />
              </div>
              <h1 className="font-display text-3xl font-semibold mb-2">Verification successful!</h1>
              <p className="text-muted-foreground mb-8">{message}</p>
              <Button asChild variant="hero" size="lg" className="w-full">
                <Link to="/signin">
                  Sign in to your account <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          )}

          {status === "error" && (
            <div className="py-10">
              <div className="h-16 w-16 rounded-full bg-red-500/15 flex items-center justify-center mx-auto mb-6">
                <XCircle className="h-8 w-8 text-red-500" />
              </div>
              <h1 className="font-display text-3xl font-semibold mb-2">Verification failed</h1>
              <p className="text-muted-foreground mb-8">{message}</p>
              <div className="flex flex-col gap-3">
                <Button asChild variant="outline" className="w-full">
                  <Link to="/signup">Try signing up again</Link>
                </Button>
                <Button asChild variant="ghost" className="w-full text-muted-foreground">
                  <Link to="/">Go back home</Link>
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default VerifyEmail;
