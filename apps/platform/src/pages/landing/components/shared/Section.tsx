import React from "react";
import { Container } from "./Container";

export const Section: React.FC<{
  id?: string;
  title?: string;
  eyebrow?: string;
  subtitle?: string;
  children: React.ReactNode;
}> = ({ id, title, eyebrow, subtitle, children }) => (
  <section id={id} className="py-16 sm:py-24 border-t border-neutral-900/40">
    <Container>
      {(eyebrow || title || subtitle) && (
        <div className="mb-10">
          {eyebrow && (
            <div className="text-xs uppercase tracking-widest text-neutral-400">
              {eyebrow}
            </div>
          )}
          {title && (
            <h2 className="mt-2 text-2xl sm:text-3xl md:text-4xl font-semibold text-neutral-100">
              {title}
            </h2>
          )}
          {subtitle && (
            <p className="mt-3 max-w-2xl text-neutral-400">{subtitle}</p>
          )}
        </div>
      )}
      {children}
    </Container>
  </section>
);