import React from "react";
import { Container } from "./shared/Container";

export const FinalCTA: React.FC<{ onCTAClick: () => void }> = ({ onCTAClick }) => (
  <section className="py-16 sm:py-24">
    <Container>
      <div className="rounded-3xl border border-neutral-800 bg-neutral-950 p-8 sm:p-12 text-center">
        <h2 className="text-3xl sm:text-4xl font-semibold text-neutral-100">
          Publish your menu today.
        </h2>
        <p className="mt-3 text-neutral-400">No credit card needed.</p>
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={onCTAClick}
            className="rounded-full bg-white px-6 py-3 text-sm font-medium text-black"
          >
            Create a menu
          </button>
          <a
            href="#live-demo"
            className="rounded-full border border-neutral-800 px-6 py-3 text-sm text-neutral-300 hover:bg-neutral-900"
          >
            Scan live demo
          </a>
        </div>
      </div>
    </Container>
  </section>
);