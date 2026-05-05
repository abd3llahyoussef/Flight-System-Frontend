import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight, Lock, Mail, User, Loader2 } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { register } from "@/lib/features/auth/authSlice";
import { toast } from "sonner";

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { status } = useAppSelector((state) => state.auth);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const resultAction = await dispatch(register({ name, email, password }));
      if (register.fulfilled.match(resultAction)) {
        toast.success("Registration successful! Please sign in.");
        navigate("/signin");
      } else {
        toast.error("Registration failed. Email might already be taken.");
      }
    } catch (err) {
      toast.error("An error occurred during registration.");
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
                Join Aerway
              </div>
              <h2 className="font-display text-4xl font-light leading-tight tracking-tight mt-6">
                Smarter fares. <em className="not-italic font-semibold text-teal">Smoother</em> trips.
              </h2>
            </div>
            <ul className="space-y-2 text-sm text-primary-foreground/80">
              <li>· Earn miles on every flight</li>
              <li>· Save passenger details for 1-tap booking</li>
              <li>· Priority support, always</li>
            </ul>
          </div>
        </div>

        <div className="max-w-md w-full mx-auto lg:mx-0">
          <h1 className="font-display text-3xl md:text-4xl font-semibold tracking-tight">
            Create your account
          </h1>
          <p className="text-muted-foreground mt-2">It only takes a minute.</p>

          <form className="mt-8 grid gap-4" onSubmit={handleSubmit}>
            <Field 
              label="Full Name" 
              type="text" 
              icon={<User className="h-4 w-4" />} 
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
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
              placeholder="At least 8 characters" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <label className="flex items-start gap-2 text-sm text-muted-foreground mt-1">
              <input type="checkbox" className="accent-accent mt-0.5" required />
              <span>
                I agree to the{" "}
                <a href="#" className="text-accent hover:underline">Terms</a> and{" "}
                <a href="#" className="text-accent hover:underline">Privacy Policy</a>.
              </span>
            </label>
            <Button variant="hero" size="lg" className="mt-2" disabled={status === "loading"}>
              {status === "loading" ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Create account <ArrowRight className="h-4 w-4" />
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
              className="w-full"
              onClick={() => window.location.href = "/api/auth/google"}
            >
              Continue with Google
            </Button>
          </form>

          <p className="text-sm text-muted-foreground mt-6 text-center">
            Already a member?{" "}
            <Link to="/signin" className="text-accent font-semibold hover:underline">
              Sign in
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

export default SignUp;
