import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ExternalLink, FileText, Headphones, PlayCircle, Search, Wrench } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { injuries } from "@/data/content";
import { searchResources, resourceList, type Resource, type ResourceKind } from "@/data/resources";
import PageHeader from "@/components/app/PageHeader";
import Disclaimer from "@/components/app/Disclaimer";
import { cn } from "@/lib/utils";
import { useAdagio } from "@/lib/store";

const areas = ["All", ...Array.from(new Set(injuries.map((i) => i.area)))];

const kindIcon: Record<ResourceKind, typeof PlayCircle> = {
  video: PlayCircle,
  article: FileText,
  audio: Headphones,
  tool: Wrench,
};

const ResourceCard = ({ r }: { r: Resource }) => {
  const Icon = kindIcon[r.kind];
  return (
    <a
      href={r.url}
      target="_blank"
      rel="noreferrer noopener"
      className="surface flex h-full items-start gap-3 p-4 transition-colors hover:bg-muted/60"
    >
      <Icon aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
      <span className="flex-1">
        <span className="block font-medium">{r.title}</span>
        <span className="block text-xs uppercase tracking-[0.14em] text-muted-foreground">
          {r.source}
          {r.minutes ? ` · ${r.minutes} min` : ""}
        </span>
        <span className="mt-1 block text-sm text-muted-foreground">{r.note}</span>
      </span>
      <ExternalLink aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
    </a>
  );
};

const Library = () => {
  const [query, setQuery] = useState("");
  const [area, setArea] = useState("All");
  const { state } = useAdagio();
  const { profile } = state;
  const [situation, setSituation] = useState("");
  const [submitted, setSubmitted] = useState("");

  const reading = useMemo(() => (submitted ? searchResources(submitted, 8) : []), [submitted]);

  const results = useMemo(
    () =>
      injuries.filter(
        (i) =>
          (area === "All" || i.area === area) &&
          (i.name + i.summary + i.commonIn).toLowerCase().includes(query.toLowerCase()),
      ),
    [query, area],
  );




  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Recovery library"
        title="Ballet-specific injury & recovery guides"
        description="Plain-language education written around the demands of dance — turnout, pointe work, allegro, and partnering."
      />

      <div className="space-y-4">
        <div className="relative">
          <Search aria-hidden="true" className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search injuries, symptoms, or situations"
            aria-label="Search the recovery library"
            className="pl-9"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {areas.map((a) => (
            <button
              key={a}
              onClick={() => setArea(a)}
              aria-pressed={area === a}
              className={cn(
                "rounded-full border border-border px-3 py-1.5 text-sm transition-colors",
                area === a ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground hover:bg-muted",
              )}
            >
              {a}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {results.map((i) => (
          <Link key={i.slug} to={`/library/${i.slug}`} className="surface block p-5 transition-colors hover:bg-muted/50">
            <p className="eyebrow">{i.area}</p>
            <h2 className="mt-2 text-lg">{i.name}</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{i.summary}</p>
          </Link>
        ))}
        {results.length === 0 && (
          <p className="text-sm text-muted-foreground">No guides match that search yet.</p>
        )}
      </div>

      <section aria-labelledby="research" className="surface p-6">
        <p className="eyebrow flex items-center gap-2">
          <Search aria-hidden="true" className="h-4 w-4 text-primary" /> Reading & video finder
        </p>
        <h2 id="research" className="mt-2 text-xl">
          Find material for your situation
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Describe what you&apos;re dealing with and Adagio matches it against a hand-checked library of real
          published pages and videos — NHS, orthopaedic surgeons, dance medicine researchers, eating disorder
          charities and physiotherapists. Every link here has been opened and verified, so nothing is invented.
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            setSubmitted(situation.trim());
          }}
          className="mt-4 flex flex-col gap-2 sm:flex-row"
        >
          <Input
            value={situation}
            onChange={(e) => setSituation(e.target.value)}
            placeholder="e.g. returning to pointe after an ankle sprain, and I'm scared"
            aria-label="Describe your situation"
          />
          <Button type="submit" disabled={!situation.trim()}>
            <Search aria-hidden="true" className="mr-2 h-4 w-4" />
            Find reading
          </Button>
        </form>

        <div className="mt-3 flex flex-wrap gap-2">
          {profile?.focusLabel && (
            <button
              onClick={() => {
                setSituation(profile.focusLabel);
                setSubmitted(profile.focusLabel);
              }}
              className="rounded-full border border-border bg-card px-4 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              Use my recovery focus: {profile.focusLabel}
            </button>
          )}
          {["fear of reinjury", "burnout", "sleep", "body image", "identity after dance"].map((t) => (
            <button
              key={t}
              onClick={() => {
                setSituation(t);
                setSubmitted(t);
              }}
              className="rounded-full border border-border bg-card px-4 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              {t}
            </button>
          ))}
        </div>

        {submitted && (
          <div className="mt-6 space-y-4" aria-live="polite">
            {reading.length > 0 ? (
              <>
                <p className="text-sm text-muted-foreground">
                  {reading.length} verified {reading.length === 1 ? "resource" : "resources"} matching “{submitted}”.
                </p>
                <ul className="grid gap-3 sm:grid-cols-2">
                  {reading.map((r) => (
                    <li key={r.id}><ResourceCard r={r} /></li>
                  ))}
                </ul>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">
                Nothing in the checked library matches that wording yet. Try a simpler term such as “ankle”,
                “burnout”, “anxiety”, “sleep”, “body image” or “identity” — or browse the full list below.
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              These are external pages Adagio does not control. They are education, not advice about your body.
            </p>
          </div>
        )}
      </section>

      <section aria-labelledby="all-resources">
        <h2 id="all-resources" className="mb-1 text-xl">The full checked library</h2>
        <p className="mb-4 text-sm text-muted-foreground">
          Every resource Adagio links to, in one place.
        </p>
        <ul className="grid gap-3 sm:grid-cols-2">
          {resourceList
            .filter((r, i, arr) => arr.findIndex((x) => x.url === r.url) === i)
            .map((r) => (
              <li key={r.id}><ResourceCard r={r} /></li>
            ))}
        </ul>
      </section>


      <Disclaimer />

    </div>
  );
};

export default Library;
