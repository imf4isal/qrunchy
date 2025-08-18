import React from "react";
import { motion } from "framer-motion";
import { Building2, Smartphone, Layers, Sparkles, Check } from "lucide-react";
import { Section } from "./shared/Section";

export const QRDistribution: React.FC = () => {
  return (
    <Section
      id="usp"
      title="Built for chains, food courts & fast updates"
      subtitle="Operational features that feel like magic at scale."
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {[
          {
            icon: <Building2 className="h-5 w-5 text-white" />,
            title: "Chain control",
            desc: "Global items with branch overrides, approval flows, and audit trails.",
            bullets: [
              "Roles & permissions",
              "Global → branch sync",
              "Change history",
            ],
          },
          {
            icon: <Smartphone className="h-5 w-5 text-white" />,
            title: "Food court experience",
            desc: "Per-table QR, stall discovery, and lightning-fast photo menus.",
            bullets: [
              "Per-table / zone QR",
              "Instant load on mobile",
              "Clear stall switching",
            ],
          },
          {
            icon: <Layers className="h-5 w-5 text-white" />,
            title: "Global menu (customer-facing)",
            desc: "One link for everything: multi-language, categories, and allergen tags.",
            bullets: [
              "Multi-language & RTL",
              "Categories & search",
              "Allergen tags",
            ],
          },
          {
            icon: <Sparkles className="h-5 w-5 text-white" />,
            title: "Instant updates",
            desc: "Update once, publish everywhere—no printing, no delays.",
            bullets: [
              "Publish in seconds",
              "CDN caching",
              "'Sold out' with one tap",
            ],
          },
        ].map((card, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
            viewport={{ once: true }}
            className="rounded-2xl border border-neutral-800 bg-gradient-to-b from-neutral-950 to-neutral-900 p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-start gap-4">
              <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-gradient-to-br from-white/10 to-neutral-800 border border-neutral-700 shadow-inner">
                {card.icon}
              </div>
              <div className="min-w-0">
                <h3 className="text-neutral-100 font-medium tracking-tight">
                  {card.title}
                </h3>
                <p className="mt-1 text-sm text-neutral-400">{card.desc}</p>
                <ul className="mt-3 space-y-2 text-sm text-neutral-300">
                  {card.bullets.map((b, j) => (
                    <li key={j} className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-white/60" />
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Highlight Row */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        viewport={{ once: true }}
        className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-3"
      >
        {[
          { k: "500+", v: "restaurants" },
          { k: "<60s", v: "to publish" },
          { k: "∞", v: "menu updates" },
          { k: "Multi-venue", v: "ready" },
        ].map((m, i) => (
          <div
            key={i}
            className="rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-3 text-center hover:scale-[1.015] transition-transform"
          >
            <div className="text-lg font-semibold text-white tracking-tight">
              {m.k}
            </div>
            <div className="text-xs text-neutral-500 mt-0.5">{m.v}</div>
          </div>
        ))}
      </motion.div>
    </Section>
  );
};