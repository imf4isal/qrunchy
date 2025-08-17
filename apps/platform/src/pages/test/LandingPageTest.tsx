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
import { RestaurantChainAndFoodCourtExperience } from "./landing-page-components";

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
        className={`bg-neutral-200 animate-pulse rounded-lg border border-neutral-700/50 flex items-center justify-center ${className}`}
        style={{ width: size, height: size }}
      >
        <div className="text-neutral-600 text-xs">
          <QrCode className="h-6 w-6 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <img
      src={qrDataURL}
      alt={`QR code for ${text}`}
      width={size}
      height={size}
      className={`${className} animate-in fade-in duration-300`}
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
  children?: React.ReactNode;
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
      {/* Shell as column; content is clipped (no scrollbar) */}
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

        {/* Content (no scrolling) */}
        <div className="flex-1 min-h-0 overflow-hidden p-4 space-y-3">
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
          <a
            href="/how-it-works"
            className="hover:text-white transition-colors cursor-pointer"
          >
            How It Works
          </a>
          <button
            onClick={() => scrollToSection("faq")}
            className="hover:text-white transition-colors cursor-pointer"
          >
            FAQ
          </button>
          <a
            href="/contact"
            className="hover:text-white transition-colors cursor-pointer"
          >
            Contact
          </a>
        </nav>
        <div className="flex items-center gap-3">
          <button
            onClick={handleSignIn}
            className="hidden sm:inline-flex rounded-full border border-neutral-700 px-5 py-2.5 text-sm text-neutral-300 hover:bg-neutral-800 hover:text-white hover:border-neutral-600 transition-all duration-200 active:scale-95"
          >
            Sign in
          </button>
          <button
            onClick={onCTAClick}
            className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-black hover:bg-neutral-100 hover:shadow-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
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

