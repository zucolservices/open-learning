import { A, type ArtMap } from "./kit";
import { Arrow, T } from "./streaming-data-a";
import { Svc } from "./observability-a";
import { Wave } from "./voice-ai-a";

/** Card illustrations for the Voice AI track (modules 10–18), keyed by module slug. */

const HOT = "fill-accent/20 stroke-accent";
const TOOL = "fill-viz-compute/20 stroke-viz-compute";
const DATA = "fill-viz-data/25 stroke-viz-data";
const META = "fill-viz-meta/20 stroke-viz-meta";
const GOOD = "fill-good/20 stroke-good";

export const voiceAiArtB: ArtMap = {
  "latency-budget": () => (
    <>
      {[
        [12, 22, "turn", DATA],
        [34, 18, "stt", DATA],
        [52, 40, "model", HOT],
        [92, 24, "tts", TOOL],
        [116, 18, "net", META],
      ].map(([x, w, l, c]) => (
        <Svc
          key={l as string}
          x={x as number}
          y={36}
          w={w as number}
          h={16}
          label={l as string}
          cls={c as string}
          className={`${A} group-hover:-translate-y-0.5`}
        />
      ))}
      <line x1={140} y1={28} x2={140} y2={60} className="stroke-bad" strokeDasharray="2 2" />
      <text x={10} y={88} className={T}>
        every millisecond adds up
      </text>
    </>
  ),

  "speech-to-speech": () => (
    <>
      <Wave x={10} y={44} n={7} h={18} cls="fill-viz-data" />
      <Arrow x1={40} y1={44} x2={52} y2={44} />
      <Svc
        x={56}
        y={32}
        w={48}
        h={24}
        label="one model"
        cls={HOT}
        className={`${A} group-hover:scale-105`}
      />
      <Arrow x1={106} y1={44} x2={118} y2={44} />
      <Wave x={122} y={44} n={7} h={18} />
      <text x={10} y={88} className={T}>
        audio in, audio out
      </text>
    </>
  ),

  interruptions: () => (
    <>
      <Wave x={14} y={34} n={14} h={16} cls="fill-accent" />
      <rect x={70} y={22} width={1.5} height={46} className="fill-bad" />
      <Wave x={74} y={34} n={5} h={16} cls="fill-accent/25" />
      <Wave
        x={66}
        y={58}
        n={8}
        h={14}
        cls="fill-viz-data"
        className={`${A} group-hover:-translate-x-1`}
      />
      <text x={76} y={78} className="fill-subtle font-mono text-[5.5px]">
        &ldquo;wait, no&rdquo;
      </text>
      <text x={10} y={88} className={T}>
        stop when cut off
      </text>
    </>
  ),

  "voice-transport": () => (
    <>
      {["webrtc", "socket", "phone"].map((l, r) => (
        <g key={l}>
          <text x={10} y={26 + r * 20} className={T}>
            {l}
          </text>
          {Array.from({ length: 10 }, (_, i) => (
            <rect
              key={i}
              x={46 + i * 10}
              y={20 + r * 20}
              width={7}
              height={7}
              rx={1.5}
              className={
                r === 0 && i === 4
                  ? "stroke-muted fill-none"
                  : r === 1 && i > 4 && i < 8
                    ? "fill-viz-compute"
                    : `${A} fill-viz-data/70 group-hover:translate-x-0.5`
              }
              strokeDasharray={r === 0 && i === 4 ? "1.5 1.5" : undefined}
            />
          ))}
        </g>
      ))}
      <text x={10} y={88} className={T}>
        three roads for audio
      </text>
    </>
  ),

  "conversation-design": () => (
    <>
      <rect
        x={14}
        y={18}
        width={70}
        height={14}
        rx={6}
        className="fill-surface-2/60 stroke-line-strong"
        strokeWidth={1.2}
      />
      <text x={20} y={27} className="fill-fg font-mono text-[5.5px]">
        OK, Thursday at 4…
      </text>
      <rect x={76} y={38} width={70} height={14} rx={6} className={HOT} strokeWidth={1.2} />
      <text x={82} y={47} className="fill-fg font-mono text-[5.5px]">
        no, Friday
      </text>
      <rect
        x={14}
        y={58}
        width={70}
        height={14}
        rx={6}
        className={`${A} ${GOOD} group-hover:translate-x-0.5`}
        strokeWidth={1.2}
      />
      <text x={20} y={67} className="fill-fg font-mono text-[5.5px]">
        Friday, got it.
      </text>
      <text x={10} y={88} className={T}>
        confirm, recover, hand over
      </text>
    </>
  ),

  "voice-tools": () => (
    <>
      <rect
        x={12}
        y={24}
        width={66}
        height={16}
        rx={6}
        className="fill-surface-2/60 stroke-line-strong"
        strokeWidth={1.2}
      />
      <text x={18} y={34} className="fill-fg font-mono text-[5.5px]">
        let me check that…
      </text>
      <Arrow x1={80} y1={32} x2={94} y2={44} className={`${A} group-hover:translate-x-0.5`} />
      <Svc x={96} y={40} w={52} h={16} label="move_booking()" cls={TOOL} />
      <rect x={12} y={56} width={66} height={16} rx={6} className={GOOD} strokeWidth={1.2} />
      <text x={18} y={66} className="fill-fg font-mono text-[5.5px]">
        done: Friday, 4 PM
      </text>
      <text x={10} y={88} className={T}>
        act while talking
      </text>
    </>
  ),

  "voice-platforms": () => (
    <>
      {["phones", "glue", "speak", "think", "hear", "carry"].map((l, i) => (
        <Svc
          key={l}
          x={30}
          y={14 + i * 11}
          w={100}
          h={9}
          label={l}
          cls={i === 1 ? HOT : i === 3 ? TOOL : DATA}
          className={i % 2 ? `${A} group-hover:translate-x-0.5` : undefined}
        />
      ))}
      <text x={10} y={88} className={T}>
        the voice stack
      </text>
    </>
  ),

  "voice-quality": () => (
    <>
      <line x1={14} y1={64} x2={150} y2={64} className="stroke-line-strong" />
      {Array.from({ length: 26 }, (_, i) => {
        const x = 30 + ((i * 17) % 40) + (i > 22 ? 60 + (i - 22) * 12 : 0);
        return (
          <circle
            key={i}
            cx={x}
            cy={54 - (i % 4) * 6}
            r={2}
            className={i % 9 === 0 ? "fill-bad" : "fill-viz-data"}
          />
        );
      })}
      <line x1={52} y1={24} x2={52} y2={66} className="stroke-fg" strokeDasharray="2 2" />
      <line
        x1={98}
        y1={24}
        x2={98}
        y2={66}
        className={`${A} stroke-accent group-hover:translate-x-1`}
        strokeDasharray="2 2"
      />
      <text x={46} y={74} className="fill-subtle font-mono text-[5.5px]">
        p50
      </text>
      <text x={92} y={74} className="fill-subtle font-mono text-[5.5px]">
        p95
      </text>
      <text x={10} y={88} className={T}>
        test with real-world callers
      </text>
    </>
  ),

  "capstone-voice": () => (
    <>
      <rect
        x={20}
        y={20}
        width={26}
        height={46}
        rx={5}
        className="fill-surface-2/60 stroke-line-strong"
        strokeWidth={1.2}
      />
      <Wave x={52} y={43} n={8} h={18} className={`${A} group-hover:translate-x-1`} />
      <rect x={96} y={24} width={44} height={40} rx={5} className={GOOD} strokeWidth={1.2} />
      <path d="M118 34 v20 M108 44 h20" className="stroke-good" strokeWidth={3} />
      <text x={10} y={88} className={T}>
        the clinic phone line
      </text>
    </>
  ),
};
