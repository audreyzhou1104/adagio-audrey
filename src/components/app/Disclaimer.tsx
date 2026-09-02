import { Info } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  children?: React.ReactNode;
  className?: string;
};

const Disclaimer = ({ children, className }: Props) => (
  <aside
    role="note"
    aria-label="Educational information notice"
    className={cn(
      "flex gap-3 rounded-xl border border-border bg-muted/60 p-4 text-sm text-muted-foreground",
      className,
    )}
  >
    <Info aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
    <p>
      {children ?? (
        <>
          <span className="font-medium text-foreground">Educational information only.</span> Adagio does not diagnose,
          prescribe treatment, or replace care from a medical or mental-health professional. Always follow your
          clinician&apos;s guidance.
        </>
      )}
    </p>
  </aside>
);

export default Disclaimer;
