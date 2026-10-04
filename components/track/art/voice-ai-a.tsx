import { A, type ArtMap } from "./kit";
import { Arrow, T } from "./streaming-data-a";
import { Svc } from "./observability-a";

/** Card illustrations for the Voice AI track (modules 1–9), keyed by module slug. */

const HOT = "fill-accent/20 stroke-accent";
const TOOL = "fill-viz-compute/20 stroke-viz-compute";
const DATA = "fill-viz-data/25 stroke-viz-data";
const GOOD = "fill-good/20 stroke-good";
const BAD = "fill-bad/20 stroke-bad";

/** A row of waveform bars centred on y; heights from a fixed pattern. */
export function Wave({
  x,
  y,
  n = 12,
  gap = 4,
  h = 18,
  cls = "fill-accent",
  className = "",
}: {
  x: number;
  y: number;
  n?: number;
  gap?: number;
  h?: number;
  cls?: string;
  className?: string;
}) {
  const pat = [0.3, 0.6, 1, 0.7, 0.4, 0.85, 0.5, 0.95, 0.35, 0.65, 0.8, 0.45];
  return (
    <g className={className}>
      {Array.from({ length: n }, (_, i) => {
        const hh = Math.max(2, pat[i % pat.length] * h);
        return (
          <rect
            key={i}
            x={x + i * gap}
            y={y - hh / 2}
            width={gap * 0.55}
            height={hh}
            rx={1}
            className={cls}
          />
        );
      })}
    </g>
  );
}

