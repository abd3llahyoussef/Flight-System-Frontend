import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight, Lock, Mail, Loader2 } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { login } from "@/lib/features/auth/authSlice";
import { toast } from "sonner";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { status } = useAppSelector((state) => state.auth);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const resultAction = await dispatch(login({ email, password }));
      if (login.fulfilled.match(resultAction)) {
        toast.success("Welcome back!");
        navigate("/");
      } else {
        toast.error("Login failed. Please check your credentials.");
      }
    } catch (err) {
      toast.error("An error occurred during sign in.");
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar variant="solid" />
      <main className="flex-1 container py-16 grid lg:grid-cols-2 gap-12 items-center">
        <div className="hidden lg:block">
          <div className="rounded-3xl bg-hero p-10 text-primary-foreground shadow-elegant min-h-[500px] flex flex-col justify-between">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/15 text-xs font-medium">
                Welcome back
              </div>
              <h2 className="font-display text-4xl font-light leading-tight tracking-tight mt-6">
                Your next journey is one <em className="not-italic font-semibold text-teal">tap</em> away.
              </h2>
            </div>
            <div className="text-sm text-primary-foreground/70">
              Earn miles on every booking · Free 24h cancellation
            </div>
          </div>
        </div>

        <div className="max-w-md w-full mx-auto lg:mx-0">
          <h1 className="font-display text-3xl md:text-4xl font-semibold tracking-tight">Sign in</h1>
          <p className="text-muted-foreground mt-2">Welcome back to Aerway.</p>

          <form className="mt-8 grid gap-4" onSubmit={handleSubmit}>
            <Field 
              label="Email" 
              type="email" 
              icon={<Mail className="h-4 w-4" />} 
              placeholder="you@example.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Field 
              label="Password" 
              type="password" 
              icon={<Lock className="h-4 w-4" />} 
              placeholder="••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-muted-foreground">
                <input type="checkbox" className="accent-accent" /> Remember me
              </label>
              <a href="#" className="text-accent hover:underline font-medium">Forgot?</a>
            </div>
            <Button variant="hero" size="lg" className="mt-2" disabled={status === "loading"}>
              {status === "loading" ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Sign in <ArrowRight className="h-4 w-4" />
            </Button>
            <div className="relative my-2 text-center">
              <span className="text-xs uppercase tracking-wider text-muted-foreground bg-background px-3 relative z-10">
                or
              </span>
              <div className="absolute inset-y-1/2 left-0 right-0 h-px bg-border" />
            </div>
            <Button 
              variant="outline" 
              size="lg" 
              type="button"
              onClick={() => window.location.href = "/api/auth/google"}
            >
              Continue with Google
            </Button>
          </form>

          <p className="text-sm text-muted-foreground mt-6 text-center">
            New to Aerway?{" "}
            <Link to="/signup" className="text-accent font-semibold hover:underline">
              Create an account
            </Link>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

const Field = ({
  label,
  type,
  placeholder,
  icon,
  value,
  onChange,
}: {
  label: string;
  type: string;
  placeholder?: string;
  icon?: React.ReactNode;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => (
  <div>
    <Label className="text-xs uppercase tracking-wider text-muted-foreground font-medium">{label}</Label>
    <div className="relative mt-1.5">
      {icon && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">{icon}</span>}
      <Input type={type} placeholder={placeholder} value={value} onChange={onChange} className={`h-11 ${icon ? "pl-10" : ""}`} />
    </div>
  </div>
);

export default SignIn;