const Workflows: React.FC = () => {
  const [tab, setTab] = useState<"photo" | "digital">("photo");
  const [progress, setProgress] = useState(0);
  const [activeStep, setActiveStep] = useState(0); // 0: Upload, 1: Arrange, 2: Publish (carousel)
  const [zoom, setZoom] = useState(100); // step 3 only
  const [slide, setSlide] = useState(0); // step 3 only

  // Digital menu state
  const [categories, setCategories] = useState<
    Array<{
      id: string;
      name: string;
      items: Array<{
        id: string;
        name: string;
        price: string;
        description: string;
      }>;
    }>
  >([]);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null
  );
  const [newItem, setNewItem] = useState({
    name: "",
    price: "",
    description: "",
  });
  const [digitalMenuActiveCategory, setDigitalMenuActiveCategory] = useState(0);

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
    // Reset digital menu state
    setCategories([]);
    setNewCategoryName("");
    setSelectedCategoryId(null);
    setNewItem({ name: "", price: "", description: "" });
    setDigitalMenuActiveCategory(0);
  };

  const totalSlides = 5;
  const prevSlide = () => setSlide((s) => (s - 1 + totalSlides) % totalSlides);
  const nextSlide = () => setSlide((s) => (s + 1) % totalSlides);

  // Digital menu helper functions
  const addCategory = () => {
    if (newCategoryName.trim()) {
      const newCategory = {
        id: Date.now().toString(),
        name: newCategoryName.trim(),
        items: [],
      };
      setCategories((prev) => [...prev, newCategory]);
      setNewCategoryName("");
      setSelectedCategoryId(newCategory.id);
    }
  };

  const addItemToCategory = () => {
    if (selectedCategoryId && newItem.name.trim() && newItem.price.trim()) {
      const item = {
        id: Date.now().toString(),
        name: newItem.name.trim(),
        price: newItem.price.trim(),
        description: newItem.description.trim(),
      };
      setCategories((prev) =>
        prev.map((cat) =>
          cat.id === selectedCategoryId
            ? { ...cat, items: [...cat.items, item] }
            : cat
        )
      );
      setNewItem({ name: "", price: "", description: "" });
    }
  };

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
            className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm transition-all duration-200 active:scale-95 ${
              tab === t.key
                ? "bg-white text-black shadow-sm"
                : "text-neutral-300 hover:bg-neutral-900 hover:text-neutral-200"
            }`}
          >
            {t.icon}
            {t.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 items-start gap-8">
        {/* Phone preview (renders step content INSIDE for Photo & Digital) */}
        <div className="w-fit mx-auto md:mx-0 md:ml-8">
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
            {tab === "digital" && (
              <>
                {/* STEP 1: Add Category */}
                {activeStep === 0 && (
                  <div className="space-y-3">
                    <div className="rounded-lg border border-neutral-800 bg-neutral-950 p-4">
                      <div className="mb-3 text-[11px] text-neutral-400 uppercase tracking-widest">
                        Create Category
                      </div>
                      <input
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                        placeholder="e.g., Appetizers"
                        className="w-full rounded-md border border-neutral-800 bg-neutral-900 px-3 py-2 text-[13px] text-neutral-200 placeholder:text-neutral-600 focus:border-neutral-600 focus:outline-none focus:ring-2 focus:ring-neutral-600/20 transition-all duration-200 hover:border-neutral-700"
                        onKeyPress={(e) => e.key === "Enter" && addCategory()}
                      />
                      <button
                        onClick={addCategory}
                        disabled={!newCategoryName.trim()}
                        className="mt-2 w-full rounded-md bg-white px-3 py-2 text-[12px] font-medium text-black disabled:opacity-50 transition-all duration-200 hover:bg-neutral-100 hover:shadow-sm active:scale-[0.98] disabled:hover:bg-white disabled:hover:shadow-none disabled:active:scale-100"
                      >
                        Add Category
                      </button>
                    </div>

                    {/* Categories list */}
                    <div className="space-y-2">
                      {categories.map((cat, i) => (
                        <div
                          key={cat.id}
                          className="flex items-center justify-between rounded-md border border-neutral-800 bg-neutral-950 px-3 py-2 transition-all duration-200 hover:bg-neutral-900 hover:border-neutral-700"
                        >
                          <span className="text-[12px] text-neutral-200">
                            {cat.name}
                          </span>
                          <span className="text-[10px] text-neutral-500">
                            {cat.items.length} items
                          </span>
                        </div>
                      ))}
                      {categories.length === 0 && (
                        <div className="text-center py-6 text-[11px] text-neutral-500">
                          Add categories to organize your menu
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* STEP 2: Add Item */}
                {activeStep === 1 && (
                  <div className="space-y-3">
                    {categories.length > 0 ? (
                      <>
                        <div className="rounded-lg border border-neutral-800 bg-neutral-950 p-4">
                          <div className="mb-3 text-[11px] text-neutral-400 uppercase tracking-widest">
                            Add Menu Item
                          </div>

                          {/* Category selector */}
                          <select
                            value={selectedCategoryId || ""}
                            onChange={(e) =>
                              setSelectedCategoryId(e.target.value)
                            }
                            className="w-full mb-2 rounded-md border border-neutral-800 bg-neutral-900 px-3 py-2 text-[12px] text-neutral-200 focus:border-neutral-600 focus:outline-none focus:ring-2 focus:ring-neutral-600/20 transition-all duration-200 hover:border-neutral-700"
                          >
                            <option value="">Select category</option>
                            {categories.map((cat) => (
                              <option key={cat.id} value={cat.id}>
                                {cat.name}
                              </option>
                            ))}
                          </select>

                          {/* Item form */}
                          <input
                            value={newItem.name}
                            onChange={(e) =>
                              setNewItem((prev) => ({
                                ...prev,
                                name: e.target.value,
                              }))
                            }
                            placeholder="Item name"
                            className="w-full mb-2 rounded-md border border-neutral-800 bg-neutral-900 px-3 py-2 text-[12px] text-neutral-200 placeholder:text-neutral-600 focus:border-neutral-600 focus:outline-none focus:ring-2 focus:ring-neutral-600/20 transition-all duration-200 hover:border-neutral-700"
                          />
                          <input
                            value={newItem.price}
                            onChange={(e) =>
                              setNewItem((prev) => ({
                                ...prev,
                                price: e.target.value,
                              }))
                            }
                            placeholder="Price (e.g., $12.99)"
                            className="w-full mb-2 rounded-md border border-neutral-800 bg-neutral-900 px-3 py-2 text-[12px] text-neutral-200 placeholder:text-neutral-600 focus:border-neutral-600 focus:outline-none focus:ring-2 focus:ring-neutral-600/20 transition-all duration-200 hover:border-neutral-700"
                          />
                          <textarea
                            value={newItem.description}
                            onChange={(e) =>
                              setNewItem((prev) => ({
                                ...prev,
                                description: e.target.value,
                              }))
                            }
                            placeholder="Description (optional)"
                            rows={2}
                            className="w-full mb-2 resize-none rounded-md border border-neutral-800 bg-neutral-900 px-3 py-2 text-[12px] text-neutral-200 placeholder:text-neutral-600 focus:border-neutral-600 focus:outline-none focus:ring-2 focus:ring-neutral-600/20 transition-all duration-200 hover:border-neutral-700"
                          />
                          <button
                            onClick={addItemToCategory}
                            disabled={
                              !selectedCategoryId ||
                              !newItem.name.trim() ||
                              !newItem.price.trim()
                            }
                            className="w-full rounded-md bg-white px-3 py-2 text-[12px] font-medium text-black disabled:opacity-50 transition-all duration-200 hover:bg-neutral-100 hover:shadow-sm active:scale-[0.98] disabled:hover:bg-white disabled:hover:shadow-none disabled:active:scale-100"
                          >
                            Add Item
                          </button>
                        </div>

                        {/* Preview categories with items */}
                        <div className="space-y-2 max-h-32 overflow-y-auto">
                          {categories.map((cat) => (
                            <div
                              key={cat.id}
                              className="rounded-md border border-neutral-800 bg-neutral-950"
                            >
                              <div className="px-3 py-2 text-[11px] font-medium text-neutral-200 border-b border-neutral-800">
                                {cat.name}
                              </div>
                              {cat.items.length > 0 ? (
                                <div className="p-2 space-y-1">
                                  {cat.items.map((item) => (
                                    <div
                                      key={item.id}
                                      className="flex justify-between items-start"
                                    >
                                      <div className="flex-1 min-w-0">
                                        <div className="text-[10px] text-neutral-200 truncate">
                                          {item.name}
                                        </div>
                                        {item.description && (
                                          <div className="text-[9px] text-neutral-500 truncate">
                                            {item.description}
                                          </div>
                                        )}
                                      </div>
                                      <div className="text-[10px] text-neutral-300 ml-2">
                                        {item.price}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <div className="p-2 text-[10px] text-neutral-500">
                                  No items yet
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </>
                    ) : (
                      <div className="text-center py-8 text-[11px] text-neutral-500">
                        Add categories first before adding items
                      </div>
                    )}
                  </div>
                )}

                {/* STEP 3: Menu Preview */}
                {activeStep === 2 && (
                  <div className="space-y-2">
                    {categories.length > 0 ? (
                      <>
                        {/* Category tabs */}
                        <div className="flex gap-1 overflow-x-auto pb-1">
                          {categories.map((cat, i) => (
                            <button
                              key={cat.id}
                              onClick={() => setDigitalMenuActiveCategory(i)}
                              className={`shrink-0 rounded-full px-3 py-1 text-[10px] transition-all duration-200 active:scale-95 ${
                                digitalMenuActiveCategory === i
                                  ? "bg-white text-black shadow-sm"
                                  : "bg-neutral-800 text-neutral-300 hover:bg-neutral-700 hover:text-neutral-200"
                              }`}
                            >
                              {cat.name}
                            </button>
                          ))}
                        </div>

                        {/* Active category content */}
                        <div className="rounded-lg border border-neutral-800 bg-neutral-950 min-h-48">
                          {categories[digitalMenuActiveCategory] && (
                            <div className="p-3">
                              <div className="mb-3 text-[12px] font-medium text-neutral-200">
                                {categories[digitalMenuActiveCategory].name}
                              </div>
                              <div className="space-y-2">
                                {categories[
                                  digitalMenuActiveCategory
                                ].items.map((item) => (
                                  <div
                                    key={item.id}
                                    className="flex items-start gap-3 p-2 rounded-md bg-neutral-900/50"
                                  >
                                    <div className="h-8 w-8 rounded bg-neutral-800"></div>
                                    <div className="flex-1 min-w-0">
                                      <div className="text-[11px] font-medium text-neutral-200">
                                        {item.name}
                                      </div>
                                      {item.description && (
                                        <div className="text-[9px] text-neutral-400 mt-0.5">
                                          {item.description}
                                        </div>
                                      )}
                                    </div>
                                    <div className="text-[10px] font-medium text-neutral-200">
                                      {item.price}
                                    </div>
                                  </div>
                                ))}
                                {categories[digitalMenuActiveCategory].items
                                  .length === 0 && (
                                  <div className="text-center py-4 text-[10px] text-neutral-500">
                                    No items in this category
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </>
                    ) : (
                      <div className="text-center py-8 text-[11px] text-neutral-500">
                        Create categories and add items to see preview
                      </div>
                    )}
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
              Inline demo {tab === "photo" ? "(Photo)" : "(Digital)"}
            </div>
            <h3 className="mt-1 text-xl font-semibold text-neutral-100">
              {tab === "photo"
                ? "Upload → Arrange → Publish"
                : "Category → Items → Publish"}
            </h3>

            <div className="mt-4 space-y-3">
              {steps.map((s, i) => {
                const done = progress > i;
                const active = activeStep === i;
                return (
                  <button
                    key={i}
                    onClick={() => handleStepClick(i)}
                    className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 transition-all duration-200 active:scale-[0.98] ${
                      active
                        ? "border-neutral-700 bg-neutral-900 ring-1 ring-neutral-700/60 shadow-sm"
                        : done
                          ? "border-neutral-700 bg-neutral-900 hover:bg-neutral-800"
                          : "border-neutral-900 hover:bg-neutral-950 hover:border-neutral-800"
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
                  className="rounded-full bg-white px-4 py-2 text-sm font-medium text-black disabled:opacity-60 transition-all duration-200 hover:bg-neutral-100 hover:shadow-sm active:scale-95 disabled:hover:bg-white disabled:hover:shadow-none disabled:active:scale-100"
                  disabled={progress < steps.length}
                >
                  Publish
                </button>
                <button
                  onClick={resetFlow}
                  className="rounded-full border border-neutral-800 px-4 py-2 text-sm text-neutral-300 hover:bg-neutral-900 hover:text-neutral-200 hover:border-neutral-700 transition-all duration-200 active:scale-95"
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
              "“Sold out” with one tap",
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

const FAQ: React.FC = () => {
  const [openItems, setOpenItems] = useState<Record<number, boolean>>({});

  const toggleItem = (index: number) => {
    setOpenItems(prev => ({
      ...prev,
      [index]: !prev[index]
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
                  <div className="pt-3 text-neutral-400">
                    {f.a}
                  </div>
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
                    <div className="pt-3 text-neutral-400">
                      {f.a}
                    </div>
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
  <footer className="border-t border-neutral-900/50 py-8">
    <Container>
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm">
        <div className="flex items-center gap-3">
          <div className="relative h-6 w-6 rounded-md bg-gradient-to-br from-white to-neutral-300 flex items-center justify-center shadow-sm">
            <QrCode className="h-3 w-3 text-neutral-900" />
          </div>
          <span className="font-semibold text-neutral-200">Qrunchy</span>
          <span className="text-neutral-500">
            © {new Date().getFullYear()}
          </span>
        </div>
        <div className="flex items-center gap-6 text-neutral-400">
          <a href="#" className="hover:text-neutral-200 transition-colors">
            Privacy
          </a>
          <a href="#" className="hover:text-neutral-200 transition-colors">
            Terms
          </a>
          <a href="#" className="hover:text-neutral-200 transition-colors">
            Contact
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
      <RestaurantChainAndFoodCourtExperience />
      <StructuredPower />
      <SocialProof />

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
              className="rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-black hover:bg-neutral-100 hover:shadow-sm transition-all duration-200 active:scale-95"
            >
              Photo Menu
            </button>
            <button
              onClick={() => (window.location.href = "/digital-menu")}
              className="rounded-xl border border-neutral-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-neutral-800 hover:border-neutral-500 transition-all duration-200 active:scale-95"
            >
              Digital
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
