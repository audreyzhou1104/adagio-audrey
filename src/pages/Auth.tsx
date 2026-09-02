import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Check, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { passwordRules, useAuth, validatePassword } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const Auth = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!loading && user) navigate("/dashboard", { replace: true });
  }, [user, loading, navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (busy) return;

    if (mode === "signup") {
      const problems = validatePassword(password);
      if (problems.length > 0) {
        toast.error(`Password needs: ${problems.join(", ").toLowerCase()}`);
        return;
      }
      if (!name.trim()) {
        toast.error("Please add the name you'd like to be called.");
        return;
      }
    }

    setBusy(true);
    try {
      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            emailRedirectTo: window.location.origin,
            data: { display_name: name.trim() },
          },
        });
        if (error) throw error;
        if (data.session) {
          toast.success("Account created. Welcome to Adagio.");
          navigate("/dashboard", { replace: true });
        } else {
          toast.success("Account created — check your email to confirm it, then sign in.");
          setMode("signin");
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
        if (error) throw error;
        navigate("/dashboard", { replace: true });
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong. Try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md">
        <Link to="/" className="block text-center">
          <span className="font-serif text-3xl">Adagio</span>
        </Link>
        <p className="mt-2 text-center text-sm text-muted-foreground">
          Recovery &amp; well-being for dancers, ages 12+
        </p>

        <div className="surface mt-8 p-6">
          <div className="mb-6 grid grid-cols-2 gap-1 rounded-full bg-muted p-1">
            {(["signin", "signup"] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMode(m)}
                aria-pressed={mode === m}
                className={cn(
                  "rounded-full px-4 py-2 text-sm transition-colors",
                  mode === m ? "bg-card font-medium text-foreground shadow-sm" : "text-muted-foreground",
                )}
              >
                {m === "signin" ? "Sign in" : "Create account"}
              </button>
            ))}
          </div>

          <h1 className="text-2xl">
            {mode === "signin" ? "Welcome back" : "Start your recovery space"}
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {mode === "signin"
              ? "Sign in to see your own plan, check-ins, and journal."
              : "Your check-ins, journal, and plan stay tied to your account — private to you."}
          </p>

          <form onSubmit={submit} className="mt-6 space-y-4">
            {mode === "signup" && (
              <div className="space-y-2">
                <Label htmlFor="name">What should we call you?</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" required />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete={mode === "signin" ? "current-password" : "new-password"}
                required
              />
            </div>

            {mode === "signup" && (
              <ul className="space-y-1 text-sm">
                {passwordRules.map((r) => {
                  const ok = r.test(password);
                  return (
                    <li
                      key={r.label}
                      className={cn("flex items-center gap-2", ok ? "text-foreground" : "text-muted-foreground")}
                    >
                      {ok ? (
                        <Check aria-hidden="true" className="h-4 w-4 text-primary" />
                      ) : (
                        <X aria-hidden="true" className="h-4 w-4" />
                      )}
                      {r.label}
                    </li>
                  );
                })}
              </ul>
            )}

            <Button type="submit" className="w-full" disabled={busy}>
              {busy && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {mode === "signin" ? "Sign in" : "Create account"}
            </Button>
          </form>
        </div>

        <p className="mt-6 text-center text-xs leading-relaxed text-muted-foreground">
          Adagio offers educational and reflective support only. It does not diagnose, prescribe, or replace medical or
          mental-health professionals.
        </p>
      </div>
    </main>
  );
};

export default Auth;
