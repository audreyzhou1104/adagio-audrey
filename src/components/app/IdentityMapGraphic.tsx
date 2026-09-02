type Branch = { label: string; text: string };

type Props = {
  center: string;
  branches: Branch[];
  values: string[];
  className?: string;
};

const clamp = (s: string, n: number) => (s.length > n ? `${s.slice(0, n - 1).trimEnd()}…` : s);

const wrap = (s: string, per: number, lines: number) => {
  const words = s.split(/\s+/).filter(Boolean);
  const out: string[] = [];
  let cur = "";
  for (const w of words) {
    if ((cur + " " + w).trim().length > per) {
      out.push(cur.trim());
      cur = w;
      if (out.length === lines) break;
    } else {
      cur = `${cur} ${w}`.trim();
    }
  }
  if (out.length < lines && cur) out.push(cur.trim());
  const res = out.slice(0, lines);
  if (res.length === lines && s.split(/\s+/).join(" ").length > res.join(" ").length) {
    res[lines - 1] = clamp(res[lines - 1] + "…", per + 1);
  }
  return res;
};

/** A radial identity map: the person at the centre, branches around them. */
const IdentityMapGraphic = ({ center, branches, values, className }: Props) => {
  const w = 720;
  const h = 520;
  const cx = w / 2;
  const cy = h / 2;
  const rx = 250;
  const ry = 175;
  const filled = branches.filter((b) => b.text.trim().length > 0);
  const items = filled.length ? filled : branches;

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      className={className}
      role="img"
      aria-label={`Identity map for ${center}`}
    >
      <title>{`Identity map for ${center}`}</title>
      {items.map((b, i) => {
        const a = (i / items.length) * Math.PI * 2 - Math.PI / 2;
        const x = cx + Math.cos(a) * rx;
        const y = cy + Math.sin(a) * ry;
        const bw = 190;
        const bh = 76;
        const bx = Math.min(Math.max(x - bw / 2, 6), w - bw - 6);
        const by = Math.min(Math.max(y - bh / 2, 6), h - bh - 6);
        return (
          <g key={b.label}>
            <line
              x1={cx}
              y1={cy}
              x2={bx + bw / 2}
              y2={by + bh / 2}
              stroke="hsl(var(--border))"
              strokeWidth={1.5}
            />
            <rect
              x={bx}
              y={by}
              width={bw}
              height={bh}
              rx={12}
              fill="hsl(var(--card))"
              stroke="hsl(var(--border))"
            />
            <text
              x={bx + 12}
              y={by + 22}
              fontSize={11}
              letterSpacing="0.08em"
              fill="hsl(var(--muted-foreground))"
            >
              {clamp(b.label.toUpperCase(), 26)}
            </text>
            {wrap(b.text || "—", 30, 3).map((line, li) => (
              <text
                key={li}
                x={bx + 12}
                y={by + 40 + li * 14}
                fontSize={11.5}
                fill="hsl(var(--foreground))"
              >
                {line}
              </text>
            ))}
          </g>
        );
      })}

      <circle cx={cx} cy={cy} r={78} fill="hsl(var(--primary))" />
      <text
        x={cx}
        y={cy - 2}
        textAnchor="middle"
        fontSize={19}
        fill="hsl(var(--primary-foreground))"
      >
        {clamp(center || "You", 14)}
      </text>
      <text
        x={cx}
        y={cy + 20}
        textAnchor="middle"
        fontSize={10.5}
        letterSpacing="0.08em"
        fill="hsl(var(--primary-foreground))"
        opacity={0.8}
      >
        A PERSON, NOT A ROLE
      </text>

      {values.slice(0, 6).map((v, i) => {
        const a = (i / Math.max(values.slice(0, 6).length, 1)) * Math.PI * 2 + Math.PI / 6;
        const x = cx + Math.cos(a) * 118;
        const y = cy + Math.sin(a) * 108;
        const bw = Math.max(52, v.length * 7 + 18);
        return (
          <g key={v}>
            <rect
              x={x - bw / 2}
              y={y - 11}
              width={bw}
              height={22}
              rx={11}
              fill="hsl(var(--accent))"
              opacity={0.55}
            />
            <text x={x} y={y + 4} textAnchor="middle" fontSize={11} fill="hsl(var(--foreground))">
              {v}
            </text>
          </g>
        );
      })}
    </svg>
  );
};

export default IdentityMapGraphic;
