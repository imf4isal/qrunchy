import React, { useMemo, useState, useRef } from "react";
import { motion } from "framer-motion";
import {
  QrCode,
  Upload,
  Image as ImageIcon,
  Layers,
  Building2,
  Lock,
  Sparkles,
  Check,
  X,
  Smartphone,
  Tags,
  Download,
  ArrowRight,
} from "lucide-react";

// -------------------------------
// Helpers: Pseudo QR (SVG grid)
// -------------------------------
function mulberry32(a: number) {
  return function () {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function stringToSeed(str: string) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++)
    h = Math.imul(h ^ str.charCodeAt(i), 16777619);
  return h >>> 0;
}

const QRPseudo: React.FC<{
  text: string;
  size?: number;
  cell?: number;
  className?: string;
}> = ({ text, size = 210, cell = 10, className }) => {
  const dim = 21; // 21x21 grid (like QR v1 size)
  const seed = stringToSeed(text || "qrunchy-demo");
  const rnd = mulberry32(seed);
  const cells: boolean[] = useMemo(
    () => Array.from({ length: dim * dim }, () => rnd() > 0.56),
    [text]
  );

  // Reserve finder patterns (top-left, top-right, bottom-left)
  function inFinder(x: number, y: number) {
    const inBox = (bx: number, by: number) =>
      x >= bx && x < bx + 7 && y >= by && y < by + 7;
    const ring = (bx: number, by: number) =>
      (x === bx || x === bx + 6 || y === by || y === by + 6) && inBox(bx, by);
    const dot = (bx: number, by: number) =>
      x >= bx + 2 && x <= bx + 4 && y >= by + 2 && y <= by + 4;
    if (inBox(0, 0)) return ring(0, 0) || dot(0, 0);
    if (inBox(dim - 7, 0)) return ring(dim - 7, 0) || dot(dim - 7, 0);
    if (inBox(0, dim - 7)) return ring(0, dim - 7) || dot(0, dim - 7);
    return false;
  }

  const stroke = 0; // crisp
  const view = dim * cell;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${view} ${view}`}
      className={className}
      aria-label="Pseudo QR code"
      role="img"
    >
      <rect x={0} y={0} width={view} height={view} fill="#fff" />
      {Array.from({ length: dim }).map((_, y) =>
        Array.from({ length: dim }).map((_, x) => {
          const i = y * dim + x;
          const on = inFinder(x, y) || cells[i];
          return on ? (
            <rect
              key={`${x}-${y}`}
              x={x * cell}
              y={y * cell}
              width={cell - stroke}
              height={cell - stroke}
              fill="#000"
            />
          ) : null;
        })
      )}
    </svg>
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
}> = ({ theme, mode }) => {
  return (
    <div className="relative mx-auto h-[520px] w-[260px] rounded-[36px] border border-neutral-800 bg-neutral-900 p-4 shadow-2xl">
      <div className="absolute inset-x-12 -top-2 h-6 rounded-full bg-neutral-800" />
      <div className="h-full overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-950">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-800">
          <div className="h-4 w-20 rounded bg-neutral-800" />
          <div className="h-6 w-6 rounded bg-neutral-800" />
        </div>
        {/* Content */}
        <div className="p-4 space-y-3">
          {mode === "photo" ? (
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
                          <div className="h-4 w-32 rounded bg-neutral-800 mb-2" />
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
  return (
    <div className="sticky top-0 z-50 backdrop-blur supports-[backdrop-filter]:bg-neutral-950/60 border-b border-neutral-900/50">
      <Container className="flex h-14 items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-6 w-6 rounded bg-neutral-200" />
          <span className="text-sm font-semibold tracking-wide text-neutral-200">
            Qrunchy
          </span>
        </div>
        <nav className="hidden md:flex items-center gap-6 text-sm text-neutral-400">
          <a href="#workflows" className="hover:text-neutral-200">
            Product
          </a>
          <a href="#chain" className="hover:text-neutral-200">
            Solutions
          </a>
          <a href="#pricing" className="hover:text-neutral-200">
            Pricing
          </a>
          <a href="#faq" className="hover:text-neutral-200">
            FAQ
          </a>
        </nav>
        <div className="flex items-center gap-3">
          <button className="hidden sm:inline-flex rounded-full border border-neutral-800 px-4 py-2 text-sm text-neutral-300 hover:bg-neutral-900">
            Sign in
          </button>
          <button
            onClick={onCTAClick}
            className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-black hover:bg-neutral-200"
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
  const short = useMemo(
    () =>
      restaurantName.trim()
        ? restaurantName.trim().toLowerCase().replace(/\s+/g, "-")
        : "demo-restaurant",
    [restaurantName]
  );
  const demoUrl = `qrunchy.app/${short}`;

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
      {/* --- Tiny animated glows (background only) --- */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 hidden md:block overflow-hidden"
      >
        {/* Orb A – near the phone area */}
        <motion.div
          className="absolute h-36 w-36 rounded-full"
          style={{
            background:
              "radial-gradient(closest-side, rgba(255,255,255,0.10), rgba(255,255,255,0))",
            filter: "blur(14px)",
          }}
          initial={{ x: 120, y: 40, opacity: 0.8, scale: 1 }}
          animate={
            prefersReducedMotion
              ? { opacity: 0.12 }
              : {
                  x: [120, 170, 90, 120],
                  y: [40, 10, 70, 40],
                  scale: [1, 1.06, 0.98, 1],
                  opacity: [0.12, 0.16, 0.1, 0.12],
                }
          }
          transition={{
            duration: 22,
            ease: "easeInOut",
            repeat: Infinity,
            repeatType: "mirror",
          }}
        />

        {/* Orb B – smaller, counter-moving near top-left of copy */}
        <motion.div
          className="absolute h-20 w-20 rounded-full"
          style={{
            background:
              "radial-gradient(closest-side, rgba(255,255,255,0.08), rgba(255,255,255,0))",
            filter: "blur(10px)",
          }}
          initial={{ x: 40, y: 80, opacity: 0.7, scale: 1 }}
          animate={
            prefersReducedMotion
              ? { opacity: 0.1 }
              : {
                  x: [40, -10, 20, 40],
                  y: [80, 40, 100, 80],
                  scale: [1, 0.96, 1.04, 1],
                  opacity: [0.08, 0.12, 0.07, 0.08],
                }
          }
          transition={{
            duration: 26,
            ease: "easeInOut",
            repeat: Infinity,
            repeatType: "mirror",
          }}
        />
      </div>
      {/* --- /glows --- */}

      <Container className="pt-16 pb-10 sm:pt-24 sm:pb-16">
        <div className="grid items-center gap-y-12 gap-x-16 md:grid-cols-2">
          {/* LEFT */}
          <div className="mx-auto w-full max-w-[42rem]">
            <motion.h1
              id="hero-title"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="
                font-semibold tracking-tight
                text-4xl sm:text-5xl md:text-6xl
                leading-[1.05]
                bg-gradient-to-b from-neutral-50 to-neutral-300 bg-clip-text text-transparent
                [text-wrap:balance]
              "
              style={{ fontOpticalSizing: "auto" }}
            >
              Your menu, one scan away.
            </motion.h1>

            <p className="mt-4 text-[15.5px] sm:text-[16px] leading-7 text-neutral-400 [text-wrap:pretty]">
              Replace paper menus with delightful QR experiences. Photo or
              digital—publish in minutes and update anytime.
            </p>

            <div className="mt-6 flex flex-col sm:flex-row sm:items-center gap-3">
              <button
                onClick={onCTAClick}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-medium text-black hover:bg-neutral-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
              >
                Create a menu
              </button>
              <a
                href="#live-demo"
                aria-label="Scan the live demo QR code"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-neutral-800 px-5 py-3 text-sm text-neutral-200 hover:bg-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400"
              >
                <QrCode className="h-4 w-4" /> Scan live demo
              </a>
            </div>

            <ul role="list" className="mt-7 flex flex-wrap gap-2">
              {["<1 min to publish", "Unlimited updates", "Chain-ready"].map(
                (t, i) => (
                  <li key={i}>
                    <span className="inline-flex items-center gap-2 rounded-full bg-neutral-900/80 px-3 py-1 text-[11.5px] tracking-tight text-neutral-200 ring-1 ring-inset ring-neutral-800">
                      {t}
                    </span>
                  </li>
                )
              )}
            </ul>

            <div className="mt-8 border-t border-neutral-900/70 pt-5">
              <div className="mb-3 text-[11px] uppercase tracking-[0.18em] text-neutral-500">
                Trusted by
              </div>
              <ul role="list" className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {logos.slice(0, 3).map((l, i) => (
                  <li key={i}>
                    <div className="rounded-lg border border-neutral-900 bg-neutral-950 px-3 py-2 text-[12.5px] text-neutral-500 grayscale-[60%] tracking-tight">
                      {l}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* RIGHT */}
          <div className="relative mx-auto flex w-full max-w-md items-center justify-center md:mx-0 md:justify-end">
            <div className="relative">
              <div aria-hidden="true">
                <PhonePreview theme="dark" mode="digital" />
              </div>

              <div
                id="live-demo"
                className="absolute -bottom-6 left-1/2 w-[320px] max-w-[88vw] -translate-x-1/2 rounded-2xl border border-neutral-800 bg-neutral-950 p-4 shadow-2xl"
              >
                <div className="flex items-center gap-3">
                  <QRPseudo text={demoUrl} size={80} className="shrink-0" />
                  <div className="min-w-0 flex-1">
                    <div className="text-[10.5px] uppercase tracking-[0.22em] text-neutral-500">
                      Live QR
                    </div>
                    <div className="font-medium text-neutral-100 truncate font-mono text-[13px] tracking-tight">
                      {demoUrl}
                    </div>
                    <div className="mt-2 flex gap-2">
                      <input
                        aria-label="Restaurant name"
                        autoComplete="organization"
                        value={restaurantName}
                        onChange={(e) => setRestaurantName(e.target.value)}
                        placeholder="Type your restaurant name"
                        className="w-full rounded-md border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm text-neutral-200 placeholder:text-neutral-600 focus:outline-none focus:ring-1 focus:ring-neutral-600"
                      />
                    </div>
                  </div>
                </div>
              </div>

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

  const steps =
    tab === "photo"
      ? ["Upload images", "Arrange", "Publish"]
      : ["Add category", "Add item", "Publish"];

  return (
    <Section
      id="workflows"
      title="Pick your flow: Photo or Digital"
      subtitle="Let your team self-select the simplest path. Inline demos require no account."
    >
      <div className="flex items-center gap-2 rounded-full border border-neutral-800 p-1 w-fit mb-8">
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
              setProgress(0);
            }}
            className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm ${tab === t.key ? "bg-white text-black" : "text-neutral-300 hover:bg-neutral-900"}`}
          >
            {t.icon}
            {t.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        <div>
          <PhonePreview theme="dark" mode={tab} />
        </div>
        <div>
          <div className="rounded-2xl border border-neutral-800 p-6">
            <div className="text-sm text-neutral-400">Inline demo</div>
            <h3 className="mt-1 text-xl font-semibold text-neutral-100">
              {tab === "photo"
                ? "Upload → Arrange → Publish"
                : "Structure → Preview → Publish"}
            </h3>
            <div className="mt-4 space-y-3">
              {steps.map((s, i) => (
                <button
                  key={i}
                  onClick={() => setProgress((p) => Math.max(p, i + 1))}
                  className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 ${progress > i ? "border-neutral-700 bg-neutral-900" : "border-neutral-900 hover:bg-neutral-950"}`}
                >
                  <span className="flex items-center gap-3 text-neutral-200">
                    {progress > i ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <span className="h-4 w-4 rounded-full border border-neutral-700" />
                    )}
                    {s}
                  </span>
                  <span className="text-xs text-neutral-500">
                    Click to complete
                  </span>
                </button>
              ))}
            </div>
            <div className="mt-5">
              <div className="mb-2 flex items-center justify-between text-xs text-neutral-400">
                <span>Publish in 60 seconds</span>
                <span>{Math.round((progress / steps.length) * 100)}%</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-neutral-900">
                <div
                  className="h-full bg-white"
                  style={{ width: `${(progress / steps.length) * 100}%` }}
                />
              </div>
              <div className="mt-4 flex gap-2">
                <button
                  className="rounded-full bg-white px-4 py-2 text-sm font-medium text-black disabled:opacity-60"
                  disabled={progress < steps.length}
                >
                  Publish
                </button>
                <button className="rounded-full border border-neutral-800 px-4 py-2 text-sm text-neutral-300 hover:bg-neutral-900">
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
              {/* Clone QRPseudo to capture ref */}
              <QRPseudo text={value} size={140} className="" />
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
    alert("Pretend signup modal → Create a menu");
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
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-neutral-900/60 bg-neutral-950/80 backdrop-blur md:hidden">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <div className="text-sm text-neutral-400">Ready to publish?</div>
          <button
            onClick={onCTAClick}
            className="rounded-full bg-white px-4 py-2 text-sm font-medium text-black"
          >
            Create a menu
          </button>
        </div>
      </div>
    </div>
  );
}
