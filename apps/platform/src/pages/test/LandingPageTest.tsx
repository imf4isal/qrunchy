import React, { useMemo, useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import QRCode from "qrcode";
import {
  QrCode,
  Upload,
  Image as ImageIcon,
  Layers,
  Building2,
  Lock,
  Sparkles,
  Check,
  Copy,
  X,
  Smartphone,
  Tags,
  Download,
  ArrowRight,
} from "lucide-react";

// -------------------------------
// Real QR Code Component
// -------------------------------

const RealQRCode: React.FC<{
  text: string;
  size?: number;
  className?: string;
}> = ({ text, size = 210, className }) => {
  const [qrDataURL, setQrDataURL] = useState<string>("");

  useEffect(() => {
    const generateQR = async () => {
      try {
        // Add https:// if not present for a valid URL
        const url = text.startsWith("http") ? text : `https://${text}`;
        const dataURL = await QRCode.toDataURL(url, {
          width: size,
          margin: 2,
          color: {
            dark: "#000000",
            light: "#ffffff",
          },
        });
        setQrDataURL(dataURL);
      } catch (error) {
        console.error("Error generating QR code:", error);
      }
    };

    generateQR();
  }, [text, size]);

  if (!qrDataURL) {
    return (
      <div
        className={`bg-neutral-200 animate-pulse ${className}`}
        style={{ width: size, height: size }}
      />
    );
  }

  return (
    <img
      src={qrDataURL}
      alt={`QR code for ${text}`}
      width={size}
      height={size}
      className={className}
    />
  );
};

// -------------------------------
// Dummy Data
// -------------------------------
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

const logos = [
  "MonoBites",
  "Smashed Burgers",
  "Brew & Bun",
  "NoodleLab",
  "Slice Co.",
  "BFC",
];

const pricing = [
  {
    name: "Starter",
    price: "Free",
    features: ["1 venue", "Photo Menu", "Basic QR", "Qrunchy watermark"],
    cta: "Start free",
  },
  {
    name: "Pro",
    price: "$29/mo",
    features: ["Unlimited menus", "Digital Menu", "Themes", "Analytics"],
    cta: "Start free",
    highlight: true,
  },
  {
    name: "Chain",
    price: "Talk to us",
    features: [
      "Multi-venue",
      "Roles & permissions",
      "Per-table QR",
      "Priority support",
    ],
    cta: "Talk to sales",
  },
];

const faqs = [
  {
    q: "How fast can I go live?",
    a: "In under 60 seconds with our photo menu flow. Drag, drop, publish.",
  },
  {
    q: "Do you support multiple languages?",
    a: "Yes—set your menu language and RTL/LTR per theme.",
  },
  {
    q: "What if the internet is patchy?",
    a: "We aggressively cache assets on a global CDN for resilient loads.",
  },
  {
    q: "Can I print table toppers?",
    a: "Yes—export QR as PNG, SVG, or PDF from the generator.",
  },
];

// -------------------------------
// UI Primitives (no external UI kit)
// -------------------------------
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

const Chip: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="inline-flex items-center gap-2 rounded-full border border-neutral-800 px-3 py-1 text-xs text-neutral-300">
    {children}
  </span>
);

