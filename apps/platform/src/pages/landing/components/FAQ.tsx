import React, { useState } from "react";
import { motion } from "framer-motion";

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

const faqs = [
  {
    q: "How quickly can I create my first menu?",
    a: "Just 60 seconds! Choose photo menu to upload your existing menu images, or digital menu to type items with variants and addons. Your QR code is ready instantly.",
  },
  {
    q: "Can I handle complex items like pizza sizes and burger toppings?",
    a: "Absolutely! Our digital menu supports unlimited variants (sizes, types) and addons (toppings, extras) with individual pricing. Perfect for restaurants with customizable items.",
  },
  {
    q: "Do I need to print new QR codes every time I update my menu?",
    a: "Never! Your QR code stays the same forever. Update your menu anytime from the dashboard - customers always see the latest version when they scan.",
  },
  {
    q: "Can I manage multiple restaurant locations?",
    a: "Yes! Our chain management lets you control all branches from one dashboard. Set global items, allow branch-specific overrides, and manage permissions for different staff levels.",
  },
  {
    q: "What about food courts with multiple restaurants?",
    a: "Perfect for food courts! Create a single QR code that shows all restaurants with global search. Customers can search 'burger' and find items across all vendors in your food court.",
  },
  {
    q: "Is there a free plan to try it out?",
    a: "Yes! Start free with full access to create photo and digital menus. No credit card required - experience everything before deciding to upgrade.",
  },
  {
    q: "How do customers order from my menu?",
    a: "Qrunchy focuses on beautiful digital menus. Customers browse and decide what they want, then order directly with your staff. No third-party commissions or order management complexity.",
  },
  {
    q: "Can I customize how my menu looks?",
    a: "Definitely! Choose from professional themes, upload your restaurant photos, set your colors, and match your brand. Every menu looks unique and professional.",
  },
];

export const FAQ: React.FC = () => {
  const [openItems, setOpenItems] = useState<Record<number, boolean>>({});

  const toggleItem = (index: number) => {
    setOpenItems((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  return (
    <Section id="faq" title="Frequently asked" subtitle="Friction, removed.">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Left Column */}
        <div className="flex-1 space-y-6">
          {faqs.slice(0, Math.ceil(faqs.length / 2)).map((f, i) => (
            <div
              key={i}
              className="rounded-2xl border border-neutral-800 bg-neutral-950/50"
            >
              <div className="p-5">
                <button
                  onClick={() => toggleItem(i)}
                  className="w-full cursor-pointer text-left text-neutral-200 focus:outline-none"
                >
                  <span className="flex items-center justify-between gap-4">
                    {f.q}
                    <motion.span
                      className="text-neutral-500 text-xl font-light"
                      animate={{ rotate: openItems[i] ? 45 : 0 }}
                      transition={{ duration: 0.2, ease: "easeInOut" }}
                    >
                      +
                    </motion.span>
                  </span>
                </button>
                <motion.div
                  initial={false}
                  animate={{
                    height: openItems[i] ? "auto" : 0,
                    opacity: openItems[i] ? 1 : 0,
                  }}
                  transition={{
                    duration: 0.3,
                    ease: "easeInOut",
                  }}
                  className="overflow-hidden"
                >
                  <div className="pt-3 text-neutral-400">{f.a}</div>
                </motion.div>
              </div>
            </div>
          ))}
        </div>

        {/* Right Column */}
        <div className="flex-1 space-y-6">
          {faqs.slice(Math.ceil(faqs.length / 2)).map((f, i) => {
            const actualIndex = i + Math.ceil(faqs.length / 2);
            return (
              <div
                key={actualIndex}
                className="rounded-2xl border border-neutral-800 bg-neutral-950/50"
              >
                <div className="p-5">
                  <button
                    onClick={() => toggleItem(actualIndex)}
                    className="w-full cursor-pointer text-left text-neutral-200 focus:outline-none"
                  >
                    <span className="flex items-center justify-between gap-4">
                      {f.q}
                      <motion.span
                        className="text-neutral-500 text-xl font-light"
                        animate={{ rotate: openItems[actualIndex] ? 45 : 0 }}
                        transition={{ duration: 0.2, ease: "easeInOut" }}
                      >
                        +
                      </motion.span>
                    </span>
                  </button>
                  <motion.div
                    initial={false}
                    animate={{
                      height: openItems[actualIndex] ? "auto" : 0,
                      opacity: openItems[actualIndex] ? 1 : 0,
                    }}
                    transition={{
                      duration: 0.3,
                      ease: "easeInOut",
                    }}
                    className="overflow-hidden"
                  >
                    <div className="pt-3 text-neutral-400">{f.a}</div>
                  </motion.div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Section>
  );
};
