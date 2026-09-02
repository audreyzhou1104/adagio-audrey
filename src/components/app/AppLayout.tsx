import logoMark from "@/assets/adagio-logo.png";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { LogOut, Menu, Phone } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetHeader } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { navItems, primaryNav } from "./nav";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth";
import { UnsavedChangesProvider, useUnsavedNav } from "@/lib/unsaved";
import { usePlanIncomplete } from "@/lib/plan-progress";

/** Small pulsing dot in the user's accent colour, shown on the plan icon when steps remain. */
const PlanDot = ({ className }: { className?: string }) => (
  <span className={cn("pointer-events-none absolute -right-0.5 -top-0.5 flex h-2 w-2", className)}>
    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
    <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
  </span>
);

const AppShell = () => {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const { user, signOut } = useAuth();
  const guard = useUnsavedNav();
  const planIncomplete = usePlanIncomplete();

  useEffect(() => {
    setOpen(false);
    window.scrollTo({ top: 0 });
  }, [pathname]);

  // Intercept in-app navigation while a page has unsaved entries.
  const guarded = (to: string) => (e: React.MouseEvent) => {
    if (guard && !guard.attempt(to)) e.preventDefault();
  };


  return (
    <div className="min-h-screen bg-background">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
      >
        Skip to content
      </a>

      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-60 flex-col border-r border-border bg-card px-4 py-6 md:flex">
        <Link to="/" className="mb-8 flex items-start gap-2 px-2" onClick={guarded("/")}>
          <img src={logoMark} alt="" width={1024} height={1024} loading="lazy" className="mt-1 h-8 w-8 rounded-md object-cover" />
          <span>
            <span className="block font-serif text-2xl leading-none">Adagio</span>
            <span className="mt-1 block text-xs text-muted-foreground">Recovery & well-being for dancers</span>
          </span>
        </Link>

        <nav aria-label="Main" className="flex-1 space-y-1 overflow-y-auto">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={guarded(to)}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
                  isActive
                    ? "bg-secondary font-medium text-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )
              }
            >
              <span className="relative inline-flex">
                <Icon aria-hidden="true" className="h-4 w-4" />
                {to === "/plan" && planIncomplete && <PlanDot />}
              </span>
              {label}
              {to === "/plan" && planIncomplete && <span className="sr-only">Steps remaining today</span>}

            </NavLink>
          ))}
        </nav>
        <Link
          to="/resources"
          onClick={guarded("/resources")}
          className="mt-4 flex items-center gap-2 rounded-lg border border-border bg-muted/60 px-3 py-3 text-sm text-foreground"
        >
          <Phone aria-hidden="true" className="h-4 w-4 text-primary" />
          Need help now?
        </Link>
        <div className="mt-3 border-t border-border pt-3">
          <p className="truncate px-3 text-xs text-muted-foreground">{user?.email}</p>
          <Button variant="ghost" className="mt-1 w-full justify-start px-3" onClick={() => void signOut()}>
            <LogOut aria-hidden="true" className="mr-2 h-4 w-4" />
            Sign out
          </Button>
        </div>
      </aside>


      {/* Mobile header */}
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-border bg-background/90 px-4 py-3 backdrop-blur md:hidden">
        <Link to="/" className="flex items-center gap-2 font-serif text-xl" onClick={guarded("/")}>
          <img src={logoMark} alt="" width={1024} height={1024} loading="lazy" className="h-7 w-7 rounded-md object-cover" />
          Adagio
        </Link>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="Open menu">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[85vw] max-w-sm overflow-y-auto">
            <SheetHeader>
              <SheetTitle className="font-serif text-left text-xl">Menu</SheetTitle>
            </SheetHeader>
            <nav aria-label="All sections" className="mt-6 space-y-1">
              {navItems.map(({ to, label, icon: Icon, description }) => (
                <NavLink
                  key={to}
                  to={to}
                  onClick={guarded(to)}
                  className={({ isActive }) =>
                    cn(
                      "flex items-start gap-3 rounded-lg px-3 py-3 text-sm",
                      isActive ? "bg-secondary" : "hover:bg-muted",
                    )
                  }
                >
                  <span className="relative mt-0.5 inline-flex">
                    <Icon aria-hidden="true" className="h-4 w-4 text-primary" />
                    {to === "/plan" && planIncomplete && <PlanDot />}
                  </span>

                  <span>
                    <span className="block font-medium">{label}</span>
                    <span className="block text-xs text-muted-foreground">{description}</span>
                  </span>
                </NavLink>
              ))}
              <button
                onClick={() => void signOut()}
                className="mt-4 flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm text-muted-foreground hover:bg-muted"
              >
                <LogOut aria-hidden="true" className="h-4 w-4" />
                Sign out
              </button>
            </nav>
          </SheetContent>
        </Sheet>
      </header>

      <main id="main" className="px-4 pb-28 pt-6 sm:px-6 md:ml-60 md:px-10 md:pb-16 md:pt-10">
        <div className="mx-auto max-w-5xl">
          <Outlet />
        </div>
      </main>

      {/* Mobile bottom nav */}
      <nav
        aria-label="Primary"
        className="fixed bottom-0 left-0 right-0 z-30 grid grid-cols-4 border-t border-border bg-card/95 backdrop-blur md:hidden"
      >
        {primaryNav.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            onClick={guarded(to)}
            className={({ isActive }) =>
              cn(
                "flex flex-col items-center gap-1 py-3 text-[11px]",
                isActive ? "text-foreground" : "text-muted-foreground",
              )
            }
          >
            <span className="relative inline-flex">
              <Icon aria-hidden="true" className="h-5 w-5" />
              {to === "/plan" && planIncomplete && <PlanDot />}
            </span>
            {label}

          </NavLink>
        ))}
      </nav>
    </div>
  );
};

const AppLayout = () => (
  <UnsavedChangesProvider>
    <AppShell />
  </UnsavedChangesProvider>
);

export default AppLayout;
