import { Link, useParams } from "react-router-dom";
import {
  AlertTriangle,
  ArrowLeft,
  ExternalLink,
  FileText,
  Headphones,
  HeartHandshake,
  MessageCircleQuestion,
  PlayCircle,
  Wrench,
} from "lucide-react";
import { injuries } from "@/data/content";
import { getResources, type ResourceKind } from "@/data/resources";
import { Button } from "@/components/ui/button";
import PageHeader from "@/components/app/PageHeader";
import Disclaimer from "@/components/app/Disclaimer";

const kindIcon: Record<ResourceKind, typeof PlayCircle> = {
  video: PlayCircle,
  article: FileText,
  audio: Headphones,
  tool: Wrench,
};

const LibraryDetail = () => {
  const { slug } = useParams();
  const injury = injuries.find((i) => i.slug === slug);

  if (!injury) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl">Guide not found</h1>
        <Button asChild variant="outline">
          <Link to="/library">Back to library</Link>
        </Button>
      </div>
    );
  }

  const resources = getResources(injury.resourceIds);

  return (
    <div className="space-y-8">
      <Link to="/library" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft aria-hidden="true" className="h-4 w-4" /> Recovery library
      </Link>

      <PageHeader eyebrow={injury.area} title={injury.name} description={injury.summary} />

      <section aria-labelledby="what" className="surface p-6">
        <h2 id="what" className="text-xl">What&apos;s actually happening</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{injury.whatItIs}</p>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <section aria-labelledby="signs" className="surface p-6">
          <h2 id="signs" className="text-lg">What dancers usually notice</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-muted-foreground">
            {injury.symptoms.map((s) => <li key={s}>{s}</li>)}
          </ul>
        </section>
        <section aria-labelledby="dance" className="surface p-6">
          <h2 id="dance" className="text-lg">Why it behaves differently in dance</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-muted-foreground">
            {injury.danceContext.map((s) => <li key={s}>{s}</li>)}
          </ul>
          <p className="mt-4 text-sm text-muted-foreground">
            <span className="font-medium text-foreground">Common in: </span>
            {injury.commonIn}
          </p>
        </section>
      </div>

      <section aria-labelledby="phases">
        <h2 id="phases" className="mb-1 text-xl">Typical recovery phases</h2>
        <p className="mb-4 text-sm text-muted-foreground">
          General education, not a protocol. Your timeline belongs to you and your clinician.
        </p>
        <ol className="space-y-4">
          {injury.phases.map((p, idx) => (
            <li key={p.name} className="surface p-6">
              <div className="flex flex-wrap items-baseline gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary font-serif text-sm">
                  {idx + 1}
                </span>
                <p className="font-serif text-xl">{p.name}</p>
                <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">{p.typical}</p>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{p.focus}</p>

              <div className="mt-5 grid gap-4 sm:grid-cols-3">
                <div>
                  <p className="eyebrow mb-2">Goals</p>
                  <ul className="list-disc space-y-1 pl-4 text-sm text-muted-foreground">
                    {p.goals.map((g) => <li key={g}>{g}</li>)}
                  </ul>
                </div>
                <div>
                  <p className="eyebrow mb-2">What the work looks like</p>
                  <ul className="list-disc space-y-1 pl-4 text-sm text-muted-foreground">
                    {p.work.map((g) => <li key={g}>{g}</li>)}
                  </ul>
                </div>
                <div>
                  <p className="eyebrow mb-2">Usually too soon</p>
                  <ul className="list-disc space-y-1 pl-4 text-sm text-muted-foreground">
                    {p.avoid.map((g) => <li key={g}>{g}</li>)}
                  </ul>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="surface bg-gradient-dawn p-6">
        <HeartHandshake aria-hidden="true" className="h-5 w-5 text-primary" />
        <h2 className="mt-3 text-lg">The emotional side</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{injury.emotional}</p>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-relaxed text-muted-foreground">
          {injury.emotionalPractices.map((e) => <li key={e}>{e}</li>)}
        </ul>
        <div className="mt-5 flex flex-wrap gap-2">
          <Button asChild size="sm" variant="outline">
            <Link to="/journal">Reflect on this in your journal</Link>
          </Button>
          {injury.focusId && (
            <Button asChild size="sm">
              <Link to="/plan">Open the matching recovery plan</Link>
            </Button>
          )}
        </div>
      </section>

      {resources.length > 0 && (
        <section aria-labelledby="resources">
          <h2 id="resources" className="mb-1 text-xl">Videos and reading for this guide</h2>
          <p className="mb-4 text-sm text-muted-foreground">
            Checked links from clinicians, hospitals and dance-health organisations. Adagio doesn&apos;t control these
            pages, and none of them replace your own clinician.
          </p>
          <ul className="grid gap-3 sm:grid-cols-2">
            {resources.map((r) => {
              const Icon = kindIcon[r.kind];
              return (
                <li key={r.id}>
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
                </li>
              );
            })}
          </ul>
        </section>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <section aria-labelledby="flags" className="surface p-6">
          <h2 id="flags" className="flex items-center gap-2 text-lg">
            <AlertTriangle aria-hidden="true" className="h-5 w-5 text-primary" /> Get professional input if
          </h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-muted-foreground">
            {injury.redFlags.map((f) => <li key={f}>{f}</li>)}
          </ul>
          <Button asChild size="sm" variant="outline" className="mt-4">
            <Link to="/resources">Find professional support</Link>
          </Button>
        </section>
        <section aria-labelledby="ask" className="surface p-6">
          <h2 id="ask" className="flex items-center gap-2 text-lg">
            <MessageCircleQuestion aria-hidden="true" className="h-5 w-5 text-primary" /> Questions worth asking
          </h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-muted-foreground">
            {injury.clinicianQuestions.map((q) => <li key={q}>{q}</li>)}
          </ul>
        </section>
      </div>

      <Disclaimer />
    </div>
  );
};

export default LibraryDetail;
