import logoMark from "@/assets/adagio-logo.png";
import { Link } from "react-router-dom";
import { ArrowRight, Activity, Brain, ClipboardCheck, Users, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import Disclaimer from "@/components/app/Disclaimer";
import { useAuth } from "@/lib/auth";
import { useAdagio } from "@/lib/store";

const pillars = [
  { icon: Activity, title: "Physical rehabilitation", text: "Track pain, load, and progress through clear recovery phases built around ballet demands." },
  { icon: Brain, title: "Emotional recovery", text: "Mood, fear, and identity tracking that sits alongside your physical data, not beneath it." },
  { icon: ClipboardCheck, title: "Return-to-dance readiness", text: "A two-sided check: what your body can do, and whether your mind feels safe doing it." },
  { icon: Users, title: "Community & culture", text: "Moderated peer spaces, recovery stories, and resources for a healthier dance environment." },
];

const freeFeatures = [
  "Personalized dashboard and profile",
  "Daily physical and emotional check-ins",
  "One recovery focus at a time",
  "Ballet-specific recovery library",
  "Basic journaling",
  "Community, culture hub and crisis resources",
];

const premiumFeatures = [
  "AI journal analysis — reflection summary, emotional themes, personalized suggestions",
  "Full personalized physical + psychological recovery plans",
  "Unlimited recovery focuses and progress history",
  "Return-to-dance readiness tracking over time",
  "Identity map with saved reflections",
  "Appearance customization and data export",
];

const Index = () => {
  const { state } = useAdagio();
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5">
        <span className="flex items-center gap-2">
          <img src={logoMark} alt="Adagio logo" width={1024} height={1024} className="h-9 w-9 rounded-md object-cover" />
          <span className="font-serif text-2xl">Adagio</span>
        </span>

        <div className="flex items-center gap-2">
          <Button asChild variant="ghost" size="sm">
            <a href="#pricing">Pricing</a>
          </Button>
          <Button asChild variant="ghost" size="sm">
            <Link to={user ? "/dashboard" : "/auth"}>{user ? `Continue as ${state.profile?.name ?? "you"}` : "Sign in or create an account"}</Link>
          </Button>
        </div>
      </header>

      <main>
        <section className="mx-auto max-w-6xl px-5 pb-16 pt-8 sm:pt-16">
          <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <p className="eyebrow mb-4">RECOVERY &amp; WELL-BEING FOR DANCERS, AGES 12+</p>
              <h1 className="max-w-xl text-4xl font-normal leading-[1.1] sm:text-6xl">
                Healing the dancer, not just the injury.
              </h1>
              <p className="mt-6 max-w-lg text-lg leading-relaxed text-muted-foreground">
                Adagio supports physical rehabilitation and emotional recovery together — rebuilding confidence, trust
                in your body, and your sense of self, whatever comes next.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button asChild size="lg">
                  <Link to={user ? "/dashboard" : "/auth"}>
                    {state.profile ? "Open your dashboard" : "Set up your profile"}
                    <ArrowRight aria-hidden="true" className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link to="/library">Explore the recovery library</Link>
                </Button>
              </div>
              <p className="mt-6 text-sm text-muted-foreground">
                Aligned with UN SDG 3: Good Health &amp; Well-Being.
              </p>
            </div>

            <div className="surface overflow-hidden">
              <div className="bg-gradient-calm px-6 py-10 text-primary-foreground">
                <p className="text-xs uppercase tracking-[0.18em] opacity-80">Week 7 · Ankle sprain</p>
                <p className="mt-3 font-serif text-3xl">Rebuild phase</p>
                <p className="mt-2 max-w-xs text-sm opacity-90">
                  Balance work is holding steady. Fear of landing is still the piece we&apos;re working on.
                </p>
              </div>
              <dl className="grid grid-cols-3 divide-x divide-border">
                {[
                  ["Pain", "2/10"],
                  ["Mood", "Steady"],
                  ["Readiness", "62%"],
                ].map(([k, v]) => (
                  <div key={k} className="px-4 py-5 text-center">
                    <dt className="text-xs text-muted-foreground">{k}</dt>
                    <dd className="mt-1 font-serif text-xl">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </section>

        <section className="border-y border-border bg-muted/40 py-16">
          <div className="mx-auto max-w-6xl px-5">
            <h2 className="text-2xl sm:text-3xl">Four connected sides of recovery</h2>
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {pillars.map(({ icon: Icon, title, text }) => (
                <article key={title} className="surface p-6">
                  <Icon aria-hidden="true" className="h-5 w-5 text-primary" />
                  <h3 className="mt-4 text-lg">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="pricing" className="mx-auto max-w-6xl scroll-mt-8 px-5 py-16">
          <p className="eyebrow mb-3">Pricing</p>
          <h2 className="text-2xl sm:text-3xl">Start free. Go deeper with Premium.</h2>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            Core recovery tracking is always free. Premium unlocks the AI-assisted layers — journal analysis, full
            personalized plans, and long-term progress history.
          </p>

          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            <article className="surface flex flex-col p-7">
              <h3 className="text-lg">Free</h3>
              <p className="mt-3 font-serif text-4xl">$0</p>
              <p className="mt-1 text-sm text-muted-foreground">Everything you need to start recovering well.</p>
              <ul className="mt-6 flex-1 space-y-3 text-sm">
                {freeFeatures.map((f) => (
                  <li key={f} className="flex gap-3">
                    <Check aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <span className="text-muted-foreground">{f}</span>
                  </li>
                ))}
              </ul>
              <Button asChild variant="outline" className="mt-7">
                <Link to={user ? "/dashboard" : "/auth"}>Start free</Link>
              </Button>
            </article>

            <article className="surface flex flex-col border-primary/40 p-7 ring-1 ring-primary/20">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-lg">Premium</h3>
                <span className="rounded-full bg-sage-soft px-3 py-1 text-xs">Best value yearly</span>
              </div>
              <div className="mt-3 flex flex-wrap items-baseline gap-3">
                <p className="font-serif text-4xl">$4.99</p>
                <span className="text-sm text-muted-foreground">per month</span>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                or <span className="font-medium text-foreground">$49.99 per year</span> — two months free.
              </p>
              <ul className="mt-6 flex-1 space-y-3 text-sm">
                {premiumFeatures.map((f) => (
                  <li key={f} className="flex gap-3">
                    <Check aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <span className="text-muted-foreground">{f}</span>
                  </li>
                ))}
              </ul>
              <Button asChild className="mt-7">
                <Link to={user ? "/dashboard" : "/auth"}>Try Premium in the prototype</Link>
              </Button>
              <p className="mt-3 text-xs text-muted-foreground">
                Prototype only — no payment is taken and no account is created.
              </p>
            </article>
          </div>
        </section>

        <section className="mx-auto max-w-3xl px-5 pb-16">
          <Disclaimer />
        </section>
      </main>

      <footer className="border-t border-border px-5 py-8 text-center text-sm text-muted-foreground">
        Adagio — prototype. Your entries are saved only in this browser.
      </footer>
    </div>
  );
};

export default Index;