export const voiceAiArtA: ArtMap = {
  "why-voice": () => (
    <>
      <rect
        x={30}
        y={22}
        width={26}
        height={46}
        rx={5}
        className="fill-surface-2/60 stroke-line-strong"
        strokeWidth={1.2}
      />
      <circle cx={43} cy={61} r={2} className="fill-muted" />
      {[10, 18, 26].map((r, i) => (
        <path
          key={r}
          d={`M${64 + i * 2} ${45 - r / 2} Q ${70 + r} 45 ${64 + i * 2} ${45 + r / 2}`}
          className={`${A} stroke-accent fill-none group-hover:translate-x-1`}
          strokeWidth={1.4}
          opacity={1 - i * 0.25}
        />
      ))}
      <Wave x={98} y={45} n={8} h={20} />
      <text x={10} y={88} className={T}>
        talk, don&apos;t type
      </text>
    </>
  ),

  "sound-basics": () => (
    <>
      <path
        d="M14 46 C 30 14, 46 14, 62 46 S 94 78, 110 46 S 142 14, 150 30"
        className="stroke-viz-data fill-none"
        strokeWidth={1.4}
      />
      {Array.from({ length: 14 }, (_, i) => {
        const x = 14 + i * 10;
        const y = 46 - 26 * Math.sin(((x - 14) / 96) * 2 * Math.PI);
        return (
          <circle
            key={i}
            cx={x}
            cy={Math.round(y * 10) / 10}
            r={2.2}
            className={`${A} fill-accent group-hover:scale-125`}
          />
        );
      })}
      <text x={10} y={88} className={T}>
        a wave, sampled
      </text>
    </>
  ),

  "voice-pipeline": () => (
    <>
      {[
        [12, "hear", DATA],
        [62, "think", HOT],
        [112, "speak", TOOL],
      ].map(([x, l, c], i) => (
        <g key={l as string}>
          <Svc x={x as number} y={36} w={36} h={16} label={l as string} cls={c as string} />
          {i < 2 && (
            <Arrow
              x1={(x as number) + 38}
              y1={44}
              x2={(x as number) + 48}
              y2={44}
              className={`${A} group-hover:translate-x-0.5`}
            />
          )}
        </g>
      ))}
      <text x={10} y={88} className={T}>
        speech → text → reply → speech
      </text>
    </>
  ),

  "speech-to-text": () => (
    <>
      <Wave x={14} y={44} n={12} h={26} cls="fill-viz-data" />
      <Arrow x1={66} y1={44} x2={82} y2={44} className={`${A} group-hover:translate-x-1`} />
      <rect
        x={88}
        y={34}
        width={60}
        height={20}
        rx={4}
        className="fill-surface-2/60 stroke-line-strong"
        strokeWidth={1.2}
      />
      <text x={118} y={47} textAnchor="middle" className="fill-fg font-mono text-[8px]">
        &ldquo;hello&rdquo;
      </text>
      <text x={10} y={88} className={T}>
        sound in, words out
      </text>
    </>
  ),

  "turn-taking": () => (
    <>
      <text x={10} y={33} className={T}>
        caller
      </text>
      <text x={10} y={59} className={T}>
        agent
      </text>
      <Wave x={42} y={30} n={8} h={14} cls="fill-viz-data" />
      <Wave
        x={84}
        y={56}
        n={8}
        h={14}
        cls="fill-accent"
        className={`${A} group-hover:-translate-x-1`}
      />
      <line x1={76} y1={20} x2={76} y2={68} className="stroke-muted" strokeDasharray="2 2" />
      <text x={70} y={76} className="fill-subtle font-mono text-[5.5px]">
        gap
      </text>
      <text x={10} y={88} className={T}>
        whose turn is it?
      </text>
    </>
  ),

  "real-audio": () => (
    <>
      {Array.from({ length: 30 }, (_, i) => (
        <circle
          key={i}
          cx={14 + ((i * 37) % 52)}
          cy={26 + ((i * 23) % 38)}
          r={1}
          className="fill-muted"
        />
      ))}
      <Wave x={20} y={45} n={10} h={18} cls="fill-viz-data" />
      <Svc x={72} y={37} w={24} h={16} label="clean" cls={TOOL} />
      <Arrow x1={98} y1={45} x2={108} y2={45} />
      <Wave
        x={112}
        y={45}
        n={9}
        h={18}
        cls="fill-accent"
        className={`${A} group-hover:scale-y-110`}
      />
      <text x={10} y={88} className={T}>
        echo, noise, other voices
      </text>
    </>
  ),

  "text-to-speech": () => (
    <>
      <rect
        x={12}
        y={34}
        width={56}
        height={20}
        rx={4}
        className="fill-surface-2/60 stroke-line-strong"
        strokeWidth={1.2}
      />
      <text x={40} y={47} textAnchor="middle" className="fill-fg font-mono text-[8px]">
        &ldquo;Hi!&rdquo;
      </text>
      <Arrow x1={72} y1={44} x2={88} y2={44} className={`${A} group-hover:translate-x-1`} />
      <Wave x={94} y={44} n={12} h={26} />
      <text x={10} y={88} className={T}>
        words in, voice out
      </text>
    </>
  ),

  "writing-for-voice": () => (
    <>
      <rect x={12} y={20} width={64} height={48} rx={4} className={BAD} strokeWidth={1.2} />
      {[28, 36, 44, 52, 60].map((y) => (
        <line
          key={y}
          x1={18}
          y1={y}
          x2={70}
          y2={y}
          className="stroke-bad"
          strokeWidth={1.4}
          opacity={0.6}
        />
      ))}
      <rect x={88} y={20} width={60} height={48} rx={4} className={GOOD} strokeWidth={1.2} />
      {[30, 44, 58].map((y, i) => (
        <line
          key={y}
          x1={94}
          y1={y}
          x2={94 + [36, 28, 40][i]}
          y2={y}
          className={`${A} stroke-good group-hover:translate-x-0.5`}
          strokeWidth={2}
        />
      ))}
      <text x={10} y={88} className={T}>
        short, spoken sentences
      </text>
    </>
  ),

  "voice-cloning": () => (
    <>
      <Wave x={14} y={36} n={10} h={18} cls="fill-viz-data" />
      <Wave
        x={14}
        y={60}
        n={10}
        h={18}
        cls="fill-accent"
        className={`${A} group-hover:translate-x-1`}
      />
      <rect x={96} y={30} width={44} height={36} rx={5} className={GOOD} strokeWidth={1.2} />
      <path d="M108 48 l6 6 l12 -12" className="stroke-good fill-none" strokeWidth={2} />
      <text x={10} y={88} className={T}>
        a copy needs consent
      </text>
    </>
  ),
};
