import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ImageIcon,
  Layers,
  Building2,
  Check,
  Copy,
  QrCode,
  Sparkles,
} from "lucide-react";
import { PhonePreview } from "./PhonePreview";
import { RealQRCode } from "./RealQRCode";

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

export const Hero: React.FC<{
  restaurantName: string;
  setRestaurantName: (s: string) => void;
  onCTAClick: () => void;
}> = ({ restaurantName, setRestaurantName, onCTAClick }) => {
  const [copied, setCopied] = useState(false);

  const short = useMemo(
    () =>
      restaurantName.trim()
        ? restaurantName.trim().toLowerCase().replace(/\s+/g, "-")
        : "demo-restaurant",
    [restaurantName]
  );
  const demoUrl = `qrunchy.menu/${short}`;

  const copyUrl = async () => {
    try {
      await navigator.clipboard.writeText(`https://${demoUrl}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy URL:", error);
    }
  };

  // Respect reduced-motion if possible (safe to read; falls back to animating)
  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  return (
    <section
      aria-labelledby="hero-title"
      className="relative overflow-hidden bg-gradient-to-b from-neutral-950 to-neutral-950"
    >
      {/* --- Subtle animated background --- */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 hidden md:block overflow-hidden"
      >
        {/* Primary glow - more subtle and purposeful */}
        <motion.div
          className="absolute h-96 w-96 rounded-full"
          style={{
            background:
              "radial-gradient(closest-side, rgba(255,255,255,0.04), rgba(255,255,255,0.01), transparent)",
            filter: "blur(40px)",
            top: "20%",
            right: "10%",
          }}
          animate={
            prefersReducedMotion
              ? {}
              : {
                  scale: [1, 1.1, 1],
                  opacity: [0.3, 0.5, 0.3],
                }
          }
          transition={{
            duration: 8,
            ease: "easeInOut",
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />

        {/* Secondary accent glow */}
        <motion.div
          className="absolute h-64 w-64 rounded-full"
          style={{
            background:
              "radial-gradient(closest-side, rgba(59, 130, 246, 0.06), rgba(59, 130, 246, 0.02), transparent)",
            filter: "blur(30px)",
            top: "60%",
            left: "20%",
          }}
          animate={
            prefersReducedMotion
              ? {}
              : {
                  scale: [1, 0.8, 1],
                  opacity: [0.2, 0.4, 0.2],
                }
          }
          transition={{
            duration: 12,
            ease: "easeInOut",
            repeat: Infinity,
            repeatType: "reverse",
            delay: 2,
          }}
        />
      </div>
      {/* --- /glows --- */}

      <Container className="pt-20 pb-16 sm:pt-32 sm:pb-20">
        <div className="grid items-center gap-y-16 gap-x-16 lg:grid-cols-2">
          {/* LEFT */}
          <div className="mx-auto w-full max-w-[44rem] text-center lg:text-left">
            <motion.h1
              id="hero-title"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="
                font-bold tracking-tight
                text-4xl sm:text-5xl md:text-6xl lg:text-7xl
                leading-[1.05]
                bg-gradient-to-b from-white via-neutral-100 to-neutral-400 bg-clip-text text-transparent
                [text-wrap:balance]
              "
              style={{ fontOpticalSizing: "auto" }}
            >
              Your menu, one scan away.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mt-6 text-base sm:text-lg leading-7 text-neutral-400 [text-wrap:pretty] max-w-2xl"
            >
              Replace paper menus with delightful QR experiences. Photo or
              digital—publish in minutes and update anytime.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-8 flex flex-col sm:flex-row sm:items-center gap-4"
            >
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => (window.location.href = "/photo-menu")}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-medium text-black hover:bg-neutral-100 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  <ImageIcon className="h-4 w-4" />
                  Photo Menu
                </button>
                <button
                  onClick={() => (window.location.href = "/digital-menu")}
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-neutral-700 px-4 py-2.5 text-sm font-medium text-white hover:bg-neutral-800 hover:border-neutral-600 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Layers className="h-4 w-4" />
                  Digital Menu
                </button>
              </div>
              <button
                onClick={() => window.open(`/demo/${short}`, "_blank")}
                aria-label="Open live demo in new tab"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-neutral-700 px-4 py-2.5 text-sm font-medium text-neutral-300 hover:bg-neutral-800 hover:text-white hover:border-neutral-600 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
              >
                <QrCode className="h-4 w-4" /> View Demo
              </button>
            </motion.div>

            <motion.ul
              role="list"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-8 flex flex-wrap gap-3"
            >
              {[
                {
                  text: "< 1 min to publish",
                  icon: <Check className="h-3 w-3" />,
                },
                {
                  text: "Unlimited updates",
                  icon: <Layers className="h-3 w-3" />,
                },
                {
                  text: "Chain-ready",
                  icon: <Building2 className="h-3 w-3" />,
                },
              ].map((item, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.4 + i * 0.1 }}
                >
                  <span className="inline-flex items-center gap-2 rounded-full bg-neutral-800/60 px-4 py-2 text-sm font-medium text-neutral-200 ring-1 ring-inset ring-neutral-700/80 backdrop-blur-sm">
                    <span className="text-neutral-400">{item.icon}</span>
                    {item.text}
                  </span>
                </motion.li>
              ))}
            </motion.ul>

            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="mt-10 border-t border-neutral-800/50 pt-6"
            >
              <div className="mb-4 text-xs uppercase tracking-widest text-neutral-500 font-medium">
                Trusted by 500+ restaurants
              </div>
              <ul role="list" className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {["Café Bistro", "Urban Grill", "Fresh Bowls"].map(
                  (name, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.6 + i * 0.1 }}
                    >
                      <div className="rounded-xl border border-neutral-800/80 bg-neutral-900/50 px-4 py-3 text-sm text-neutral-400 font-medium tracking-tight backdrop-blur-sm hover:bg-neutral-800/50 hover:text-neutral-300 transition-all duration-200">
                        {name}
                      </div>
                    </motion.li>
                  )
                )}
              </ul>
            </motion.div>
          </div>

          {/* RIGHT */}
          <div className="relative mx-auto flex w-full max-w-md items-center justify-center lg:mx-0 lg:justify-end order-first lg:order-last">
            <div className="relative">
              <motion.div
                aria-hidden="true"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <PhonePreview theme="dark" mode="digital" />
              </motion.div>

              <motion.div
                id="live-demo"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="absolute -bottom-6 left-1/2 w-[340px] max-w-[90vw] -translate-x-1/2 rounded-2xl border border-neutral-700/80 bg-neutral-900/90 backdrop-blur-lg p-5 shadow-2xl"
              >
                <div className="flex items-start gap-4">
                  <div className="relative">
                    <RealQRCode
                      text={demoUrl}
                      size={85}
                      className="shrink-0 rounded-lg border border-neutral-700/50"
                    />
                    <div className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-green-500 border-2 border-neutral-900 animate-pulse"></div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="text-xs uppercase tracking-widest text-neutral-400 font-semibold">
                        Live Demo
                      </div>
                      <Sparkles className="h-3 w-3 text-yellow-400" />
                    </div>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="font-semibold text-neutral-100 truncate font-mono text-sm tracking-tight flex-1">
                        {demoUrl}
                      </div>
                      <button
                        onClick={copyUrl}
                        className="p-1.5 rounded-md border border-neutral-700 hover:bg-neutral-800 hover:border-neutral-600 transition-all duration-200 text-neutral-400 hover:text-neutral-200 active:scale-90"
                        title="Copy URL"
                      >
                        {copied ? (
                          <Check className="h-3 w-3 text-green-400" />
                        ) : (
                          <Copy className="h-3 w-3" />
                        )}
                      </button>
                    </div>
                    <div className="space-y-2">
                      <input
                        aria-label="Restaurant name"
                        autoComplete="organization"
                        value={restaurantName}
                        onChange={(e) => setRestaurantName(e.target.value)}
                        placeholder="Enter your restaurant name"
                        className="w-full rounded-lg border border-neutral-700 bg-neutral-800/50 px-3 py-2.5 text-sm text-neutral-200 placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-600 focus:border-neutral-600 transition-all duration-200 hover:border-neutral-600"
                      />
                      <div className="flex items-center justify-between text-xs text-neutral-500">
                        <span>✨ Your URL updates instantly</span>
                        {copied && (
                          <span className="text-green-400">Copied!</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              <div className="h-10 md:h-0" />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};