// -------------------------------
// Components
// -------------------------------
const PhonePreview: React.FC<{
  theme: "light" | "dark";
  mode: "photo" | "digital";
  children?: React.ReactNode; // 👈 allow slotting custom content
}> = ({ theme, mode, children }) => {
  const dark = theme === "dark";

  return (
    <div
      className={`relative mx-auto h-[520px] w-[260px] rounded-[36px] border p-4 shadow-2xl ${
        dark
          ? "border-neutral-800 bg-neutral-900"
          : "border-neutral-200 bg-white"
      }`}
    >
      <div
        className={`absolute inset-x-12 -top-2 h-6 rounded-full ${
          dark ? "bg-neutral-800" : "bg-neutral-200"
        }`}
      />
      {/* Make inner shell a column so content can flex & scroll */}
      <div
        className={`flex h-full flex-col overflow-hidden rounded-2xl border ${
          dark
            ? "border-neutral-800 bg-neutral-950"
            : "border-neutral-200 bg-neutral-50"
        }`}
      >
        {/* Header */}
        <div
          className={`flex items-center justify-between px-4 py-3 border-b ${
            dark ? "border-neutral-800" : "border-neutral-200"
          }`}
        >
          <div
            className={`h-4 w-20 rounded ${dark ? "bg-neutral-800" : "bg-neutral-200"}`}
          />
          <div
            className={`h-6 w-6 rounded ${dark ? "bg-neutral-800" : "bg-neutral-200"}`}
          />
        </div>

        {/* Content area (fills remaining height, scroll-safe) */}
        <div className="flex-1 min-h-0 overflow-auto p-4 space-y-3">
          {/* If children provided in Photo mode, use them; else fallback to defaults */}
          {mode === "photo" && children ? (
            children
          ) : mode === "photo" ? (
            <div className="grid grid-cols-2 gap-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-[4/3] rounded-lg bg-neutral-800"
                />
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {["Starters", "Mains", "Desserts"].map((cat, i) => (
                <div key={i} className="rounded-xl border border-neutral-800">
                  <div className="px-3 py-2 text-sm font-medium text-neutral-200 border-b border-neutral-800">
                    {cat}
                  </div>
                  <div className="p-3 space-y-3">
                    {Array.from({ length: 2 }).map((_, j) => (
                      <div key={j} className="flex items-start gap-3">
                        <div className="h-12 w-12 rounded bg-neutral-800" />
                        <div className="flex-1">
                          <div className="mb-2 h-4 w-32 rounded bg-neutral-800" />
                          <div className="h-3 w-24 rounded bg-neutral-800" />
                        </div>
                        <div className="h-4 w-10 rounded bg-neutral-800" />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const Navbar: React.FC<{ onCTAClick: () => void }> = ({ onCTAClick }) => {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  const handleSignIn = () => {
    window.location.href = "/login";
  };

  return (
    <div className="sticky top-0 z-50 backdrop-blur supports-[backdrop-filter]:bg-neutral-950/60 border-b border-neutral-900/50">
      <Container className="flex h-16 items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative h-8 w-8 rounded-lg bg-gradient-to-br from-white to-neutral-300 flex items-center justify-center shadow-sm">
            <QrCode className="h-4 w-4 text-neutral-900" />
          </div>
          <span className="text-lg font-bold tracking-tight text-white">
            Qrunchy
          </span>
        </div>
        <nav className="hidden md:flex items-center gap-8 text-sm text-neutral-400">
          <button
            onClick={() => scrollToSection("workflows")}
            className="hover:text-white transition-colors cursor-pointer"
          >
            Product
          </button>
          <button
            onClick={() => scrollToSection("chain")}
            className="hover:text-white transition-colors cursor-pointer"
          >
            Solutions
          </button>
          <button
            onClick={() => scrollToSection("pricing")}
            className="hover:text-white transition-colors cursor-pointer"
          >
            Pricing
          </button>
          <button
            onClick={() => scrollToSection("faq")}
            className="hover:text-white transition-colors cursor-pointer"
          >
            FAQ
          </button>
        </nav>
        <div className="flex items-center gap-3">
          <button
            onClick={handleSignIn}
            className="hidden sm:inline-flex rounded-full border border-neutral-700 px-5 py-2.5 text-sm text-neutral-300 hover:bg-neutral-800 hover:text-white hover:border-neutral-600 transition-all duration-200"
          >
            Sign in
          </button>
          <button
            onClick={onCTAClick}
            className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-black hover:bg-neutral-100 hover:shadow-lg transition-all duration-200 transform hover:scale-[1.02]"
          >
            Get started free <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </Container>
    </div>
  );
};

const Hero: React.FC<{
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
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-medium text-black hover:bg-neutral-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 transition-all duration-200"
                >
                  <ImageIcon className="h-4 w-4" />
                  Photo Menu
                </button>
                <button
                  onClick={() => (window.location.href = "/digital-menu")}
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-neutral-700 px-4 py-2.5 text-sm font-medium text-white hover:bg-neutral-800 hover:border-neutral-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 transition-all duration-200"
                >
                  <Layers className="h-4 w-4" />
                  Digital Menu
                </button>
              </div>
              <button
                onClick={() => window.open(`/demo/${short}`, "_blank")}
                aria-label="Open live demo in new tab"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-neutral-700 px-4 py-2.5 text-sm font-medium text-neutral-300 hover:bg-neutral-800 hover:text-white hover:border-neutral-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 transition-all duration-200"
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
              <div aria-hidden="true">
                <PhonePreview theme="dark" mode="digital" />
              </div>

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
                        className="p-1.5 rounded-md border border-neutral-700 hover:bg-neutral-800 hover:border-neutral-600 transition-all text-neutral-400 hover:text-neutral-200"
                        title="Copy URL"
                      >
                        {copied ? (
                          <Check className="h-3 w-3" />
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
                        className="w-full rounded-lg border border-neutral-700 bg-neutral-800/50 px-3 py-2.5 text-sm text-neutral-200 placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-600 focus:border-neutral-600 transition-all"
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

const Workflows: React.FC = () => {
  const [tab, setTab] = useState<"photo" | "digital">("photo");
  const [progress, setProgress] = useState(0);
  const [activeStep, setActiveStep] = useState(0); // 0: Upload, 1: Arrange, 2: Publish (carousel)
  const [zoom, setZoom] = useState(100); // step 3 only
  const [slide, setSlide] = useState(0); // step 3 only

  const steps =
    tab === "photo"
      ? ["Upload images", "Arrange", "Publish"]
      : ["Add category", "Add item", "Publish"];

  const percent = Math.round((progress / steps.length) * 100);

  const handleStepClick = (i: number) => {
    setActiveStep(i);
    setProgress((p) => Math.max(p, i + 1));
  };

  const resetFlow = () => {
    setProgress(0);
    setActiveStep(0);
    setZoom(100);
    setSlide(0);
  };

  const totalSlides = 5;
  const prevSlide = () => setSlide((s) => (s - 1 + totalSlides) % totalSlides);
  const nextSlide = () => setSlide((s) => (s + 1) % totalSlides);

  return (
    <Section
      id="workflows"
      title="Pick your flow: Photo or Digital"
      subtitle="Let your team self-select the simplest path. Inline demos require no account."
    >
      <div className="mb-8 w-fit rounded-full border border-neutral-800 p-1 flex items-center gap-2">
        {(
          [
            {
              key: "photo",
              label: "Photo Menu",
              icon: <ImageIcon className="h-4 w-4" />,
            },
            {
              key: "digital",
              label: "Digital Menu",
              icon: <Layers className="h-4 w-4" />,
            },
          ] as const
        ).map((t) => (
          <button
            key={t.key}
            onClick={() => {
              setTab(t.key);
              resetFlow();
            }}
            className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm ${
              tab === t.key
                ? "bg-white text-black"
                : "text-neutral-300 hover:bg-neutral-900"
            }`}
          >
            {t.icon}
            {t.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 items-start gap-8">
        {/* Phone preview (renders step content INSIDE for Photo) */}
        <div className="w-fit mx-auto">
          <PhonePreview theme="dark" mode={tab}>
            {tab === "photo" && (
              <>
                {/* STEP 1: Upload skeleton */}
                {activeStep === 0 && (
                  <div className="space-y-3">
                    <div className="rounded-lg border-2 border-dashed border-neutral-800 bg-neutral-950/70 p-4 text-center">
                      <div className="mx-auto mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-neutral-800/60">
                        <Upload className="h-4 w-4 text-neutral-300" />
                      </div>
                      <div className="text-[11px] text-neutral-300">
                        Drag & drop images here
                      </div>
                      <div className="mt-0.5 text-[10px] text-neutral-500">
                        or tap to browse
                      </div>
                    </div>

                    <div className="space-y-2.5">
                      {[0, 1, 2].map((i) => (
                        <div
                          key={i}
                          className="flex items-center gap-2 rounded-md border border-neutral-900 bg-neutral-950 p-2"
                        >
                          <div className="h-8 w-10 rounded bg-neutral-800 animate-pulse" />
                          <div className="flex-1 space-y-1.5">
                            <div className="h-2.5 w-28 rounded bg-neutral-800 animate-pulse" />
                            <div className="h-2 w-16 rounded bg-neutral-900" />
                          </div>
                          <div className="h-5 w-12 rounded-full bg-neutral-900" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* STEP 2: Arrange list with drag grip + user avatar */}
                {activeStep === 1 && (
                  <div className="space-y-2.5">
                    {[0, 1, 2].map((i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2 rounded-md border border-neutral-800 bg-neutral-950 p-2"
                      >
                        {/* Drag handle */}
                        <span className="px-1.5 py-4 text-neutral-600 hover:text-neutral-400 cursor-grab active:cursor-grabbing select-none">
                          <svg
                            width="10"
                            height="16"
                            viewBox="0 0 10 16"
                            fill="currentColor"
                            aria-hidden="true"
                          >
                            <circle cx="2" cy="2" r="1.2" />
                            <circle cx="8" cy="2" r="1.2" />
                            <circle cx="2" cy="8" r="1.2" />
                            <circle cx="8" cy="8" r="1.2" />
                            <circle cx="2" cy="14" r="1.2" />
                            <circle cx="8" cy="14" r="1.2" />
                          </svg>
                        </span>

                        {/* Thumb */}
                        <div className="h-10 w-12 rounded bg-neutral-800" />

                        {/* Meta + user */}
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between">
                            <div className="h-2.5 w-28 rounded bg-neutral-800" />
                            <div className="ml-2 flex h-5 w-5 items-center justify-center rounded-full bg-neutral-800 text-[9px] text-neutral-300">
                              U
                            </div>
                          </div>
                          <div className="mt-1.5 h-2 w-20 rounded bg-neutral-900" />
                        </div>
                      </div>
                    ))}
                    <div className="text-[10px] text-neutral-500">
                      Tip: drag the handle to reorder images.
                    </div>
                  </div>
                )}

                {/* STEP 3: Carousel with arrows + zoom */}
                {activeStep === 2 && (
                  <div className="rounded-lg border border-neutral-800 bg-neutral-950 overflow-hidden">
                    {/* Toolbar */}
                    <div className="flex items-center justify-between gap-2 border-b border-neutral-900 px-2 py-1.5">
                      <div className="text-[10px] text-neutral-400">
                        Preview {slide + 1}/{totalSlides}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => setZoom((z) => Math.max(50, z - 10))}
                          className="rounded border border-neutral-800 px-1.5 text-[11px] text-neutral-300 hover:bg-neutral-900"
                          aria-label="Zoom out"
                        >
                          −
                        </button>
                        <div className="min-w-[2.5rem] text-center text-[10px] text-neutral-400">
                          {zoom}%
                        </div>
                        <button
                          onClick={() => setZoom((z) => Math.min(200, z + 10))}
                          className="rounded border border-neutral-800 px-1.5 text-[11px] text-neutral-300 hover:bg-neutral-900"
                          aria-label="Zoom in"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Slide area */}
                    <div className="relative h-60">
                      <button
                        onClick={prevSlide}
                        className="absolute left-1.5 top-1/2 -translate-y-1/2 rounded-full border border-neutral-800 bg-neutral-900/70 p-1.5 text-neutral-200 hover:bg-neutral-900"
                        aria-label="Previous"
                      >
                        <ArrowRight className="h-4 w-4 rotate-180" />
                      </button>

                      <div className="flex h-full items-center justify-center">
                        <div
                          className="rounded-md bg-neutral-800 transition-transform"
                          style={{
                            width: `${Math.min(95, 60 + (zoom - 100) * 0.25)}%`,
                            height: "70%",
                          }}
                        />
                      </div>

                      <button
                        onClick={nextSlide}
                        className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-full border border-neutral-800 bg-neutral-900/70 p-1.5 text-neutral-200 hover:bg-neutral-900"
                        aria-label="Next"
                      >
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </PhonePreview>
        </div>

        {/* Controls & progress (right column) */}
        <div>
          <div className="rounded-2xl border border-neutral-800 p-6">
            <div className="text-sm text-neutral-400">
              Inline demo {tab === "photo" ? "(Photo)" : "(Digital soon)"}
            </div>
            <h3 className="mt-1 text-xl font-semibold text-neutral-100">
              {tab === "photo"
                ? "Upload → Arrange → Publish"
                : "Structure → Preview → Publish"}
            </h3>

            <div className="mt-4 space-y-3">
              {steps.map((s, i) => {
                const done = progress > i;
                const active = activeStep === i;
                return (
                  <button
                    key={i}
                    onClick={() => handleStepClick(i)}
                    className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 transition ${
                      active
                        ? "border-neutral-700 bg-neutral-900 ring-1 ring-neutral-700/60"
                        : done
                          ? "border-neutral-700 bg-neutral-900"
                          : "border-neutral-900 hover:bg-neutral-950"
                    }`}
                  >
                    <span className="flex items-center gap-3 text-neutral-200">
                      {done ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <span className="h-4 w-4 rounded-full border border-neutral-700" />
                      )}
                      {s}
                    </span>
                    <span className="text-xs text-neutral-500">
                      {done
                        ? "Completed"
                        : active
                          ? "In progress (see phone)"
                          : "Click to complete"}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Digital placeholder */}
            {tab === "digital" && (
              <div className="mt-5 rounded-xl border border-neutral-800 p-6 text-sm text-neutral-400">
                Digital flow preview coming soon.
              </div>
            )}

            {/* Progress + actions */}
            <div className="mt-5">
              <div className="mb-2 flex items-center justify-between text-xs text-neutral-400">
                <span>Publish in 60 seconds</span>
                <span>{percent}%</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-neutral-900">
                <div
                  className="h-full bg-white"
                  style={{ width: `${percent}%` }}
                />
              </div>
              <div className="mt-4 flex gap-2">
                <button
                  className="rounded-full bg-white px-4 py-2 text-sm font-medium text-black disabled:opacity-60"
                  disabled={progress < steps.length}
                >
                  Publish
                </button>
                <button
                  onClick={resetFlow}
                  className="rounded-full border border-neutral-800 px-4 py-2 text-sm text-neutral-300 hover:bg-neutral-900"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
};

const QRDistribution: React.FC = () => {
  const [value, setValue] = useState("qrunchy.menu/demo-restaurant");
  const svgRef = useRef<SVGSVGElement>(null);

  const downloadSVG = () => {
    if (!svgRef.current) return;
    const blob = new Blob(
      [new XMLSerializer().serializeToString(svgRef.current)],
      { type: "image/svg+xml" }
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "qrunchy-qr.svg";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Section
      id="qr"
      title="One QR, or a thousand. Instantly."
      subtitle="Auto QR per venue/table/zone. Export in PNG/SVG, print templates, and track scans."
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="rounded-2xl border border-neutral-800 p-6">
          <div className="flex items-center gap-4">
            <div className="rounded-xl border border-neutral-800 p-3 bg-neutral-950">
              <RealQRCode text={value} size={140} className="" />
            </div>
            <div className="flex-1">
              <label className="text-xs uppercase tracking-widest text-neutral-400">
                Short link
              </label>
              <input
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="mt-2 w-full rounded-md border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm text-neutral-200 placeholder:text-neutral-600 focus:outline-none focus:ring-1 focus:ring-neutral-600"
              />
              <div className="mt-3 flex gap-2">
                <button
                  onClick={downloadSVG}
                  className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-black"
                >
                  <Download className="h-4 w-4" /> Download SVG
                </button>
                <button className="rounded-full border border-neutral-800 px-4 py-2 text-sm text-neutral-300 hover:bg-neutral-900">
                  Print template
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {[
            "Per-table codes",
            "Short links",
            "Printable toppers",
            "Scan analytics",
          ].map((t, i) => (
            <div key={i} className="rounded-2xl border border-neutral-800 p-5">
              <div className="mb-3 h-8 w-8 rounded bg-neutral-800" />
              <div className="text-neutral-200 font-medium">{t}</div>
              <div className="mt-2 text-sm text-neutral-400">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              </div>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
};

const Themes: React.FC = () => {
  const [dark, setDark] = useState(true);
  return (
    <Section
      id="themes"
      title="Your brand, your vibe—kept minimal."
      subtitle="Multi-theme presets, logo & accent, light/dark, RTL/LTR, and accessible contrast."
    >
      <div className="flex items-center justify-between mb-6">
        <div className="text-sm text-neutral-400">Preview</div>
        <div className="rounded-full border border-neutral-800 p-1">
          <button
            onClick={() => setDark(false)}
            className={`px-3 py-1.5 text-sm rounded-full ${!dark ? "bg-white text-black" : "text-neutral-300 hover:bg-neutral-900"}`}
          >
            Light
          </button>
          <button
            onClick={() => setDark(true)}
            className={`px-3 py-1.5 text-sm rounded-full ${dark ? "bg-white text-black" : "text-neutral-300 hover:bg-neutral-900"}`}
          >
            Dark
          </button>
        </div>
      </div>
      <div className="flex items-center justify-center">
        <PhonePreview theme={dark ? "dark" : "light"} mode={"digital"} />
      </div>
    </Section>
  );
};

const ImageManager: React.FC = () => {
  const [count, setCount] = useState(0);
  return (
    <Section
      id="images"
      title="Drop photos in. We handle the rest."
      subtitle="Bulk upload, auto-optimization, alt text prompts, CDN, smart crops."
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="rounded-2xl border border-neutral-800 p-6">
          <div className="flex items-center gap-3 text-neutral-300">
            <Upload className="h-4 w-4" /> Drag & drop images here
          </div>
          <div className="mt-4 grid grid-cols-3 gap-3">
            {Array.from({ length: Math.max(6, count) }).map((_, i) => (
              <div
                key={i}
                className="aspect-square rounded-lg bg-neutral-800"
              />
            ))}
          </div>
          <div className="mt-4 flex gap-2">
            <button
              onClick={() => setCount((c) => c + 3)}
              className="rounded-full bg-white px-4 py-2 text-sm font-medium text-black"
            >
              Upload sample
            </button>
            <button
              onClick={() => setCount(0)}
              className="rounded-full border border-neutral-800 px-4 py-2 text-sm text-neutral-300 hover:bg-neutral-900"
            >
              Clear
            </button>
          </div>
        </div>
        <div className="space-y-4">
          {[
            "Auto-compress images",
            "CDN delivery",
            "Smart crops",
            "Alt text prompts",
          ].map((t, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="h-6 w-6 rounded bg-neutral-800" />
              <div className="text-neutral-300">{t}</div>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
};

const ChainControl: React.FC = () => {
  return (
    <Section
      id="chain"
      title="Control every branch from one place."
      subtitle="Global items, branch overrides, roles & permissions, and audit trails."
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-2xl border border-neutral-800 p-4">
            <div className="flex items-center justify-between">
              <div className="font-medium text-neutral-200">
                Branch #{i + 1}
              </div>
              <span className="text-xs rounded-full border border-neutral-800 px-2 py-0.5 text-neutral-400">
                Synced
              </span>
            </div>
            <div className="mt-3 h-28 rounded-lg bg-neutral-900" />
            <div className="mt-3 flex gap-2">
              <button className="rounded-full bg-white px-3 py-1.5 text-xs font-medium text-black">
                Push changes
              </button>
              <button className="rounded-full border border-neutral-800 px-3 py-1.5 text-xs text-neutral-300 hover:bg-neutral-900">
                Open
              </button>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
};

const AuthRoles: React.FC = () => (
  <Section
    id="auth"
    title="Secure sign-ins without passwords."
    subtitle="SMS OTP for staff, session expiry, restricted editor roles, optional approvals."
  >
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {["SMS OTP", "Editor roles", "Approval flows"].map((t, i) => (
        <div key={i} className="rounded-2xl border border-neutral-800 p-5">
          <div className="mb-3 h-8 w-8 rounded bg-neutral-800" />
          <div className="text-neutral-200 font-medium">{t}</div>
          <div className="mt-2 text-sm text-neutral-400">
            Keep teams fast and secure without passwords.
          </div>
        </div>
      ))}
    </div>
  </Section>
);

const StructuredPower: React.FC = () => {
  const [itemName, setItemName] = useState("");
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);
  const [addons, setAddons] = useState<Record<string, boolean>>({
    "Extra cheese": false,
    Jalapeños: false,
    Avocado: false,
    Sauce: false,
  });

  const variantOptions = ["Regular", "Large"];
  const toggleAddon = (key: string) =>
    setAddons((prev) => ({ ...prev, [key]: !prev[key] }));
  const canSave = itemName.trim().length > 0;

  return (
    <Section
      id="power"
      title="Complex menus, simple editing."
      subtitle="Sizes, toppings, modifiers; allergen tags; search; quick hide/sold out."
    >
      <div className="rounded-2xl border border-neutral-800 p-6">
        {/* Left column flexes, right column fits content */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-[minmax(0,1fr)_max-content]">
          {/* Left: Form */}
          <div className="space-y-5">
            {/* Item name */}
            <div>
              <label className="text-xs uppercase tracking-widest text-neutral-400">
                Item name
              </label>
              <input
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                className="mt-2 w-full rounded-md border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm text-neutral-200 placeholder:text-neutral-600 outline-none transition hover:border-neutral-700 focus:border-neutral-700 focus:ring-1 focus:ring-neutral-600"
                placeholder="Spicy Chicken Wrap"
                aria-label="Menu item name"
              />
              <div className="mt-1 text-[11px] text-neutral-500">
                Keep it short and scannable.
              </div>
            </div>

            {/* Variants */}
            <div>
              <label className="text-xs uppercase tracking-widest text-neutral-400">
                Variants
              </label>
              <div className="mt-2 flex flex-wrap gap-2">
                {variantOptions.map((v) => {
                  const active = selectedVariant === v;
                  return (
                    <button
                      key={v}
                      type="button"
                      aria-pressed={active}
                      onClick={() =>
                        setSelectedVariant((curr) => (curr === v ? null : v))
                      }
                      className={`rounded-full px-3 py-1 text-xs transition
                        ${
                          active
                            ? "bg-white text-black shadow-sm"
                            : "border border-neutral-800 text-neutral-300 hover:border-neutral-700 hover:bg-neutral-900 active:scale-[0.98]"
                        }
                      `}
                    >
                      {v}
                    </button>
                  );
                })}
              </div>
              <div className="mt-1 text-[11px] text-neutral-500">
                Choose a default size (optional).
              </div>
            </div>

            {/* Add-ons */}
            <div>
              <label className="text-xs uppercase tracking-widest text-neutral-400">
                Add-ons
              </label>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {Object.keys(addons).map((a) => (
                  <label
                    key={a}
                    className="group inline-flex items-center gap-2 rounded-md border border-transparent px-2 py-1 text-sm text-neutral-300 transition hover:border-neutral-800 hover:bg-neutral-950"
                  >
                    <input
                      type="checkbox"
                      checked={addons[a]}
                      onChange={() => toggleAddon(a)}
                      className="h-4 w-4 rounded border-neutral-700 bg-neutral-900 transition focus:ring-1 focus:ring-neutral-600"
                    />
                    <span className="select-none">{a}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Save */}
            <button
              disabled={!canSave}
              className={`w-full sm:w-auto rounded-full bg-white px-5 py-2 text-sm font-medium text-black transition
                enabled:hover:bg-neutral-200 enabled:active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60`}
            >
              Save
            </button>
          </div>

          {/* Right: Preview — centered on mobile, hugs right on desktop, fixed intrinsic width */}
          <div className="relative flex items-center justify-center md:justify-end">
            {/* subtle glow, desktop only to avoid any small-screen artifacts */}
            <div className="pointer-events-none absolute -inset-4 hidden md:block rounded-[32px] bg-[radial-gradient(closest-side,rgba(255,255,255,0.06),transparent)]" />
            <div className="w-[260px] shrink-0">
              <PhonePreview theme="dark" mode="digital" />
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
};

const SocialProof: React.FC = () => (
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

const Pricing: React.FC = () => (
  <Section
    id="pricing"
    title="Simple, transparent pricing"
    subtitle="Start free. Upgrade when you need more."
  >
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {pricing.map((p, i) => (
        <div
          key={i}
          className={`rounded-2xl border p-6 ${p.highlight ? "border-white bg-neutral-900" : "border-neutral-800"}`}
        >
          <div className="text-sm text-neutral-400">{p.name}</div>
          <div className="mt-2 text-3xl font-semibold text-neutral-100">
            {p.price}
          </div>
          <ul className="mt-4 space-y-2 text-sm text-neutral-300">
            {p.features.map((f, j) => (
              <li key={j} className="flex items-center gap-2">
                <Check className="h-4 w-4" />
                {f}
              </li>
            ))}
          </ul>
          <button
            className={`mt-6 w-full rounded-full px-4 py-2 text-sm ${p.highlight ? "bg-white text-black" : "border border-neutral-800 text-neutral-300 hover:bg-neutral-900"}`}
          >
            {p.cta}
          </button>
        </div>
      ))}
    </div>
  </Section>
);

const FAQ: React.FC = () => (
  <Section id="faq" title="Frequently asked" subtitle="Friction, removed.">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {faqs.map((f, i) => (
        <details
          key={i}
          className="group rounded-2xl border border-neutral-800 p-5"
        >
          <summary className="cursor-pointer list-none text-neutral-200">
            <span className="flex items-center justify-between gap-4">
              {f.q}
              <span className="text-neutral-500 group-open:hidden">+</span>
              <span className="hidden text-neutral-500 group-open:inline">
                −
              </span>
            </span>
          </summary>
          <p className="mt-3 text-neutral-400">{f.a}</p>
        </details>
      ))}
    </div>
  </Section>
);

const FinalCTA: React.FC<{ onCTAClick: () => void }> = ({ onCTAClick }) => (
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

const Footer: React.FC = () => (
  <footer className="border-t border-neutral-900/50 py-10">
    <Container>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-sm">
        {[
          {
            h: "Product",
            i: ["Photo Menu", "Digital Menu", "Themes", "QR Codes"],
          },
          {
            h: "Solutions",
            i: ["Single Outlet", "Chain & Food Court", "Cafés & QSR", "Hotels"],
          },
          { h: "Resources", i: ["Demo", "Docs", "Templates", "Case Studies"] },
          { h: "Company", i: ["About", "Careers", "Contact", "Legal"] },
        ].map((c, i) => (
          <div key={i}>
            <div className="mb-3 font-medium text-neutral-200">{c.h}</div>
            <ul className="space-y-2 text-neutral-400">
              {c.i.map((s, j) => (
                <li key={j}>
                  <a href="#" className="hover:text-neutral-200">
                    {s}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
        <div>© {new Date().getFullYear()} Qrunchy</div>
        <div className="flex items-center gap-4">
          <a href="#" className="hover:text-neutral-300">
            Privacy
          </a>
          <a href="#" className="hover:text-neutral-300">
            Terms
          </a>
        </div>
      </div>
    </Container>
  </footer>
);

// -------------------------------
// Main Page
// -------------------------------
export default function LandingPageTest() {
  const [restaurantName, setRestaurantName] = useState("");

  const onCTAClick = () => {
    // Navigate to photo menu creation as the primary CTA
    window.location.href = "/photo-menu";
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-300">
      <Navbar onCTAClick={onCTAClick} />
      <Hero
        restaurantName={restaurantName}
        setRestaurantName={setRestaurantName}
        onCTAClick={onCTAClick}
      />
      <Workflows />
      <QRDistribution />
      <Themes />
      <ImageManager />
      <ChainControl />
      <AuthRoles />
      <StructuredPower />
      <SocialProof />
      <Pricing />
      <FAQ />
      <FinalCTA onCTAClick={onCTAClick} />
      <Footer />

      {/* Mobile sticky CTA */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-neutral-800/60 bg-neutral-950/95 backdrop-blur-lg lg:hidden">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <div className="text-sm text-neutral-300 font-medium">
            Ready to publish?
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => (window.location.href = "/photo-menu")}
              className="rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-black hover:bg-neutral-100 transition-colors"
            >
              Photo Menu
            </button>
            <button
              onClick={() => (window.location.href = "/digital-menu")}
              className="rounded-xl border border-neutral-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-neutral-800 transition-colors"
            >
              Digital
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
