import React from "react";
import { Container } from "./shared/Container";

export const FinalCTA: React.FC<{ onCTAClick: () => void }> = ({ onCTAClick }) => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  return (
    <section className="py-16 sm:py-24">
      <Container>
        <div className="rounded-3xl border border-neutral-800 bg-neutral-950 p-8 sm:p-12 text-center">
          <h2 className="text-3xl sm:text-4xl font-semibold text-neutral-100">
            Publish your menu today.
          </h2>
          <p className="mt-3 text-neutral-400">No credit card needed.</p>
          <div className="mt-6 flex items-center justify-center">
            <button
              onClick={scrollToTop}
              className="rounded-full bg-white px-6 py-3 text-sm font-medium text-black hover:bg-neutral-100 hover:shadow-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
            >
              Get Started Free
            </button>
          </div>
        </div>
      </Container>
    </section>
  );
};