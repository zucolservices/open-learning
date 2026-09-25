import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export const metadata = { title: "About" };

export default function About() {
  return (
    <>
      <SiteHeader />
      <main className="page-glow flex-1">
        <div className="mx-auto max-w-2xl px-4 pt-16 pb-24 sm:px-6">
          <h1 className="text-4xl font-semibold tracking-tight">About OpenLearning</h1>
          <div className="text-muted mt-6 space-y-4 text-lg leading-relaxed">
            <p>
              OpenLearning is where our tech team builds a deep, intuitive understanding of the
              technologies we use, before a project needs it.
            </p>
            <p>
              Every module is designed around its topic. You might explore a 3D model, play a
              process forward and back, tune a live simulation, fix a broken system, or run real
              SQL, depending on what makes the idea clearest.
            </p>
          </div>
          <h2 className="mt-12 text-xl font-semibold tracking-tight">How it works</h2>
          <ul className="text-muted mt-4 space-y-3">
            <li>
              <strong className="text-fg">Open and self-paced.</strong> Start any track or module,
              in any order. Each track suggests an order, but the choice is yours.
            </li>
            <li>
              <strong className="text-fg">Checkpoints, not tests.</strong> Modules ask you to
              predict or explain before moving on. They exist to help ideas stick. Nothing is
              scored.
            </li>
            <li>
              <strong className="text-fg">Progress stays in your browser.</strong> You can resume
              where you left off on this device.
            </li>
            <li>
              <strong className="text-fg">Keyboard friendly.</strong> Use ← and → to move between
              steps.
            </li>
          </ul>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
