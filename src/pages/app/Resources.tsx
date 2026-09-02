import { AlertCircle, ExternalLink } from "lucide-react";
import PageHeader from "@/components/app/PageHeader";

const crisis = [
  { name: "988 Suicide & Crisis Lifeline (US)", detail: "Call or text 988, 24/7", href: "tel:988" },
  { name: "Crisis Text Line", detail: "Text HOME to 741741 (US/CA), 85258 (UK)", href: "sms:741741" },
  { name: "Find a Helpline (international)", detail: "Verified crisis lines by country", href: "https://findahelpline.com" },
];

const professional = [
  { name: "Performing arts physiotherapy", detail: "Clinicians who understand pointe work, turnout, and rehearsal load." },
  { name: "Sport & performance psychology", detail: "Support for fear of reinjury, perfectionism, and return-to-performance anxiety." },
  { name: "Registered dietitians in dance", detail: "Guidance on fueling through reduced training and recovery." },
  { name: "Eating disorder support services", detail: "Specialist help for disordered eating and body image concerns." },
];

const Resources = () => (
  <div className="space-y-10">
    <PageHeader
      eyebrow="Professional & crisis support"
      title="When you need a real person"
      description="Adagio is educational support. These are the pathways to qualified human care."
    />

    <section aria-labelledby="crisis" className="surface border-destructive/30 p-6">
      <div className="flex items-center gap-2">
        <AlertCircle aria-hidden="true" className="h-5 w-5 text-destructive" />
        <h2 id="crisis" className="text-xl">
          If you are in immediate danger
        </h2>
      </div>
      <p className="mt-2 text-sm text-muted-foreground">
        Call your local emergency number. If you&apos;re having thoughts of harming yourself, please reach out now:
      </p>
      <ul className="mt-4 space-y-3">
        {crisis.map((c) => (
          <li key={c.name}>
            <a
              href={c.href}
              className="flex items-center justify-between gap-3 rounded-xl border border-border bg-muted/50 p-4 text-sm transition-colors hover:bg-muted"
            >
              <span>
                <span className="block font-medium">{c.name}</span>
                <span className="block text-muted-foreground">{c.detail}</span>
              </span>
              <ExternalLink aria-hidden="true" className="h-4 w-4 shrink-0 text-muted-foreground" />
            </a>
          </li>
        ))}
      </ul>
    </section>

    <section aria-labelledby="pro">
      <h2 id="pro" className="mb-4 text-xl">
        Types of professionals who help dancers
      </h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {professional.map((p) => (
          <article key={p.name} className="surface p-5">
            <h3 className="text-lg leading-snug">{p.name}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{p.detail}</p>
          </article>
        ))}
      </div>
    </section>

    <section className="surface p-6">
      <h2 className="text-xl">Preparing for an appointment</h2>
      <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-muted-foreground">
        <li>Bring your check-in history: pain levels, load, and what makes it worse.</li>
        <li>Say what you want from the visit — clarity, a plan, or a second opinion.</li>
        <li>Mention the emotional side too. It affects recovery and belongs in the conversation.</li>
        <li>Ask what you can do, not only what you must avoid.</li>
      </ul>
    </section>
  </div>
);

export default Resources;
