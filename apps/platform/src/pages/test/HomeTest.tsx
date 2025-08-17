import { Button } from "@/components/ui/button";
import MainLayout from "@/components/layout/MainLayout";
import { useState } from "react";

export default function HomeTest() {
  const [restaurantName, setRestaurantName] = useState("");
  const [activeTab, setActiveTab] = useState<"photo" | "digital">("photo");

  return (
    <MainLayout>
      {/* Above-the-Fold Hero */}
      <div className="relative overflow-hidden bg-white min-h-screen">
        {/* Minimal background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-32 w-96 h-96 bg-black/2 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 -left-32 w-80 h-80 bg-black/1 rounded-full blur-3xl"></div>
        </div>

        <div className="relative container mx-auto px-6 py-20 flex flex-col items-center justify-center min-h-screen text-center">
          {/* Social proof bar */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-black/5 border border-black/10 rounded-full text-sm font-medium text-black/70 mb-8">
            <div className="w-2 h-2 bg-black/40 rounded-full animate-pulse"></div>
            Trusted by 1000+ restaurants
          </div>

          {/* H1: Main Promise */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-light tracking-tight text-black mb-6 max-w-5xl">
            Your menu,
            <span className="block font-medium text-black">
              one scan away.
            </span>
          </h1>

          {/* Outcome subhead */}
          <p className="text-xl md:text-2xl text-black/60 max-w-3xl mx-auto mb-12 font-light leading-relaxed">
            Launch a QR-based digital menu in minutes—no devs, no hassle.
            <span className="block mt-2 text-lg text-black/50">
              Photo or digital—both in minutes.
            </span>
          </p>

          {/* Interactive QR Generator */}
          <div className="mb-12 max-w-md mx-auto">
            <div className="bg-white border border-black/10 rounded-xl p-6 shadow-sm">
              <label className="block text-sm font-medium text-black/70 mb-2">
                Try it now: Enter your restaurant name
              </label>
              <input
                type="text"
                value={restaurantName}
                onChange={(e) => setRestaurantName(e.target.value)}
                placeholder="e.g. Bella Vista"
                className="w-full px-3 py-2 border border-black/20 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black/30"
              />
              {restaurantName && (
                <div className="mt-4 flex items-center gap-4">
                  <div className="w-16 h-16 bg-black text-white flex items-center justify-center rounded-lg text-xs font-mono">
                    QR
                  </div>
                  <div className="text-left text-sm">
                    <div className="font-medium text-black/80">{restaurantName} Menu</div>
                    <div className="text-black/50">qrunchy.menu/{restaurantName.toLowerCase().replace(/\s+/g, '-')}</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mb-16">
            <Button
              className="bg-black hover:bg-black/90 text-white px-8 py-4 text-lg font-medium rounded-xl transition-all duration-150 hover:scale-[1.02]"
              size="lg"
            >
              Create a menu
            </Button>

            <Button
              variant="outline"
              className="border-black/20 hover:border-black/30 hover:bg-black/5 text-black px-8 py-4 text-lg font-medium rounded-xl transition-all duration-150 hover:scale-[1.02]"
              size="lg"
            >
              Scan live demo
            </Button>
          </div>

          {/* Quick benefits */}
          <div className="flex flex-col sm:flex-row items-center gap-6 text-sm text-black/60">
            <div className="flex items-center gap-2">
              <div className="w-1 h-1 bg-black/40 rounded-full"></div>
              &lt;1 min to publish
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1 h-1 bg-black/40 rounded-full"></div>
              Unlimited updates
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1 h-1 bg-black/40 rounded-full"></div>
              Chain-ready
            </div>
          </div>
        </div>
      </div>

      {/* Two Workflows Toggle */}
      <div className="py-24 bg-black/2">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-light text-black mb-4">
              Photo menu or structured digital—launch in minutes.
            </h2>
            <div className="w-24 h-px bg-black/20 mx-auto"></div>
          </div>

          {/* Tab Toggle */}
          <div className="flex justify-center mb-12">
            <div className="bg-white border border-black/10 rounded-lg p-1 inline-flex">
              <button
                onClick={() => setActiveTab("photo")}
                className={`px-6 py-2 rounded-md text-sm font-medium transition-all duration-150 ${
                  activeTab === "photo"
                    ? "bg-black text-white"
                    : "text-black/60 hover:text-black"
                }`}
              >
                Photo Menu
              </button>
              <button
                onClick={() => setActiveTab("digital")}
                className={`px-6 py-2 rounded-md text-sm font-medium transition-all duration-150 ${
                  activeTab === "digital"
                    ? "bg-black text-white"
                    : "text-black/60 hover:text-black"
                }`}
              >
                Digital Menu
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <div className="max-w-4xl mx-auto">
            {activeTab === "photo" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div>
                  <h3 className="text-2xl font-medium text-black mb-4">
                    Upload images → Arrange → Publish.
                  </h3>
                  <ul className="space-y-3 text-black/70 mb-6">
                    <li className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 bg-black/40 rounded-full"></div>
                      Drag & drop images
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 bg-black/40 rounded-full"></div>
                      Auto-compress & CDN
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 bg-black/40 rounded-full"></div>
                      Instant QR
                    </li>
                  </ul>
                  <Button
                    variant="outline"
                    className="border-black/20 hover:border-black/30 text-black"
                  >
                    Try Photo Menu
                  </Button>
                </div>
                <div className="bg-white border border-black/10 rounded-xl p-6 shadow-sm">
                  <div className="aspect-[9/16] bg-black/5 rounded-lg flex items-center justify-center">
                    <span className="text-black/40 text-sm">Photo Menu Preview</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div>
                  <h3 className="text-2xl font-medium text-black mb-4">
                    Categories → Items → Variants/Add-ons.
                  </h3>
                  <ul className="space-y-3 text-black/70 mb-6">
                    <li className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 bg-black/40 rounded-full"></div>
                      Multi-language
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 bg-black/40 rounded-full"></div>
                      Prices & options
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 bg-black/40 rounded-full"></div>
                      Calories/allergens
                    </li>
                  </ul>
                  <Button
                    variant="outline"
                    className="border-black/20 hover:border-black/30 text-black"
                  >
                    Try Digital Menu
                  </Button>
                </div>
                <div className="bg-white border border-black/10 rounded-xl p-6 shadow-sm">
                  <div className="aspect-[9/16] bg-black/5 rounded-lg flex items-center justify-center">
                    <span className="text-black/40 text-sm">Digital Menu Preview</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* QR & Distribution */}
      <div className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h3 className="text-3xl md:text-4xl font-light text-black mb-4">
              One QR, or a thousand. Instantly.
            </h3>
            <div className="w-24 h-px bg-black/20 mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {[
              { title: "Auto QR per venue/table/zone", icon: "📍" },
              { title: "Short links", icon: "🔗" },
              { title: "Printable templates", icon: "🖨️" },
              { title: "Scan analytics", icon: "📊" },
            ].map((feature, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl mb-4">{feature.icon}</div>
                <p className="text-sm text-black/70">{feature.title}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button
              variant="outline"
              className="border-black/20 hover:border-black/30 text-black"
            >
              Generate QR now
            </Button>
          </div>
        </div>
      </div>

      {/* Chain Management */}
      <div className="py-24 bg-black/2">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h3 className="text-3xl md:text-4xl font-light text-black mb-4">
              Control every branch from one place.
            </h3>
            <div className="w-24 h-px bg-black/20 mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
            <div>
              <ul className="space-y-4 text-black/70">
                <li className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 bg-black/40 rounded-full"></div>
                  Global items
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 bg-black/40 rounded-full"></div>
                  Branch overrides (price/availability)
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 bg-black/40 rounded-full"></div>
                  Roles & permissions
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 bg-black/40 rounded-full"></div>
                  Brand themes per concept/stall
                </li>
              </ul>
            </div>
            <div className="bg-white border border-black/10 rounded-xl p-6 shadow-sm">
              <div className="grid grid-cols-2 gap-3">
                {["Branch A", "Branch B", "Branch C", "Branch D"].map((branch, i) => (
                  <div key={i} className="bg-black/5 rounded-lg p-3 text-center">
                    <div className="text-sm font-medium text-black/80">{branch}</div>
                    <div className="text-xs text-black/60 mt-1">✓ Synced</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <div className="py-24 bg-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-light text-black mb-6">
            Publish your menu today.
          </h2>
          <p className="text-xl text-black/60 mb-10 max-w-2xl mx-auto">
            No credit card needed.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              className="bg-black hover:bg-black/90 text-white px-8 py-4 text-lg font-medium rounded-xl transition-all duration-150"
              size="lg"
            >
              Create a menu
            </Button>
            <Button
              variant="outline"
              className="border-black/20 hover:border-black/30 text-black px-8 py-4 text-lg font-medium rounded-xl transition-all duration-150"
              size="lg"
            >
              Scan live demo
            </Button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}