import { HERO_STATS, SAMPLE_HREF } from "../lib/content";
import { useRef } from "react";
import { useReducedMotion } from "../lib/hooks";
import { ArrowRight } from "./icons";

import HexField from "./HexField";

/**
 * Full-bleed hero with an animated 2D graphene lattice (HexField): hexagons grow out from just under
 * the navigation bar until they fill the section, then pulses of current run along the edges.
 * The copy is centred and comes in word by word while the lattice forms.
 * Replaces the static lattice image (and its 114 KB preload).
 */
const LINE_1 = ["Graphene", "at", "industrial", "scale."];
const LINE_2 = ["Made", "in", "India."];

export default function Hero() {
  const reduced = useReducedMotion();
  const copyRef = useRef(null);
  const d = (s) => ({ "--d": `${s}s` }); // animation delay per element

  return (
    <section
      aria-labelledby="hero-title"
      className="relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-bg pt-[72px]"
    >
      <HexField className="-z-10" protectRef={copyRef} />

      <div
        className={`container-x flex flex-1 flex-col items-center justify-center pb-24 pt-14 text-center md:py-20 ${reduced ? "" : "hero-anim"}`}
      >
        <div ref={copyRef} className="flex max-w-full flex-col items-center">
          <p className="eyebrow hero-in" style={d(0.35)}>
            Industrial graphene · Greater Noida, India
          </p>

          <h1
            id="hero-title"
            className="mt-6 max-w-6xl text-[clamp(2.5rem,5.4vw,5.25rem)] font-semibold leading-[0.98] tracking-[-0.035em] text-ink"
          >
            <span className="block md:whitespace-nowrap">
              {LINE_1.map((w, i) => (
                <span key={w} className="hero-word" style={d(0.55 + i * 0.09)}>
                  {w}
                  {i < LINE_1.length - 1 ? "\u00a0" : ""}
                </span>
              ))}
            </span>
            <span className="block">
              {LINE_2.map((w, i) => (
                <span key={w} className="hero-word" style={d(0.95 + i * 0.09)}>
                  {w}
                  {i < LINE_2.length - 1 ? "\u00a0" : ""}
                </span>
              ))}
            </span>
          </h1>

          <p
            className="hero-in mt-7 max-w-[34rem] text-lg leading-relaxed text-muted md:text-xl"
            style={d(1.35)}
          >
            High-purity graphene for defence, energy and aerospace, at a
            fraction of the cost of imports.
          </p>

          <div
            className="hero-in mt-9 flex flex-wrap items-center justify-center gap-x-6 gap-y-3"
            style={d(1.55)}
          >
            <a href={SAMPLE_HREF} className="btn-primary">
              Request a sample <ArrowRight />
            </a>
            <a href="/technology" className="link-accent">
              See the technology <ArrowRight />
            </a>
          </div>

          {/* Former ticker, now a single statement */}
          <p className="hero-in mt-10 text-sm text-muted" style={d(1.8)}>
            Formerly{" "}
            <strong className="font-semibold text-ink">
              Weber Innovations
            </strong>
            , now Velcoris Industries.
          </p>
        </div>
      </div>

      {/* Key figures */}
      <div className="relative border-t border-white/10 bg-[#0a0b0d]/85">
        <dl className="container-x grid grid-cols-3 divide-x divide-white/10">
          {HERO_STATS.map((s) => (
            <div
              key={s.label}
              className="flex flex-col-reverse py-5 pl-4 first:pl-0 sm:py-6 sm:pl-8"
            >
              <dt className="mt-1 font-mono text-[0.75rem] uppercase tracking-[0.08em] text-[#a9b0bb]">
                {s.label}
              </dt>
              <dd className="font-display text-xl font-semibold tracking-tight text-[#f3f4f6] sm:text-3xl">
                {s.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
