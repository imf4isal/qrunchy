import React from "react";

const Container: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => (
  <div
    className={
      "mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 " + (className || "")
    }
  >
    {children}
  </div>
);

const Section: React.FC<{
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

const testimonials = [
  {
    quote: "We published in minutes and never printed again.",
    name: "Ayesha Khan",
    title: "Owner, Café Minto",
  },
  {
    quote: "Central control for 12 outlets—finally easy.",
    name: "Nabil Rahman",
    title: "Ops Lead, Bento Bar",
  },
  {
    quote: "Photo menus that actually load fast.",
    name: "Priya Das",
    title: "Marketing, Saffron Grill",
  },
];

export const SocialProof: React.FC = () => (
  <Section
    id="social"
    title="Loved by busy teams"
    subtitle="Short, credible notes from people who switched to Qrunchy."
  >
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {testimonials.map((t, i) => (
        <div key={i} className="rounded-2xl border border-neutral-800 p-6">
          <div className="text-neutral-200">"{t.quote}"</div>
          <div className="mt-3 text-sm text-neutral-400">
            — {t.name}, {t.title}
          </div>
        </div>
      ))}
    </div>
  </Section>
);